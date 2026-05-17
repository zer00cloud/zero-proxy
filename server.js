import http from "node:http";
import fs from "node:fs";
import crypto from "node:crypto";
import { FREE_MODELS, AUTO_FALLBACK_CHAIN, MODEL_IDS } from "./models.js";
import { statsTracker } from "./stats.js";
import { apiKeyManager } from "./api-keys.js";
import { disabledModelsManager } from "./disabled-models.js";
import { userTokenManager } from "./user-tokens.js";
import { rateLimiter } from "./rate-limiter.js";
import { instanceManager } from "./instance.js";
import { responsesToCompletions, completionsToResponses, convertStreamChunk, formatSSE } from "./responses-api.js";

// Initialize instance (auto-generates password + ID on first run)
const instanceData = instanceManager.init();

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";
const UPSTREAM = "https://opencode.ai/zen/v1";
const UPSTREAM_KEY = process.env.OPENCODE_API_KEY || ""; // optional; unlocks the full catalog
const UPSTREAM_KEYS = parseKeyList(process.env.OPENCODE_API_KEYS || "");
const PROXY_KEY = process.env.PROXY_KEY || ""; // if set, clients must send matching Bearer
const TUNNEL_URL = process.env.TUNNEL_URL || ""; // Cloudflare tunnel URL if active
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || instanceData.password;
const SHOW_PASSWORD_ON_LOGIN = true; // show password hint on login page
const ALLOW_EXPLICIT_MODEL_FALLBACK = process.env.ALLOW_EXPLICIT_MODEL_FALLBACK === "true";
const UPSTREAM_MAX_CONCURRENCY = Math.max(1, Number(process.env.UPSTREAM_MAX_CONCURRENCY || 4));
const UPSTREAM_QUEUE_SIZE = Math.max(1, Number(process.env.UPSTREAM_QUEUE_SIZE || 100));
let autoChainCursor = 0;
let upstreamKeyCursor = 0;

const upstreamScheduler = createUpstreamScheduler(UPSTREAM_MAX_CONCURRENCY, UPSTREAM_QUEUE_SIZE);

// CSRF token management
const validTokens = new Map(); // Map<token, expiryTime>

// Session management
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours
const sessions = new Map(); // Map<sessionToken, { userId, expiresAt }>

function createSession(userId) {
  const token = crypto.randomUUID();
  sessions.set(token, { userId, expiresAt: Date.now() + SESSION_TTL });
  return token;
}

function getSession(token) {
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() >= session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function destroySession(token) {
  sessions.delete(token);
}

function parseKeyList(value) {
  if (!value) return [];
  return [...new Set(
    String(value)
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean)
  )];
}

function createUpstreamScheduler(maxConcurrency, maxQueueSize) {
  let active = 0;
  const queue = [];

  function releaseNext() {
    if (active >= maxConcurrency || queue.length === 0) return;
    active++;
    const next = queue.shift();
    next();
  }

  async function run(task) {
    await new Promise((resolve, reject) => {
      const start = () => resolve();
      if (active < maxConcurrency) {
        active++;
        start();
        return;
      }
      if (queue.length >= maxQueueSize) {
        reject(new Error("Upstream queue is full"));
        return;
      }
      queue.push(start);
    });

    try {
      return await task();
    } finally {
      active--;
      releaseNext();
    }
  }

  function getStats() {
    return {
      active,
      queued: queue.length,
      max_concurrency: maxConcurrency,
      max_queue_size: maxQueueSize,
    };
  }

  return { run, getStats };
}

// Cleanup expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now >= session.expiresAt) sessions.delete(token);
  }
}, 600000);

// Resolve user from request (X-User-Id header, Bearer token, or session cookie)
function resolveUser(req) {
  // 1. Check X-User-Id header
  const userIdHeader = req.headers["x-user-id"];
  if (userIdHeader && userTokenManager.userExists(userIdHeader)) {
    return userIdHeader;
  }

  // 2. Check Authorization Bearer token (if not the PROXY_KEY)
  const authHeader = req.headers["authorization"] || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    if (token !== PROXY_KEY) {
      const userId = userTokenManager.findUserByToken("opencode", token);
      if (userId) return userId;
    }
  }

  // 3. Check session cookie
  const cookies = parseCookies(req.headers["cookie"] || "");
  if (cookies.session) {
    const session = getSession(cookies.session);
    if (session) return session.userId;
  }

  return null;
}

function parseCookies(cookieHeader) {
  const cookies = {};
  cookieHeader.split(";").forEach(pair => {
    const [key, ...val] = pair.trim().split("=");
    if (key) cookies[key.trim()] = val.join("=").trim();
  });
  return cookies;
}

// Rate limit check — returns null if allowed, or a response object if blocked
function checkRateLimit(userId) {
  if (!userId) return null; // anonymous users bypass (controlled by PROXY_KEY)
  const savedLimit = userTokenManager.getRateLimit(userId);
  if (savedLimit) {
    rateLimiter.setUserLimit(userId, savedLimit);
  }
  if (!rateLimiter.isAllowed(userId)) {
    const retryAfter = rateLimiter.getRetryAfter(userId);
    return {
      status: 429,
      body: {
        error: {
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          type: "rate_limit_error",
          retry_after: retryAfter,
        }
      },
      headers: { "Retry-After": String(retryAfter) },
    };
  }
  return null;
}

// Record request after model is known
function recordUserRequest(userId, model) {
  if (!userId) return;
  rateLimiter.recordRequest(userId, model);
}

function generateCSRFToken() {
  const token = crypto.randomUUID();
  const expiryTime = Date.now() + 3600000; // 1 hour
  validTokens.set(token, expiryTime);
  return token;
}

