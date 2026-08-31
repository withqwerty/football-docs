---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.846Z
---
# Best practices

Our API provides well-structured responses with strictly typed entities, such as statistics and lineups. This page provides best practices for using our data effectively in sports applications.

### Initial data load & syncing strategy

Most of our endpoints support pagination, so you’ll often need multiple requests to retrieve full datasets. To streamline this, we provide features and patterns designed for scalability and consistency.

**Bulk fetch with `filters=populate`**

* Use `filters=populate` on endpoints to disable all includes. This ensures the response payload is minimal (no extra nested data) and enables a **page size of 1000** records, reducing the total number of pages.
* Because includes are disabled, you'll fetch only the base entity fields (no heavy relational joins).
* **Pro tip**: For your initial sync, use `filters=populate` to bootstrap your dataset quickly and with fewer API calls.

**Incremental sync with `idAfter`**

Once your initial dataset is established, keep your database up to date using the `idAfter` filter:

* Use a parameter like `filters=idAfter:12345` to fetch only those records whose IDs are **greater than** the last known ID.
* Combine this with `filters=populate` to keep responses lightweight.
* This strategy ensures you're only pulling new entries, not re-fetching old ones.

**Developer notes & examples**

* **Concurrent paging**: After fetching page 1 with `idAfter` & `populate`, you can fetch pages 2, 3, etc., in parallel (within your rate-limit constraints) to speed up initial sync.
* **Example (pseudocode for bulk + incremental)**:

```javascript
// Step 1: bulk load all via pages
for (let page = 1; ; page++) {
  let resp = await fetchEndpoint({
    include: null,
    filters: `populate;page:${page}`
  })
  if (!resp.data.length) break
  saveToDb(resp.data)
}

// Step 2: start incremental sync loop
let lastMaxId = getMaxIdFromDb()
setInterval(async () => {
  let resp = await fetchEndpoint({
    include: null,
    filters: `populate;idAfter:${lastMaxId}`
  })
  if (resp.data.length) {
    saveToDb(resp.data)
    lastMaxId = getMaxIdFromDb()
  }
}, pollIntervalMs)
```

* **Edge case (out-of-order IDs)**: In rare cases, data might arrive with IDs not strictly increasing (e.g. a delayed update or backfill). It’s good to *also* run periodic full sync (snapshot) of reference entities to catch anomalies.
* **Empty result handling**: If your `idAfter` call returns no data (empty), don’t panic, it means there’s nothing new. But if you see long streaks with nothing, consider switching to a slower polling or check connectivity.

**Pitfalls & tips**

* **Watch for rate limits**: Bulk + parallel requests can accidentally hit your limits. Always space out your calls or batch smartly.
* **New vs updated vs deleted**: `idAfter` only handles *new* records (or records with new IDs). It does not detect updates to existing ones or deletions. Use other filters (e.g. `IsDeleted` or “latest update” endpoints) to catch those.
* **Combine strategies**: Use multiple sync strategies in tandem, initial bulk, incremental fetch, “latest updated” polls, and occasional full snapshot reconciliation.
* **Monitoring**: Log how many new records you get per sync, and detect decreasing yields (i.e. when little new data is arriving), that may indicate everything is in sync.

**Cursor-based pagination**

The API uses cursor-based pagination. Each paginated response includes a `pagination` object with a `next_cursor` value. Pass this as a `cursor` parameter on your next request and keep going until `has_more` is `false`.

```http
https://api.sportmonks.com/v3/football/fixtures
?api_token=YOUR_TOKEN&order=desc&per_page=25
```

```json
"pagination": {
  "count": 25,
  "per_page": 25,
  "current_page": 1,
  "next_cursor": "WzEsMixbMTk3MTAxMDBdLFtbInNwb3J0cy5maXh0dXJlcy5pZCIsMV1dXQ",
  "has_more": true
}
```

Follow-up request:

```http
https://api.sportmonks.com/v3/football/fixtures
?api_token=YOUR_TOKEN&order=desc&per_page=25&cursor=WzEsMixbMTk3MTAxMD...
```

{% hint style="info" %}
The previous page-number method (`page=2`, `next_page`) remains supported for existing integrations, but cursor-based pagination is recommended for all new customers.
{% endhint %}

For full documentation and code examples, see [Pagination](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/introduction/pagination).

### Reducing includes and response data

Our API supports optional **includes** (nested related entities) to enrich responses. But excessive includes increase payload size, latency, and bandwidth usage. To optimize performance, we strongly recommend caching certain entities on your side so you can avoid requesting includes unnecessarily.

**Entities we recommend caching**

These are entities that rarely change and are safe to cache:

* States
* Types
* Continents
* Countries
* Regions
* Cities

