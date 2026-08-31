---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.856Z
---
# GET Brackets by Season ID

The Tournament Brackets endpoint provides a structured view of knockout stage tournament brackets, making it easy to display elimination rounds, progression paths, and matchup hierarchies in your application.

{% hint style="info" %}
**Available for:** Knockout stages only (stages with `type_id: 224`) with placeholder and match numbers available.

**Use Cases:** World Cup
{% endhint %}

Tournament brackets organise knockout fixtures into a tree structure, showing how winners advance through rounds until a champion is crowned. This endpoint automatically structures the data with fixture progression paths (edges) that define how teams move through the bracket.

### When to use this endpoint

Use the brackets endpoint when you need to:

* Display a complete knockout bracket visualisation
* Show tournament progression from Round of 32 → Round of 16 → Quarter-finals → Semi-finals → 3rd Place → Final
* Track which teams advance to which matches based on match outcomes
* Build interactive bracket interfaces with automatic progression logic

{% hint style="info" %}
**Knockout Stages Only**

This endpoint only returns data for knockout stages (elimination rounds). Group stage fixtures should be accessed via the standard fixtures endpoint.
{% endhint %}

### Endpoint

```bash
GET https://api.sportmonks.com/v3/football/seasons/{season_id}/brackets
```

#### Parameters

| Parameter   | Type    | Required | Description                                    |
| ----------- | ------- | -------- | ---------------------------------------------- |
| `season_id` | integer | Yes      | The season ID (e.g., 26618 for World Cup 2026) |
| `api_token` | string  | Yes      | Your API authentication token                  |
| `include`   | string  | No       | Related data to include (see Includes section) |

#### Example Request

```bash
GET https://api.sportmonks.com/v3/football/seasons/26618/brackets?api_token=YOUR_TOKEN
```

### Response Structure

The response contains two main components: `stages` (fixtures organised by knockout round) and `edges` (progression paths between fixtures).

```json
{
  "data": {
    "stages": [
      {
        "stage_id": 77479086,
        "stage_name": "16th Finals",
        "fixtures": [
          {
            "id": 19606960,
            "sport_id": 1,
            "league_id": 732,
            "season_id": 26618,
            "stage_id": 77479086,
            "state_id": 1,
            "venue_id": 343444,
            "name": "2nd position Group A vs 2nd position Group B",
            "starting_at": "2026-06-28 19:00:00",
            "result_info": null,
            "leg": "1/1",
            "details": "Match 73",
            "length": 90,
            "placeholder": true,
            "starting_at_timestamp": 1782673200
          }
        ]
      },
      {
        "stage_id": 77479087,
        "stage_name": "8th Finals",
        "fixtures": [
          {
            "id": 19606967,
            "name": "Winner Match 74 vs Winner Match 77",
            "starting_at": "2026-07-04 21:00:00",
            "details": "Match 89",
            "placeholder": true
          }
        ]
      },
      {
        "stage_id": 77479088,
        "stage_name": "Quarter-finals",
        "fixtures": [...]
      },
      {
        "stage_id": 77479089,
        "stage_name": "Semi-finals",
        "fixtures": [...]
      },
      {
        "stage_id": 77479091,
        "stage_name": "3rd Place Final",
        "fixtures": [
          {
            "id": 19606976,
            "name": "Loser Semi-final 1 vs Loser Semi-final 2",
            "starting_at": "2026-07-18 21:00:00",
            "details": "Match 103",
            "placeholder": true
          }
        ]
      },
      {
        "stage_id": 77479090,
        "stage_name": "Final",
        "fixtures": [
          {
            "id": 19606975,
            "name": "Winner Semi-final 1 vs Winner Semi-final 2",
            "starting_at": "2026-07-19 19:00:00",
            "details": "Match 104",
            "placeholder": true
          }
        ]
      }
    ],
    "edges": [
      {
        "id": 9,
        "season_id": 26618,
        "child_fixture_id": 19606975,
        "child_slot": "home",
        "parent_fixture_id": 19606974,
        "parent_outcome": "winner"
      },
      {
        "id": 10,
        "season_id": 26618,
        "child_fixture_id": 19606975,
        "child_slot": "away",
        "parent_fixture_id": 19606973,
        "parent_outcome": "winner"
      },
      {
        "id": 11,
        "season_id": 26618,
        "child_fixture_id": 19606976,
        "child_slot": "home",
        "parent_fixture_id": 19606974,
        "parent_outcome": "loser"
      },
      {
        "id": 12,
        "season_id": 26618,
        "child_fixture_id": 19606976,
        "child_slot": "away",
        "parent_fixture_id": 19606973,
        "parent_outcome": "loser"
      }
    ]
  },
  "subscription": [...],
  "rate_limit": {
    "resets_in_seconds": 3600,
    "remaining": 2999,
    "requested_entity": "Fixture"
  }
}
```