// Cleanup expired tokens every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, expiryTime] of validTokens.entries()) {
    if (expiryTime < now) {
      validTokens.delete(token);
    }
  }
}, 600000);

function validateCSRF(req) {
  const token = req.headers['x-csrf-token'];
  if (!token) return false;

  const expiryTime = validTokens.get(token);
  if (!expiryTime) return false;

  // Check if token is expired
  if (expiryTime < Date.now()) {
    validTokens.delete(token);
    return false;
  }

  return true;
}

// Check if request is from browser (needs CSRF) or API client (no CSRF needed)
function needsCSRF(req) {
  // If request has Referer or Origin header, it's from browser
  const referer = req.headers['referer'] || req.headers['origin'];
  return !!referer;
}

function log(...a) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}]`, ...a);
}

function logRequest(req, details = {}) {
  log(`📥 ${req.method} ${req.url}`, details);
}

function logResponse(status, details = {}) {
  const emoji = status >= 200 && status < 300 ? '✅' : status >= 400 ? '❌' : '⚠️';
  log(`${emoji} Response ${status}`, details);
}

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function authOk(req) {
  if (!PROXY_KEY) return true;
  const h = req.headers["authorization"] || "";
  return h === `Bearer ${PROXY_KEY}`;
}

function getUserUpstreamToken(userId) {
  if (!userId || !userTokenManager.userExists(userId)) return null;
  return userTokenManager.getToken(userId, "opencode");
}

function getAllowExplicitFallback(payload = {}) {
  return payload.allow_fallback === true || ALLOW_EXPLICIT_MODEL_FALLBACK;
}

function sanitizeUpstreamPayload(payload = {}) {
  const upstreamPayload = { ...payload };
  delete upstreamPayload.allow_fallback;
  return upstreamPayload;
}

function getNextSharedUpstreamKey() {
  const keys = [...UPSTREAM_KEYS];
  if (UPSTREAM_KEY) {
    keys.unshift(UPSTREAM_KEY);
  }
  if (keys.length === 0) return null;
  if (keys.length === 1) return keys[0];
  const selected = keys[upstreamKeyCursor % keys.length];
  upstreamKeyCursor = (upstreamKeyCursor + 1) % keys.length;
  return selected;
}

function rotateModels(models) {
  if (models.length <= 1) return [...models];
  const offset = autoChainCursor % models.length;
  autoChainCursor = (autoChainCursor + 1) % models.length;
  return [...models.slice(offset), ...models.slice(0, offset)];
}

function buildFallbackChain(requested, allowExplicitFallback = false) {
  if (!requested || requested === "auto") {
    return rotateModels(AUTO_FALLBACK_CHAIN);
  }

  if (MODEL_IDS.has(requested) && allowExplicitFallback) {
    const backups = rotateModels(AUTO_FALLBACK_CHAIN.filter((model) => model !== requested));
    return [requested, ...backups];
  }

  return [requested];
}

function getModelBlockState(userId, model) {
  if (disabledModelsManager.isDisabled(model)) {
    return { reason: "disabled", retryAfter: 0 };
  }

  if (userId) {
    const retryAfter = rateLimiter.getModelCooldownRemaining(userId, model);
    if (retryAfter > 0) {
      return { reason: "user-cooldown", retryAfter };
    }
  }

  const globalRetryAfter = rateLimiter.getGlobalCooldownRemaining(model);
  if (globalRetryAfter > 0) {
    return { reason: "global-cooldown", retryAfter: globalRetryAfter };
  }

  return null;
}

function choosePrimaryModel(requested, userId, allowExplicitFallback = false) {
  const chain = buildFallbackChain(requested, allowExplicitFallback);
  for (const model of chain) {
    if (!getModelBlockState(userId, model)) {
      return model;
    }
  }
  return chain[0] || null;
}

function buildUpstreamHeaders(model, userId, extraHeaders = {}) {
  const normalizedHeaders = { ...extraHeaders };
  const providedAuthorization = normalizedHeaders.Authorization || normalizedHeaders.authorization;
  const userApiKey = getUserUpstreamToken(userId);
  const modelApiKey = apiKeyManager.getNextKey(model);
  const sharedUpstreamKey = getNextSharedUpstreamKey();
  const authorization = providedAuthorization
    || (userApiKey ? `Bearer ${userApiKey}` : null)
    || (modelApiKey ? `Bearer ${modelApiKey}` : null)
    || (sharedUpstreamKey ? `Bearer ${sharedUpstreamKey}` : null);

  delete normalizedHeaders.authorization;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...normalizedHeaders,
  };

  if (authorization) {
    headers.Authorization = authorization;
  }

  return headers;
}

function applyModelCooldown(userId, model, scope = "request") {
  if (userId) {
    rateLimiter.setCooldown(userId, model);
  }
  rateLimiter.setGlobalCooldown(model);
  const suffix = userId ? ` user ${userId.substring(0, 8)}...` : "";
  log(`🧊 Cooldown set for ${scope}:${suffix} model=${model}`);
}

// Call upstream once with a given model. Returns { status, headers, body }.
async function callUpstream(path, payload, options = {}) {
  const { userId = null, extraHeaders = {} } = options;
  const upstreamPayload = sanitizeUpstreamPayload(payload);
  const headers = buildUpstreamHeaders(upstreamPayload.model, userId, extraHeaders);
  const r = await upstreamScheduler.run(() => fetch(`${UPSTREAM}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(upstreamPayload),
  }));
  const text = await r.text();
  return { status: r.status, headers: r.headers, body: text };
}

