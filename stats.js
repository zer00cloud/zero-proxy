import fs from "node:fs";
import path from "node:path";

const STATS_FILE = "./data/stats.json";
const RETENTION_DAYS = 7;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

/**
 * StatsTracker - File-based persistent statistics tracking
 *
 * Tracks request metrics in minute-based buckets with 7-day retention.
 * Data persists across server restarts via atomic file writes.
 */
function createStatsTracker() {
  let stats = {
    buckets: [],
    lastUpdated: Date.now(),
  };

  // Load existing stats from file
  function load() {
    try {
      if (fs.existsSync(STATS_FILE)) {
        const data = fs.readFileSync(STATS_FILE, "utf8");
        stats = JSON.parse(data);
        pruneOldBuckets();
      }
    } catch (err) {
      console.error("Failed to load stats:", err.message);
      stats = { buckets: [], lastUpdated: Date.now() };
    }
  }

  // Save stats to file with atomic write
  function save() {
    try {
      const dir = path.dirname(STATS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const tempFile = `${STATS_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(stats, null, 2), "utf8");
      fs.renameSync(tempFile, STATS_FILE);

      // Set file permissions to 600 (owner read/write only)
      fs.chmodSync(STATS_FILE, 0o600);
    } catch (err) {
      console.error("Failed to save stats:", err.message);
    }
  }

  // Remove buckets older than 7 days
  function pruneOldBuckets() {
    const cutoff = Date.now() - RETENTION_MS;
    stats.buckets = stats.buckets.filter(b => b.timestamp >= cutoff);
  }

  // Get or create bucket for current minute
  function getCurrentBucket() {
    const now = Date.now();
    const bucketTime = Math.floor(now / 60000) * 60000; // Round to minute

    let bucket = stats.buckets.find(b => b.timestamp === bucketTime);
    if (!bucket) {
      bucket = {
        timestamp: bucketTime,
        count: 0,
        errors: 0,
        latencies: [],
        tokens: 0,
        models: {},
      };
      stats.buckets.push(bucket);

      // Keep buckets sorted by timestamp
      stats.buckets.sort((a, b) => a.timestamp - b.timestamp);

      // Prune old buckets when adding new ones
      pruneOldBuckets();
    }

    return bucket;
  }

  // Record a request
  function recordRequest(modelId, latencyMs, statusCode, tokens = 0) {
    const bucket = getCurrentBucket();

    bucket.count++;
    bucket.latencies.push(latencyMs);
    bucket.tokens += tokens;

    if (statusCode >= 400) {
      bucket.errors++;
    }

    if (!bucket.models[modelId]) {
      bucket.models[modelId] = { count: 0, tokens: 0 };
    }
    bucket.models[modelId].count++;
    bucket.models[modelId].tokens += tokens;

    stats.lastUpdated = Date.now();

    // Save to disk (async would be better but keeping it simple)
    save();
  }

  // Calculate average latency for a bucket
  function avgLatency(bucket) {
    if (bucket.latencies.length === 0) return 0;
    const sum = bucket.latencies.reduce((a, b) => a + b, 0);
    return Math.round(sum / bucket.latencies.length);
  }

  // Get current statistics
  function getStats() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Calculate requests per minute (last minute)
    const recentBuckets = stats.buckets.filter(b => b.timestamp >= oneMinuteAgo);
    const recentRequests = recentBuckets.reduce((sum, b) => sum + b.count, 0);
    const recentTokens = recentBuckets.reduce((sum, b) => sum + b.tokens, 0);

    // Calculate total stats
    const totalRequests = stats.buckets.reduce((sum, b) => sum + b.count, 0);
    const totalErrors = stats.buckets.reduce((sum, b) => sum + b.errors, 0);
    const totalTokens = stats.buckets.reduce((sum, b) => sum + b.tokens, 0);

    // Calculate average latency across all buckets
    let allLatencies = [];
    stats.buckets.forEach(b => {
      allLatencies = allLatencies.concat(b.latencies);
    });
    const avgLatencyMs = allLatencies.length > 0
      ? Math.round(allLatencies.reduce((a, b) => a + b, 0) / allLatencies.length)
      : 0;

    // Aggregate per-model stats
    const modelStats = {};
    stats.buckets.forEach(bucket => {
      Object.entries(bucket.models).forEach(([modelId, data]) => {
        if (!modelStats[modelId]) {
          modelStats[modelId] = { count: 0, tokens: 0 };
        }
        modelStats[modelId].count += data.count;
        modelStats[modelId].tokens += data.tokens;
      });
    });

    // Convert to array for easier consumption
    const modelStatsArray = Object.entries(modelStats).map(([model, data]) => ({
      model,
      count: data.count,
      tokens: data.tokens,
    }));

    // Get active models (models with requests in last hour)
    const oneHourAgo = now - 3600000;
    const recentModels = new Set();
    stats.buckets
      .filter(b => b.timestamp >= oneHourAgo)
      .forEach(b => {
        Object.keys(b.models).forEach(m => recentModels.add(m));
      });

    // Prepare bucket data for charts (last 60 buckets)
    const bucketsForChart = stats.buckets.slice(-60).map(b => ({
      timestamp: b.timestamp,
      count: b.count,
      errors: b.errors,
      avg_latency: avgLatency(b),
      tokens: b.tokens,
    }));

    return {
      uptime_seconds: Math.floor((now - (stats.buckets[0]?.timestamp || now)) / 1000),
      total_requests: totalRequests,
      requests_per_minute: recentRequests,
      tokens_per_minute: recentTokens,
      avg_latency_ms: avgLatencyMs,
      error_count: totalErrors,
      active_models: recentModels.size,
      model_stats: modelStatsArray,
      buckets: bucketsForChart,
    };
  }

  // Initialize by loading existing data
  load();

  return {
    recordRequest,
    getStats,
  };
}

export const statsTracker = createStatsTracker();