#### Response Fields

**Stages Array**

| Field        | Type    | Description                                               |
| ------------ | ------- | --------------------------------------------------------- |
| `stage_id`   | integer | Unique stage identifier                                   |
| `stage_name` | string  | Name of the knockout round (e.g., "Semi-finals", "Final") |
| `fixtures`   | array   | All fixtures in this knockout round                       |

**Fixture Object**

| Field         | Type        | Description                                      |
| ------------- | ----------- | ------------------------------------------------ |
| `id`          | integer     | Unique fixture ID                                |
| `stage_id`    | integer     | Stage this fixture belongs to                    |
| `name`        | string      | Fixture name (shows teams/progression)           |
| `starting_at` | string      | Match kickoff time (UTC)                         |
| `details`     | string      | Match number identifier (e.g., "Match 73")       |
| `placeholder` | boolean     | `true` if teams are not yet determined           |
| `state_id`    | integer     | Match state (1=Not Started, 5=Finished, etc.)    |
| `venue_id`    | integer     | Stadium identifier                               |
| `leg`         | string      | "1/1" for single-leg knockout matches            |
| `result_info` | string/null | Result description (e.g., "Won after penalties") |

**Edges Array**

The `edges` array defines progression paths between fixtures:

| Field               | Type    | Description                                      |
| ------------------- | ------- | ------------------------------------------------ |
| `id`                | integer | Unique edge identifier                           |
| `season_id`         | integer | Season identifier                                |
| `child_fixture_id`  | integer | Fixture that receives the advancing team         |
| `child_slot`        | string  | Position in child fixture (`"home"` or `"away"`) |
| `parent_fixture_id` | integer | Fixture that determines the advancing team       |
| `parent_outcome`    | string  | Which team advances (`"winner"` or `"loser"`)    |

{% hint style="info" %}
**Understanding Edges**

Edges create the bracket tree structure. Each edge says: "The **winner/loser** of Match X goes to the **home/away** slot of Match Y."

For example, the Final receives the **winners** of both Semi-finals, whilst the 3rd Place Final receives the **losers** of both Semi-finals.
{% endhint %}

### Understanding bracket structure

#### Stages organisation

Stages are returned in the order they appear in the response (not sorted by chronological order):

```
16th Finals      → Round of 32 (16 matches)
8th Finals       → Round of 16 (8 matches)
Quarter-finals   → Quarter-finals (4 matches)
Semi-finals      → Semi-finals (2 matches)
3rd Place Final  → 3rd Place playoff (1 match)
Final            → Championship match (1 match)
```

#### Placeholder Fixtures

Before teams are determined, fixtures have `placeholder: true` and descriptive names:

```json
{
  "name": "Winner Match 74 vs Winner Match 77",
  "placeholder": true
}
```

After matches are played and teams advance:

```json
{
  "name": "Brazil vs Argentina",
  "placeholder": false
}
```

Always check `placeholder` before displaying team information.