By caching these, you can often eliminate half or more of your includes, trimming response size and speeding your requests.

**How to use cached entities instead of includes**

1. **At startup or periodically**, fetch and store the full lists of the above entities from endpoints like `/states`, `/types`, `/countries`, etc.
2. In your application logic, when you receive an object with a `type_id`, `region_id`, etc., look it up in your local cache instead of asking the API to include the full object.
3. Only request includes when you need deep details (e.g. nested objects or rarely updated relations).

**Example: caching “Types” to skip includes**

Suppose a match entity has a field `type_id` pointing to a “match type” (e.g. league, cup, friendly). You can do this:

* During app startup (or daily), call `/types` and cache all type records (ID → full type object).
* When fetching fixtures or matches, **omit** `include=type` (or remove it) and rely on your local cache to resolve `type_id` to the developer\_name of the type.&#x20;
* Only if you see a `type_id` not in your cache, you can fetch `/types/{id}` once to update your cache.

This avoids bloating every match response with full type objects.

**Developer tips & caveats**

* **TTL & refresh strategy:** Since these entities change rarely, you can assign a long TTL (e.g. a few hours or a day) and refresh them periodically (cron job, background task).
* **Invalidation:** If your cache has stale entries (e.g. a country name changes), you should detect and refresh. A simple strategy: always check for unknown IDs or version mismatches and fetch fresh data when needed.
* **Fallback includes:** In edge cases (e.g. a new region not yet in cache), you can still request the include for that one record to fill your cache.
* **Monitor cache hit rate:** Track how often your cached lookup resolves vs missing. A high hit rate means your design is effective.
* **Size limits:** These entities are generally small (hundreds to a few thousands of records), so caching them in memory or fast stores (Redis, in-app store) is cheap.

**Impact & benefits**

* **Reduced bandwidth & latency**: Smaller JSON payloads travel over the wire faster.
* **Lower API load**: You reduce work on the server by omitting heavy joins/includes.
* **Simpler client logic**: You have control over which related data you load and when.

### Avoiding request timeouts

Some endpoints can return very large payloads depending on how many includes you attach and how much live activity is happening at the time. The livescores endpoint is the most variable, during a busy match window, a single enriched request can grow large enough to time out before it completes, even under normal infrastructure conditions.

The sections below explain what drives this and how to structure your requests to avoid it.

#### Why livescore requests time out

Response size compounds quickly on the livescores endpoint. Each additional include adds data for every active fixture in the response. The two biggest contributors are:

* **`trends.type`** : starts at a similar size to statistics but grows as each match progresses, since trends accumulate over the course of the game. Including `.type` on top of this expands the payload further and increases server processing time.
* **`lineups.details`** and **`periods.statistics`** : both are nested includes that multiply in size across many concurrent fixtures.

Late-minute fixtures are particularly heavy because they have accumulated the most data. When several late-minute fixtures are live at the same time as early-minute ones receiving new events, a single enriched livescores request is at its highest risk of timing out.

#### Recommendations

**Cache types and states locally**

Types and states are mostly static. Fetch them once at startup and store them in your application database or cache. When you resolve a `type_id` or `state_id` locally, you can remove `.type` and `states` from your includes entirely, which significantly reduces both response size and server load.

See **Reducing includes and response data** above for the full caching strategy.

**Split heavy includes into separate requests**

Rather than fetching everything in one livescores call, split includes that update on a different cadence into their own requests.

Trends are a good example. New trends are stored just after the start of each minute, so there is no benefit to fetching them on every livescores poll. Instead:

* Poll the livescores endpoint (with scores, events, participants) at your normal interval.
* Schedule a separate trends request once per minute, offset by 30 seconds past the minute mark to ensure new data is available.

This reduces the size of your main polling request and keeps the trends fetch lean and predictable.

The same principle applies to `lineups.details` and `periods.statistics`. Both update infrequently relative to scores and events, so fetching them separately on a slower interval is more efficient than including them on every poll.

**Example: splitting livescores from trends**

```javascript
const apiToken = 'YOUR_API_TOKEN';
const leagueFilter = 'fixtureLeagues:8';

// Main poll — scores and events only, every 10 seconds
async function pollLivescores() {
  const r = await fetch(
    `https://api.sportmonks.com/v3/football/livescores/latest?api_token=${apiToken}&include=scores;events;participants&filters=${leagueFilter}`
  );
  const data = await r.json();
  updateScoreboard(data.data);
}

// Trends poll — separate, once per minute at the 30-second mark
async function pollTrends() {
  const r = await fetch(
    `https://api.sportmonks.com/v3/football/livescores/inplay?api_token=${apiToken}&include=trends&filters=${leagueFilter}`
  );
  const data = await r.json();
  updateTrends(data.data);
}

