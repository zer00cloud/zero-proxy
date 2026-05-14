import http from "node:http";
import fs from "node:fs";
import crypto from "node:crypto";
import { FREE_MODELS, AUTO_FALLBACK_CHAIN, MODEL_IDS } from "./models.js";
import { statsTracker } from "./stats.js";
import { apiKeyManager } from "./api-keys.js";
import { disabledModelsManager } from "./disabled-models.js";
import { userTokenManager } from "./user-tokens.js";
import { responsesToCompletions, completionsToResponses, convertStreamChunk, formatSSE } from "./responses-api.js";

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";
const UPSTREAM = "https://opencode.ai/zen/v1";
const UPSTREAM_KEY = process.env.OPENCODE_API_KEY || ""; // optional; unlocks the full catalog
const PROXY_KEY = process.env.PROXY_KEY || ""; // if set, clients must send matching Bearer
const TUNNEL_URL = process.env.TUNNEL_URL || ""; // Cloudflare tunnel URL if active

// CSRF token management
const validTokens = new Map(); // Map<token, expiryTime>

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

// Use full model ID as endpoint path (no extraction needed)
function getModelEndpoint(modelId) {
  return modelId;
}

// Call upstream once with a given model. Returns { status, headers, body }.
async function callUpstream(path, payload, extraHeaders = {}) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extraHeaders,
  };

  // Check if model has a saved API key
  const modelApiKey = apiKeyManager.getKey(payload.model);
  if (modelApiKey) {
    headers["Authorization"] = `Bearer ${modelApiKey}`;
  } else if (UPSTREAM_KEY) {
    headers["Authorization"] = `Bearer ${UPSTREAM_KEY}`;
  }

  const r = await fetch(`${UPSTREAM}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const text = await r.text();
  return { status: r.status, headers: r.headers, body: text };
}

// Try the client's requested model, then fall back through the chain on 4xx/5xx.
// Streaming is not retried — if the client asked for stream and the first model
// fails, we report that failure (can't unwind a partial stream).
async function callWithFallback(path, payload) {
  const requested = payload.model;
  let chain;

  if (!requested || requested === "auto") {
    chain = [...AUTO_FALLBACK_CHAIN];
  } else if (MODEL_IDS.has(requested)) {
    // Put the requested model first, then append other verified ones as backup.
    chain = [requested, ...AUTO_FALLBACK_CHAIN.filter((m) => m !== requested)];
  } else {
    // Unknown model — pass through as-is, no fallback.
    chain = [requested];
  }

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
  for (const model of chain) {
    // Skip disabled models in fallback chain
    if (disabledModelsManager.isDisabled(model)) {
      log(`⏭️  Skipping disabled model: ${model}`);
      continue;
    }

    const r = await callUpstream(path, { ...payload, model });
    last = { ...r, triedModel: model };
    if (r.status >= 200 && r.status < 300) return last;
    // Only fall through on upstream-reported failures. 429 rate-limit also
    // triggers fallback since the next model may be on a different upstream.
    if (r.status !== 401 && r.status !== 400 && r.status !== 429 && r.status < 500) {
      return last;
    }
    log(`fallback: ${model} -> HTTP ${r.status}, trying next`);
  }

  // If we get here and have no result, all models failed or were disabled
  if (!last) {
    return {
      status: 403,
      headers: new Headers(),
      body: JSON.stringify({ error: { message: "All available models are disabled" } }),
      triedModel: requested || "auto"
    };
  }

  return last;
}

async function handleChatCompletions(req, res) {
  const startTime = Date.now();
  const raw = await readBody(req);
  let payload;
  try {
    payload = JSON.parse(raw || "{}");
  } catch {
    logResponse(400, { error: "invalid JSON body" });
    return json(res, 400, { error: { message: "invalid JSON body" } });
  }

  log(`🔄 Chat request: model=${payload.model || "auto"}, stream=${payload.stream || false}`);

  if (payload.stream) {
    // Stream straight to upstream with no fallback (see note above).
    const model = payload.model && MODEL_IDS.has(payload.model)
      ? payload.model
      : AUTO_FALLBACK_CHAIN[0];

    // Check if model is disabled
    if (disabledModelsManager.isDisabled(model)) {
      log(`🚫 Model ${model} is disabled globally`);
      logResponse(403, { error: `Model ${model} is disabled` });
      return json(res, 403, { error: { message: `Model ${model} is disabled` } });
    }

    const headers = { "Content-Type": "application/json" };

    // Check if model has a saved API key
    const modelApiKey = apiKeyManager.getKey(model);
    if (modelApiKey) {
      headers["Authorization"] = `Bearer ${modelApiKey}`;
      log(`🔑 Using saved API key for ${model}`);
    } else if (UPSTREAM_KEY) {
      headers["Authorization"] = `Bearer ${UPSTREAM_KEY}`;
      log(`🔑 Using UPSTREAM_KEY for ${model}`);
    } else {
      log(`⚠️  No API key for ${model} (anonymous mode)`);
    }

    const upstream = await fetch(`${UPSTREAM}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...payload, model }),
    });
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
    statsTracker.recordRequest(model, latency, upstream.status, 0);
    return;
  }

  const r = await callWithFallback("/chat/completions", payload);
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
  statsTracker.recordRequest(r.triedModel, latency, r.status, tokens);

  res.writeHead(r.status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "X-Zen-Proxy-Model": r.triedModel,
  });
  res.end(r.body);
}