#### Progression Paths via Edges

Edges define how teams move through the bracket:

**Example: Final receives winners from both Semi-finals**

```json
// Semi-final 1 winner → Final home slot
{
  "child_fixture_id": 19606975,  // Final
  "child_slot": "home",
  "parent_fixture_id": 19606974,  // Semi-final 1
  "parent_outcome": "winner"
}

// Semi-final 2 winner → Final away slot
{
  "child_fixture_id": 19606975,  // Final
  "child_slot": "away",
  "parent_fixture_id": 19606973,  // Semi-final 2
  "parent_outcome": "winner"
}
```

**Example: 3rd Place Final receives losers from both Semi-finals**

```json
// Semi-final 1 loser → 3rd Place home slot
{
  "child_fixture_id": 19606976,  // 3rd Place Final
  "child_slot": "home",
  "parent_fixture_id": 19606974,  // Semi-final 1
  "parent_outcome": "loser"
}

// Semi-final 2 loser → 3rd Place away slot
{
  "child_fixture_id": 19606976,  // 3rd Place Final
  "child_slot": "away",
  "parent_fixture_id": 19606973,  // Semi-final 2
  "parent_outcome": "loser"
}
```

### Includes

Add includes to get complete fixture data with participants, scores, and match details:

```
GET /v3/football/seasons/{season_id}/brackets
  ?api_token=YOUR_TOKEN
  &include=stages.fixtures.participants;stages.fixtures.state;stages.fixtures.scores
```

#### Available Includes