// Try the client's requested model, then fall back through the chain on 4xx/5xx.
// Streaming is not retried — if the client asked for stream and the first model
// fails, we report that failure (can't unwind a partial stream).
async function callWithFallback(path, payload, userId = null) {
  const requested = payload.model;
  const allowExplicitFallback = getAllowExplicitFallback(payload);
  const chain = buildFallbackChain(requested, allowExplicitFallback);

  // Check if requested model is disabled
  if (requested && disabledModelsManager.isDisabled(requested)) {
    log(`🚫 Requested model ${requested} is disabled globally`);
    return {
      status: 403,
      headers: new Headers(),
      body: JSON.stringify({ error: { message: `Model ${requested} is disabled` } }),
      triedModel: requested
    };
  }

  let last;
  const skipped = [];
  for (const model of chain) {
    const blockState = getModelBlockState(userId, model);
    if (blockState) {
      skipped.push({ model, ...blockState });
      log(`⏭️  Skipping ${blockState.reason} model: ${model}`);
      continue;
    }

    const r = await callUpstream(path, { ...payload, model }, { userId });
    last = { ...r, triedModel: model };
    if (r.status >= 200 && r.status < 300) return last;

    if (r.status === 429 && userId) {
      applyModelCooldown(userId, model, "fallback");
    } else if (r.status === 429) {
      applyModelCooldown(null, model, "fallback");
    }

    // Only fall through on upstream-reported failures. 429 rate-limit also
    // triggers fallback since the next model may be on a different upstream.
    if (r.status !== 401 && r.status !== 400 && r.status !== 429 && r.status < 500) {
      return last;
    }
    log(`fallback: ${model} -> HTTP ${r.status}, trying next`);
  }

  // If we get here and have no result, all models failed or were disabled
  if (!last) {
    const retryAfter = skipped
      .filter((item) => item.reason !== "disabled" && item.retryAfter > 0)
      .reduce((min, item) => Math.min(min, item.retryAfter), Number.POSITIVE_INFINITY);

    if (Number.isFinite(retryAfter)) {
      return {
        status: 429,
        headers: new Headers({ "Retry-After": String(retryAfter) }),
        body: JSON.stringify({
          error: {
            message: `All fallback models are cooling down. Try again in ${retryAfter} seconds.`,
            type: "rate_limit_error",
            retry_after: retryAfter,
          }
        }),
        triedModel: requested || "auto"
      };
    }

    return {
      status: 403,
      headers: new Headers(),
      body: JSON.stringify({ error: { message: "All available models are disabled or cooled down" } }),
      triedModel: requested || "auto"
    };
  }

  return last;
}

