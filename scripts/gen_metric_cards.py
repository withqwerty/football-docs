"""Build metric cards from metrics/cards/*.toml.

Writes:
- metrics/cards.json: every card, for ingest (stored in the index's meta table
  as metric_cards, read by get_metric and list_metrics) and for the Python
  reference tests.
- docs/metric-cards/<id>.md: one page per card, for search_docs.

    python3 scripts/gen_metric_cards.py          # write both
    python3 scripts/gen_metric_cards.py --check  # fail if either is out of date

Needs Python 3.11 or newer (tomllib).
"""

import json
import re
import sys
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CARDS = ROOT / "metrics" / "cards"
CARDS_JSON = ROOT / "metrics" / "cards.json"
DOCS = ROOT / "docs" / "metric-cards"

CHECKS = {"exact", "normalised", "browser"}
CHECK_LABEL = {
    "exact": "matches the source word for word",
    "normalised": "matches the source apart from case, spacing, quote marks or hyphens",
    "browser": "checked word for word in a browser",
}
MAX_QUOTE = 400
ID = re.compile(r"^[a-z][a-z0-9_]*$")
VARIANT_ID = re.compile(r"^[a-z][a-z0-9_]*\.[a-z0-9][a-z0-9.-]*$")
FUNCTION = re.compile(r"^[a-z_][a-z0-9_.]*:[a-z_][a-z0-9_]*$")
DATASETS = {"statsbomb-open-data"}


def fail(card, message):
    raise SystemExit(f"metrics/cards/{card}.toml: {message}")


def validate(card, path):
    name = path.stem
    for key in ("id", "name", "data", "unit", "measures", "direction", "version", "updated", "summary", "origin", "variants", "caveats"):
        if key not in card:
            fail(name, f"missing {key}")
    if card["id"] != name or not ID.match(name):
        fail(name, "id must match the file name (lowercase letters, digits and underscores)")
    if card["data"] not in ("event", "tracking"):
        fail(name, "data must be event or tracking")
    seen = set()
    for variant in card["variants"]:
        vid = variant.get("id", "")
        if not VARIANT_ID.match(vid) or not vid.startswith(f"{name}."):
            fail(name, f"variant id {vid!r} must look like {name}.<name>")
        if vid in seen:
            fail(name, f"variant id {vid} is used twice")
        seen.add(vid)
        for key in ("name", "definition", "formula", "zone", "source"):
            if key not in variant:
                fail(name, f"{vid}: missing {key}")
        source = variant["source"]
        for key in ("kind", "id", "title", "author", "quote", "check", "checked"):
            if key not in source:
                fail(name, f"{vid}: source is missing {key}")
        if source["check"] not in CHECKS:
            fail(name, f"{vid}: source.check must be one of {sorted(CHECKS)}")
        if len(source["quote"]) > MAX_QUOTE:
            fail(name, f"{vid}: the quote is over {MAX_QUOTE} characters; a card quotes a sentence or two")
        reference = variant.get("reference")
        if reference:
            if not FUNCTION.match(reference.get("function", "")):
                fail(name, f"{vid}: reference.function must look like package.module:function")
            if reference.get("dataset") not in DATASETS:
                fail(name, f"{vid}: reference.dataset must be one of {sorted(DATASETS)}")
            pinned = json.loads((ROOT / "metrics" / "fixtures.json").read_text(encoding="utf-8")).get("resources", {})
            for extra in reference.get("requires", []):
                if extra not in pinned:
                    fail(name, f"{vid}: reference.requires names {extra}, which metrics/fixtures.json does not pin")
            if not variant.get("fixtures"):
                fail(name, f"{vid}: a variant with reference code needs at least one fixture")
        for fixture in variant.get("fixtures", []):
            for key in ("match_id", "label", "team", "expected"):
                if key not in fixture:
                    fail(name, f"{vid}: a fixture is missing {key}")
    return card


def clean(text):
    return " ".join(str(text).split())