// Start main polling
setInterval(pollLivescores, 10000);

// Start trends polling — offset 30 seconds past each minute
const now = new Date();
const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
const msUntil30SecMark = msUntilNextMinute + 30000;

setTimeout(() => {
  pollTrends(); // first run
  setInterval(pollTrends, 60000); // then every minute
}, msUntil30SecMark);
```

**Summary of includes to treat with care on livescores**

| Include                                    | Risk                                        | Recommendation                                               |
| ------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------ |
| `trends.type`                              | High, grows per match, per minute           | Cache types locally; fetch trends separately once per minute |
| `trends`                                   | Medium , grows as matches progress          | Fetch separately on a 60-second interval                     |
| `lineups.details`                          | Medium , nested, multiplies across fixtures | Fetch separately; lineups rarely change mid-match            |
| `periods.statistics`                       | Medium , nested per period per fixture      | Fetch separately or on demand per fixture                    |
| `statistics.type` / `.type` on any include | High , expands every stat object            | Always cache types locally and remove `.type` from includes  |

### CORS (Cross-Origin Resource Sharing)

When building client-side (browser) applications that call the Sportmonks API, you may see an error like:

> “Request from origin <https://your\\_domain.com> has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource”

This happens because browsers enforce the **same-origin policy**, which prevents JavaScript from making requests to a different domain unless explicitly allowed. You are calling the API directly from the front end, and since it is a different origin, the API must permit it.

#### Why this is risky + best practice

Direct frontend integration may expose sensitive data, especially your API token to end users. To avoid this risk and to handle CORS properly, use a **middleware layer** (backend or proxy) as an intermediary:

* The frontend sends requests to your middleware.
* The middleware attaches your API token securely and forwards the request to the Sportmonks API.
* The middleware returns the API response to the frontend, with correct CORS headers.
* This setup ensures your token is never exposed in client-side code.

Using such a proxy makes it much harder for malicious actors to access your credentials or misuse your API.

#### How CORS works in brief

1. The browser adds an `Origin` header in requests to indicate where the request is coming from.
2. For certain methods or headers, the browser first sends a **preflight OPTIONS** request.
3. The server must respond with appropriate headers like `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`.
4. If those headers permit the request, the browser proceeds; otherwise it blocks it.

#### Developer tips & examples

**Specifying allowed origins**

Do **not** use `*` (wildcard) in `Access-Control-Allow-Origin` once in production if your API uses credentials (cookies, auth headers). Instead, allow specific origins:

```http
Access-Control-Allow-Origin: https://my-frontend.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization

```

If you allow credentials (`Access-Control-Allow-Credentials: true`), the `Allow-Origin` must be an explicit origin, not `*`.

**Handling preflight (OPTIONS) requests**

For any non-simple request (e.g. custom headers or methods like PUT), the browser first sends an OPTIONS request. Your server (or middleware) needs to correctly answer:

```http
OPTIONS /api/endpoint HTTP/1.1
Origin: https://my-frontend.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

Response should include:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://my-frontend.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

That tells the browser it is safe to send the actual request.

#### Common pitfalls & security notes

* Avoid using `*` for `Access-Control-Allow-Origin` in production, especially when credentials are involved.
* Ensure even error responses include proper CORS headers, if they don’t, the browser may hide error details.
* Regularly audit which origins you allow. As your app evolves, remove unused or outdated domains.
* Remember: CORS is enforced by browsers only. Non-browser clients (e.g. mobile apps, server-to-server) are not restricted by CORS.

### **Rate Limiting**

To ensure fair usage and maintain optimal performance for all users, adhere to our rate limiting policies:

* Familiarise yourself with our API’s rate limits and throttle your requests to avoid exceeding them. Exceeding limits may lead to temporary restrictions or suspension of access.
* Implement client-side rate limiting to prevent bursts of requests from overwhelming our servers. By observing reasonable request frequencies, you help maintain a smooth experience for all.

Below are deeper explanations, patterns, and examples to help you build an effective rate-limiting layer.

**Why client-side rate limiting matters**

Even though the API enforces limits, relying solely on that enforcement results in:

* Unexpected `429 Too Many Requests` errors
* Jitter or latency spikes
* Poor predictability under load

By proactively controlling your request velocity, you reduce failed calls and improve stability. Many systems use client-side throttling for exactly this reason.&#x20;

**Common rate-limiting algorithms**