async function handleChatCompletions(req, res) {
  const startTime = Date.now();
  const userId = resolveUser(req);

  // Per-user rate limit check
  const rateLimitResult = checkRateLimit(userId);
  if (rateLimitResult) {
    logResponse(429, { userId: userId?.substring(0, 8), error: "rate limit" });
    res.writeHead(429, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Retry-After": rateLimitResult.headers["Retry-After"],
    });
    return res.end(JSON.stringify(rateLimitResult.body));
  }

  const raw = await readBody(req);
  let payload;
  try {
    payload = JSON.parse(raw || "{}");
  } catch {
    logResponse(400, { error: "invalid JSON body" });
    return json(res, 400, { error: { message: "invalid JSON body" } });
  }

  log(`🔄 Chat request: model=${payload.model || "auto"}, stream=${payload.stream || false}, user=${userId?.substring(0, 8) || "anon"}`);

  if (payload.stream) {
    // Stream straight to upstream with no fallback (see note above).
    const model = choosePrimaryModel(payload.model, userId, getAllowExplicitFallback(payload));
    if (!model) {
      logResponse(503, { error: "no models configured" });
      return json(res, 503, { error: { message: "No models available" } });
    }

    const blockState = getModelBlockState(userId, model);
    if (blockState) {
      const status = blockState.reason === "disabled" ? 403 : 429;
      const message = blockState.reason === "disabled"
        ? `Model ${model} is disabled`
        : `Model ${model} is temporarily unavailable. Try again in ${blockState.retryAfter} seconds.`;
      logResponse(status, { error: `${model} ${blockState.reason}` });
      return json(res, status, { error: { message, retry_after: blockState.retryAfter || undefined } });
    }

    const headers = buildUpstreamHeaders(model, userId);
    const upstreamPayload = sanitizeUpstreamPayload({ ...payload, model });

    const upstream = await upstreamScheduler.run(() => fetch(`${UPSTREAM}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(upstreamPayload),
    }));

    // If upstream returns 429 during stream, set cooldown for this user
    if (upstream.status === 429) {
      applyModelCooldown(userId, model, "chat-stream");
    }

    res.writeHead(upstream.status, {
      "Content-Type": upstream.headers.get("content-type") || "text/event-stream",
      "Access-Control-Allow-Origin": "*",
    });
    if (upstream.body) {
      const reader = upstream.body.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
    const latency = Date.now() - startTime;
    logResponse(upstream.status, { model, latency: `${latency}ms`, type: "stream" });

    // Record stats (estimate tokens for streaming)
    recordUserRequest(userId, model);
    statsTracker.recordRequest(model, latency, upstream.status, 0);
    return;
  }

  const r = await callWithFallback("/chat/completions", payload, userId);
  const latency = Date.now() - startTime;
  logResponse(r.status, {
    requested: payload.model || "auto",
    used: r.triedModel,
    latency: `${latency}ms`
  });

  // Extract token usage from response if available
  let tokens = 0;
  try {
    const responseData = JSON.parse(r.body);
    if (responseData.usage?.total_tokens) {
      tokens = responseData.usage.total_tokens;
      log(`📊 Tokens used: ${tokens}`);
    }
  } catch {
    // Ignore parse errors
  }

  // Record stats
  recordUserRequest(userId, r.triedModel);
  statsTracker.recordRequest(r.triedModel, latency, r.status, tokens);

  res.writeHead(r.status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "X-Zen-Proxy-Model": r.triedModel,
    ...(r.headers.get("Retry-After") ? { "Retry-After": r.headers.get("Retry-After") } : {}),
  });
  res.end(r.body);
}

// Handle model-specific endpoint (no fallback)
async function handleModelSpecificRequest(req, res, modelId) {
  const startTime = Date.now();
  const userId = resolveUser(req);

  // Per-user rate limit check
  const rateLimitResult = checkRateLimit(userId);
  if (rateLimitResult) {
    logResponse(429, { userId: userId?.substring(0, 8), error: "rate limit" });
    res.writeHead(429, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Retry-After": rateLimitResult.headers["Retry-After"],
    });
    return res.end(JSON.stringify(rateLimitResult.body));
  }

  log(`🎯 Model-specific request: ${modelId}, user=${userId?.substring(0, 8) || "anon"}`);

  // Check if model is disabled globally
  if (disabledModelsManager.isDisabled(modelId)) {
    log(`🚫 Model ${modelId} is disabled globally`);
    logResponse(403, { error: `Model ${modelId} is disabled` });
    return json(res, 403, { error: { message: `Model ${modelId} is disabled` } });
  }

  const blockState = getModelBlockState(userId, modelId);
  if (blockState) {
    const status = blockState.reason === "disabled" ? 403 : 429;
    const message = blockState.reason === "disabled"
      ? `Model ${modelId} is disabled`
      : `Model ${modelId} is temporarily unavailable. Try again in ${blockState.retryAfter} seconds.`;
    return json(res, status, { error: { message, retry_after: blockState.retryAfter || undefined } });
  }

  const raw = await readBody(req);
  let payload;
  try {
    payload = JSON.parse(raw || "{}");
  } catch {
    logResponse(400, { error: "invalid JSON body" });
    return json(res, 400, { error: { message: "invalid JSON body" } });
  }

  // Override model with the one from URL
  payload.model = modelId;
  log(`📝 Payload model set to: ${modelId}`);

  if (payload.stream) {
    const headers = buildUpstreamHeaders(modelId, userId);
    const upstream = await upstreamScheduler.run(() => fetch(`${UPSTREAM}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(sanitizeUpstreamPayload(payload)),
    }));

    // Set per-user cooldown on 429
    if (upstream.status === 429) {
      applyModelCooldown(userId, modelId, "model-stream");
    }

    res.writeHead(upstream.status, {
      "Content-Type": upstream.headers.get("content-type") || "text/event-stream",
      "Access-Control-Allow-Origin": "*",
    });
    if (upstream.body) {
      const reader = upstream.body.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
    const latency = Date.now() - startTime;
    logResponse(upstream.status, { model: modelId, latency: `${latency}ms`, type: "stream" });

    recordUserRequest(userId, modelId);
    statsTracker.recordRequest(modelId, latency, upstream.status, 0);
    return;
  }

  // Non-streaming: call upstream directly (no fallback)
  const r = await callUpstream("/chat/completions", payload, { userId });
  const latency = Date.now() - startTime;

  // Set per-user cooldown on 429
  if (r.status === 429) {
    applyModelCooldown(userId, modelId, "model-direct");
  }

  logResponse(r.status, { model: modelId, latency: `${latency}ms` });

  // Extract token usage
  let tokens = 0;
  try {
    const responseData = JSON.parse(r.body);
    if (responseData.usage?.total_tokens) {
      tokens = responseData.usage.total_tokens;
      log(`📊 Tokens used: ${tokens}`);
    }
  } catch {
    // Ignore parse errors
  }

  // Record stats
  recordUserRequest(userId, modelId);
  statsTracker.recordRequest(modelId, latency, r.status, tokens);

  res.writeHead(r.status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "X-Zen-Proxy-Model": modelId,
  });
  res.end(r.body);
}

