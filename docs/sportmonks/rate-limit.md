---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.848Z
---
# Rate limit

Your rate limit defines how many API calls you can make per entity per hour, based on your active plan and any API call add-ons you’ve purchased.

**Rate limits per plan**

Each plan includes a fixed number of API calls per entity per hour:

* **Free**: 3,000 API calls / entity / hour — covers the Danish Superliga and Scottish Premiership, no credit card required, no expiry
* **Starter**: 2,000 API calls / entity / hour
* **Growth:** 2,500 API calls / entity / hour
* **Pro**: 3,000 API calls / entity / hour
* **Enterprise**: 5,000 API calls / entity / hour

If you’ve purchased API call add-ons, these increase your hourly limit accordingly.

{% hint style="info" %}
Want access to more leagues than the Free plan covers? Start a 14-day free trial of any paid plan, no credit card required upfront, cancel any time before day 14 and you won't be charged.
{% endhint %}

Understanding and optimising your API usage is critical for building reliable applications. This guide explains how rate limits work, how to stay within them, and strategies for maximum efficiency.

#### Quick summary

**Default limits:**

* Limits are per entity, not per endpoint
* Resets after 1 hour from first request
* Track usage in real-time via response headers

**When you hit the limit:**

* You receive a `429 Too Many Requests` error
* You can still call other entities
* Wait for reset or upgrade your plan

**Pro tip:** Use includes, cache reference data, and implement smart polling to reduce API calls by 50-80%.

#### 1. How rate limits work

**Key points:**

* Limits are **per entity** (Fixture, Team, Player, etc.)
* The hour starts from your **first request** to that entity
* After 1 hour from the first request, your limit **resets**
* Different entities have **separate limits**

**Example timeline**

```
18:18 UTC - First Fixture request → Counter starts at 2,999 remaining
18:30 UTC - 50 more Fixture requests → 2,949 remaining
19:00 UTC - 200 more Fixture requests → 2,749 remaining
19:18 UTC - Limit resets to 3,000 → Full limit restored
```

**What counts as a request?**

**Each of these counts as ONE request:**

* `GET /fixtures/123`
* `GET /fixtures?date=2026-03-02`
* `GET /fixtures/123?include=participants;events;statistics`
* Each page in paginated results
* A request that returns no results (a valid query with an empty result set still consumes one request against the relevant entity)

**These count as SEPARATE requests:**

* `GET /fixtures/123` (1 Fixture request)
* `GET /teams/456` (1 Team request)
* Different entities = different rate limit buckets

{% hint style="info" %}
**Validation errors don't expose rate limit info.** Requests that fail validation before reaching your data, for example requesting a non-existent include (`code: 5001`), return an error response with no `rate_limit` object at all. This means you can't confirm from the error response itself whether the attempt counted against your quota, unlike successful or empty-result responses, which always include the full `rate_limit` block.
{% endhint %}

#### 2. Understanding entities vs endpoints {#entities-vs-endpoints}

This is crucial: **Rate limits are per entity, not per endpoint.**

**Entity examples**

<table data-search="false"><thead><tr><th>Entity</th><th>Endpoints That Use This Entity</th></tr></thead><tbody><tr><td><strong>Fixture</strong></td><td><code>/fixtures</code>, <code>/fixtures/{id}</code>, <code>/fixtures/date/{date}</code>, <code>/livescores</code></td></tr><tr><td><strong>Team</strong></td><td><code>/teams</code>, <code>/teams/{id}</code>, <code>/teams/search/{name}</code></td></tr><tr><td><strong>Player</strong></td><td><code>/players</code>, <code>/players/{id}</code>, <code>/players/search/{name}</code></td></tr><tr><td><strong>League</strong></td><td><code>/leagues</code>, <code>/leagues/{id}</code>, <code>/leagues/search/{name}</code></td></tr><tr><td><strong>Season</strong></td><td><code>/seasons</code>, <code>/seasons/{id}</code>, <code>/seasons/search/{name}</code></td></tr><tr><td><strong>Type</strong></td><td><code>/core/types</code>, <code>/core/types/{id}</code></td></tr><tr><td><strong>Venue</strong></td><td><code>/football/venues</code>, <code>/football/venues/{id}</code></td></tr><tr><td><strong>Coach</strong></td><td><code>/football/coaches</code>, <code>/football/coaches/{id}</code></td></tr><tr><td><strong>Referee</strong></td><td><code>/football/referees</code>, <code>/football/referees/{id}</code></td></tr></tbody></table>

