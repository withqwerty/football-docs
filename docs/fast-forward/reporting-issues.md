---
source_url: https://fast-forward.readthedocs.io/en/latest/reporting-issues/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.332Z
---
Found a bug or have a feature request? We'd love to hear from you.

## Bug Reports

File bug reports on GitHub Issues:

**[https://github.com/UnravelSports/fast-forward/issues](https://github.com/UnravelSports/fast-forward/issues)**

### What to Include

Please include the following in your bug report:

1.  **fast-forward version**
    
    ```
    import fastforward
    print(fastforward.__version__)
    ```
    
2.  **Python version**
    
    ```
    import sys
    print(sys.version)
    ```
    
3.  **Operating system** (macOS, Linux, Windows)
    
4.  **Provider** you're using (e.g., SecondSpectrum, Tracab, etc.)
    
5.  **Full error traceback**: copy the complete error message
    
6.  **Minimal reproducible example**: the smallest code that triggers the bug
    
7.  **Anonymized data sample** (if possible): the first 5-10 lines of your tracking/metadata files with sensitive data removed
    

### Example Bug Report

```
**fast-forward version:** 0.1.0
**Python version:** 3.12.1
**OS:** macOS 14.2

**Description:**
Loading Tracab data with `layout="wide"` raises a KeyError.

**Code to reproduce:**
```python
from fastforward import tracab

dataset = tracab.load_tracking(
    raw_data="tracking.dat",
    meta_data="metadata.xml",
    layout="wide",
)
```

**Error:**

```
KeyError: 'player_123_x'
...
```

\`\`\`

## Feature Requests

For feature requests, open an issue with the `enhancement` label and describe:

-   What you'd like to see
-   Why it would be useful
-   Any relevant examples or references

## Schema Mismatch Errors

If you see a `SchemaMismatch` error, it means the data file doesn't match the expected format. This is especially helpful to report. Please include:

-   The error message (it will contain a link to file an issue)
-   The provider you're using
-   An anonymized sample of the data that caused the error