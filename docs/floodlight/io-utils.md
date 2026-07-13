---
source_url: https://floodlight.readthedocs.io/en/latest/modules/io/utils.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.368Z
---
`floodlight.io.utils.``download_from_url`(_`path`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/utils.html#download_from_url)[](https://floodlight.readthedocs.io/en/latest/modules/io/utils.html#floodlight.io.utils.download_from_url "Link to this definition")

Downloads file from URL.

Parameters:

**path** (_str_) – URL path to download data from

Returns:

**data**

Return type:

AnyStr

Extracts the content of an archive to disk.

Parameters:

-   **filepath** (_str_) – Path to file.
    
-   **target** (_str_) – Target to extract files to.
    
-   **archive_type** (_“zip”, optional_) – Type of archive, like zip, rar, gzip, etc.
    

Return type:

`` `None` ``

`floodlight.io.utils.``get_and_convert`(_`dic`_, _`key`_, _`value_type`_, _`default``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/utils.html#get_and_convert)[](https://floodlight.readthedocs.io/en/latest/modules/io/utils.html#floodlight.io.utils.get_and_convert "Link to this definition")

Performs dictionary get and type conversion simultaneously.

Parameters:

-   **dic** (_dict_) – Dictionary to be queried.
    
-   **key** (_Any_) – Key to be looked up.
    
-   **value_type** (_type_) – Desired output type the value should be cast into.
    
-   **default** (_Any, optional_) – Return value if key is not in dic, defaults to None.
    

Returns:

**value** – Returns the value for key if key is in dic, else default. Tries type conversion to type(value) = value_type. If type conversion fails, e.g. by trying to force something like float(None) due to a missing dic entry, value is returned in its original data type.

Return type:

value_type