**Example Scenario**

```javascript
// These ALL count toward the SAME Fixture entity limit
await fetch('/fixtures/123');                    // Fixture request #1
await fetch('/fixtures/date/2026-03-02');        // Fixture request #2
await fetch('/fixtures/multi/123,456,789');      // Fixture request #3
await fetch('/livescores/inplay');               // Fixture request #4 
                                                 // (livescores use Fixture entity)

// Current Fixture limit usage: 4/3000

// This uses a DIFFERENT limit (Team entity)
await fetch('/teams/53');                        // Team request #1
// Fixture: 4/3000, Team: 1/3000
```

**Why this matters**

On the Growth Plan could theoretically make:

* 3,000 Fixture requests
* 3,000 Team requests
* 3,000 Player requests
* 3,000 League requests

**= 12,000+ total requests per hour** (if you use multiple entities)

#### 2a. My Sportmonks endpoints and entity buckets

`/my/*` endpoints don't have a separate rate limit bucket of their own, they count against the entity bucket that matches the data they return:

| `/my/*` endpoint | Rate limit bucket used |
| ---------------- | ---------------------- |
| `/my/leagues`    | **League**             |
| `/my/usage`      | **Resource**           |
| `/my/resources`  | **Resource**           |

{% hint style="info" %}
Calling `/my/leagues` or `/my/usage` to check your own account status still consumes a request from the relevant entity's hourly quota, just like any other call.
{% endhint %}

#### 3. Monitoring your usage

**Check response headers**

Every successful API response includes a `rate_limit` object in the JSON body:

```json
{
  "data": { ... },
  "rate_limit": {
    "resets_in_seconds": 1847,
    "remaining": 2749,
    "requested_entity": "Fixture"
  }
}
```

**Fields explained:**

* `resets_in_seconds` - Time until limit resets (in seconds)
* `remaining` - Requests left for this entity
* `requested_entity` - Which entity this applies to

{% hint style="info" %}
The same information is also available as HTTP response headers on every successful request: `x-ratelimit-limit` (your total hourly limit for that entity) and `x-ratelimit-remaining` (requests left). Use whichever is more convenient for your setup, the header and the JSON body always match.
{% endhint %}

**Track in your code**

```javascript
async function makeRequest(url) {
  const response = await fetch(url);
  const data = await response.json();
  
  // Log usage
  const { remaining, resets_in_seconds, requested_entity } = data.rate_limit;
  console.log(`${requested_entity}: ${remaining} requests remaining`);
  console.log(`Resets in: ${Math.floor(resets_in_seconds / 60)} minutes`);
  
  // Warn when low
  if (remaining < 100) {
    console.warn(`⚠️ Low on ${requested_entity} requests! Optimise your calls.`);
  }
  
  return data;
}
```

**Usage dashboard**

Check real-time usage at:

