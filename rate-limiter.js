const DEFAULT_LIMIT = Number(process.env.RATE_LIMIT_PER_MIN || 30);
const COOLDOWN_MS = 60000;
const WINDOW_MS = 60000;
const CLEANUP_INTERVAL = 300000;

function createRateLimiter() {
  // Map<userId, { requests: number[], cooldowns: Map<model, expiry>, limit: number|null, modelRequests: Map<model, number[]> }>
  const users = new Map();

  function getUser(userId) {
    if (!users.has(userId)) {
      users.set(userId, { requests: [], cooldowns: new Map(), limit: null, modelRequests: new Map() });
    }
    return users.get(userId);
  }

  function isAllowed(userId) {
    const user = getUser(userId);
    const now = Date.now();
    const limit = user.limit || DEFAULT_LIMIT;
    user.requests = user.requests.filter(t => now - t < WINDOW_MS);
    return user.requests.length < limit;
  }

  function recordRequest(userId, model = null) {
    const user = getUser(userId);
    const now = Date.now();
    user.requests.push(now);
    if (model) {
      if (!user.modelRequests.has(model)) {
        user.modelRequests.set(model, []);
      }
      user.modelRequests.get(model).push(now);
    }
  }

  function getRemainingRequests(userId) {
    const user = getUser(userId);
    const now = Date.now();
    const limit = user.limit || DEFAULT_LIMIT;
    user.requests = user.requests.filter(t => now - t < WINDOW_MS);
    return Math.max(0, limit - user.requests.length);
  }

  function getRetryAfter(userId) {
    const user = getUser(userId);
    if (user.requests.length === 0) return 0;
    const oldest = user.requests[0];
    const waitMs = WINDOW_MS - (Date.now() - oldest);
    return Math.max(1, Math.ceil(waitMs / 1000));
  }

  function setCooldown(userId, model, durationMs = COOLDOWN_MS) {
    const user = getUser(userId);
    user.cooldowns.set(model, Date.now() + durationMs);
  }

  function isModelCooledDown(userId, model) {
    const user = getUser(userId);
    const expiry = user.cooldowns.get(model);
    if (!expiry) return false;
    if (Date.now() >= expiry) {
      user.cooldowns.delete(model);
      return false;
    }
    return true;
  }

  function setUserLimit(userId, limit) {
    const user = getUser(userId);
    user.limit = limit;
  }

  function getUserLimit(userId) {
    const user = getUser(userId);
    return user.limit || DEFAULT_LIMIT;
  }

  // Get per-model usage stats for a user
  function getUserModelStats(userId) {
    const user = getUser(userId);
    const now = Date.now();
    const stats = {};

    for (const [model, timestamps] of user.modelRequests.entries()) {
      const recent = timestamps.filter(t => now - t < WINDOW_MS);
      user.modelRequests.set(model, recent);
      const cooldownExpiry = user.cooldowns.get(model);
      const cooledDown = cooldownExpiry && now < cooldownExpiry;
      stats[model] = {
        requests_in_window: recent.length,
        cooled_down: !!cooledDown,
        cooldown_remaining: cooledDown ? Math.ceil((cooldownExpiry - now) / 1000) : 0,
      };
    }

    return stats;
  }

  function cleanup() {
    const now = Date.now();
    for (const [userId, user] of users.entries()) {
      user.requests = user.requests.filter(t => now - t < WINDOW_MS);
      for (const [model, expiry] of user.cooldowns.entries()) {
        if (now >= expiry) user.cooldowns.delete(model);
      }
      for (const [model, timestamps] of user.modelRequests.entries()) {
        const recent = timestamps.filter(t => now - t < WINDOW_MS);
        if (recent.length === 0) {
          user.modelRequests.delete(model);
        } else {
          user.modelRequests.set(model, recent);
        }
      }
      if (user.requests.length === 0 && user.cooldowns.size === 0 && user.modelRequests.size === 0 && user.limit === null) {
        users.delete(userId);
      }
    }
  }

  setInterval(cleanup, CLEANUP_INTERVAL);

  return {
    isAllowed,
    recordRequest,
    getRemainingRequests,
    getRetryAfter,
    setCooldown,
    isModelCooledDown,
    setUserLimit,
    getUserLimit,
    getUserModelStats,
    cleanup,
  };
}

export const rateLimiter = createRateLimiter();
