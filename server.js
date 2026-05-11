import http from "node:http";
import fs from "node:fs";
import { FREE_MODELS, AUTO_FALLBACK_CHAIN, MODEL_IDS } from "./models.js";
import { statsTracker } from "./stats.js";
import { apiKeyManager } from "./api-keys.js";

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";
const UPSTREAM = "https://opencode.ai/zen/v1";
const UPSTREAM_KEY = process.env.OPENCODE_API_KEY || ""; // optional; unlocks the full catalog
const PROXY_KEY = process.env.PROXY_KEY || ""; // if set, clients must send matching Bearer

// CSRF token management
const validTokens = new Set();

function generateCSRFToken() {
  const token = crypto.randomUUID();
  validTokens.add(token);
  // Token expires after 1 hour
  setTimeout(() => validTokens.delete(token), 3600000);
  return token;
}

function validateCSRF(req) {
  const token = req.headers['x-csrf-token'];
  return token && validTokens.has(token);
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

  let last;
  for (const model of chain) {
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

  const raw = await readBody(req);
  let payload;
  try {
    payload = JSON.parse(raw || "{}");
  } catch {
    logResponse(400, { error: "invalid JSON body" });
    return json(res, 400, { error: { message: "invalid JSON body" } });
  }

  // Check if model is disabled (from client-side localStorage)
  // Note: This is client-side only check, server doesn't track disabled models
  // Client should not send requests for disabled models

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
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Authorization,Content-Type",
    });
    return res.end();
  }

  if (!authOk(req)) {
    logResponse(401, { error: "bad proxy key" });
    return json(res, 401, { error: { message: "bad proxy key" } });
  }

  const url = new URL(req.url, "http://x");
  try {
    if (req.method === "GET" && url.pathname === "/") {
      logResponse(200, { endpoint: "status" });
      return json(res, 200, {
        service: "zen-proxy",
        upstream: UPSTREAM,
        upstream_auth: UPSTREAM_KEY ? "key-set" : "anonymous",
        models: AUTO_FALLBACK_CHAIN,
        endpoints: [
          "/v1/models",
          "/v1/chat/completions",
          ...FREE_MODELS.map(m => `/v1/${m.id}/chat/completions`)
        ],
      });
    }
    if (req.method === "GET" && url.pathname === "/dashboard") {
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
        models: AUTO_FALLBACK_CHAIN,
        endpoints: [
          "/v1/models",
          "/v1/chat/completions",
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
    if (req.method === "GET" && (url.pathname === "/v1/models" || url.pathname === "/models")) {
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
