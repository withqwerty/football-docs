---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.845Z
---
# Authentication

All of our APIs require authentication. You can create API tokens in MySportmonks.

To make our first request, we’ll need to get authenticated first.

We offer two different options for passing your API token. You are free to choose between the authentication methods. You can also use both of them at the same time. Please note that both methods count towards the same rate-limiting.

* **Authenticate using a query parameter**\
  You can pass your API token by passing 'api\_token' in your request parameters, like so:

```http
https://api.sportmonks.com/api/v3/football/livescores?api_token=YOUR_TOKEN
```

* **Authenticate using a request header**\
  You can also pass your token via an 'Authorisation' header, like so:

<table><thead><tr><th>Header</th><th>Value</th></tr></thead><tbody><tr><td>Authorization</td><td><pre><code>YOUR_TOKEN
</code></pre></td></tr></tbody></table>

### How to create a new API Token in MySportmonks

You can obtain and manage your API token in [**MySportmonks.**](https://my.sportmonks.com/api/tokens) The API token is intended for your eyes only and, as such, should be stored securely. Our tokens have no expiration date and will remain valid until you manually delete them yourself.

Follow these simple steps to generate your API token:

1. Log in to[ MySportmonks](https://my.sportmonks.com/). \
   If you do not have an account, you can create one using this link: <https://my.sportmonks.com/register>
2. Go to the API section in your dashboard. A dropdown will unfold; select 'Tokens'.
3. Enter a name for your new token in the 'Token name' field.
4. Click the "Create" button.\
   \ <img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXd65aUUZEfVEXzxuKQrJQGRVyCjoDVFFIlo1LlHGciEFbAdaeU8nU7FY0zZg17RYOC7vs2IKEVCOVnkeErt0qoP889FtsxB1cpghRdzdKe_GxTEWFIG3lxaquNaQeczQ1hus1VCpg?key=rJzgPtdIjMzeOcMdJVVi4g" alt="" data-size="original">
5. Your new API token will be generated instantly and ready to use!

Note: Be sure to store your token securely after it has been created. For security reasons, it will not be shown again or stored in MySportmonks.

### Error codes

When making a request, a code response will always be returned. The following are all possible HTTP response codes for any request made to the API:

| Code                           | Description                                                                                                                                                                                                                                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **200: OK**                    | Request succeeded                                                                                                                                                                                                                                               |
| **400: Bad Request**           | It seems that some part of the request is malformed. The exact reason is returned in the response.                                                                                                                                                              |
| **401: Unauthorized**          | The request is not authenticated.                                                                                                                                                                                                                               |
| **403: Forbidden**             | Not authorized. Indicates you're attempting to access a feed that is not accessible from your plan.                                                                                                                                                             |
| **429: Too Many Requests**     | Too many requests. In order to make the API as responsive as possible, you have an hourly request limit. The limit for your current subscription can be found in any successful response. Check the "meta" section to find out your limit.                      |
| **500: Internal Server Error** | <p>An internal error has occurred and has been logged for further inspection. Please email support if you are receiving this error.<br><br>Check our <a href="https://status.sportmonks.com/">status page</a> to see if we are aware of any possible issues</p> |

{% hint style="danger" %}
Directly integrating an API into the frontend of a web application can be risky as it can expose sensitive information, such as your Sportmonks API token, to potential security breaches.
{% endhint %}

To avoid this, it is best practice to use a middleware, such as a backend or proxy server, to handle all communication between the frontend and the API. This middleware acts as an intermediary, making sure your API tokens are stored securely and not exposed to users. Using middleware makes it much harder for malicious actors to access sensitive information, keeping your application more secure overall.