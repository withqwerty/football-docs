#!/usr/bin/env python3
"""
Regenerate the spec-derived tables in the wearable vendor docs.

The STATSports, Firstbeat, Hawkin Dynamics and VALD docs reproduce whole schemas
and metric vocabularies as markdown tables. This script rebuilds those tables from
the mirrored specs in specs/, so a spec refresh is a rerun rather than a hand edit.

It owns only the text between marker comments:

    <!-- generated:statsports-drillkpi-v7-accelerations start -->
    ...
    <!-- generated:statsports-drillkpi-v7-accelerations end -->

Everything outside the markers is hand-written and is never touched. Each marker
id is registered in SECTIONS below; an id in a doc that is not registered, or a
registered id with no markers in its doc, is an error.

The only editorial input is in this file: which fields are personal data, and how
the STATSports drill KPI fields are grouped. Every other cell comes from the spec.
Firstbeat's variables page (https://apidocs.firstbeat.com/variables/) is not in
any spec, so docs/firstbeat/variables.md stays hand-written.

Usage:
    python3 scripts/gen_vendor_tables.py           # rewrite the generated sections
    python3 scripts/gen_vendor_tables.py --check   # exit 1 if any section differs
"""

from __future__ import annotations

import argparse
import difflib
import functools
import json
import re
import sys
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parent.parent
SPECS = REPO / "specs"
DOCS = REPO / "docs"

MARKER = re.compile(r"^<!-- generated:([a-z0-9-]+) (start|end) -->$")

PERSONAL = "**Personal data.**"

# Fields the docs mark as personal data, as "Schema.field". Editorial: no spec
# says which of its fields identify a person.
PERSONAL_FIELDS: dict[str, set[str]] = {
    "statsports": {
        *(
            f"{schema}.{field}"
            for schema in ("PlayerDataV5", "PlayerDataV6")
            for field in (
                "displayName",
                "firstName",
                "lastName",
                "dateOfBirth",
                "gender",
                "shortName",
                "height",
                "weight",
                "maxHeartRate",
                "restingHeartRate",
            )
        ),
        "GpsDataV6.hr",
        "GpsImuDataV6.hr",
    },
    "firstbeat": {
        f"{schema}.{field}" for schema in ("Athlete", "Coach") for field in ("firstName", "lastName", "email")
    },
    "hawkin-dynamics": {
        "AthleteRef.name",
        *(f"Athlete.{field}" for field in ("name", "image", "position", "dob", "sport", "height")),
        "AthleteInput.name",
        "AthleteInput.image",
        "AthleteUpdateInput.name",
        "AthleteUpdateInput.image",
    },
    "vald": {
        *(f"AthleteItemDTO.{field}" for field in ("name", "givenName", "familyName")),
        "DetailedTestDTO.fullName",
        "DetailedTestDTO.weight",
        "TestDTO.weight",
        "TestResponse.weight",
        *(
            f"Vald.Api.ExternalProfile.V1.Models.GetProfileByIdResponse.{field}"
            for field in (
                "givenName",
                "familyName",
                "dateOfBirth",
                "sex",
                "email",
                "weightInKg",
                "heightInCm",
                "sport",
                "position",
            )
        ),
        *(
            f"Vald.Api.ExternalProfile.V1.Models.GetProfileSearchResponse_ProfileDetail.{field}"
            for field in ("givenName", "familyName", "dateOfBirth")
        ),
        *(
            f"Vald.Api.ExternalProfile.V1.Models.ImportProfileRequest.{field}"
            for field in (
                "dateOfBirth",
                "email",
                "givenName",
                "familyName",
                "sex",
                "isCreatedByUserOver18YearsOld",
                "isGuardianConsentGiven",
                "isPhotoVideoConsentGiven",
            )
        ),
        *(
            f"Vald.Api.ExternalSmartSpeed.V1.Models.{schema}.weightKg"
            for schema in (
                "GetTestDetailHttpResponse_AdditionalTestResultDto",
                "GetTestSummariesHttpResponse_AdditionalOptionsFieldsDto",
                "TestCursorHttpResponse_AdditionalOptionsFieldsDto",
            )
        ),
    },
}


@functools.cache
def load(path: str) -> dict[str, Any]:
    """A spec under specs/. Cached and shared, so callers must not modify it."""
    return json.loads((SPECS / path).read_text())


