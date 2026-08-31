---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.844Z
---
# What can you do with Sportmonks' data?

Sportmonks provides a rich and diverse array of sports data, offering you the ability to build, enhance, and optimise sports-related experiences. Whether you're creating live apps, analytics tools, or enriched websites, our data gives you the fuel to power those ideas.

Below are example use cases and guiding patterns, along with pointers to the relevant endpoints you can start with.

### **1. Create live football applications**

Use our real-time endpoints to keep your users in sync with live matches and changes.

**Possible applications**

* **Livescore apps**: Show ongoing match scores, minute-by-minute events, substitutions, cards, lineups.
* **Fantasy sports platforms**: Update player statistics in real time so fantasy leagues reflect current performance.
* **Betting / in-play portals**: Deliver live odds, in-match statistics, and instant match outcomes.

<figure><img src="/files/wu9okO7zqBkYh9zp8Pf2" alt="" width="563"><figcaption></figcaption></figure>

**Endpoint starting points**

* [`/livescores/inplay`](https://docs.sportmonks.com/football/tutorials-and-guides/tutorials/livescores-and-fixtures/livescores?u) – returns matches currently in play.
* [`/livescores/latest`](https://docs.sportmonks.com/football/tutorials-and-guides/tutorials/livescores-and-fixtures/livescores) – returns fixtures that had updates within the last 10 seconds (useful as your change trigger).
* Use includes (e.g. `include=events,lineups,statistics`) to enrich your live match data.
* Use [`standings/live/leagues/{league_id}`](mailto:undefined) for live standings within a league.

### **2. Enrich football websites with data**

Integrate our data into blogs, news portals, fan sites, or club pages to provide richer context and content.

**Use cases**

* **Pre-match & post-match articles**: Include past match stats, head-to-head history, recent form.
* **Team & player profiles**: Show full career stats, performance trends, transfers.
* **League pages**: List active & historical seasons, current standings, upcoming fixtures.
* **“On this day” features**: Historical matches on the same date.

<figure><img src="/files/ZahIiPEZ0zDOQrDftXII" alt="" width="563"><figcaption></figcaption></figure>

**Key endpoints to use**

* `GET /leagues` + includes for `currentSeason` and `seasons.`
* `GET /fixtures/date/{date}` for matches on a specific date.
* `GET /statistics/season/{season_id}` to fetch season-wide performance stats.
* `GET /stages` to retrieve structure (e.g. which stages a season contains).

**Examples**

```bash
GET /v3/football/leagues?api_token=…&include=currentSeason,seasons

GET /v3/football/fixtures/date/2025-10-01?api_token=…&include=participants,venue
```

Use caching, selective includes, and filtering to keep payloads efficient.

### **3. Power analytics & insights**

With deep statistics, you can build analytical tools, dashboards, or prediction engines.

**Possible products**

* **Predictive models**: estimate match outcomes, over/under probabilities, player performance.
* **Performance dashboards**: track team or player trends, strengths/weaknesses over time.
* **Trend discovery**: identify up-and-coming players, momentum shifts, league-wide shifts.

<figure><img src="/files/hxvlYy4aguy9xdamoe0C" alt="" width="563"><figcaption></figcaption></figure>

**Helpful endpoints**

* `/statistics/season/{season_id}` : Full-statistics for a season.
* `/statistics/fixture/{fixture_id}` : Detailed match-level statistics.
* Aggregation endpoints or filtered stats (e.g. per team or per player over time).

**Advice**

* Normalise data across seasons (in case rules or formats change).
* Use time-based windows (last 5 matches, rolling averages).
* Combine with external data (injuries, weather) for richer insights.

### **4. Enhancing betting platforms**

Data accuracy and speed are crucial in betting or odds-driven contexts.

**Use cases**

* **Odds display**: Show up-to-date betting odds (pre-match & in-play).
* **Prop bets & special markets**: Use player stats or match dynamics (cards, corners, goal timing).
* **Insight-driven recommendations**: Historical head-to-head data, form, and trends to guide users.

<figure><img src="https://www.sportmonks.com/wp-content/uploads/2024/08/Oddsmonks_odds_examples.png" alt=""><figcaption></figcaption></figure>

**Endpoints to leverage**

* Odds endpoints (`/odds`, `/inplayOdds`) to fetch bookmaker markets and live odds.
* Prediction / probability endpoints (if available).
* Combine with live match data (`livescores`) and stats to enrich betting features.

**Caveats**

* Respect rate limits and latency (speed matters).
* Be precise with includes and filters to minimise data overhead.

### 5. Real-time and event-driven apps

Build apps that respond instantly to events or changes in matches.

**Use cases**

* **Match alerts & notifications**: Notify users instantly when a goal is scored, a red card occurs, or a match starts/ends.
* **Live commentary widgets**: Provide minute-by-minute descriptions, event triggers (goals, substitutions, penalties).
* **Head-to-head live comparison**: As a match progresses, continuously compare team statistics (shots, possession, passes) side by side.

**Endpoint starting points**

* `/livescores/inplay` : Gets currently live matches.
* `/fixtures/{fixture_id}` + `include=events,statistics,participants` : Get detailed event and stat data for the match.
* `/livescores/latest` : Get matches updated in the last few seconds (good for polling).

### 6. Hybrid content + interactive experiences

Merge static content with interactive, data-powered features to delight users.

**Use cases**

* **“On this day in Football”**: Show historical matches on the same date, with links between past and present.
* **Interactive timeline of a match**: Display a scrollable timeline (first half / second half) with events (goals, substitutions, cards).
* **Fan polls & predictions**: Let users pick match outcomes or “Man of the Match” and later compare against model predictions.

**Endpoint starting points**

* `/fixtures/date/{date}` : Get matches on a particular date (useful for “On This Day”).
* `/fixtures` with filters / includes for events, statistics, participants.
* `/predictions` / `/probabilities` endpoints to fetch model or probabilistic insights (for poll comparison).

### 7. Scouting, club & transfer intelligence

Support professional workflows around recruitment, strategy, and transfer decisions.

**Use cases**

* **Transfer market tracker**: Monitor transfer rumors, completed deals, and assess performance post-transfer.
* **Player recruitment tools**: Rank potential signings by metrics, compare to existing squad members.
* **Tactical analytics platform**: Assess how players perform under different tactics (passing networks, heatmaps).

**Endpoint starting points**

* `/transfers` : List transfer events, filter by team / player / date.
* `/players` + includes (statistics, team, performance) for detailed profiles.
* `/fixtures` + includes and filters to analyze match specifics and map performance in context.

### Customer stories & inspiration

| Customer                     | What they built / benefit                                   | Link                                                                                           |
| ---------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| SoFIFA                       | Integrated real match data into a football game mode        | <https://www.sportmonks.com/blogs/casestudy/case-study-sofifa/>                                |
| Scoreplay                    | Automated media workflows, image → game matching, schedules | <https://www.sportmonks.com/blogs/casestudy/scoreplay-sports-media/>                           |
| ShiftOneZero / Dinamo Zagreb | Fan app with real-time stats, fixtures, fan features        | <https://www.sportmonks.com/blogs/casestudy/shiftonezero/>                                     |
| Botbrains.io / Liveticker.AI | AI-driven live match commentary across 12+ languages        | <https://www.sportmonks.com/blogs/casestudy/botbrains-football-api/>                           |
| Footi                        | Lightweight football news + live platform                   | <https://www.sportmonks.com/blogs/casestudy/case-study-footi-sustainable-football-platform-2/> |

> 📌 Tip: Use these stories to spark ideas as you’re not limited to one domain. Many customers combine multiple use cases (e.g. analytics + content + live).

### Still not sure?

The possibilities with sports data are vast and not limited to what’s listed here. With over 20,000 customers (each pursuing unique ideas), many use cases may already have been explored.

If your idea isn’t listed above, it doesn’t mean it’s not possible, reach out to us, check our [**case studies**](https://www.sportmonks.com/football-api/case-studies/), or explore other endpoints (e.g. transfers, news, predictions) and see how they might fit into your concept.

**Need more inspiration or guidance?** Browse through our documentation for more examples, or reach out to us directly. We’re here to help you explore the possibilities. Contact us through our [contact form](https://www.sportmonks.com/contact-support/) or send an email to <support@sportmonks.com>.