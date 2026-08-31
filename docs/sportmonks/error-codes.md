---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.848Z
---
# Error codes

Whenever you receive an unexpected response or experience unexpected behavior, check the HTTP response code and use this guide to troubleshoot the issue.

### Quick reference

| Code  | Error                 | When It Happens                       | Quick Fix                                |
| ----- | --------------------- | ------------------------------------- | ---------------------------------------- |
| `200` | OK                    | Request succeeded                     | No action needed ✅                       |
| `400` | Bad Request           | Malformed request, invalid parameters | Check request syntax and parameters      |
| `401` | Unauthorized          | Missing or invalid API token          | Verify your API token                    |
| `403` | Forbidden             | Accessing unauthorized resource       | Check your plan access                   |
| `404` | Not Found             | Resource doesn't exist                | Verify the ID or endpoint                |
| `429` | Too Many Requests     | Rate limit exceeded                   | Reduce request frequency or upgrade plan |
| `500` | Internal Server Error | Server-side issue                     | Contact support if persistent            |

{% hint style="info" %}
💡 **Pro tip:** Always implement proper error handling in your code to catch and handle these errors gracefully.
{% endhint %}

### Detailed error explanations

Click an error code below for detailed troubleshooting information:

#### 200: OK ✅

**What it means:** Your request was successful and data has been returned.

**Response structure:**

```json
{
  "data": { ... },
  "subscription": [ ... ],
  "rate_limit": { ... },
  "timezone": "UTC"
}
```

**Best practices:**

* Always check that `data` field exists before processing
* Store `rate_limit` information to monitor your usage
* Handle empty data arrays appropriately

📖 **Learn more:** [Understanding API Responses](https://docs.sportmonks.com/v3/api/syntax)

#### 400: Bad request ❌

**What it means:** There's a problem with how your request is formatted or the parameters you're using.

**Common causes:**

**1. Invalid query parameters**

```bash
# ❌ Wrong
GET /fixtures?invalid_param=123

# ✅ Correct
GET /fixtures?api_token=YOUR_TOKEN&filters=fixtureLeagues:501
```

**2. Malformed include syntax**

```bash
# ❌ Wrong - space in include
GET /fixtures/123?include=participants, events

# ✅ Correct - no spaces
GET /fixtures/123?include=participants;events
```

**3. Invalid filter syntax**

```bash
# ❌ Wrong - incorrect format
GET /fixtures?filters=league=501

# ✅ Correct - proper format
GET /fixtures?filters=fixtureLeagues:501
```

**4. Invalid timezone**

```bash
# ❌ Wrong - invalid timezone
GET /fixtures?timezone=NewYork

# ✅ Correct - proper timezone format
GET /fixtures?timezone=America/New_York
```

**Example error response:**

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "filters": [
      "The filters format is invalid."
    ]
  }
}
```

**How to fix:**

1. **Check parameter spelling** - Use exact names from documentation
2. **Verify filter syntax** - See [Filter Tutorial](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/filter-and-select-fields)
3. **Validate include format** - Use semicolons, no spaces
4. **Test with minimal parameters** - Remove optional params to isolate issue

**Code example (Error handling):**

```javascript
try {
  const response = await fetch(url);
  const data = await response.json();
  
  if (response.status === 400) {
    console.error('Bad Request:', data.message);
    console.error('Errors:', data.errors);
    // Fix your request parameters
  }
} catch (error) {
  console.error('Request failed:', error);
}
```

📖 **Related:** [Request Options](https://docs.sportmonks.com/v3/api/request-options) | [Filter Tutorial](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/filter-and-select-fields)

#### 401: Unauthorized 🔒

**What it means:** Your API token is missing, invalid, or expired.

**Common causes:**

**1. Missing API token**

```bash
# ❌ Wrong - no token
GET https://api.sportmonks.com/v3/football/fixtures

# ✅ Correct - token included
GET https://api.sportmonks.com/v3/football/fixtures?api_token=YOUR_TOKEN
```

**2. Token typo or extra spaces**

```bash
# ❌ Wrong - extra space
?api_token= YOUR_TOKEN

# ✅ Correct - no spaces
?api_token=YOUR_TOKEN
```

**3. Using test token in production**

```bash
# ❌ Wrong environment
Production URL + Test Token = 401 Error

