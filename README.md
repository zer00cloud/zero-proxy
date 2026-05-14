# zen-proxy

OpenAI-compatible proxy for the free models hosted on OpenCode Zen
(`https://opencode.ai/zen/v1`). Point any OpenAI SDK / tool at this proxy
and get `minimax-m2.5-free`, `big-pickle`, `nemotron-3-super-free` with
automatic fallback when one is down or rate-limited.

## Run

    node server.js
    # or: pm2 start ecosystem.config.cjs

Default listens on `0.0.0.0:8787`.

## Use

    curl http://localhost:8787/v1/chat/completions \
      -H "Content-Type: application/json" \
      -d '{"model":"auto","messages":[{"role":"user","content":"hi"}]}'

- `model: "auto"` (or omitted) — tries the fallback chain in order.
- `model: "minimax-m2.5-free"` — tries that first, then falls back.
- Streaming (`stream: true`) is proxied straight through, no retry.

## Endpoints

- `GET  /`                      — health / status
- `GET  /v1/models`             — list free models
- `POST /v1/chat/completions`   — OpenAI-compatible chat

## Env

See `.env.example`. Set `OPENCODE_API_KEY` to unlock the full free catalog.
Set `PROXY_KEY` to require clients to authenticate.







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

