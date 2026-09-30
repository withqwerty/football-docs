#!/usr/bin/env bash
# Regenerate data/provider-truth/*.openapi.json from the specs in specs/.
# Provenance and refresh instructions for those specs: specs/README.md
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

# Wyscout docs span v3 and v4, so both merge into one truth file.
python3 scripts/gen_openapi_truth.py \
  specs/wyscout/v3-current.yml specs/wyscout/v4-next.yml \
  --provider wyscout
python3 scripts/gen_openapi_truth.py specs/skillcorner/skillcorner_openapi.json --provider skillcorner
python3 scripts/gen_openapi_truth.py specs/fmdb-pro/openapi.json --provider fmdb-pro
python3 scripts/gen_openapi_truth.py \
  specs/sportradar/soccer-v4-openapi.yaml specs/sportradar/soccer-extended-v4-openapi.yaml \
  --provider sportradar
python3 scripts/gen_openapi_truth.py specs/reep/openapi.yaml --provider reep
# STATSports publishes v5, v6 and v7 of its third-party API; clients still call all three.
python3 scripts/gen_openapi_truth.py \
  specs/statsports/thirdpartyapi-v5.json specs/statsports/thirdpartyapi-v6.json \
  specs/statsports/thirdpartyapi-v7.json \
  --provider statsports
python3 scripts/gen_openapi_truth.py specs/firstbeat/openapi.json --provider firstbeat
python3 scripts/gen_openapi_truth.py specs/hawkin-dynamics/openapi.json --provider hawkin-dynamics
# VALD publishes one specification per product API, each on its own host.
python3 scripts/gen_openapi_truth.py \
  specs/vald/externaltenants.json specs/vald/externalprofile.json \
  specs/vald/extforcedecks.json specs/vald/externalnordbord.json \
  specs/vald/externalforceframe.json specs/vald/extsmartspeed.json \
  specs/vald/extdynamo.json specs/vald/externalhumantrakv2.json \
  --provider vald
