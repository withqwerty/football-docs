---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.846Z
---
# Changelog (BETA)

{% hint style="info" %}
This changelog was used during the Beta version of API3. Since API3 has been released by now, this Beta changelog will no longer be updated. You should refer to the [live changelog ](/v3/changelog/changelog-1)instead.
{% endhint %}

From the 25th of October and onwards, we will list any additions and changes made in the API (Beta) on this page, in chronological order (**YYYY-MM-DD format)**.

### 2023-04-03

* We have added a new type called GOALKEEPER\_GOALS\_CONCEDED. This was required because the current GOALS\_CONCEDED stat merged the goalskeeper and player stats which was not mean to be.

### **2023-03-07**

* We have changed some logic in the parsing of includes, making them case-insensitive. As a result of this the response will also include a lowercase contiguous version of the include name.

### **2023-02-24**

* For the time being, we have removed the player\_id and related\_player\_id fields from comments, they will be added back again at a later stage, after the implementation for the detection of players names has been further improved.

### **2023-02-17**

* We have implemented a filter called *hasOdds* on Fixture entities. You can apply it like so *\&filters=havingOdds* You can also switch the value of the boolean to check for, use *\&filters=havingOdds:false* to get the exact opposite results.
* A field called *has\_odds* has been implemented on Fixture entities, marking whether a Fixture has odds available in our database.&#x20;

### **2023-02-13**

* When using the *topscores* include on Stages and Seasons, you can now use a nested *topscorer (e.g topscorers.topscorer)* include, this include shows more information about how the record was established, for example for a player, it shows for which individual teams the player scored goals for which counted towards the total.&#x20;

### **2023-02-10**

* New Bookmakers have been added; MelBet, Macauslot and HG
* Odds processing for Betregal, Ladbrokes, Cloudbet, Nitrogen, Betclic and MansionBet has been implemented.

### **2023-02-06**

* The endpoints returning "all" entities, are now ordered by their respective ID in ascending order.&#x20;

### **2023-01-31**

* When using the *participants* include on a [Fixture](/v3/endpoints-and-entities/entities/fixture). The meta now shows the *winner* and *position* field, respectively indicating whether a participant has won the fixture, and the position of the participant in the league's standings prior to the match.

### **2023-01-18**

* Since we have drastically changed our pre-match odds processing for API3, pre-match odds are now updating more frequently, causing any changes in odds values to be available a lot quicker than before. Therefore, we have changed the threshold of [Latest Updated Pre-Match](/v3/endpoints-and-entities/endpoints/standard-odds-feed/pre-match-odds/get-last-updated-odds) odds endpoint from 5 minutes to 10 seconds, since using the 5 minute threshold could cause memory issues because of the amount of updated odds returned.

### **2023-01-13**

* The *statistics* include is now available on [Rounds](/v3/endpoints-and-entities/endpoints/rounds), [Stages](/v3/endpoints-and-entities/endpoints/stages), and [Periods](/v3/endpoints-and-entities/entities/fixture).
* A *Socials* include has been added to retrieve the Social Media platforms a team / player etc. is active on. In addition a *Channels* include has been added to retrieve extended information about the social media platform. We hope to expand our coverage of these socials over time.

![](/files/ETBLr7h2pO7Bf9XMkrIu)

### **2023-01-11**

* We will be reloading the (historical) pre-match odds for API3. Until the process is done the coverage of the odds for API3 may vary. *Update: this process is now completed.*

### **2023-01-04**

* We will be reloading the (historical) pre-match odds for API3. Until the process is done the coverage of the odds for API3 may vary. *Updat&#x65;**:** this process is now completed.*
* A *subType* include has been added, this include gives additional information about a certain entity which also belongs to a type. For example on Events, the *type\_id* can be of *GOAL* (id: 14), the *sub\_type* can give more information about this event, for example that the goal was with a *RIGHT\_FOOT\_SHOT* (id: 1522).

![](/files/6eb0p6tzIIQdVSeGaNkX)

* The *home\_score* and *away\_score* on Fixtures and Periods have now been removed from the API, they were deprecated as stated in the changelog entry from **2022-12-23**.

### **2022-12-23**

* A *scores* include has been added to retrieve a score for fixtures in a more convenient way. The include returns the scores per period, as well as the current score for the regarding fixture. \
  The *home\_score* and *away\_score* on a Fixture are now deprecated, as well as these fields on a Period, they will be removed from the API in before the beta stage is over.

### **2022-12-19**

* The *Current Leagues by Team Id* and the *Leagues by Team Id* endpoint have been moved from the */teams* route directory to the */leagues* route directory, this better follows the convention since a league is the base entity that is returned.

### **2022-12-15**

We are currently load testing the API. The availability and performance of the API may vary while this is ongoing.

### **2022-12-06**

* The [Live Leagues](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/leagues/get-leagues-by-live) and [Leagues by Fixture Date](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/leagues/get-leagues-by-fixture-date) endpoints now use league priority.
* A *metadata* include has been added to [Player](/v3/endpoints-and-entities/endpoints/players) entities, it gives additional information about a player, for example their preferred foot.
* A *position* include has been added to [PlayerStatistic](/v3/endpoints-and-entities/entities/statistic) entities.
* We will be reloading the pre-match odds for API3. Fixtures can return empty lists for pre-match orders until the reload is complete. Once the reload is completed, it will be stated here.&#x20;

