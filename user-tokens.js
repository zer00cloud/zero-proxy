import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const USER_TOKENS_FILE = "./data/user-tokens.json";

/**
 * User Token Manager - Per-user API key isolation
 *
 * Each user stores their own provider tokens identified by a unique user ID.
 * Tokens are stored locally in data/ (gitignored), never exposed to frontend.
 */
function createUserTokenManager() {
  let users = {};

  function load() {
    try {
      if (fs.existsSync(USER_TOKENS_FILE)) {
        const data = fs.readFileSync(USER_TOKENS_FILE, "utf8");
        users = JSON.parse(data);
      }
    } catch (err) {
      console.error("Failed to load user tokens:", err.message);
      users = {};
    }
  }

  function save() {
    try {
      const dir = path.dirname(USER_TOKENS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tempFile = `${USER_TOKENS_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(users, null, 2), "utf8");
      fs.renameSync(tempFile, USER_TOKENS_FILE);
      fs.chmodSync(USER_TOKENS_FILE, 0o600);
    } catch (err) {
      console.error("Failed to save user tokens:", err.message);
    }
  }

  function generateUserId() {
    return crypto.randomUUID();
  }

  function createUser(userId) {
    if (!userId) userId = generateUserId();
    if (!users[userId]) {
      users[userId] = { tokens: {}, createdAt: Date.now() };
      save();
    }
    return userId;
  }

  function setToken(userId, provider, token) {
    if (!users[userId]) {
      users[userId] = { tokens: {}, createdAt: Date.now() };
    }
    users[userId].tokens[provider] = token;
    save();
  }

  function getToken(userId, provider) {
    return users[userId]?.tokens?.[provider] || null;
  }

  function hasToken(userId, provider) {
    return !!users[userId]?.tokens?.[provider];
  }

  function deleteToken(userId, provider) {
    if (users[userId]?.tokens) {
      delete users[userId].tokens[provider];
      save();
    }
  }

  function getProviders(userId) {
    if (!users[userId]) return [];
    return Object.keys(users[userId].tokens);
  }

  function userExists(userId) {
    return !!users[userId];
  }

  function deleteUser(userId) {
    delete users[userId];
    save();
  }

  load();

  return {
    generateUserId,
    createUser,
    setToken,
    getToken,
    hasToken,
    deleteToken,
    getProviders,
    userExists,
    deleteUser,
  };
}

export const userTokenManager = createUserTokenManager();