def ref_name(ref: str) -> str:
    return ref.rsplit("/", 1)[-1]


def cell(text: str) -> str:
    """Make a string safe inside a markdown table cell."""
    return " ".join(str(text).split()).replace("|", "\\|")


def type_of(prop: dict[str, Any]) -> str:
    """The Type cell: `string`, `Ref`, array of `X`, object (map of `X`), `A` or `B`."""
    if "$ref" in prop:
        return f"`{ref_name(prop['$ref'])}`"
    for key in ("oneOf", "anyOf"):
        if key in prop:
            return " or ".join(type_of(option) for option in prop[key])
    if prop.get("type") == "array":
        return f"array of {type_of(prop.get('items', {}))}"
    extra = prop.get("additionalProperties")
    if prop.get("type") == "object" and isinstance(extra, dict) and extra:
        return f"object (map of {type_of(extra)})"
    return f"`{prop.get('type', 'object')}`"


def fmt(value: Any) -> str:
    return json.dumps(value)


def yes(flag: bool) -> str:
    return "yes" if flag else ""


def notes(vendor: str, schema: str, field: str, prop: dict[str, Any]) -> str:
    """The Description cell: personal-data flag, spec description, then constraints."""
    parts: list[str] = []
    if f"{schema}.{field}" in PERSONAL_FIELDS[vendor]:
        parts.append(PERSONAL)
    if prop.get("description"):
        parts.append(cell(prop["description"]))
    if prop.get("enum"):
        parts.append("Values: " + ", ".join(f"`{v}`" for v in prop["enum"]))
    bounds = [f"{key}: `{fmt(prop[key])}`" for key in ("minLength", "maxLength", "minimum", "maximum") if key in prop]
    if bounds:
        parts.append(" ".join(bounds))
    if "default" in prop:
        parts.append(f"default: `{fmt(prop['default'])}`")
    if prop.get("readOnly"):
        parts.append("readOnly: `true`")
    return " ".join(parts)


def table(header: list[str], rows: list[list[str]], separator: str = "|---") -> str:
    sep = "|" + "|".join(separator.strip("|") for _ in header) + "|"
    lines = ["| " + " | ".join(header) + " |", sep]
    lines += ["| " + " | ".join(row) + " |" for row in rows]
    return "\n".join(lines)


def format_of(prop: dict[str, Any]) -> str:
    """The Format cell. An array of formatted strings (uuid, date-time) shows its items' format."""
    value = prop.get("format") or (prop.get("items", {}).get("format") if prop.get("type") == "array" else None)
    return f"`{value}`" if value else ""


def field_rows(vendor: str, name: str, schema: dict[str, Any]) -> list[dict[str, str]]:
    required = set(schema.get("required", []))
    rows = []
    for field, prop in (schema.get("properties") or {}).items():
        rows.append(
            {
                "Field": f"`{field}`",
                "Type": type_of(prop),
                "Format": format_of(prop),
                "Nullable": yes(prop.get("nullable", False)),
                "Required": yes(field in required),
                "Description": notes(vendor, name, field, prop),
            }
        )
    return rows


FULL_COLUMNS = ["Field", "Type", "Format", "Nullable", "Required", "Description"]


def full_rows_table(rows: list[dict[str, str]]) -> str:
    """Six fixed columns, as the STATSports, Firstbeat and Hawkin pages use."""
    return table(FULL_COLUMNS, [[row[c] for c in FULL_COLUMNS] for row in rows])


def compact_rows_table(rows: list[dict[str, str]]) -> str:
    """Field and Type, plus only the optional columns some row fills, as the VALD pages use."""
    columns = ["Field", "Type"] + [c for c in FULL_COLUMNS[2:] if any(row[c] for row in rows)]
    return table(columns, [[row[c] for c in columns] for row in rows], separator="| --- ")


def inline_objects(schema: dict[str, Any], path: str = "") -> list[tuple[str, bool, dict[str, Any]]]:
    """Objects defined inline in a schema's fields, with no component name of their own:
    (field path, whether it is an array item, schema), outermost first."""
    found = []
    for field, prop in (schema.get("properties") or {}).items():
        label = f"{path}.{field}" if path else field
        node, is_item = prop, False
        while node.get("type") == "array":
            node, is_item = node.get("items", {}), True
        if "properties" in node:
            found.append((label, is_item, node))
            found += inline_objects(node, label)
    return found


