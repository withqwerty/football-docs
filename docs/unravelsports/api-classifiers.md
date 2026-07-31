---
source_url: https://unravelsports.readthedocs.io/en/latest/api/classifiers.html
source_type: crawled
upstream_version: 1.2.1
crawled_at: 2026-07-31T18:45:15.624Z
---
Graph Neural Network classifiers for sports analytics.

The classifiers module provides pre-built Graph Neural Network architectures optimized for sports tracking data. These models can be used with both PyTorch Geometric and Spektral (deprecated).

## PyTorch Geometric

_`class`_ `unravel.classifiers.``PyGLightningCrystalGraphClassifier`[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/classifiers/crystal_graph_pyg.html#PyGLightningCrystalGraphClassifier)

Bases: `` `LightningModule` ``

PyTorch Lightning wrapper for Crystal Graph Classifier with training loop.

This class wraps `` `PyGCrystalGraphClassifier` `` with PyTorch Lightning functionality, providing automatic training loops, logging, checkpointing, and metrics tracking for binary classification tasks.

The model includes: - Automatic training/validation/test loops - AUROC and accuracy metric tracking - Learning rate scheduling with ReduceLROnPlateau - Automatic checkpointing and logging - Easy prediction interface

Parameters:

-   **n_layers** ([`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"), _optional_) – Number of CGConv layers. Defaults to 3.
    
-   **channels** ([`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"), _optional_) – Hidden dimension size. Defaults to 128.
    
-   **drop_out** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – Dropout probability. Defaults to 0.5.
    
-   **n_out** ([`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"), _optional_) – Number of output features. Defaults to 1.
    
-   **lr** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – Learning rate for Adam optimizer. Defaults to 0.001.
    
-   **weight_decay** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – L2 penalty coefficient. Defaults to 0.0.
    

Raises:

[**ImportError**](https://docs.python.org/3/library/exceptions.html#ImportError "(in Python v3.14)") – If PyTorch Lightning or torchmetrics is not installed.

`model`

The underlying GNN model.

Type:

`` `PyGCrystalGraphClassifier` ``

`criterion`

Binary cross-entropy loss function.

Type:

[`` `torch.nn.BCELoss` ``](https://docs.pytorch.org/docs/stable/generated/torch.nn.BCELoss.html#torch.nn.BCELoss "(in PyTorch v2.9)")

`train_auc`

Training AUROC metric.

Type:

`` `AUROC` ``

`train_acc`

Training accuracy metric.

Type:

`` `Accuracy` ``

`val_auc`

Validation AUROC metric.

Type:

`` `AUROC` ``

`val_acc`

Validation accuracy metric.

Type:

`` `Accuracy` ``

`test_auc`

Test AUROC metric.

Type:

`` `AUROC` ``

`test_acc`

Test accuracy metric.

Type:

`` `Accuracy` ``

Example

```
>>> from unravel.classifiers import PyGLightningCrystalGraphClassifier
>>> import pytorch_lightning as pyl
>>> from torch_geometric.loader import DataLoader
>>>
>>> # Initialize model
>>> model = PyGLightningCrystalGraphClassifier(
...     n_layers=3,
...     channels=128,
...     lr=0.001
... )
>>>
>>> # Train
>>> trainer = pyl.Trainer(max_epochs=50, accelerator="auto")
>>> trainer.fit(model, train_loader, val_loader)
>>>
>>> # Test
>>> trainer.test(model, test_loader)
>>>
>>> # Predict
>>> predictions = trainer.predict(model, pred_loader)
>>>
>>> # Save/load checkpoint
>>> trainer.save_checkpoint("model.ckpt")
>>> model = PyGLightningCrystalGraphClassifier.load_from_checkpoint("model.ckpt")
```

Note

This model uses binary cross-entropy loss and is designed for binary classification tasks. For multi-class or regression tasks, you may need to modify the loss function and output activation.

`__init__`(_`n_layers``=``3`_, _`channels``=``128`_, _`drop_out``=``0.5`_, _`n_out``=``1`_, _`lr``=``0.001`_, _`weight_decay``=``0.0`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/classifiers/crystal_graph_pyg.html#PyGLightningCrystalGraphClassifier.__init__)

`forward`(_`x`_, _`edge_index`_, _`edge_attr`_, _`batch`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/classifiers/crystal_graph_pyg.html#PyGLightningCrystalGraphClassifier.forward)

Forward pass through the model.

Parameters:

-   **x** ([`` `torch.Tensor` ``](https://docs.pytorch.org/docs/stable/tensors.html#torch.Tensor "(in PyTorch v2.9)")) – Node features.
    
-   **edge_index** (`` `torch.LongTensor` ``) – Edge indices.
    
-   **edge_attr** ([`` `torch.Tensor` ``](https://docs.pytorch.org/docs/stable/tensors.html#torch.Tensor "(in PyTorch v2.9)")) – Edge features.
    
-   **batch** (`` `torch.LongTensor` ``) – Batch vector.
    

Returns:

Predictions with shape \[batch_size\].

Return type:

[torch.Tensor](https://docs.pytorch.org/docs/stable/tensors.html#torch.Tensor "(in PyTorch v2.9)")

`training_step`(_`batch`_, _`batch_idx`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/classifiers/crystal_graph_pyg.html#PyGLightningCrystalGraphClassifier.training_step)

Training step executed for each batch.

Parameters:

-   **batch** – Batch of graph data from DataLoader.
    
-   **batch_idx** ([`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)")) – Index of the current batch.
    

Returns:

Training loss for this batch.

Return type:

[torch.Tensor](https://docs.pytorch.org/docs/stable/tensors.html#torch.Tensor "(in PyTorch v2.9)")

`validation_step`(_`batch`_, _`batch_idx`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/classifiers/crystal_graph_pyg.html#PyGLightningCrystalGraphClassifier.validation_step)

Validation step executed for each batch.

Parameters:

-   **batch** – Batch of graph data from DataLoader.
    
-   **batch_idx** ([`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)")) – Index of the current batch.
    

Returns:

Validation loss for this batch.

Return type:

[torch.Tensor](https://docs.pytorch.org/docs/stable/tensors.html#torch.Tensor "(in PyTorch v2.9)")

`test_step`(_`batch`_, _`batch_idx`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/classifiers/crystal_graph_pyg.html#PyGLightningCrystalGraphClassifier.test_step)

Test step for model evaluation.

Computes test loss and metrics (AUROC and accuracy) for the given batch.

Parameters:

-   **batch** – Batch of graph data from DataLoader.
    
-   **batch_idx** ([`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)")) – Index of the current batch.
    

Returns:

Test loss for this batch.

Return type:

[torch.Tensor](https://docs.pytorch.org/docs/stable/tensors.html#torch.Tensor "(in PyTorch v2.9)")

`predict_step`(_`batch`_, _`batch_idx`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/classifiers/crystal_graph_pyg.html#PyGLightningCrystalGraphClassifier.predict_step)

Prediction step for inference.

Returns predicted probabilities for the given batch without computing loss.

Parameters:

-   **batch** – Batch of graph data from DataLoader.
    
-   **batch_idx** ([`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)")) – Index of the current batch.
    

Returns:

Predicted probabilities with shape \[batch_size\].

Values are in range \[0, 1\].

Return type:

[torch.Tensor](https://docs.pytorch.org/docs/stable/tensors.html#torch.Tensor "(in PyTorch v2.9)")

Example

```
>>> predictions = trainer.predict(model, pred_loader)
>>> # predictions is a list of tensors, one per batch
>>> all_preds = torch.cat(predictions)
```

`configure_optimizers`()[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/classifiers/crystal_graph_pyg.html#PyGLightningCrystalGraphClassifier.configure_optimizers)

Configure optimizer and learning rate scheduler.

Uses Adam optimizer with learning rate scheduling via ReduceLROnPlateau. The learning rate is reduced by a factor of 0.5 when validation loss plateaus for 3 epochs.

Returns:

Dictionary containing:

-   ’optimizer’: Adam optimizer instance
    
-   ’lr_scheduler’: Dict with scheduler and monitoring configuration
    

Return type:

[dict](https://docs.python.org/3/library/stdtypes.html#dict "(in Python v3.14)")

Note

The learning rate scheduler monitors ‘val_loss’ and reduces the learning rate when validation loss stops improving.

## Spektral

_`class`_ `unravel.classifiers.``CrystalGraphClassifier`[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/classifiers/crystal_graph.html#CrystalGraphClassifier)

Bases: `` `Model` ``

Default Graph Classifier with CrystalConvolution layers as presented in Sahasrabudhe & Bekkers (2023)

`__init__`(_`n_layers``=``3`_, _`channels``=``128`_, _`drop_out``=``0.5`_, _`n_out``=``1`_, _`**``kwargs`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/classifiers/crystal_graph.html#CrystalGraphClassifier.__init__)

Parameters:

-   **n_layers** ([_int_](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"))
    
-   **channels** ([_int_](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"))
    
-   **drop_out** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **n_out** ([_int_](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"))
    

`call`(_`inputs`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/classifiers/crystal_graph.html#CrystalGraphClassifier.call)

## Usage Examples

### PyTorch Geometric

```
from unravel.classifiers import PyGLightningCrystalGraphClassifier
import pytorch_lightning as pyl
from torch_geometric.loader import DataLoader

# Initialize model
model = PyGLightningCrystalGraphClassifier()

# Train
trainer = pyl.Trainer(max_epochs=50)
trainer.fit(model, train_loader, val_loader)

# Test
trainer.test(model, test_loader)
```

### Spektral

```
from unravel.classifiers import CrystalGraphClassifier

from tensorflow.keras.metrics import AUC, BinaryAccuracy
from tensorflow.keras.losses import BinaryCrossentropy
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping

model = CrystalGraphClassifier()

model.compile(
   loss=BinaryCrossentropy(), optimizer=Adam(), metrics=[AUC(), BinaryAccuracy()]
)

model.fit(
   loader_tr.load(),
   steps_per_epoch=loader_tr.steps_per_epoch,
   epochs=5,
   use_multiprocessing=True,
   validation_data=loader_va.load(),
   callbacks=[EarlyStopping(monitor="loss", patience=5, restore_best_weights=True)],
)

from tensorflow.keras.models import load_model

model_path = "models/my-first-graph-classifier"
model.save(model_path)
loaded_model = load_model(model_path)

loader_te = DisjointLoader(test, epochs=1, shuffle=False, batch_size=batch_size)
results = model.evaluate(loader_te.load())
```