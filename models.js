// Free models available on OpenCode Zen.
// `verified: true` = confirmed working without an API key (probed 2026-05-11).
// `verified: false` = listed as free in models.dev but needs OPENCODE_API_KEY
// or upstream is currently down. Kept so users with a key can still pick them.
export const FREE_MODELS = [
  { id: "minimax-m2.5-free",         verified: true,  context: 204800,  output: 131072 },
  { id: "big-pickle",                verified: true,  context: 200000,  output: 128000 },
  { id: "nemotron-3-super-free",     verified: true,  context: 204800,  output: 128000 },
  { id: "glm-4.7-free",              verified: false, context: 204800,  output: 131072 },
  { id: "kimi-k2.5-free",            verified: false, context: 262144,  output: 262144 },
  { id: "glm-5-free",                verified: false, context: 204800,  output: 131072 },
  { id: "minimax-m2.1-free",         verified: false, context: 204800,  output: 131072 },
  { id: "qwen3.6-plus-free",         verified: false, context: 1048576, output: 64000  },
  { id: "ling-2.6-flash-free",       verified: false, context: 262100,  output: 32800  },
  { id: "grok-code",                 verified: false, context: 256000,  output: 256000 },
  { id: "mimo-v2-flash-free",        verified: false, context: 262144,  output: 65536  },
  { id: "hy3-preview-free",          verified: false, context: 256000,  output: 64000  },
  { id: "mimo-v2-pro-free",          verified: false, context: 1048576, output: 64000  },
  { id: "mimo-v2-omni-free",         verified: false, context: 262144,  output: 64000  },
  { id: "ring-2.6-1t-free",          verified: false, context: 262000,  output: 66000  },
  { id: "trinity-large-preview-free", verified: false, context: 131072, output: 131072 },
];

// Order of models to try when client sends `model: "auto"` (or omits it).
// Only includes verified-working models so auto-mode never 401s.
export const AUTO_FALLBACK_CHAIN = FREE_MODELS
  .filter((m) => m.verified)
  .map((m) => m.id);

export const MODEL_IDS = new Set(FREE_MODELS.map((m) => m.id));
