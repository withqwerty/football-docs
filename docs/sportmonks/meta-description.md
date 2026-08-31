---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.848Z
---
# Meta description

Every request has a meta description. Let's take a look at a quick example.

<details>

<summary>Response</summary>

```javascript

  "subscription": [
    {
      "meta": {
        "current_timestamp": 1773237412,
        "next_billing_cycle": "2026-03-23T11:30:11 UTC"
      },
      "plans": [
        {
          "plan": "Euro Club Tournaments - Trialing until 2026-03-23 11:30:11",
          "sport": "Football",
          "category": "All-in"
        },
        {
          "plan": "Starter",
          "sport": "Football",
          "category": "Advanced"
        }
      ],
      "add_ons": [],
      "widgets": [],
      "bundles": []
    }
  ],
  "rate_limit": {
    "resets_in_seconds": 3600,
    "remaining": 2499,
    "requested_entity": "League"
  },
  "timezone": "UTC"
}
```

</details>

It's easy to stay on top of your subscription details. You can find out what plan(s), add-ons and widgets you have, and see the timezone you're using. You'll also know when your trial ends (if you have one) and when your subscription expires. Additionally, you can see information about your rate limit. This way, you have all the information you need to manage your subscription.

In the *rate\_limit* object, the following information is available:

* *requested\_entity:* The requested entity for the current request&#x20;
* *remaining:* The number of API calls remaining for the requested entity&#x20;
* *resets\_in\_seconds:* amount of seconds left before the rate limit resets for the requested entity

{% hint style="info" %}
Check how our rate limit works in our [rate limit section.](/v3/api/rate-limit)
{% endhint %}