def field_tables(vendor: str, name: str, schema: dict[str, Any], render: Callable[[list[dict[str, str]]], str]) -> str:
    """A schema's field table, then one table per inline object among its fields."""
    parts = [render(field_rows(vendor, name, schema))]
    for label, is_item, node in inline_objects(schema):
        lead = f"Each `{label}` item" if is_item else f"`{label}`"
        parts.append(f"{lead} is an object with these fields:")
        parts.append(render(field_rows(vendor, f"{name}.{label}", node)))
    return "\n\n".join(parts)


def full_field_table(vendor: str, name: str, schema: dict[str, Any]) -> str:
    return field_tables(vendor, name, schema, full_rows_table)


def compact_field_table(vendor: str, name: str, schema: dict[str, Any]) -> str:
    return field_tables(vendor, name, schema, compact_rows_table)


HTTP_METHODS = ("get", "put", "post", "delete", "options", "head", "patch", "trace")


def operations(spec: dict[str, Any]) -> list[tuple[str, str, dict[str, Any]]]:
    """(METHOD, path, operation) in spec order."""
    return [
        (method.upper(), path, op)
        for path, item in spec["paths"].items()
        for method, op in item.items()
        if method in HTTP_METHODS
    ]


def body_schema(content: dict[str, Any] | None) -> tuple[str, dict[str, Any]] | None:
    """(media type, schema) of a request or response body, preferring JSON."""
    if not content:
        return None
    media = "application/json" if "application/json" in content else next(iter(content))
    return media, content[media].get("schema", {})


def inventory(spec: dict[str, Any], skip: tuple[str, ...] = ()) -> list[list[str]]:
    """Method, Path, Tag, Summary rows."""
    return [
        [f"`{method}`", f"`{path}`", cell(", ".join(op.get("tags", []))), cell(op.get("summary", ""))]
        for method, path, op in operations(spec)
        if path not in skip
    ]


# --- STATSports -------------------------------------------------------------

STATSPORTS_VERSIONS = ("v5", "v6", "v7")


def statsports_specs() -> dict[str, dict[str, Any]]:
    return {v: load(f"statsports/thirdpartyapi-{v}.json") for v in STATSPORTS_VERSIONS}


def statsports_component(name: str) -> tuple[list[str], dict[str, Any]]:
    """The versions whose spec defines a schema, and the schema, which must be the same in each."""
    specs = statsports_specs()
    defined = [v for v in STATSPORTS_VERSIONS if name in specs[v]["components"]["schemas"]]
    if not defined:
        raise SystemExit(f"statsports: no spec defines {name}")
    schema = specs[defined[-1]]["components"]["schemas"][name]
    for version in defined:
        if specs[version]["components"]["schemas"][name] != schema:
            raise SystemExit(f"statsports: {name} differs between {defined[-1]} and {version}; document both")
    return defined, schema


def statsports_schema_names() -> list[str]:
    """Schemas with a field table on the data model page: all but the drill KPIs, which
    have their own page, and IntPtr, which has no properties and is described in prose."""
    names: list[str] = []
    for spec in statsports_specs().values():
        names += [n for n in spec["components"]["schemas"] if n not in names]
    return [n for n in names if not n.startswith("DrillKpi") and n != "IntPtr"]


def statsports_inventory() -> str:
    specs = statsports_specs()
    present = {v: {(m, p) for m, p, _ in operations(specs[v])} for v in STATSPORTS_VERSIONS}
    keys: list[tuple[str, str]] = []
    for version in STATSPORTS_VERSIONS:
        keys += [(m, p) for m, p, _ in operations(specs[version]) if (m, p) not in keys]
    rows = [[f"`{m} {p}`", *("yes" if (m, p) in present[v] else "no" for v in STATSPORTS_VERSIONS)] for m, p in keys]
    return table(["Operation", *STATSPORTS_VERSIONS], rows)