// Handle model-specific endpoint (no fallback)
async function handleModelSpecificRequest(req, res, modelId) {
  const startTime = Date.now();
  log(`🎯 Model-specific request: ${modelId}`);

  // Check if model is disabled globally
  if (disabledModelsManager.isDisabled(modelId)) {
    log(`🚫 Model ${modelId} is disabled globally`);
    logResponse(403, { error: `Model ${modelId} is disabled` });
    return json(res, 403, { error: { message: `Model ${modelId} is disabled` } });
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
    const headers = { "Content-Type": "application/json" };

    // Check if model has a saved API key
    const modelApiKey = apiKeyManager.getKey(modelId);
    if (modelApiKey) {
      headers["Authorization"] = `Bearer ${modelApiKey}`;
      log(`🔑 Using saved API key for ${modelId}`);
    } else if (UPSTREAM_KEY) {
      headers["Authorization"] = `Bearer ${UPSTREAM_KEY}`;
      log(`🔑 Using UPSTREAM_KEY for ${modelId}`);
    } else {
      log(`⚠️  No API key for ${modelId} (anonymous mode)`);
    }

    const upstream = await fetch(`${UPSTREAM}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
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

    statsTracker.recordRequest(modelId, latency, upstream.status, 0);
    return;
  }

  // Non-streaming: call upstream directly (no fallback)
  const r = await callUpstream("/chat/completions", payload);
  const latency = Date.now() - startTime;
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
  const raw = await readBody(req);
  let payload;
  try {
    payload = JSON.parse(raw || "{}");
  } catch {
    logResponse(400, { error: "invalid JSON body" });
    return json(res, 400, { error: { message: "invalid JSON body" } });
  }

  log(`🔄 Responses API request: model=${payload.model || "auto"}, stream=${payload.stream || false}`);

  // Check for user token (X-User-Id header)
  const userId = req.headers["x-user-id"];
  let userApiKey = null;
  if (userId && userTokenManager.userExists(userId)) {
    userApiKey = userTokenManager.getToken(userId, "opencode");
  }

  // Convert Responses API format to Chat Completions format
  const completionsPayload = responsesToCompletions(payload);

  if (payload.stream) {
    const model = completionsPayload.model && MODEL_IDS.has(completionsPayload.model)
      ? completionsPayload.model
      : AUTO_FALLBACK_CHAIN[0];

    if (disabledModelsManager.isDisabled(model)) {
      log(`🚫 Model ${model} is disabled globally`);
      return json(res, 403, { error: { message: `Model ${model} is disabled` } });
    }

    const headers = { "Content-Type": "application/json" };

    // Priority: user token > model API key > upstream key
    if (userApiKey) {
      headers["Authorization"] = `Bearer ${userApiKey}`;
      log(`🔑 Using user token for ${model}`);
    } else {
      const modelApiKey = apiKeyManager.getKey(model);
      if (modelApiKey) {
        headers["Authorization"] = `Bearer ${modelApiKey}`;
      } else if (UPSTREAM_KEY) {
        headers["Authorization"] = `Bearer ${UPSTREAM_KEY}`;
      }
    }

    const upstream = await fetch(`${UPSTREAM}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...completionsPayload, model, stream: true }),
    });

    if (upstream.status >= 400) {
      const errBody = await upstream.text();
      const latency = Date.now() - startTime;
      logResponse(upstream.status, { model, latency: `${latency}ms`, type: "stream-error" });
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
    statsTracker.recordRequest(model, latency, 200, 0);
    return;
  }

  // Non-streaming: use fallback chain
  // Override auth if user has their own token
  const extraHeaders = {};
  if (userApiKey) {
    extraHeaders["Authorization"] = `Bearer ${userApiKey}`;
    log(`🔑 Using user token`);
  }

  const r = await callWithFallback("/chat/completions", completionsPayload);
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
    statsTracker.recordRequest(r.triedModel, latency, r.status, 0);
    res.writeHead(r.status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    return res.end(r.body);
  }

  statsTracker.recordRequest(r.triedModel, latency, r.status, tokens);

  if (r.status >= 400) {
    logResponse(r.status, { model: r.triedModel, latency: `${latency}ms` });
    res.writeHead(r.status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
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
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/dashboard")) {
      log(`📄 Serving dashboard`);
      try {
        const html = fs.readFileSync("./public/index.html", "utf8");
        res.writeHead(200, {
          "Content-Type": "text/html",
          "Cache-Control": "no-cache"
        });
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
        upstream_auth: UPSTREAM_KEY ? "key-set" : "anonymous",
        tunnel_url: TUNNEL_URL || null,
        models: AUTO_FALLBACK_CHAIN,
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
        log(`✅ API key saved for ${modelId}`);
        return json(res, 200, { success: true });
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
    logResponse(404, { error: `no route: ${req.method} ${url.pathname}` });
    json(res, 404, { error: { message: `no route: ${req.method} ${url.pathname}` } });
  } catch (err) {
    log("❌ Server error:", err);
    json(res, 500, { error: { message: String(err?.message || err) } });
  }
});

server.listen(PORT, HOST, () => {
  log(`zen-proxy listening on http://${HOST}:${PORT}`);
  log(`upstream: ${UPSTREAM} (${UPSTREAM_KEY ? "with key" : "anonymous"})`);
  log(`auto-chain: ${AUTO_FALLBACK_CHAIN.join(" -> ")}`);
});
