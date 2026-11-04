---
source_url: https://docs.aiontheball.nl/versions/v1/authentication/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.558Z
---
# Authentication

Every request needs a bearer token. [Sign up](https://aiontheball.nl/register) and create one on the [API keys](https://aiontheball.nl/user/api-keys) page of your dashboard. A token is shown once, at creation. Accounts on a contract can also get one from [support@smart11.ai](mailto:support@smart11.ai).

## Header

```
GET /analyses/{id}/summary
Authorization: Bearer YOUR_API_TOKEN
Accept: application/json
```

A token inherits the permissions of the user account it belongs to, and reaches only the videos and analyses of that account. Store it in an environment variable or a secrets manager, keep it out of version control, and rotate it periodically.

## Error responses

| Status | Meaning                                              |
| ------ | ---------------------------------------------------- |
| 401    | Missing, malformed or invalid token                  |
| 403    | Valid token without access to this video or analysis |

```
{ "message": "Unauthenticated." }
```

These two errors always carry `message`, also on result endpoints. Other errors from result endpoints carry `detail`. See [Response format](https://docs.aiontheball.nl/versions/v1/#response-format).