* **MySportmonks dashboard:** [my.sportmonks.com](https://my.sportmonks.com/)
* **API endpoint:** `GET /my/usage` - Programmatic usage data

**Example response:**

```json
{
  "data": [
    {
      "entity": "Fixture",
      "requests_made": 251,
      "remaining_requests": 2749,
      "period_start": "2026-03-02 18:18:00",
      "period_end": "2026-03-02 19:18:00"
    },
    {
      "entity": "Team",
      "requests_made": 45,
      "remaining_requests": 2955,
      "period_start": "2026-03-02 18:25:00",
      "period_end": "2026-03-02 19:25:00"
    }
  ]
}
```

#### 4. Optimisation strategies

**Strategy 1: Use includes**

**The problem:**

```javascript
// ❌ Bad: 3 separate requests
const fixture = await fetch('/fixtures/123');
const homeTeam = await fetch('/teams/53');
const awayTeam = await fetch('/teams/62');
// = 1 Fixture + 2 Team requests
```

**The Solution:**

```javascript
// ✅ Good: 1 request with includes
const fixture = await fetch('/fixtures/123?include=participants');
// = 1 Fixture request (teams included in response)
```

**Impact:** Reduced from 3 requests to 1 = **67% savings**

**Strategy 2: Cache reference data**

**Reference data changes rarely - cache it!**

**What to cache:**

* Types (statistics types, event types, etc.)
* States (fixture states)
* Leagues (your available leagues)
* Venues (stadium information)
* Markets & Bookmakers (if using odds)

**How long to cache:**

* Types & States: **1 week** (rarely change)
* Leagues: **1 day** (occasionally update)
* Venues: **1 week** (stable data)
* Teams/Players: **1 hour** (injuries/transfers happen)

**Example implementation:**

```javascript
class CachedAPI {
  constructor(apiToken) {
    this.token = apiToken;
    this.cache = new Map();
  }
  
  async getTypes() {
    const cacheKey = 'types';
    const cacheTime = 7 * 24 * 60 * 60 * 1000; // 1 week
    
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      if (Date.now() - timestamp < cacheTime) {
        console.log('✅ Using cached types');
        return data;
      }
    }
    
    console.log('📡 Fetching fresh types');
    const response = await fetch(`/core/types?api_token=${this.token}`);
    const data = await response.json();
    
    this.cache.set(cacheKey, {
      data: data.data,
      timestamp: Date.now()
    });
    
    return data.data;
  }
  
  // Create a quick lookup map
  async getTypeById(typeId) {
    const types = await this.getTypes();
    return types.find(t => t.id === typeId);
  }
}

// Usage
const api = new CachedAPI('YOUR_TOKEN');

// First call - fetches from API
const type1 = await api.getTypeById(86); // "Shots On Target"

// Next 1000 lookups - all from cache (0 API calls!)
const type2 = await api.getTypeById(52); // "Goals"
const type3 = await api.getTypeById(78); // "Tackles"
```

**Impact:** Instead of 1000+ Type requests, you make 1 = **99.9% savings**

**Strategy 3: Batch operations**

**Use Multi-ID endpoints:**

```javascript
// ❌ Bad: 10 separate requests
for (const id of [123, 456, 789, 101, 102, 103, 104, 105, 106, 107]) {
  await fetch(`/fixtures/${id}`);
}
// = 10 Fixture requests

// ✅ Good: 1 batched request
const ids = [123, 456, 789, 101, 102, 103, 104, 105, 106, 107];
await fetch(`/fixtures/multi/${ids.join(',')}`);
// = 1 Fixture request
```

**Impact:** Reduced from 10 requests to 1 = **90% savings**

**Strategy 4: Smart polling for livescores**

**Don't poll everything constantly:**

```javascript
// ❌ Bad: Poll all matches every 5 seconds
setInterval(async () => {
  await fetch('/livescores'); // Even pre-match and finished games!
}, 5000);

// ✅ Good: Poll only what's needed
async function smartLivescorePolling() {
  // Get only matches that updated in last 10 seconds
  const updates = await fetch('/livescores/latest?api_token=YOUR_TOKEN');
  
  // Only update UI for changed matches
  updateOnlyChangedMatches(updates.data);
}

// Poll every 10 seconds (not 5)
setInterval(smartLivescorePolling, 10000);

// Or even better - only poll during live matches
function adaptivePolling() {
  const hasLiveMatches = checkIfAnyLiveMatches();
  
  if (hasLiveMatches) {
    // Poll every 10 seconds during live matches
    return setInterval(smartLivescorePolling, 10000);
  } else {
    // Poll every 5 minutes when no live matches
    return setInterval(smartLivescorePolling, 300000);
  }
}
```

**Impact:** Reduced polling frequency

**Strategy 5: Pagination optimisation**

**Use `filters=populate` for database population:**

```javascript
// ❌ Slow: Many requests with includes disabled
// Default: 25 per page = 40 requests for 1000 items
for (let page = 1; page <= 40; page++) {
  await fetch(`/fixtures?page=${page}`);
}

// ✅ Fast: Fewer requests, more items per page
// With populate: 1000 per page = 1 request for 1000 items
await fetch('/fixtures?filters=populate&per_page=1000');
// Note: includes are disabled with populate filter
```

**Impact:** Reduced from 40 requests to 1 = **97.5% savings**

**Summary: Combined impact**

**Before optimisation:**

```
Daily API Calls for a typical livescore app:
- 10,000 fixture requests
- 5,000 team requests  
- 3,000 type lookups
- 2,000 state lookups
= 20,000 total requests/day
```

**After Optimisation:**

```
Daily API Calls with all strategies:
- 2,000 fixture requests (includes, batching, smart polling)
- 500 team requests (includes)
- 1 type lookup (cached for 1 week)
- 1 state lookup (cached for 1 week)
= 2,502 total requests/day
```

#### 5. Handling rate limit errors

**What happens when you hit the limit?**

**You receive a `429 Too Many Requests` response:**

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit of 3000 requests per hour exceeded.",
  "retry_after": 1847,
  "rate_limit": {
    "remaining": 0,
    "total": 3000,
    "resets_in_seconds": 1847,
    "requested_entity": "Fixture"
  }
}
```

**Implement retry logic**

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (response.status === 429) {
        const data = await response.json();
        const retryAfter = data.retry_after || Math.pow(2, attempt) * 1000;
        
        console.log(`Rate limited. Retrying after ${retryAfter}ms...`);
        await sleep(retryAfter);
        continue;
      }
      
      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

**Client-side rate limiting**

**Prevent hitting limits in the first place:**

```javascript
class RateLimiter {
  constructor(maxRequests = 3000, windowMs = 3600000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map(); // entity -> [timestamps]
  }
  
