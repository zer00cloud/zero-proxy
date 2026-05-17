import fs from "node:fs";
import path from "node:path";

const API_KEYS_FILE = "./data/api-keys.json";

/**
 * API Key Manager - Persistent storage for per-model API keys
 *
 * Stores API keys in JSON file with atomic writes and 600 permissions.
 */
function createAPIKeyManager() {
  let apiKeys = {};
  const cursors = new Map();

  function normalizeKeys(value) {
    if (Array.isArray(value)) {
      return [...new Set(value.map((item) => String(item || "").trim()).filter(Boolean))];
    }
    if (typeof value !== "string") return [];
    return [...new Set(
      value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean)
    )];
  }

  // Load existing API keys from file
  function load() {
    try {
      if (fs.existsSync(API_KEYS_FILE)) {
        const data = fs.readFileSync(API_KEYS_FILE, "utf8");
        apiKeys = JSON.parse(data);
      }
    } catch (err) {
      console.error("Failed to load API keys:", err.message);
      apiKeys = {};
    }
  }

  // Save API keys to file with atomic write
  function save() {
    try {
      const dir = path.dirname(API_KEYS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const tempFile = `${API_KEYS_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(apiKeys, null, 2), "utf8");
      fs.renameSync(tempFile, API_KEYS_FILE);

      // Set file permissions to 600 (owner read/write only)
      fs.chmodSync(API_KEYS_FILE, 0o600);
    } catch (err) {
      console.error("Failed to save API keys:", err.message);
    }
  }

  // Set API key for a model
  function setKey(modelId, key) {
    const keys = normalizeKeys(key);
    if (keys.length <= 1) {
      apiKeys[modelId] = keys[0] || "";
    } else {
      apiKeys[modelId] = keys;
    }
    cursors.delete(modelId);
    save();
  }

  // Get API key for a model
  function getKey(modelId) {
    const keys = getKeys(modelId);
    return keys[0] || null;
  }

  function getKeys(modelId) {
    return normalizeKeys(apiKeys[modelId]);
  }

  function getNextKey(modelId) {
    const keys = getKeys(modelId);
    if (keys.length === 0) return null;
    if (keys.length === 1) return keys[0];
    const current = cursors.get(modelId) || 0;
    const nextKey = keys[current % keys.length];
    cursors.set(modelId, (current + 1) % keys.length);
    return nextKey;
  }

  // Check if API key exists for a model
  function hasKey(modelId) {
    return getKeys(modelId).length > 0;
  }

  // Delete API key for a model
  function deleteKey(modelId) {
    delete apiKeys[modelId];
    cursors.delete(modelId);
    save();
  }

  // Initialize by loading existing data
  load();

  return {
    setKey,
    getKey,
    getKeys,
    getNextKey,
    hasKey,
    deleteKey,
  };
}

export const apiKeyManager = createAPIKeyManager();
