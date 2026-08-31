---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.846Z
---
# Syntax

> This syntax applies broadly across most Sportmonks endpoints. Each endpoint’s documentation will point out any exceptions.

### Syntax operators & usage

| Operator    | Purpose                                          | Example                              |
| ----------- | ------------------------------------------------ | ------------------------------------ |
| `&select=`  | Pick specific fields on the base entity          | `&select=name,starting_at`           |
| `&include=` | Include related entities / relations             | `&include=lineups,events`            |
| `;`         | Terminates one include chain and allows new ones | `&include=lineups;events`            |
| `:`         | Indicates field selection inside an include      | `&include=events:player_name,minute` |
| `,`         | Separates multiple IDs or fields                 | `&filters=eventTypes:14,18`          |

### Example use patterns

**Base field selection**

Fetch only fields you need:

```
?api_token=…&select=name,starting_at
```

**Including relations**

Include related data objects:

```
?api_token=…&include=lineups,events
```

**Field filtering inside includes**

Limit fields of included relations:

```
?api_token=…&include=events:player_name,minute&filters=eventTypes:14,18
```

**Nested includes (multi-level)**

Chain includes for nested relations:

```
?api_token=…&include=events.player.country:name
```

### Exceptions & endpoint-specific notes

> ⚠️ Some endpoints do **not** support certain operators or include relations. Always review the endpoint’s documentation for allowed fields and relations.

* Invalid syntax (wrong field names, relations, or separators) may cause a **400 Bad Request**.
* When using both `include` and `filters`, filters may apply to the base entity or included entities depending on endpoint behavior.
* Some endpoints restrict depth of includes or fields allowed — use the “Allowed includes / fields” section of that endpoint page.

<table><thead><tr><th>Syntax</th><th width="211">Usage</th><th width="272">Example</th></tr></thead><tbody><tr><td><code>&#x26;select=</code></td><td>Select specific fields on the base entity</td><td><code>&#x26;select=name</code></td></tr><tr><td><code>&#x26;include=</code></td><td>Include relations</td><td><code>&#x26;include=lineups</code></td></tr><tr><td><code>&#x26;filters=</code></td><td>Filter your request</td><td><code>&#x26;filters=eventTypes:15</code></td></tr><tr><td><code>;</code></td><td>Mark end of (nested) relation. You can start including other relations from here</td><td><code>&#x26;include=lineups;events;participants</code></td></tr><tr><td><code>:</code></td><td>Mark field selection</td><td><code>&#x26;include=lineups:player_name;events:player_name,related_player_name,minute</code></td></tr><tr><td><code>,</code></td><td>Used as separation to select or filter on more IDs</td><td><code>&#x26;include=events:player_name,related_player_name,minute&#x26;filters=eventTypes:15</code></td></tr></tbody></table>