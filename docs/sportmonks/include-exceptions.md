---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.848Z
---
# Include Exceptions

Whenever you make a request that is accepted and gives an error based on **includes** you can check the status code or name in the table below for more information. The description will show more details about how the error is created and what possible steps you can take to avoid these kind of errors.

| Status | Name                  | Description                                                                                                                                                                                                                    |
| ------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `5000` | Include not allowed   | This include is not allowed on this entity, try removing the include from the request. Check the list of includes that are allowed for this [endpoint](/v3/endpoints-and-entities/endpoints).                                  |
| `5001` | Include not found     | This include is not available in the API, please remove the inlcude from the request. Check the docs for the requested entity to check all the available includes.                                                             |
| `5008` | Include depth         | You have reached the limit on [nested includes](/v3/tutorials-and-guides/tutorials/enrich-your-response/nested-includes). Try removing the last nested include or try other endpoints to reduce the amount of nested includes. |
| `5013` | Include not available | This include is not available on the requested entity. Check the docs for the requested entity to check all the available includes.                                                                                            |