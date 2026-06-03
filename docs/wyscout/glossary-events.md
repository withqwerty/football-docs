---
source_url: https://dataglossary.wyscout.com/
source_type: crawled
upstream_version: null
crawled_at: 2026-06-03
---

# Wyscout Glossary — Events

Prose definitions for Wyscout event tags, from the official Data Glossary, with the original figures permalinked. These describe **what each tag means** (the rules behind the values in [event-types.md](event-types.md)) and the data model used across the Wyscout Platform, reports and the API (v3 and v4). Some entries also list legacy **API tagId** values. Glossary entry names can differ slightly from API tag strings — match on meaning; see [event-types.md](event-types.md) for exact values.

## Acceleration

A run with the ball with a significant speed up.

![Acceleration with the ball](https://dataglossary.wyscout.com/static/d51933c38d14a49b5e2b8602a028a903/9ef2e/02181271616.jpg)

_Fede Valverde accelerating with the ball_

![Acceleration towards the ball](https://dataglossary.wyscout.com/static/c906f935ed7497982d66de88e50faaa3/476b1/382369175.jpg)

_Eden Hazard accelerating towards the ball_

#### Details

- Accelerations are only tagged for meaningful runs, at least 10 meters long.
- The player should touch the ball, otherwise, a meaningful run in the open space would be an [Off the ball move](/off_the_ball).
- About half of accelerations are also [Progressive runs](/progressive_run).

#### Available metrics

#### Accelerations / 90

Number of accelerations normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/acceleration/](https://dataglossary.wyscout.com/acceleration/)

## Aerial duel

When two or more players from opposing teams jump to compete for the ball.

![Aerial duel](https://dataglossary.wyscout.com/static/459f345b17eca1836cfd19648dcfaf83/4c1ae/457702617.jpg)

_An aerial duel following a corner kick_

#### Details

- Aerial duels aren’t currently divided into offensive and defensive categories.
- If there are more then two players competing for the ball at the same time, an aerial duel will be recorded for all opposing players.

#### Attributes

#### Successful: Yes (API tagId: 703) / No (API tagId: 701); first_touch in the match_events beta API

An aerial duel is considered won in favour of the player who touches the ball first, no matter what happens next. An aerial duel that results in a foul is considered won in favour of the player who suffered a foul.

#### Available metrics

#### Aerial duels / 90 minutes

Number of aerial duels normalized per 90 minutes.

#### Aerial duels won (%)

Percentage of aerial duels won.

Source: [https://dataglossary.wyscout.com/aerial_duel/](https://dataglossary.wyscout.com/aerial_duel/)

## Assist

The last action of a player from the goalscoring team, prior to the [Goal](/goal) being scored by a teammate, or an [Own goal](/own_goal).

![Assist](https://dataglossary.wyscout.com/static/4956fb3739166e3854e709de7e925335/476b1/453803712.jpg)

_An assist from José Callejón to A. Milik_

#### Details

- Since Goal is always a [Shot](/shot), any Assist is, by definition, a [Shot assist](/shot_assist).
- Number of assists in a single match is guaranteed to be equal to or less than the number of goals.
- No opponent player should control the ball between the last action and the goal, otherwise it won’t qualify as an assist.
- If a [dribble](/dribble) or a significant [run](/run) by the goal scorer happens between the last teammate action and the goal, it is not considered an assist.
- [Penalty foul](/penalty_foul) suffered, when the penalty is scored by the same player or a teammate, is not considered an assist.

#### Available metrics

#### Assists / 90

Number of assists normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/assist/](https://dataglossary.wyscout.com/assist/)

## Ball out

The ball wholly passes over the boundaries of the pitch according to law 9 of the IFAB Laws of the Game.

#### Details

- When the ball goes out of the pitch over the touchline, either a [Goal kick](/goal_kick) or a [Corner kick](/corner_kick) should necessary be awarded based on who made the last touch.
- When the ball goes out of the pitch over the byline, a [Throw-in](/throw_in) should necessarily be awarded.

Source: [https://dataglossary.wyscout.com/ball_out/](https://dataglossary.wyscout.com/ball_out/)

## Clearance

An **Action** (generally a pass) when the player, while having other option, to pass or to hold the ball, is instead clearing it, either with a long pass forward without a precise target or for a throw in/corner kick, playing safe.

![Clearance after a cross](https://dataglossary.wyscout.com/static/699b1b973930aa1ca3f1ce3a05798ef3/1b46f/440689964.jpg)

_Clearance after a cross_

#### Details

- Most of the time the player clearing the ball would be under pressure.
- A significant amount of clearances are [Long forward passes](/long_pass).
- About half of clearances are [Interceptions](/interception) (a player is interrupting a pass to clear the ball out).

#### Available metrics

#### Clearances / 90

Number of clearances normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/clearance/](https://dataglossary.wyscout.com/clearance/)

## Corner kick

A corner kick served as specified in law 17 IFAB Laws of the Game.

![Corner kick](https://dataglossary.wyscout.com/static/6ec8fbeeafb34ec30ce1730740a8fa74/476b1/217276161.jpg)

_Corner kick_

#### Details

- Always happens after a [Ball out](/ball_out).
- If a referee decides to repeat a corner kick after a foul or any particular situation that happened before the corner kick was served, only the last instance of the corner kick is tagged.
- A corner is not considered a [Pass](/pass).
- A corner that is immediately followed by a goalkeeper save or a direct goal is considered a [Shot](/shot).

#### Attributes

#### Height: high (API tagId 801), low (API tagId 802)

Height of a corner kick. A short-played corner would always have low height.

#### Scheme: Yes / No

A scheme attribute is set for a corner kick if it's played in a way that required synchronization of different player moves and appears to be pre-trained.

Source: [https://dataglossary.wyscout.com/corner/](https://dataglossary.wyscout.com/corner/)

## Counterattack

A transition of the possession from the opponent team, where the team is transitioning quickly from defensive to attacking phase, trying to catch the opponent out of their defensive shape.

![Counterattack](https://dataglossary.wyscout.com/static/5d4d8583d29fee241b4141381abece5f/5d8bd/443529102.png)

_Counterattack by Borussia Dortmund_

Source: [https://dataglossary.wyscout.com/counterattack/](https://dataglossary.wyscout.com/counterattack/)

## Counterpressing recovery

Any **Recovery** that ends a **Possession** of the opposition team with length less than 5 seconds.

Source: [https://dataglossary.wyscout.com/counterpressing_recovery/](https://dataglossary.wyscout.com/counterpressing_recovery/)

## Covering teammate

#### Covering teammate (Covering depth)

A defensive non-ball run to cover a zone left empty by a teammate.

![S. de Vrij covering teammate](https://dataglossary.wyscout.com/static/4a88ed61b32330ef5fa7f82b3ca667d3/476b1/430586547.jpg)

_S. de Vrij covering teammate on a flank_

#### Details

- A characteristic movement of covering teammate is a back or diagonal run from a normal player's position to cover the empty zone.
- Predominantly happens in the own third, with an average distance from own goal of 20 meters.

Source: [https://dataglossary.wyscout.com/covering_depth/](https://dataglossary.wyscout.com/covering_depth/)

## Cross

A ball played from the offensive flanks aimed towards a teammate in the area in front of the opponent’s goal.

![Cross into the penalty area](https://dataglossary.wyscout.com/static/46f9eb36ad1dc64c32c4a3d11e713592/1b46f/438002966.jpg)

_Cross into the penalty area_

#### Details

- Includes just open play crosses, not set play crosses (corners/free kicks).

#### Attributes

#### Height: high (API tagId 801), low (API tagId 802), blocked (API tagId 2101)

Height of a cross:

- High: indicates a cross over waist height
- Low: indicates a cross below waist height
- Blocked crosses are not distinguished by height

#### Successful: Yes (API tagId: 1801) / No (API tagId: 1802)

A cross is considered successful if the next touch is by a teammate.

#### Foot: Left (API tagId 401) / Right (API tagId 402)

The foot that the played delivered the cross with.

#### Flank: Left / Right

A normalized field width of 68 meters is divided in thirds, where the left flank is considered to be the leftmost 23 meters, and the right flank, the rightmost 23 meters.

![Cross scheme](https://dataglossary.wyscout.com/static/58710cb57a67a709a7c1aa95ea1ba5b8/0fa9c/cross-flanks.png)

#### Available metrics

#### Crosses / 90

Number of cross attempts normalized per 90 minutes.

#### Cross accuracy

Percentage of successful crosses.

#### Crosses from left flank, per 90

Number of cross attempts normalized per 90 minutes that are delivered from the left flank (the leftmost 23 meters).

#### Cross accuracy from left flank (%)

Percentage of successful crosses from the left flank (the leftmost 23 meters).

#### Crosses from right flank, per 90

Number of cross attempts normalized per 90 minutes that are delivered from the right flank (the rightmost 23 meters).

#### Cross accuracy from right flank (%)

Percentage of successful crosses from the right flank (the rightmost 23 meters).

#### Crosses to six-yard box, per 90 mins

Number of cross attempts with a next touch inside the six-yard box normalized per 90 minutes.

#### Cross accuracy to six-yard box (%)

Percentage of successful crosses with a next touch inside the six-yard box.

Source: [https://dataglossary.wyscout.com/cross/](https://dataglossary.wyscout.com/cross/)

## Deep completed cross

A [Cross](/cross) that is targeted to the zone within 20 meters of the opponent goal.

![Deep completions pass map deep-completion-map](https://dataglossary.wyscout.com/static/72b3f9276dfee2cd47016c65fa4eee24/41913/deep-completion-map.png)

_Map of the area where the cross should be targeted to quailfy as a deep completed cross_

![K. Volland with a deep completed cross](https://dataglossary.wyscout.com/static/7605d1dcfa4ff42894ce326b4883a5ff/4c1ae/420635169.jpg)

_L. Alario heading a deep completed cross from K. Volland_

#### Available metrics

#### Deep completed crosses / 90

Number of deep completed crosses attempted per 90 minutes.

Source: [https://dataglossary.wyscout.com/deep_completed_cross/](https://dataglossary.wyscout.com/deep_completed_cross/)

## Deep completion

A non-cross [Pass](/pass) that is targeted to the zone within 20 meters of the opponent’s goal.

![Deep completions pass map deep-completion-map](https://dataglossary.wyscout.com/static/72b3f9276dfee2cd47016c65fa4eee24/41913/deep-completion-map.png)

_Map of the area where the pass should be targeted to qualify as a deep completion_

![Cristiano Ronaldo with a deep completion](https://dataglossary.wyscout.com/static/4a9ec02b0b4085dc91afe614875ced68/7a285/447517993.jpg)

_Cristiano Ronaldo with a deep completion_

#### Details

- While it's a subtype of Pass, the [Crosses](/cross) are excluded from this definition. For this, see [Deep completed cross](/deep_completed_cross).

#### Available metrics

#### Deep completions passes / 90

Number of deep completions made per 90 minutes.

Source: [https://dataglossary.wyscout.com/deep_competion/](https://dataglossary.wyscout.com/deep_competion/)

## Defensive duel

When a player attempts to dispossess an opposition player to stop an attack progressing.

![S. Kryvtsov in a defensive duel against İ. Gündoğan.](https://dataglossary.wyscout.com/static/55e21819f789e68863cf6073340b617f/03f8b/438473555.jpg)

_S. Kryvtsov in a defensive duel against İ. Gündoğan._

#### Details

- A Defensive duel is always paired to an [Offensive Duel](/offensive_duel) from the player of another team.

#### Attributes

#### Successful: Yes / No

If the defensive player stopped the progression of the attacking player with the ball and didn't commit a foul, the defensive duel is considered won (and the linked offensive duel is considered lost). See the full definition in [Offensive Duel](/offensive_duel).

Examples of a won defensive duel:

- defending player dispossesses the attacker
- defending player kicks the ball out
- the attacker stays with the ball, but the defender forces him to go back

If a defending player lets the attacking player progress with the ball, it's considered a lost defensive duel (and a won **Offensive duel** for the player with the ball, see **Offensive duel** for more details).

#### Outcome: Clearly won (API tagId 703) / Clearly lost (API tagId 701) / Neutral (API tagId 702)

A less sophisticated algorithm for defining the outcome of the duel. If the next action of the duel is one of the players in the duel, the duel is assigned a clearly won value to this player and a clearly lost value for his opponent. All other cases are neutral.

#### Anticipation (API tagId: 20): Yes / No

A defensive player is positioning himself better to reach the ball first. Used together with the **Beaten to the ball** attribute in a corresponding [Offensive duel](/offensive_duel).

#### Available metrics

#### Defensive duels / 90 minutes

Number of defensive duels normalized per 90 minutes.

#### Defensive duels won (%)

Percentage of won defensive duels.

Source: [https://dataglossary.wyscout.com/defensive_duel/](https://dataglossary.wyscout.com/defensive_duel/)

## Defensive positioning

A defensive run by a player to take back his position in the defense and/or to prevent an imminent attacking danger from the opposition.

![L. Fejsa covering in the defense.](https://dataglossary.wyscout.com/static/664a30a1b2f82891ec3137c33bbeed3c/476b1/414313552.jpg)

_L. Fejsa covering in the defense._

#### Details

- A error in positioning in defensive phase would be tagged as a defensive positioning with special attribute set to **bad**.

Source: [https://dataglossary.wyscout.com/defensive_positioning/](https://dataglossary.wyscout.com/defensive_positioning/)

## Dribble

An attempt to move past an opposing player whilst trying to maintain possession of the ball.

![Dribble with a take-on](https://dataglossary.wyscout.com/static/206f261fa5e23eddba97c14610459eeb/7a285/438519797.jpg)

_Fede Valverde with a take-on_

![Dribble with space](https://dataglossary.wyscout.com/static/59787f0a1b8e35a2fbff9ae4e1b25b7b/5ba07/473518353.jpg)

_Marcelo doing a dribble with space_

#### Details

- The player that has the possession of the ball is using their ability in an attempt to move past the opposition player or to find a free zone for the next action (see **Type**).
- When a player shields and guards the ball using his physical strength, this is not a dribble, but it is still an [Offensive Duel](/offensive_duel).

#### Attributes

#### Successful: Yes / No

- If the next action following the duel is by the same offensive player and that action is closer to the opponent’s goal, or;
- If the duel was a dribble and it's followed by a touch of an attacking teammate closer to the opponent goal (i.e. successful forward pass for the attacking player from a dribble), or:
- If the duel ended in a foul from the defensive player

The scenarios above result in a dribble won. Everything else qualifies as an dribble lost (and a won [Defensive duel](/defensive_duel) for a defender).

#### Side: Left (API tagIds 502, 503) / Right (API tagIds 501, 504)

The side that the attacking player attempts to dribble past an opponent.

#### Type: Take-on (API tagIds 503, 504) / Space (API tagIds 501, 502)

The **Space** type is used when the attacking player dribbles past an opponent to create space for his next action. The **Take-on** dribble is a stricter attempt to dribble past the opposite player. The dribble definition includes both these types of dribbles.

#### Available metrics

#### Dribbles / 90

Number of dribble attempts normalized per 90 minutes.

#### Dribbles %

Percentage of successful dribbles.

Source: [https://dataglossary.wyscout.com/dribble/](https://dataglossary.wyscout.com/dribble/)

## Dribble past

An attempt to prevent an opposing player in possession of the ball to [dribble](/dribble) past the player.

![Foul suffered](https://dataglossary.wyscout.com/static/c640839135a77567c0e84ee26caf3488/5d8bd/617723835.png)

_Fernandinho dribbled past by C. Pulisic_

#### Successful: Yes / No

If the defensive player stopped the progression of the attacking player with the ball and didn't commit a foul, the dribble past attempt is considered won for the defender (and the linked dribble is considered lost). See the full definition in [Offensive Duel](/offensive_duel).

Examples of a won dribble past attempt:

- defending player dispossesses the attacker
- defending player kicks the ball out
- the attacker stays with the ball, but the defender forces him to go back

If a defending player lets the attacking player progress with the ball, it's considered a lost dribble past (and a won **Dribble** for the player with the ball).

Source: [https://dataglossary.wyscout.com/dribble_past/](https://dataglossary.wyscout.com/dribble_past/)

## Duel

A challenge between two players to gain control of the ball, progress with the ball or change its direction.

The duel is always a paired event, so for every offensive duel there will always be a defensive duel for another player.

#### Possible types

#### Offensive duel

A player in controlled possession of the ball (below elbow height) attempts to pass an opponent, who in turn, is trying to dispossess the player in possession.

#### Defensive duel

The opposite of an **Offensive duel**. Therefore, a player who is trying to gain possession or dispossess an opponent who is attempting to pass him whilst in controlled possession of the ball (below elbow height).

#### Loose ball duel

Two players from opposite teams with an equal opportunity, compete (below elbow height) to gain possession or pass/clear the ball in a favourable direction.

#### Aerial duel

Two or more player compete to touch the ball above elbow height (typically with their head).

#### Details

- When more than two players compete for an aerial duel, a separate set of aerial duels are tagged for every player involved from opposite teams.
- All duels can be **won** or **lost**. The definition of won or lost differs based on the type of the duel.
- It can happen that one of the two players cannot be identified by our operators, it this case we assign playerId=0 to one of the paired duel events.

Source: [https://dataglossary.wyscout.com/duel/](https://dataglossary.wyscout.com/duel/)

## Fairplay

A clearance of the ball when a player needs medical treatment or the pass when the ball is being returned back to the opponent team after being cleared out in the spirit of fair play.

![Fairplay](https://dataglossary.wyscout.com/static/1c29d400daaea47a2dec4150fc988cea/5d8bd/421924871.png)

_D. Bouanga is returning the ball to the opponent as part of the fair play_

#### Details

- Fair play actions are excluded from statistics, neither affecting the number of passes/clearances made, nor the pass accuracy.

Source: [https://dataglossary.wyscout.com/fairplay/](https://dataglossary.wyscout.com/fairplay/)

## Foul

An offence committed by a player according to law 12 (1, 3) of the IFAB Laws of the Game.

![Foul](https://dataglossary.wyscout.com/static/d105ee19805d9ac323eac74ec4f11f6a/e14cc/430444783.jpg)

_A foul by E. Garay_

#### Details

- Normally a foul is penalized with a [Free kick](/free_kick).
- A foul committed in the penalty area ([Penalty foul](/penalty_foul)) is penalized by a [Penalty kick](/penalty).
- A foul, when it's done in a [Duel](/duel), will have a corresponding _Foul suffered_ for the opponent player. The fouls outside of duels (i.e. Hand balls) are not considered fouls suffered for the opponent team.

#### Possible types

Together with a normal foul type, there are special foul types specifically tagged:

#### Hand ball

A foul signalled for touch the ball with a hand in unnatural position.

#### Violent foul

A violent action, a deliberate kick or punch of an opponent without the ball.

#### Simulation

A foul whistled for diving, simulating a foul.

#### Late card

A foul whistled for commiting a foul that the referee doesn’t whistle, letting the play continue.

#### Protest

A foul whistled for arguing with the referee.

#### Out of play foul

A foul whistled out of the open play.

#### Attributes

#### Successful: No

Fouls are always unsuccessful.

#### Card: No / Yellow (API tagId: 1702) / Red (API tagId: 1701/1703)

A value whether the foul is punished by a [yellow](/yellow_card) and [red](/red_card) card.

#### Available metrics

#### Fouls / 90

Number of fouls normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/foul/](https://dataglossary.wyscout.com/foul/)

## Foul suffered

An offence committed on a player according to law 12 (1, 3) of the IFAB Laws of the Game.

![Foul suffered](https://dataglossary.wyscout.com/static/95aa1c8eb2444d6352f9e5eb2d88defc/a4fc8/412901730.png)

_J. Weigl suffering a foul by J. Boateng_

#### Details

- When a player suffers a foul in a duel, the duel is always considered won.

Source: [https://dataglossary.wyscout.com/foul_suffered/](https://dataglossary.wyscout.com/foul_suffered/)

## Free kick

The execution of a free kick according to law 13 of the IFAB Laws of the Game.

![T. Partey with a short free kick](https://dataglossary.wyscout.com/static/1dd6ee20ad8833a7931870498c117a21/ade72/459712379.jpg)

_T. Partey with a short free kick_

#### Details

- Neither [Penalties](/penalty) or [Corner Kicks](/corner) are included in the definition.

#### Attributes

#### Scheme: Yes / No (currently not available in the API)

A scheme attribute is set for a free kick if it's played in a way that required synchronization of different player moves and appears to be pre-trained.

Source: [https://dataglossary.wyscout.com/free_kick/](https://dataglossary.wyscout.com/free_kick/)

## Free kick cross

A cross that comes after a [Free kick](/free_kick) according to law 13 of the IFAB Laws of the Game.

![A. Cresswell with a cross from free kick](https://dataglossary.wyscout.com/static/9ffd579a956f088788718235a41e325f/ade72/0459712379.jpg)

_A. Cresswell with a cross from free kick_

#### Details

- Typically addressed to penalty area.

#### Attributes

#### Height: high (API tagId 801), low (API tagId 802)

Height of a cross from a free kick. High height indicates a value over waist height, while low means a value below waist height. Crosses from free kicks are predominantly served high.

Source: [https://dataglossary.wyscout.com/free_kick_cross/](https://dataglossary.wyscout.com/free_kick_cross/)

## Free kick shot

#### Shot from a free kick

A shot that comes either from a direct free kick or after one action from an indirect free kick according to law 13 of the IFAB Laws of the Game.

![A. Sanabria with a shot from a free kick](https://dataglossary.wyscout.com/static/d5126e41864663b9508c80fba7b61517/476b1/447013065.jpg)

_A. Sanabria with a shot from a free kick_

#### Attributes

#### Directness: Direct (API tagId 1101) / Indirect (API tagId 1102)

The direct value is set when the player is shooting directly from the free kick, and to false when a teammate touches or passes the ball before the eventual shot.

#### Foot: Left (API tagId 401) / Right (API tagId 402)

A foot that the played performed the cross with.

#### Goal (API tagId: 101): Yes / No

Does the shot result in a [Goal](/goal).

#### Zone (API tagIds: 1201-1223)

![Goal](https://dataglossary.wyscout.com/static/aeeac3b7bd041a6b256583f864286c4b/0ec88/goal-zones.png)

Shots on post are tagged as a shape of plt, where p replaces o of the corresponding angle. Shots on post that are scored are tagged with the corner of where they land in the goal.

Source: [https://dataglossary.wyscout.com/free_kick_shot/](https://dataglossary.wyscout.com/free_kick_shot/)

## Game interruption

#### Game interruption (Whistle)

The referee is stopping the game for a non-game related reason (an injury needing a medical treatment, smoke or fans invading the pitch).

#### Details

- The game clock is not stopping, the time would be added instead as injury time.
- The game resumes with a drop-of ball if stopped by the referee when in play or with a normal action if the ball was already out of play.

Source: [https://dataglossary.wyscout.com/whistle/](https://dataglossary.wyscout.com/whistle/)

## Goal

A goal scored as specified in law 10.1 of the IFAB Laws of the Game.

#### Details

- In player context, this does not include own goals. In team context, this includes own goals by the opponent.
- Includes scored penalty kicks (except **Non-penalty goals** metric).
- Except when it's not an [Own goal](/own_goal), a goal is always a [Shot](/shot).
- Does not include goals scored following a VAR review, the award of a [Foul](/foul) or an [Offside](/offside).

#### Available metrics

#### Goals

Total number of goals scored.

#### Goals / 90

Number of goals normalized per 90 minutes.

#### Non-penalty goals, total

Total number of goals, excluding penalty kicks.

#### Non-penalty goals, per 90 mins

Total number of goals, excluding penalty kicks, normalized per 90 minutes.

#### Head goals, total

Total number of headed goals.

#### Head goals, avg per 90 mins

Total number of headed goals normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/goal/](https://dataglossary.wyscout.com/goal/)

## Goal conceded

A goal scored by an opponent as specified in law 10.1 of the IFAB Laws of the Game.

#### Available metrics

#### Goals conceded

Total number of goals conceded.

#### Goals conceded / 90

Number of goals conceded normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/goal_conceded/](https://dataglossary.wyscout.com/goal_conceded/)

## Goal kick

A goal kick according to law 16 of the IFAB Laws of the Game.

![A short-played goal kick](https://dataglossary.wyscout.com/static/2b51c82dab10febe4e0bee9b15f0f2f2/476b1/438520506.jpg)

_A short pass from a goal kick_

#### Details

- If a referee decides to repeat a goal kick after a foul or any particular situation that happened before the goal kick was served, only the last instance of the goal kick is considered.
- The starting position for goal kick is not tagged, assuming it happens all the time in own penalty area.
- A goal kick can be either a [shorter pass](/short_medium_pass), or a [longer aerial pass](/long_pass), but never, by definition, a [Hand pass](/hand_pass).
- Though most typically performed by a goalkeeper, can be technically performed by any player.

#### Attributes

#### Successful: Yes (API tagId: 1801) / No (API tagId: 1802)

A goal kick is considered successful if the next touch of the ball is by a teammate.

Source: [https://dataglossary.wyscout.com/goal_kick/](https://dataglossary.wyscout.com/goal_kick/)

## Goalkeeper Leaving Line

#### Goalkeeper Leaving Line (Exit)

An attempt from the part of the goalkeeper to actively play a high [Cross](/cross) or a long aerial pass in the air, either to claim or to punch the ball.

![Gk Exit](https://dataglossary.wyscout.com/static/3f7ec7504eca5e741b1fcf70c2cf3325/5ba07/423245156.jpg)

_J. Cillessen leaving line to control the ball_

#### Details

- If the goalkeeper is challenged by an opponent player, the event is also classified as an aerial duel.

#### Available Metrics

#### Exits, per 90 mins

Number of events leaving line normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/gk_leaving_line/](https://dataglossary.wyscout.com/gk_leaving_line/)

## Hand ball

A foul signalled for field player touching the ball with a hand in unnatural position.

#### Details

- Hand ball with a hand seen by the referee as in natural position and not followed by a foul is not considered a hand ball.
- An irregular ball touch with a hand by a goalkeeper inside own penalty area (for example, after a ground pass from a teammate), which is punished by and indirect [Free kick](/free_kick), is also tagged as a hand ball.

![Goalkeper hand ball](https://dataglossary.wyscout.com/static/b1f878c5af33a420734da7e4674ff31e/7a285/332942255.jpg)

_Goalkeeper hand ball in own penalty area by D. de Gea_

#### Attributes

#### Successful: No

Fouls are always unsuccessful.

#### Card: No / Yellow (API tagId: 1702) / Red (API tagId: 1701/1703)

A value whether the foul is punished by a yellow or red card.

Source: [https://dataglossary.wyscout.com/hand_foul/](https://dataglossary.wyscout.com/hand_foul/)

## Hand pass

An attempt by a goalkeeper to pass a ball to a teammate with his hands.

![Hand pass](https://dataglossary.wyscout.com/static/0c60fe7b5565e84c2371611d9a32694c/ade72/463820435.jpg)

_J. Oblak with a hand pass_

#### Details

- Can only be made by a player currently designed as the goalkeeper, since otherwise this would be a violation of the rules.
- [Throw-ins](/throw_in) are not considered hand passes.
- Hand ball fouls, even if it's a pass attempt, are not considered hand passes.

#### Attributes

#### Successful: Yes / No

Source: [https://dataglossary.wyscout.com/hand_pass/](https://dataglossary.wyscout.com/hand_pass/)

## Head pass

An attempt to pass the ball to a teammate using the head.

![Head pass](https://dataglossary.wyscout.com/static/dac4d39eaaf15467b58cc2dd2983e1f2/9db11/463822148.jpg)

_Head pass from Felipe_

#### Details

- A headed pass is used in situations where there are no opponent players nearby or there is a clear advantage in the air, when the opponent doesn't present any challenge in the air.
- A head pass, therefore, can never be an [Aerial Duel](/aerial_duel).

#### Attributes

#### Successful: Yes (API tagId: 1801) / No (API tagId: 1802)

A headed pass is considered successful if the next touch of the ball is by a teammate.

Source: [https://dataglossary.wyscout.com/head_pass/](https://dataglossary.wyscout.com/head_pass/)

## Interception

An act of player actively intercepting the ball by anticipating its movement when the opponent is shooting, passing or crossing.

![Interception](https://dataglossary.wyscout.com/static/a2ec28fcaf7c791674bf446e175db335/ade72/496576856.jpg)

_A throw-in intercepted by L. Modrić_

#### Details

- When a [Shot](/shot) is blocked by a player (typically a defender), this would be tagged as an Interception.

#### Available metrics

#### Interceptions / 90 minutes

Number of interceptions normalized per 90 minutes.

#### Interceptions / per 30 minutes of opponent possession

Number of interceptions [possession adjusted](/p_adj) per 30 minutes of opponent possession.

Source: [https://dataglossary.wyscout.com/interception/](https://dataglossary.wyscout.com/interception/)

## Key pass

A [pass](/pass) that immediately creates a clear goal scoring opportunity for a teammate.

![Key pass](https://dataglossary.wyscout.com/static/4fdf5ff48e7704c17b6e472282b5655e/e14cc/431351687.jpg)

_Key pass from F. Neuhaus to A. Plea_

#### Details

- Key Passes include only type [pass](/pass) actions
- If a key pass is a [Shot Assist](/shot_assist), it will be assigned the xA value (see [Shot Assist](/shot_assist)).
- A Key Pass can also be an [assist](/assist).

Please note: on legacy API endpoint v2/match/wyId/events a Key Pass (API tagId: 302) was considered any action (not only a pass type) that immediately creates a clear goal scoring opportunity for a teammate who in turn fails to score. As a consequence a Key Pass was never also an assist.

#### Attributes

#### Successful: Yes / No

A key pass is considered successful if the next touch of the ball is by a teammate.

#### Available metrics:

#### Key passes / 90

Number of key passes normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/key_pass/](https://dataglossary.wyscout.com/key_pass/)

## Late card foul

A foul whistled for committing a foul that the referee doesn’t whistle, letting the play continue, and then, when the game is stopped he gives a card to the player who did the foul.

#### Attributes

#### Successful: No

Fouls are always unsuccessful.

#### Card: No / Yellow (API tagId: 1702) / Red (API tagId: 1701/1703)

A value whether the foul is punished by a yellow or red card.

Source: [https://dataglossary.wyscout.com/late_card_foul/](https://dataglossary.wyscout.com/late_card_foul/)

## Link-up Play

An action of an attacking player receiving a ball from a defender or a midfielder with his back to the opposite goal.

![Link-up Play](https://dataglossary.wyscout.com/static/be9d90a68e7afdada23d467a17bc2bcc/00012/423236785.jpg)

_T. Hazard quickly returning the ball to A. Witsel_

#### Details

- Usually ends in an [Offensive duel](/offensive_duel) or a [Back pass](/pass).

Source: [https://dataglossary.wyscout.com/link_up_play/](https://dataglossary.wyscout.com/link_up_play/)

## Long pass

A ground pass longer than 45 meters or a high pass longer than 25 meters.

![Long pass](https://dataglossary.wyscout.com/static/beea2e47560d4d1fe23d1c081ac9ffb1/00012/429653105.jpg)

_A long pass by R. Toloi_

#### Details

- 75% of long passes are targeted, and about 50% are successful.

#### Attributes

#### Type of Long Pass: Launch, High, Long Ground.

- A _Launch_ (API subeventId: 84) is a pass that doesn’t appear to have a specific target..
- A _High Pass_ (API subeventId: 83) is a pass that is above shoulder height and longer than 25 meters.
- A _Long Ground Pass_ (API subeventId: 85) is a pass that is longer than 45 meters.

The definition of a long pass includes all of the above.

#### Successful: Yes (API tagId: 1801) / No (API tagId: 1802)

A long pass is considered successful if the next touch of the ball is by a teammate.

#### Through Pass (API tagId: 901): Yes / No

Marks the pass as a Through Pass.

#### Available metrics

#### Long passes / 90 minutes

Number of long passes normalized per 90 minutes.

#### Accurate long passes (%)

Percentage of successful long passes.

Source: [https://dataglossary.wyscout.com/long_pass/](https://dataglossary.wyscout.com/long_pass/)

## Loose ball duel

A duel for a loose ball, when no team has clear ball possession.

![Loose ball duel](https://dataglossary.wyscout.com/static/f56d172b8a92f8dff81f241a8cf7e57a/1b46f/0429096955.jpg)

_A loose ball duel between P. Ševčík and L. Messi_

#### Details

- Neither of the players involved have a clear advantage of reaching/touching the ball first (otherwise this would be an [offensive duel](/offensive_duel) and [defensive duel](/defensive_duel)).
- A loose ball duel from a player one team is always paired with a loose ball duel from a player from another team.

#### Attributes

Sliding tackle (API tagId: 1601): Yes / No
In rare cases, a loose ball duel can be also a [Sliding tackle](/sliding_tackle).

#### Available metrics

#### Loose ball duels / 90 minutes

Number of loose ball duels normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/loose_ball_duel/](https://dataglossary.wyscout.com/loose_ball_duel/)

## Loss

Any **Action** that ends a **Possession** of the current team.

#### Details

- A loss is recorded at the point where the player of the team actually loses the possession of the ball. For non-passes, this would be equal to the point of his last action, but, for example, with an unsuccessful long pass, the **loss** will be recorded at the ending point of the pass, not at its starting point.
- Events where the ball goes off the field off a player are, by definition, losses.
- Every unsuccessful pass is a loss.
- Loss is always an unsuccessful action.
- Suffered foul, while ending a possession, is not considered a loss.

#### Attributes

#### Zone: High / Mid / Low / Own Half

Based on the coordinates of the loss, the loss is awarded a zone. Low / Mid / High correspond to the thirds of the field (low is own third, high is the final third), while own half losses are all losses that happen in the own half.

#### Leading to opponent shot

When a loss is followed by a [Shot](/shot) of the opponent within 20 seconds.

#### Available metrics

#### Losses / 90

Number of recoveries losses per 90 minutes.

#### Own half losses / 90

Number of losses in the opponent half normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/loss/](https://dataglossary.wyscout.com/loss/)

## Missed ball

Missed ball is a type of [Touch](/touch) when the player is trying to control the ball, but can’t reach it.

![A. Romagnoli with a missed touch](https://dataglossary.wyscout.com/static/901ea95e4409f693b243bdc5bffe2eab/03f8b/415213578.jpg)

_A. Romagnoli with a missed touch_

#### Details

- Missed sliding tackles are also tagged as missed balls.

![P. Ankersen missing a sliding tackle](https://dataglossary.wyscout.com/static/1dc22208e21956bea5f967dcaa3b926e/1b46f/426361995.jpg)

_P. Ankersen missing a sliding tackle_

#### Available metrics

#### Missed balls / 90 minutes

Number of missed balls normalized per 90 minutes. Products: Advanced Search.

Source: [https://dataglossary.wyscout.com/missed_ball/](https://dataglossary.wyscout.com/missed_ball/)

## Non-ball

#### Non-ball events

Events that do not require a ball touch.

Source: [https://dataglossary.wyscout.com/non_ball/](https://dataglossary.wyscout.com/non_ball/)

## Off the ball movement

A significant movement without the ball in an empty space.

![Off-the-ball](https://dataglossary.wyscout.com/static/66f4ab301d04e5775e1b89cc137951e8/c494f/414318009.jpg)

_Marcos Alonso (3) moving into empty space_

#### Details

- The player should be actively looking for open space in the attack and showing with his movement that he's ready to receive the ball
- Frequently, but not exclusively, happens in counterattacks
- The player doesn't have to receive the ball eventually, though this is possible as well

Source: [https://dataglossary.wyscout.com/off_the_ball/](https://dataglossary.wyscout.com/off_the_ball/)

## Offensive duel

#### Offensive Duel (Attacking duel)

A ground [Duel](/duel) for the player in possession of the ball.

#### Details

- When the attacking player uses their ability and skill in an attempt to pass an opponent, this is also a [Dribble](/dribble).
- However, when the player in possession is required to protect the ball with his body, although this is an offensive duel, it is not a Dribble.
- Offensive duels can happen anywhere on the pitch, including inside a player’s own penalty area.
- An offensive duel is always paired to an [Defensive duel](/defensive_duel) from the player of another team.

#### Attributes

#### Successful: Yes / No

- If the next action following the duel is by the same offensive player and that action is closer to the opponent’s goal, or;
- If the duel was a dribble and it's followed by a touch of an attacking teammate closer to the opponent goal (i.e. successful forward pass for the attacking player from a dribble), or:
- If the duel ended in a foul from the defensive player

The scenarios above result in an offensive duel won. Everything else qualifies as an offensive duel lost (and a won [Defensive duel](/defensive_duel) for a defender).

#### Outcome: Clearly won (API tagId 703) / Clearly lost (API tagId 701) / Neutral (API tagId 702)

A less sophisticated algorithm for defining the outcome of a duel. If the next action of the duel is one of the players in the duel, the duel is assigned a clearly won value to this player and a clearly lost value for his opponent. All other cases are neutral.

#### Beaten to the ball (API tagId: 601): Yes / No

A defensive player positions himself better to reach the ball first. Used together with the Anticipation attribute in a corresponding [Defensive duel](/defensive_duel).

#### Available metrics

#### Offensive Duels / 90

Number of offensive duels normalized per 90 minutes.

#### Offensive Duels %

Percentage of successful offensive duels.

Source: [https://dataglossary.wyscout.com/offensive_duel/](https://dataglossary.wyscout.com/offensive_duel/)

## Offside

An offside as described in the law 11 of the IFAB Laws of the Game.

![Offside](https://dataglossary.wyscout.com/static/39812e60d6f9df9786c265c14c7bde39/9db11/424222715.jpg)

_Richarlison receiving the ball being offside_

#### Details

- Only offsides that are whistled by the referee and where the game is resumed with an indirect free kick awarded to the opposite team are tagged as offsides.
- All actions between the pass to a player that was offside and the referee decision are ignored.
- If an event sequence is cancelled by VAR due to an offside, all actions in the sequence after the offside are ignored.

Source: [https://dataglossary.wyscout.com/offside/](https://dataglossary.wyscout.com/offside/)

## Opportunity

A clear chance of scoring a goal.

![A. Milik with an opportunity to score](https://dataglossary.wyscout.com/static/6f58f0e002db0987d8257881ff308134/e14cc/414277332.jpg)

_A. Milik with an opportunity to score_

#### Details

- Predominantly tagged on a [Shot](/shot), meaning a dangerous shot.

#### Notes

- In the event feed API, the tagId 201 is only meaning a goalscoring chance that wasn't scored.

Source: [https://dataglossary.wyscout.com/opportunity/](https://dataglossary.wyscout.com/opportunity/)

## Out of play foul

A foul whistled out of the open play.

#### Details

- Out of play fouls often happen at set pieces, two players are violently challenging for a better position in the penalty area, and the referee give them both a yellow card.

#### Attributes

#### Successful: No

Fouls are always unsuccessful.

#### Card: No / Yellow (API tagId: 1702) / Red (API tagId: 1701/1703)

A value whether the foul is punished by a yellow or red card.

Source: [https://dataglossary.wyscout.com/out_of_play_foul/](https://dataglossary.wyscout.com/out_of_play_foul/)

## Own goal

A [Goal](/goal) scored by the player of a conceding team.

#### Details

- In player context, this is not included in any goal metrics. In team context, this is included in the number of goals scored by the opponent.

Source: [https://dataglossary.wyscout.com/own_goal/](https://dataglossary.wyscout.com/own_goal/)

## Pass

An attempt to pass the ball to a teammate.

#### Details

- [Crosses](/cross), [Head Passes](/head_pass), [Hand Passes](/hand_pass), [Smart Passes](/smart_pass) and [Long Passes](/long_pass) are all included in the pass statistics.
- [Goal Kicks](/goal_kick), [Corner Kicks](/corner_kick), [Free Kick Crosses](/free_kick_cross) and [Throw-ins](/throw_in) are not included in the pass statistics.
- Passes are classified by Wyscout into **Forward**, **Backward** and **Lateral** passes. Note that lateral passes only include passes longer than 12 meters, so the sum of forward, backward and lateral passes would be less or equal than the total number of passes.

![Pass model](https://dataglossary.wyscout.com/static/0c5949852d0fe98410987fbcc77e5de5/41913/passes-scheme.png)

#### Attributes

#### Successful: Yes (API tagId: 1801) / No (API tagId: 1802)

A pass is considered successful if the next touch of the ball is by a teammate.

#### Interception (API tagId: 1401): Yes / No

Marks the pass as an [Interception](/interception).

#### Link-up play: Yes / No

Marks the pass as [Link-up play](/linkup_play).

#### Available metrics

#### Passes / 90

Number of passes normalized per 90 minutes.

#### Pass accuracy

Percentage of successful passes.

Source: [https://dataglossary.wyscout.com/pass/](https://dataglossary.wyscout.com/pass/)

## Pass into final third

Any [pass](/pass) that originates outside of the final third and the next ball touch occurs within the final third.

#### Details

- Includes just [passes](/pass). Throw ins, for example, are excluded.

#### Attributes

#### Successful: Yes (API tagId: 1801) / No (API tagId: 1802)

A pass into final third is considered successful if the next touch of the ball is by a teammate.

#### Available metrics

#### Passes to final third / 90

Number of passes to final third normalized per 90 minutes.

#### Passes to final third %

Percentage of succesful passes to final third.

Source: [https://dataglossary.wyscout.com/pass_to_final_third/](https://dataglossary.wyscout.com/pass_to_final_third/)

## Pass into penalty area

Any [Pass](/pass) that originates outside of the opposition's penalty area and the next ball touch occurs inside the opposition's penalty area.

#### Details

- Includes just passes. For example, [Crosses](/cross) are included in this definition, but [Throw-ins](/throw_in) and [Dribbles](/dribble) are not.
- **Controlled penalty area entries** (with a run or a dribble) are not included.

#### Attributes

#### Successful: Yes (API tagId: 1801) / No (API tagId: 1802)

A pass into final third is considered successful if the next touch of the ball is by a teammate.

#### Available metrics

#### Passes to penalty area / 90

Number of passes to penalty area normalized per 90 minutes.

#### Passes to penalty area %

Percentage of succesful passes to penalty area.

Source: [https://dataglossary.wyscout.com/pass_to_penalty_area/](https://dataglossary.wyscout.com/pass_to_penalty_area/)

## Penalty foul

A foul whistled inside the penalty area, which would be followed by a [Penalty kick](/penalty).

#### Attributes

#### Successful: No

Fouls are always unsuccessful.

#### Card: No / Yellow (API tagId: 1702) / Red (API tagId: 1701/1703)

A value whether the foul is punished by a yellow or red card.

Source: [https://dataglossary.wyscout.com/penalty_foul/](https://dataglossary.wyscout.com/penalty_foul/)

## Penalty kick

A shot from a penalty kick as specified in law 14 of the IFAB Laws of the Game.

![Penalty](https://dataglossary.wyscout.com/static/624d9264620247955d9bfc4d5ddb9123/d1b8d/423237912.jpg)

_A penalty kick from L. Martínez_

#### Details

- Does not include postmatch penalties.
- Includes shots missed, deliberately missed, or passes instead of a shot.

#### Attributes

#### Foot: Left (API tagId 401) / Right (API tagId 402)

A foot that the player performed the penalty kick with.

#### Goal (API tagId: 101): Yes / No

Does the shot result in a [Goal](/goal).

#### Zone (API tagIds: 1201-1223)

![Goal](https://dataglossary.wyscout.com/static/aeeac3b7bd041a6b256583f864286c4b/0ec88/goal-zones.png)

Shots on post are tagged as a shape of plt, where p replaces o of the corresponding angle. Shots on post that are scored are tagged with the corner of where they land in the goal.

Source: [https://dataglossary.wyscout.com/penalty/](https://dataglossary.wyscout.com/penalty/)

## Pressing duel

When a player moves to apply pressure on an opposing player who is in possession of the ball but doesn't make physical or ball contact.

![Pressing duel](https://dataglossary.wyscout.com/static/6a31a1eec2c1f40c2b658de3d7ab0dfc/1b46f/429086960.jpg)

_Pressing duel from C. Pulišić_

#### Details

- Can never be an event of actively trying to win possession of the ball (as this would constitute a [Defensive duel](/defensive_duel)).
- Can never be a [Dribble past](/dribble_past) attempt, since this would also be a [Defensive duel](/defensive_duel).
- If there was a contact with the opponent player just after he made a pass, this would be tagged as a **Pressing duel**.

#### Available metrics

#### Pressing duels, per 90

Number of pressing duels normalized by 90 mins of time on the field.

Source: [https://dataglossary.wyscout.com/pressing_duel/](https://dataglossary.wyscout.com/pressing_duel/)

## Progressive pass

A forward pass that attempts to advance a team significantly closer to the opponent’s goal.

![Progressive pass](https://dataglossary.wyscout.com/static/b8485c9d382ad8203b836d77f1a75b3b/e14cc/445613336.jpg)

_A progressive pass from A. Haidara to T. Werner_

#### Details

A pass is considered progressive if the distance between the starting point and the next touch is:

- at least 30 meters closer to the opponent’s goal if the starting and finishing points are within a team’s own half
- at least 15 meters closer to the opponent’s goal if the starting and finishing points are in different halves
- at least 10 meters closer to the opponent’s goal if the starting and finishing points are in the opponent’s half

#### Attributes

#### Successful: Yes (API tagId: 1801) / No (API tagId: 1802)

A progressive pass is considered successful if the next touch of the ball is by a teammate.

#### Available metrics

#### Progressive passes / 90

Number of progressive passes normalized per 90 minutes.

#### Accurate progressive passes (%)

Percentage of successful progressive passes.

Source: [https://dataglossary.wyscout.com/progressive_pass/](https://dataglossary.wyscout.com/progressive_pass/)

## Progressive run

A continuous ball control by one player attempting to draw the team significantly closer to the opponent goal.

![Progressive run](https://dataglossary.wyscout.com/static/2954ae77bf466354b9bcd3bba70279a5/e14cc/445634357.jpg)

_D. Tadić beginning a progressive run_

#### Details

A run is considered progressive if the distance before the starting point and the last touch of the player is:

- at least 30 meters closer to opponent goal if starting and finishing points are in own half
- at least 15 meters closer to opponent goal if starting and finishing points are in different field halves
- at least 10 meters closer to opponent goal if starting and finishing points are in opponent half

#### Available metrics

#### Progressive run / 90

Number of progressive passes normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/progressive_run/](https://dataglossary.wyscout.com/progressive_run/)

## Protest foul

A foul whistled for arguing with the referee. Typically is followed by a card.

#### Attributes

#### Successful: No

Fouls are always unsuccessful.

#### Card: No / Yellow (API tagId: 1702) / Red (API tagId: 1701/1703)

A value whether the foul is punished by a yellow or red card.

Source: [https://dataglossary.wyscout.com/protest_foul/](https://dataglossary.wyscout.com/protest_foul/)

## Recovery

#### Recovery (Turnover)

Any **Action** that ends a **Possession** of the opposition team (the last action of this possession is a **Loss**) and starts a **Possession** for current team.

#### Details

- A recovery is recorded at the point where the player of the team beginning the possession touches the ball. For example, with an unsuccessful long pass, the **Loss** will be recorded at the starting point of the pass, and the recovery, at its ending point.
- Events where the team's possession starts after ball going out of the pitch or a foul are not considered recoveries.
- Recoveries are typically **Duels** (44%) or **Interceptions** (16%), but can happen without any specific action from the player doing the recovery (positioning himself correctly or simply collecting the ball).

#### Attributes

#### Zone: High / Mid / Low / Opponent Half

Based on the coordinates of the recovery, the recovery is awarded a zone. Low / Mid / High correspond to the thirds of the field (low is own third, high is the final third), while opponent half recoveries are all recoveries that happen in the opponent half.

#### Positioning recovery

A recovery that doesn't happen with an active action in defense (a [Defensive duel](/defensive_duel), a [Sliding tackle](/sliding_tackle) or an [Interception](/interception)).

#### Available metrics

#### Recoveries / 90

Number of recoveries normalized per 90 minutes.

#### Opponent half recoveries / 90

Number of recoveries in the opponent half normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/recovery/](https://dataglossary.wyscout.com/recovery/)

## Red card

Disciplinary action by the referee that is indicated by showing a red card according to law 12.3 of the IFAB Laws of the Game.

#### Details

- Can only be shown on an event that is a foul.
- Includes red cards received for whatever reasons, including not just fouls, but also misconduct and unsportive behaviour.
- A second yellow card is treated as a red card.
- Also includes red cards received while on the bench.
- Includes also red cards appealed and overturned after the match.

#### Available metrics

#### Red cards, total

Total number of red cards in a timeframe.

#### Red cards / 90 minutes

Number of red cards normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/red_card/](https://dataglossary.wyscout.com/red_card/)

## Reflexes save

A save from a shot from near distance, where the goalkeeper has to react immediately, using his reflexes to save the ball.

![Reflexes save](https://dataglossary.wyscout.com/static/d143a65dcd37265e0025eee8cb63d359/1b46f/450671618.jpg)

_Reflexes save_

#### Notes

- In the API, the Reflexes save is essentially a save attempt, so a case where the goalkeeper concedes a goal after an attempted reflexes save is still an event with eventId 9, subeventId 90, tagId 201.

Source: [https://dataglossary.wyscout.com/reflex_save/](https://dataglossary.wyscout.com/reflex_save/)

## Save

A successful attempt from the goalkeeper to prevent a shot from being scored.

![Save](https://dataglossary.wyscout.com/static/98a11b12170eee9c7de82f1cb068ca17/4c1ae/447632984.jpg)

_A save from Rui Patrício_

#### Details

- A save is tagged for all shots on target, even from medium and long distance. The difficult saves would be essentially [Reflexes saves](/reflex_save).

#### Attributes

#### xG: number

A pre-shot [xG value](/xg) of a probability of the current shot (not necessarily on target) to be scored.

#### xCG (xG2): number

The post-shot xG2 value of a probability of the current shot (guaranteed to be on target) to be scored.

Source: [https://dataglossary.wyscout.com/save/](https://dataglossary.wyscout.com/save/)

## Second assist

The last action of a player from the goalscoring team, prior to an [Assist](/assist) by a teammate.

#### Details

- The number of second assists is guaranteed to be equal to, or less than the number of assists in any single match.
- No opponent player should control the ball between the second assist and the assist.
- If a meaningful action (for example, a dribble or a run) by the player making the assist happens after he receives the ball, the previous pass would not be considered a second assist.

#### Attributes

#### Successful: Yes (API tagId: 1801)

Second assists are always successful.

#### Available metrics

#### Second assists / 90

Number of second assists normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/pre_assist/](https://dataglossary.wyscout.com/pre_assist/)

## Set pieces

Events where the ball returns to the open play following a game stoppage (a [foul](/foul) or a [ball out](/ball_out)).

Source: [https://dataglossary.wyscout.com/set_pieces/](https://dataglossary.wyscout.com/set_pieces/)

## Short/medium pass

#### Short or medium pass

A **Pass** that is not explicitly tagged as a **Long pass**. Generally this means a pass of less than 40 meters long.

#### Details

- A short or medium pass can never be a long pass.
- 2.5% of short/medium passes are **Smart passes**.
- 16% of short/medium passes are **Progressive passes**.

#### Attributes

#### Successful: Yes / No

On average, 86% of short / medium passes are successful.

#### Available metrics

#### Short/medium passes / 90

Number of short/medium passes normalized per 90 minutes.

#### Short/medium passes %

Accuracy of short/medium passes.

Source: [https://dataglossary.wyscout.com/short_medium_pass/](https://dataglossary.wyscout.com/short_medium_pass/)

## Shot

An attempt towards the opposition's goal with the intention of scoring.

![Shot](https://dataglossary.wyscout.com/static/b5c42d0633a2c5ea4399e88352726c27/5ba07/422792115.jpg)

_Long shot from Marcelo_

#### Details

- Blocked shots, penalties and direct free kicks are also considered as shots.

#### Attributes

#### Successful: Yes / No

- A shot is considered successful if it lands on target (see Zone).
- Shots that hit the frame of the goal are not considered successful.

#### Goal (API tagId: 101): Yes / No

Whether the shot results in a goal.

#### Opportunity (API tagId: 201): Yes / No

Whether the shot presents a clear goal scoring chance (see [Opportunity](/oppotrunity)).

#### Body part: Left foot (API tagId 401) / Right foot (API tagId 402) / Head or body (API tagId 403)

The body part that is used to perform the shot. In situations where more than one body part is involved in the shot, the last one is to be used.

#### Zone (API tagIds: 1201-1223)

![Goal](https://dataglossary.wyscout.com/static/aeeac3b7bd041a6b256583f864286c4b/0ec88/goal-zones.png)

Shots on post are tagged as a shape of plt, where p replaces o of the corresponding angle. Shots on post that are scored are tagged with the corner of where they land in the goal.
Blocked shots are tagged as bc (API tagId: 2101)

#### xG: number

The [xG value](/xg) of a probability of the current shot to be scored.

#### Available metrics

#### Shots, total

Number of all shots attempted in the timeframe.

#### Shots / 90

Number of shots normalized per 90 minutes.

#### Shots on target %

Percentage of shots that go on target.

#### Shots from danger zone

Number of shots from the danger zone. The danger area falls within the coordinates x >= 84.29 and y >= 36.29 and y <= 63.71

#### xG, Total

Sum of xG values of all shots in the timeframe.

#### xG / 90

Sum of xG values for all shots normalized per 90 minutes.

#### Goal conversion (%)

Percentage of shots resulted in a goal.

Source: [https://dataglossary.wyscout.com/shot/](https://dataglossary.wyscout.com/shot/)

## Shot after corner

A [Shot](/shot) of the team that happens within 14 seconds of a [Corner kick](/corner) awarded to the same team.

![Shot after corner](https://dataglossary.wyscout.com/static/6ad00985e11e699c0bb5e95dc0d9364f/92db3/362990981.png)

_Shot after corner by D. Origi_

Source: [https://dataglossary.wyscout.com/shot_after_corner/](https://dataglossary.wyscout.com/shot_after_corner/)

## Shot against (Save attempt)

A shot on target faced by the goalkeeper.

#### Details

- A goalkeeper event that can either end in a [Save](/save) or a [Goal](/goal).
- Is tagged even if a goalkeeper doesn't touch the ball and the ball is going into the net or saved by a defender.

#### Attributes

#### Goal (API tagId: 101): Yes / No

Whether the shot against result in a conceded [Goal](/goal). If false, the event is a [Save](/save).

#### Available metrics

#### Shots against / 90

Number of shots against the goalkeeper normalized by 90 mins of time on the field.

Source: [https://dataglossary.wyscout.com/shot_against/](https://dataglossary.wyscout.com/shot_against/)

## Shot assist

The last action of a player prior to a teammate having a [Shot](/shot).

![Shot assist](https://dataglossary.wyscout.com/static/0a5624928b5b743b67788fc7c8d0f79f/c494f/458585606.jpg)

_Lionel Messi with a shot assist to A. Vidal_

#### Details

- Every shot assist is guaranteed to have one (and just one) correlated shot. However, not all shots are assisted.
- The player doesn't have to have a clear intention to make an [Assist](/assist). For clearly intended passes that lead to a shot (but not a goal), see [Key pass](/key_pass).

#### Attributes

#### Successful: Yes (API tagId: 1801)

A shot assist is always successful.

#### xA: Number

The [xG](/xg) value of a [Shot](/shot) that's being assisted by this pass.

#### Available metrics

#### Shot assists / 90

Number of shot assists normalized per 90 minutes.

#### xA / 90

Sum of xA values for all shot assists normalized per 90 minutes.

#### xG + xA / 90

Sum of xG values for all shots and xA values for all shot assists normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/shot_assist/](https://dataglossary.wyscout.com/shot_assist/)

## Simulation foul

A foul whistled for diving, simulating a foul. Typically is followed by a card.

#### Details

- In most cases Simulation fouls happen inside the penalty area.

#### Attributes

#### Successful: No

Fouls are always unsuccessful.

#### Card (attributeId 21): no (0), yellow (1), red (2)

A value whether the foul is punished by a yellow or red card.

Source: [https://dataglossary.wyscout.com/simulation_foul/](https://dataglossary.wyscout.com/simulation_foul/)

## Sliding tackle

An aggressive slide on the ground in the legs of the opposition player with a clear intention to dispossess the opponent or to clear the ball out.

![Sliding Tackle](https://dataglossary.wyscout.com/static/01c2687658be5a8eea1fb951c4d61a16/e2594/403591096.jpg)

_Virgil van Dijk doing a sliding tackle_

#### Details

- Is a subtype of [Duel](/duel) ([Ground defensive duel](/defensive_duel) or [Loose ball duel](/loose_ball_duel)).
- Attempted sliding tackles that ended in fouls are tagged as a sliding tackle and then a [Foul](/foul).

#### Attributes

#### Successful: Yes / No

The success is calculated using the same logic as [Defensive duels](/defensive_duel).

#### Available metrics

#### Sliding tackles / per 30 minutes of opponent possession

Number of sliding tackles, [possession adjusted](/p_adj) per 30 minutes of opponent possession.

Source: [https://dataglossary.wyscout.com/sliding_tackle/](https://dataglossary.wyscout.com/sliding_tackle/)

## Smart pass

A creative and penetrative pass that attempts to break the opposition's defensive lines to gain a significant advantage in attack.

![Smart pass](https://dataglossary.wyscout.com/static/c5ad742972d1c684645c089ca5253531/7a285/459267414.jpg)

_A smart pass by K. De Bryune to S. Agüero_

#### Details

- A smart pass is generally a short or medium length pass, but it can also be a long ground pass (see [Long Pass](/long_pass)).

#### Attributes

#### Successful: Yes (API tagId: 1801) / No (API tagId: 1802)

A smart pass is considered successful if the next touch of the ball is by a teammate.

#### Interception (API tagId: 1401): Yes / No

Marks the pass as an [Interception](/interception).

#### Link-up play (API tagId: 7): Yes / No

Marks the pass as a [Link-up play](/linkup_play).

#### Through pass (API tagId: 901): Yes / No

Marks the pass as a [Through pass](/through_pass).

#### Available metrics

#### Smart passes / 90

Number of smart passes normalized per 90 minutes.

#### Accurate smart passes (%)

Percentage of successful smart passes.

Source: [https://dataglossary.wyscout.com/smart_pass/](https://dataglossary.wyscout.com/smart_pass/)

## Third assist

The last action of a player from the goalscoring team, prior to a [Second assist](/pre_assist) by a teammate.

#### Details

- The number of third assists is guaranteed to be equal to, or less than the number of second assists in any single match.
- No opponent player should control the ball between the third assist and the second assist.

#### Attributes

#### Successful: Yes (API tagId: 1801)

Third assists are always successful.

#### Available metrics

#### Third assists / 90

Number of third assists normalized per 90 minutes.

Source: [https://dataglossary.wyscout.com/pre_pre_assist/](https://dataglossary.wyscout.com/pre_pre_assist/)

## Through pass

A pass played into the space behind the defensive line for a teammate to contest.

![Through pass](https://dataglossary.wyscout.com/static/4d9b48f3fb8e66ab5fc95a3f4f9453a7/b835b/424803935.jpg)

_A ground through pass from C. Immobile to J. Correa_

![Through pass](https://dataglossary.wyscout.com/static/8f9f51123f0e211cf667ed7664a442f5/44e33/423228687.jpg)

_A high through pass (ball in behind) from M. Terrier to M. Cornet_

#### Details

- •	A Through Pass can also be a [Smart Pass](/smart_pass).

#### Attributes

#### Successful: Yes (API tagId: 1801) / No (API tagId: 1802)

A through pass is considered successful if the next touch of the ball is by a teammate.

#### Available metrics

#### Through passes / 90

Number of through passes normalized per 90 minutes.

#### Accurate through passes (%)

Percentage of successful through passes.

Source: [https://dataglossary.wyscout.com/through_pass/](https://dataglossary.wyscout.com/through_pass/)

## Throw in

A throw in served as specified in law 17 IFAB Laws of the Game.

![Throw in](https://dataglossary.wyscout.com/static/649c8bea0d99c434623246212f1772d1/c494f/0424803935.jpg)

_A throw-in by K. Trippier_

#### Details

- Always happens after a [Ball out](/ball_out) over the byline.
- If a referee decides to repeat a throw-in after a foul or any particular situation that happened before the throw-in kick was served, only the last instance of the throw-in kick is tagged.
- A throw-in is not considered a [Pass](/pass).

#### Attributes

#### Scheme: Yes / No

A scheme attribute is set for a throw-in it's played in a way that required synchronization of different player moves and appears to be pre-trained.

Source: [https://dataglossary.wyscout.com/throw_in/](https://dataglossary.wyscout.com/throw_in/)

## Time lost foul

A foul whistled for waiting too long to take the ball into play. Typically is followed by a card.

#### Attributes

#### Successful: No

Fouls are always unsuccessful.

#### Card: No / Yellow (API tagId: 1702) / Red (API tagId: 1701/1703)

A value whether the foul is punished by a yellow or red card.

Source: [https://dataglossary.wyscout.com/time_lost_foul/](https://dataglossary.wyscout.com/time_lost_foul/)

## Touch

A touch (or missed touch) of the ball when the player is not doing a [Pass](/pass) or other clearly identifiable action.

![Douglas Santos touching a ball](https://dataglossary.wyscout.com/static/153562d6eb3727d8f5884d2be9501714/1b46f/439026421.jpg)

_Douglas Santos touching a ball_

#### Details

- A **Touch** can be tagged on both intentional and unintentional touches, like ball deflections (including [Own goals](/own_goal)).
- A **Touch**, if there are no other actions, is tagged when the ball is received by a player who then controls a ball over a significant distance (like a [Progressive run](/progressive_run)).
- A **Touch** is tagged when a player crosses the line of the penalty area or the center line of the field to show his movement in significant areas.
- A **Touch** is tagged when there is a change of the direction of a [Pass](/pass)  (back or forward).

#### Attributes

#### Missed: No / Missed (API tagId: 1302) / Dummy (API tagId: 1301)

- Missed attempts to touch the ball are tagged as touches with a missed attribute (see [Missed ball](/missed_ball)).
- Dummy miss is used when the player doesn't touch ball on purpose, letting it for a teammate or trying to pass a the defender.

![Míchel consciously doesnt make a touch](https://dataglossary.wyscout.com/static/14448aa8536f394cc5d2912265420503/816eb/touch_dummy.png)

_Míchel consciously doesn't make a touch, letting the pass go to a partner_

Source: [https://dataglossary.wyscout.com/touch/](https://dataglossary.wyscout.com/touch/)

## Touch in box

An action (a **Pass** or a **Touch**) that happens in the opponent penalty area. Duels are excluded from this definition.

![Touch in box](https://dataglossary.wyscout.com/static/01f3b347d194d5a7baecc0e982115de5/1b46f/422803484.jpg)

_Touch in box by K. Bellarabi_

#### Details

- Two touches in box in the same attack will count as two separate actions.
- No ground duels, aerial duels or fouls are considered touches in box.

#### Available metrics

#### Touches in box, per 90

Number of touches in penalty area normalized by 90 mins of time on the field.

Source: [https://dataglossary.wyscout.com/touch_in_box/](https://dataglossary.wyscout.com/touch_in_box/)

## Transition

An event where one team loses or recovers the [Ball possession](/ball_possession).

Source: [https://dataglossary.wyscout.com/transition/](https://dataglossary.wyscout.com/transition/)

## Violent foul

A violent action, a deliberate kick or punch of an opponent without the ball, or a very bad tackle when the player is risking to injure his opponent.

#### Attributes

#### Successful: No

Fouls are always unsuccessful.

Source: [https://dataglossary.wyscout.com/violent_foul/](https://dataglossary.wyscout.com/violent_foul/)

## Yellow card

Disciplinary action by the referee that is indicated by showing a yellow card according to law 12.3 of the IFAB Laws of the Game.

#### Details

- Can only be shown on an event that is a [Foul](/foul).
- Includes yellow cards received for whatever reasons, including not just fouls, but also misconduct and unsportive behaviour.
- Also includes yellow cards received while on the bench.
- Includes also yellow cards appealed and overturned after the match.

#### Available metrics

#### Yellow cards, total

Total number of yellow cards in a timeframe.

#### Yellow cards / 90 minutes

Number of yellow cards normalized per 90 minutes.

#### Notes

- In case of a second yellow card a yellow card would be tagged and available in the F24 API, but not in the stats.

Source: [https://dataglossary.wyscout.com/yellow_card/](https://dataglossary.wyscout.com/yellow_card/)

