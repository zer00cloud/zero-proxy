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