def statsports_endpoints(version: str) -> str:
    rows = []
    for method, path, op in operations(statsports_specs()[version]):
        request = body_schema(op.get("requestBody", {}).get("content"))
        response = body_schema(op["responses"].get("200", {}).get("content"))
        rows.append(
            [
                f"`{method}`",
                f"`{path}`",
                f"{type_of(request[1])} ({request[0]})" if request else "none",
                type_of(response[1]) if response else "no body in the spec",
            ]
        )
    return table(["Method", "Path", "Request body", "Response `200`"], rows)


def statsports_schema(name: str) -> str:
    defined, schema = statsports_component(name)
    where = f"the {defined[0]} spec" if len(defined) == 1 else f"the {', '.join(defined)} specs"
    return f"Defined in {where}.\n\n" + full_field_table("statsports", name, schema)


def drillkpi(version: str) -> dict[str, dict[str, Any]]:
    return statsports_component(f"DrillKpi{version}")[1]["properties"]


# DrillKpiV7 groups, in page order, each with the field-name pattern that puts a
# field in it. The spec does not group the fields: this is editorial and only for
# navigation. "load" (the "load, work and other" table) takes every field no
# pattern matches. A field that matches two patterns is an error, so a new field
# is never filed silently under the wrong heading.
DRILLKPI_GROUPS: list[tuple[str, str | None]] = [
    ("duration", r"^(totalTime|distanceTotal|distancePerMin)$"),
    ("speed-zones", r"^distanceZ|^highSpeedRunning|^hsr"),
    ("time-in-speed-zones", r"^timeZ"),
    ("metabolic", r"^emd$|[Mm]etabolic|[Hh]ml"),
    ("speed", r"^(maxSpeed|averageSpeed)$|^speedIntensity"),
    ("impacts", r"^dsl|^impacts"),
    ("accelerations", r"[Aa]ccel"),
    ("decelerations", r"[Dd]ecel"),
    ("sprints", r"[Ss]print|^entries|^explosive|[Hh]ib"),
    ("heart-rate", r"[Hh]eart|^hr|RedZone"),
    ("load", None),
    ("steps", r"^(stepBalance|dynamicLoad|totalRightSteps|totalLeftSteps|right|left|runningSymmetry)"),
    ("goalkeeper", r"[Gg]oalkeeper|[Dd]ive"),
    ("change-of-direction", r"^changeOfDirection"),
    ("custom-metrics", r"^customMetrics$"),
]


def drillkpi_group(field: str) -> str:
    groups = [group for group, pattern in DRILLKPI_GROUPS if pattern and re.search(pattern, field)]
    if len(groups) > 1:
        raise SystemExit(f"statsports: DrillKpiV7 field {field} matches groups {groups}; narrow DRILLKPI_GROUPS")
    return groups[0] if groups else "load"


def kpi_type(prop: dict[str, Any]) -> tuple[str, str]:
    return type_of(prop), format_of(prop)


def statsports_drillkpi_v7(group: str) -> str:
    v7, v6, v5 = drillkpi("V7"), drillkpi("V6"), drillkpi("V5")
    rows = []
    for field, prop in v7.items():
        if drillkpi_group(field) != group:
            continue
        rows.append([f"`{field}`", *kpi_type(prop), yes(field in v6), yes(field in v5)])
    return table(["Field", "Type", "Format", "In `DrillKpiV6`", "In `DrillKpiV5`"], rows)


def statsports_drillkpi_v6_not_in_v7() -> str:
    v7, v6, v5 = drillkpi("V7"), drillkpi("V6"), drillkpi("V5")
    rows = [[f"`{f}`", *kpi_type(p), yes(f in v5)] for f, p in v6.items() if f not in v7]
    return table(["Field", "Type", "Format", "In `DrillKpiV5`"], rows)


def statsports_drillkpi_v6_not_in_v5() -> str:
    v7, v6, v5 = drillkpi("V7"), drillkpi("V6"), drillkpi("V5")
    rows = [[f"`{f}`", *kpi_type(p), yes(f in v7)] for f, p in v6.items() if f not in v5]
    return table(["Field", "Type", "Format", "In `DrillKpiV7`"], rows)


# --- Firstbeat --------------------------------------------------------------


def firstbeat_schema(name: str) -> str:
    schema = load("firstbeat/openapi.json")["components"]["schemas"][name]
    return full_field_table("firstbeat", name, schema)


# --- Hawkin Dynamics --------------------------------------------------------