// Handle Responses API endpoint
async function handleResponses(req, res) {
  const startTime = Date.now();
  const userId = resolveUser(req);

  // Per-user rate limit check
  const rateLimitResult = checkRateLimit(userId);
  if (rateLimitResult) {
    logResponse(429, { userId: userId?.substring(0, 8), error: "rate limit" });
    res.writeHead(429, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Retry-After": rateLimitResult.headers["Retry-After"],
    });
    return res.end(JSON.stringify(rateLimitResult.body));
  }

  const raw = await readBody(req);
  let payload;
  try {
    payload = JSON.parse(raw || "{}");
  } catch {
    logResponse(400, { error: "invalid JSON body" });
    return json(res, 400, { error: { message: "invalid JSON body" } });
  }

  log(`🔄 Responses API request: model=${payload.model || "auto"}, stream=${payload.stream || false}, user=${userId?.substring(0, 8) || "anon"}`);

  // Convert Responses API format to Chat Completions format
  const completionsPayload = responsesToCompletions(payload);

  if (payload.stream) {
    const model = choosePrimaryModel(completionsPayload.model, userId, getAllowExplicitFallback(payload));
    if (!model) {
      return json(res, 503, { error: { message: "No models available" } });
    }

    const blockState = getModelBlockState(userId, model);
    if (blockState) {
      const status = blockState.reason === "disabled" ? 403 : 429;
      const message = blockState.reason === "disabled"
        ? `Model ${model} is disabled`
        : `Model ${model} is temporarily unavailable. Try again in ${blockState.retryAfter} seconds.`;
      return json(res, status, { error: { message, retry_after: blockState.retryAfter || undefined } });
    }

    const headers = buildUpstreamHeaders(model, userId);
    const upstreamPayload = sanitizeUpstreamPayload({ ...completionsPayload, model, stream: true });

    const upstream = await upstreamScheduler.run(() => fetch(`${UPSTREAM}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(upstreamPayload),
    }));

    if (upstream.status >= 400) {
      // Set per-user cooldown on 429
      if (upstream.status === 429) {
        applyModelCooldown(userId, model, "responses-stream");
      }
      const errBody = await upstream.text();
      const latency = Date.now() - startTime;
      logResponse(upstream.status, { model, latency: `${latency}ms`, type: "stream-error" });
      recordUserRequest(userId, model);
      statsTracker.recordRequest(model, latency, upstream.status, 0);
      res.writeHead(upstream.status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      return res.end(errBody);
    }

    // Stream with Responses API SSE format
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    const state = { model };
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") {
          res.write("event: response.completed\ndata: [DONE]\n\n");
          continue;
        }
        try {
          const chunk = JSON.parse(data);
          const events = convertStreamChunk(chunk, state);
          for (const event of events) {
            res.write(formatSSE(event));
          }
        } catch {
          // Skip unparseable chunks
        }
      }
    }

    res.end();
    const latency = Date.now() - startTime;
    logResponse(200, { model, latency: `${latency}ms`, type: "responses-stream" });
    recordUserRequest(userId, model);
    statsTracker.recordRequest(model, latency, 200, 0);
    return;
  }

  // Non-streaming: use fallback chain
  const r = await callWithFallback("/chat/completions", completionsPayload, userId);
  const latency = Date.now() - startTime;

  let tokens = 0;
  let completionsResponse = {};
  try {
    completionsResponse = JSON.parse(r.body);
    if (completionsResponse.usage?.total_tokens) {
      tokens = completionsResponse.usage.total_tokens;
    }
  } catch {
    // Pass through error
    logResponse(r.status, { error: "upstream parse error", latency: `${latency}ms` });
    recordUserRequest(userId, r.triedModel);
    statsTracker.recordRequest(r.triedModel, latency, r.status, 0);
    res.writeHead(r.status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    return res.end(r.body);
  }

  recordUserRequest(userId, r.triedModel);
  statsTracker.recordRequest(r.triedModel, latency, r.status, tokens);

  if (r.status >= 400) {
    logResponse(r.status, { model: r.triedModel, latency: `${latency}ms` });
    res.writeHead(r.status, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ...(r.headers.get("Retry-After") ? { "Retry-After": r.headers.get("Retry-After") } : {}),
    });
    return res.end(r.body);
  }

  // Convert response to Responses API format
  const responsesBody = completionsToResponses(completionsResponse, payload);
  logResponse(200, { model: r.triedModel, latency: `${latency}ms`, type: "responses" });

  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "X-Zen-Proxy-Model": r.triedModel,
  });
  res.end(JSON.stringify(responsesBody));
}

function handleModels(res) {
  const data = FREE_MODELS.map((m) => ({
    id: m.id,
    object: "model",
    created: 1777855865,
    owned_by: "opencode-zen",
    verified_anonymous: m.verified,
    context_length: m.context,
    max_output: m.output,
  }));
  json(res, 200, { object: "list", data });
}

const server = http.createServer(async (req, res) => {
  logRequest(req);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Authorization,Content-Type,X-CSRF-Token,X-User-Id",
    });
    return res.end();
  }

  if (!authOk(req)) {
    logResponse(401, { error: "bad proxy key" });
    return json(res, 401, { error: { message: "bad proxy key" } });
  }

  const url = new URL(req.url, "http://x");
  try {
    // Login page (no auth required)
    if (req.method === "GET" && url.pathname === "/login") {
      try {
        let html = fs.readFileSync("./public/login.html", "utf8");
        // Inject password into login page if configured to show
        if (SHOW_PASSWORD_ON_LOGIN) {
          html = html.replace("{{PASSWORD_HINT}}", DASHBOARD_PASSWORD);
          html = html.replace("{{SHOW_HINT}}", "true");
        } else {
          html = html.replace("{{PASSWORD_HINT}}", "");
          html = html.replace("{{SHOW_HINT}}", "false");
        }
        res.writeHead(200, { "Content-Type": "text/html", "Cache-Control": "no-cache" });
        return res.end(html);
      } catch (err) {
        log("❌ Failed to load login page:", err.message);
        return json(res, 500, { error: { message: "Login page not found" } });
      }
    }

    // Login endpoint
    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      const raw = await readBody(req);
      let payload;
      try {
        payload = JSON.parse(raw || "{}");
      } catch {
        return json(res, 400, { error: { message: "invalid JSON body" } });
      }
      if (!payload.password) {
        return json(res, 400, { error: { message: "password required" } });
      }

      // Check against global dashboard password
      if (payload.password !== DASHBOARD_PASSWORD) {
        log(`🚫 Login failed: invalid password`);
        return json(res, 401, { error: { message: "Invalid password" } });
      }

      // Create a new user for this session
      const userId = userTokenManager.generateUserId();
      userTokenManager.createUser(userId);

      const sessionToken = createSession(userId);
      log(`✅ Login success: new session for user ${userId.substring(0, 8)}...`);

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Set-Cookie": `session=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
      });
      return res.end(JSON.stringify({ success: true, user_id: userId, session: sessionToken }));
    }

    // Logout endpoint
    if (req.method === "POST" && url.pathname === "/api/auth/logout") {
      const cookies = parseCookies(req.headers["cookie"] || "");
      if (cookies.session) {
        destroySession(cookies.session);
      }
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Set-Cookie": `session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
      });
      return res.end(JSON.stringify({ success: true }));
    }

    // Check session endpoint
    if (req.method === "GET" && url.pathname === "/api/auth/me") {
      const cookies = parseCookies(req.headers["cookie"] || "");
      const session = cookies.session ? getSession(cookies.session) : null;
      if (!session) {
        return json(res, 401, { error: { message: "Not authenticated" } });
      }
      return json(res, 200, { user_id: session.userId, authenticated: true });
    }

    // Dashboard requires session
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/dashboard")) {
      const cookies = parseCookies(req.headers["cookie"] || "");
      const session = cookies.session ? getSession(cookies.session) : null;
      if (!session) {
        // Redirect to login
        res.writeHead(302, { "Location": "/login" });
        return res.end();
      }
      log(`📄 Serving dashboard for user ${session.userId.substring(0, 8)}...`);
      try {
        const html = fs.readFileSync("./public/index.html", "utf8");
        res.writeHead(200, { "Content-Type": "text/html", "Cache-Control": "no-cache" });
        return res.end(html);
      } catch (err) {
        log("❌ Failed to load dashboard:", err.message);
        return json(res, 500, { error: { message: "Dashboard not found" } });
      }
    }
    if (req.method === "GET" && url.pathname === "/api/status") {
      logResponse(200, { endpoint: "api/status" });
      return json(res, 200, {
        service: "zen-proxy",
        upstream: UPSTREAM,
        upstream_auth: (UPSTREAM_KEY || UPSTREAM_KEYS.length > 0) ? "key-set" : "anonymous",
        upstream_key_pool_size: (UPSTREAM_KEY ? 1 : 0) + UPSTREAM_KEYS.length,
        explicit_model_fallback: ALLOW_EXPLICIT_MODEL_FALLBACK,
        tunnel_url: TUNNEL_URL || null,
        models: AUTO_FALLBACK_CHAIN,
        queue: upstreamScheduler.getStats(),
        endpoints: [
          "/v1/models",
          "/v1/chat/completions",
          "/v1/responses",
          ...FREE_MODELS.map(m => `/v1/${m.id}/chat/completions`)
        ],
      });
    }
    if (req.method === "GET" && url.pathname === "/api/stats") {
      logResponse(200, { endpoint: "api/stats" });
      return json(res, 200, statsTracker.getStats());
    }
    if (req.method === "GET" && url.pathname === "/api/csrf-token") {
      const token = generateCSRFToken();
      log(`🔐 Generated CSRF token: ${token.substring(0, 8)}...`);
      return json(res, 200, { token });
    }
    if (req.method === "GET" && (url.pathname === "/v1/models" || url.pathname === "/models" || url.pathname === "/v1")) {
      logResponse(200, { endpoint: "models list" });
      return handleModels(res);
    }
    // API key management endpoints
    if (url.pathname.startsWith("/api/models/") && url.pathname.endsWith("/key")) {
      const modelId = decodeURIComponent(url.pathname.split('/')[3]);
      log(`🔑 API key operation for model: ${modelId}`);

      if (req.method === "GET") {
        // Check if key exists
        const exists = apiKeyManager.hasKey(modelId);
        log(`🔍 API key exists for ${modelId}: ${exists}`);
        return json(res, 200, { exists });
      }

      if (req.method === "POST") {
        // Save API key
        const raw = await readBody(req);
        let payload;
        try {
          payload = JSON.parse(raw || "{}");
        } catch {
          logResponse(400, { error: "invalid JSON body" });
          return json(res, 400, { error: { message: "invalid JSON body" } });
        }

        if (!payload.key) {
          logResponse(400, { error: "key field required" });
          return json(res, 400, { error: { message: "key field required" } });
        }

        apiKeyManager.setKey(modelId, payload.key);
        const keyCount = apiKeyManager.getKeys(modelId).length;
        log(`✅ API key saved for ${modelId} (${keyCount} key${keyCount === 1 ? "" : "s"})`);
        return json(res, 200, { success: true, keys: keyCount });
      }

      if (req.method === "DELETE") {
        // Delete API key
        apiKeyManager.deleteKey(modelId);
        log(`🗑️  API key deleted for ${modelId}`);
        return json(res, 200, { success: true });
      }
    }
    // Disabled models management endpoints
    if (url.pathname === "/api/disabled-models") {
      if (req.method === "GET") {
        // Get list of disabled models
        return json(res, 200, { disabled: disabledModelsManager.getAll() });
      }
    }
    if (url.pathname.startsWith("/api/models/") && url.pathname.endsWith("/disable")) {
      const modelId = decodeURIComponent(url.pathname.split('/')[3]);

      if (req.method === "POST") {
        // Disable model
        disabledModelsManager.disable(modelId);
        log(`🚫 Model ${modelId} disabled globally`);
        return json(res, 200, { success: true });
      }
    }
    if (url.pathname.startsWith("/api/models/") && url.pathname.endsWith("/enable")) {
      const modelId = decodeURIComponent(url.pathname.split('/')[3]);

      if (req.method === "POST") {
        // Enable model
        disabledModelsManager.enable(modelId);
        log(`✅ Model ${modelId} enabled globally`);
        return json(res, 200, { success: true });
      }
    }
    // Tunnel management endpoints
    if (url.pathname === "/api/tunnel/start" && req.method === "POST") {
      log(`🚇 Starting new tunnel...`);
      try {
        const { spawn, exec } = await import("node:child_process");
        const { promisify } = await import("node:util");
        const execAsync = promisify(exec);

        // Kill ALL existing cloudflared tunnels first
        try {
          await execAsync(`pkill -f "cloudflared tunnel"`);
          log(`🧹 Killed all existing tunnels`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
          // No existing tunnels, that's fine
          log(`ℹ️  No existing tunnels to kill`);
        }

        // Kill global tunnel process if exists
        if (global.tunnelProcess) {
          try {
            global.tunnelProcess.kill();
            global.tunnelProcess = null;
            log(`🧹 Killed global tunnel process`);
          } catch (err) {
            log(`⚠️  Failed to kill global tunnel: ${err.message}`);
          }
        }

        // Create config file for tunnel
        const configPath = `/tmp/cloudflared-${Date.now()}.yml`;
        fs.writeFileSync(configPath, `url: http://127.0.0.1:${PORT}\nno-autoupdate: true\n`);

        // Start new cloudflared tunnel with config
        const tunnelProcess = spawn("cloudflared", ["tunnel", "--config", configPath]);
        global.tunnelProcess = tunnelProcess;
        global.tunnelConfigPath = configPath;

        // Capture tunnel URL from output
        let tunnelUrl = null;

        const urlPromise = new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error("Tunnel start timeout")), 30000);

          // Cloudflared outputs to stderr
          tunnelProcess.stderr.on("data", (data) => {
            const output = data.toString();
            log(`🚇 Tunnel output: ${output.trim()}`);

            // Extract URL from cloudflared output
            const match = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
            if (match && !tunnelUrl) {
              tunnelUrl = match[0];
              clearTimeout(timeout);
              resolve(tunnelUrl);
            }
          });

          tunnelProcess.stdout.on("data", (data) => {
            log(`🚇 Tunnel stdout: ${data.toString().trim()}`);
          });

          tunnelProcess.on("error", (err) => {
            clearTimeout(timeout);
            reject(err);
          });

          tunnelProcess.on("exit", (code) => {
            if (!tunnelUrl) {
              clearTimeout(timeout);
              reject(new Error(`Tunnel exited with code ${code}`));
            }
          });
        });

        const url = await urlPromise;
        log(`✅ Tunnel created: ${url}`);

        return json(res, 200, { success: true, tunnel_url: url });
      } catch (err) {
        log(`❌ Failed to start tunnel: ${err.message}`);
        return json(res, 500, { error: { message: `Failed to start tunnel: ${err.message}` } });
      }
    }
    if (url.pathname === "/api/tunnel/stop" && req.method === "POST") {
      log(`🚇 Stopping tunnel...`);
      try {
        const { exec } = await import("node:child_process");
        const { promisify } = await import("node:util");
        const execAsync = promisify(exec);

        // Kill global tunnel process
        if (global.tunnelProcess) {
          try {
            global.tunnelProcess.kill();
            global.tunnelProcess = null;
            log(`✅ Killed global tunnel process`);
          } catch (err) {
            log(`⚠️  Failed to kill global tunnel: ${err.message}`);
          }
        }

        // Clean up config file
        if (global.tunnelConfigPath) {
          try {
            fs.unlinkSync(global.tunnelConfigPath);
            global.tunnelConfigPath = null;
          } catch (err) {
            log(`⚠️  Failed to delete config: ${err.message}`);
          }
        }

        // Kill ALL cloudflared tunnels
        try {
          await execAsync(`pkill -f "cloudflared tunnel"`);
          log(`✅ Killed all cloudflared tunnels`);
        } catch (err) {
          // No tunnels running, that's fine
          log(`ℹ️  No tunnels to kill`);
        }

        return json(res, 200, { success: true });
      } catch (err) {
        log(`❌ Failed to stop tunnel: ${err.message}`);
        return json(res, 500, { error: { message: `Failed to stop tunnel: ${err.message}` } });
      }
    }
    if (
      req.method === "POST" &&
      (url.pathname === "/v1/chat/completions" || url.pathname === "/chat/completions")
    ) {
      // Validate CSRF token only for browser requests
      if (needsCSRF(req) && !validateCSRF(req)) {
        logResponse(403, { error: "CSRF token required" });
        return json(res, 403, { error: { message: "CSRF token required" } });
      }
      return await handleChatCompletions(req, res);
    }
    // Per-model endpoints: /v1/{model-id}/chat/completions
    if (req.method === "POST" && url.pathname.match(/^\/v1\/[^\/]+\/chat\/completions$/)) {
      const modelId = url.pathname.split('/')[2];
      log(`🔍 Looking for model: ${modelId}`);

      // Find model that matches this ID
      const model = FREE_MODELS.find(m => m.id === modelId);

      if (!model) {
        logResponse(404, { error: `Unknown model: ${modelId}` });
        return json(res, 404, { error: { message: `Unknown model: ${modelId}` } });
      }

      log(`✅ Found model: ${model.id}`);

      // Validate CSRF token only for browser requests
      if (needsCSRF(req) && !validateCSRF(req)) {
        logResponse(403, { error: "CSRF token required" });
        return json(res, 403, { error: { message: "CSRF token required" } });
      }

      return await handleModelSpecificRequest(req, res, model.id);
    }
    // Responses API endpoint
    if (
      req.method === "POST" &&
      (url.pathname === "/v1/responses" || url.pathname === "/responses")
    ) {
      if (needsCSRF(req) && !validateCSRF(req)) {
        logResponse(403, { error: "CSRF token required" });
        return json(res, 403, { error: { message: "CSRF token required" } });
      }
      return await handleResponses(req, res);
    }
    // User token management endpoints
    if (url.pathname === "/api/user/register" && req.method === "POST") {
      const userId = userTokenManager.generateUserId();
      userTokenManager.createUser(userId);
      log(`👤 New user registered: ${userId.substring(0, 8)}...`);
      return json(res, 200, { user_id: userId });
    }
    if (url.pathname === "/api/user/token" && req.method === "POST") {
      const raw = await readBody(req);
      let payload;
      try {
        payload = JSON.parse(raw || "{}");
      } catch {
        return json(res, 400, { error: { message: "invalid JSON body" } });
      }
      if (!payload.user_id || !payload.provider || !payload.token) {
        return json(res, 400, { error: { message: "user_id, provider, and token required" } });
      }
      if (!userTokenManager.userExists(payload.user_id)) {
        return json(res, 404, { error: { message: "user not found" } });
      }
      userTokenManager.setToken(payload.user_id, payload.provider, payload.token);
      log(`🔑 Token saved for user ${payload.user_id.substring(0, 8)}... provider=${payload.provider}`);
      return json(res, 200, { success: true });
    }
    if (url.pathname === "/api/user/token" && req.method === "DELETE") {
      const raw = await readBody(req);
      let payload;
      try {
        payload = JSON.parse(raw || "{}");
      } catch {
        return json(res, 400, { error: { message: "invalid JSON body" } });
      }
      if (!payload.user_id || !payload.provider) {
        return json(res, 400, { error: { message: "user_id and provider required" } });
      }
      userTokenManager.deleteToken(payload.user_id, payload.provider);
      return json(res, 200, { success: true });
    }
    if (url.pathname === "/api/user/providers" && req.method === "GET") {
      const userId = url.searchParams.get("user_id");
      if (!userId) {
        return json(res, 400, { error: { message: "user_id query param required" } });
      }
      if (!userTokenManager.userExists(userId)) {
        return json(res, 404, { error: { message: "user not found" } });
      }
      return json(res, 200, { providers: userTokenManager.getProviders(userId) });
    }
    // Rate limit management endpoints
    if (url.pathname === "/api/user/rate-limit" && req.method === "POST") {
      const raw = await readBody(req);
      let payload;
      try {
        payload = JSON.parse(raw || "{}");
      } catch {
        return json(res, 400, { error: { message: "invalid JSON body" } });
      }
      if (!payload.user_id || !payload.limit) {
        return json(res, 400, { error: { message: "user_id and limit required" } });
      }
      if (!userTokenManager.userExists(payload.user_id)) {
        return json(res, 404, { error: { message: "user not found" } });
      }
      const limit = Math.max(1, Math.min(1000, Number(payload.limit)));
      userTokenManager.setRateLimit(payload.user_id, limit);
      rateLimiter.setUserLimit(payload.user_id, limit);
      log(`⚙️  Rate limit set for user ${payload.user_id.substring(0, 8)}...: ${limit} req/min`);
      return json(res, 200, { success: true, limit });
    }
    if (url.pathname === "/api/user/rate-limit" && req.method === "GET") {
      const userId = url.searchParams.get("user_id");
      if (!userId) {
        return json(res, 400, { error: { message: "user_id query param required" } });
      }
      if (!userTokenManager.userExists(userId)) {
        return json(res, 404, { error: { message: "user not found" } });
      }
      const savedLimit = userTokenManager.getRateLimit(userId);
      if (savedLimit) {
        rateLimiter.setUserLimit(userId, savedLimit);
      }
      const limit = rateLimiter.getUserLimit(userId);
      const remaining = rateLimiter.getRemainingRequests(userId);
      const models = rateLimiter.getUserModelStats(userId);
      const global_models = rateLimiter.getGlobalModelStats();
      return json(res, 200, { user_id: userId, limit, remaining, models, global_models });
    }
    // Get current user's own rate limit status (from session)
    if (url.pathname === "/api/my/rate-limit" && req.method === "GET") {
      const userId = resolveUser(req);
      if (!userId) {
        return json(res, 401, { error: { message: "Not authenticated" } });
      }
      const savedLimit = userTokenManager.getRateLimit(userId);
      if (savedLimit) {
        rateLimiter.setUserLimit(userId, savedLimit);
      }
      const limit = rateLimiter.getUserLimit(userId);
      const remaining = rateLimiter.getRemainingRequests(userId);
      const models = rateLimiter.getUserModelStats(userId);
      const global_models = rateLimiter.getGlobalModelStats();
      return json(res, 200, { user_id: userId, limit, remaining, models, global_models });
    }
    logResponse(404, { error: `no route: ${req.method} ${url.pathname}` });
    json(res, 404, { error: { message: `no route: ${req.method} ${url.pathname}` } });
  } catch (err) {
    if (err?.message === "Upstream queue is full") {
      logResponse(503, { error: "upstream queue full" });
      return json(res, 503, {
        error: {
          message: "Proxy is busy, upstream queue is full. Try again shortly.",
          type: "server_overloaded",
        }
      });
    }
    log("❌ Server error:", err);
    json(res, 500, { error: { message: String(err?.message || err) } });
  }
});

