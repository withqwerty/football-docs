---
source_url: https://reep.football/get-started
source_type: curated
upstream_version: null
crawled_at: 2026-09-22
---

# Reep register overview

Reep is an open football identity register. It gives each player, coach,
referee, team, competition, season, stage and match one stable Reep ID, and maps
the IDs that data providers use (Opta, Transfermarkt, Wyscout, SkillCorner,
StatsBomb, FotMob, API-Football and more) onto it. Any provider ID therefore maps
to any other through the Reep ID. Written from reep.football on 2026-09-22.

## Two ways in: download or API

Both serve the same weekly, stamped release. Pick by the job.

| Question | Download (DuckDB or CSV) | API |
|---|---|---|
| Who can use it | Anyone | Named partners and evaluators with a key |
| Access | No key, no sign-up | Bearer key, issued by hand on request |
| Matching a whole dataset | Yes, SQL joins over every table | No, one lookup at a time, rate-limited |
| One live lookup from an app | Only if you host the file | Yes, nothing to host |
| Redirects after a merge | Join the redirects table yourself | Automatic: the survivor is returned |
| What data it exposes | The whole release | The same release, nothing extra |

Rule of thumb: for more than a few hundred records, or any recurring pipeline,
download the file and join. Use the API for a single lookup from a running
application.

**API keys are not self-service.** There is no sign-up form. Email
getintouch+nutmeg@withqwerty.com with your organisation, what you are matching and
roughly how many lookups you expect, and a key is issued by hand. The download
needs nothing from anyone.

Sources: [get-started guide](https://reep.football/get-started),
[API guide](https://reep.football/api).

## Using Reep through football-docs

The `resolve_entity` tool maps an entity to its IDs at every provider. It looks
up a provider ID with its namespace, a Reep ID, or a name, and uses the first
source that is set up in the MCP server's environment:

1. `REEP_DUCKDB_PATH`: the path to a downloaded copy of the register. No key is
   needed, and lookups run locally. Each answer ends with the file's release stamp
   checked against the latest release, and says how to download the new file
   when it is out of date.
2. `REEP_API_KEY`: a Reep API key, issued by hand on request (email
   getintouch+nutmeg@withqwerty.com). There is no self-service sign-up.

With neither set, the tool explains both options and returns the DuckDB query
that answers the question from the download. Example MCP configuration:

```json
{
  "mcpServers": {
    "football-docs": {
      "command": "npx",
      "args": ["-y", "football-docs"],
      "env": { "REEP_DUCKDB_PATH": "/path/to/reep-register-v1.duckdb" }
    }
  }
}
```

## Licence and scope

The release, provider-ID bridges included, is dedicated to the public domain
under CC0 1.0 and ships its own LICENSE.txt. It can be used for anything,
including commercially, with no attribution required. Citing "Reep, the football
identity register (reep.football)" with the release stamp is requested as a
courtesy, not a condition. CC0 covers only rights Reep holds; it grants no rights
in third-party source material.

The public release deliberately excludes dates of birth, known minors and raw
provider evidence. Players, coaches and referees are identity records: they carry
provider bridges, names and aliases, but no career history, squad membership or
appearance data. Published relationships are structural only: competition,
season, stage and match, and which teams take part in which competition-seasons.

Sources: [downloads and licence](https://reep.football/downloads),
[API reference](https://reep.football/docs).

## Releases and corrections

A new release is cut weekly. Each carries a stamp such as `20260915T203651Z`, a
manifest, per-file checksums and a machine-readable schema. The current
manifest is always at https://data.reep.football/releases/latest.json, and
every API response carries the stamp in the `X-Reep-Release-Stamp` header.

A wrong mapping found while joining is worth reporting: submit the two provider
IDs and what is believed to be right through
[reep.football/submit](https://reep.football/submit). An unbridged ID is a
coverage gap to report, not an error in the join; provider-to-provider coverage
is never 100%.