def hawkin_schema(name: str) -> str:
    schema = load("hawkin-dynamics/openapi.json")["components"]["schemas"][name]
    return full_field_table("hawkin-dynamics", name, schema)


def hawkin_inline_responses() -> list[str]:
    """Paths of the GET operations whose `200` body is an object defined inline."""
    paths = []
    for method, path, op in operations(load("hawkin-dynamics/openapi.json")):
        body = body_schema(op["responses"].get("200", {}).get("content"))
        if method == "GET" and body and "properties" in body[1]:
            paths.append(path)
    return paths


def hawkin_response(path: str) -> str:
    """The inline `200` body of a GET operation, which has no component name."""
    op = load("hawkin-dynamics/openapi.json")["paths"][path]["get"]
    _, schema = body_schema(op["responses"]["200"]["content"])
    return full_field_table("hawkin-dynamics", "", schema)


# The reference page leaves these test types out, and so does the doc: two have
# no testTypeName, and the page excludes the other three "by product decision".
HAWKIN_EXCLUDED_BY_PAGE = ("cloaBt6gXbKvsrDcqNAs", "HWI4BzMSq0S0HFjWPIeC", "3HKDlteQolAUXmEKKWoT")


def hawkin_test_types() -> list[dict[str, Any]]:
    return load("hawkin-dynamics/metrics.json")


def hawkin_shown(test_type: dict[str, Any]) -> bool:
    return bool(test_type.get("testTypeName")) and test_type["canonicalTestTypeId"] not in HAWKIN_EXCLUDED_BY_PAGE


def hawkin_metrics(canonical_id: str) -> str:
    (test_type,) = [t for t in hawkin_test_types() if t["canonicalTestTypeId"] == canonical_id]
    metrics = test_type["metrics"]
    rows = [[f"`{m['id']}`", cell(m["label"]), cell(m["units"]), cell(m["description"])] for m in metrics]
    head = f"`canonicalTestTypeId`: `{canonical_id}`. {len(metrics)} metrics.\n\n"
    return head + table(["`id`", "Label", "Units", "Description"], rows)


def hawkin_excluded() -> str:
    rows = [
        [f"`{t['canonicalTestTypeId']}`", cell(t.get("testTypeName") or "(no `testTypeName`)"), str(len(t["metrics"]))]
        for t in hawkin_test_types()
        if not hawkin_shown(t)
    ]
    return table(["`canonicalTestTypeId`", "Name", "Metrics in the file"], rows)


# --- VALD -------------------------------------------------------------------

# Doc page -> (API name the docs use, host service and spec file name).
VALD_PRODUCTS = {
    "tenants": ("Tenants", "externaltenants"),
    "profiles": ("Profiles", "externalprofile"),
    "forcedecks": ("ForceDecks", "extforcedecks"),
    "nordbord": ("NordBord", "externalnordbord"),
    "forceframe": ("ForceFrame", "externalforceframe"),
    "smartspeed": ("SmartSpeed", "extsmartspeed"),
    "dynamo": ("DynaMo", "extdynamo"),
    "humantrak": ("HumanTrak", "externalhumantrakv2"),
}

# Every VALD service has these; they report on the service, not on athlete data.
VALD_HEALTH = ("/version", "/liveness", "/readiness", "/diagnostics")


def vald_spec(service: str) -> dict[str, Any]:
    return load(f"vald/{service}.json")


def vald_operation_rows(service: str, skip: tuple[str, ...] = ()) -> list[list[str]]:
    """Method, Path, Summary, Deprecated rows."""
    return [
        [f"`{method}`", f"`{path}`", cell(op.get("summary", "")), yes(op.get("deprecated", False))]
        for method, path, op in operations(vald_spec(service))
        if path not in skip
    ]


def vald_endpoints(service: str) -> str:
    return table(["Method", "Path", "Summary", "Deprecated"], vald_operation_rows(service))


def vald_response(status: str, response: dict[str, Any]) -> str:
    body = body_schema(response.get("content"))
    text = f"`{status}` {response.get('description', '')}".rstrip()
    return f"{text}: {type_of(body[1])}" if body else text


