"""Fixtures for the metric card reference tests.

Match files come from StatsBomb open data at the commit pinned in
metrics/fixtures.json, are checked against their SHA-256 and cached in
METRICS_FIXTURE_CACHE (default ~/.cache/football-docs-metrics), so the
repository holds no StatsBomb data.
"""

import hashlib
import json
import os
import sys
import urllib.request
from pathlib import Path

import pytest

METRICS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(METRICS / "reference"))

FIXTURES = json.loads((METRICS / "fixtures.json").read_text(encoding="utf-8"))
CACHE = Path(os.environ.get("METRICS_FIXTURE_CACHE", Path.home() / ".cache" / "football-docs-metrics"))


def statsbomb_events(match_id):
    source = FIXTURES["statsbomb-open-data"]
    expected = source["events_sha256"].get(str(match_id))
    if not expected:
        raise KeyError(f"match {match_id} has no pinned SHA-256 in metrics/fixtures.json")
    path = CACHE / "statsbomb-open-data" / source["commit"] / f"{match_id}.json"
    if not path.exists():
        url = f"https://raw.githubusercontent.com/statsbomb/open-data/{source['commit']}/data/events/{match_id}.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        request = urllib.request.Request(url, headers={"User-Agent": "football-docs metric tests"})
        with urllib.request.urlopen(request, timeout=60) as response:
            data = response.read()
        path.write_bytes(data)
    data = path.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    if digest != expected:
        path.unlink(missing_ok=True)
        raise ValueError(f"match {match_id}: SHA-256 {digest} does not match the pinned {expected}")
    return json.loads(data)


@pytest.fixture(scope="session")
def load_events():
    loaded = {}

    def load(dataset, match_id):
        key = (dataset, match_id)
        if key not in loaded:
            if dataset != "statsbomb-open-data":
                raise ValueError(f"no loader for dataset {dataset}")
            loaded[key] = statsbomb_events(match_id)
        return loaded[key]

    return load
