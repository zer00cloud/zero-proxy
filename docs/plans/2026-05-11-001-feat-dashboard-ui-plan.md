---
title: "feat: Add ProxyZero futuristic dashboard UI"
type: feat
status: active
created: 2026-05-11
---

# feat: Add ProxyZero futuristic dashboard UI

## Summary

Implement a futuristic dark-themed web dashboard for zen-proxy that displays available AI models with per-model API key management, real-time usage statistics with 16-model vertical chart visualization, interactive model testing, and Cloudflare Tunnel setup for internet access. The dashboard follows the ProxyZero design system specified in `ui.md` with purple/cyan accent colors, dense information layout, and a modern SaaS aesthetic.

The implementation adds static HTML serving to the existing Node.js HTTP server without disrupting the current OpenAI-compatible JSON API endpoints. The dashboard will be accessible at `/dashboard` while preserving all existing API routes for backward compatibility. Statistics are persisted to disk via JSON file storage, and polling intervals adapt based on token usage patterns.

---

## Problem Frame

zen-proxy currently operates as a headless API proxy with no visual interface. Users interact exclusively through curl commands or API clients, making it difficult to:

- Discover which models are available and their capabilities
- Configure API keys for non-free models without editing environment files
- Test models interactively without writing code
- Monitor proxy health and usage patterns across all 16 models simultaneously
- Understand which models work anonymously vs. require API keys
- Visualize per-model usage trends in a single unified view
- Access the proxy from outside the local network without manual port forwarding

The ui.md file contains a complete design specification for a ProxyZero dashboard, but it exists only as static HTML mockups with hardcoded data. The task is to integrate this design into the running server with live data, add per-model API key management, implement persistent file-based statistics storage, create a 16-model vertical chart visualization, add adaptive polling based on token usage, and provide Cloudflare Tunnel setup documentation for internet access.

---

## Requirements

### R1. Serve Dashboard at Root Path
The dashboard HTML must be accessible at `GET /` while preserving the current JSON status endpoint functionality at a new path.

**Success criteria:**
- Visiting `http://localhost:8787/` in a browser displays the dashboard UI
- Existing API clients using `GET /` for JSON status are not broken (provide migration path)
- Dashboard loads in under 500ms on localhost

### R2. Display Live Model Catalog with API Key Management
The dashboard must show all models from `FREE_MODELS` with accurate metadata and per-model API key configuration.

**Success criteria:**
- Each model card displays: name, owner, context length, max output, verified status
- Models marked `verified: true` show a "FREE" badge
- Models marked `verified: false` show an API key input field on the card
- API keys are saved to persistent storage (JSON file) when entered
- Saved API keys are loaded on dashboard page load and pre-filled in input fields
- API keys are used when making requests to non-free models
- Model data is fetched from `GET /v1/models` endpoint (no hardcoded duplication)

### R3. Interactive Model Testing
Users must be able to test any model directly from the dashboard.

**Success criteria:**
- Each model card has a "Test" button
- Clicking "Test" opens a modal with a text input and submit button
- Submitting sends a request to `POST /v1/chat/completions` with the selected model
- Response is displayed in the modal with proper formatting
- Loading states are shown during API calls
- Errors are displayed clearly (rate limits, auth failures, model unavailable)

### R4. Real-Time Usage Statistics with 16-Model Vertical Chart
The dashboard must display live proxy metrics with a unified chart showing all 16 models.

**Success criteria:**
- Chart displays 16 vertical lines/bars, one per model (all models in single chart)
- Each vertical line represents usage/activity for that specific model
- Stats cards show: total requests, active models count, average latency, error count
- Metrics update automatically with adaptive polling interval based on token usage:
  - High traffic (>100 tokens/min): poll every 5 seconds
  - Medium traffic (10-100 tokens/min): poll every 10 seconds
  - Low traffic (<10 tokens/min): poll every 30 seconds
- Statistics are persisted to disk (JSON file) and survive server restarts
- Initial page load shows "No data yet" state gracefully
- Chart height scales proportionally to usage volume per model

### R5. Match ProxyZero Design System
The UI must precisely match the design specification in `ui.md`.

