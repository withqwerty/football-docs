#!/usr/bin/env python3
"""Extract documentation ground truth from an OpenAPI spec.

Sibling of gen_python_truth.py for providers documented from a vendor spec rather
than an installable package. Writes the *facts* a doc set can be checked against -
endpoint paths, parameter names, schema field names and enumerated values - to
data/provider-truth/<provider>.json.

Deriving truth this way means the repo does not need to keep the vendor's spec
file itself: fetch it to a scratch dir, derive, and commit only the derived facts.

Usage:
    python3 scripts/gen_openapi_truth.py specs/wyscout/v3-current.yml --provider wyscout
    python3 scripts/gen_openapi_truth.py specs/fmdb-pro/openapi.json --provider fmdb-pro
"""

from __future__ import annotations

import argparse
import datetime
import json
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parent.parent
OUT_DIR = REPO / "data" / "provider-truth"

HTTP_METHODS = {"get", "put", "post", "delete", "options", "head", "patch", "trace"}


def load_spec(path: Path) -> dict[str, Any]:
    text = path.read_text()
    if path.suffix in {".yml", ".yaml"}:
        try:
            import yaml
        except ImportError:  # pragma: no cover
            raise SystemExit("PyYAML needed for YAML specs: pip install pyyaml")
        return yaml.safe_load(text)
    return json.loads(text)


def walk_schemas(node: Any, fields: set[str], enums: dict[str, list[str]], name: str = "") -> None:
    """Collect property names and enum members from anywhere in the schema tree."""
    if isinstance(node, dict):
        props = node.get("properties")
        if isinstance(props, dict):
            for prop_name, prop in props.items():
                fields.add(str(prop_name))
                walk_schemas(prop, fields, enums, str(prop_name))

        values = node.get("enum")
        if isinstance(values, list) and values:
            if all(isinstance(v, str) for v in values):
                key = name or "anonymous"
                enums.setdefault(key, sorted({str(v) for v in values}))

        for key, child in node.items():
            if key not in {"properties", "enum"}:
                walk_schemas(child, fields, enums, key if key not in {"items"} else name)
    elif isinstance(node, list):
        for child in node:
            walk_schemas(child, fields, enums, name)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("spec", type=Path)
    ap.add_argument("--provider", required=True)
    args = ap.parse_args()

    spec = load_spec(args.spec)

    paths: dict[str, list[str]] = {}
    parameters: set[str] = set()

    for path, item in (spec.get("paths") or {}).items():
        if not isinstance(item, dict):
            continue
        methods = sorted(m.upper() for m in item if m.lower() in HTTP_METHODS)
        paths[str(path)] = methods
        for method, op in item.items():
            if method.lower() not in HTTP_METHODS and method != "parameters":
                continue
            params = op.get("parameters") if isinstance(op, dict) else op
            if isinstance(params, list):
                for p in params:
                    if isinstance(p, dict) and isinstance(p.get("name"), str):
                        parameters.add(p["name"])

    for p in (spec.get("components", {}).get("parameters") or {}).values():
        if isinstance(p, dict) and isinstance(p.get("name"), str):
            parameters.add(p["name"])

    fields: set[str] = set()
    enums: dict[str, list[str]] = {}
    schemas = spec.get("components", {}).get("schemas") or spec.get("definitions") or {}
    for schema_name, schema in schemas.items():
        walk_schemas(schema, fields, enums, str(schema_name))

    info = spec.get("info") or {}
    truth = {
        "provider": args.provider,
        "kind": "openapi",
        "source": {
            "spec": str(args.spec),
            "title": str(info.get("title", "")),
            "version": str(info.get("version", "unknown")),
            "generated_at": datetime.date.today().isoformat(),
        },
        "paths": {k: paths[k] for k in sorted(paths)},
        "parameters": sorted(parameters),
        "schemas": sorted(str(s) for s in schemas),
        "fields": sorted(fields),
        "enums": {k: v for k, v in sorted(enums.items())},
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / f"{args.provider}.openapi.json"
    out_path.write_text(json.dumps(truth, indent=2) + "\n")

    print(
        f"{args.provider}: {args.spec.name} -> {out_path.name} "
        f"({len(paths)} paths, {len(parameters)} params, {len(schemas)} schemas, "
        f"{len(fields)} fields, {len(enums)} enums)"
    )


if __name__ == "__main__":
    main()
