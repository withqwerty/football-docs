#!/usr/bin/env python3
"""Build data/skillcorner-open-data-truth.json from SkillCorner's open data.

Reads every `*_dynamic_events.csv` in https://github.com/SkillCorner/opendata
at one pinned commit. It records, per column: its name (in file order), its
distinct values when there are at most MAX_VALUES, its type (number, bool or
text), the shapes of its text values when there are at most MAX_SHAPES, the
event types whose rows fill it, and the event types whose rows leave it empty. It also records each `<name>_id` to
`<name>` pair seen in the data.

The test src/__tests__/skillcorner-open-data-validation.test.ts checks
docs/skillcorner/dynamic-events.md against this file.

Usage:
    python3 scripts/gen_skillcorner_open_data_truth.py [--commit SHA] [--check]
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import re
import sys
import urllib.request
from datetime import date
from pathlib import Path

REPO = "SkillCorner/opendata"
DEFAULT_COMMIT = "4340d274572876239c154c90bc507a9b3250a656"
MAX_VALUES = 30
MAX_SHAPES = 5
OUT = Path(__file__).resolve().parent.parent / "data" / "skillcorner-open-data-truth.json"


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "football-docs-truth"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        return resp.read()


def dynamic_event_paths(commit: str) -> list[str]:
    tree = json.loads(fetch(f"https://api.github.com/repos/{REPO}/git/trees/{commit}?recursive=1"))
    return sorted(e["path"] for e in tree["tree"] if e["path"].endswith("_dynamic_events.csv"))


# Plain decimal numbers only. float() also takes "1_0", "nan" and "inf", and
# event IDs such as "1_0" are text.
NUMBER = re.compile(r"[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?")


def is_number(value: str) -> bool:
    return NUMBER.fullmatch(value) is not None


def shape(value: str) -> str:
    """The value with each digit replaced by "d", for example "45:03.2" -> "dd:dd.d"."""
    return re.sub(r"\d", "d", value)


def column_type(values: set[str], text: bool) -> str:
    if not text:
        return "number"
    return "bool" if values <= {"True", "False"} else "text"


def one_name(id_column: str, id_: str, names: set[str]) -> str:
    if len(names) != 1:
        sys.exit(f"{id_column} = {id_} has more than one name: {sorted(names)}")
    return next(iter(names))


def build(commit: str) -> dict:
    columns: list[str] | None = None
    rows = 0
    seen: dict[str, set[str]] = {}
    text_columns: set[str] = set()
    shapes: dict[str, set[str]] = {}
    events: dict[str, set[str]] = {}
    empty: dict[str, set[str]] = {}
    pairs: dict[str, dict[str, set[str]]] = {}
    paths = dynamic_event_paths(commit)
    for path in paths:
        text = fetch(f"https://raw.githubusercontent.com/{REPO}/{commit}/{path}").decode("utf-8")
        reader = csv.DictReader(io.StringIO(text))
        if columns is None:
            columns = list(reader.fieldnames or [])
        elif list(reader.fieldnames or []) != columns:
            sys.exit(f"{path}: columns differ from the first file")
        id_columns = [c for c in columns if c.endswith("_id") and c[:-3] in columns]
        for row in reader:
            rows += 1
            for id_column in id_columns:
                if row[id_column] != "" and row[id_column[:-3]] != "":
                    names = pairs.setdefault(id_column, {}).setdefault(row[id_column], set())
                    names.add(row[id_column[:-3]])
            for name, value in row.items():
                if value == "":
                    empty.setdefault(name, set()).add(row["event_type"])
                    continue
                events.setdefault(name, set()).add(row["event_type"])
                if not is_number(value):
                    text_columns.add(name)
                    column_shapes = shapes.setdefault(name, set())
                    if len(column_shapes) <= MAX_SHAPES:
                        column_shapes.add(shape(value))
                values = seen.setdefault(name, set())
                if len(values) <= MAX_VALUES:
                    values.add(value)
    assert columns is not None
    return {
        "source": {
            "repo": f"https://github.com/{REPO}",
            "commit": commit,
            "generated_at": date.today().isoformat(),
            "matches": len(paths),
            "rows": rows,
        },
        "columns": columns,
        "values": {
            name: sorted(seen[name])
            for name in columns
            if name in seen and len(seen[name]) <= MAX_VALUES
        },
        "types": {name: column_type(seen[name], name in text_columns) for name in columns if name in seen},
        "shapes": {
            name: sorted(shapes[name]) for name in columns if name in shapes and len(shapes[name]) <= MAX_SHAPES
        },
        "events": {name: sorted(events[name]) for name in columns if name in events},
        "empty": {name: sorted(empty[name]) for name in columns if name in empty},
        "id_pairs": {
            id_column: {id_: one_name(id_column, id_, names) for id_, names in sorted(by_id.items(), key=lambda kv: float(kv[0]))}
            for id_column, by_id in pairs.items()
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--commit", default=DEFAULT_COMMIT)
    parser.add_argument("--check", action="store_true", help="diff against the committed file only")
    args = parser.parse_args()
    truth = build(args.commit)
    if args.check:
        current = json.loads(OUT.read_text())
        current["source"].pop("generated_at", None)
        fresh = dict(truth, source={k: v for k, v in truth["source"].items() if k != "generated_at"})
        if current != fresh:
            sys.exit(f"{OUT.name} is out of date; rerun without --check")
        print(f"{OUT.name} is up to date")
        return
    OUT.write_text(json.dumps(truth, indent=2) + "\n")
    print(f"wrote {OUT} ({truth['source']['matches']} matches, {truth['source']['rows']} rows)")


if __name__ == "__main__":
    main()
