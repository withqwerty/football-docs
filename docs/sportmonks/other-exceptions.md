---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.848Z
---
# Other Exceptions

Whenever you make a request that is accepted and gives an error you can check the status code or name in the table below for more information. The description will show more details about how the error is created and what possible steps you can take to avoid these kind of errors.

| Status | Name                   | Description                                                                                                                                                                                                                |
| ------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `5003` | Pagination Limit       | The page you are requesting does not exist. Please change the \&page= attribute to another value.                                                                                                                          |
| `5005` | Rate limit             | You have reached the rate limit of your plan. This resets every hour. If you still hit the rate limit you can always add more API calls on my.sportmonks.com. Check [Rate Limit](/v3/api/rate-limit) for more information. |
| `5007` | Insufficient Resources | You do not have access to this resource in your current subscription. If you would like to add more resources please update your subscription or contact support.                                                          |
| `5002` | Insufficient Includes  | You do not have access to this include in your current subscription. If you would like to add more includes please update your subscription or contact support.                                                            |