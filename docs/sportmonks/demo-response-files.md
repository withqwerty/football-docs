---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.849Z
---
# Demo response files

Alongside our [tutorials ](https://docs.sportmonks.com/football/tutorials-and-guides/tutorials)and [how-to guides](https://docs.sportmonks.com/football/tutorials-and-guides/guides), we provide example JSON responses you can download directly. These sample files show you exactly what our endpoints return so you can:

* Understand data structures before coding
* Mock endpoints for testing and development
* Plan database models and API integrations

> 💡 Each example request below links to a real API call. Replace `YOUR_TOKEN` with your actual API token to test it yourself.

## **Fixtures**

### **Match and player statistics, lineups and events**

#### **EPL Match Week 10, 2025/2026 season:** Nottingham Forest **- Manchester United**&#x20;

Request with the all match and player statistics, events and full line-up.

```http
https://api.sportmonks.com/v3/football/fixtures/19427552?api_token=YOUR_TOKEN&include=statistics.type;lineups.details.type;events.type
```

{% file src="/files/GoLyTsfDHjuH0rJn4org" %}

{% hint style="danger" %}
Including `.type` is not recommended as an include on any endpoint. Types are used throughout the entire API. We recommend retrieving all types from the types endpoint and storing them in your database or other data structure. Only include the type if no other option is available or when testing the API.
{% endhint %}

### **Pre-match odds from bet365**

#### **La Liga Match Week 10, 2025/2026 season: Real Madrid  - Barcelona (El Classico)**

Request to retrieve pre-match odds for the first El Classico of the 2025/2026 season.&#x20;

```http
https://api.sportmonks.com/v3/football/fixtures/19439347?api_token=YOUR_TOKEN&include=odds&filters=bookmakers:23
```

{% file src="/files/lcbg0GCWeTdeuDt1IIIF" %}

## **Team**

### **Team season statistics**

#### **EPL 2025/2026 season: Manchester City team statistics**

Request to retrieve the season statistics of Manchester City for the CL 2025/2026 season.&#x20;

```http
https://api.sportmonks.com/v3/football/teams/9?api_token=YOUR_TOKEN&include=statistics.details.type&filters=teamStatisticSeasons:21638
```

{% file src="/files/raeEjj7J5uUoXtit8SRB" %}

{% hint style="danger" %}
Including `.type` is not recommended as an include on any endpoint. Types are used throughout the entire API. We recommend retrieving all types from the types endpoint and storing them in your database or other data structure. Only include the type if no other option is available or when testing the API.
{% endhint %}

### **Team season squads and statistics**

#### **Bundesliga 2025/2026 season: Bayern Munich squad**

Request to retrieve the squad and statistics of Bayern Munich for the Bundesliga 2025/2026 season.&#x20;

```http
https://api.sportmonks.com/v3/football/squads/seasons/25646/teams/503?api_token=YOUR_TOKEN&include=player;details.type
```

{% file src="/files/UJnphw0gGIaahbkZW4Hu" %}

{% hint style="danger" %}
Including `.type` is not recommended as an include on any endpoint. Types are used throughout the entire API. We recommend retrieving all types from the types endpoint and storing them in your database or other data structure. Only include the type if no other option is available or when testing the API.
{% endhint %}

## **Player**

### **Player season statistics**

#### **Bundesliga 2025/2025 season: Harry Kane statistics**

Request to retrieve the statistics of Harry Kane for the Bundesliga 2025/2026 season.&#x20;

```http
https://api.sportmonks.com/v3/football/players/997?api_token=YOUR_TOKEN&include=statistics.details.type&filters=playerStatisticSeasons:21638
```

{% file src="/files/BuKiEQdjbY281OeQvWM2" %}

{% hint style="danger" %}
Including `.type` is not recommended as an include on any endpoint. Types are used throughout the entire API. We recommend retrieving all types from the types endpoint and storing them in your database or other data structure. Only include the type if no other option is available or when testing the API.
{% endhint %}

## **Standings**

### **Domestic League Standings**

#### **Ligue 1 2025/2026 season standings**

Request to retrieve the standings of the French Ligue 1 2025/2026 seasonn.

```http
https://api.sportmonks.com/v3/football/standings/seasons/21646?api_token=YOUR_TOKEN&include=participant;rule;details.type
```

{% file src="/files/g3NA58W105Hu84QntbYa" %}

{% hint style="danger" %}
Including `.type` is not recommended as an include on any endpoint. Types are used throughout the entire API. We recommend retrieving all types from the types endpoint and storing them in your database or other data structure. Only include the type if no other option is available or when testing the API.
{% endhint %}

### **International Cup Standings**

#### **World Cup 2026** Qualification Europe

Request to retrieve the group standings of the World Cup 2026 qualifying rounds in Europe.

```http
https://api.sportmonks.com/v3/football/standings/seasons/21887?api_token=YOUR_TOKEN&include=participant;rule;details.type
```

{% file src="/files/2LG1Arbp9PiR3MqL1Ym4" %}

{% hint style="danger" %}
Including `.type` is not recommended as an include on any endpoint. Types are used throughout the entire API. We recommend retrieving all types from the types endpoint and storing them in your database or other data structure. Only include the type if no other option is available or when testing the API.
{% endhint %}