  async throttle(entity = 'default') {
    const now = Date.now();
    
    // Get request history for this entity
    if (!this.requests.has(entity)) {
      this.requests.set(entity, []);
    }
    
    const entityRequests = this.requests.get(entity);
    
    // Remove old requests outside the window
    const validRequests = entityRequests.filter(
      time => now - time < this.windowMs
    );
    
    // Check if we're at the limit
    if (validRequests.length >= this.maxRequests) {
      const oldestRequest = validRequests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      
      console.log(`Throttling ${entity}: waiting ${waitTime}ms`);
      await sleep(waitTime);
      
      // Recursively try again
      return this.throttle(entity);
    }
    
    // Add this request to history
    validRequests.push(now);
    this.requests.set(entity, validRequests);
  }
}

// Usage
const limiter = new RateLimiter(3000, 3600000); // 3000/hour

async function makeRequest(url, entity) {
  await limiter.throttle(entity);
  return fetch(url);
}

// These will be automatically throttled
await makeRequest('/fixtures/123', 'Fixture');
await makeRequest('/teams/456', 'Team');
```

#### 6. Code examples

{% tabs %}
{% tab title="Javascript" %}

```javascript
class SportmonksAPI {
  constructor(apiToken, options = {}) {
    this.token = apiToken;
    this.baseURL = 'https://api.sportmonks.com/v3/football';
    this.cache = new Map();
    this.rateLimiter = new RateLimiter(
      options.maxRequests || 2800, // Leave buffer
      options.windowMs || 3600000
    );
  }
  
  async request(endpoint, params = {}, entity = 'default') {
    // Throttle request
    await this.rateLimiter.throttle(entity);
    
    // Build URL
    const url = new URL(`${this.baseURL}${endpoint}`);
    url.searchParams.append('api_token', this.token);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    // Make request with retry
    try {
      const response = await this.fetchWithRetry(url.toString());
      const data = await response.json();
      
      // Log rate limit info
      this.logRateLimit(data.rate_limit);
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
  
  async fetchWithRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      const response = await fetch(url);
      
      if (response.status === 429 && i < maxRetries - 1) {
        const data = await response.json();
        const retryAfter = data.retry_after || Math.pow(2, i) * 1000;
        console.log(`Retry after ${retryAfter}ms`);
        await sleep(retryAfter);
        continue;
      }
      
      return response;
    }
  }
  
  logRateLimit(rateLimit) {
    if (!rateLimit) return;
    
    const { remaining, requested_entity } = rateLimit;
    console.log(`${requested_entity}: ${remaining} remaining`);
    
    if (remaining < 200) {
      console.warn(`⚠️ Low on ${requested_entity} requests!`);
    }
  }
  
