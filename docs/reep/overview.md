---
source_url: https://reep.football/get-started
source_type: curated
upstream_version: null
crawled_at: 2026-11-16
---

# Reep register overview

Reep is an open football identity register. It gives each player, coach,
referee, team, competition, season, stage, venue and match one stable Reep ID
(and, since release `2026-10-19.1`, transfers and awards too), and maps
the IDs that data providers use (Opta, Transfermarkt, Wyscout, SkillCorner,
StatsBomb, FotMob, API-Football and more) onto it. Any provider ID therefore maps
to any other through the Reep ID. Written from reep.football on 2026-09-22, and
checked against release `2026-10-19.1`, the current download, on 2026-11-16.

## Two ways in: download or API

They do not update at the same rate. The API gets new matching daily. The
download is a stamped release, published weekly or less often. Pick by the job.

| Question | Download (DuckDB, Parquet or CSV) | API |
|---|---|---|
| Who can use it | Anyone | Named partners and evaluators with a key |
| Access | No key, no sign-up | Bearer key, issued by hand on request |
| Matching a whole dataset | Yes, SQL joins over every table | No, one lookup at a time, rate-limited |
| One live lookup from an app | Only if you host the file | Yes, nothing to host |
| Redirects after a merge | Join the redirects table yourself | Automatic: the survivor is returned |
| How current it is | The last download release, weekly or less often | Updated daily with new matching |
| What data it exposes | The whole release | The same kinds of record, nothing extra |

Rule of thumb: for more than a few hundred records, or any recurring pipeline,
download the file and join. Use the API for a single lookup from a running
application, or when an ID matched since the last download release matters.

**API keys are not self-service.** There is no sign-up form. Email
getintouch+nutmeg@withqwerty.com with your organisation, which group you are in
(data partner, organisation evaluating the register, or production access) and
what you are matching, and a key is issued by hand. A free evaluation key lasts
30 days and is extended on request. The download needs nothing from anyone.

Sources: [get-started guide](https://reep.football/get-started),
[API guide](https://reep.football/api).

## Using Reep through football-docs

The `resolve_entity` tool maps an entity to its IDs at every provider. It looks
up a provider ID with its namespace, a Reep ID, or a name, and uses the first
source that is set up in the MCP server's environment:

1. `REEP_DUCKDB_PATH`: the path to a downloaded copy of the register. No key is
   needed, and lookups run locally. Each answer ends with the file's release stamp
   checked against the latest release, and says how to download the new file
   when it is out of date. A file in the current layout (releases `2026-10-19.1`
   and `2026-10-31.1`) does not record its stamp, so the answer names the current
   release instead.
2. `REEP_API_KEY`: a Reep API key, issued by hand on request (email
   getintouch+nutmeg@withqwerty.com). There is no self-service sign-up.

With neither set, the tool explains both options and returns the DuckDB query
that answers the question from the download.

What the answers say:

- A merged Reep ID is followed to its survivor, and the answer names both IDs.
  This includes a provider ID whose bridge still names the merged ID. The
  survivor's provider IDs include any still attached to an ID merged into it,
  marked "(via merged <id>)".
- A withdrawn or withheld Reep ID (a tombstone in `redirects`, with an empty
  `to_id`) is reported as withdrawn or withheld, with the reason. It is not
  reported as unknown: it was published, and the ID is never reused.
- Provider IDs that the provider no longer uses (`upstream_status` retired or
  removed, in a local register file that has that column) are marked, and listed
  after the live ones. They still resolve, so an old stored ID keeps working, but
  map to the unmarked ones. Releases `2026-10-19.1` and `2026-10-31.1` have no
  `upstream_status` column, and the Reep API does not return this field.
- A provider ID looked up without a namespace gets a note: which namespace it
  matched in, or a warning when it matched in more than one. Pass the
  namespace (or the entity type) to be sure of the entity.

Example MCP configuration:

```json
{
  "mcpServers": {
    "football-docs": {
      "command": "npx",
      "args": ["-y", "football-docs"],
      "env": { "REEP_DUCKDB_PATH": "/path/to/reep-register.duckdb" }
    }
  }
}
```

## Licence and scope

The release, provider-ID bridges included, is dedicated to the public domain
under CC0 1.0. The downloads page says each release ships its own LICENSE.txt;
the file lists of releases `2026-10-19.1` and `2026-10-31.1` do not include one. It can be used for anything,
including commercially, with no attribution required. Citing "Reep, the football
identity register (reep.football)" with the release stamp is requested as a
courtesy, not a condition. CC0 covers only rights Reep holds; it grants no rights
in third-party source material.

The public release deliberately excludes dates of birth, known minors and raw
provider evidence. In release `2026-10-19.1`, `manifest.json` records
`private_dobs_stripped: true`, 9,116 under-18 persons withheld and
`internal_lineups_withheld: true`, and the date-of-birth columns of `entities` are
empty. Players, coaches and referees are identity records: they carry provider
bridges, names and aliases, but no career history, squad membership or
appearance data.

Release `2026-10-19.1` publishes no relationships. Its `edges` CSV and Parquet
files hold only a header row, and its DuckDB file has no `edges` table, although
its `manifest.json` gives an `edge_count` of 1,895. Its `matches` table has no
team, season or score columns either (see the download page). Release
`2026-10-31.1` had `edges` rows linking matches to their home and away teams,
season and venue, stages to seasons, and seasons to competitions.

The same release adds two entity types. It has 1,090 `transfer` entities, whose
`canonical_name` has the form `<player> -> <club> (<date>)` and which are bridged
in the `transfer` namespace of `opta`, `wyscout` and `transfermarkt`, and 2
`award` entities (for example "English Premier League Champion"), bridged in the
`award` namespace of 16 providers.

Sources: [downloads and licence](https://reep.football/data/),
[API reference](https://reep.football/docs).

## Releases and corrections

A new download release is cut weekly or less often. Each carries a stamp such as
`2026-10-19.1` (older releases used stamps such as `20260915T203651Z`), a
`release.json` file list with per-file SHA-256 checksums, and a `manifest.json` of counts. The pointer to the
current release is always at https://data.reep.football/releases/latest.json, and
every API response carries the stamp of the data it served in the
`X-Reep-Release-Stamp` header. The API updates daily, so that stamp can be newer
than the stamp of the current download.

The current download is not always the newest release. `latest.json` is a
selection: it names the release the downloads channel serves, which can be older
than one served before. On 2026-11-03 it named `2026-10-31.1`. On 2026-11-16 it
named `2026-10-19.1` (with `activation_requested_at` 2026-11-05), and the files of
`2026-10-31.1` answered HTTP 403. Compare stamps for equality, not order, and
re-check columns when the stamp changes in either direction.

A release can also be republished under the same stamp. The `manifest.json` of
`2026-10-19.1` records a republish on 2026-10-22 that removed the providers `fm`
and `fm26` (Football Manager game identifiers) from every table, with new counts
and checksums. Verify a file against the `sha256` in the current `release.json`,
not one saved earlier. Source: [Football Manager IDs withdrawn](https://reep.football/updates/2026-10-22-football-manager-ids-withdrawn/).

A wrong mapping found while joining is worth reporting: submit the two provider
IDs and what is believed to be right through
[reep.football/submit](https://reep.football/submit). An unbridged ID is a
coverage gap to report, not an error in the join; provider-to-provider coverage
is never 100%.
