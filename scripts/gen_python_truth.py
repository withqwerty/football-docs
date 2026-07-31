#!/usr/bin/env python3
"""Extract documentation ground truth from an installed Python provider package.

The football-docs corpus makes checkable claims about these packages: which enum
members exist, which symbols are importable, what functions are called. This
script introspects the real installed package and writes those facts to
data/provider-truth/<provider>.json, which the test suite validates the docs
against.

Run inside a venv that has the target package installed:

    python3 scripts/gen_python_truth.py kloppy --provider kloppy
    python3 scripts/gen_python_truth.py socceraction --provider socceraction
"""

from __future__ import annotations

import argparse
import datetime
import enum
import importlib
import inspect
import json
import pkgutil
import typing
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
OUT_DIR = REPO / "data" / "provider-truth"

# Submodules worth walking for public symbols, per package. Walking everything is
# slow and pulls in optional heavy deps, so each package names the namespaces its
# docs actually reference.
EXTRA_MODULES = {
    "kloppy": ["kloppy.domain", "kloppy.helpers", "kloppy._providers"],
    "socceraction": ["socceraction.spadl", "socceraction.spadl.config", "socceraction.vaep"],
    "soccerdata": ["soccerdata._config"],
    "mplsoccer": ["mplsoccer.soccer.dimensions"],
    "floodlight": ["floodlight.core", "floodlight.io"],
    "databallpy": ["databallpy.schemas"],
    "skillcorner": [],
}


def public_names(mod) -> list[str]:
    """Every non-underscore name a module exposes.

    Deliberately the union of __all__ and dir() rather than __all__ alone: docs
    legitimately reference real helpers that a package never re-exports
    (mplsoccer.soccer.dimensions.center_scale_dims), and treating those as
    non-existent produces false "no such symbol" reports.
    """
    names = {n for n in dir(mod) if not n.startswith("_")}
    declared = getattr(mod, "__all__", None)
    if declared:
        names |= {str(n) for n in declared}
    return sorted(names)


def collect_enums(mod, seen: dict[str, list[str]]) -> None:
    """Record every Enum class reachable from a module, by class name."""
    for name in dir(mod):
        if name.startswith("_"):
            continue
        try:
            obj = getattr(mod, name)
        except Exception:
            continue
        if inspect.isclass(obj) and issubclass(obj, enum.Enum) and obj is not enum.Enum:
            members = [m.name for m in obj]
            if members:
                seen.setdefault(obj.__name__, members)


def collect_value_lists(mod, prefix: str, out: dict[str, list[str]]) -> None:
    """Record module-level string collections.

    Several packages express their controlled vocabularies as plain lists rather
    than enums - socceraction's spadl.config.actiontypes/bodyparts/results, and
    soccerdata's LEAGUE_DICT keys - and those are exactly what the docs enumerate.
    """
    for name in dir(mod):
        if name.startswith("_"):
            continue
        try:
            obj = getattr(mod, name)
        except Exception:
            continue
        values: list[str] | None = None
        if isinstance(obj, (list, tuple, set, frozenset)) and obj:
            if all(isinstance(v, str) for v in obj):
                values = sorted(str(v) for v in obj)
        elif isinstance(obj, dict) and obj:
            if all(isinstance(k, str) for k in obj):
                values = sorted(obj.keys())
        if values:
            out[f"{prefix}.{name}"] = values


def literal_params(func, mod) -> dict[str, list[str]]:
    """Accepted values for every Literal-annotated parameter of a function.

    Not every controlled vocabulary is an enum. fast-forward expresses its
    coordinate systems, orientations and layouts as lowercase string Literals on
    load_tracking's parameters, so without this they are unvalidatable - a doc
    could invent an orientation and nothing in the corpus would disagree.

    Annotations are resolved one parameter at a time rather than through
    typing.get_type_hints, which resolves the whole signature at once: these
    modules use `from __future__ import annotations` alongside TYPE_CHECKING-only
    imports, so the first unresolvable forward reference (FileLike) fails the
    call and takes every Literal in that signature down with it.
    """
    namespace = {**vars(typing), **vars(mod)}
    found: dict[str, list[str]] = {}
    try:
        params = inspect.signature(func).parameters
    except (ValueError, TypeError):
        return found
    for name, param in params.items():
        annotation = param.annotation
        if isinstance(annotation, str):
            try:
                annotation = eval(annotation, namespace)  # noqa: S307 - package's own namespace
            except Exception:
                continue
        if typing.get_origin(annotation) is typing.Literal:
            found[name] = sorted(str(arg) for arg in typing.get_args(annotation))
    return found


def collect_literals(mod, prefix: str, out: dict[str, dict[str, list[str]]]) -> None:
    for name in public_names(mod):
        try:
            obj = getattr(mod, name)
        except Exception:
            continue
        if not (inspect.isfunction(obj) or inspect.ismethod(obj)):
            continue
        found = literal_params(obj, mod)
        if found:
            out[f"{prefix}.{name}"] = found


