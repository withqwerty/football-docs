---
source_url: https://floodlight.readthedocs.io/en/latest/modules/io/io.html
source_type: crawled
upstream_version:
crawled_at: 2026-08-11T08:29:26.560Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

Collection of file parsing functionalities for different data providers as well as loaders for public datasets.

Submodule Reference

-   [floodlight.io.datasets](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html)
-   [floodlight.io.dfl](https://floodlight.readthedocs.io/en/latest/modules/io/dfl.html)
-   [floodlight.io.kinexon](https://floodlight.readthedocs.io/en/latest/modules/io/kinexon.html)
-   [floodlight.io.opta](https://floodlight.readthedocs.io/en/latest/modules/io/opta.html)
-   [floodlight.io.secondspectrum](https://floodlight.readthedocs.io/en/latest/modules/io/secondspectrum.html)
-   [floodlight.io.skillcorner](https://floodlight.readthedocs.io/en/latest/modules/io/skillcorner.html)
-   [floodlight.io.sportradar](https://floodlight.readthedocs.io/en/latest/modules/io/sportradar.html)
-   [floodlight.io.statsbomb](https://floodlight.readthedocs.io/en/latest/modules/io/statsbomb.html)
-   [floodlight.io.statsperform](https://floodlight.readthedocs.io/en/latest/modules/io/statsperform.html)
-   [floodlight.io.tracab](https://floodlight.readthedocs.io/en/latest/modules/io/tracab.html)
-   [floodlight.io.utils](https://floodlight.readthedocs.io/en/latest/modules/io/utils.html)

Datasets

|  |  |
| --- | --- |
| `EIGDDataset` | This dataset loads the EIGD-H data from the A Unified Taxonomy and Multimodal Dataset for Events in Invasion Games paper. |
| `IDSSEDataset` | This dataset loads the accompanying data set from the An integrated dataset of spatiotemporal and event data in elite soccer paper. |
| `StatsBombOpenDataset` | This dataset loads the StatsBomb open data provided by the official data repository. |
| `ToyDataset` | This dataset loads synthetic data for a (very) short artificial football match. |

DFL

Kinexon

Opta

|  |  |
| --- | --- |
| `read_event_data_xml` | Parse Opta's f24 feed (containing match events) and extract event data and pitch information. |
| `get_opta_feedtype` | Tries to extract the feed type from Opta's XML feed. |

Second Spectrum

|  |  |
| --- | --- |
| `read_position_data_jsonl` | Parse Second Spectrum files and extract position data, possession and ballstatus codes, as well as pitch information. |
| `read_event_data_jsonl` | Parse Second Spectrum's Insight file (containing match events) and extract event data and pitch information. |
| `read_teamsheets_from_meta_json` | Parses the Second Spectrum meta.json-file and creates respective teamsheets for the home and the away team. |

Skillcorner

Sportradar

|  |  |
| --- | --- |
| `read_event_data_json` | Parses the Sportradar timeline files in json format and extracts the event data. |

StatsBomb

StatsPerform

|  |  |
| --- | --- |
| `read_position_data_txt` | Parses a StatsPerform TXT file and extracts position data and teamsheets. |
| `read_open_position_data_csv` | Parses an open StatsPerform CSV file and extract position data and possession codes as well as teamsheets and pitch information. |
| `read_position_data_from_url` | Reads a URL from the StatsPerform API (StatsEdgeViewer) containing a position data TXT file and extracts position data and teamsheets. |
| `read_event_data_xml` | Parses a StatsPerform XML file and extracts event data and pitch information. |
| `read_open_event_data_csv` | Parses an open StatsPerform Match Event CSV file and extracts the event data and teamsheets. |
| `read_event_data_from_url` | Reads a URL containing a StatsPerform events CSV file and extracts the stored event data, pitch information, and teamsheets. |
| `read_teamsheets_from_position_data_txt` | Parses the StatsPerform position file and returns two simple Teamsheet-objects containing only two columns "player" and "jID" for the home and the away team. |
| `read_teamsheets_from_event_data_xml` | Parses the StatsPerform event file and returns two Teamsheet-objects with detailed player information for the home and the away team. |
| `read_teamsheets_from_open_data_csv` | Parses the entire open StatsPerform position data CSV file for unique jIDs (jerseynumbers) and creates teamsheets for both teams. |

Tracab (ChyronHego)

|  |  |
| --- | --- |
| `read_position_data_dat` | Parse TRACAB .dat-files (ASCII) and metadata (xml or json) and extract position data, possession and ballstatus codes, teamsheets as well as pitch information. |
| `read_teamsheets_from_dat` | Parses the entire TRACAB .dat file for unique jIDs (jerseynumbers) and creates respective teamsheets for the home and the away team. |
| `read_teamsheets_from_meta_json` | Reads TRACAB's metadata file (json format) and creates respective teamsheets for the home and the away team. |