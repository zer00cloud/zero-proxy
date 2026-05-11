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
    apiKeys[modelId] = key;
    save();
  }

  // Get API key for a model
  function getKey(modelId) {
    return apiKeys[modelId] || null;
  }

  // Check if API key exists for a model
  function hasKey(modelId) {
    return !!apiKeys[modelId];
  }

  // Delete API key for a model
  function deleteKey(modelId) {
    delete apiKeys[modelId];
    save();
  }

  // Initialize by loading existing data
  load();

  return {
    setKey,
    getKey,
    hasKey,
    deleteKey,
  };
}

export const apiKeyManager = createAPIKeyManager();
