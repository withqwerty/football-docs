# Vendor API specifications

Snapshots of **publicly published** OpenAPI specifications, kept so the docs in
`docs/<provider>/` can be validated against the vendor's own definitions rather
than against prose someone wrote from memory. See
[Documentation validation](../README.md#documentation-validation).

Every file here was fetched from a public, unauthenticated URL — no credentials,
no customer portal, no gated download. The source URL for each is below, so
anyone can re-fetch and diff.

| File | Public source | Fetched | Last verified against live |
|---|---|---|---|
| `wyscout/v3-current.yml` | https://apidocs.wyscout.com/assets/specs/prod/current.yml | 2026-08-31 | 2026-08-31 |
| `wyscout/v4-next.yml` | https://apidocs.wyscout.com/assets/specs/prod/next.yml | 2026-08-31 | 2026-08-31 |
| `skillcorner/skillcorner_openapi.json` | https://www.skillcorner.com/apidocs.json | 2026-09-29 | 2026-09-29 |
| `fmdb-pro/openapi.json` | https://api.fmdb.pro/api/openapi | 2026-09-24 | 2026-09-24 |
| `sportradar/soccer-v4-openapi.yaml` | https://api.sportradar.com/soccer/trial/v4/openapi/openapi.yaml | 2026-09-29 | 2026-09-29 |
| `sportradar/soccer-extended-v4-openapi.yaml` | https://api.sportradar.com/soccer-extended/trial/v4/openapi/openapi.yaml | 2026-09-29 | 2026-09-29 |
| `reep/openapi.yaml` | https://reep.football/openapi.yaml | 2026-09-29 | 2026-09-29 |
| `reep/release.json` | https://data.reep.football/releases/20260926T145536Z/release.json (via `latest.json`) | 2026-09-29 | 2026-09-29 |
| `reep/schema.json` | https://data.reep.football/releases/20260926T145536Z/schema.json | 2026-09-29 | 2026-09-29 |
| `statsports/thirdpartyapi-v5.json` | https://statsportsproseries.com/thirdpartyapi/swagger/v5/swagger.json | 2026-09-30 | 2026-09-30 |
| `statsports/thirdpartyapi-v6.json` | https://statsportsproseries.com/thirdpartyapi/swagger/v6/swagger.json | 2026-09-30 | 2026-09-30 |
| `statsports/thirdpartyapi-v7.json` | https://statsportsproseries.com/thirdpartyapi/swagger/v7/swagger.json | 2026-09-30 | 2026-09-30 |
| `firstbeat/openapi.json` | https://apidocs.firstbeat.com/assets/api-specification/openapi.json | 2026-09-30 | 2026-09-30 |
| `football-data/notes.txt` | https://www.football-data.co.uk/notes.txt | 2026-10-04 | 2026-10-04 |
| `hawkin-dynamics/openapi.json` | https://connect.hawkindynamics.com/api (extracted from the page, see below) | 2026-10-01 | 2026-10-01 |
| `hawkin-dynamics/metrics.json` | https://connect.hawkindynamics.com/assets/metrics.json | 2026-09-30 | 2026-09-30 |
| `vald/externaltenants.json` | https://prd-euw-api-externaltenants.valdperformance.com/swagger/v1/swagger.json | 2026-09-30 | 2026-09-30 |
| `vald/externalprofile.json` | https://prd-euw-api-externalprofile.valdperformance.com/swagger/v1/swagger.json | 2026-09-30 | 2026-09-30 |
| `vald/extforcedecks.json` | https://prd-euw-api-extforcedecks.valdperformance.com/swagger/v2019q3/swagger.json | 2026-09-30 | 2026-09-30 |
| `vald/externalnordbord.json` | https://prd-euw-api-externalnordbord.valdperformance.com/swagger/v1/swagger.json | 2026-09-30 | 2026-09-30 |
| `vald/externalforceframe.json` | https://prd-euw-api-externalforceframe.valdperformance.com/swagger/v1/swagger.json | 2026-09-30 | 2026-09-30 |
| `vald/extsmartspeed.json` | https://prd-euw-api-extsmartspeed.valdperformance.com/swagger/v1/swagger.json | 2026-09-30 | 2026-09-30 |
| `vald/extdynamo.json` | https://prd-euw-api-extdynamo.valdperformance.com/swagger/v1/swagger.json | 2026-09-30 | 2026-09-30 |
| `vald/externalhumantrakv2.json` | https://prd-euw-api-externalhumantrakv2.valdperformance.com/swagger/v2/swagger.json | 2026-09-30 | 2026-09-30 |

`football-data/notes.txt` is not an API spec: it is football-data.co.uk's key
to its CSV columns, served as plain text. It is stored with LF line ends (the
site serves CRLF; `check_upstream.py` ignores the difference), and
`scripts/gen_football_data_columns.py` builds the tables in
`docs/free-sources/football-data-columns.md` from it.

On 2026-08-31 each snapshot was re-fetched and compared with the copy in this
directory. Wyscout, FMDB Pro, Sportradar and SkillCorner had all changed, so every
snapshot was replaced and the derived truth regenerated.

Wyscout's legacy v2 specification was previously mirrored here as
`wyscout/v2-legacy.yml`. It has been dropped: the docs describe v3 and v4, and no
documented fact is derived from the legacy surface.

## Refreshing

```bash
curl -sL -o specs/wyscout/v3-current.yml https://apidocs.wyscout.com/assets/specs/prod/current.yml
curl -sL -o specs/wyscout/v4-next.yml    https://apidocs.wyscout.com/assets/specs/prod/next.yml
curl -sL -o specs/skillcorner/skillcorner_openapi.json https://www.skillcorner.com/apidocs.json
curl -sL -o specs/fmdb-pro/openapi.json  https://api.fmdb.pro/api/openapi
curl -sL -o specs/sportradar/soccer-v4-openapi.yaml https://api.sportradar.com/soccer/trial/v4/openapi/openapi.yaml
curl -sL -o specs/sportradar/soccer-extended-v4-openapi.yaml https://api.sportradar.com/soccer-extended/trial/v4/openapi/openapi.yaml
curl -sL -o specs/reep/openapi.yaml https://reep.football/openapi.yaml
for v in 5 6 7; do
  curl -sL -o specs/statsports/thirdpartyapi-v$v.json \
    https://statsportsproseries.com/thirdpartyapi/swagger/v$v/swagger.json
done
curl -sL -o specs/firstbeat/openapi.json https://apidocs.firstbeat.com/assets/api-specification/openapi.json
node scripts/extract_hawkin_openapi.mjs --out specs/hawkin-dynamics/openapi.json
curl -sL -o specs/hawkin-dynamics/metrics.json https://connect.hawkindynamics.com/assets/metrics.json
for s in externaltenants:v1 externalprofile:v1 extforcedecks:v2019q3 externalnordbord:v1 \
         externalforceframe:v1 extsmartspeed:v1 extdynamo:v1 externalhumantrakv2:v2; do
  curl -sL -o specs/vald/${s%%:*}.json \
    https://prd-euw-api-${s%%:*}.valdperformance.com/swagger/${s##*:}/swagger.json
done
```

Check the STATSports files after a refresh: every path should start `/api/thirdPartyData/`
(see [STATSports](#statsports) below).

The Sportradar specs are the ones the public Swagger UIs at
`https://api.sportradar.com/soccer/trial/v4/openapi/swagger/index.html` and
`https://api.sportradar.com/soccer-extended/trial/v4/openapi/swagger/index.html` load;
both are served unauthenticated from the trial host, and they merge into one truth
file. The Probabilities spec
(`https://api.sportradar.com/soccer-probabilities/trial/v4/openapi/openapi.yaml`) is
left out on purpose: INCLUSION.md keeps betting content out of the index.

Then regenerate the derived truth and re-run the tests:

```bash
pnpm openapi:truth
pnpm test
```

## Wearable and sports-science vendors

STATSports, Firstbeat, Hawkin Dynamics and VALD sell measuring devices. Their APIs
return a customer's own athlete data. The specifications describe that data: field
names, types, units where stated, and endpoint paths. None of the files holds
athlete data. Several fields they describe are personal or health data (dates of
birth, sex, body weight, heart rate); the docs list those as fields only.

### STATSports

The Swagger UI at https://statsportsproseries.com/thirdpartyapi/index.html lists
three versions, v5, v6 and v7. All three are mirrored, because the docs cover each
one. The spec declares no `servers`; the callable base is
`https://statsportsproseries.com/thirdpartyapi`. Its `test` endpoint answered HTTP
200 at `https://statsportsproseries.com/thirdpartyapi/api/thirdPartyData/test` on
2026-09-30.

The server is not stable in one respect. Repeated fetches of the same file return
path keys with a varying number of leading `/thirdpartyapi` segments
(`/api/thirdPartyData/test`, `/thirdpartyapi/api/thirdPartyData/test`,
`/thirdpartyapi/thirdpartyapi/api/thirdPartyData/test`, and so on); the rest of the
document does not change. The snapshots here keep the form with no prefix, and
`scripts/check_upstream.py` removes the prefix from both sides before it compares.
If a refresh brings back a prefixed copy, fetch again.

The spec's `info.license` is named "Privacy Policy" and links to
`https://statsports.com/apex-pro-series-privacy-policy/`, which returned 404 on
2026-09-30. No other terms for the specification were found.

### Firstbeat

The page https://apidocs.firstbeat.com/api-specification/ embeds a static Redoc
page, `/assets/api-specification/api-spec-static.html`. The OpenAPI file mirrored
here is published beside it, at `/assets/api-specification/openapi.json`. The
variable list the docs use (names, units, descriptions) is on
https://apidocs.firstbeat.com/variables/ and is not part of the specification.

### Hawkin Dynamics

Hawkin publishes no specification file. The reference page
https://connect.hawkindynamics.com/api carries the OpenAPI document inline, as a
`const spec = {...};` literal, and its "Download JSON" button saves
`JSON.stringify(spec, null, 2)`. `scripts/extract_hawkin_openapi.mjs` produces the
same document without a browser: it evaluates only that literal, in an empty `vm`
context. `/openapi.json` on the same host returned 404 on 2026-09-30.

`metrics.json` is the file the page's Metrics tab loads. It lists 18 test types.
The page leaves five of them out: two have no `testTypeName` ("intentionally
excluded from the docs until the data is corrected", per the page script), and
Clean, Snatch and Overhead Lift are "excluded by product decision". The docs follow
the page and do not tabulate those five.

### VALD

VALD publishes one specification per product API, on hosts of the form
`https://prd-<region>-api-<service>.valdperformance.com`. The `euw` copies are
mirrored. On 2026-09-30 all eight were also fetched from the `use` and `aue` hosts
and compared: they differ only in `operationId` values. VALD's server generates
each `operationId` as a new random GUID on every request, so
`scripts/check_upstream.py` ignores `operationId` when it compares.

The VALD help centre (`support.vald.com`) returns a bot challenge to
non-browser clients. Nothing from it is mirrored or quoted, and it is not crawled.

### Generated tables

The large tables in `docs/statsports/`, `docs/firstbeat/`, `docs/hawkin-dynamics/`
and `docs/vald/` are built from the files above by `scripts/gen_vendor_tables.py`:
schema field tables, the STATSports drill KPI tables, Hawkin's per-test-type metric
tables, VALD's schema and enum tables, and the endpoint tables. Each one sits
between two marker comments:

```markdown
<!-- generated:statsports-drillkpi-v7-accelerations start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
...
<!-- generated:statsports-drillkpi-v7-accelerations end -->
```

A field whose object is defined inline, with no schema name of its own, gets a
second table of its own fields under the first. Constraints the spec sets on a
field (`minLength`, `maximum`, `default`, `readOnly` and others) go in the
Description column.

The script rewrites only the text between markers. Headings, notes and counts
outside them are hand-written. `pnpm ingest` drops the marker lines, so they never
reach the index. `src/__tests__/vendor-tables.test.ts` runs the script with
`--check`, so `pnpm test` fails when a doc and its spec disagree.

The script has two editorial inputs, because no spec gives them: which fields are
marked **Personal data** (`PERSONAL_FIELDS`), and how the 319 `DrillKpiV7` fields
are grouped under headings (`DRILLKPI_GROUPS`). A new drill KPI field that no
group's pattern matches goes under "load, work and other"; one that matches two
patterns stops the script. Firstbeat's variables page is not in any spec, so
`docs/firstbeat/variables.md` stays hand-written.

To refresh a vendor:

1. Fetch the new spec with the commands in [Refreshing](#refreshing).
2. Run `python3 scripts/gen_vendor_tables.py`. It prints each doc it changed.
3. Read the diff. Update the hand-written text the change affects: field counts,
   the version-difference notes, and the notes after each table. Mark any new
   personal-data field in `PERSONAL_FIELDS` and run the script again.
4. Run `pnpm ingest`, then `pnpm test`.

`python3 scripts/gen_vendor_tables.py --check` writes nothing; it prints the diff
and exits 1 if any generated section is out of date.

## What these are and are not

- They describe each vendor's **API surface** — paths, parameters, schema field
  names, enumerated values. They contain no match data, no customer payloads and
  no credentials.
- They are the vendors' intellectual property. They are reproduced here as
  published, for documentation validation. Each vendor retains all rights in its
  specification, and access to the APIs they describe remains subject to that
  vendor's own commercial terms.
- If a vendor would prefer their specification not be mirrored here, we will
  remove it: `scripts/gen_openapi_truth.py` derives the facts the tests need
  (`data/provider-truth/<provider>.openapi.json`), so validation survives without
  keeping the file itself.

## SkillCorner specification URL

SkillCorner moved its specification. `https://skillcorner.com/api/docs/?format=openapi`
returned it unauthenticated until at least 2026-07-30 and now 404s, and the
documentation UI at `https://skillcorner.com/api/docs/` sits behind a customer
login. The specification itself is still published openly, at
`https://www.skillcorner.com/apidocs.json`, and that is the URL mirrored here.

The format changed with the move: the old snapshot was Swagger 2.0 and the new
one is OpenAPI 3.1, which carries component schemas and enumerated values the old
document did not. The endpoint set is unchanged at 52 paths.

Nothing from behind the login is mirrored here. Every file in this directory is a
public, unauthenticated fetch, and that is the rule that makes mirroring
defensible.

## Note on BeSoccer

BeSoccer is documented from a public Postman collection, which is deliberately
**not** kept here. 86% of that 9.7MB collection is saved response bodies full of
real competition and match data — BeSoccer's data, not their API documentation.
`scripts/gen_postman_truth.py` derives the request surface (base URL, the 57 `req`
values, per-request parameters, access levels) into
`data/provider-truth/besoccer.postman.json` at 12KB, and the tests assert no
response bodies survive into it.

Refresh with:

```bash
curl -sL -o /tmp/besoccer.json \
  https://documenter.gw.postman.com/api/collections/6414020/2s93JwM1t4
pnpm postman:truth /tmp/besoccer.json --provider besoccer --dispatch-param req --group-prefix EN
```

## Note on Driblab

Driblab publishes its API contract as a public Notion page rather than as a
specification, and that page is **not** mirrored here either. Its response samples
are real players, teams and seasons, and its download examples are presigned S3
URLs carrying an AWS access key id — none of which is API documentation.
`scripts/gen_notion_truth.py` reads the page through Notion's own public
`loadPageChunk` endpoint and derives the request surface (59 operations across 58
paths, parameter names, response field and metric names) into
`data/provider-truth/driblab.notion.json`. It keeps key names and never a value,
and the tests assert no sample data survives into it.

Refresh with:

```bash
pnpm notion:truth \
  "https://driblab.notion.site/Driblab-API-1-0-Guide-EN-65ce257f83b5451fb79896b01d41aede" \
  --provider driblab
```

## Note on Impect

Impect is deliberately absent. Its documentation is built solely from the public
[ImpectAPI/open-data](https://github.com/ImpectAPI/open-data) repository, and no
Impect API specification is kept in this repository.

## Reep

Reep is checked against three snapshots: the API spec (`reep/openapi.yaml`, used by
the provider-truth tests) and one release's manifest and column schema
(`reep/release.json`, `reep/schema.json`, used by `src/__tests__/reep.test.ts`). A new
release is cut weekly, so the manifest snapshot is expected to age; what matters is
whether anything the docs state has changed.

To refresh:

1. Run `python3 scripts/check_reep_live.py`. It checks every stable download link
   and every reep.football link in `docs/reep/`, and lists what differs from the
   snapshots. Exit 1 means a broken link, 2 means drift, 0 means current.
2. For each drift line, reread the doc section it names and update `docs/reep/`.
3. Run `python3 scripts/check_reep_live.py --update` to replace the snapshots.
4. If the spec changed, run `bash scripts/gen_all_openapi_truth.sh`.
5. Update the dates in the table above and `crawled_at` in the changed docs, run
   `pnpm test`, then rebuild the index.

Two things no script checks: the key policy and limits on https://reep.football/api,
and the namespace table in `docs/reep/identity-and-ids.md`. Reread the API page, and
compare the namespace table with `SELECT DISTINCT provider, namespace FROM bridges`
on the current DuckDB file.