**Success criteria:**
- Color palette: purple primary (#c0c1ff), cyan secondary (#4cd7f6), dark backgrounds
- Typography: Inter + Geist fonts, Material Symbols icons
- Layout: responsive grid, compact spacing, futuristic aesthetic
- Animations: pulse indicators, hover transitions, smooth modal open/close
- Mobile-responsive with bottom navigation on small screens
- All UI components from ui.md present: model cards, test modal, charts, stats cards

### R6. Cloudflare Tunnel Setup for Internet Access
Provide documentation for exposing the proxy to the internet without a custom domain.

**Success criteria:**
- README.md includes Cloudflare Tunnel setup instructions
- Instructions cover: cloudflared installation, tunnel creation, configuration
- Document how to get free cloudflare.com subdomain URL
- Include security considerations for public exposure
- Provide example tunnel configuration for port 8787

---

## Scope Boundaries

### In Scope
- Serving static HTML dashboard at `/dashboard` path
- Fetching live model data from existing `/v1/models` endpoint
- Per-model API key input fields and persistent storage (JSON file)
- Interactive model testing via modal interface
- Real-time usage statistics with file-based persistence
- 16-model vertical chart visualization (all models in single chart)
- Adaptive polling interval based on token usage patterns
- Exact visual match to ui.md design specification
- Mobile-responsive layout
- Cloudflare Tunnel setup documentation for internet access

### Deferred to Follow-Up Work
- User authentication for dashboard access (currently public, no auth required)
- Advanced charting (drill-down, date range selection, export)
- Model enable/disable toggles (UI exists but not wired to backend)
- WebSocket-based real-time updates (using adaptive polling for now)
- Dashboard configuration UI (theme customization, refresh intervals)
- Multi-user session tracking
- Historical data beyond 7 days (current retention limit)
- API key encryption at rest (currently stored as plaintext in JSON)

### Outside This Product's Identity
- Admin panel for managing upstream API keys
- Billing or usage quota enforcement
- User account management
- Model training or fine-tuning interfaces
- Log aggregation or external monitoring integrations

---

## Key Technical Decisions

### D1. Single-File HTML with Client-Side Rendering
**Decision:** Serve a single self-contained HTML file with embedded JavaScript that fetches data from existing API endpoints.

**Rationale:**
- Matches project's zero-dependency philosophy (no build tools, no frameworks)
- Leverages existing JSON API endpoints without duplication
- Simplifies deployment (one additional file: `public/index.html`)
- Enables real-time updates via client-side polling
- Tailwind CSS loaded from CDN (already specified in ui.md)

**Alternatives considered:**
- Server-side template rendering (adds complexity, requires template engine dependency)
- Separate frontend build process (contradicts zero-dependency approach)
- Framework-based SPA (React/Vue - massive dependency overhead for this use case)

### D2. File-Based Persistent Statistics Storage
**Decision:** Store statistics in a JSON file (`data/stats.json`) that persists across server restarts, with a 7-day retention window.

**Rationale:**
- User explicitly requested persistent storage over in-memory approach
- No external database dependency (maintains zero-dependency philosophy)
- Simple JSON format is human-readable and easy to debug
- Bounded storage: 7-day retention prevents unbounded disk growth
- Atomic writes prevent corruption during server crashes
- Fast read/write for dashboard queries (<10ms)

**Trade-offs:**
- File I/O adds ~5-10ms latency per stats update (acceptable for this use case)
- Concurrent writes need locking mechanism (use atomic rename pattern)
- 7-day limit means no long-term trend analysis
- No query optimization (full file read on each dashboard load)

**Implementation approach:**
- Write to temp file, then atomic rename to prevent corruption
- Load stats on server startup
- Prune entries older than 7 days on each write
- Structure: `{buckets: [{timestamp, count, errors, latency, models: {}}], lastUpdated}`

### D3. Adaptive Polling Based on Token Usage
**Decision:** Dashboard polling interval adjusts dynamically based on token throughput: 5s for high traffic, 10s for medium, 30s for low.

**Rationale:**
- User explicitly requested adaptive polling tied to token usage
- Reduces unnecessary requests during idle periods (saves bandwidth)
- Increases responsiveness during active usage (better UX)
- Simple to implement (no WebSocket library needed)
- Works through all proxies and firewalls

**Implementation approach:**
- Server calculates tokens/minute in `/api/stats` response
- Client JavaScript adjusts `setInterval` delay based on returned rate:
  ```javascript
  if (tokensPerMin > 100) interval = 5000;
  else if (tokensPerMin > 10) interval = 10000;
  else interval = 30000;
  ```
- Smooth transitions: clear old interval, set new one

**Trade-offs:**
- Slightly more complex than fixed polling
- Interval changes may feel jarring (mitigated by smooth transitions)
- Still higher bandwidth than WebSocket push (acceptable for this scope)

### D4. Dashboard Path Strategy - Path-Based Approach (No Breaking Change)
**Decision:** Serve dashboard at `GET /dashboard`, keep `GET /` as JSON status (unchanged). Add `GET /api/status` as an alias for consistency.

**Rationale:**
- **Zero breaking changes** - Existing API clients continue working without modification
- **Accept header detection is fundamentally flawed** - curl's default `Accept: */*` is ambiguous (cannot distinguish API clients from browsers)
- **Health check compatibility** - Load balancers and monitoring systems polling `GET /` continue working
- **Clear separation** - `/` = API index, `/dashboard` = UI, `/api/*` = machine API, `/v1/*` = OpenAI-compatible
- **Simpler implementation** - No version headers, no transition phases, no migration timeline

**Alternatives considered:**
- **Serve HTML at root with Accept header detection** - Rejected due to ambiguity: `Accept: */*` from curl cannot reliably indicate JSON preference. Would break either browsers or API clients.
- **Version header with phased rollout** - Adds complexity (3-phase migration, deprecation warnings, timeline management) for minimal benefit. Root path is not essential for dashboard discoverability.
- **Separate port (8788)** - Over-engineered for this use case. Complicates deployment and creates CORS issues.

**Migration path:**
- No migration needed - this is a purely additive change
- Document new `/dashboard` endpoint in README.md
- Optionally add redirect: `GET /` with `Accept: text/html` → `302 /dashboard` for browser convenience

### D5. 16-Model Vertical Chart Visualization
**Decision:** Single chart with 16 vertical bars/lines, one per model, showing usage distribution across all models simultaneously.

**Rationale:**
- User explicitly requested "1 garis vertikal 1 model itu total vertikalcharts nya 16 sama dengan models nya"
- Provides at-a-glance view of which models are most/least used
- Easier to compare model popularity than separate charts
- Matches dashboard's dense information aesthetic
- Fits naturally in ui.md's chart section

**Implementation approach:**
- X-axis: 16 model names (abbreviated if needed)
- Y-axis: Request count or token usage
- Each vertical bar represents cumulative usage for that model
- Color-code by status: green (verified/free), purple (requires API key), red (error rate >10%)
- Hover tooltip shows detailed stats per model

**Trade-offs:**
- Less temporal detail than time-series chart (no "usage over time" view)
- May be crowded with 16 bars (mitigated by compact design)
- Cannot show multiple metrics simultaneously (choose count vs latency vs tokens)

### D6. Per-Model API Key Management
**Decision:** Each non-free model card includes an input field for API key, stored in `data/api-keys.json` file.

**Rationale:**
- User explicitly requested "ada from api setiap card yg tidak free"
- Eliminates need to edit `.env` file or restart server
- Per-model keys enable using different providers/accounts
- Persistent storage means keys survive server restarts
- UI-driven configuration is more user-friendly than file editing

**Implementation approach:**
- Model card renders input field only if `verified: false`
- On blur/submit, POST to `/api/models/:id/key` with new key
- Server stores in `data/api-keys.json`: `{modelId: encryptedKey}`
- Keys loaded on startup and used in model requests
- Input field shows masked value (••••••) if key exists

**Security considerations:**
- Keys stored as plaintext in JSON (encryption deferred to follow-up)
- File permissions set to 600 (owner read/write only)
- No key validation on input (validated on first model request)
- Keys never sent to client (only "key exists" boolean)

**Trade-offs:**
- Plaintext storage is security risk (acceptable for local/dev use)
- No key rotation or expiry mechanism
- No audit log of key changes

---

## System-Wide Impact

### Modified Components
- **server.js** - Add HTML serving, file-based statistics tracking, new `/api/stats` endpoint, API key management endpoints
- **README.md** - Document dashboard access, Cloudflare Tunnel setup, update endpoint list
- **models.js** - Add API key loading and injection into model requests

### New Components
- **public/index.html** - Dashboard UI (extracted and adapted from ui.md)
- **data/stats.json** - Persistent statistics storage (created on first run)
- **data/api-keys.json** - Per-model API key storage (created on first run)

### API Contract Changes
- `GET /` - **No change**: Returns JSON status (preserved for backward compatibility)
- `GET /dashboard` - **New endpoint**: Returns HTML dashboard UI
- `GET /api/status` - **New endpoint**: Returns JSON status (alias for `/` for consistency)
- `GET /api/stats` - **New endpoint**: Returns usage statistics with tokens/min for adaptive polling
- `POST /api/models/:id/key` - **New endpoint**: Save API key for specific model
- `DELETE /api/models/:id/key` - **New endpoint**: Remove API key for specific model

### Backward Compatibility
- All existing endpoints unchanged (full backward compatibility)
- No migration required for existing API clients
- Optional: Add `302` redirect from `GET /` to `/dashboard` when `Accept: text/html` header present (browser convenience)

### Performance Considerations
- Static HTML serving adds negligible latency (<1ms)
- File-based statistics: ~5-10ms read on dashboard load, ~5-10ms write per request
- Dashboard polling creates 1 request per 5-30 seconds per client (adaptive, low impact)
- Memory footprint increases by ~100KB (stats data + HTML file + API keys)
- Disk usage: ~1-5MB for 7 days of statistics (depends on traffic volume)

### Security Considerations
- Dashboard has no authentication (public access as requested by user)
- API keys stored as plaintext in `data/api-keys.json` (encryption deferred)
- File permissions set to 600 for sensitive data files
- Client-side code is public (no secrets embedded)
- CORS remains enabled (`Access-Control-Allow-Origin: *`)
- XSS protection via `textContent` rendering (never `innerHTML`)
- CSRF protection for POST requests via token validation

---

## Implementation Units

### U1. Add File-Based Statistics Tracking Infrastructure

**Goal:** Implement persistent request metrics collection with JSON file storage and 7-day retention.

**Requirements:** R4

**Dependencies:** None

**Files:**
- `server.js` (modify)
- `data/stats.json` (create on first run)

**Approach:**
- Create a `StatsTracker` module with file-based persistence
- Track: request count, latency, errors, token usage, per-model usage
- Store in `data/stats.json` with structure:
  ```json
  {
    "buckets": [
      {"timestamp": 1715432400000, "count": 45, "errors": 2, "avg_latency": 230, "tokens": 1500, "models": {"minimax-m2.5-free": 30, "big-pickle": 15}}
    ],
    "lastUpdated": 1715432460000
  }
  ```
- Load stats on server startup (create empty if not exists)
- Atomic write pattern: write to temp file, then rename
- Prune entries older than 7 days on each write
- Calculate derived metrics: requests/min, tokens/min, avg latency, error rate

**Patterns to follow:**
- Functional style matching existing codebase (avoid classes if possible - use closure pattern)
- Timestamp-based bucketing: `Math.floor(Date.now() / 60000)` for minute buckets
- Similar to existing `log()` helper pattern
- Use `fs.writeFileSync` with atomic rename for data integrity

**Test scenarios:**
- Happy path: Record 100 requests, verify bucket counts are correct
- Bucket rollover: Record requests across minute boundary, verify new bucket created
- File persistence: Record data, restart server, verify data loaded correctly
- 7-day retention: Record 8 days of data, verify oldest day pruned
- Concurrent requests: Simulate 10 simultaneous requests, verify no race conditions
- Latency calculation: Record requests with varying response times, verify average is correct
- Error tracking: Record mix of 200/400/500 responses, verify error count accurate
- Token tracking: Record requests with token usage, verify tokens/min calculation
- Per-model stats: Record requests to different models, verify per-model counts

**Verification:**
- Unit tests pass for bucket management and metric calculation
- Manual test: Make 10 requests, verify `getStats()` returns count=10
- Restart server, verify stats persist
- Check `data/stats.json` file exists and contains valid JSON

---

### U2. Add `/api/stats` Endpoint with Adaptive Polling Support

**Goal:** Expose statistics data as JSON endpoint for dashboard consumption with tokens/min for adaptive polling.

**Requirements:** R4

**Dependencies:** U1

**Files:**
- `server.js` (modify)

**Approach:**
- Add new route handler: `GET /api/stats`
- Return JSON with structure:
  ```json
  {
    "uptime_seconds": 12345,
    "total_requests": 5000,
    "requests_per_minute": 42,
    "tokens_per_minute": 850,
    "avg_latency_ms": 250,
    "error_count": 12,
    "active_models": 3,
    "model_stats": [
      {"model": "minimax-m2.5-free", "count": 3000, "tokens": 45000},
      {"model": "big-pickle", "count": 1500, "tokens": 22000},
      ...
    ],
    "buckets": [
      {"timestamp": 1715432400000, "count": 45, "errors": 2, "avg_latency": 230, "tokens": 1500},
      ...
    ]
  }
  ```
- Include `tokens_per_minute` field for client-side adaptive polling logic
- Include per-model stats for 16-model chart rendering
- Include last 60 buckets for time-series data (if needed)
- Add CORS headers (already standard in codebase)

**Patterns to follow:**
- Use existing `json(res, status, body)` helper
- Match existing route handler structure (`if (req.method === "GET" && url.pathname === "/api/stats")`)

**Test scenarios:**
- Happy path: GET /api/stats returns 200 with valid JSON structure
- Empty state: GET /api/stats before any requests returns zeros gracefully
- Data accuracy: After 5 requests, verify total_requests=5 in response
- Tokens/min calculation: Verify tokens_per_minute field present and accurate
- Model stats: Verify model_stats array contains all 16 models
- Bucket array: Verify buckets array has max 60 entries
- CORS headers: Verify Access-Control-Allow-Origin header present
- Error handling: Verify 500 response if stats calculation throws

**Verification:**
- `curl http://localhost:8787/api/stats` returns valid JSON
- Response matches schema above
- Data updates in real-time as requests are made
- tokens_per_minute field present and accurate

---

### U3. Add `/api/status` Endpoint

**Goal:** Add JSON status endpoint as alias for `GET /` for API consistency.

**Requirements:** R1

**Dependencies:** None

**Files:**
- `server.js` (modify)
- `README.md` (modify)

**Approach:**
- Add new route handler: `GET /api/status`
- Return identical JSON response as current `GET /` handler
- Keep response format identical (service, upstream, models, endpoints)
- Update README.md to document both endpoints

**Patterns to follow:**
- Reuse existing JSON response structure
- Use existing `json()` helper

**Test scenarios:**
- Happy path: GET /api/status returns same JSON as GET /
- Response structure: Verify all fields present (service, upstream, models, endpoints)
- CORS headers: Verify headers match existing behavior
- Consistency: Verify GET / and GET /api/status return identical responses

**Verification:**
- `curl http://localhost:8787/api/status` returns expected JSON
- Response identical to `GET /` behavior
- README.md documents both endpoints

---

### U4. Extract and Adapt Dashboard HTML with 16-Model Vertical Chart

**Goal:** Implement persistent request metrics collection with JSON file storage and 7-day retention.

**Requirements:** R4

**Dependencies:** None

**Files:**
- `server.js` (modify)
- `data/stats.json` (create on first run)

**Approach:**
- Create a `StatsTracker` module with file-based persistence
- Track: request count, latency, errors, token usage, per-model usage
- Store in `data/stats.json` with structure:
  ```json
  {
    "buckets": [
      {"timestamp": 1715432400000, "count": 45, "errors": 2, "avg_latency": 230, "tokens": 1500, "models": {"minimax-m2.5-free": 30, "big-pickle": 15}}
    ],
    "lastUpdated": 1715432460000
  }
  ```
- Load stats on server startup (create empty if not exists)
- Atomic write pattern: write to temp file, then rename
- Prune entries older than 7 days on each write
- Calculate derived metrics: requests/min, tokens/min, avg latency, error rate

**Patterns to follow:**
- Functional style matching existing codebase (avoid classes if possible - use closure pattern)
- Timestamp-based bucketing: `Math.floor(Date.now() / 60000)` for minute buckets
- Similar to existing `log()` helper pattern
- Use `fs.writeFileSync` with atomic rename for data integrity

**Test scenarios:**
- Happy path: Record 100 requests, verify bucket counts are correct
- Bucket rollover: Record requests across minute boundary, verify new bucket created
- File persistence: Record data, restart server, verify data loaded correctly
- 7-day retention: Record 8 days of data, verify oldest day pruned
- Concurrent requests: Simulate 10 simultaneous requests, verify no race conditions
- Latency calculation: Record requests with varying response times, verify average is correct
- Error tracking: Record mix of 200/400/500 responses, verify error count accurate
- Token tracking: Record requests with token usage, verify tokens/min calculation
- Per-model stats: Record requests to different models, verify per-model counts

**Verification:**
- Unit tests pass for bucket management and metric calculation
- Manual test: Make 10 requests, verify `getStats()` returns count=10
- Restart server, verify stats persist
- Check `data/stats.json` file exists and contains valid JSON

---

### U2. Add `/api/stats` Endpoint with Adaptive Polling Support

**Goal:** Expose statistics data as JSON endpoint for dashboard consumption with tokens/min for adaptive polling.

**Requirements:** R4

**Dependencies:** U1

**Files:**
- `server.js` (modify)

**Approach:**
- Add new route handler: `GET /api/stats`
- Return JSON with structure:
  ```json
  {
    "uptime_seconds": 12345,
    "total_requests": 5000,
    "requests_per_minute": 42,
    "tokens_per_minute": 850,
    "avg_latency_ms": 250,
    "error_count": 12,
    "active_models": 3,
    "model_stats": [
      {"model": "minimax-m2.5-free", "count": 3000, "tokens": 45000},
      {"model": "big-pickle", "count": 1500, "tokens": 22000},
      ...
    ],
    "buckets": [
      {"timestamp": 1715432400000, "count": 45, "errors": 2, "avg_latency": 230, "tokens": 1500},
      ...
    ]
  }
  ```
- Include `tokens_per_minute` field for client-side adaptive polling logic
- Include per-model stats for 16-model chart rendering
- Include last 60 buckets for time-series data (if needed)
- Add CORS headers (already standard in codebase)

**Patterns to follow:**
- Use existing `json(res, status, body)` helper
- Match existing route handler structure (`if (req.method === "GET" && url.pathname === "/api/stats")`)

**Test scenarios:**
- Happy path: GET /api/stats returns 200 with valid JSON structure
- Empty state: GET /api/stats before any requests returns zeros gracefully
- Data accuracy: After 5 requests, verify total_requests=5 in response
- Tokens/min calculation: Verify tokens_per_minute field present and accurate
- Model stats: Verify model_stats array contains all 16 models
- Bucket array: Verify buckets array has max 60 entries
- CORS headers: Verify Access-Control-Allow-Origin header present
- Error handling: Verify 500 response if stats calculation throws

**Verification:**
- `curl http://localhost:8787/api/stats` returns valid JSON
- Response matches schema above
- Data updates in real-time as requests are made
- tokens_per_minute field present and accurate

---

### U3. Add `/api/status` Endpoint

**Goal:** Add JSON status endpoint as alias for `GET /` for API consistency.

**Requirements:** R1

**Dependencies:** None

**Files:**
- `server.js` (modify)
- `README.md` (modify)

**Approach:**
- Add new route handler: `GET /api/status`
- Return identical JSON response as current `GET /` handler
- Keep response format identical (service, upstream, models, endpoints)
- Update README.md to document both endpoints

**Patterns to follow:**
- Reuse existing JSON response structure
- Use existing `json()` helper

**Test scenarios:**
- Happy path: GET /api/status returns same JSON as GET /
- Response structure: Verify all fields present (service, upstream, models, endpoints)
- CORS headers: Verify headers match existing behavior
- Consistency: Verify GET / and GET /api/status return identical responses

**Verification:**
- `curl http://localhost:8787/api/status` returns expected JSON
- Response identical to `GET /` behavior
- README.md documents both endpoints

---

### U4. Extract and Adapt Dashboard HTML with 16-Model Vertical Chart

**Goal:** Create production-ready HTML file from ui.md design specification with XSS-safe rendering and 16-model vertical chart visualization.

**Requirements:** R2, R4, R5

**Dependencies:** None

**Files:**
- `public/index.html` (create)

**Approach:**
- Extract the third HTML variant from ui.md (lines 1765-2539 - includes modal)
- Replace hardcoded model data with client-side fetch to `/v1/models`
- Replace hardcoded stats with client-side fetch to `/api/stats`
- **Replace time-series chart with 16-model vertical bar chart**:
  - X-axis: 16 model names (abbreviated if needed for space)
  - Y-axis: Request count or token usage
  - Each vertical bar represents cumulative usage for that model
  - Color-code: green (verified/free), purple (requires API key), red (error rate >10%)
  - Hover tooltip shows detailed stats per model
- Add JavaScript for:
  - Fetching model list on page load
  - Rendering model cards dynamically with API key input fields for non-free models
  - Adaptive polling: adjust interval based on `tokens_per_minute` from `/api/stats`
  - Updating 16-model chart and stats cards
- **Security: Use `textContent` for all user-controlled content** (model responses, error messages)
- Preserve all Tailwind classes and design system exactly as specified
- Add loading states and error handling

**Technical design:**
```javascript
// Pseudo-code structure
async function loadModels() {
  const res = await fetch('/v1/models');
  const data = await res.json();
  renderModelCards(data.data); // Include API key inputs for non-free models
}

let pollInterval = 10000; // Default 10s
async function updateStats() {
  const res = await fetch('/api/stats');
  const stats = await res.json();
  updateStatsCards(stats);
  render16ModelChart(stats.model_stats); // Vertical bars
  
  // Adaptive polling
  const newInterval = stats.tokens_per_minute > 100 ? 5000 :
                      stats.tokens_per_minute > 10 ? 10000 : 30000;
  if (newInterval !== pollInterval) {
    clearInterval(statsTimer);
    pollInterval = newInterval;
    statsTimer = setInterval(updateStats, pollInterval);
  }
}

// XSS-safe rendering
function displayResponse(content) {
  responseDiv.textContent = content; // NOT innerHTML
}

// 16-model vertical chart
function render16ModelChart(modelStats) {
  const maxCount = Math.max(...modelStats.map(m => m.count));
  modelStats.forEach(stat => {
    const bar = document.getElementById(`bar-${stat.model}`);
    const height = (stat.count / maxCount) * 100;
    bar.style.height = `${height}%`;
    bar.title = `${stat.model}: ${stat.count} requests, ${stat.tokens} tokens`;
  });
}

setInterval(updateStats, pollInterval); // Initial poll
```

**Patterns to follow:**
- Keep HTML structure from ui.md unchanged
- Use vanilla JavaScript (no jQuery or frameworks)
- Follow existing async/await patterns from server.js
- **Never use innerHTML with untrusted content**

**Test scenarios:**
- Page load: Verify dashboard renders without JavaScript errors
- Model cards: Verify all 16 models from FREE_MODELS appear
- Verified badge: Verify "FREE" badge only on verified:true models
- API key inputs: Verify input fields only on non-free models (verified:false)
- 16-model chart: Verify 16 vertical bars render with correct heights
- Chart colors: Verify color coding (green/purple/red) based on model status
- Adaptive polling: Verify interval changes based on tokens/min (check console logs)
- Stats update: Verify stats cards update after polling interval
- Loading states: Verify spinner/skeleton shown during initial fetch
- Error handling: Verify error message if API fetch fails
- Mobile responsive: Verify layout adapts on 375px width
- Icons: Verify Material Symbols icons load correctly
- **XSS protection: Submit prompt returning `<script>alert(1)</script>`, verify it renders as text not executed**
- **XSS protection: Test with `<img src=x onerror=alert(1)>`, verify no execution**

**Verification:**
- Open `http://localhost:8787/dashboard` in browser, verify dashboard displays
- Check browser console for errors (should be zero)
- Verify visual match to ui.md screenshots
- Verify 16-model chart displays all models
- Test on mobile viewport (375px width)
- Verify XSS payloads render as plain text
- Verify polling interval changes (check Network tab timing)

---

### U5. Implement Model Test Modal with CSRF Protection

**Goal:** Add interactive model testing interface with request/response display and CSRF protection.

**Requirements:** R3

**Dependencies:** U4

**Files:**
- `public/index.html` (modify)

**Approach:**
- Add modal HTML structure (backdrop + card)
- Generate CSRF token on page load: `const csrfToken = crypto.randomUUID();`
- Wire "Test" button click to open modal with selected model pre-filled
- Add form with:
  - Textarea for user prompt (default: "Hello, who are you?")
  - Model name display (read-only)
  - Submit button
- On submit:
  - Show loading spinner
  - POST to `/v1/chat/completions` with `{model: selectedModel, messages: [{role: "user", content: prompt}]}`
  - Include CSRF token in headers: `'X-CSRF-Token': csrfToken`
  - **Use `textContent` to display response** (XSS protection)
  - Handle errors (show error message in modal using `textContent`)
- Add close button (X icon) and backdrop click to close modal
- Add escape key handler to close modal

**Technical design:**
```javascript
// Pseudo-code
const csrfToken = crypto.randomUUID();

function openTestModal(modelId) {
  modal.querySelector('.model-name').textContent = modelId;
  modal.classList.remove('hidden');
  modal.querySelector('textarea').focus();
}

async function testModel(modelId, prompt) {
  showLoading();
  try {
    const res = await fetch('/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{role: 'user', content: prompt}]
      })
    });
    const data = await res.json();
    // XSS-safe rendering
    responseDiv.textContent = data.choices[0].message.content;
  } catch (err) {
    errorDiv.textContent = err.message; // XSS-safe
  }
}
```

**Patterns to follow:**
- Modal styling matches ui.md design (backdrop blur, smooth animations)
- Use existing fetch patterns from U4
- Error handling similar to stats fetch
- **Always use textContent, never innerHTML**

**Test scenarios:**
- Covers R3: Open modal: Click "Test" button, verify modal appears with correct model name
- Covers R3: Submit test: Enter prompt, click submit, verify response displays
- Covers R3: Loading state: Verify spinner shows during API call
- Covers R3: Error handling: Test with invalid model, verify error message displays
- Close modal: Click X button, verify modal closes
- Backdrop close: Click outside modal, verify modal closes
- Escape key: Press Escape, verify modal closes
- Multiple tests: Run 3 tests in sequence, verify each works correctly
- Long response: Test with model that returns 500+ char response, verify scrolling works
- Rate limit: Trigger rate limit (if possible), verify error message is clear
- **XSS protection: Submit prompt that returns `<script>alert(1)</script>`, verify renders as text**
- **XSS protection: Submit prompt that returns `<img src=x onerror=alert(1)>`, verify no execution**
- **CSRF token: Verify X-CSRF-Token header included in POST request**

**Verification:**
- Click "Test" on minimax-m2.5-free card, enter "Hello", verify response appears
- Test all 3 verified models, verify each responds
- Verify modal animations are smooth (fade in/out)
- Check browser console for errors during test flow
- Verify XSS payloads render as plain text, not executed
- Verify CSRF token present in request headers (check Network tab)

---

### U6. Add API Key Management Endpoints

**Goal:** Implement server-side API key storage and retrieval for per-model configuration.

**Requirements:** R2

**Dependencies:** None

**Files:**
- `server.js` (modify)
- `data/api-keys.json` (create on first run)

**Approach:**
- Add `POST /api/models/:id/key` endpoint to save API key for a model
- Add `DELETE /api/models/:id/key` endpoint to remove API key
- Add `GET /api/models/:id/key` endpoint to check if key exists (returns boolean, not the key)
- Store keys in `data/api-keys.json`:
  ```json
  {
    "glm-4-flash": "sk-xxxxx",
    "deepseek-chat": "sk-yyyyy"
  }
  ```
- Load keys on server startup
- Use atomic write pattern (temp file + rename)
- Set file permissions to 600 (owner read/write only)
- Integrate keys into model request logic (inject into Authorization header)

**Technical design:**
```javascript
// Pseudo-code
let apiKeys = {}; // Loaded from file on startup

function loadAPIKeys() {
  try {
    const data = fs.readFileSync('./data/api-keys.json', 'utf8');
    apiKeys = JSON.parse(data);
  } catch (err) {
    apiKeys = {};
  }
}

function saveAPIKeys() {
  const temp = './data/api-keys.json.tmp';
  fs.writeFileSync(temp, JSON.stringify(apiKeys, null, 2));
  fs.renameSync(temp, './data/api-keys.json');
  fs.chmodSync('./data/api-keys.json', 0o600);
}

// POST /api/models/:id/key
if (req.method === "POST" && url.pathname.startsWith("/api/models/")) {
  const modelId = url.pathname.split('/')[3];
  const body = await readBody(req);
  apiKeys[modelId] = body.key;
  saveAPIKeys();
  return json(res, 200, {success: true});
}
```

**Patterns to follow:**
- Use existing `json()` helper
- Match existing route handler structure
- Similar to stats file handling

**Test scenarios:**
- Save key: POST /api/models/glm-4-flash/key with key, verify 200 response
- Load key: Restart server, verify key persists
- Delete key: DELETE /api/models/glm-4-flash/key, verify key removed
- Check key exists: GET /api/models/glm-4-flash/key, verify returns {exists: true}
- File permissions: Verify data/api-keys.json has 600 permissions
- Invalid model: POST to non-existent model, verify still saves (no validation)
- Concurrent writes: Save 2 keys simultaneously, verify both persist

**Verification:**
- Save API key via curl, verify file created
- Check file permissions: `ls -l data/api-keys.json` shows `-rw-------`
- Restart server, verify keys loaded
- Delete key, verify removed from file

---

### U7. Integrate API Keys into Model Requests

**Goal:** Use saved API keys when making requests to non-free models.

**Requirements:** R2

**Dependencies:** U6

**Files:**
- `server.js` (modify)

**Approach:**
- Modify existing `/v1/chat/completions` handler
- Before making upstream request, check if model has saved API key
- If key exists, inject into request headers:
  - For OpenAI-compatible: `Authorization: Bearer ${apiKey}`
  - For other formats: check model provider documentation
- If key missing for non-free model, return 401 with clear error message
- Log key usage (without exposing key value)

**Technical design:**
```javascript
// Pseudo-code
async function makeModelRequest(model, messages) {
  const apiKey = apiKeys[model];
  const headers = {'Content-Type': 'application/json'};
  
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  const res = await fetch(upstreamURL, {
    method: 'POST',
    headers,
    body: JSON.stringify({model, messages})
  });
  
  if (res.status === 401 && !apiKey) {
    throw new Error(`Model ${model} requires API key. Configure in dashboard.`);
  }
  
  return res;
}
```

**Patterns to follow:**
- Match existing upstream request pattern
- Use existing error handling

**Test scenarios:**
- Free model without key: Request minimax-m2.5-free, verify works without key
- Non-free model with key: Save key for glm-4-flash, request it, verify key used
- Non-free model without key: Request glm-4-flash without key, verify 401 error
- Key injection: Verify Authorization header present in upstream request (log it)
- Invalid key: Use wrong key, verify upstream 401 propagates to client

**Verification:**
- Test free model, verify works
- Save key for non-free model, test it, verify works
- Test non-free model without key, verify clear error message

---

### U8. Add API Key UI to Model Cards

**Goal:** Add input fields to non-free model cards for API key configuration.

**Requirements:** R2

**Dependencies:** U4, U6

**Files:**
- `public/index.html` (modify)

**Approach:**
- Modify `renderModelCards()` function to conditionally render API key input
- For models with `verified: false`, add:
  - Input field (type="password") for API key
  - "Save" button next to input
  - Visual indicator if key already saved (show masked value ••••••)
- On "Save" click:
  - POST to `/api/models/:id/key` with key value
  - Show success message
  - Update UI to show key is saved
- On page load, fetch key status for all non-free models
- Add "Remove" button to delete saved keys

**Technical design:**
```javascript
// Pseudo-code
async function renderModelCard(model) {
  const card = document.createElement('div');
  // ... render model info
  
  if (!model.verified) {
    const keyExists = await checkKeyExists(model.id);
    const input = document.createElement('input');
    input.type = 'password';
    input.placeholder = keyExists ? '••••••' : 'Enter API key';
    input.value = keyExists ? '••••••' : '';
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.onclick = async () => {
      await saveAPIKey(model.id, input.value);
      showSuccess('API key saved');
    };
    
    card.appendChild(input);
    card.appendChild(saveBtn);
  }
  
  return card;
}

async function saveAPIKey(modelId, key) {
  await fetch(`/api/models/${modelId}/key`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({key})
  });
}
```

**Patterns to follow:**
- Match ui.md design for input fields
- Use existing fetch patterns
- Consistent with modal styling

**Test scenarios:**
- Non-free model: Verify input field appears on glm-4-flash card
- Free model: Verify no input field on minimax-m2.5-free card
- Save key: Enter key, click Save, verify success message
- Key persists: Reload page, verify input shows ••••••
- Remove key: Click Remove, verify key deleted and input cleared
- Multiple keys: Save keys for 3 models, verify all persist
- Invalid key: Save invalid key, test model, verify error message

**Verification:**
- Open dashboard, verify input fields on non-free models only
- Save API key, verify success message
- Reload page, verify key indicator shows
- Test model with saved key, verify works

---

### U9. Add Server-Side CSRF Validation

**Goal:** Implement server-side CSRF token validation for POST requests from dashboard.

**Requirements:** R3 (security)

**Dependencies:** U5

**Files:**
- `server.js` (modify)

**Approach:**
- Add CSRF token validation middleware
- Generate and track valid tokens (simple in-memory Set with expiration)
- Validate `X-CSRF-Token` header on POST requests to `/v1/chat/completions`
- Return 403 if token missing or invalid
- Add `GET /api/csrf-token` endpoint to issue tokens to dashboard

**Technical design:**
```javascript
// Pseudo-code
const validTokens = new Set();

function generateCSRFToken() {
  const token = crypto.randomUUID();
  validTokens.add(token);
  setTimeout(() => validTokens.delete(token), 3600000); // 1 hour expiry
  return token;
}

function validateCSRF(req) {
  const token = req.headers['x-csrf-token'];
  return token && validTokens.has(token);
}

// In request handler
if (req.method === "POST" && url.pathname === "/v1/chat/completions") {
  if (!validateCSRF(req)) {
    return json(res, 403, {error: {message: "CSRF token required"}});
  }
  // ... existing handler
}
```

**Patterns to follow:**
- Use existing `json()` helper for error responses
- Match existing auth pattern (`authOk()`)

**Test scenarios:**
- Happy path: POST with valid CSRF token succeeds
- Missing token: POST without X-CSRF-Token header returns 403
- Invalid token: POST with random token returns 403
- Token expiry: POST with expired token (>1 hour old) returns 403
- Token generation: GET /api/csrf-token returns new token
- Multiple tokens: Generate 2 tokens, verify both work
- Token reuse: Use same token twice, verify both requests succeed

**Verification:**
- Dashboard test modal works (includes valid token)
- Direct curl POST without token returns 403
- Token endpoint returns valid UUID format

---

### U10. Add Cloudflare Tunnel Documentation

**Goal:** Add interactive model testing interface with request/response display and CSRF protection.

**Requirements:** R3

**Dependencies:** U4

**Files:**
- `public/index.html` (modify)

**Approach:**
- Add modal HTML structure (backdrop + card)
- Generate CSRF token on page load: `const csrfToken = crypto.randomUUID();`
- Wire "Test" button click to open modal with selected model pre-filled
- Add form with:
  - Textarea for user prompt (default: "Hello, who are you?")
  - Model name display (read-only)
  - Submit button
- On submit:
  - Show loading spinner
  - POST to `/v1/chat/completions` with `{model: selectedModel, messages: [{role: "user", content: prompt}]}`
  - Include CSRF token in headers: `'X-CSRF-Token': csrfToken`
  - **Use `textContent` to display response** (XSS protection)
  - Handle errors (show error message in modal using `textContent`)
- Add close button (X icon) and backdrop click to close modal
- Add escape key handler to close modal

**Technical design:**
```javascript
// Pseudo-code
const csrfToken = crypto.randomUUID();

function openTestModal(modelId) {
  modal.querySelector('.model-name').textContent = modelId;
  modal.classList.remove('hidden');
  modal.querySelector('textarea').focus();
}

async function testModel(modelId, prompt) {
  showLoading();
  try {
    const res = await fetch('/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{role: 'user', content: prompt}]
      })
    });
    const data = await res.json();
    // XSS-safe rendering
    responseDiv.textContent = data.choices[0].message.content;
  } catch (err) {
    errorDiv.textContent = err.message; // XSS-safe
  }
}
```

**Patterns to follow:**
- Modal styling matches ui.md design (backdrop blur, smooth animations)
- Use existing fetch patterns from U4
- Error handling similar to stats fetch
- **Always use textContent, never innerHTML**

**Test scenarios:**
- Covers R3: Open modal: Click "Test" button, verify modal appears with correct model name
- Covers R3: Submit test: Enter prompt, click submit, verify response displays
- Covers R3: Loading state: Verify spinner shows during API call
- Covers R3: Error handling: Test with invalid model, verify error message displays
- Close modal: Click X button, verify modal closes
- Backdrop close: Click outside modal, verify modal closes
- Escape key: Press Escape, verify modal closes
- Multiple tests: Run 3 tests in sequence, verify each works correctly
- Long response: Test with model that returns 500+ char response, verify scrolling works
- Rate limit: Trigger rate limit (if possible), verify error message is clear
- **XSS protection: Submit prompt that returns `<script>alert(1)</script>`, verify renders as text**
- **XSS protection: Submit prompt that returns `<img src=x onerror=alert(1)>`, verify no execution**
- **CSRF token: Verify X-CSRF-Token header included in POST request**

**Verification:**
- Click "Test" on minimax-m2.5-free card, enter "Hello", verify response appears
- Test all 3 verified models, verify each responds
- Verify modal animations are smooth (fade in/out)
- Check browser console for errors during test flow
- Verify XSS payloads render as plain text, not executed
- Verify CSRF token present in request headers (check Network tab)

---

### U6. Serve Dashboard HTML at `/dashboard` Path

**Goal:** Configure server to serve dashboard HTML at `GET /dashboard` without breaking existing endpoints.

**Requirements:** R1

**Dependencies:** U3, U4

**Files:**
- `server.js` (modify)

**Approach:**
- Import `fs` module: `import fs from "node:fs"`
- Add new route handler for `GET /dashboard`:
  - Read `public/index.html` file
  - Set `Content-Type: text/html`
  - Return HTML content
- Keep existing `GET /` handler unchanged (returns JSON)
- Add error handling if file not found (500 response)
- Consider caching HTML in memory on startup for performance (optional optimization)

**Technical design:**
```javascript
// Pseudo-code
if (req.method === "GET" && url.pathname === "/dashboard") {
  try {
    const html = fs.readFileSync("./public/index.html", "utf8");
    res.writeHead(200, {
      "Content-Type": "text/html",
      "Cache-Control": "no-cache" // Force fresh load during development
    });
    return res.end(html);
  } catch (err) {
    return json(res, 500, {error: {message: "Dashboard not found"}});
  }
}
```

**Patterns to follow:**
- Use synchronous `readFileSync` (acceptable for single file on startup)
- Match existing route handler structure
- Use existing error handling pattern

**Test scenarios:**
- Happy path: GET /dashboard returns 200 with HTML content
- Content-Type: Verify Content-Type header is text/html
- File not found: Delete public/index.html, verify 500 error
- Browser rendering: Open in browser, verify page renders correctly
- API compatibility: Verify /v1/models still works (not affected)
- Backward compatibility: Verify GET / still returns JSON (unchanged)

**Verification:**
- `curl http://localhost:8787/dashboard` returns HTML (starts with `<!DOCTYPE html>`)
- Open `http://localhost:8787/dashboard` in browser, verify dashboard loads
- Verify `/` and `/v1/models` and `/v1/chat/completions` still work
- Verify `GET /` returns JSON, not HTML

---

### U7. Add CSRF Token Validation to Server

### U10. Add Cloudflare Tunnel Documentation

**Goal:** Document how to expose zen-proxy to the internet using Cloudflare Tunnel without a custom domain.

**Requirements:** R6

**Dependencies:** None

**Files:**
- `README.md` (modify)

**Approach:**
- Add new "Internet Access via Cloudflare Tunnel" section to README.md
- Document step-by-step setup:
  1. Install cloudflared CLI
  2. Login to Cloudflare account
  3. Create tunnel: `cloudflared tunnel create zen-proxy`
  4. Configure tunnel to point to localhost:8787
  5. Run tunnel: `cloudflared tunnel run zen-proxy`
  6. Get public URL (format: `https://xxx.trycloudflare.com`)
- Include configuration file example
- Add security warnings:
  - Dashboard has no authentication (anyone can access)
  - Consider setting PROXY_KEY for production
  - Rate limiting recommendations
- Provide troubleshooting tips

**Technical design:**
```markdown
## 🌐 Internet Access via Cloudflare Tunnel

Expose zen-proxy to the internet without port forwarding or custom domain:

### 1. Install cloudflared

**Termux:**
```bash
pkg install cloudflared
```

**Linux/Ubuntu:**
```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared
```

### 2. Create Tunnel

```bash
# Login to Cloudflare (opens browser)
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create zen-proxy

# Note the tunnel ID from output
```

### 3. Configure Tunnel

Create `~/.cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /home/user/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: <YOUR_SUBDOMAIN>.trycloudflare.com
    service: http://localhost:8787
  - service: http_status:404
```

### 4. Run Tunnel

```bash
cloudflared tunnel run zen-proxy
```

Your proxy is now accessible at `https://<YOUR_SUBDOMAIN>.trycloudflare.com`

### Security Considerations

⚠️ **Important:** The dashboard has no authentication by default. Anyone with the URL can:
- View your model usage statistics
- Test models using your API keys
- Access all dashboard features

**Recommendations:**
- Set `PROXY_KEY` environment variable to require authentication
- Use Cloudflare Access for additional security layer
- Monitor usage via dashboard statistics
- Rotate API keys regularly

### Troubleshooting

**Tunnel not connecting:**
- Check firewall allows outbound HTTPS (port 443)
- Verify cloudflared is running: `ps aux | grep cloudflared`
- Check logs: `cloudflared tunnel info zen-proxy`

**502 Bad Gateway:**
- Ensure zen-proxy server is running on port 8787
- Check server logs for errors
- Verify tunnel config points to correct port
```

**Patterns to follow:**
- Match existing README.md markdown style
- Use code blocks for commands
- Include both Termux and Linux instructions
- Clear security warnings

**Test scenarios:**
- Test expectation: none -- documentation change only

**Verification:**
- README.md renders correctly on GitHub
- All commands are accurate and tested
- Security warnings are prominent
- Instructions are clear for both Termux and Linux users

---

### U11. Serve Dashboard HTML at `/dashboard` Path

**Goal:** Configure server to serve dashboard HTML at `GET /dashboard` without breaking existing endpoints.

**Requirements:** R1

**Dependencies:** U4, U8

**Files:**
- `server.js` (modify)

**Approach:**
- Import `fs` module: `import fs from "node:fs"`
- Add new route handler for `GET /dashboard`:
  - Read `public/index.html` file
  - Set `Content-Type: text/html`
  - Return HTML content
- Keep existing `GET /` handler unchanged (returns JSON)
- Add error handling if file not found (500 response)
- Consider caching HTML in memory on startup for performance (optional optimization)

**Technical design:**
```javascript
// Pseudo-code
if (req.method === "GET" && url.pathname === "/dashboard") {
  try {
    const html = fs.readFileSync("./public/index.html", "utf8");
    res.writeHead(200, {
      "Content-Type": "text/html",
      "Cache-Control": "no-cache" // Force fresh load during development
    });
    return res.end(html);
  } catch (err) {
    return json(res, 500, {error: {message: "Dashboard not found"}});
  }
}
```

**Patterns to follow:**
- Use synchronous `readFileSync` (acceptable for single file on startup)
- Match existing route handler structure
- Use existing error handling pattern

**Test scenarios:**
- Happy path: GET /dashboard returns 200 with HTML content
- Content-Type: Verify Content-Type header is text/html
- File not found: Delete public/index.html, verify 500 error
- Browser rendering: Open in browser, verify page renders correctly
- API compatibility: Verify /v1/models still works (not affected)
- Backward compatibility: Verify GET / still returns JSON (unchanged)

**Verification:**
- `curl http://localhost:8787/dashboard` returns HTML (starts with `<!DOCTYPE html>`)
- Open `http://localhost:8787/dashboard` in browser, verify dashboard loads
- Verify `/` and `/v1/models` and `/v1/chat/completions` still work
- Verify `GET /` returns JSON, not HTML

---

### U12. Update Documentation

**Goal:** Document dashboard access, new endpoints, API key management, and Cloudflare Tunnel setup in README.md.

**Requirements:** R1, R6

**Dependencies:** U3, U10, U11

**Files:**
- `README.md` (modify)

**Approach:**
- Add "Dashboard" section after "Use" section
- Document:
  - How to access dashboard (`http://localhost:8787/dashboard`)
  - Features available (model catalog, API key management, testing, 16-model chart, stats)
  - Browser requirements (modern browser with ES6 support)
  - Security note about CSRF protection and no authentication
- Update "Endpoints" section:
  - Add `GET /dashboard` - Dashboard UI (HTML)
  - Add `GET /api/status` - Service status (JSON, alias for `/`)
  - Add `GET /api/stats` - Usage statistics with tokens/min (JSON)
  - Add `GET /api/csrf-token` - CSRF token for dashboard (JSON)
  - Add `POST /api/models/:id/key` - Save API key for model (JSON)
  - Add `DELETE /api/models/:id/key` - Remove API key for model (JSON)
  - Add `GET /api/models/:id/key` - Check if API key exists (JSON)
  - Note: `GET /` unchanged (still returns JSON)
- Add features section:
  - Per-model API key management
  - 16-model vertical chart visualization
  - Adaptive polling based on token usage
  - File-based persistent statistics (7-day retention)
- Add security section:
  - CSRF protection for POST requests
  - XSS protection via textContent rendering
  - No authentication by default (public access)
  - API keys stored as plaintext (encryption deferred)
  - Cloudflare Tunnel security considerations

**Patterns to follow:**
- Match existing README.md markdown style
- Use code blocks for examples
- Keep tone concise and technical

**Test scenarios:**
- Test expectation: none -- documentation change only

**Verification:**
- README.md renders correctly on GitHub
- All links work
- Instructions are clear and accurate
- Cloudflare Tunnel section is comprehensive

**Goal:** Document dashboard access, new endpoints, and security considerations in README.md.

**Requirements:** R1

**Dependencies:** U3, U6, U7

**Files:**
- `README.md` (modify)

**Approach:**
- Add "Dashboard" section after "Run" section
- Document:
  - How to access dashboard (`http://localhost:8787/dashboard`)
  - Features available (model catalog, testing, stats)
  - Browser requirements (modern browser with ES6 support)
  - Security note about CSRF protection
- Update "Endpoints" section:
  - Add `GET /dashboard` - Dashboard UI (HTML)
  - Add `GET /api/status` - Service status (JSON, alias for `/`)
  - Add `GET /api/stats` - Usage statistics (JSON)
  - Add `GET /api/csrf-token` - CSRF token for dashboard (JSON)
  - Note: `GET /` unchanged (still returns JSON)
- Add security section:
  - CSRF protection for POST requests
  - XSS protection via textContent rendering
  - Dashboard inherits PROXY_KEY authentication

**Patterns to follow:**
- Match existing README.md markdown style
- Use code blocks for examples
- Keep tone concise and technical

**Test scenarios:**
- Test expectation: none -- documentation change only

**Verification:**
- README.md renders correctly on GitHub
- All links work
- Instructions are clear and accurate

---

## Deferred Implementation Notes

### Real-Time Updates via WebSocket
The current adaptive polling approach (5-30 second intervals) is sufficient for the initial implementation. If dashboard usage scales to many concurrent users, consider upgrading to WebSocket-based push updates to reduce server load and improve responsiveness.

**Implementation sketch:**
- Add `ws` library (first external dependency)
- Broadcast stats updates to all connected clients when metrics change
- Fallback to polling if WebSocket connection fails

### API Key Encryption at Rest
Current implementation stores API keys as plaintext in `data/api-keys.json`. For production deployments with sensitive keys, consider:
- Encrypt keys using system keyring (e.g., `keytar` library)
- Use environment variable as encryption key
- Implement key rotation mechanism
- Add audit log for key access

### Model Enable/Disable Toggles
The ui.md design includes toggle switches on each model card. The UI exists but is not wired to backend functionality. To implement:
- Add `enabled` field to model metadata
- Filter disabled models from fallback chain
- Persist enabled/disabled state in `data/model-config.json`
- Add `PATCH /api/models/:id` endpoint for toggle updates

### Advanced Chart Features
Current 16-model vertical bar chart shows cumulative usage. Future enhancements:
- Time-series view toggle (switch between cumulative and over-time)
- Date range picker (last hour, day, week)
- Drill-down to per-model detailed statistics
- Export to CSV/JSON
- Comparison mode (compare two time periods)

### Dashboard Authentication
Current implementation has no authentication (public access). For production:
- Add login page with username/password
- Session management with secure cookies
- Role-based access control (viewer vs admin)
- Integration with existing PROXY_KEY mechanism
- OAuth/SSO support for enterprise deployments

---

## Testing Strategy

### Unit Testing
- Statistics tracking: Bucket management, metric calculation, 7-day retention, file persistence
- API endpoints: Response format validation, error handling, CORS headers
- API key management: Save, load, delete operations, file permissions
- Adaptive polling: Interval calculation based on tokens/min

### Integration Testing
- End-to-end flow: Dashboard load → fetch models → display cards with API key inputs → test model → view response
- API compatibility: Verify existing `/v1/*` endpoints unchanged
- Backward compatibility: Verify `/api/status` returns same data as `/`
- Statistics persistence: Record data, restart server, verify data survives
- API key integration: Save key, make request, verify key used in upstream call

### Manual Testing
- Visual QA: Compare rendered dashboard to ui.md screenshots
- 16-model chart: Verify all 16 models display correctly with proportional heights
- API key UI: Test save/load/delete flow for multiple models
- Adaptive polling: Monitor Network tab, verify interval changes based on traffic
- Cross-browser: Test on Chrome, Firefox, Safari
- Mobile responsive: Test on 375px, 768px, 1024px viewports
- Performance: Verify page load <500ms, stats update <100ms
- Error scenarios: Test with server down, invalid API key, rate limits
- Cloudflare Tunnel: Follow documentation, verify public access works

### Acceptance Criteria
- All requirements (R1-R6) met
- Zero JavaScript console errors
- Visual match to ui.md design (close match, pixel-perfect not required)
- 16-model chart displays all models correctly
- API key management works for all non-free models
- Adaptive polling changes interval based on traffic
- Statistics persist across server restarts
- Existing API clients unaffected
- Cloudflare Tunnel documentation is complete and accurate

---

## Risks & Mitigation

### Risk: Plaintext API Key Storage
**Impact:** High - API keys stored unencrypted in `data/api-keys.json` could be compromised if file system is accessed

**Mitigation:**
- Set file permissions to 600 (owner read/write only) on creation
- Document security limitation in README.md
- Recommend using separate API keys for dashboard vs production
- Add warning in UI when saving keys
- Defer encryption to follow-up work (requires key management complexity)

**Likelihood:** Medium - Depends on deployment environment and file system access controls

### Risk: No Dashboard Authentication
**Impact:** High - Anyone with dashboard URL can view stats, test models, and manage API keys

**Mitigation:**
- Clearly document in README.md that dashboard is public by default
- Recommend setting PROXY_KEY for production deployments
- Provide Cloudflare Access setup instructions as additional security layer
- Add prominent warning banner in dashboard UI about public access
- Consider adding simple password protection in follow-up work

**Likelihood:** High - User explicitly requested no authentication, but may not understand implications

### Risk: XSS Vulnerability in Model Response Rendering
**Impact:** High - Malicious JavaScript in model responses could execute in user's browser

**Mitigation:**
- Use `textContent` instead of `innerHTML` when displaying model responses
- Never use `innerHTML`, `outerHTML`, or `insertAdjacentHTML` with untrusted content
- Example: `responseDiv.textContent = data.choices[0].message.content;`
- Add test case: Submit prompt that causes model to return `<script>alert(1)</script>` and verify it renders as text
- If HTML formatting is needed later, use DOMPurify library for sanitization

**Likelihood:** Medium - Depends on upstream model behavior, but user prompts are attacker-controlled

### Risk: CSRF Vulnerability on Model Test Requests
**Impact:** Medium - Attacker could send requests on behalf of authenticated users

**Mitigation:**
- Implement CSRF token for POST requests from dashboard:
  1. Generate random token on dashboard load: `const csrfToken = crypto.randomUUID();`
  2. Embed in HTML as meta tag: `<meta name="csrf-token" content="${csrfToken}">`
  3. Include in fetch requests: `headers: {'X-CSRF-Token': csrfToken}`
  4. Validate server-side before processing POST requests
- Alternative: Document that CORS wildcard is intentional for programmatic API access, CSRF risk is accepted
- Add test case: Attempt cross-origin POST without CSRF token, verify it's blocked

**Likelihood:** Medium - CORS wildcard enables cross-origin requests, dashboard has no auth

### Risk: Information Disclosure via `/api/stats`
**Impact:** Medium - Unauthenticated access exposes usage patterns and operational data

**Mitigation:**
- Document that stats endpoint is public (consistent with no dashboard auth)
- If stats must be protected, apply same auth mechanism as dashboard
- Consider removing granular per-model data from public endpoint
- Add rate limiting: max 1 request per 10 seconds per IP
- Add test case: Access `/api/stats` without auth, verify expected behavior

**Likelihood:** High - Stats endpoint is public by design (no auth requirement)

### Risk: File I/O Performance Degradation
**Impact:** Medium - Frequent stats writes could slow down request handling under high load

**Mitigation:**
- Use atomic write pattern (temp file + rename) to prevent corruption
- Write stats asynchronously (don't block request handler)
- Batch writes: only write every 60 seconds instead of every request
- Monitor disk I/O in production
- Consider moving to in-memory with periodic flush if performance issues arise

**Likelihood:** Low - File writes are fast (<10ms), unlikely to be bottleneck

### Risk: 16-Model Chart Rendering Performance
**Impact:** Low - Chart with 16 bars could be slow to render on low-end devices

**Mitigation:**
- Use CSS transforms for bar height (GPU-accelerated)
- Debounce chart updates (max 1 update per second)
- Test on low-end Android devices
- Consider canvas-based rendering if DOM performance is insufficient

**Likelihood:** Low - 16 bars is not excessive, modern browsers handle this easily

### Risk: Adaptive Polling Interval Confusion
**Impact:** Low - Users may not understand why dashboard updates at different speeds

**Mitigation:**
- Add visual indicator showing current polling interval
- Display "Last updated X seconds ago" timestamp
- Document adaptive polling behavior in README.md
- Provide manual refresh button as fallback

**Likelihood:** Medium - Behavior may be surprising to users expecting fixed interval

### Risk: Cloudflare Tunnel Misconfiguration
**Impact:** Medium - Incorrect tunnel setup could expose dashboard without user realizing

**Mitigation:**
- Provide complete, tested documentation with examples
- Include security checklist in tunnel setup section
- Warn about public exposure before tunnel creation
- Recommend testing with curl before sharing URL
- Document how to check tunnel status and logs

**Likelihood:** Medium - Tunnel setup has multiple steps, easy to misconfigure

### Risk: API Key Injection Failure
**Impact:** High - Saved API keys not used in requests would break non-free model access

**Mitigation:**
- Add comprehensive logging for key usage (without exposing key values)
- Test with actual non-free models during development
- Provide clear error messages when key is missing or invalid
- Add test case: Save key, make request, verify Authorization header present
- Document which models require keys in dashboard UI

**Likelihood:** Medium - Integration between key storage and request logic is complex

---

## Success Metrics

- Dashboard loads in <500ms on localhost
- Zero JavaScript console errors in production
- Visual design matches ui.md specification (close match, subjective)
- All 16 models display correctly in vertical chart with proportional heights
- API key management works: save, load, delete for all non-free models
- Saved API keys persist across server restarts
- API keys successfully injected into upstream requests
- Model testing works for all 3 verified models
- Adaptive polling changes interval based on tokens/min (verify in Network tab)
- Statistics persist across server restarts (7-day retention)
- 16-model chart updates in real-time as requests are made
- Mobile layout works on 375px viewport
- Existing API clients continue working (no breaking changes)
- Cloudflare Tunnel documentation is complete and tested
- XSS protection verified: malicious payloads render as text
- CSRF protection verified: requests without token are blocked

---

## Documentation Plan

### README.md Updates
- Add "Dashboard" section with:
  - Access instructions (`http://localhost:8787/dashboard`)
  - Feature overview (model catalog, API key management, 16-model chart, testing, stats)
  - Browser requirements
  - Security warnings (no auth, plaintext keys, public access)
- Add "Internet Access via Cloudflare Tunnel" section with:
  - Installation instructions (Termux + Linux)
  - Tunnel creation and configuration
  - Security considerations
  - Troubleshooting tips
- Update "Endpoints" list with new API routes
- Add "Features" section documenting:
  - Per-model API key management
  - 16-model vertical chart visualization
  - Adaptive polling based on token usage
  - File-based persistent statistics (7-day retention)
- Add "Security" section with:
  - CSRF protection details
  - XSS protection via textContent
  - No authentication by default
  - API key storage limitations
  - Cloudflare Tunnel security recommendations

### Inline Code Comments
- Add JSDoc comments to statistics tracking functions
- Document file-based persistence implementation
- Explain adaptive polling interval logic
- Document API key storage and injection mechanism

### No Additional Docs Needed
- Dashboard UI is self-explanatory (no user manual required)
- API endpoints follow existing patterns (no new API docs needed)
- Cloudflare Tunnel setup is documented in README.md
