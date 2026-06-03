---
source_url: https://dataglossary.wyscout.com/
source_type: crawled
upstream_version: null
crawled_at: 2026-06-03
---

# Wyscout Glossary — Metrics & Concepts

Wyscout's analytical **concepts** (xG, xA, ball possession, pitch coordinates, possession-adjusted, minutes played, attack, player reports) and **metrics** (PPDA, ball progression, challenge intensity, physical metrics, player metrics, match-level metrics, Wyscout Index, defensive actions, long-pass share, loss index), from the official Data Glossary with figures permalinked. These apply across the Wyscout Platform, reports and the API (v3 and v4).

## Attack

An attack is a [Possession](/ball_possession) of the team. The attacks are split into following categories:

#### Open play attack

A possession that doesn't start from a set piece (Free Kick Cross, Free Kick Shot, Corner, Throw In or Penalty). The possession should have at least one successful action in the
opposition final third to qualify as an attack.

#### Counterattack

Happens when after a turnover the team switches quickly from defense to attack, trying to catch their opponent out of defensive shape.

#### Positional attack

An open play attack that is not a Counterattack.

#### Set piece attack

Any possession that starts from a [Corner Kick](/corner) or a [Free Kick Cross](/free_kick_cross).

Source: [https://dataglossary.wyscout.com/attack/](https://dataglossary.wyscout.com/attack/)

## Ball possession

A metric quantifying how much a team is actually in possession of the ball. Available as pure time or as percentage of possession (compared to the opponent).

Wyscout uses a ball possession percentage calculation approach based on pure time spent in possession of the ball. A _Possession_ is a sequence of events with the ball of the same team. Time where the ball is out of play (either out of field or, for example, setting up a set piece) is not counted as possession for any of the two teams. Opponent actions that do not constitute a meaningful ball possession, like lost duels, missed balls and rebounds that are immediately picked up, do not break possessions.

Other data providers might use a simpler algorithm, which only takes into account accurate passes made by two teams, however, since not all passes are created equal and take different time to complete, the pure time algorithm provides more accurate results.

#### Open play possessions

Possessions that doesn't start from a set piece (Free Kick Cross, Free Kick Shot, Corner, Throw In or Penalty). Open play possessions are split in following values according to their duration:

- Short: (0-10 sec)
- Medium: (10-20 sec)
- Long: (20-45 sec)
- Very long: (45+ sec)

Source: [https://dataglossary.wyscout.com/ball_possession/](https://dataglossary.wyscout.com/ball_possession/)

## Ball progression

A metric quantifying how many meters a player is taking the ball forward .

For every successful **forward pass**, wyscout calculates how close this pass is to the opponent goal. For example, if a pass started at the center of the field and arrived to the edge of the penalty area successfully, this pass would have brought the ball forward 36 meters.

The same logic also applies to **runs**, i.e. successful ball control over distance from the same player. The difference between the distance of the starting point of the run to the opponent goal and the end point of the run to the opponent goal is saved as the run progression.

Note that only succesful forward passes and forward runs are included in this description, so the metric would be always equal or more than zero.

Source: [https://dataglossary.wyscout.com/ball_progression/](https://dataglossary.wyscout.com/ball_progression/)

## Challenge intensity

A team metric, quantifying how many defensive actions (defensive duels, loose ball duels, interceptions, tackles) a team is doing per minute of opponent ball possession.

Challenge intensity reflects how often the team is actively trying to recover the ball when the opponent is in possession (thus, it's correlated to _PPDA_). The higher this number, the more intense the team is in challenges. In top five European leagues for 2018/2019 the average challenge intensity is 6.04. The best team in Challenge intensity in top five leagues 2018/2019 is Eibar with 7.7; Parma, Nürnberg and Angers have the least (5).

Source: [https://dataglossary.wyscout.com/challenge_intensity/](https://dataglossary.wyscout.com/challenge_intensity/)

## Defensive actions

A [Defensive duel](/defensive_duel), [Interception](/interception) or a [Sliding tackle](/tackle) made by the player.

As a metric of Successful defensive actions, is present in Advanced Search.

Source: [https://dataglossary.wyscout.com/defensive_actions/](https://dataglossary.wyscout.com/defensive_actions/)

## Long pass share

**Metric defition**: How many of the passes a team makes are long passes.

Values of 15-20% of long passes indicate a very direct, physical football, what a team would generally play in an away match or with a serious underdog mentality. Champions of this style in EPL 2019/2020 are Burnley (4 matches above 20%), Newcastle (3) and Wolverhampton (2).

A team can still perfectly win with this style of play: Wolverhampton won an away match against Man City (0:2), playing 23% of long passes.

Values of around 5% indicate a very fluid, short, 'tiki-taka' style of play, characteristic of heavy dominating possession play (Manchester City). In Man City win's against Watford (8:0) only 3.4% of City's passes were long. In Leicester's away win at Southampton (0:9) the value was 4.36%.

Source: [https://dataglossary.wyscout.com/long_pass_share/](https://dataglossary.wyscout.com/long_pass_share/)

## Loss index

_Also known as_ losses to successful attacking actions.

_Metric defition_: number of ball **losses** a player makes divided by the successful actions in attack (**shots**, **crosses** and **dribbles**).

A metric that quantifies danger created by the player in the final phase in relation to ball losses. Used to evaluate attacking input of offensive players and its relation to missed opportunities/number of tries. **Lower is better**.

For example, Lionel Messi in the 2018/2019 season made 14.22 successful attacking actions on average and lost the ball 11.73 times per 90 minutes. That makes his loss index very high, at 0.82.

In the same season, José Callejón made just 3.34 successful attacking actions per 90 minutes and lost the ball 8.78 times. That makes his loss index 2.63, which is a little lower than average.

Source: [https://dataglossary.wyscout.com/loss_index/](https://dataglossary.wyscout.com/loss_index/)

## Match-level metrics

| Metric | Short name | Type | Definition | Products |
|---|---|---|---|---|
| Actions |  | Match/Player | Total number of actions. | Match report, Player Stats |
| Actions / successful |  | Match/Player | Total number of successful actions. Also available as a percentage. | Match report, Player Stats |
| Aerial duels |  | Match/Team, Player | Total number of aerial duels. | Match report, Player Stats, Team Stats |
| Aerial duels won |  | Match/Team, Player | Total number of won aerial duels. Also available as a percentage. | Match report, Player Stats, Team Stats |
| Assists |  | Match/Player | Total number of assists. | Match report, Player Stats |
| Attacks |  | Match/Team | Total number of possessions having at least one successful action in the final third. | Match report |
| Attacks per minute |  | Match/Team | Number of open play attacks per minute of play. See Attack. | Match report |
| Attacks with shots |  | Match/Team | Number of attacks containing a shot. Also available as a percentage. | Match report |
| Average formation line |  | Match/Team | Average position on the axis from own goal to the opponent goal of all team events with the ball. | Match report |
| Average pass length |  | Match/Team, Player | Average length of passes. | Match report, Team Stats |
| Average passes per possession |  | Match/Team | Average number of passes in an open play possession. | Team Stats |
| Average possession duration |  | Match/Team | Average duration of an open play possesion. | Match report |
| Average shot distance |  | Match/Team | Average distance on the axis from own goal to the opponent goal of all team shots. | Match report, Team Stats |
| Back passes |  | Match/Team, Player | Total number of passes in a 90° angle rotated by 45° facing backwards. See Pass. | Match report, Player Stats, Team Stats |
| Back passes / accurate |  | Match/Team, Player | Total number of accurate back passes. Also available as a percentage. | Match report, Player Stats, Team Stats |
| Back passes to GK |  | Match/Player | Total number of back passes with own goalkeeper as a receiver. | Match report |
| Ball distributions |  | Match/Player | Total number of goal kicks. | Player Stats |
| Ball possession (%) |  | Match/Team | Percentage of ball possession. See Ball possession on methodology. | Match report, Team Stats |
| Challenge intensity |  | Match/Team | Number of defensive actions (defensive duels, loose ball duels, interceptions, tackles) per minute of opponent ball possession. | Match report |
| Clearances |  | Match/Team, Player | Total number of clearances. | Match report, Player Stats, Team Stats |
| Conceded penalty goals |  | Match/Player | Total number of goals conceded from penalty. Applies to the goalkeeper. | Match report |
| Corners |  | Match/Team, Player | Total number of corner kicks taken. | Match report, Team Stats |
| Corners with shots |  | Match/Team | Total number of corner kicks that led to a shot of the team taking the corner kick within 14 seconds. Also available as a percentage. | Match report, Team Stats |
| Counterattacks |  | Match/Team | Total number of counterattacks. | Match report, Team Stats |
| Counterattacks with shots |  | Match/Team | Total number of counterattacks where the possession had a shot. Also available as a percentage. | Team Stats |
| Crosses |  | Match/Team, Player | Total number of crosses. | Match report, Player Stats, Team Stats |
| Crosses / accurate |  | Match/Team, Player | Total number of accurate crosses. Also available as a percentage. | Match report, Player Stats, Team Stats |
| Crosses / blocked |  | Match/Team | Total number of crosses that are blocked. | Match report |
| Crosses / high |  | Match/Team | Total number of crosses above waist height. | Match report |
| Crosses / low |  | Match/Team | Total number of crosses below waist height. | Match report |
| Dead time |  | Match | Time when neither of the teams were in possession of the ball | Match report |
| Deep completions |  | Match/Team, Player | Total number of deep completed passes. | Match report, Team Stats |
| Deep completed crosses |  | Match/Team | Total number of deep completed crosses. | Team Stats |
| Defensive duels |  | Match/Team, Player | Total number of defensive duels. | Match report, Player Stats, Team Stats |
| Defensive duels won |  | Match/Team, Player | Total number of defensive duels won. See Defensive duel on methodology. Also available as a percentage. | Match report, Player Stats, Team Stats |
| Direct free kicks taken |  | Match/Team, Player | Total number of shots taken from free kicks. | Match report |
| Dribbles |  | Match/Team, Player | Total number of dribbles. | Match report, Player Stats |
| Dribbles / successful |  | Match/Team, Player | Total number of successful dribbles. See Dribble on methodology. Also available as a percentage. | Match report, Player Stats |
| Duels |  | Match/Team, Player | Total number of duels (offensive, defensive, loose ball, aerial). | Match report, Player Stats |
| Duels win rate |  | Match/Team | Percentage of duels won per interval. | Match report |
| Duels won |  | Match/Team, Player | Total number of duels won. Also available as a percentage. | Match report, Player Stats |
| Expected Assists | xA | Match/Player | The sum of xA values of all shot assists. | Match report, Player Stats |
| Expected Goals | xG | Match/Team, Player | The sum of xG values of all shots. | Match report, Player Stats, Team Stats |
| Expected Conceded Goals | xCG, xG2 | Match/Team, Player | The sum of xCG values of all shots against on target. | Match report, Player Stats |
| Forward passes |  | Match/Team, Player | Total number of passes in a 90° angle rotated by 45° facing forwards. See Pass. | Match report, Player Stats, Team Stats |
| Forward passes / accurate |  | Match/Team, Player | Total number of accurate forward passes. Also available as a percentage. | Match report, Player Stats, Team Stats |
| Fouls |  | Match/Team, Player | Total number of game fouls. | Match report, Player Stats, Team Stats |
| Fouls suffered |  | Match/Team, Player | Total number of fouls suffered. | Match report, Player Stats |
| Free kicks |  | Match/Team, Player | Total number of free kicks. | Match report, Team Stats |
| Free kicks with shots |  | Match/Team | Total number of free kicks that led to a shot of the team taking the free kick within 14 seconds. | Match report, Team Stats |
| Goalkeeper exits |  | Match/Player | Total number of goalkeeper exits. | Match report, Player Stats |
| Goals |  | Match/Team, Player | Total number of goals scored. Includes own goals in team context. | Match report, Player Stats, Team Stats |
| Goals conceded |  | Match/Team, Player | Total number of goals conceded. In player context, refers just to the goalkeeper. | Match report, Player Stats, Team Stats |
| Interceptions |  | Match/Team, Player | Total number of interceptions. | Match report, Player Stats, Team Stats |
| Key passes |  | Match/Team, Player | Total number of key passes. | Match report |
| Lateral passes |  | Match/Team, Player | Total number of passes in two 90° angles rotated by 45° facing sideways, longer than 12 meters. See Pass. | Match report, Team Stats |
| Lateral passes / accurate |  | Match/Team, Player | Total number of accurate lateral passes. Also available as a percentage. | Match report, Team Stats |
| Long pass share (%) |  | Match/Team | Percentage of how many of the passes a team makes are long passes. | Match report, Team Stats |
| Long passes |  | Match/Team, Player | Total number of long passes. | Match report, Player Stats, Team Stats |
| Long passes / accurate |  | Match/Team, Player | Total number of accurate long passes. Also available as a percentage. | Match report, Player Stats, Team Stats |
| Loose ball duels |  | Match/Team, Player | Total number of loose ball duels. | Match report, Player Stats |
| Loose ball duels won |  | Match/Team, Player | Total number of loose ball duels won. Also available as a percentage. | Match report, Player Stats |
| Losses |  | Match/Team, Player | Total number of possession losses. | Match report, Player Stats, Team Stats |
| Losses / High |  | Match/Team | Total number of possession losses in final third. | Match report, Team Stats |
| Losses / Low |  | Match/Team | Total number of possession losses in own third. | Match report, Team Stats |
| Losses / Medium |  | Match/Team | Total number of possession losses in mid-third. | Match report, Team Stats |
| Losses / Own half |  | Match/Player | Total number of possession losses in own half. | Match report, Player Stats |
| Match tempo |  | Match/Team | Number of team passes per minute of pure ball possession. | Match report |
| Number of possessions |  | Match/Team | Total number of possessions. | Match report |
| Offensive duels |  | Match/Team, Player | Total number of offensive duels. | Match report, Player Stats, Team Stats |
| Offensive duels won |  | Match/Team, Player | Total number of offensive duels won. See Offensive duel on methodology. Also available as a percentage. | Match report, Player Stats, Team Stats |
| Offsides |  | Match/Team, Player | Total number of offsides. | Match report, Player Stats, Team Stats |
| Open play possessions / Long |  | Match/Team | Total number of open play possessions with length of 20-45 seconds. | Match report |
| Open play possessions / Medium |  | Match/Team | Total number of open play possessions with length of 10-20 seconds. | Match report |
| Open play possessions / Short |  | Match/Team | Total number of open play possessions with length of 0-10 seconds. | Match report |
| Open play possessions / Total |  | Match/Team | Total number of open play possessions/ | Match report |
| Open play possessions / Very long |  | Match/Team | Total number of open play possessions with length > 45 seconds. | Match report |
| Pass accuracy (%) |  | Match/Team | Percentage of accurate passes. | Match report |
| Passes |  | Match/Team, Player | Total number of passes. | Match report, Player Stats, Team Stats |
| Passes / accurate |  | Match/Team, Player | Total number of accurate passes. Also available as a percentage. | Match report, Player Stats, Team Stats |
| Passes beyond own third |  | Match/Player | Total number of passes (including goal kicks) that went outside own third. | Match report |
| Passes beyond own third / accurate |  | Match/Player | Total number of accurate passes (including goal kicks) that went outside own third. Also available as a percentage. | Match report |
| Passes inside own third |  | Match/Player | Total number of passes (including goal kicks) made inside own third. | Match report |
| Passes inside own third / accurate |  | Match/Player | Total number of accurate passes (including goal kicks) made inside own third. Also available as a percentage. | Match report |
| Passes per minute |  | Match/Team | Number of passes per minute of ball possession. | Team Stats |
| Passes to final third |  | Match/Team, Player | Total number of passes from outside final third to the final third. | Match report, Team Stats |
| Passes to final third / accurate |  | Match/Team, Player | Total number of accurate passes from outside final third to the final third. Also available as a percentage. | Match report, Team Stats |
| Passes to penalty area |  | Match/Team, Player | Total number of passes from outside opponent penalty area to the opponent penalty area. | Match report, Player Stats |
| Passes to penalty area / accurate |  | Match/Team, Player | Total number of accurate passes from outside opponent penalty area to the opponent penalty area. Also available as a percentage. | Match report, Player Stats |
| Penalties |  | Match/Team | Total number of penalties. | Team Stats |
| Penalties converted |  | Match/Team | Total number of penalties scored. | Team Stats |
| Penalties saved |  | Match/Player | Total number of penalties saved. Applies to the goalkeeper. | Match report |
| Penalty area entries |  | Match/Team | Total number of penalty area entries (via pass, cross or carry). | Team Stats |
| Positional attacks |  | Match/Team | Total number of positional attacks. | Match report, Team Stats |
| Positional attacks with shots |  | Match/Team | Total number of positional where the possession had a shot. | Match report, Team Stats |
| Possessions reaching opponent box |  | Match/Team | Total number of possessions that have at least one successful action in the opponent penalty area. | Match report |
| Possessions reaching opponent half |  | Match/Team | Total number of possessions that have at least one successful action in the opponent half. | Match report |
| Pressing intensity | PPDA | Match/Team | A metric to quantify high press intensity in final 60% of the field. See PPDA | Match report, Team Stats |
| Progressive passes |  | Match/Team, Player | Total number of progressive passes. | Match report, Team Stats |
| Progressive passes / accurate |  | Match/Team, Player | Total number of accurate progressive passes. Also available as a percentage. | Match report, Team Stats |
| Progressive runs |  | Match/Player | Total number of progressive runs. | Player stats |
| Pure possession time |  | Match/Team | Pure time spent in possession of the ball. | Match report |
| Received passes |  | Match/Player | Total number of accurate passes received. | Player Stats |
| Recoveries |  | Match/Team, Player | Total number of recoveries. | Match report, Player Stats, Team Stats |
| Recoveries / High |  | Match/Team | Total number of possession recoveries in final third. | Match report, Team Stats |
| Recoveries / Low |  | Match/Team | Total number of possession recoveries in own third. | Match report, Team Stats |
| Recoveries / Medium |  | Match/Team | Total number of possession recoveries in mid-third. | Match report, Team Stats |
| Recoveries / Opponent half |  | Match/Team, Player | Total number of possession recoveries in opponent half. | Match report, Player Stats |
| Recoveries per minute |  | Match/Team | Total number of possession recoveries per minute of play. | Match report |
| Red cards |  | Match/Team, Player | Total number of red cards. | Match report, Player Stats, Team Stats |
| Reflex saves |  | Match/Player | Total number of reflex saves. Applies to the goalkeeper only | Match report, Player Stats |
| Saves |  | Match/Player | Total number of saves. Applies to the goalkeeper only. | Match report, Player Stats |
| Second assists |  | Match/Player | Total number of second assists. | Match report, Player Stats |
| Set pieces |  | Match/Team | Total number of attacks started from set pieces. | Team Stats |
| Set pieces with shots |  | Match/Team | Total number of attacks started from set pieces that had a shot inside the possession. Also available as a percentage. | Team Stats |
| Short + medium passes |  | Match/Player | Total number of passes that were not long passes. | Match report |
| Short + medium passes / accurate |  | Match/Player | Total number of accurate passes that were not long passes. Also available as a percentage. | Match report |
| Shot assists |  | Match/Player | Total number of shot assists. | Match report, Player Stats |
| Shots |  | Match/Team, Player | Total number of shots. | Match report, Player Stats, Team Stats |
| Shots against |  | Match/Team | Total number of shots against (blocked or missed are included). | Team Stats |
| Shots blocked |  | Match/Team, Player | Total number of shots blocked by the opponent. | Match report |
| Shots from the box |  | Match/Team | Total number of shots made from inside the opponent penalty area. | Match report |
| Shots from the box on target |  | Match/Team | Total number of shots made from inside the opponent penalty area and were on target. Also available as a percentage. | Match report |
| Shots on post |  | Match/Team | Total number of shots that hit the post and then went wide. | Match report |
| Shots on target |  | Match/Team, Player | Total number of shots that were on target. Also available as a percentage. | Match report, Player Stats, Team Stats |
| Shots outside the box |  | Match/Team | Total number of shots made from outside the opponent penalty area. | Match report, Team Stats |
| Shots outside the box on target |  | Match/Team | Total number of shots made from outside the opponent penalty area and were on target. Also available as a percentage. | Match report, Team Stats |
| Shots wide |  | Match/Team | Total number of shots that were off target (blocked). | Match report |
| Sliding tackles |  | Match/Team, Player | Total number of sliding tackles. | Match report, Player Stats, Team Stats |
| Sliding tackles / won |  | Match/Team, Player | Total number of won sliding tackles. See Defensive duel for methodology. Also available as a percentage. | Match report, Player Stats, Team Stats |
| Smart passes |  | Match/Team, Player | Total number of smart passes attempted. | Match report, Team Stats |
| Smart passes / accurate |  | Match/Team, Player | Total number of accurate smart passes. Also available as a percentage. | Match report, Team Stats |
| Third assists |  | Match/Player | Total number of third assists. | Match report |
| Through passes |  | Match/Player | Total number of through balls attempted. | Match report, Player Stats |
| Through passes / accurate |  | Match/Player | Total number of accurate through balls. Also available as a percentage. | Match report, Player Stats |
| Throw-ins |  | Match/Player | Total number of throw-ins taken. | Match report |
| Touches in box |  | Match/Team, Player | Total number of actions with the ball in the opponent penalty area. | Match report, Team Stats |
| Yellow cards |  | Match/Team, Player | Total number of yellow cards. | Match report, Player Stats, Team Stats |

Source: [https://dataglossary.wyscout.com/metrics/](https://dataglossary.wyscout.com/metrics/)

## Minutes played

Every player is assigned the actual minutes played, with stoppage time, in a match. For example, if a player played a full match where 2 minutes of extra time was added to the first half and 3 to the second half, the minutes played for him for this match would be 95.

The normalization per 90 minutes happens based on this number. For example, if a player attempted 10 shots in a match as described above, his Shots/90 metric for the timeframe consisting of just this match would be 9.47.

Source: [https://dataglossary.wyscout.com/minutes/](https://dataglossary.wyscout.com/minutes/)

## Physical metrics

These metrics are only available for specific competitions and players with at least 60 minutes of active play across all matches.

| Metric | Definition | Products |
|---|---|---|
| Count HI per 90 | The number of High Intensity actions: sum of Count HSR (High Speed Runs) and Count Sprint, normalized per 90 minutes. | Advanced Search |
| Count High Acceleration per 90 | The number of Accelerations detected with a peak value greater than 3 m/s², normalized per 90 minutes. The action needs to last for at least 1 second. | Advanced Search |
| Count High Deceleration per 90 | The number of Decelerations detected with a peak value less than -3 m/s², normalized per 90 minutes. The action needs to last for at least 1 second. | Advanced Search |
| Count HSR per 90 | The number of High Speed Runs detected between 20 km/h and 25 km/h, normalized per 90 minutes. The action needs to last for at least 1 second. | Advanced Search |
| Count Medium Acceleration per 90 | The number of Accelerations detected with a peak value between 1.5 m/s² and 3 m/s², normalized per 90 minutes. The action needs to last for at least 1 second. | Advanced Search |
| Count Medium Deceleration per 90 | The number of Decelerations detected with a peak value between -1.5 m/s² and -3 m/s², normalized per 90 minutes. The action needs to last for at least 1 second. | Advanced Search |
| Count Sprint per 90 | The number of Sprints exceeding 25 km/h, normalized per 90 minutes. The action needs to last for at least 1 second. | Advanced Search |
| HI Distance per 90 | High Intensity. Distance covered above 20 km/h, normalized per 90 minutes. | Advanced Search |
| HSR Distance per 90 | High Speed Runs. Distance covered between 20 km/h and 25 km/h, normalized per 90 minutes. | Advanced Search |
| Meter/min | Total distance covered across all actions, divided per number of minutes. | Advanced Search |
| Max Speed (km/h) | The maximum speed recorded. | Advanced Search |
| Running Distance per 90 | Distance covered between 15 km/h and 20 km/h, normalized per 90 minutes. | Advanced Search |
| Sprinting Distance per 90 | Distance covered above 25 km/h, normalized per 90 minutes. | Advanced Search |
| Total Distance per 90 | Total distance covered, normalized per 90 minutes. | Advanced Search |

Source: [https://dataglossary.wyscout.com/physical_metrics/](https://dataglossary.wyscout.com/physical_metrics/)

## Pitch coordinates

![Pitch coordinates](https://dataglossary.wyscout.com/static/658f1bfbfc22e3b8df89f569fdb4883e/1d3c4/WyscoutDataCoordinates.png)

The event's coordinates depends on the subject. The subject's goal to be defended is always **x=0%** and the attack is always **x=100%**. All values are % expressed as **(x,y)**.

Source: [https://dataglossary.wyscout.com/pitch_coordinates/](https://dataglossary.wyscout.com/pitch_coordinates/)

## Player metrics

| Metric | Type | Products | Definition |
|---|---|---|---|
| Accelerations / 90 | Statistics | Advanced Search | Number of accelerations normalized per 90 minutes. |
| Aerial duels / 90 minutes | Statistics | Advanced Search | Number of aerial duels normalized per 90 minutes. |
| Aerial duels won (%) | Statistics | Advanced Search | Percentage of aerial duels won. |
| Accurate long passes (%) | Statistics | Advanced Search | Percentage of successful long passes. |
| Accurate progressive passes (%) | Statistics | Advanced Search | Percentage of successful progressive passes. |
| Accurate smart passes (%) | Statistics | Advanced Search | Percentage of successful smart passes. |
| Accurate through passes (%) | Statistics | Advanced Search | Percentage of successful through passes. |
| Assists / 90 | Statistics | Advanced Search | Number of assists normalized per 90 minutes. |
| Clearances / 90 | Statistics | Advanced Search | Number of clearances normalized per 90 minutes. |
| Cross accuracy | Statistics | Advanced Search | Percentage of successful crosses. |
| Cross accuracy from left flank (%) | Statistics | Advanced Search | Percentage of successful crosses from the left flank (the leftmost 23 meters). |
| Cross accuracy from right flank (%) | Statistics | Advanced Search | Percentage of successful crosses from the right flank (the rightmost 23 meters). |
| Cross accuracy to six-yard box (%) | Statistics | Advanced Search | Percentage of successful crosses with a next touch inside the six-yard box. |
| Crosses / 90 | Statistics | Advanced Search | Number of cross attempts normalized per 90 minutes. |
| Crosses from left flank, per 90 | Statistics | Advanced Search | Number of cross attempts normalized per 90 minutes that are delivered from the left flank (the leftmost 23 meters). |
| Crosses from right flank, per 90 | Statistics | Advanced Search | Number of cross attempts normalized per 90 minutes that are delivered from the right flank (the rightmost 23 meters). |
| Crosses to six-yard box, per 90 mins | Statistics | Advanced Search | Number of cross attempts with a next touch inside the six-yard box normalized per 90 minutes. |
| Deep completed crosses / 90 | Statistics | Advanced Search | Number of deep completed crosses attempted per 90 minutes. |
| Deep completions passes / 90 | Statistics | Advanced Search | Number of deep completions made per 90 minutes. |
| Defensive duels / 90 minutes | Statistics | Advanced Search | Number of defensive duels normalized per 90 minutes. |
| Defensive duels won (%) | Statistics | Advanced Search | Percentage of won defensive duels. |
| Dribbles / 90 | Statistics | Advanced Search | Number of dribble attempts normalized per 90 minutes. |
| Dribbles % | Statistics | Advanced Search | Percentage of successful dribbles. |
| Exits, per 90 mins | Statistics | Advanced Search | Number of events leaving line normalized per 90 minutes. |
| Fouls / 90 | Statistics | Advanced Search | Number of fouls normalized per 90 minutes. |
| Goal conversion (%) | Statistics | Advanced Search | Percentage of shots resulted in a goal. |
| Goals | Statistics | Advanced Search | Total number of goals scored. |
| Goals / 90 | Statistics | Advanced Search | Number of goals normalized per 90 minutes. |
| Head goals, avg per 90 mins | Statistics | Advanced Search | Total number of headed goals normalized per 90 minutes. |
| Head goals, total | Statistics | Advanced Search | Total number of headed goals. |
| Interceptions / 90 minutes | Statistics | Advanced Search | Number of interceptions normalized per 90 minutes. |
| Interceptions / per 30 minutes of opponent possession | Statistics | Advanced Search | Number of interceptions possession adjusted per 30 minutes of opponent possession. |
| Key passes / 90 | Statistics | Advanced Search | Number of key passes normalized per 90 minutes. Note: in contexts like reports and Advanced Search, this metric includes Assists made as well. |
| Long passes / 90 minutes | Statistics | Advanced Search | Number of long passes normalized per 90 minutes. |
| Loose ball duels / 90 minutes | Statistics | Advanced Search | Number of loose ball duels normalized per 90 minutes. |
| Loss index | Statistics | Player Lists | Number of ball losses a player makes divided by the successful actions in attack (shot on targets, accurate crosses and successful dribbles). |
| Losses / 90 | Statistics | Advanced Search | Number of recoveries losses per 90 minutes. |
| Missed balls / 90 minutes | Statistics | Advanced Search | Number of missed balls normalized per 90 minutes. |
| Non-penalty goals, per 90 mins | Statistics | Advanced Search | Total number of goals, excluding penalty kicks, normalized per 90 minutes. |
| Non-penalty goals, total | Statistics | Advanced Search | Total number of goals, excluding penalty kicks. |
| Offensive Duels / 90 | Statistics | Advanced Search | Number of offensive duels normalized per 90 minutes. |
| Offensive Duels % | Statistics | Advanced Search | Percentage of successful offensive duels. |
| Opponent half recoveries / 90 | Statistics | Advanced Search | Number of recoveries in the opponent half normalized per 90 minutes. |
| Own half losses / 90 | Statistics | Advanced Search | Number of losses in the opponent half normalized per 90 minutes. |
| Pass accuracy | Statistics | Advanced Search | Percentage of successful passes. |
| Passes / 90 | Statistics | Advanced Search | Number of passes normalized per 90 minutes. |
| Passes to final third / 90 | Statistics | Advanced Search | Number of passes to final third normalized per 90 minutes. |
| Passes to final third % | Statistics | Advanced Search | Percentage of succesful passes to final third. |
| Passes to penalty area / 90 | Statistics | Advanced Search | Number of passes to penalty area normalized per 90 minutes. |
| Passes to penalty area % | Statistics | Advanced Search | Percentage of succesful passes to penalty area. |
| Pressing duels, per 90 | Statistics | Advanced Search | Number of pressing duels normalized by 90 mins of time on the field. |
| Progressive passes / 90 | Statistics | Advanced Search | Number of progressive passes normalized per 90 minutes. |
| Progressive passes allowed | Statistics | Rankings | Number of progressive passes made by the opponent in the zone of the player (for example, defensive left flank for left defender). |
| Progressive runs / 90 | Statistics | Advanced Search | Number of progressive passes normalized per 90 minutes. |
| Recoveries / 90 | Statistics | Advanced Search | Number of recoveries normalized per 90 minutes. |
| Red cards / 90 minutes | Statistics | Advanced Search | Number of red cards normalized per 90 minutes. |
| Red cards, total | Statistics | Advanced Search | Total number of red cards in a timeframe. |
| Second assists / 90 | Statistics | Advanced Search | Number of second assists normalized per 90 minutes. |
| Short/medium passes / 90 | Statistics | Advanced Search | Number of short/medium passes normalized per 90 minutes. |
| Short/medium passes % | Statistics | Advanced Search | Accuracy of short/medium passes. |
| Shot assists / 90 | Statistics | Advanced Search | Number of dribbles normalized per 90 minutes. |
| Shots / 90 | Statistics | Advanced Search | Number of shots normalized per 90 minutes. |
| Shots against / 90 | Statistics | Advanced Search | Number of shots against the goalkeeper normalized by 90 mins of time on the field. |
| Shots on target % | Statistics | Advanced Search | Percentage of shots that go on target. |
| Shots, total | Statistics | Advanced Search | Number of all shots attempted in the timeframe. |
| Sliding tackles / per 30 minutes of opponent possession | Statistics | Advanced Search | Number of sliding tackles, possession adjusted per 30 minutes of opponent possession. |
| Smart passes / 90 | Statistics | Advanced Search | Number of smart passes normalized per 90 minutes. |
| Successful attacking actions / 90 | Statistics | Advanced Search | Sum of shots on target, accurate crosses and successful dribbles normalized per 90 minutes. |
| Successful defensive actions / 90 | Statistics | Advanced Search | Sum of defensive duels won, interceptions and sliding tackles normalized per 90 minutes. |
| Third assists / 90 | Statistics | Advanced Search | Number of third assists normalized per 90 minutes. |
| Through passes / 90 | Statistics | Advanced Search | Number of through passes normalized per 90 minutes. |
| Touches in box, per 90 | Statistics | Advanced Search | Number of touches in penalty area normalized by 90 mins of time on the field. |
| xA / 90 | Statistics | Advanced Search | Sum of xA values for all shot assists normalized per 90 minutes. |
| xG / 90 | Statistics | Advanced Search | Sum of xG values for all shots normalized per 90 minutes. |
| xG + xA / 90 | Statistics | Advanced Search | Sum of xG values for all shots and xA values for all shot assists normalized per 90 minutes. |
| xG, Total | Statistics | Advanced Search | Sum of xG values of all shots in the timeframe. |
| Yellow cards / 90 minutes | Statistics | Advanced Search | Number of yellow cards normalized per 90 minutes. |
| Yellow cards, total | Statistics | Advanced Search | Total number of yellow cards in a timeframe. |

Source: [https://dataglossary.wyscout.com/player_metrics/](https://dataglossary.wyscout.com/player_metrics/)

## Player metrics

| Appearances                        | Statistics    | Player report           | Appearances
| Appearances in starting lineup     | Statistics    | Player report           | Appearances in starting lineup
| Yellow cards                       | Statistics    | Player report           | Yellow cards
| Red cards                          | Statistics    | Player report           | Red cards
| Goals                              | Statistics    | Player report           | Goals
| Goals / 90                         | Statistics    | Player report           | Goals / 90
| xG                                 | Statistics    | Player report           | xG
| xG / 90                            | Statistics    | Player report           | xG / 90
| Assists total                      | Statistics    | Player report           | Assists total
| Assists / 90                       | Statistics    | Player report           | Assists / 90
| xA                                 | Statistics    | Player report           | xA
| xA / 90                            | Statistics    | Player report           | xA / 90
| Shots total                        | Statistics    | Player report           | Shots total
| Shots / 90                         | Statistics    | Player report           | Shots / 90
| xG/Shot                            | Statistics    | Player report           | xG/Shot
| Passes / 90                        | Statistics    | Player report           | Passes / 90
| Passes accuracy, %                 | Statistics    | Player report           | Passes accuracy, %
| Average pass length, m             | Statistics    | Player report           | Average pass length, m
| Crosses / 90                       | Statistics    | Player report           | Crosses / 90
| Crosses accuracy, %                | Statistics    | Player report           | Crosses accuracy, %
| Accurate crosses / 90              | Statistics    | Player report           | Accurate crosses / 90
| Shot assists / 90                  | Statistics    | Player report           | Shot assists / 90
| Second assists total               | Statistics    | Player report           | Second assists total
| Third assists total                | Statistics    | Player report           | Third assists total
| Touches in penalty area / 90       | Statistics    | Player report           | Touches in penalty area / 90
| Received passes / 90               | Statistics    | Player report           | Received passes / 90
| Received long passes / 90          | Statistics    | Player report           | Received long passes / 90
| Offensive duels / 90               | Statistics    | Player report           | Offensive duels / 90
| Offensive duels success rate, %    | Statistics    | Player report           | Offensive duels success rate, %
| Defensive duels / 90               | Statistics    | Player report           | Defensive duels / 90
| Defensive duels success rate, %    | Statistics    | Player report           | Defensive duels success rate, %
| Aerial duels / 90                  | Statistics    | Player report           | Aerial duels / 90
| Aerial duels success rate, %       | Statistics    | Player report           | Aerial duels success rate, %
| Dribbles / 90                      | Statistics    | Player report           | Dribbles / 90
| Dribbles success rate, %           | Statistics    | Player report           | Dribbles success rate, %
| Successful dribbles / 90           | Statistics    | Player report           | Successful dribbles / 90
| Progressive runs / 90              | Statistics    | Player report           | Progressive runs / 90
| Average progression by progressive runs, m  | Statistics    | Player report           | Average progression by progressive runs, m
| Progressive passes / 90            | Statistics    | Player report           | Progressive passes / 90
| Average progression by progressive passes, m  | Statistics    | Player report           | Average progression by progressive passes, m
| Deep completions / 90              | Statistics    | Player report           | Deep completions / 90
| Deep completed crosses / 90        | Statistics    | Player report           | Deep completed crosses / 90
| Recoveries / 90                    | Statistics    | Player report           | Recoveries / 90
| Recoveries in final third / 90     | Statistics    | Player report           | Recoveries in final third / 90
| Dangerous recoveries / 90          | Statistics    | Player report           | Dangerous recoveries / 90
| Counterpressing recoveries / 90    | Statistics    | Player report           | Counterpressing recoveries / 90
| Goals conceded / 90                | Statistics    | Player report           | Goals conceded / 90
| Shots faced / 90                   | Statistics    | Player report           | Shots faced / 90
| Saves / 90                         | Statistics    | Player report           | Saves / 90
| Save rate, %                       | Statistics    | Player report           | Save rate, %
| xG saved                           | Statistics    | Player report           | xG saved
| xG2                                | Statistics    | Player report           | xG2
| Left foot shots                    | Statistics    | Player report           | Left foot shots
| Head shots                         | Statistics    | Player report           | Head shots
| Right foot shots                   | Statistics    | Player report           | Right foot shots
| Shots total              | Statistics    | Player report           | Shots total
| Shots inside penalty area              | Statistics    | Player report           | Shots inside penalty area
| Shots outside penalty area              | Statistics    | Player report           | Shots outside penalty area
| Shots after crosses              | Statistics    | Player report           | Shots after crosses
| Shots after set pieces              | Statistics    | Player report           | Shots after set pieces
| Shots after direct free kicks and penalties              | Statistics    | Player report           | Shots after direct free kicks and penalties
| Shots on target total              | Statistics    | Player report           | Shots on target total
| Shots on target inside penalty area              | Statistics    | Player report           | Shots on target inside penalty area
| Shots on target outside penalty area              | Statistics    | Player report           | Shots on target outside penalty area
| Shots on target after crosses              | Statistics    | Player report           | Shots on target after crosses
| Shots on target after set pieces              | Statistics    | Player report           | Shots on target after set pieces
| Shots on target after direct free kicks and penalties              | Statistics    | Player report           | Shots on target after direct free kicks and penalties
| xG of shots total              | Statistics    | Player report           | xG of shots total
| xG of shots inside penalty area              | Statistics    | Player report           | xG of shots inside penalty area
| xG of shots outside penalty area              | Statistics    | Player report           | xG of shots outside penalty area
| xG of shots after crosses              | Statistics    | Player report           | xG of shots after crosses
| xG of shots after set pieces              | Statistics    | Player report           | xG of shots after set pieces
| xG of shots after direct free kicks and penalties              | Statistics    | Player report           | xG of shots after direct free kicks and penalties
| Goals total              | Statistics    | Player report           | Goals total
| Goals inside penalty area              | Statistics    | Player report           | Goals inside penalty area
| Goals outside penalty area              | Statistics    | Player report           | Goals outside penalty area
| Goals after crosses              | Statistics    | Player report           | Goals after crosses
| Goals after set pieces              | Statistics    | Player report           | Goals after set pieces
| Goals after direct free kicks and penalties              | Statistics    | Player report           | Goals after direct free kicks and penalties
| Goal conversion              | Statistics    | Player report           | Goal conversion
| Goal conversion inside penalty area              | Statistics    | Player report           | Goal conversion inside penalty area
| Goal conversion outside penalty area              | Statistics    | Player report           | Goal conversion outside penalty area
| Goal conversion after crosses              | Statistics    | Player report           | Goal conversion after crosses
| Goal conversion after set pieces              | Statistics    | Player report           | Goal conversion after set pieces
| Goal conversion after direct free kicks and penalties              | Statistics    | Player report           | Goal conversion after direct free kicks and penalties
| Through passes / 90              | Statistics    | Player report           | Through passes / 90
| Passes to penalty area / 90              | Statistics    | Player report           | Passes to penalty area / 90
| Accurate passes to penalty area, %              | Statistics    | Player report           | Accurate passes to penalty area, %
| Shot assists by receiver              | Statistics    | Player report           | Shot assists by receiver
| xA by receiver              | Statistics    | Player report           | xA by receiver
| Assists by receiver              | Statistics    | Player report           | Assists by receiver
| Crosses from left flank              | Statistics    | Player report           | Crosses from left flank
| Crosses from right flank              | Statistics    | Player report           | Crosses from right flank
| Crosses total              | Statistics    | Player report           | Crosses total
| Accurate crosses from left flank              | Statistics    | Player report           | Accurate crosses from left flank
| Accurate crosses from right flank              | Statistics    | Player report           | Accurate crosses from right flank
| Accurate crosses total              | Statistics    | Player report           | Accurate crosses total
| Ground crosses from left flank              | Statistics    | Player report           | Ground crosses from left flank
| Ground crosses from right flank              | Statistics    | Player report           | Ground crosses from right flank
| Ground crosses total              | Statistics    | Player report           | Ground crosses total
| Cutbacks from left flank              | Statistics    | Player report           | Cutbacks from left flank
| Cutbacks from right flank              | Statistics    | Player report           | Cutbacks from right flank
| Cutbacks total              | Statistics    | Player report           | Cutbacks total
| xA of crosses from left flank              | Statistics    | Player report           | xA of crosses from left flank
| xA of crosses from right flank              | Statistics    | Player report           | xA of crosses from right flank
| xA of crosses total              | Statistics    | Player report           | xA of crosses total
| Assists from crosses from left flank              | Statistics    | Player report           | Assists from crosses from left flank
| Assists from crosses from right flank              | Statistics    | Player report           | Assists from crosses from right flank
| Assists from crosses total              | Statistics    | Player report           | Assists from crosses total
| Crosses by receiver              | Statistics    | Player report           | Crosses by receiver
| Ground crosses by receiver              | Statistics    | Player report           | Ground crosses by receiver
| Shot assists from crosses by receiver              | Statistics    | Player report           | Shot assists from crosses by receiver
| xA of crosses by receiver              | Statistics    | Player report           | xA of crosses by receiver
| Assists from crosses by receiver              | Statistics    | Player report           | Assists from crosses by receiver
| Dribbles by opponent position              | Statistics    | Player report           | Dribbles by opponent position
| Successful dribbles by opponent position              | Statistics    | Player report           | Successful dribbles by opponent position
| Shots after dribbles by opponent position              | Statistics    | Player report           | Shots after dribbles by opponent position
| Shots on target after dribbles by opponent position              | Statistics    | Player report           | Shots on target after dribbles by opponent position
| xG of shots on target after dribbles by opponent position              | Statistics    | Player report           | xG of shots on target after dribbles by opponent position
| Goals after dribbles by opponent position              | Statistics    | Player report           | Goals after dribbles by opponent position
| Recoveries in opponent zone 14              | Statistics    | Player report           | Recoveries in opponent zone 14
| Recoveries in opponent left flank              | Statistics    | Player report           | Recoveries in opponent left flank
| Recoveries in opponent right flank              | Statistics    | Player report           | Recoveries in opponent right flank
| Recoveries in opponent penalty area              | Statistics    | Player report           | Recoveries in opponent penalty area
| Recoveries in final third total              | Statistics    | Player report           | Recoveries in final third total
| Shots after recoveries in opponent zone 14              | Statistics    | Player report           | Shots after recoveries in opponent zone 14
| Shots after recoveries in opponent left flank              | Statistics    | Player report           | Shots after recoveries in opponent left flank
| Shots after recoveries in opponent right flank              | Statistics    | Player report           | Shots after recoveries in opponent right flank
| Shots after recoveries in opponent penalty area              | Statistics    | Player report           | Shots after recoveries in opponent penalty area
| Shots after recoveries in final third total              | Statistics    | Player report           | Shots after recoveries in final third total
| Shots on target after recoveries in opponent zone 14              | Statistics    | Player report           | Shots on target after recoveries in opponent zone 14
| Shots on target after recoveries in opponent left flank              | Statistics    | Player report           | Shots on target after recoveries in opponent left flank
| Shots on target after recoveries in opponent right flank              | Statistics    | Player report           | Shots on target after recoveries in opponent right flank
| Shots on target after recoveries in opponent penalty area              | Statistics    | Player report           | Shots on target after recoveries in opponent penalty area
| Shots on target after recoveries in final third total              | Statistics    | Player report           | Shots on target after recoveries in final third total
| xG of shots on target after recoveries in opponent zone 14              | Statistics    | Player report           | xG of shots on target after recoveries in opponent zone 14
| xG of shots on target after recoveries in opponent left flank              | Statistics    | Player report           | xG of shots on target after recoveries in opponent left flank
| xG of shots on target after recoveries in opponent right flank              | Statistics    | Player report           | xG of shots on target after recoveries in opponent right flank
| xG of shots on target after recoveries in opponent penalty area              | Statistics    | Player report           | xG of shots on target after recoveries in opponent penalty area
| xG of shots on target after recoveries in final third total              | Statistics    | Player report           | xG of shots on target after recoveries in final third total
| Goals after recoveries in opponent zone 14              | Statistics    | Player report           | Goals after recoveries in opponent zone 14
| Goals after recoveries in opponent left flank              | Statistics    | Player report           | Goals after recoveries in opponent left flank
| Goals after recoveries in opponent right flank              | Statistics    | Player report           | Goals after recoveries in opponent right flank
| Goals after recoveries in opponent penalty area              | Statistics    | Player report           | Goals after recoveries in opponent penalty area
| Goals after recoveries in final third total              | Statistics    | Player report           | Goals after recoveries in final third total
| Recoveries in own third              | Statistics    | Player report           | Recoveries in own third
| Recoveries in central third              | Statistics    | Player report           | Recoveries in central third
| Recoveries in final third              | Statistics    | Player report           | Recoveries in final third
| Counterpressing recoveries in own third              | Statistics    | Player report           | Counterpressing recoveries in own third
| Counterpressing recoveries in central third              | Statistics    | Player report           | Counterpressing recoveries in central third
| Counterpressing recoveries in final third              | Statistics    | Player report           | Counterpressing recoveries in final third
| Interceptions in own third              | Statistics    | Player report           | Interceptions in own third
| Interceptions in central third              | Statistics    | Player report           | Interceptions in central third
| Interceptions in final third              | Statistics    | Player report           | Interceptions in final third
| Sliding tackles in own third              | Statistics    | Player report           | Sliding tackles in own third
| Sliding tackles in central third              | Statistics    | Player report           | Sliding tackles in central third
| Sliding tackles in final third              | Statistics    | Player report           | Sliding tackles in final third
| Losses in own third              | Statistics    | Player report           | Losses in own third
| Losses in central third              | Statistics    | Player report           | Losses in central third
| Losses in final third              | Statistics    | Player report           | Losses in final third
| Losses / 90              | Statistics    | Player report           | Losses / 90
| Losses index              | Statistics    | Player report           | Losses index
| Accelerations / 90              | Statistics    | Player report           | Accelerations / 90
| Off the ball moves / 90              | Statistics    | Player report           | Off the ball moves / 90
| xGChain              | Statistics    | Player report           | xGChain
| xGBuildup              | Statistics    | Player report           | xGBuildup
| Forward passes / 90              | Statistics    | Player report           | Forward passes / 90
| Passes to final third / 90              | Statistics    | Player report           | Passes to final third / 90
| Progressive passes with distance 0-20m              | Statistics    | Player report           | Progressive passes with distance 0-20m
| Progressive passes with distance 20-30m              | Statistics    | Player report           | Progressive passes with distance 20-30m
| Progressive passes with distance 30-40m              | Statistics    | Player report           | Progressive passes with distance 30-40m
| Progressive passes with distance 40m+              | Statistics    | Player report           | Progressive passes with distance 40m+
| Progressive passes total              | Statistics    | Player report           | Progressive passes total
| Accurate progressive passes with distance 0-20m              | Statistics    | Player report           | Accurate progressive passes with distance 0-20m
| Accurate progressive passes with distance 20-30m              | Statistics    | Player report           | Accurate progressive passes with distance 20-30m
| Accurate progressive passes with distance 30-40m              | Statistics    | Player report           | Accurate progressive passes with distance 30-40m
| Accurate progressive passes with distance 40m+              | Statistics    | Player report           | Accurate progressive passes with distance 40m+
| Accurate progressive passes total              | Statistics    | Player report           | Accurate progressive passes total
| Won defensive duels in own zone 14              | Statistics    | Player report           | Won defensive duels in own zone 14
| Won defensive duels in own left flank              | Statistics    | Player report           | Won defensive duels in own left flank
| Won defensive duels in own right flank              | Statistics    | Player report           | Won defensive duels in own right flank
| Won defensive duels in own penalty area              | Statistics    | Player report           | Won defensive duels in own penalty area
| Won defensive duels in own third total              | Statistics    | Player report           | Won defensive duels in own third total
| Interceptions in own zone 14              | Statistics    | Player report           | Interceptions in own zone 14
| Interceptions in own left flank              | Statistics    | Player report           | Interceptions in own left flank
| Interceptions in own right flank              | Statistics    | Player report           | Interceptions in own right flank
| Interceptions in own penalty area              | Statistics    | Player report           | Interceptions in own penalty area
| Interceptions in own third total              | Statistics    | Player report           | Interceptions in own third total
| Sliding tackles in own zone 14              | Statistics    | Player report           | Sliding tackles in own zone 14
| Sliding tackles in own left flank              | Statistics    | Player report           | Sliding tackles in own left flank
| Sliding tackles in own right flank              | Statistics    | Player report           | Sliding tackles in own right flank
| Sliding tackles in own penalty area              | Statistics    | Player report           | Sliding tackles in own penalty area
| Sliding tackles in own third total              | Statistics    | Player report           | Sliding tackles in own third total
| Lost defensive duels in own zone 14              | Statistics    | Player report           | Lost defensive duels in own zone 14
| Lost defensive duels in own left flank              | Statistics    | Player report           | Lost defensive duels in own left flank
| Lost defensive duels in own right flank              | Statistics    | Player report           | Lost defensive duels in own right flank
| Lost defensive duels in own penalty area              | Statistics    | Player report           | Lost defensive duels in own penalty area
| Lost defensive duels in own third total              | Statistics    | Player report           | Lost defensive duels in own third total
| Shots after lost defensive duels in own zone 14              | Statistics    | Player report           | Shots after lost defensive duels in own zone 14
| Shots after lost defensive duels in own left flank              | Statistics    | Player report           | Shots after lost defensive duels in own left flank
| Shots after lost defensive duels in own right flank              | Statistics    | Player report           | Shots after lost defensive duels in own right flank
| Shots after lost defensive duels in own penalty area              | Statistics    | Player report           | Shots after lost defensive duels in own penalty area
| Shots after lost defensive duels in own third total              | Statistics    | Player report           | Shots after lost defensive duels in own third total
| Shots on target after lost defensive duels in own zone 14              | Statistics    | Player report           | Shots on target after lost defensive duels in own zone 14
| Shots on target after lost defensive duels in own left flank              | Statistics    | Player report           | Shots on target after lost defensive duels in own left flank
| Shots on target after lost defensive duels in own right flank              | Statistics    | Player report           | Shots on target after lost defensive duels in own right flank
| Shots on target after lost defensive duels in own penalty area              | Statistics    | Player report           | Shots on target after lost defensive duels in own penalty area
| Shots on target after lost defensive duels in own third total              | Statistics    | Player report           | Shots on target after lost defensive duels in own third total
| xG of shots after lost defensive duels in own zone 14              | Statistics    | Player report           | xG of shots after lost defensive duels in own zone 14
| xG of shots after lost defensive duels in own left flank              | Statistics    | Player report           | xG of shots after lost defensive duels in own left flank
| xG of shots after lost defensive duels in own right flank              | Statistics    | Player report           | xG of shots after lost defensive duels in own right flank
| xG of shots after lost defensive duels in own penalty area              | Statistics    | Player report           | xG of shots after lost defensive duels in own penalty area
| xG of shots after lost defensive duels in own third total              | Statistics    | Player report           | xG of shots after lost defensive duels in own third total
| Goals after lost defensive duels in own zone 14              | Statistics    | Player report           | Goals after lost defensive duels in own zone 14
| Goals after lost defensive duels in own left flank              | Statistics    | Player report           | Goals after lost defensive duels in own left flank
| Goals after lost defensive duels in own right flank              | Statistics    | Player report           | Goals after lost defensive duels in own right flank
| Goals after lost defensive duels in own penalty area              | Statistics    | Player report           | Goals after lost defensive duels in own penalty area
| Goals after lost defensive duels in own third total              | Statistics    | Player report           | Goals after lost defensive duels in own third total
| Aerial duels in own zone 14              | Statistics    | Player report           | Aerial duels in own zone 14
| Aerial duels in own left flank              | Statistics    | Player report           | Aerial duels in own left flank
| Aerial duels in own right flank              | Statistics    | Player report           | Aerial duels in own right flank
| Aerial duels in own penalty area              | Statistics    | Player report           | Aerial duels in own penalty area
| Aerial duels in own third total              | Statistics    | Player report           | Aerial duels in own third total
| Aerial duels won in own zone 14              | Statistics    | Player report           | Aerial duels won in own zone 14
| Aerial duels won in own left flank              | Statistics    | Player report           | Aerial duels won in own left flank
| Aerial duels won in own right flank              | Statistics    | Player report           | Aerial duels won in own right flank
| Aerial duels won in own penalty area              | Statistics    | Player report           | Aerial duels won in own penalty area
| Aerial duels won in own third total              | Statistics    | Player report           | Aerial duels won in own third total
| Shots faced total              | Statistics    | Player report           | Shots faced total
| Shots faced inside penalty area              | Statistics    | Player report           | Shots faced inside penalty area
| Shots faced outside penalty area              | Statistics    | Player report           | Shots faced outside penalty area
| Shots faced after crosses              | Statistics    | Player report           | Shots faced after crosses
| Shots faced after set pieces              | Statistics    | Player report           | Shots faced after set pieces
| Shots faced after direct free kicks and penalties              | Statistics    | Player report           | Shots faced after direct free kicks and penalties
| xG2 of shots faced total              | Statistics    | Player report           | xG2 of shots faced total
| xG2 of shots faced inside penalty area              | Statistics    | Player report           | xG2 of shots faced inside penalty area
| xG2 of shots faced outside penalty area              | Statistics    | Player report           | xG2 of shots faced outside penalty area
| xG2 of shots faced after crosses              | Statistics    | Player report           | xG2 of shots faced after crosses
| xG2 of shots faced after set pieces              | Statistics    | Player report           | xG2 of shots faced after set pieces
| xG2 of shots faced after direct free kicks and penalties              | Statistics    | Player report           | xG2 of shots faced after direct free kicks and penalties
| Goal conceded total              | Statistics    | Player report           | Goal conceded total
| Goal conceded inside penalty area              | Statistics    | Player report           | Goal conceded inside penalty area
| Goal conceded outside penalty area              | Statistics    | Player report           | Goal conceded outside penalty area
| Goal conceded after crosses              | Statistics    | Player report           | Goal conceded after crosses
| Goal conceded after set pieces              | Statistics    | Player report           | Goal conceded after set pieces
| Goal conceded after direct free kicks and penalties              | Statistics    | Player report           | Goal conceded after direct free kicks and penalties
| Opponents’ goal conversion              | Statistics    | Player report           | Opponents’ goal conversion
| Opponents’ goal conversion inside penalty area              | Statistics    | Player report           | Opponents’ goal conversion inside penalty area
| Opponents’ goal conversion outside penalty area              | Statistics    | Player report           | Opponents’ goal conversion outside penalty area
| Opponents’ goal conversion after crosses              | Statistics    | Player report           | Opponents’ goal conversion after crosses
| Opponents’ goal conversion after set pieces              | Statistics    | Player report           | Opponents’ goal conversion after set pieces
| Opponents’ goal conversion after direct free kicks and penalties              | Statistics    | Player report           | Opponents’ goal conversion after direct free kicks and penalties
| Quick breaks / 90              | Statistics    | Player report           | Quick breaks / 90
| Goal kicks to own third              | Statistics    | Player report           | Goal kicks to own third
| Goal kicks to central third              | Statistics    | Player report           | Goal kicks to central third
| Goal kicks to final third              | Statistics    | Player report           | Goal kicks to final third
| Accurate goal kicks to own third              | Statistics    | Player report           | Accurate goal kicks to own third
| Accurate goal kicks to central third              | Statistics    | Player report           | Accurate goal kicks to central third
| Accurate goal kicks to final third              | Statistics    | Player report           | Accurate goal kicks to final third
| Passes from play with distance 0-20m              | Statistics    | Player report           | Passes from play with distance 0-20m
| Passes from play with distance 20-30m              | Statistics    | Player report           | Passes from play with distance 20-30m
| Passes from play with distance 30-40m              | Statistics    | Player report           | Passes from play with distance 30-40m
| Passes from play with distance 40m+              | Statistics    | Player report           | Passes from play with distance 40m+
| Passes from play total              | Statistics    | Player report           | Passes from play total
| Accurate passes from play with distance 0-20m              | Statistics    | Player report           | Accurate passes from play with distance 0-20m
| Accurate passes from play with distance 20-30m              | Statistics    | Player report           | Accurate passes from play with distance 20-30m
| Accurate passes from play with distance 30-40m              | Statistics    | Player report           | Accurate passes from play with distance 30-40m
| Accurate passes from play with distance 40m+              | Statistics    | Player report           | Accurate passes from play with distance 40m+
| Accurate passes from play total              | Statistics    | Player report           | Accurate passes from play total
| Long pass share followed by duel, %              | Statistics    | Player report           | Long pass share followed by duel, %
| Hand passes to left flank              | Statistics    | Player report           | Hand passes to left flank
| Hand passes to center              | Statistics    | Player report           | Hand passes to center
| Hand passes to right flank              | Statistics    | Player report           | Hand passes to right flank
| Hand passes total              | Statistics    | Player report           | Hand passes total
| Accurate hand passes to left flank              | Statistics    | Player report           | Accurate hand passes to left flank
| Accurate hand passes to center              | Statistics    | Player report           | Accurate hand passes to center
| Accurate hand passes to right flank              | Statistics    | Player report           | Accurate hand passes to right flank
| Accurate hand passes total              | Statistics    | Player report           | Accurate hand passes total
| Crosses against / 90              | Statistics    | Player report           | Crosses against / 90
| Actions per cross faced              | Statistics    | Player report           | Actions per cross faced
| Crosses against from left flank              | Statistics    | Player report           | Crosses against from left flank
| Crosses against from right flank              | Statistics    | Player report           | Crosses against from right flank
| Ground crosses against from left flank              | Statistics    | Player report           | Ground crosses against from left flank
| Ground crosses against from right flank              | Statistics    | Player report           | Ground crosses against from right flank
| Shots conceded after crosses against from left flank              | Statistics    | Player report           | Shots conceded after crosses against from left flank
| Shots conceded after crosses against from right flank              | Statistics    | Player report           | Shots conceded after crosses against from right flank
| Goals conceded after crosses against from left flank              | Statistics    | Player report           | Goals conceded after crosses against from left flank
| Goals conceded after crosses against from right flank              | Statistics    | Player report           | Goals conceded after crosses against from right flank
| Set pieces against / 90              | Statistics    | Player report           | Set pieces against / 90
| Actions per set piece faced              | Statistics    | Player report           | Actions per set piece faced
| Corners against from left flank              | Statistics    | Player report           | Corners against from left flank
| Corners against from right flank              | Statistics    | Player report           | Corners against from right flank
| Shots conceded after corners against from left flank              | Statistics    | Player report           | Shots conceded after corners against from left flank
| Shots conceded after corners against from right flank              | Statistics    | Player report           | Shots conceded after corners against from right flank
| Goals conceded after corners against from left flank              | Statistics    | Player report           | Goals conceded after corners against from left flank
| Goals conceded after corners against from right flank              | Statistics    | Player report           | Goals conceded after corners against from right flank
| Sweeps / 90              | Statistics    | Player report           | Sweeps / 90
| Short passes outside penalty area by receiver              | Statistics    | Player report           | Short passes outside penalty area by receiver
| Accurate short passes outside penalty area by receiver              | Statistics    | Player report           | Accurate short passes outside penalty area by receiver
| Long passes outside penalty area by receiver              | Statistics    | Player report           | Long passes outside penalty area by receiver
| Accurate long passes outside penalty area by receiver              | Statistics    | Player report           | Accurate long passes outside penalty area by receiver

Source: [https://dataglossary.wyscout.com/player_metrics_more/](https://dataglossary.wyscout.com/player_metrics_more/)

## Player reports

#### Rankings

For every position, there's a set of parameters that are selected for the player rankings section in the player report.

- _Goalkeepers_: Conceded goals, Shots faced, Saves, xG saved, Recoveries, Defensive duels, Aerial duels, Passes, Average pass length
- _Full-backs_: Recoveries, Counterpressing recoveries, Defensive duels, Offensive duels, Dribbles, Passes, Crosses, Average pass length, Progressive runs, Progressive passes, Deep completions, Deep completed crosses, Goals, xG, Assists, xA, Shots, xG per shot, Shot assists
- _Central defenders_: Recoveries, Counterpressing recoveries, Defensive duels, Aerial duels Offensive duels, Dribbles, Passes, Average pass length, Progressive runs, Progressive passes, Deep completions, Deep completed crosses
- _Midfielders_: Goals, xG, Assists, xA, Shots, xG per shot, Passes, Crosses, Shot assists, Offensive duels, Defensive duels, Aerial duels, Dribbles, Progressive runs, Progressive passes, Deep completions, Deep completed crosses, Recoveries, Counterpressing recoveries
- _Forwards_: Goals, xG, Assists, xA, Shots, xG per shot, Passes, Crosses, Shot assists, Second assists, Touches in penalty area, Received passes, Received long passes, Offensive duels, Dribbles, Progressive runs, Progressive passes, Recoveries in final third, Counterpressing recoveries

Source: [https://dataglossary.wyscout.com/player_reports/](https://dataglossary.wyscout.com/player_reports/)

## Possession-adjusted

Possession-adjusted (styled as _PAdj_ or _Opp30_) is a method to calculate _defensive_ statistics to take possession values into account.

While the average duration of the match is slighly on rise every year and is at 95 minutes 30 seconds for 2019, the pure time of ball in play is in decrease and is generally between 50 and 60 minutes depending on the league. Wyscout took 60 minutes as a reasonable value to adjust possession-dependent stats to.

The logic for adjusting defensive statistics is the following: you can only make defensive contribution when you're not in the possession of the ball. Therefore, when you look for high defensive values, normally you would only encounter the defenders of the lower teams in the league: their defenders, being dominated by a possession-leading team, are forced to make more actions (defensive duels, interception, sliding tackles etc.). The defenders of possession-based teams are naturally making less actions. Adjusting these values to the possession (_as if_ the match was played with a 50%/50% possession) gives further insight to the frequency of defensive actions.

_Example:_

In the match of AFC Bournemouth - Manchester City (0:1, 2 March 2019) Man City had had 80% of possession (42:37 pure possession time), while Bournemouth only had 20% (10:35 pure possession time).

Aké, who played the whole match for Bournemouth, had 10 interceptions. His PAdj interceptions value would be: 10 / 42.5 * 30 = 7.06.

Walker, who played the whole match for Man City, had 5 interceptions. His PAdj interceptions value would be: 5 / 10.5 * 30 = 14.3.

Therefore, while Walker made only half of interceptions of Aké, the huge difference in possession make his possession-adjusted value twice higher.

Source: [https://dataglossary.wyscout.com/p_adj/](https://dataglossary.wyscout.com/p_adj/)

## PPDA

#### PPDA (Passes per defensive action)

A metric to quantify high press intensity introduced by Colin Trainor in 2014*.

Only events in a subset of the field (final 60%), as described on the figure, are taken in consideration:

![PPDA zone](https://sun9-24.userapi.com/c857228/v857228728/7ccd4/kFFH4Okoa1Q.jpg)

In this zone, we calculate all opponent passes that started there and divide them by the sum of defensive actions (fouls, interceptions, won defensive duels, sliding tackles) of the pressing team and divide opponent passes by defensive actions.

Example:

In the Liverpool-Manchester United match of 20 October 2019, Manchester United had 207 passes in their lower 60% zone, while Liverpool had 10 won defensive duels, 16 interceptions, 11 fouls and 3 sliding tackles in this area. 207 / (10 + 16 + 11 + 3) = 5.2. This is the value of PPDA for Liverpool.

In the same match, Liverpool had 404 passes in the lower 60% zone, while Manchester United had won 6 defensive duels, 10 interceptions, 4 fouls and 3 sliding tackles. 404 / (6 + 10 + 4 + 3) = 17.6. This is the value of PPDA for Manchester United.

Notice that Manchester United had allowed much more Liverpool passes in their defensive zone. Basically PPDA reflects how many passes in the opponent defensive zone the opponent can make per one challenge. The lower this number, the better the team is doing high pressing. In top five European leagues for 2018/2019 the average PPDA per season is 11.01. The best team in PPDA in top five leagues 2018/2019 is Eibar with whopping 6.72, and Nürnberg has the least PPDA (18.21).

Source: [https://dataglossary.wyscout.com/ppda/](https://dataglossary.wyscout.com/ppda/)

## Wyscout Index

An index (available in the Rankings app) that sorts players in a competition for each position based on their stats.

![Wyscout Index Bundesliga](https://dataglossary.wyscout.com/static/5fddd112a03c2162f1435e12649e8d3d/a3357/wyscout-index.png)

_Top 11 team according to wyscout index in Bundesliga 2019/2020_

For every position, there's a set of parameters that are taken in consideration in the final ranking. Here's a sample (not exhaustive) list of top relevant stats per position.

- _Goalkeeper_: Conceded goals, Goal mistakes, Saves, Shots faced, Penalty saves, Exits from the line, Pass accuracy.
- _Full-back_: Accelerations, Crosses, Defensive duels won, Sliding tackles, Key passes, Clearances, Pressing attempts, Interceptions, Loose ball duels won, Dribbles won
- _Centre-back_: Team conceded goals, Defensive duels won, Loose ball duels won, Interceptions, Clearances, Aerial duels won, Sliding tackles, Lost balls, Blocked shots, Yellow/red cards, Pass accuracy.
- _Defensive midfielder_: Goals, Chances created, Dribbles won, Shots on target, Loose ball duels won, Assists, Passes, Through passes, Sliding tackles, Interceptions
- _Central midfielder_: Goals, Chances created, Through passes, Loose ball duels won, Shots on target, Pressing attempts, Assists, Aerial duels won, Interceptions, Defensive duels won
- _Attacking midfielder_: Goals, Chances created, Dribbles won, Through passes, Shots on target, Assists, Crosses, Accelerations, Loose ball duels won, Pressing attempts
- _Winger:_ Goals, Shots on target, Assists, Through passes, Crosses, Chances created, Acceleration, Driibles won, Loose ball duels won, Aerial duels won
- _Forward_: Goals, Chances created, Through passes, Assists, Shots, Dribbles won, Shots on target, Duels won, Crosses, Link-up plays

Every stat is assigned a weight, either positive on negative. Based on this, the algorithm calculates the distribution inside a season and assigns values linearly according to minimum and maximum values in the league. For example, the goalkeeper with most goals conceded would receive -4.6 points, and the one with least goals conceded would have a zero: the value for goalkeepers in the middle would be distributed linearly.

The index is calculated a sum of statistical params multiplied by weights as described above.

The index is updated after every match played.

Source: [https://dataglossary.wyscout.com/wyscout_index/](https://dataglossary.wyscout.com/wyscout_index/)

## xA

Expected assist (xA) value for a pass is the value of expected goals (xG) of the shot that this pass led to.

In order to qualify for this, the pass should be a 'shot assist' (see the definition in our glossary).

Besides regular passes, crosses, corners servings, throw ins and passes from free kicks that are followed by shots can also have xA value. Suffered fouls that result in penalties or direct free kicks are not included (as goals scored from these events are not qualified as assisted).

If a pass is made and a player is offside, this is just un unsuccessful pass, so it cannot have an xA value, even if a player scores after this. Same logic is applied to VAR-cancelled goals, no actions after a VAR-found foul or offside are recorded.

Source: [https://dataglossary.wyscout.com/xa/](https://dataglossary.wyscout.com/xa/)

## xG

Expected goals (xG) is a predictive ML model used to assess the likelihood of scoring for every shot made in the game.

For every shot, the xG model calculates the probability to score based on event parameters:

- Location of the shot
- Location of the assist
- Foot or head
- Assist type
- Was there a dribble of a field player or a goalkeeper immediately before the shot?
- Is it coming from a set piece?
- Was the shot a counterattack or did it happen in a transition?
- Tagger's assessment of the danger of the shot

These parameters (plus a few technical ones) are used to train the xG model on the historical Wyscout data and predict the probability of the shot being scored.

The probabilities range between 0 and 1. A shot of 0.1 xG means a shot like this should be scored 10% of the time. A shot of 0.8 xG means a shot like this should be scored 80% of the time. A penalty xG value is fixed to 0.76.

![Shot](https://dataglossary.wyscout.com/static/17fa59939729ae8b02a301e25135e3c8/b0254/635719742.png)

_M. de Roon with 0.006 xG shot_

![Shot](https://dataglossary.wyscout.com/static/a860641cdd71245877f42ce281a28d99/ba0a7/678490445.png)

_S. Mané with 0.85 xG shot_

At the moment there are no additional constraints for xG of shots in the same possession. So a sequence of shots in short succession (like a rebound after a save) could theoretically yield an xG value of > 1. Currently they are considered to be different shots and all xG values are calculated at the shot level.

#### Pre-shot and post-shot xG

The pre-shot xG model (or ‘xG' for short) is trained on all shots (including blocked shots and shots wide), only using the information at the moment the shot is token. However, Wyscout also calculates post-shot xG (’PSxG' for short or 'xCG' in goalkeeper context for 'Expected conceded goals'). Here only shots on target are used in training (all blocked shots and shots wide automatically have a post-shot xG value of 0), and parameters like the coordinates of the goal where the shot is estimated to go in are included. The post-shot xG for a given shot is usually higher than the pre-shot and can reflect finishing skills. Post-shot xG is especially valuable for evaluating goalkeeper impact on conceded goals.

Source: [https://dataglossary.wyscout.com/xg/](https://dataglossary.wyscout.com/xg/)