server.listen(PORT, HOST, () => {
  log(`zen-proxy listening on http://${HOST}:${PORT}`);
  log(`instance: ${instanceData.id}`);
  log(`upstream: ${UPSTREAM} (${(UPSTREAM_KEY || UPSTREAM_KEYS.length > 0) ? "with key" : "anonymous"})`);
  log(`auto-chain: ${AUTO_FALLBACK_CHAIN.join(" -> ")}`);
  log(`explicit-model-fallback: ${ALLOW_EXPLICIT_MODEL_FALLBACK ? "enabled" : "disabled"}`);
  log(`upstream queue: concurrency=${UPSTREAM_MAX_CONCURRENCY}, size=${UPSTREAM_QUEUE_SIZE}`);

  // Show dashboard password
  if (process.env.DASHBOARD_PASSWORD) {
    log(`🔐 Dashboard password: (from env)`);
  } else {
    log(`🔐 Dashboard password: ${instanceData.password} (auto-generated, saved in data/instance.json)`);
  }

  // Startup security warnings
  if (!PROXY_KEY) {
    log(`⚠️  PROXY_KEY not set — API endpoints are open without authentication`);
  }
  if (!UPSTREAM_KEY && UPSTREAM_KEYS.length === 0) {
    log(`ℹ️  No OPENCODE_API_KEY — anonymous mode (upstream rate-limited by IP)`);
  } else {
    log(`🔑 Upstream key pool size: ${(UPSTREAM_KEY ? 1 : 0) + UPSTREAM_KEYS.length}`);
  }
});
