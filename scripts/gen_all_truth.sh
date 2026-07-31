#!/usr/bin/env bash
# Regenerate data/provider-truth/*.json for every pip-installable provider.
#
# Each package gets its own venv: co-installing them makes pip resolve conflicting
# constraints and silently downgrade (socceraction drops to 1.1.1 alongside
# soccerdata), which would produce truth files that disagree with the docs.
#
# Versions are pinned so a regeneration is reproducible and reviewable. Bump a pin
# here and in providers.json together, then re-run and fix whatever the tests flag.
#
# Usage: scripts/gen_all_truth.sh [venv-root]

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV_ROOT="${1:-${TMPDIR:-/tmp}/football-docs-truth-venvs}"

# Needs an interpreter these packages still support; several cap below 3.13.
PY="${PYTHON:-python3.11}"
command -v "$PY" >/dev/null || { echo "need $PY on PATH (set PYTHON=...)"; exit 1; }

PINS=(
  "kloppy==3.19.0"
  "socceraction==1.5.3"
  "soccerdata==1.9.1"
  "mplsoccer==1.7.1"
  "floodlight==1.2.0"
  "databallpy==0.7.3"
  "skillcorner==3.2.0"
  "unravelsports==1.2.1"
  "fast-forward-football==0.2.0"
)

# socceraction 1.5.3 imports `overload` from multimethod, removed in multimethod 2.
extras_for() { case "$1" in socceraction) echo "multimethod<2" ;; *) echo "" ;; esac; }

# Most packages are installed, imported and indexed under one name. These are not:
# fast-forward-football imports as `fastforward` and is indexed as `fast-forward`
# (matching its repo and docs site), and unravelsports imports as `unravel`.
module_for() { case "$1" in fast-forward-football) echo fastforward ;; unravelsports) echo unravel ;; *) echo "$1" ;; esac; }
provider_for() { case "$1" in fast-forward-football) echo fast-forward ;; *) echo "$1" ;; esac; }

mkdir -p "$VENV_ROOT"

for spec in "${PINS[@]}"; do
  pkg="${spec%%==*}"
  venv="$VENV_ROOT/$pkg"

  [ -d "$venv" ] || "$PY" -m venv "$venv"
  "$venv/bin/pip" install -q "$spec"

  extras="$(extras_for "$pkg")"
  if [ -n "$extras" ]; then
    "$venv/bin/pip" install -q "$extras"
  fi

  "$venv/bin/python" "$REPO/scripts/gen_python_truth.py" \
    "$(module_for "$pkg")" --provider "$(provider_for "$pkg")"
done

echo
echo "Truth files written to data/provider-truth/. Run 'pnpm test' to validate the docs."