Choosing the right algorithm affects how smooth your request pattern is. [Some standard approaches](https://www.sportmonks.com/glossary/api-rate-limit/):

* **Fixed window**: Count requests per fixed time interval (e.g. max 100 per minute). Simple, but bursty at window boundaries.&#x20;
* **Sliding window**: Keeps a rolling window of time, smoothing out burst edges.
* **Token bucket**: Tokens are refilled at a steady rate; each request “costs” a token. Allows bursts if tokens are available.&#x20;
* **Leaky bucket**: Requests queue up and are processed at a constant rate; excess requests “leak” out or are dropped.&#x20;

Often a token bucket or sliding window is a good fit for API clients.

**Handling `429` and backoff**

Even with client-side throttling, you may still hit rate limits (e.g. under concurrency or traffic shifts). Handle `429` responses gracefully:

* Check for a `Retry-After` header, if provided, and wait that duration.
* Use **exponential backoff** (with jitter) on repeated failures: e.g. wait 0.5s, then 1s, then 2s, etc.
* Cap the maximum backoff delay and eventually give up or notify the user.
* After backing off, resume a conservative request rate rather than jumping back to full speed.

**Best practices & tips**

* Use analytics / monitoring to track how often you hit the rate limit, to tune your client-side throttling thresholds.
* If your app makes multiple types of API calls (e.g. livescores vs historical data), allocate separate rate buckets or priorities.
* During low traffic periods, you can increase throughput; during peaks, be conservative.
* Log request metadata (endpoint, timestamp) to help debugging when limits are hit.
* Use jitter (random small variation) in backoff timing to avoid synchronized retries across many clients.

### **Optimised querying & filtering**

You should aim to retrieve *just what you need,* not entire datasets with lots of unused fields. Using filters and caching intelligently can yield more efficient, faster, and cheaper requests.

**Using filters effectively**

* Whenever possible, apply server-side filtering over retrieving everything and filtering client-side. This reduces response size and network waste.
* Use field filters (e.g. `status=active`, `season_id=2025`) or property filters (e.g. `score_gt`, `date_lt`) if supported.
* Combine filters to narrow results (logical AND) rather than fetching then discarding.
* Be cautious when using filters around boundary values (dates, times), test edge cases (e.g. matches exactly at midnight).
* Consider ordering your filters so the “cheapest / most selective” ones run first (i.e. filter by competition before filtering by team, etc.)

**Caching query results & lookups**

Because many queries are repetitive or stable over time, you can cache responses or lookup tables to avoid re-fetching the same data.

* **Cache lookups of commonly accessed entities** (e.g. teams, types, leagues). If your data model has `team_id` or `type_id`, you can resolve it locally rather than requesting `include=team` or `include=type` each time.
* **Cache entire query responses** for endpoints that don’t change often (e.g. historical stats, standings).
* Use a **cache-aside** or **lazy caching** model: on a cache miss, fetch from the API, store it, then respond.
* Set sensible TTLs (time-to-live) depending on how often that data really changes.
* Invalidate or refresh caches when you know an underlying change occurred (for example, via webhooks or scheduled refreshes).

**Example scenario**

Imagine your UI shows standings for a season. Rather than:

1. Fetch `/standings?season=2025&include=league,team` every refresh
2. Parse and re-resolve team names each time

You could:

* On first request, call `/standings?season=2025&include=league,team`
* Cache the `league` and `team` lookups locally
* For subsequent requests (especially within a short timeframe), call `/standings?season=2025` (no includes) and use your cache to resolve teams and league metadata

This approach reduces payload size and speeds up responses.

**Trade-offs and caveats**

* **Stale cache risk**: If the underlying data changes (e.g. a team name update), your cache may serve obsolete data. Mitigate this by TTL, invalidation logic, or periodic refreshes.
* **Cache memory / storage constraints**: Don’t cache everything. Focus on frequently used, relatively stable data.
* **Over-caching dynamic endpoints**: Avoid caching endpoints with highly volatile data (live scores, events) unless on very short TTLs.
* **Partial includes**: Sometimes it’s useful to include only subfields rather than the full object to reduce payload.

**Best practices summary**

* Prioritise server-side filters over client-side filtering
* Cache entity lookups (teams, types, etc.) aggressively
* Cache query results only when data stability permits
* Use lazy loading / cache-aside patterns
* Choose TTLs appropriate to data volatility
* Include invalidation / refresh mechanisms
* Monitor cache hit rates and misses to guide tuning

### Master the tools: Request options deep dive

These best practices rely on mastering one essential skill: using request options effectively. If you haven't already, dive deep into the **Request Options** documentation to understand:

* How to use **includes** to enrich your responses without making multiple API calls
* How to **filter data** on the server-side (not client-side) for better performance
* How to **select specific fields** to minimize payload size and improve response times
* How to **order and sort** results the way your application needs them

By combining these request options with the best practices above, caching strategies, rate limit awareness, and efficient data retrieval, you'll build applications that are faster, cheaper, and more scalable.

[Master Request Options →](https://docs.sportmonks.com/football/api/request-options)