# ✅ Correct - matching environment
Production URL + Production Token
```

**4. Revoked or expired token**

* Token was regenerated in MySportmonks
* Token was manually revoked
* Account subscription expired

**Example error response:**

```json
{
  "error": "Unauthenticated.",
  "message": "Please provide a valid API token"
}
```

**How to fix:**

1. **Verify your token:**
   * Go to [MySportmonks Dashboard](https://my.sportmonks.com)
   * Navigate to API tokens section
   * Copy the correct token (don't type it manually)
2. **Test with cURL:**

```bash
curl "https://api.sportmonks.com/v3/football/fixtures?api_token=YOUR_TOKEN"
```

3. **Check token format in code:**

```javascript
// ✅ Correct implementation
const API_TOKEN = process.env.SPORTMONKS_TOKEN; // From environment variable
const url = `https://api.sportmonks.com/v3/football/fixtures?api_token=${API_TOKEN}`;
```

4. **Common mistakes to avoid:**
   * ❌ Hardcoding tokens in frontend code (security risk)
   * ❌ Including quotes around the token
   * ❌ Adding spaces before or after the token
   * ❌ Using header authentication (use query parameter instead)

**Security best practices:**

```javascript
// ✅ Good - Server-side only
// backend/api.js
const SPORTMONKS_TOKEN = process.env.SPORTMONKS_TOKEN;

// ❌ Bad - Exposed in frontend
// frontend/app.js
const SPORTMONKS_TOKEN = 'abcd1234...'; // Visible to users!
```

📖 **Related:** [Authentication Guide](https://docs.sportmonks.com/v3/welcome/authentication) | [Best Practices](https://docs.sportmonks.com/v3/welcome/best-practices)

#### 403: Forbidden 🚫

**What it means:** Your API token is valid, but you don't have permission to access this resource.

**Common Causes:**

**1. Resource not in your plan**

```bash
# Your plan: Free Plan (Danish & Scottish leagues only)
GET /fixtures?filters=fixtureLeagues:8 # Premier League
# Result: 403 Forbidden
```

**2. Feature not available in your tier**

```bash
# Your plan: Basic (no xG access)
GET /fixtures/123?include=xGFixture
# Result: 403 Forbidden
```

**3. Accessing premium endpoints**

```bash
# Predictions endpoint requires add-on
GET /predictions/probabilities/fixtures/123
# Result: 403 if you don't have Predictions add-on
```

**Example Error Response:**

```json
{
  "error": "Access Denied",
  "message": "This resource is not available in your current subscription.",
  "resource": "xGFixture",
  "plan_required": "Standard or higher"
}
```

**How to fix:**

1. **Check your plan access:**
   * Go to [MySportmonks Dashboard](https://my.sportmonks.com)
   * Review "My Subscriptions" section
   * Check which leagues and features are included
2. **Verify resource availability:**

```javascript
// Check if resource is accessible
try {
  const response = await fetch(url);
  
  if (response.status === 403) {
    console.log('Resource not available in your plan');
    console.log('Upgrade at: https://www.sportmonks.com/football-api/#plans-pricing');
  }
} catch (error) {
  console.error(error);
}
```

3. **Common 403 scenarios:**

| Scenario              | Plan needed        | Solution                          |
| --------------------- | ------------------ | --------------------------------- |
| Access Premier League | Standard+          | Upgrade or filter to your leagues |
| Use xG data           | Standard+          | Upgrade or remove xG includes     |
| Access Predictions    | Predictions add-on | Add predictions to your plan      |
| Live odds             | Odds package       | Subscribe to odds package         |

4. **Workarounds (if you can't upgrade):**
   * Filter requests to only leagues in your plan
   * Remove premium includes from requests
   * Check [Data Features by League](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/data-features-per-league)

📖 **Related:** [Plan Features](https://www.sportmonks.com/football-api/#plans-pricing) | [Data Features per League](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/data-features-per-league)

#### 404: Not found 🔍

**What it means:** The resource you're trying to access doesn't exist.

**Common Causes:**

**1. Invalid ID**

```bash
# ❌ Wrong - fixture doesn't exist
GET /fixtures/99999999999

# ✅ Correct - use valid fixture ID
GET /fixtures/18535517
```

**2. Wrong endpoint path**

```bash
# ❌ Wrong - typo in endpoint
GET /v3/football/fixture/123  # "fixture" should be "fixtures"