def vald_health(service: str) -> str:
    rows = []
    for method, path, op in operations(vald_spec(service)):
        if path not in VALD_HEALTH:
            continue
        params = [
            f"`{p['name']}` ({p['in']}, {p.get('schema', {}).get('type', '')}{', required' if p.get('required') else ''})"
            for p in op.get("parameters", [])
        ]
        responses = [vald_response(status, r) for status, r in op["responses"].items()]
        rows.append([f"`{method} {path}`", "<br>".join(params), "<br>".join(responses)])
    return table(["Endpoint", "Parameters", "Responses"], rows)


def vald_inventory() -> str:
    rows = [
        [api, f"`{service}`", *row]
        for api, service in VALD_PRODUCTS.values()
        for row in vald_operation_rows(service, skip=VALD_HEALTH)
    ]
    return table(["API", "Host service", "Method", "Path", "Summary", "Deprecated"], rows)


def vald_counts() -> str:
    rows = []
    for api, service in VALD_PRODUCTS.values():
        spec = vald_spec(service)
        schemas = spec["components"]["schemas"]
        fields = sum(len(s.get("properties") or {}) for s in schemas.values())
        rows.append(
            [
                api,
                f"`{service}`",
                f"`{spec['info']['version']}`",
                str(len(operations(spec))),
                str(len(schemas)),
                str(fields),
            ]
        )
    header = ["API", "Host service", "Spec version", "Operations (with health endpoints)", "Schemas", "Schema fields"]
    return table(header, rows)


def vald_schemas(service: str) -> str:
    """Every component schema of one VALD spec, in spec order, as ### subsections."""
    blocks = []
    for name, schema in load(f"vald/{service}.json")["components"]["schemas"].items():
        parts = [f"### `{name}`"]
        if "enum" in schema:
            parts.append(f"Type `{schema['type']}`.")
            parts.append(table(["Value"], [[f"`{v}`"] for v in schema["enum"]]))
        else:
            if schema.get("additionalProperties") == {}:
                parts.append("`additionalProperties`: `{}`.")
            parts.append(compact_field_table("vald", name, schema))
        blocks.append("\n\n".join(parts))
    return "\n\n".join(blocks)


# --- Registry ---------------------------------------------------------------


@dataclass(frozen=True)
class Section:
    id: str
    doc: str  # path under docs/
    render: Callable[[], str]


def slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def sections() -> list[Section]:
    out: list[Section] = [
        Section("statsports-endpoint-inventory", "statsports/api-endpoints.md", statsports_inventory),
        *(
            Section(f"statsports-endpoints-{v}", "statsports/api-endpoints.md", lambda v=v: statsports_endpoints(v))
            for v in reversed(STATSPORTS_VERSIONS)
        ),
        Section(
            "firstbeat-endpoint-inventory",
            "firstbeat/api-endpoints.md",
            lambda: table(["Method", "Path", "Tag", "Summary"], inventory(load("firstbeat/openapi.json"))),
        ),
        Section(
            "hawkin-endpoint-inventory",
            "hawkin-dynamics/api-endpoints.md",
            lambda: table(["Method", "Path", "Tag", "Summary"], inventory(load("hawkin-dynamics/openapi.json"))),
        ),
    ]

    for name in statsports_schema_names():
        out.append(
            Section(f"statsports-schema-{slug(name)}", "statsports/data-model.md", lambda n=name: statsports_schema(n))
        )
    for group, _ in DRILLKPI_GROUPS:
        out.append(
            Section(
                f"statsports-drillkpi-v7-{group}",
                "statsports/drill-kpi-metrics.md",
                lambda g=group: statsports_drillkpi_v7(g),
            )
        )
    out.append(
        Section("statsports-drillkpi-v6-not-in-v7", "statsports/drill-kpi-metrics.md", statsports_drillkpi_v6_not_in_v7)
    )
    out.append(
        Section("statsports-drillkpi-v6-not-in-v5", "statsports/drill-kpi-metrics.md", statsports_drillkpi_v6_not_in_v5)
    )

    for name in load("firstbeat/openapi.json")["components"]["schemas"]:
        out.append(
            Section(f"firstbeat-schema-{slug(name)}", "firstbeat/data-model.md", lambda n=name: firstbeat_schema(n))
        )

    for name, schema in load("hawkin-dynamics/openapi.json")["components"]["schemas"].items():
        if schema.get("type") == "array":
            continue  # MetricsResponse is described in prose
        out.append(
            Section(f"hawkin-schema-{slug(name)}", "hawkin-dynamics/data-model.md", lambda n=name: hawkin_schema(n))
        )
    for path in hawkin_inline_responses():
        out.append(
            Section(
                f"hawkin-response-{slug(path.rsplit('/', 1)[-1])}",
                "hawkin-dynamics/api-endpoints.md",
                lambda p=path: hawkin_response(p),
            )
        )
    out.append(Section("hawkin-metrics-excluded", "hawkin-dynamics/test-metrics.md", hawkin_excluded))
    for test_type in hawkin_test_types():
        if hawkin_shown(test_type):
            out.append(
                Section(
                    f"hawkin-metrics-{slug(test_type['testTypeName'])}",
                    "hawkin-dynamics/test-metrics.md",
                    lambda c=test_type["canonicalTestTypeId"]: hawkin_metrics(c),
                )
            )

    out.append(Section("vald-endpoint-inventory", "vald/api-endpoints.md", vald_inventory))
    out.append(Section("vald-operation-counts", "vald/api-endpoints.md", vald_counts))
    for page, (_, service) in VALD_PRODUCTS.items():
        doc = f"vald/{page}.md"
        out.append(Section(f"vald-{page}-endpoints", doc, lambda s=service: vald_endpoints(s)))
        out.append(Section(f"vald-{page}-health", doc, lambda s=service: vald_health(s)))
        out.append(Section(f"vald-{page}-schemas", doc, lambda s=service: vald_schemas(s)))

    ids = [s.id for s in out]
    duplicates = {i for i in ids if ids.count(i) > 1}
    if duplicates:
        raise SystemExit(f"duplicate section ids: {sorted(duplicates)}")
    return out


