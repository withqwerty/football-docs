---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-sport-event-insights
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.198Z
---
# Sport Event Insights

**Soccer Extended Sport Event Insights** provides selected AI-generated pre-match and live insights derived from statistical data for a given match and its participating teams.<br><br><i><b>Examples</b>: In their last 5 matches, Liverpool FC have received an average of 1.6 cards per match, while AFC Bournemouth have averaged 3 cards.</i><br><br><i>The match is still tied after the first half. In their last 9 home matches in the J.League when that happened, Sanfrecce Hiroshima have won 5 times.</i>

  ### Update Frequency

  **TTL / Cache:** 60 seconds

  **Data Updates:** Insights can be available around 20 days prior to a match

> 📘 Enriching Match Coverage
>
> Learn how match insights can enrich your coverage in our [Live Match Updates](https://developer.sportradar.com/soccer/docs/soccer-ig-live-match-retrieval) integration scenario.

***

## Data Points

### Sport Event - Insights
  | Attribute   | Parent Element           | Type    | Description                                                                                                                                                                                                                                                                                                                                                              |
  | ----------- | ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | `relevancy` | `insight`                | Integer | A rating between 0-5 that measures the relevancy of the data within the insight compared to other insights<br /><br />`3.18608`                                                                                                                                                                                                                                          |
  | `text`      | `insight`                | String  | Insight for a sport event<br /><br />ex. `In their last 5 matches, Liverpool FC have received an average of 0.2 cards in the first half per match, while AFC Bournemouth have averaged 1 card.` or `The chances of seeing a goal from AFC Bournemouth in the first half are slim. They have only averaged 0.4 goals before halftime  in the last 10 matches this season.` |
  | `type`      | `insight`                | String  | Indicates the type of insight as prematch or live<br /><br />`live`, `prematch`                                                                                                                                                                                                                                                                                          |
  | `id`        | `insight` - `related_id` | String  | Unique Id related to an insight. Currently limited to team/competitor Ids.<br /><br />ex. `sr:competitor:44`                                                                                                                                                                                                                                                             |
  | `name`      | `insight` - `related_id` | String  | Corresponding name of a unique Id related to an insight<br /><br />ex. `Liverpool FC`                                                                                                                                                                                                                                                                                    |
