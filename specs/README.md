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
| `skillcorner/skillcorner_openapi.json` | https://www.skillcorner.com/apidocs.json | 2026-08-31 | 2026-08-31 |
| `fmdb-pro/openapi.json` | https://api.fmdb.pro/api/openapi | 2026-08-31 | 2026-08-31 |
| `sportradar/soccer-v4-openapi.yaml` | https://api.sportradar.com/soccer/trial/v4/openapi/openapi.yaml | 2026-08-31 | 2026-08-31 |

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
```

The Sportradar spec is the one the public Swagger UI at
`https://api.sportradar.com/soccer/trial/v4/openapi/swagger/index.html` loads; it is
served unauthenticated from the trial host and describes Soccer v4 only. Sportradar's
Soccer Extended, Probabilities and Push feeds are separate APIs with their own specs
and are not covered here.

Then regenerate the derived truth and re-run the tests:

```bash
pnpm openapi:truth
pnpm test
```

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

## Note on Impect

Impect is deliberately absent. Its documentation is built solely from the public
[ImpectAPI/open-data](https://github.com/ImpectAPI/open-data) repository, and no
Impect API specification is kept in this repository.