# ✅ Correct - proper endpoint
GET /v3/football/fixtures/123
```

**3. Resource was deleted**

```bash
# Fixture was removed from database
# (e.g., cancelled match, placeholder fixture)
GET /fixtures/12345
# Result: 404 Not Found
```

**Example error response:**

```json
{
  "error": "Not Found",
  "message": "The requested resource could not be found.",
  "resource_type": "fixture",
  "resource_id": "99999999"
}
```

**How to fix:**

1. **Verify the ID exists:**

```javascript
// Search for the resource first
const searchResponse = await fetch(
  'https://api.sportmonks.com/v3/football/fixtures/search/Celtic?api_token=YOUR_TOKEN'
);
const results = await searchResponse.json();

// Then use a valid ID from results
const fixtureId = results.data[0].id;
```

2. **Check endpoint spelling:**

```javascript
// ✅ Correct endpoints
/v3/football/fixtures/{id}
/v3/football/teams/{id}
/v3/football/players/{id}
/v3/football/leagues/{id}

// ❌ Common mistakes
/v3/football/fixture/{id}   // Missing 's'
/v3/soccer/fixtures/{id}    // Wrong sport name
/v3/football/match/{id}     // Wrong entity name
```

3. **Handle 404 gracefully:**

```javascript
async function getFixture(fixtureId) {
  try {
    const response = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures/${fixtureId}?api_token=YOUR_TOKEN`
    );
    
    if (response.status === 404) {
      console.log('Fixture not found');
      return null; // Return null instead of throwing error
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

4. **Use ID finder tool:**
   * Visit [ID Finder](https://my.sportmonks.com/resources/id-finder)
   * Search for teams, players, leagues, etc.
   * Get valid IDs for your requests

📖 **Related:** [API Structure](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/api-structure-and-navigation) | [Endpoints Reference](https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints)

#### 429: Too many requests ⏱️

**What it means:** You've exceeded your plan's rate limit.

**Common causes:**

**1. Making requests too quickly**

```javascript
// ❌ Wrong - rapid fire requests
for (let i = 0; i < 1000; i++) {
  fetch(url); // Hitting rate limit!
}

// ✅ Correct - with delay
for (let i = 0; i < 1000; i++) {
  await fetch(url);
  await sleep(100); // 100ms delay
}
```

**2. Inefficient API usage**

```javascript
// ❌ Wrong - separate requests
const team1 = await fetch('/teams/53');
const team2 = await fetch('/teams/62');
const fixture = await fetch('/fixtures/123');
// 3 API calls

// ✅ Correct - use includes
const fixture = await fetch('/fixtures/123?include=participants');
// 1 API call with all data
```

**3. Not caching reference data**

```javascript
// ❌ Wrong - fetching types every time
for (const stat of statistics) {
  const type = await fetch(`/types/${stat.type_id}`); // Wasteful!
}

// ✅ Correct - fetch once and cache
const allTypes = await fetch('/types');
const typesMap = new Map(allTypes.data.map(t => [t.id, t]));
// Use cached types for lookups
```

**Example error response:**

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit of 3000 requests per hour exceeded.",
  "retry_after": 1847,
  "rate_limit": {
    "remaining": 0,
    "total": 3000,
    "resets_in": "30:47"
  }
}
```

**How to fix:**

**1. Check your rate limit:** Every successful response includes rate limit info:

```json
{
  "data": { ... },
  "rate_limit": {
    "resets_in_seconds": 1847,
    "remaining": 2847,
    "requested_entity": "Fixture"
  }
}
```

**2. Implement rate limiting:**

```javascript
class RateLimiter {
  constructor(maxRequests, perSeconds) {
    this.maxRequests = maxRequests;
    this.perSeconds = perSeconds;
    this.requests = [];
  }
  
  async throttle() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.perSeconds * 1000);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = (this.perSeconds * 1000) - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.requests.push(Date.now());
  }
}

// Usage
const limiter = new RateLimiter(3000, 3600); // 3000 requests per hour

async function makeRequest(url) {
  await limiter.throttle();
  return fetch(url);
}
```

**3. Implement retry with exponential backoff:**

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || Math.pow(2, i);
        console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
        await sleep(retryAfter * 1000);
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}
```

**4. Optimisation strategies:**

| Strategy             | Savings | How                                      |
| -------------------- | ------- | ---------------------------------------- |
| Use includes         | 50-80%  | Combine related data in one request      |
| Cache reference data | 30-50%  | Store types, states, leagues locally     |
| Batch operations     | 40-60%  | Use multi-ID endpoints where available   |
| Smart polling        | 30-40%  | Only poll live matches, reduce frequency |

**Example - Before & after optimisation:**

```javascript
// ❌ Before: 50 API calls for 10 fixtures
for (const fixtureId of fixtureIds) {
  const fixture = await fetch(`/fixtures/${fixtureId}`);
  const team1 = await fetch(`/teams/${fixture.team1_id}`);
  const team2 = await fetch(`/teams/${fixture.team2_id}`);
  const events = await fetch(`/fixtures/${fixtureId}/events`);
  const stats = await fetch(`/fixtures/${fixtureId}/statistics`);
}

// ✅ After: 2 API calls for 10 fixtures
const fixtures = await fetch(
  `/fixtures/multi/${fixtureIds.join(',')}?include=participants;events;statistics.type`
);
// Then fetch types once and cache
const types = await fetch('/types');
```

**5. Monitor your usage:**

```javascript
function logRateLimit(response) {
  const remaining = response.rate_limit.remaining;
  const total = response.rate_limit.resets_in_seconds;
  
  console.log(`Rate limit: ${remaining} requests remaining`);
  
  if (remaining < 100) {
    console.warn('⚠️ Low on API calls! Optimize your requests.');
  }
}
```

📖 **Related:** [Rate Limiting Guide](https://docs.sportmonks.com/v3/api/rate-limit) | [Includes Tutorial](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/includes) | [Best Practices](https://docs.sportmonks.com/v3/welcome/best-practices)

#### 500: Internal server error 🔧

**What it means:** Something went wrong on our servers.

**When this happens:**

* Temporary server issue
* Database connectivity problem
* Unexpected data format causing server error
* Service maintenance or deployment

**Example error response:**

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred. Our team has been notified.",
  "error_id": "err_abc123xyz"
}
```

**How to handle:**

**1. Implement retry logic:**

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      
      if (response.status === 500) {
        if (i < maxRetries - 1) {
          console.log(`Server error. Retrying (${i + 1}/${maxRetries})...`);
          await sleep(Math.pow(2, i) * 1000); // Exponential backoff
          continue;
        }
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

**2. Check API status:**

* Visit [Sportmonks Status Page](https://status.sportmonks.com) (if available)
* Check for maintenance announcements
* Verify if issue is widespread or isolated

**3. Contact support (if persistent):**

```javascript
if (response.status === 500) {
  const errorDetails = {
    timestamp: new Date().toISOString(),
    endpoint: url,
    error_id: response.error_id,
    request_id: response.headers.get('X-Request-ID')
  };
  
  console.error('Persistent 500 error:', errorDetails);
  // Send to support: support@sportmonks.com
}
```

**4. Graceful degradation:**

```javascript
async function getFixtures(fallbackData) {
  try {
    const response = await fetch(url);
    
    if (response.status === 500) {
      console.warn('Server error. Using cached data.');
      return fallbackData; // Use cached or default data
    }
    
    return await response.json();
  } catch (error) {
    console.error('Complete failure:', error);
    return fallbackData;
  }
}
```

📖 **Related:** [Best Practices](https://docs.sportmonks.com/v3/welcome/best-practices) | [Contact Support](https://www.sportmonks.com/contact-support/)

### Common error scenarios

#### Scenario 1: "Data is missing"

**Problem:** Response is 200 OK but data is empty or missing fields.

**Not an error code issue!** This is usually because:

* Resource not in your plan → Check [plan access](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/data-features-per-league)
* Missing includes → Add necessary includes to request
* Filtering too strict → Review [filter syntax](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/filter-and-select-fields)

#### Scenario 2: CORS Errors (Frontend)

**Problem:** "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution:** This isn't an API error - use a backend proxy:

```javascript
// ❌ Don't do this - frontend direct call
fetch('https://api.sportmonks.com/v3/football/fixtures?api_token=YOUR_TOKEN')

// ✅ Do this - call your backend
fetch('/api/fixtures') // Your backend proxies to Sportmonks
```

📖 **Learn more:** [CORS Best Practices](https://docs.sportmonks.com/v3/welcome/best-practices#cors-and-frontend-security)

#### Scenario 3: Timeout errors

**Problem:** Request times out with no response.

**Solutions:**

* Reduce includes complexity
* Add pagination to large requests
* Check your network connectivity
* Increase timeout threshold in your code

### Error handling code examples

#### Complete Example (JavaScript/Node.js)

{% tabs %}
{% tab title="JavaScript" %}

```javascript
class SportmonksAPI {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseURL = 'https://api.sportmonks.com/v3/football';
  }
  
  async request(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    url.searchParams.append('api_token', this.apiToken);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    try {
      const response = await fetch(url.toString());
      const data = await response.json();
      
      // Handle different status codes
      switch (response.status) {
        case 200:
          return { success: true, data: data.data };
          
        case 400:
          throw new Error(`Bad Request: ${data.message || 'Invalid parameters'}`);
          
        case 401:
          throw new Error('Unauthorized: Check your API token');
          
        case 403:
          throw new Error(`Forbidden: ${data.message || 'Resource not in your plan'}`);
          
        case 404:
          throw new Error(`Not Found: Resource doesn't exist`);
          
        case 429:
          const retryAfter = data.retry_after || 60;
          throw new Error(`Rate Limited: Retry after ${retryAfter} seconds`);
          
        case 500:
          throw new Error('Server Error: Try again later or contact support');
          
        default:
          throw new Error(`Unexpected error: ${response.status}`);
      }
    } catch (error) {
      console.error('API Error:', error.message);
      throw error;
    }
  }
}

// Usage
const api = new SportmonksAPI(process.env.SPORTMONKS_TOKEN);

try {
  const fixtures = await api.request('/fixtures', {
    filters: 'fixtureLeagues:501',
    include: 'participants'
  });
  console.log(fixtures);
} catch (error) {
  // Handle error appropriately in your app
  console.error('Failed to fetch fixtures:', error);
}
```

{% endtab %}

{% tab title="Python" %}

```python
import requests
import time
from typing import Optional, Dict, Any

class SportmonksAPI:
    def __init__(self, api_token: str):
        self.api_token = api_token
        self.base_url = 'https://api.sportmonks.com/v3/football'
    
    def request(self, endpoint: str, params: Optional[Dict] = None, retry_count: int = 0) -> Dict[str, Any]:
        """Make API request with error handling"""
        url = f"{self.base_url}{endpoint}"
        
        # Add API token to params
        if params is None:
            params = {}
        params['api_token'] = self.api_token
        
        try:
            response = requests.get(url, params=params, timeout=30)
            
            # Handle different status codes
            if response.status_code == 200:
                return {'success': True, 'data': response.json().get('data')}
            
            elif response.status_code == 400:
                error_data = response.json()
                raise ValueError(f"Bad Request: {error_data.get('message', 'Invalid parameters')}")
            
            elif response.status_code == 401:
                raise PermissionError('Unauthorized: Check your API token')
            
            elif response.status_code == 403:
                error_data = response.json()
                raise PermissionError(f"Forbidden: {error_data.get('message', 'Resource not in your plan')}")
            
            elif response.status_code == 404:
                raise LookupError('Not Found: Resource does not exist')
            
            elif response.status_code == 429:
                if retry_count < 3:
                    retry_after = response.json().get('retry_after', 60)
                    print(f"Rate limited. Retrying after {retry_after} seconds...")
                    time.sleep(retry_after)
                    return self.request(endpoint, params, retry_count + 1)
                else:
                    raise Exception('Rate limit exceeded. Max retries reached.')
            
            elif response.status_code == 500:
                if retry_count < 2:
                    wait_time = 2 ** retry_count
                    print(f"Server error. Retrying after {wait_time} seconds...")
                    time.sleep(wait_time)
                    return self.request(endpoint, params, retry_count + 1)
                else:
                    raise Exception('Server error persists. Contact support.')
            
            else:
                raise Exception(f"Unexpected error: HTTP {response.status_code}")
        
        except requests.exceptions.Timeout:
            raise TimeoutError('Request timed out')
        
        except requests.exceptions.ConnectionError:
            raise ConnectionError('Failed to connect to API')

# Usage
api = SportmonksAPI(os.environ.get('SPORTMONKS_TOKEN'))

try:
    fixtures = api.request('/fixtures', {
        'filters': 'fixtureLeagues:501',
        'include': 'participants'
    })
    print(f"Found {len(fixtures['data'])} fixtures")
except Exception as error:
    print(f"Error: {error}")
```

{% endtab %}
{% endtabs %}

### See also

* [Rate Limiting Guide](https://docs.sportmonks.com/v3/api/rate-limit) - Understand and optimize rate limits
* [Authentication](https://docs.sportmonks.com/v3/welcome/authentication) - Setting up API access
* [Best Practices](https://docs.sportmonks.com/v3/welcome/best-practices) - Build robust applications
* [Request Options](https://docs.sportmonks.com/v3/api/request-options) - Available query parameters
* [Contact Support](https://www.sportmonks.com/contact-support/) - Get help when needed

\
**Need help?** Contact <support@sportmonks.com> or use the chat widget.