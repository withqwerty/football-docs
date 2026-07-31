---
source_url: https://unravelsports.readthedocs.io/en/latest
source_type: crawled
upstream_version: 1.2.1
crawled_at: 2026-07-31T18:45:15.623Z
---
![unravelsports logo](https://github.com/UnravelSports/unravelsports.github.io/blob/main/imgs/unravelsports-5500x800.png?raw=true) [![UnravelSports](https://img.shields.io/badge/powered%20by-UnravelSports-orange.svg?style=flat&colorB=E6B611&colorA=C3C3C3) ](https://unravelsports.github.io/)[![License](https://img.shields.io/badge/license-Mozilla%20Public%20License%20v2.0-orange.svg?style=flat&colorA=C3C3C3&colorB=E20E6A)](https://www.tldrlegal.com/license/mozilla-public-license-2-0-mpl-2)

The **unravelsports** package aims to aid researchers, analysts and enthusiasts by providing intermediary steps in the complex process of converting raw sports data into meaningful information and actionable insights.

## Installation

```
pip install unravelsports
```

## Features

This package currently supports:

-   ⚽ 🏈 **Polars DataFrame Conversion** - Convert tracking data to Polars DataFrames
    
-   ⚽ 🏈 **Graph Neural Network** Training, Graph Conversion and Prediction
    
-   ⚽ **Pressing Intensity** - Compute pressing intensity metrics
    
-   ⚽ **Formation and Position Identification (EFPI)** - Elastic Formation and Position Identification
    

## Quick Links

-   [GitHub Repository](https://github.com/unravelsports/unravelsports)
    
-   [Report Issues](https://github.com/unravelsports/unravelsports/issues)
    
-   [UnravelSports Website](https://unravelsports.github.io/)
    

Getting Started

-   [Installation](https://unravelsports.readthedocs.io/en/getting_started/installation.html)
    -   [Basic Installation](https://unravelsports.readthedocs.io/en/getting_started/installation.html#basic-installation)
    -   [Requirements](https://unravelsports.readthedocs.io/en/getting_started/installation.html#requirements)
    -   [Optional Dependencies](https://unravelsports.readthedocs.io/en/getting_started/installation.html#optional-dependencies)
    -   [Development Installation](https://unravelsports.readthedocs.io/en/getting_started/installation.html#development-installation)
    -   [Getting Help](https://unravelsports.readthedocs.io/en/getting_started/installation.html#getting-help)
-   [Quick Start](https://unravelsports.readthedocs.io/en/getting_started/quickstart.html)
    -   [Soccer: Train a GNN](https://unravelsports.readthedocs.io/en/getting_started/quickstart.html#soccer-train-a-gnn)
    -   [American Football: BigDataBowl Data](https://unravelsports.readthedocs.io/en/getting_started/quickstart.html#american-football-bigdatabowl-data)
    -   [Soccer Analytics Models](https://unravelsports.readthedocs.io/en/getting_started/quickstart.html#soccer-analytics-models)
    -   [Next Steps](https://unravelsports.readthedocs.io/en/getting_started/quickstart.html#next-steps)
-   [Core Concepts](https://unravelsports.readthedocs.io/en/getting_started/concepts.html)
    -   [Data Flow](https://unravelsports.readthedocs.io/en/getting_started/concepts.html#data-flow)
    -   [Tracking Data](https://unravelsports.readthedocs.io/en/getting_started/concepts.html#tracking-data)
    -   [Polars DataFrames](https://unravelsports.readthedocs.io/en/getting_started/concepts.html#polars-dataframes)
    -   [Graph Neural Networks](https://unravelsports.readthedocs.io/en/getting_started/concepts.html#graph-neural-networks)
    -   [Labels and Graph IDs](https://unravelsports.readthedocs.io/en/getting_started/concepts.html#labels-and-graph-ids)
    -   [Soccer Analytics Models](https://unravelsports.readthedocs.io/en/getting_started/concepts.html#soccer-analytics-models)

Tutorials

-   [Soccer Graph Neural Networks](https://unravelsports.readthedocs.io/en/tutorials/soccer_gnn.html)
    -   [Interactive Notebooks](https://unravelsports.readthedocs.io/en/tutorials/soccer_gnn.html#interactive-notebooks)
    -   [Key Concepts](https://unravelsports.readthedocs.io/en/tutorials/soccer_gnn.html#key-concepts)
-   [Pressing Intensity](https://unravelsports.readthedocs.io/en/tutorials/pressing_intensity.html)
    -   [Interactive Notebook](https://unravelsports.readthedocs.io/en/tutorials/pressing_intensity.html#interactive-notebook)
    -   [Basic Usage](https://unravelsports.readthedocs.io/en/tutorials/pressing_intensity.html#basic-usage)
    -   [Parameters Explained](https://unravelsports.readthedocs.io/en/tutorials/pressing_intensity.html#parameters-explained)
    -   [Output Format](https://unravelsports.readthedocs.io/en/tutorials/pressing_intensity.html#output-format)
    -   [Visualization](https://unravelsports.readthedocs.io/en/tutorials/pressing_intensity.html#visualization)
-   [Formation Detection (EFPI)](https://unravelsports.readthedocs.io/en/tutorials/formation_detection.html)
    -   [Basic Usage](https://unravelsports.readthedocs.io/en/tutorials/formation_detection.html#basic-usage)
    -   [Parameters Explained](https://unravelsports.readthedocs.io/en/tutorials/formation_detection.html#parameters-explained)
    -   [Output Format](https://unravelsports.readthedocs.io/en/tutorials/formation_detection.html#output-format)
-   [American Football](https://unravelsports.readthedocs.io/en/tutorials/american_football.html)
    -   [Interactive Notebook](https://unravelsports.readthedocs.io/en/tutorials/american_football.html#interactive-notebook)
    -   [Data Format](https://unravelsports.readthedocs.io/en/tutorials/american_football.html#data-format)
    -   [Basic Usage](https://unravelsports.readthedocs.io/en/tutorials/american_football.html#basic-usage)
    -   [Data Availability](https://unravelsports.readthedocs.io/en/tutorials/american_football.html#data-availability)

API Reference

-   [Classifiers](https://unravelsports.readthedocs.io/en/api/classifiers.html)
    -   [PyTorch Geometric](https://unravelsports.readthedocs.io/en/api/classifiers.html#pytorch-geometric)
    -   [Spektral](https://unravelsports.readthedocs.io/en/api/classifiers.html#spektral)
        -   [`` `CrystalGraphClassifier` ``](https://unravelsports.readthedocs.io/en/api/classifiers.html#unravel.classifiers.CrystalGraphClassifier)
    -   [Usage Examples](https://unravelsports.readthedocs.io/en/api/classifiers.html#usage-examples)
        -   [PyTorch Geometric](https://unravelsports.readthedocs.io/en/api/classifiers.html#id1)
        -   [Spektral](https://unravelsports.readthedocs.io/en/api/classifiers.html#id2)
-   [Soccer](https://unravelsports.readthedocs.io/en/api/soccer.html)
    -   [Dataset](https://unravelsports.readthedocs.io/en/api/soccer/dataset.html)
        -   [`` `KloppyPolarsDataset` ``](https://unravelsports.readthedocs.io/en/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset)
    -   [Graphs](https://unravelsports.readthedocs.io/en/api/soccer/graphs.html)
        -   [`` `SoccerGraphConverter` ``](https://unravelsports.readthedocs.io/en/api/soccer/graphs.html#unravel.soccer.SoccerGraphConverter)
    -   [Models](https://unravelsports.readthedocs.io/en/api/soccer/models.html)
        -   [`` `PressingIntensity` ``](https://unravelsports.readthedocs.io/en/api/soccer/models.html#unravel.soccer.PressingIntensity)
        -   [`` `EFPI` ``](https://unravelsports.readthedocs.io/en/api/soccer/models.html#unravel.soccer.EFPI)
        -   [Formation Detection (EFPI)](https://unravelsports.readthedocs.io/en/api/soccer/models.html#formation-detection-efpi)
-   [American Football](https://unravelsports.readthedocs.io/en/api/american_football.html)
    -   [Dataset](https://unravelsports.readthedocs.io/en/api/american_football/dataset.html)
        -   [`` `BigDataBowlDataset` ``](https://unravelsports.readthedocs.io/en/api/american_football/dataset.html#unravel.american_football.BigDataBowlDataset)
    -   [Graphs](https://unravelsports.readthedocs.io/en/api/american_football/graphs.html)
        -   [`` `AmericanFootballGraphConverter` ``](https://unravelsports.readthedocs.io/en/api/american_football/graphs.html#unravel.american_football.AmericanFootballGraphConverter)
-   [Utils](https://unravelsports.readthedocs.io/en/api/utils.html)
    -   [Objects](https://unravelsports.readthedocs.io/en/api/utils/objects.html)
        -   [`` `GraphDataset` ``](https://unravelsports.readthedocs.io/en/api/utils/objects.html#unravel.utils.GraphDataset)
    -   [Features](https://unravelsports.readthedocs.io/en/api/utils/features.html)
        -   [`` `graph_feature()` ``](https://unravelsports.readthedocs.io/en/api/utils/features.html#unravel.utils.features.graph_feature)
        -   [`` `x_normed()` ``](https://unravelsports.readthedocs.io/en/api/utils/features.html#unravel.utils.features.x_normed)
        -   [`` `y_normed()` ``](https://unravelsports.readthedocs.io/en/api/utils/features.html#unravel.utils.features.y_normed)
        -   [`` `speeds_normed()` ``](https://unravelsports.readthedocs.io/en/api/utils/features.html#unravel.utils.features.speeds_normed)
        -   [`` `velocity_components_2d_normed()` ``](https://unravelsports.readthedocs.io/en/api/utils/features.html#unravel.utils.features.velocity_components_2d_normed)
    -   [Helpers](https://unravelsports.readthedocs.io/en/api/utils/helpers.html)
        -   [`` `dummy_labels()` ``](https://unravelsports.readthedocs.io/en/api/utils/helpers.html#unravel.utils.dummy_labels)
        -   [`` `add_dummy_label_column()` ``](https://unravelsports.readthedocs.io/en/api/utils/helpers.html#unravel.utils.add_dummy_label_column)
        -   [`` `dummy_graph_ids()` ``](https://unravelsports.readthedocs.io/en/api/utils/helpers.html#unravel.utils.dummy_graph_ids)
        -   [`` `add_graph_id_column()` ``](https://unravelsports.readthedocs.io/en/api/utils/helpers.html#unravel.utils.add_graph_id_column)
        -   [Adding Graph IDs](https://unravelsports.readthedocs.io/en/api/utils/helpers.html#adding-graph-ids)
    -   [unravel.utils.dummy_labels](https://unravelsports.readthedocs.io/en/api/generated/unravel.utils.dummy_labels.html)
        -   [`` `dummy_labels()` ``](https://unravelsports.readthedocs.io/en/api/generated/unravel.utils.dummy_labels.html#unravel.utils.dummy_labels)
    -   [unravel.utils.dummy_graph_ids](https://unravelsports.readthedocs.io/en/api/generated/unravel.utils.dummy_graph_ids.html)
        -   [`` `dummy_graph_ids()` ``](https://unravelsports.readthedocs.io/en/api/generated/unravel.utils.dummy_graph_ids.html#unravel.utils.dummy_graph_ids)
    -   [unravel.utils.add_dummy_label_column](https://unravelsports.readthedocs.io/en/api/generated/unravel.utils.add_dummy_label_column.html)
        -   [`` `add_dummy_label_column()` ``](https://unravelsports.readthedocs.io/en/api/generated/unravel.utils.add_dummy_label_column.html#unravel.utils.add_dummy_label_column)
    -   [unravel.utils.add_graph_id_column](https://unravelsports.readthedocs.io/en/api/generated/unravel.utils.add_graph_id_column.html)
        -   [`` `add_graph_id_column()` ``](https://unravelsports.readthedocs.io/en/api/generated/unravel.utils.add_graph_id_column.html#unravel.utils.add_graph_id_column)

## Indices and tables

-   [Index](https://unravelsports.readthedocs.io/en/genindex.html)
    
-   [Module Index](https://unravelsports.readthedocs.io/en/py-modindex.html)
    
-   [Search Page](https://unravelsports.readthedocs.io/en/search.html)