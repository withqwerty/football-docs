"""Build the column tables in docs/free-sources/football-data-columns.md.

football-data.co.uk documents every CSV column in notes.txt
(https://www.football-data.co.uk/notes.txt), mirrored at
specs/football-data/notes.txt. This script turns each "CODE = meaning" line
into a table row, word for word, and writes the tables between marker comments
in the doc. Prose outside the markers is hand-written.

    python3 scripts/gen_football_data_columns.py          # rewrite the tables
    python3 scripts/gen_football_data_columns.py --check  # fail if they differ
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NOTES = ROOT / "specs" / "football-data" / "notes.txt"
DOC = ROOT / "docs" / "free-sources" / "football-data-columns.md"

# Each table starts at the first line of notes.txt that matches its heading.
SECTIONS = [
    ("results", "Key to results data:"),
    ("match-statistics", "Match Statistics (where available)"),
    ("match-odds", "The following key to betting odds data"),
    ("total-goals-odds", "Key to total goals betting odds:"),
    ("asian-handicap-odds", "Key to Asian handicap betting odds:"),
    ("end", "Football-Data would like to acknowledge"),
]

ROW = re.compile(r"^(\S.*?) = (.+?)\s*$")


def parse(text):
    lines = text.splitlines()
    starts = {}
    for name, heading in SECTIONS:
        index = next((i for i, line in enumerate(lines) if line.startswith(heading)), None)
        if index is None:
            raise SystemExit(f"notes.txt has no line starting {heading!r}; the layout changed")
        starts[name] = index
    order = [name for name, _ in SECTIONS]
    tables = {}
    for name, nxt in zip(order, order[1:]):
        rows = []
        for line in lines[starts[name] + 1 : starts[nxt]]:
            match = ROW.match(line)
            if match:
                codes = [code.strip() for code in match.group(1).split(" and ")]
                rows.append((codes, match.group(2)))
        tables[name] = rows
    return tables


def render(rows):
    out = ["| Column | Meaning |", "|---|---|"]
    for codes, meaning in rows:
        cell = ", ".join(f"`{code}`" for code in codes)
        out.append(f"| {cell} | {meaning.replace('|', chr(92) + '|')} |")
    return "\n".join(out)


def main():
    tables = parse(NOTES.read_text(encoding="utf-8"))
    doc = DOC.read_text(encoding="utf-8")
    new = doc
    for name, rows in tables.items():
        start = f"<!-- generated:football-data-{name} start -->"
        end = f"<!-- generated:football-data-{name} end -->"
        if start not in new or end not in new:
            raise SystemExit(f"{DOC.name}: no markers for football-data-{name}")
        before, rest = new.split(start, 1)
        _, after = rest.split(end, 1)
        new = f"{before}{start}\n{render(rows)}\n{end}{after}"
    if "--check" in sys.argv:
        if new != doc:
            print(f"{DOC.relative_to(ROOT)}: tables differ from specs/football-data/notes.txt; run the generator")
            sys.exit(1)
        print("football-data column tables match specs/football-data/notes.txt")
        return
    DOC.write_text(new, encoding="utf-8", newline="\n")
    print(f"updated {DOC.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
