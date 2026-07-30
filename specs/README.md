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
| `wyscout/v3-current.yml` | https://apidocs.wyscout.com/assets/specs/prod/current.yml | 2026-06-03 | 2026-07-30 |
| `wyscout/v4-next.yml` | https://apidocs.wyscout.com/assets/specs/prod/next.yml | 2026-06-03 | 2026-07-30 |
| `wyscout/v2-legacy.yml` | https://apidocs.wyscout.com/assets/specs/prod/legacy.yml | 2026-06-03 | 2026-07-30 |
| `skillcorner/skillcorner_openapi.json` | https://skillcorner.com/api/docs/?format=openapi | 2026-06-03 | 2026-07-30 |
| `fmdb-pro/openapi.json` | https://api.fmdb.pro/api/openapi | 2026-07-09 | 2026-07-30 |

On 2026-07-30 each snapshot was re-fetched from the URL above and compared with
the copy in this directory. All were **structurally identical** — same paths,
same schemas — so the snapshots were left as they are rather than churned for a
changed timestamp alone.

## Refreshing

```bash
curl -sL -o specs/wyscout/v3-current.yml https://apidocs.wyscout.com/assets/specs/prod/current.yml
curl -sL -o specs/wyscout/v4-next.yml    https://apidocs.wyscout.com/assets/specs/prod/next.yml
curl -sL -o specs/wyscout/v2-legacy.yml  https://apidocs.wyscout.com/assets/specs/prod/legacy.yml
curl -sL -o specs/skillcorner/skillcorner_openapi.json "https://skillcorner.com/api/docs/?format=openapi"
curl -sL -o specs/fmdb-pro/openapi.json  https://api.fmdb.pro/api/openapi
```

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

## Note on Impect

Impect is deliberately absent. Its documentation is built solely from the public
[ImpectAPI/open-data](https://github.com/ImpectAPI/open-data) repository, and no
Impect API specification is kept in this repository.
