#!/usr/bin/env bash
# Regenerate data/provider-truth/*.openapi.json from the specs in specs/.
# Provenance and refresh instructions for those specs: specs/README.md
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

# Wyscout docs span v2, v3 and v4, so all three merge into one truth file.
python3 scripts/gen_openapi_truth.py \
  specs/wyscout/v2-legacy.yml specs/wyscout/v3-current.yml specs/wyscout/v4-next.yml \
  --provider wyscout
python3 scripts/gen_openapi_truth.py specs/skillcorner/skillcorner_openapi.json --provider skillcorner
python3 scripts/gen_openapi_truth.py specs/fmdb-pro/openapi.json --provider fmdb-pro
python3 scripts/gen_openapi_truth.py specs/sportradar/soccer-v4-openapi.yaml --provider sportradar