### **2022-12-02**

* Forms are now available via an include, you can use the *form* include on [Standing](/v3/endpoints-and-entities/entities/standing-and-topscorer) entities to get the (historical) form of a participant per fixture. You can use the sort\_order field to display the form, the latest fixtures have the highest sort\_order.

### **2022-12-01**

* An [endpoint](/v3/core-api/endpoints/filters/get-all-entity-filters) to keep track of the available filters per entity has been implemented.

### **2022-11-28**

* A dynamic filter for [Stages](/v3/endpoints-and-entities/endpoints/stages) has been added. It is available on every entity that has a relation to a stage, for example on a fixture, you can apply it like so *\&filters=fixtureStages:11*
* We have implemented a *sidelined* include on [Fixture](/v3/endpoints-and-entities/entities/fixture) entities. It will return the sidelined players for the given fixture.&#x20;
* It is now possible to add the *filters=populate* to your query parameter. This parameter allows for a higher pagination limit (max 1000), so you can populate your database in a more convenient way instead of using the default pagination limit of 50. To prevent our services from being overloaded, using includes is disabled when this filter is added to the request.

### **2022-11-25**

* Because of a typo, we have renamed the yersey\_number field in Lineup entities, to jersey\_number.

### **2022-11-22**

* The *detailed\_position\_id* field has been removed from a Lineup entity. This field became obsolete, to build a (visual) formation you should use the formation\_field attribute which is also available on the Lineup entity. The *detailed\_position\_id* is still available on the Player entity, indicating the preferred position of the player / the position where the player plays the most, a players *detailed\_position\_id* may change over time.

### **2022-11-21**

* When requesting a page that utilizes pagination, the *next\_page* attribute now contains the query parameters from the original request. This way you can easily propogate through the results with the same context like includes and filters. If you are using the API token as a query parameter for authentication, you still have to add this to your next request.

### **2022-11-15**

* The 'value' field on Trend entities is now automatically casted to a float.&#x20;

### **2022-11-04**

* A filter called *deleted* has been implemented. The filter can be passed on [Fixtures](/v3/endpoints-and-entities/endpoints/fixtures) entities to only request fixtures that have a *is\_deleted* [State](/v3/endpoints-and-entities/endpoints/states). This is handy to keep your database in Sync with ours, since fixtures with a deleted state are excluded from default responses.
* An endpoint to retrieve jerseys has been implemented. You can request the current seasons jerseys via league id.

### **2022-11-03**

* The Aggregated Topscorers by Season Id endpoint has been removed. It became obsolete since we have now separated *Stage Topscorers* and *Season Topscorers*. Requesting [Season Topscorers](/v3/endpoints-and-entities/endpoints/topscorers/get-topscorers-by-season-id) now returns the same result as an "aggregated" call would return beforehand.
* We have added a *formations* include, which is now available under the [Fixture](/v3/endpoints-and-entities/endpoints/fixtures) entity. This provides a more convenient to request the formations for the given fixtures participants. In before implementing this include, it was available as a value when requesting the *metadata* include. Requesting formations via the metadata is now deprecated and will be removed before API V3 will go out of Beta.
* We have added a *ballCoordinates* include, which is now available under the [Fixture](/v3/endpoints-and-entities/endpoints/fixtures) entity. This provides a more convenient to request ball coordinates for the given fixture. In before implementing this include, it was available as a value when requesting the *metadata* include. Requesting ball coordinates via the metadata is now deprecated and will be removed before API V3 will go out of Beta.

### **2022-11-01**

* From now on, when requests return no results, an extra field *message* will be added to the response, stating no results were returned. This can either be due to the query not returning any (more) results, or because the subscription not allowing access to the requested data.

### **2022-10-26**

* A new pagination system has been implemented. From now on, we will no longer provide a `count` and `total_pages` property in the meta of the response. Instead, you can paginate using the `has_more` parameter to determine if you can still propagate through results. This change decreases the load on our databases and massively increases API response speed and reliability.
* A new filter called `idAfter` has been implemented on endpoints returning all entities, for example the [All Leagues endpoint ](/v3/endpoints-and-entities/endpoints/leagues/get-all-leagues)or [All Fixtures endpoint.](/v3/endpoints-and-entities/endpoints/fixtures/get-all-fixtures) This is especially useful for pagination, e.g to easily determine which entities have been newly created in our databases compared to yours. You can use it like so: &#x20;

{% code overflow="wrap" %}

```javascript
https://api.sportmonks.com/v3/football/leagues?api_token={your_token}&filters=idAfter:2000
```

{% endcode %}

This will only return leagues with an ID higher than 2000.

### **2022-10-25**

* We have changed the URL of the endpoint that returns the latest updated fixtures. In before this change, it was available via *fixtures/updates*. To better follow naming conventions of similar endpoints in our API, it is now accessible via [*fixtures/latest*](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/fixtures/get-latest-updated-fixtures).&#x20;
* The parameter for the [fixtures/latest](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/fixtures/get-latest-updated-fixtures) endpoint has changed. It will now return fixtures that have been updated in the last *5 minutes*.