  // Cached method for types
  async getTypes() {
    const cacheKey = 'types';
    
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
        return data;
      }
    }
    
    const response = await this.request('/core/types', {}, 'Type');
    this.cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    
    return response.data;
  }
}

// Usage
const api = new SportmonksAPI('YOUR_TOKEN');

// Automatically throttled and cached
const fixtures = await api.request('/fixtures', {
  filters: 'fixtureLeagues:501',
  include: 'participants;scores;events'
}, 'Fixture');

const types = await api.getTypes(); // Cached for 1 week
```

{% endtab %}

{% tab title="Python" %}

```python
import time
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class RateLimiter:
    def __init__(self, max_requests: int = 3000, window_seconds: int = 3600):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[float]] = {}
    
    def throttle(self, entity: str = 'default'):
        now = time.time()
        
        if entity not in self.requests:
            self.requests[entity] = []
        
        # Remove old requests
        self.requests[entity] = [
            req_time for req_time in self.requests[entity]
            if now - req_time < self.window_seconds
        ]
        
        # Check if at limit
        if len(self.requests[entity]) >= self.max_requests:
            oldest = self.requests[entity][0]
            wait_time = self.window_seconds - (now - oldest)
            print(f"Throttling {entity}: waiting {wait_time:.2f}s")
            time.sleep(wait_time)
            return self.throttle(entity)
        
        # Add this request
        self.requests[entity].append(now)

class SportmonksAPI:
    def __init__(self, api_token: str):
        self.token = api_token
        self.base_url = 'https://api.sportmonks.com/v3/football'
        self.cache = {}
        self.limiter = RateLimiter(max_requests=2800)  # Leave buffer
    
    def request(self, endpoint: str, params: Optional[Dict] = None, entity: str = 'default'):
        # Throttle
        self.limiter.throttle(entity)
        
        # Build request
        url = f"{self.base_url}{endpoint}"
        if params is None:
            params = {}
        params['api_token'] = self.token
        
        # Make request with retry
        for attempt in range(3):
            try:
                response = requests.get(url, params=params, timeout=30)
                
                if response.status_code == 429:
                    retry_after = response.json().get('retry_after', 2 ** attempt)
                    print(f"Rate limited. Retrying after {retry_after}s")
                    time.sleep(retry_after)
                    continue
                
                response.raise_for_status()
                data = response.json()
                
                # Log rate limit
                if 'rate_limit' in data:
                    remaining = data['rate_limit']['remaining']
                    print(f"{entity}: {remaining} remaining")
                
                return data
            
            except requests.exceptions.RequestException as e:
                if attempt == 2:
                    raise
                time.sleep(2 ** attempt)
    
    def get_types(self):
        cache_key = 'types'
        cache_duration = timedelta(weeks=1)
        
        if cache_key in self.cache:
            data, timestamp = self.cache[cache_key]
            if datetime.now() - timestamp < cache_duration:
                print("Using cached types")
                return data
        
        response = self.request('/core/types', entity='Type')
        self.cache[cache_key] = (response['data'], datetime.now())
        return response['data']

# Usage
api = SportmonksAPI('YOUR_TOKEN')

fixtures = api.request('/fixtures', {
    'filters': 'fixtureLeagues:501',
    'include': 'participants;scores'
}, 'Fixture')

types = api.get_types()  # Cached
```

{% endtab %}

{% tab title="PHP" %}

```php
<?php

class RateLimiter {
    private $maxRequests;
    private $windowSeconds;
    private $requests = [];
    
    public function __construct($maxRequests = 3000, $windowSeconds = 3600) {
        $this->maxRequests = $maxRequests;
        $this->windowSeconds = $windowSeconds;
    }
    
    public function throttle($entity = 'default') {
        $now = time();
        
        // Initialise entity if needed
        if (!isset($this->requests[$entity])) {
            $this->requests[$entity] = [];
        }
        
        // Remove old requests outside the window
        $this->requests[$entity] = array_filter(
            $this->requests[$entity],
            function($timestamp) use ($now) {
                return ($now - $timestamp) < $this->windowSeconds;
            }
        );
        
        // Check if at limit
        if (count($this->requests[$entity]) >= $this->maxRequests) {
            $oldestRequest = min($this->requests[$entity]);
            $waitTime = $this->windowSeconds - ($now - $oldestRequest);
            
            echo "Throttling {$entity}: waiting {$waitTime}s\n";
            sleep($waitTime);
            
            // Try again recursively
            return $this->throttle($entity);
        }
        
        // Add this request to history
        $this->requests[$entity][] = $now;
    }
}

