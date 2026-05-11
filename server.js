import http from "node:http";
import { FREE_MODELS, AUTO_FALLBACK_CHAIN, MODEL_IDS } from "./models.js";
import { statsTracker } from "./stats.js";
import { apiKeyManager } from "./api-keys.js";

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";
const UPSTREAM = "https://opencode.ai/zen/v1";
const UPSTREAM_KEY = process.env.OPENCODE_API_KEY || ""; // optional; unlocks the full catalog
const PROXY_KEY = process.env.PROXY_KEY || ""; // if set, clients must send matching Bearer

function log(...a) {
  console.log(new Date().toISOString(), ...a);
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

// Call upstream once with a given model. Returns { status, headers, body }.
async function callUpstream(path, payload, extraHeaders = {}) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extraHeaders,
  };
  if (UPSTREAM_KEY) headers["Authorization"] = `Bearer ${UPSTREAM_KEY}`;

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
    return json(res, 400, { error: { message: "invalid JSON body" } });
  }

  if (payload.stream) {
    // Stream straight to upstream with no fallback (see note above).
    const model = payload.model && MODEL_IDS.has(payload.model)
      ? payload.model
      : AUTO_FALLBACK_CHAIN[0];
    const headers = { "Content-Type": "application/json" };
    if (UPSTREAM_KEY) headers["Authorization"] = `Bearer ${UPSTREAM_KEY}`;
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
    log(`stream ${model} -> ${upstream.status}`);

    // Record stats (estimate tokens for streaming)
    statsTracker.recordRequest(model, latency, upstream.status, 0);
    return;
  }

  const r = await callWithFallback("/chat/completions", payload);
  const latency = Date.now() - startTime;
  log(`chat ${payload.model || "auto"} -> ${r.triedModel} -> ${r.status}`);

  // Extract token usage from response if available
  let tokens = 0;
  try {
    const responseData = JSON.parse(r.body);
    if (responseData.usage?.total_tokens) {
      tokens = responseData.usage.total_tokens;
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
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Authorization,Content-Type",
    });
    return res.end();
  }

  if (!authOk(req)) return json(res, 401, { error: { message: "bad proxy key" } });

  const url = new URL(req.url, "http://x");
  try {
    if (req.method === "GET" && url.pathname === "/") {
      return json(res, 200, {
        service: "zen-proxy",
        upstream: UPSTREAM,
        upstream_auth: UPSTREAM_KEY ? "key-set" : "anonymous",
        models: AUTO_FALLBACK_CHAIN,
        endpoints: ["/v1/models", "/v1/chat/completions"],
      });
    }
    if (req.method === "GET" && url.pathname === "/api/status") {
      return json(res, 200, {
        service: "zen-proxy",
        upstream: UPSTREAM,
        upstream_auth: UPSTREAM_KEY ? "key-set" : "anonymous",
        models: AUTO_FALLBACK_CHAIN,
        endpoints: ["/v1/models", "/v1/chat/completions"],
      });
    }
    if (req.method === "GET" && url.pathname === "/api/stats") {
      return json(res, 200, statsTracker.getStats());
    }
    if (req.method === "GET" && (url.pathname === "/v1/models" || url.pathname === "/models")) {
      return handleModels(res);
    }
    // API key management endpoints
    if (url.pathname.startsWith("/api/models/") && url.pathname.endsWith("/key")) {
      const modelId = decodeURIComponent(url.pathname.split('/')[3]);

      if (req.method === "GET") {
        // Check if key exists
        return json(res, 200, { exists: apiKeyManager.hasKey(modelId) });
      }

      if (req.method === "POST") {
        // Save API key
        const raw = await readBody(req);
        let payload;
        try {
          payload = JSON.parse(raw || "{}");
        } catch {
          return json(res, 400, { error: { message: "invalid JSON body" } });
        }

        if (!payload.key) {
          return json(res, 400, { error: { message: "key field required" } });
        }

        apiKeyManager.setKey(modelId, payload.key);
        return json(res, 200, { success: true });
      }

      if (req.method === "DELETE") {
        // Delete API key
        apiKeyManager.deleteKey(modelId);
        return json(res, 200, { success: true });
      }
    }
    if (
      req.method === "POST" &&
      (url.pathname === "/v1/chat/completions" || url.pathname === "/chat/completions")
    ) {
      return await handleChatCompletions(req, res);
    }
    json(res, 404, { error: { message: `no route: ${req.method} ${url.pathname}` } });
  } catch (err) {
    log("error:", err);
    json(res, 500, { error: { message: String(err?.message || err) } });
  }
});

server.listen(PORT, HOST, () => {
  log(`zen-proxy listening on http://${HOST}:${PORT}`);
  log(`upstream: ${UPSTREAM} (${UPSTREAM_KEY ? "with key" : "anonymous"})`);
  log(`auto-chain: ${AUTO_FALLBACK_CHAIN.join(" -> ")}`);
});
