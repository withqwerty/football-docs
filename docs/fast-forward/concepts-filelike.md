---
source_url: https://fast-forward.readthedocs.io/en/latest/concepts/filelike/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.332Z
---
All `load_tracking()` functions accept `FileLike` parameters for their input files. `FileLike` is a flexible type from [kloppy](https://kloppy.pysport.org/reference/io/#kloppy.io.FileLike) that lets you pass data in several ways:

```
FileLike = Union[FileOrPath, Source]
```

## Accepted Input Types

| Type | Example |
| --- | --- |
| File path (string) | `"tracking.jsonl"` |
| File path (Path) | `Path("data/meta.xml")` |
| URL | `"https://example.com/tracking.jsonl"` |
| S3 path | `"s3://bucket/tracking.jsonl"` |
| Raw bytes | `b'{"FrameId": 1, ...}'` |
| Binary stream | `open("tracking.jsonl", "rb")` |
| Inline data | `'<MatchParameters>...</MatchParameters>'` (XML/JSON strings) |

Compressed files (`.gz`, `.xz`, `.bz2`) are automatically decompressed.

## Usage

Every provider's `load_tracking()` function uses `FileLike` for its data inputs:

```
from fastforward import secondspectrum

# From file paths
dataset = secondspectrum.load_tracking("tracking.jsonl", "meta.xml")

# From Path objects
from pathlib import Path
dataset = secondspectrum.load_tracking(
    Path("data") / "tracking.jsonl",
    Path("data") / "meta.xml",
)

# From URLs
dataset = secondspectrum.load_tracking(
    "https://example.com/tracking.jsonl",
    "https://example.com/meta.xml",
)

# From bytes
with open("tracking.jsonl", "rb") as f:
    raw_bytes = f.read()
dataset = secondspectrum.load_tracking(raw_bytes, "meta.xml")
```

For the full reference, see the [kloppy IO documentation](https://kloppy.pysport.org/reference/io/#kloppy.io.FileLike).