class SportmonksAPI {
    private $token;
    private $baseUrl = 'https://api.sportmonks.com/v3/football';
    private $cache = [];
    private $limiter;
    
    public function __construct($apiToken, $maxRequests = 2800) {
        $this->token = $apiToken;
        $this->limiter = new RateLimiter($maxRequests);
    }
    
    public function request($endpoint, $params = [], $entity = 'default', $maxRetries = 3) {
        // Throttle request
        $this->limiter->throttle($entity);
        
        // Build URL
        $params['api_token'] = $this->token;
        $url = $this->baseUrl . $endpoint . '?' . http_build_query($params);
        
        // Make request with retry logic
        for ($attempt = 0; $attempt < $maxRetries; $attempt++) {
            try {
                $response = $this->fetchWithRetry($url, $attempt);
                $data = json_decode($response, true);
                
                // Log rate limit info
                if (isset($data['rate_limit'])) {
                    $this->logRateLimit($data['rate_limit']);
                }
                
                return $data;
                
            } catch (Exception $e) {
                if ($attempt === $maxRetries - 1) {
                    throw $e;
                }
                
                // Exponential backoff
                $waitTime = pow(2, $attempt);
                echo "Request failed. Retrying after {$waitTime}s...\n";
                sleep($waitTime);
            }
        }
    }
    
    private function fetchWithRetry($url, $attempt) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 429) {
            $data = json_decode($response, true);
            $retryAfter = $data['retry_after'] ?? pow(2, $attempt);
            
            echo "Rate limited. Retrying after {$retryAfter}s...\n";
            sleep($retryAfter);
            
            // Retry recursively
            return $this->fetchWithRetry($url, $attempt);
        }
        
        if ($httpCode !== 200) {
            throw new Exception("HTTP {$httpCode}: {$response}");
        }
        
        return $response;
    }
    
    private function logRateLimit($rateLimit) {
        $remaining = $rateLimit['remaining'] ?? '?';
        $entity = $rateLimit['requested_entity'] ?? 'Unknown';
        
        echo "{$entity}: {$remaining} requests remaining\n";
        
        if ($remaining < 200) {
            echo "⚠️ Low on {$entity} requests! Optimize your calls.\n";
        }
    }
    
    // Cached method for types
    public function getTypes() {
        $cacheKey = 'types';
        $cacheDuration = 7 * 24 * 60 * 60; // 1 week
        
        if (isset($this->cache[$cacheKey])) {
            $cached = $this->cache[$cacheKey];
            if (time() - $cached['timestamp'] < $cacheDuration) {
                echo "Using cached types\n";
                return $cached['data'];
            }
        }
        
        echo "Fetching fresh types\n";
        $response = $this->request('/core/types', [], 'Type');
        
        $this->cache[$cacheKey] = [
            'data' => $response['data'],
            'timestamp' => time()
        ];
        
        return $response['data'];
    }
    
    // Helper method for batched requests
    public function getFixturesByIds($ids) {
        if (empty($ids)) {
            return [];
        }
        
        $idsString = implode(',', $ids);
        return $this->request("/fixtures/multi/{$idsString}", [], 'Fixture');
    }
}

