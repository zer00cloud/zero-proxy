# zen-proxy

OpenAI-compatible proxy for the free models hosted on OpenCode Zen
(`https://opencode.ai/zen/v1`). Point any OpenAI SDK / tool at this proxy
and get `minimax-m2.5-free`, `big-pickle`, `nemotron-3-super-free` with
automatic fallback when one is down or rate-limited.

`auto` traffic is rotated across the verified models, and any model that
returns upstream `429` is cooled down briefly so the proxy does not keep
hitting the same hot path over and over.

Explicit model requests now stay on the exact model by default. If you want
cross-model fallback for a specific request, send `allow_fallback: true`.

## Run

    node server.js
    # or: pm2 start ecosystem.config.cjs

Default listens on `0.0.0.0:8787`.

## Use

    curl http://localhost:8787/v1/chat/completions \
      -H "Content-Type: application/json" \
      -d '{"model":"auto","messages":[{"role":"user","content":"hi"}]}'

- `model: "auto"` (or omitted) — rotates through the verified fallback chain.
- `model: "minimax-m2.5-free"` — stays on that exact model by default.
- Streaming (`stream: true`) is proxied straight through, no retry.
- If a user has their own OpenCode token saved, the proxy prefers that token
  over the shared instance key.
- Shared upstream keys can be pooled with `OPENCODE_API_KEYS`, and per-model
  keys can also be saved as comma-separated or newline-separated lists.

## Endpoints

- `GET  /`                      — health / status
- `GET  /v1/models`             — list free models
- `POST /v1/chat/completions`   — OpenAI-compatible chat

## Env

See `.env.example`. Set `OPENCODE_API_KEY` to unlock the full free catalog.
Set `PROXY_KEY` to require clients to authenticate. Tune
`MODEL_COOLDOWN_MS` and `GLOBAL_MODEL_COOLDOWN_MS` if you want the proxy to
back off longer after upstream rate limits. Tune
`UPSTREAM_MAX_CONCURRENCY` and `UPSTREAM_QUEUE_SIZE` if you want to smooth
bursts before they hit upstream.







  Install di Termux (Android):

  pkg update && pkg install nodejs git
  git clone https://github.com/zer00cloud/zero-proxy.git
  cd zero-proxy
  node server.js

  Akses di browser: http://localhost:8787

  ---
  Install di Server (Ubuntu/Debian):
  
  sudo apt update && sudo apt install -y nodejs npm git
  git clone https://github.com/zer00cloud/zero-proxy.git
  cd zero-proxy
  node server.js

  ---
  Install di Server (dengan PM2 untuk auto-restart):
  
  git clone https://github.com/zer00cloud/zero-proxy.git
  cd zero-proxy
  npm install -g pm2
  pm2 start ecosystem.config.cjs
  pm2 save

  ---
  Cara pakai:
  
  ┌────────────────────────────┬───────────────────────────┬─────────────────────┐
  │            Mode            │         Endpoint          │       Format        │
  ├────────────────────────────┼───────────────────────────┼─────────────────────┤
  │ Chat Completions (default) │ POST /v1/chat/completions │ { messages: [...] } │
  ├────────────────────────────┼───────────────────────────┼─────────────────────┤
  │ Responses API (baru)       │ POST /v1/responses        │ { input: "..." }    │
  └────────────────────────────┴───────────────────────────┴─────────────────────┘

  Untuk n8n OpenAI node:
  - Base URL: http://<IP>:8787/v1
  - API Key: isi sembarang (misal sk-dummy) atau kosong