def render(card, known=frozenset()):
    lines = [
        "---",
        "source_type: curated",
        f"source_url: {card['origin']['source']}",
        f"upstream_version: metric card v{card['version']}",
        f"crawled_at: {card['updated']}",
        "---",
        "",
        f"# {card['name']}",
        "",
        f"Metric card `{card['id']}`, version {card['version']}, updated {card['updated']}. "
        f"Look it up exactly with `get_metric(\"{card['id']}\")`, or one variant with its ID.",
        "",
        clean(card["summary"]),
        "",
        f"- **Measures:** {clean(card['measures'])}",
        f"- **Direction:** {clean(card['direction'])}",
        f"- **Unit:** {card['unit']}",
        f"- **Data:** {card['data']} data",
    ]
    if card.get("aliases"):
        lines.append(f"- **Also called:** {', '.join(card['aliases'])}")
    lines += ["", "## Origin", "", clean(card["origin"]["text"]), "", f"Source: {card['origin']['source']}", ""]

    lines += ["## Variants", "", "| Variant | Zone | Reference code |", "|---|---|---|"]
    for variant in card["variants"]:
        ref = variant.get("reference")
        code = "none yet" if not ref else ("exact" if ref.get("exact") else "approximation")
        lines.append(f"| `{variant['id']}` | {clean(variant['zone'])} | {code} |")
    lines.append("")

    for variant in card["variants"]:
        source = variant["source"]
        lines += [f"## {variant['id']}: {variant['name']}", "", clean(variant["definition"]), ""]
        lines.append(f"- **Formula:** {clean(variant['formula'])}")
        lines.append(f"- **Zone:** {clean(variant['zone'])}")
        if variant.get("counts"):
            lines.append(f"- **Passes counted:** {clean(variant['counts'])}")
        byline = ", ".join(part for part in (source["author"], source.get("date")) if part)
        lines.append(f"- **Source:** {source['title']} ({byline}): {source['id']}")
        lines.append(f"- **Quote** ({CHECK_LABEL[source['check']]}, {source['checked']}): \"{source['quote']}\"")
        if source.get("check_note"):
            lines.append(f"- **Quote check note:** {clean(source['check_note'])}")
        ref = variant.get("reference")
        if ref:
            kind = "exact" if ref.get("exact") else "approximation"
            lines.append(f"- **Reference code ({kind}):** `{ref['function']}` on {ref['dataset']}. {clean(ref['mapping'])}")
            for fixture in variant.get("fixtures", []):
                lines.append(f"- **Test value:** {fixture['team']}, {fixture['label']} (match {fixture['match_id']}): {fixture['expected']}")
        else:
            lines.append("- **Reference code:** none yet.")
        for note in variant.get("notes", []):
            lines.append(f"- {clean(note)}")
        lines.append("")

    lines += ["## Caveats", ""] + [f"- {clean(caveat)}" for caveat in card["caveats"]] + [""]
    if card.get("related"):
        lines += ["## Related cards", "", ", ".join(f"`{item}`" + ("" if item in known else " (no card yet)") for item in card["related"]), ""]
    return "\n".join(lines)


def build():
    cards = []
    for path in sorted(CARDS.glob("*.toml")):
        with path.open("rb") as handle:
            cards.append(validate(tomllib.load(handle), path))
    for card in cards:
        card["summary"] = clean(card["summary"])
    payload = json.dumps({"format": "football-docs/metric-cards/v1", "cards": cards}, indent=2, ensure_ascii=False) + "\n"
    known = frozenset(card["id"] for card in cards)
    pages = {DOCS / f"{card['id']}.md": render(card, known) for card in cards}
    return payload, pages


def main():
    payload, pages = build()
    if "--check" in sys.argv:
        stale = []
        if not CARDS_JSON.exists() or CARDS_JSON.read_text(encoding="utf-8") != payload:
            stale.append("metrics/cards.json")
        for path, text in pages.items():
            if not path.exists() or path.read_text(encoding="utf-8") != text:
                stale.append(str(path.relative_to(ROOT)))
        extra = sorted(p for p in DOCS.glob("*.md") if p not in pages) if DOCS.exists() else []
        stale += [f"{p.relative_to(ROOT)} (no card)" for p in extra]
        if stale:
            print("metric cards out of date: " + ", ".join(stale) + ". Run python3 scripts/gen_metric_cards.py")
            sys.exit(1)
        print(f"metric cards match metrics/cards/*.toml ({len(pages)} cards)")
        return
    CARDS_JSON.write_text(payload, encoding="utf-8", newline="\n")
    DOCS.mkdir(parents=True, exist_ok=True)
    for path, text in pages.items():
        path.write_text(text, encoding="utf-8", newline="\n")
    print(f"wrote metrics/cards.json and {len(pages)} page(s) in docs/metric-cards/")


if __name__ == "__main__":
    main()