# --- Driver -----------------------------------------------------------------


def apply(text: str, doc: str, rendered: dict[str, str]) -> tuple[str, set[str]]:
    """Replace each marked section in one doc. Returns the new text and the ids seen."""
    lines = text.split("\n")
    out: list[str] = []
    seen: set[str] = set()
    open_id: str | None = None
    for number, line in enumerate(lines, 1):
        match = MARKER.match(line)
        if open_id is None:
            out.append(line)
            if not match:
                continue
            section_id, edge = match.groups()
            if edge != "start":
                raise SystemExit(f"docs/{doc}:{number}: end marker for {section_id} with no start")
            if section_id not in rendered:
                raise SystemExit(f"docs/{doc}:{number}: {section_id} is not a section of this doc")
            if section_id in seen:
                raise SystemExit(f"docs/{doc}:{number}: {section_id} appears twice")
            seen.add(section_id)
            open_id = section_id
            out.append(rendered[section_id])
        elif match:
            section_id, edge = match.groups()
            if section_id != open_id or edge != "end":
                raise SystemExit(f"docs/{doc}:{number}: expected end marker for {open_id}")
            out.append(line)
            open_id = None
    if open_id is not None:
        raise SystemExit(f"docs/{doc}: {open_id} has no end marker")
    return "\n".join(out), seen


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check", action="store_true", help="report differences and exit 1 instead of writing")
    args = parser.parse_args()

    by_doc: dict[str, dict[str, str]] = {}
    for section in sections():
        by_doc.setdefault(section.doc, {})[section.id] = section.render()

    stale: list[str] = []
    for doc, rendered in sorted(by_doc.items()):
        path = DOCS / doc
        text = path.read_text()
        new, seen = apply(text, doc, rendered)
        missing = sorted(set(rendered) - seen)
        if missing:
            raise SystemExit(f"docs/{doc}: no markers for {', '.join(missing)}")
        if new == text:
            continue
        stale.append(doc)
        if args.check:
            diff = difflib.unified_diff(
                text.splitlines(), new.splitlines(), f"docs/{doc}", f"docs/{doc} (generated)", lineterm=""
            )
            print("\n".join(diff))
        else:
            path.write_text(new)
            print(f"updated docs/{doc}")

    if args.check and stale:
        print(
            f"\n{len(stale)} doc(s) differ from what specs/ generates. "
            "Run `python3 scripts/gen_vendor_tables.py`, review the diff, then `pnpm ingest`.",
            file=sys.stderr,
        )
        return 1
    if not stale:
        print("generated sections match specs/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
