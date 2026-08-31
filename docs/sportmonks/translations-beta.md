---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.848Z
---
# Translations (beta)

Welcome to the API Translations documentation! Here, we'll explore how you can enhance the user experience of your application by incorporating localised content using Sportmonks Football API. By utilising powerful translation capabilities, you can provide content in your preferred language: increasing the user experience of your football application. Let’s dive in on what can be translated and how it works.

### Which API fields are translated?

Our Football API 3.0 now supports translations for entities with textual fields (e.g names). Currently, you can find translations for the below list of entities. Please keep in mind that we are still translating and we are working on enriching the list.

| Entities  |
| --------- |
| city      |
| continent |
| country   |
| fixture   |
| group     |
| league    |
| player    |
| stage     |
| state     |
| team      |
| type      |
| venue     |

### Which languages are supported?

The high-anticipated translations are now available for selected languages:

| Languague        | Shortcode |
| ---------------- | --------- |
| Chinese          | `zh`      |
| Japanese         | `ja`      |
| Russian          | `ru`      |
| Persian          | `fa`      |
| Arabic           | `ar`      |
| Greek            | `el`      |
| Italian          | `it`      |
| Spanish          | `es`      |
| French           | `fr`      |
| Hungarian        | `hu`      |
| German           | `de`      |
| Ukrainian        | `ua`      |
| Central Kurdish  | `ckb`     |
| Kurdish Kurmanji | `kmr`     |

{% hint style="info" %}
**Please note:** The feature is still in beta; other languages will be added soon. Spanish, Portuguese and French are at the top of our backlog. Interested in another language? [Let us know](https://www.sportmonks.com/contact-support/).
{% endhint %}

### How does it work?

Integrating translations is seamless. Utilise the locale parameter with the shortcode of the desired country to fetch content in the preferred language. The Football API will respond with translated data, efficiently presenting relevant information to your users. For example, from the livescores endpoint, you want to display the team names in Arabic:

{% tabs %}
{% tab title="Example request" %}

```javascript
https://api.sportmonks.com/v3/football/livescores/inplay?api_token=YOURTOKEN&locale=ar
```

{% endtab %}

{% tab title="Example response" %}

```javascript
{
  "data": [
    {
      "id": 18881507,
      "sport_id": 1,
      "league_id": 24,
      "season_id": 21931,
      "stage_id": 77465029,
      "group_id": null,
      "aggregate_id": null,
      "round_id": null,
      "state_id": 11,
      "venue_id": null,
      "name": "إبسويش واندرز ضد هيستون",
      "starting_at": "2023-08-08 18:45:00",
      "result_info": null,
      "leg": "1/1",
      "details": null,
      "length": 90,
      "placeholder": false,
      "has_odds": false,
      "starting_at_timestamp": 1691520300
    },
    {
      "id": 18875447,
      "sport_id": 1,
      "league_id": 612,
      "season_id": 21861,
      "stage_id": 77464703,
      "group_id": 249133,
      "aggregate_id": null,
      "round_id": 310453,
      "state_id": 22,
      "venue_id": null,
      "name": "تشيرنيهيف ضد إنهوليتس.",
      "starting_at": "2023-08-07 09:00:00",
      "result_info": null,
      "leg": "1/1",
      "details": null,
      "length": 90,
      "placeholder": false,
      "has_odds": true,
      "starting_at_timestamp": 1691398800
    },
///and more!
```

{% endtab %}
{% endtabs %}

{% hint style="warning" %}
Important to note: if there is no translation available, the API will fall back on the default supported language: English
{% endhint %}

### Do you have any suggestions or improvements?

As mentioned, the translations are still in beta. You can contribute to the product by adding suggestions or improvements via [my.sportmonks.](https://sportmonks.lt.acemlnb.com/Prod/link-tracker?notrack=1\&redirectUrl=aHR0cHMlM0ElMkYlMkZteS5zcG9ydG1vbmtzLmNvbQ==\&sig=HyPNYt5MzisXnDSq9gjTwBgz23aCU4UDjUrza1JJx8Gt\&iat=1691155826\&a=%7C%7C66404002%7C%7C\&account=sportmonks%2Eactivehosted%2Ecom\&email=aRCZZu5IQcsf4UXgq8zKhm%2FZrS3T1eV6Zlb52OBMqjQMtJ6jyQ%3D%3D%3AhiAm5eGK6aNqinxudkZx9JJmQKrXiybO\&s=11b019a0d9e1e46e2283697cd5754692\&i=695A854A0A5377)

{% hint style="info" %}
Try it out, share your feedback, and contribute to its refinement on [my.sportmonks](https://sportmonks.lt.acemlnb.com/Prod/link-tracker?notrack=1\&redirectUrl=aHR0cHMlM0ElMkYlMkZteS5zcG9ydG1vbmtzLmNvbQ==\&sig=HyPNYt5MzisXnDSq9gjTwBgz23aCU4UDjUrza1JJx8Gt\&iat=1691155826\&a=%7C%7C66404002%7C%7C\&account=sportmonks%2Eactivehosted%2Ecom\&email=aRCZZu5IQcsf4UXgq8zKhm%2FZrS3T1eV6Zlb52OBMqjQMtJ6jyQ%3D%3D%3AhiAm5eGK6aNqinxudkZx9JJmQKrXiybO\&s=11b019a0d9e1e46e2283697cd5754692\&i=695A854A0A5377)
{% endhint %}

<br>