def scrub_local_paths(text: str) -> str:
    """Replace machine-specific paths captured from default arguments.

    Some packages default a path argument to the working directory, so a raw
    signature bakes in whoever generated the file. That would churn the diff for
    every contributor and leak local directory layout into a public repo.
    """
    return text.replace(str(Path.cwd()), "<cwd>").replace(str(REPO), "<repo>")


def collect_signatures(mod, prefix: str, out: dict[str, str]) -> None:
    for name in public_names(mod):
        try:
            obj = getattr(mod, name)
        except Exception:
            continue
        if inspect.isfunction(obj) or inspect.ismethod(obj):
            try:
                out[f"{prefix}.{name}"] = scrub_local_paths(f"{name}{inspect.signature(obj)}")
            except (ValueError, TypeError):
                pass


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("package", help="importable package name, e.g. kloppy")
    ap.add_argument("--provider", required=True, help="football-docs provider slug")
    ap.add_argument("--extra-module", action="append", default=[], help="additional module to walk")
    args = ap.parse_args()

    root = importlib.import_module(args.package)
    version = getattr(root, "__version__", None)
    if version is None:
        try:
            from importlib.metadata import version as pkg_version

            version = pkg_version(args.package)
        except Exception:
            version = "unknown"

    modules: dict[str, list[str]] = {args.package: public_names(root)}
    enums: dict[str, list[str]] = {}
    signatures: dict[str, str] = {}
    value_lists: dict[str, list[str]] = {}
    literals_by_function: dict[str, dict[str, list[str]]] = {}
    classes: set[str] = set()
    class_constants: set[str] = set()

    collect_enums(root, enums)
    collect_signatures(root, args.package, signatures)
    collect_value_lists(root, args.package, value_lists)
    collect_literals(root, args.package, literals_by_function)

    targets = list(EXTRA_MODULES.get(args.package, [])) + list(args.extra_module)

    # Walk the whole package tree. Docs legitimately reference symbols that live
    # several levels down (floodlight.io.dfl.read_position_data_dat,
    # socceraction.data.statsbomb.StatsBombLoader), so a shallow walk produces
    # false "no such symbol" reports.
    if hasattr(root, "__path__"):
        for info in pkgutil.walk_packages(root.__path__, prefix=f"{args.package}."):
            if not any(part.startswith("_") for part in info.name.split(".")[1:]):
                targets.append(info.name)

    for mod_name in sorted(set(targets)):
        try:
            mod = importlib.import_module(mod_name)
        except Exception:
            # Optional extras (pandas/polars backends, provider SDKs) may be absent.
            continue
        modules[mod_name] = public_names(mod)
        collect_enums(mod, enums)
        collect_signatures(mod, mod_name, signatures)
        collect_value_lists(mod, mod_name, value_lists)
        collect_literals(mod, mod_name, literals_by_function)
        for name in public_names(mod):
            try:
                obj = getattr(mod, name)
            except Exception:
                continue
            if inspect.isclass(obj):
                classes.add(obj.__name__)
                # Class-level constants are documented too (e.g. floodlight's
                # MetabolicPowerModel.ECW_ES_CUTOFFS), so they count as real names.
                for attr in dir(obj):
                    if attr.isupper() and not attr.startswith("_"):
                        class_constants.add(attr)

    all_symbols = sorted({n for names in modules.values() for n in names} | classes | class_constants)

    # Union per parameter name. A value is legitimate if any function in the
    # package accepts it; which functions accept which is recorded separately,
    # because it varies (fast-forward's provider modules each accept the shared
    # coordinate systems plus their own native one, and nobody else's).
    literals: dict[str, list[str]] = {}
    for params in literals_by_function.values():
        for param, values in params.items():
            literals[param] = sorted(set(literals.get(param, [])) | set(values))

    truth = {
        "provider": args.provider,
        "kind": "python-package",
        "source": {
            "package": args.package,
            "version": str(version),
            "generated_at": datetime.date.today().isoformat(),
        },
        "modules": {k: v for k, v in sorted(modules.items())},
        "enums": {k: sorted(v) for k, v in sorted(enums.items())},
        "valueLists": {k: v for k, v in sorted(value_lists.items())},
        "literals": {k: v for k, v in sorted(literals.items())},
        "literalsByFunction": {
            k: {p: v for p, v in sorted(params.items())}
            for k, params in sorted(literals_by_function.items())
        },
        "classes": sorted(classes),
        "symbols": all_symbols,
        "signatures": {k: v for k, v in sorted(signatures.items())},
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / f"{args.provider}.json"
    out_path.write_text(json.dumps(truth, indent=2) + "\n")

    print(
        f"{args.provider}: {args.package} {version} -> {out_path.name} "
        f"({len(enums)} enums, {len(value_lists)} value-lists, {len(literals)} literal params, "
        f"{len(all_symbols)} symbols, {len(signatures)} signatures)"
    )


if __name__ == "__main__":
    main()