[`sport`](https://docs.sportmonks.com/v3/core-api/) [`round`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#round) [`stage`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#stage) [`group`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#group) [`aggregate`](/v3/endpoints-and-entities/entities/fixture#aggregate) [`league`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#league) [`season`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#season)[`coaches`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#coach) [`tvStations`](/v3/endpoints-and-entities/entities/other#tvstation) [`venue`](/v3/endpoints-and-entities/entities/other#venue) [`state`](/v3/endpoints-and-entities/entities/other#state)  [`weatherReport`](/v3/endpoints-and-entities/entities/other#weatherreport) [`lineups`](/v3/endpoints-and-entities/entities/fixture#lineup) [`events`](/v3/endpoints-and-entities/entities/fixture#event) [`timeline`](/v3/endpoints-and-entities/entities/fixture#event) [`comments`](/v3/endpoints-and-entities/entities/other#commentary) [`trends`](/v3/endpoints-and-entities/entities/statistic#trend) [`statistics`](/v3/endpoints-and-entities/entities/statistic#fixturestatistic) [`periods`](/v3/endpoints-and-entities/entities/fixture#period) [`participants`  ](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#team)[`odds`](/v3/endpoints-and-entities/entities/odd-and-prediction#odd)[`premiumOdds`](https://docs.sportmonks.com/football/endpoints-and-entities/entities/odd-and-prediction#premium-odd) [`inplayOdds`](/v3/endpoints-and-entities/entities/odd-and-prediction#inplayodd) [`prematchNews`](/v3/endpoints-and-entities/entities/other#news) [`postmatchNews`](/v3/endpoints-and-entities/entities/other#news)  [`metadata`](/v3/endpoints-and-entities/entities/other#metadata) [`sidelined`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#sidelined)[`predictions`](/v3/endpoints-and-entities/entities/odd-and-prediction#prediction-valuebet) [`referees`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#referees) [`formations`](/v3/endpoints-and-entities/entities/fixture#formation) [`ballCoordinates`](/v3/endpoints-and-entities/entities/fixture#ballcoordinate) [`scores`](/v3/endpoints-and-entities/entities/fixture#score)  [`xGFixture`](/v3/endpoints-and-entities/entities/expected) [`pressure`](/v3/tutorials-and-guides/tutorials/includes/pressure-index) `expectedLineups`

#### Example with full includes

```bash
GET https://api.sportmonks.com/v3/football/seasons/26618/brackets
  ?api_token=YOUR_TOKEN
  &include=scores;participants;lineups
```

### Bracket visualisation

The brackets endpoint returns data that can be visualised as a tournament tree:

<figure><img src="/files/B4JpAnfB18ZitJLfnlrb" alt=""><figcaption></figcaption></figure>

### Frontend Examples

{% tabs %}
{% tab title="React" %}

```javascript
import { useState } from 'react';

function TournamentBracket({ seasonId, apiToken }) {
  const [bracketData, setBracketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBracket = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.sportmonks.com/v3/football/seasons/${seasonId}/brackets` +
        `?api_token=${apiToken}` +
        `&include=participants;state`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBracketData(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch bracket:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading bracket...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!bracketData) {
    return <button onClick={fetchBracket}>Load Bracket</button>;
  }

  return (
    <div className="bracket">
      <h1>Knockout Bracket</h1>
      
      {bracketData.stages.map(stage => (
        <div key={stage.stage_id} className="stage">
          <h2>{stage.stage_name}</h2>
          
          {stage.fixtures.map(fixture => (
            <div key={fixture.id} className="fixture">
              <div className="match-details">
                <span className="match-number">{fixture.details}</span>
                <span className="match-name">{fixture.name}</span>
              </div>
              
              {fixture.participants?.map(p => (
                <div key={p.id} className="team">
                  {p.participant?.name || 'TBD'}
                  {p.meta?.winner && ' 🏆'}
                </div>
              ))}
              
              <div className="match-time">
                {new Date(fixture.starting_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ))}
      
      <div className="bracket-edges">
        <h3>Progression Paths</h3>
        <p>{bracketData.edges.length} advancement paths defined</p>
      </div>
    </div>
  );
}

export default TournamentBracket;
```

{% endtab %}

{% tab title="Vue" %}

```vue
<template>
  <div class="bracket">
    <button v-if="!bracketData" @click="fetchBracket">Load Bracket</button>
    
    <div v-if="loading">Loading bracket...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="bracketData">
      <h1>Knockout Bracket</h1>
      
      <div 
        v-for="stage in bracketData.stages" 
        :key="stage.stage_id" 
        class="stage"
      >
        <h2>{{ stage.stage_name }}</h2>
        
        <div 
          v-for="fixture in stage.fixtures" 
          :key="fixture.id"
          class="fixture"
        >
          <div class="match-details">
            <span class="match-number">{{ fixture.details }}</span>
            <span class="match-name">{{ fixture.name }}</span>
          </div>
          
          <div 
            v-for="participant in fixture.participants" 
            :key="participant.id"
            class="team"
          >
            {{ participant.participant?.name || 'TBD' }}
            <span v-if="participant.meta?.winner">🏆</span>
          </div>
          
          <div class="match-time">
            {{ new Date(fixture.starting_at).toLocaleString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TournamentBracket',
  props: {
    seasonId: {
      type: Number,
      required: true
    },
    apiToken: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      bracketData: null,
      loading: false,
      error: null
    };
  },
  methods: {
    async fetchBracket() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(
          `https://api.sportmonks.com/v3/football/seasons/${this.seasonId}/brackets` +
          `?api_token=${this.apiToken}` +
          `&include=participants;state`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.bracketData = data.data;
      } catch (err) {
        this.error = err.message;
        console.error('Failed to fetch bracket:', err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

{% endtab %}

{% tab title="Svelte" %}

```svelte
<script>
  export let seasonId;
  export let apiToken;
  
  let bracketData = null;
  let loading = false;
  let error = null;
  
  async function fetchBracket() {
    loading = true;
    error = null;
    
    try {
      const response = await fetch(
        `https://api.sportmonks.com/v3/football/seasons/${seasonId}/brackets` +
        `?api_token=${apiToken}` +
        `&include=participants;state`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      bracketData = data.data;
    } catch (err) {
      error = err.message;
      console.error('Failed to fetch bracket:', err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="bracket">
  {#if !bracketData}
    <button on:click={fetchBracket}>Load Bracket</button>
  {/if}
  
  {#if loading}
    <div>Loading bracket...</div>
  {:else if error}
    <div>Error: {error}</div>
  {:else if bracketData}
    <h1>Knockout Bracket</h1>
    
    {#each bracketData.stages as stage}
      <div class="stage">
        <h2>{stage.stage_name}</h2>
        
        {#each stage.fixtures as fixture}
          <div class="fixture">
            <div class="match-details">
              <span class="match-number">{fixture.details}</span>
              <span class="match-name">{fixture.name}</span>
            </div>
            
            {#each fixture.participants || [] as participant}
              <div class="team">
                {participant.participant?.name || 'TBD'}
                {#if participant.meta?.winner}🏆{/if}
              </div>
            {/each}
            
            <div class="match-time">
              {new Date(fixture.starting_at).toLocaleString()}
            </div>
          </div>
        {/each}
      </div>
    {/each}
  {/if}
</div>
```

{% endtab %}

{% tab title="Angular" %}

```angular-ts
// tournament-bracket.component.ts
import { Component, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface BracketStage {
  stage_id: number;
  stage_name: string;
  fixtures: any[];
}

interface BracketData {
  stages: BracketStage[];
  edges: any[];
}

@Component({
  selector: 'app-tournament-bracket',
  templateUrl: './tournament-bracket.component.html',
  styleUrls: ['./tournament-bracket.component.css']
})
export class TournamentBracketComponent {
  @Input() seasonId!: number;
  @Input() apiToken!: string;
  
  bracketData: BracketData | null = null;
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  fetchBracket(): void {
    this.loading = true;
    this.error = null;
    
    const url = 
      `https://api.sportmonks.com/v3/football/seasons/${this.seasonId}/brackets` +
      `?api_token=${this.apiToken}` +
      `&include=participants;state`;
    
    this.http.get<{ data: BracketData }>(url).subscribe({
      next: (response) => {
        this.bracketData = response.data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.message;
        this.loading = false;
        console.error('Failed to fetch bracket:', err);
      }
    });
  }
}
```

{% endtab %}
{% endtabs %}

### Common use cases

#### 1. Display complete tournament bracket

Fetch all knockout matches organised by stage:

```javascript
const response = await fetch(
  `/v3/football/seasons/26618/brackets` +
  `?api_token=${token}` +
  `&include=participants;state`
);

const { data } = await response.json();

// Access stages
data.stages.forEach(stage => {
  console.log(`${stage.stage_name}: ${stage.fixtures.length} matches`);
});
```

#### 2. Find Where a Team Advances

Use edges to determine the next match for a winner:

```javascript
function findNextMatch(bracketData, currentFixtureId, outcome = 'winner') {
  const edge = bracketData.edges.find(e => 
    e.parent_fixture_id === currentFixtureId && 
    e.parent_outcome === outcome
  );
  
  if (!edge) return null;
  
  // Find the child fixture in stages
  for (const stage of bracketData.stages) {
    const nextFixture = stage.fixtures.find(f => f.id === edge.child_fixture_id);
    if (nextFixture) {
      return {
        fixture: nextFixture,
        slot: edge.child_slot,
        stage: stage.stage_name
      };
    }
  }
  
  return null;
}

// Example: Where does the winner of Semi-final 1 go?
const nextMatch = findNextMatch(bracketData, 19606974, 'winner');
console.log(`Winner advances to ${nextMatch.stage} as ${nextMatch.slot} team`);
// Output: "Winner advances to Final as home team"
```

#### 3. Build bracket tree structure

Organise matches into a hierarchical tree:

```javascript
function buildBracketTree(bracketData) {
  const fixtureMap = new Map();
  
  // Index all fixtures by ID
  bracketData.stages.forEach(stage => {
    stage.fixtures.forEach(fixture => {
      fixtureMap.set(fixture.id, {
        ...fixture,
        stage_name: stage.stage_name,
        parents: [],
        children: []
      });
    });
  });
  
  // Build relationships from edges
  bracketData.edges.forEach(edge => {
    const child = fixtureMap.get(edge.child_fixture_id);
    const parent = fixtureMap.get(edge.parent_fixture_id);
    
    if (child && parent) {
      child.parents.push({
        fixture: parent,
        outcome: edge.parent_outcome,
        slot: edge.child_slot
      });
      
      parent.children.push({
        fixture: child,
        outcome: edge.parent_outcome
      });
    }
  });
  
  return fixtureMap;
}
```

#### 4. Filter by stage

Display only specific knockout rounds:

```javascript
// Get only Final and 3rd Place matches
const finalStages = bracketData.stages.filter(stage => 
  ['Final', '3rd Place Final'].includes(stage.stage_name)
);

finalStages.forEach(stage => {
  console.log(`${stage.stage_name}:`);
  stage.fixtures.forEach(f => console.log(`  - ${f.name}`));
});
```

#### 5. Check Match Status

Identify which matches have been played:

```javascript
function getMatchStatus(bracketData) {
  const status = {
    notStarted: [],
    completed: [],
    live: []
  };
  
  bracketData.stages.forEach(stage => {
    stage.fixtures.forEach(fixture => {
      if (fixture.state_id === 1) {
        status.notStarted.push(fixture);
      } else if (fixture.state_id === 5) {
        status.completed.push(fixture);
      } else if (fixture.state_id === 2 || fixture.state_id === 3) {
        status.live.push(fixture);
      }
    });
  });
  
  return status;
}
```

### Best Practices

**Caching strategy**

* Cache bracket structure for 1 hour when no matches are live
* Reduce to 5 minutes during live knockout matches
* Cache permanently once tournament is complete {% endhint %}

**Check placeholder status**

Always verify `fixture.placeholder` before displaying team names. Placeholder fixtures indicate matches where participants aren't yet determined. {% endhint %}

**Optimise includes**

Only request includes you'll display. For a simple bracket view, `stages.fixtures.participants` and `stages.fixtures.state` are sufficient. Add `stages.fixtures.scores` for live updates. {% endhint %}

#### Recommended includes

**Minimal bracket view:**

```
&include=participants;state;venue
```

**Full match details:**

```
&include=participants;state;venus;lineups
```

**Live updates:**

```
&include=scores;state;lineups;statistics
```

### Error Handling

#### No knockout stages

If a season has no knockout stages, the response will have empty arrays:

```json
{
  "data": {
    "stages": [],
    "edges": []
  }
}
```

**Solution:** Verify the season has knockout stages before requesting brackets.

#### Missing edges

If edges data is incomplete, bracket progression cannot be determined:

```json
{
  "data": {
    "stages": [...],
    "edges": []
  }
}
```

**Solution:** Contact support if edges are missing for a tournament that has defined progression rules.

### Rate limits

The brackets endpoint counts against the **Fixture** entity rate limit:

* **Standard limit:** 3,000 requests per hour
* **Monitor:** Check `x-ratelimit-remaining` header
* **Best practice:** Cache bracket data to reduce API calls

```javascript
// Check rate limit in response
const remaining = response.headers.get('x-ratelimit-remaining');
console.log(`Rate limit remaining: ${remaining}`);
```

### Related endpoints

* [Fixtures](https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/fixtures) - Individual match data
* [Seasons](https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/seasons) - Tournament structure
* [Stages](https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/stages) - Stage information
* [Standings](https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/standings) - Group stage tables

***

{% hint style="info" %}
**New Feature**

The Tournament Brackets endpoint is a new addition to Sportmonks API v3. Feedback and suggestions are welcome at <support@sportmonks.com>.
{% endhint %}