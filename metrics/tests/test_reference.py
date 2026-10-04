"""Every variant with reference code gives its card's test values."""

import importlib
import json
from pathlib import Path

import pytest

CARDS = json.loads((Path(__file__).resolve().parent.parent / "cards.json").read_text(encoding="utf-8"))["cards"]

CASES = [
    pytest.param(variant, fixture, id=f"{variant['id']}[{fixture['team']}@{fixture['match_id']}]")
    for card in CARDS
    for variant in card["variants"]
    if variant.get("reference")
    for fixture in variant.get("fixtures", [])
]


def resolve(path):
    module, name = path.split(":")
    return getattr(importlib.import_module(module), name)


@pytest.mark.parametrize(("variant", "fixture"), CASES)
def test_reference_value(variant, fixture, load_events):
    function = resolve(variant["reference"]["function"])
    events = load_events(variant["reference"]["dataset"], fixture["match_id"])
    value = function(events, fixture["team"])
    tolerance = fixture.get("tolerance", 1e-4)
    assert value is not None and abs(value - fixture["expected"]) <= tolerance, (
        f"{variant['id']} gives {value} for {fixture['team']} in match {fixture['match_id']}, "
        f"card says {fixture['expected']}"
    )