// Usage Example
try {
    $api = new SportmonksAPI('YOUR_TOKEN_HERE');
    
    // Single fixture with includes
    $fixture = $api->request('/fixtures/123', [
        'include' => 'participants;scores;events'
    ], 'Fixture');
    
    echo "Fixture: {$fixture['data']['name']}\n";
    
    // Batched request
    $multipleFixtures = $api->getFixturesByIds([123, 456, 789]);
    echo "Fetched " . count($multipleFixtures['data']) . " fixtures\n";
    
    // Cached types (only fetches once)
    $types = $api->getTypes();
    echo "Got " . count($types) . " types\n";
    
    // Types from cache (0 API calls)
    $typesAgain = $api->getTypes();
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
```

{% endtab %}
{% endtabs %}

#### 7. Common scenarios

**Scenario 1: Building a livescore app**

**Challenge:** Need frequent updates without hitting limits

**Solution:**

```javascript
// Poll smartly - only active matches
async function updateLivescores() {
  // Use /livescores/latest - only matches updated in last 10s
  const response = await api.request('/livescores/latest', {
    include: 'scores;events'
  }, 'Fixture');
  
  // Only update changed matches
  updateChangedMatches(response.data);
}

// Adaptive polling
let pollInterval = null;

function startPolling() {
  const hasLiveMatches = checkLiveMatches();
  const interval = hasLiveMatches ? 10000 : 60000; // 10s or 1min
  
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(updateLivescores, interval);
}
```

**API Calls:** \~360/hour during live matches, \~60/hour otherwise

**Scenario 2: Populating database**

**Challenge:** Need to fetch thousands of fixtures

**Solution:**

```javascript
// Use filters=populate for bulk operations
async function populateFixtures(seasonId) {
  let hasMore = true;
  let page = 1;
  
  while (hasMore) {
    const response = await api.request('/fixtures', {
      filters: `populate;fixtureSeason:${seasonId}`,
      per_page: 1000,
      page: page
    }, 'Fixture');
    
    // Save to database
    await saveToDB(response.data);
    
    hasMore = response.pagination.has_more;
    page++;
    
    // Be nice - small delay between pages
    await sleep(100);
  }
}
```

**API Calls:** \~2-5 requests for entire season (vs 100+ without populate)

**Scenario 3: Statistics dashboard**

**Challenge:** Need lots of statistics data

**Solution:**

```javascript
// Cache types once, use includes efficiently
const types = await api.getTypes(); // Cached - 0 API calls after first
const typesMap = new Map(types.map(t => [t.id, t]));

// Get fixture with all stats in one call
const fixture = await api.request('/fixtures/123', {
  include: 'statistics;participants;scores'
}, 'Fixture');

// Decode types from cache (no API calls)
fixture.statistics.forEach(stat => {
  stat.typeName = typesMap.get(stat.type_id).name;
});
```

**API Calls:** 1 for data + 1 for types (cached forever)

#### Best practices summary

**DO**

* Use includes to combine data
* Cache reference data (types, states, leagues)
* Implement client-side rate limiting
* Monitor your usage regularly
* Use `filters=populate` for bulk operations
* Handle 429 errors gracefully with retry logic
* Poll intelligently (only what's needed, when needed)
* Batch requests with multi-ID endpoints

**DON'T**

* Poll every endpoint every 5 seconds
* Fetch types/states/leagues repeatedly
* Make separate requests when includes work
* Ignore rate limit warnings
* Request more data than you need
* Skip error handling

#### Quick checklist

Use this to optimise your implementation:

```
□ Using includes to combine related data
□ Caching types, states, and leagues
□ Implemented rate limit monitoring
□ Handling 429 errors with retry logic
□ Using /livescores/latest instead of /livescores
□ Polling at reasonable intervals (10-30s, not 1s)
□ Using filters=populate for database population
□ Batching requests with multi-ID endpoints
□ Logging rate limit info for debugging
□ Have fallback for when limits are hit
```

#### See also

* [Error Codes - 429 Too Many Requests](https://docs.sportmonks.com/v3/api/error-codes#429-too-many-requests) - Handle rate limit errors
* [Includes Tutorial](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/includes) - Combine data efficiently
* [Best Practices](https://docs.sportmonks.com/v3/welcome/best-practices) - General optimisation
* [Pagination](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/introduction/pagination) - Use populate filter
* [MySportmonks](https://my.sportmonks.com/) - Monitor usage

**Need Help?**

* Email: <support@sportmonks.com>

**For Enterprise plans**

Enterprise plans include a temporary burst buffer on top of the standard hourly limit.

* The buffer allows short-term spikes (for example, during match days or major tournaments).
* Once the standard limit is reached:
  * Requests continue until the buffer threshold is exceeded.
* After the buffer is exceeded:
  * Requests may be temporarily throttled
  * Notifications are sent
  * The account may be flagged for review