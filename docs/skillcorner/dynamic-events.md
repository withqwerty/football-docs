---
source_url: https://26560301.fs1.hubspotusercontent-eu1.net/hubfs/26560301/Guides/Dynamic%20Events/20250216%20-%20Dynamic%20Events%20CSV%20Specifications.pdf
source_type: crawled
upstream_version: Dynamic Events CSV Specifications 2025/02/16
crawled_at: 2026-11-24
---

# SkillCorner Dynamic Events

Column definitions for the Game Intelligence dynamic-events CSV (`GET /match/{match_id}/dynamic_events/`), from SkillCorner's *Dynamic Events CSV Specifications* (2025/02/16), linked from the [SkillCorner open-data README](https://github.com/SkillCorner/opendata). Descriptions and values are as the specification gives them. For the endpoints see [api-endpoints.md](api-endpoints.md); for the event types see [concepts.md](concepts.md).

The goal here is to deliver an exhaustive list of the attributes grouped under key themes. The order of the attributes does not necessarily reflect the order in which the columns are in the csv files.

The **Events** column lists the event types each attribute applies to: Off-Ball Run (OBR), Passing Option (PO), Player Possession (PP) and On-Ball Engagement (OBE).

## Basics

These attributes define fundamental event details: when and where it occurs, who performs it (active player), who is in possession, the event type, and its subtype. These attributes provide the foundation for further analysis.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `event_id` | str | ID of the event. It is match specific. | e.g. | OBR, PO, PP, OBE |
| `index` | int | Sequence notation for the ordering of events within each match.<br>If two events happen at the same time, we order them using their id. | e.g. 1 | OBR, PO, PP, OBE |
| `match_id` | int | The ID of the match the event is associated with. | e.g. 32839 | OBR, PO, PP, OBE |
| `frame_start` | int | Frame associated with the start of the event in SkillCorner extrapolated tracking data. | e.g. 304 | OBR, PO, PP, OBE |
| `frame_end` | int | Frame associated to the end of the event in SkillCorner extrapolated tracking data. | e.g. 350 | OBR, PO, PP, OBE |
| `frame_physical_start` | int | On-Ball Engagements<br>Frame where the player initiates his physical activities (going above 15 km/h). It is necessarily prior to the start_frame.<br>If the player does not reach 15 km/h prior to frame_start and maintains it up to frame_start, it is equal to frame_start | e.g. 3233 | OBE |
| `time_start` | timestamp | Time the event starts, recorded to the millisecond. The second period starts at 00:45:00. | e.g. 00:00:06.293 | OBR, PO, PP, OBE |
| `time_end` | timestamp | Time in the period the event ends, recorded to the millisecond.<br>The second period starts at 00:45:00. | e.g. 00:00:10.331 | OBR, PO, PP, OBE |
| `minute_start` | int | The minutes on the clock at the time of this event. Resets to 45 at half- time, 90 at the start of extra time etc. | e.g. 25 | OBR, PO, PP, OBE |
| `second_start` | int | The seconds part of the timestamp. | e.g. 10 | OBR, PO, PP, OBE |
| `duration` | float | Number of seconds the event lasts. | e.g. 4.1 | OBR, PO, PP, OBE |
| `period` | int | An identified identifier for the period of the match when the event happens. | 1: first half / 2: second half / 3: first extratime / 4: second extratime / 5: penalty shootout | OBR, PO, PP, OBE |
| `attacking_side_id` | int |  | 1 (left_to_right) / 2 (right_to_left) | OBR, PO, PP, OBE |
| `attacking_side` | str | Attacking side of the team of the player. | left_to_right / right_to_left | OBR, PO, PP, OBE |
| `event_type_id` | int | int corresponding to the event type | 1 (off_ball_run) / 7 (passing_option) / 8 (player_possession) / 9 (on_ball_engagement) | OBR, PO, PP, OBE |
| `event_type` | str | The type of event. | player_possession / off_ball_run / passing_option / defensive_engagement | OBR, PO, PP, OBE |
| `event_subtype_id` | int |  | 1 (behind) / 2 (coming_short) / 3 (cross_receiver) / 4 (dropping_off) / 5 (overlap) / 6 (pulling_half_space) / 7 (pulling_wide) / 8 (run_ahead_of_the_ball) / 9 (support) / 10 (underlap) / 11 (pressing) / 12 (pressure) / 13 (counter_press) / 14 (recovery_press) / 15 (other) | OBR, OBE |
| `event_subtype` | str | Subtype of the event.<br>None for Player Possessions and Passing Options. | behind / coming_short / cross_receiver / dropping_off / overlap / pulling_half_space / pulling_wide / run_ahead_of_the_ball / support / underlap / pressing / pressure / counter_press / recovery_press / other / None | OBR, OBE |
| `player_id` | int | ID of the player performing the event. | e.g. 11746 | OBR, PO, PP, OBE |
| `player_name` | str | Name of the player performing the event. | e.g. "T. Alexander-Arnold" | OBR, PO, PP, OBE |
| `player_position_id` | int |  | 1(GK),2(LB),3(LWB),4(LCB),5(CB),6(RCB),7(RWB),8(RB),9(LDM),10(DM),11(RDM),12(LM),13(CM),14(RM),15(AM),16(LW),17(RW),18(LF),19(CF),20(RF) | OBR, PO, PP, OBE |
| `player_position` | str | Position of the player. | GK,LB,LWB,LCB,CB,RCB,RWB,RB,LDM,DM,RDM,LM,CM,RM,AM,LW,RW,LF,CF,RF | OBR, PO, PP, OBE |
| `player_in_possession_id` | int | ID of the player in possession. | e.g. 11746 | OBR, PO, OBE |
| `player_in_possession_name` | str | Name of the player in possession. | e.g. "T. Alexander-Arnold" | OBR, PO, OBE |
| `player_in_possession_position_id` | int |  | 1(GK),2(LB),3(LWB),4(LCB),5(CB),6(RCB),7(RWB),8(RB),9(LDM),10(DM),11(RDM),12(LM),13(CM),14(RM),15(AM),16(LW),17(RW),18(LF),19(CF),20(RF) | OBR, PO, OBE |
| `player_in_possession_position` | str | Position of the player. | GK,LB,LWB,LCB,CB,RCB,RWB,RB,LDM,DM,RDM,LM,CM,RM,AM,LW,RW,LF,CF,RF | OBR, PO, OBE |
| `team_id` | int | ID of the team of the player performing the event. | e.g. 2 | OBR, PO, PP, OBE |
| `team_shortname` | str | Shortname of the team of the player performing the event. | e.g. Fiorentina | OBR, PO, PP, OBE |
| `x_start` | float | x coordinate of the player concerned by the event at the start of the event. | e.g. -5,2 | OBR, PO, PP, OBE |
| `y_start` | float | y coordinate of the player concerned by the event at the start of the event. | e.g. 10,8 | OBR, PO, PP, OBE |
| `channel_id_start` | int |  | 1 (wide_left) / 2 (half_space_left) / 3 (center) / 4 (half_space_right) / 5 (wide_right) | OBR, PO, PP, OBE |
| `channel_start` | str | Channel where the event starts. | wide_left / half_space_left / center / half_space_right / wide_right | OBR, PO, PP, OBE |
| `third_id_start` | int |  | 1 (defensive_third) / 2 (middle_third) / 3 (attacking_third) | OBR, PO, PP, OBE |
| `third_start` | str | Third where the event starts. | defensive_third / middle_third / attacking_third | OBR, PO, PP, OBE |
| `penalty_area_start` | bool | TRUE if the event start location is in the penalty area.<br>Else FALSE. | TRUE / FALSE | OBR, PO, PP, OBE |
| `x_end` | float | x coordinate of the player concerned by the event at the end of the event. | e.g. -5,2 | OBR, PO, PP, OBE |
| `y_end` | float | y coordinate of the player concerned by the event at the end of the event. | e.g. 10,8 | OBR, PO, PP, OBE |
| `channel_id_end` | int |  | 1 (wide_left) / 2 (half_space_left) / 3 (center) / 4 (half_space_right) / 5 (wide_right) | OBR, PO, PP, OBE |
| `channel_end` | str | Channel where the event ends. | wide_left / half_space_left / center / half_space_right / wide_right | OBR, PO, PP, OBE |
| `third_id_end` | int |  | 1 (defensive_third) / 2 (middle_third) / 3 (attacking_third) | OBR, PO, PP, OBE |
| `third_end` | str | Third where the event ends. | defensive_third / middle_third / attacking_third | OBR, PO, PP, OBE |
| `penalty_area_end` | bool | TRUE if the event end location is in the penalty area.<br>Else FALSE. | TRUE / FALSE | OBR, PO, PP, OBE |

## Associated Events

These attributes link the current event to related events, helping to understand event relationships—especially for those analyzing event sequences and interactions.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `associated_player_possession_event_id` | str | ID of the associated player possession event. | e.g. | OBR, PO, OBE |
| `associated_player_possession_frame_start` | int | Frame when the associated possession of player_in_possession starts. | e.g. 34 | OBR, PO, OBE |
| `associated_player_possession_frame_end` | int | Frame when the associated player possession ends. |  | OBE |
| `associated_player_possession_end_type_id` | int |  | 1 (pass) / 2 (shot) / 3 (clearance) / 4 (foul_suffered) / 5 (possession_loss) / 6 (unknown) | OBE |
| `associated_player_possession_end_type` | str | How the associated possession ended. | pass / shot / clearance / foul_suffered / possession_loss / unknown | OBE |
| `associated_off_ball_run_event_id` | str | If the player performing the passing options is also performing an off-ball run, ID of the off-ball run event.<br>Else None. | e.g. 1_30 | PO |
| `associated_off_ball_run_subtype_id` | int | If the player performing the passing options is also performing an off-ball run, ID of the type of the off-ball run event.<br>Else None. | 1 (behind) / 2 (coming_short) / 3 (cross_receiver) / 4 (dropping_off) / 5 (overlap) / 6 (pulling_half_space) / 7 (pulling_wide) / 8 (run_ahead_of_the_ball) / 9 (support) / 10 (underlap) | PO |
| `associated_off_ball_run_subtype` | str | If the player performing the passing options is also performing an off-ball run, type of the off-ball run event.<br>Else None. | behind / coming_short / cross_receiver / dropping_off / overlap / pulling_half_space / pulling_wide / run_ahead_of_the_ball / support / underlap | PO |

## Game Context

These attributes capture the overall match state, including the scoreline and phase of play.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `game_state_id` | int |  | 1 (Winning) / 2 (Losing) / 3 (Drawing) | OBR, PO, PP, OBE |
| `game_state` | str | Whether the player team is winning, losing or drawing at the start of the event. | Winning / Losing / Drawing | OBR, PO, PP, OBE |
| `team_score` | int | Player own team score at the start of the player possession | e.g. 0 | OBR, PO, PP, OBE |
| `opponent_team_score` | int | Player opponent team score at the start of the player possession | e.g. 1 | OBR, PO, PP, OBE |
| `phase_index` | int | Index of the Phase of Play ordered chronologically. | e.g. 621 | OBR, PO, PP, OBE |
| `player_possession_phase_index` | int | The index of the player possession within the current phase_id (based on team_in_possession_phase_type_end).<br>This is between 1 (first possessions) to the n_player_possessions_in_phase. | e.g. 3 | PP |
| `first_player_possession_in_team_possession` | bool | TRUE if the player possession is the first one of the team possession.<br>Else FALSE. | TRUE / FALSE | PP |
| `last_player_possession_in_team_possession` | bool | TRUE if the player possession is the last one of the team possession.<br>Else FALSE. | TRUE / FALSE | PP |
| `lead_to_different_phase` | bool | TRUE if<br>- the player possession ends the team possession<br>- or if the player possession phase is different from the next player possession phase.<br>Else FALSE. | TRUE / FALSE | PP |
| `issued_from_different_phase` | bool | TRUE if<br>- the player possession starts his team possession<br>- or if the player possession phase is different from the previous player possession phase.<br>Else FALSE. | TRUE / FALSE | PP |
| `n_player_possessions_in_phase` | int | Number of player possession associated to the same phase as the current player possession. | e.g. 3 | PP |
| `team_possession_loss_in_phase` | bool | TRUE if team possession ends during the current phase.<br>Else FALSE.<br>Note that temporary disruptions are not considered as ending the team possession. | TRUE / FALSE | PP, OBE |
| `team_in_possession_phase_type_id` | int |  | 0 (build_up) / 1 (create) / 2 (finish) / 3 (quick_break) / 4 (transition) / 5 (chaotic) / 6 (direct) / 7 (set_play) / 14 (disruption) | OBR, PO, PP, OBE |
| `team_in_possession_phase_type` | str | Phase of play for the team in possession. | build_up / create / finish / quick_break / transition / chaotic / direct / set_play / disruption | OBR, PO, PP, OBE |
| `team_out_of_possession_phase_type_id` | int |  | 5 (chaotic) / 8 (low_block) / 9 (medium_block) / 10 (high_block) / 11 (defending_transition) / 12 (defending_quick_break) / 13 (defending_set_play) / 14 (disruption) / 15 (defending_direct) | OBR, PO, PP, OBE |
| `team_out_of_possession_phase_type` | str | Phase of play for the team out of possession. | chaotic / low_block / medium_block / high_block / defending_transition / defending_quick_break / defending_set_play / disruption | OBR, PO, PP, OBE |
| `current_team_in_possession_next_phase_type_id` | int |  | 0 (build_up) / 1 (create) / 2 (finish) / 3 (quick_break) / 4 (transition) / 5 (chaotic) / 6 (direct) / 7 (set_play) / 8 (low_block) / 9 (medium_block) / 10 (high_block) / 11 (defending_transition) / 12 (defending_quick_break) / 13 (defending_set_play) / 14 (disruption) / 15 (defending_direct) | PP |
| `current_team_in_possession_next_phase_type` | str | Next phase of the team that is currently in possession.<br>Note that this phase can be an in possession or an out of possession phase depending on whether the team loses possession during the current phase.<br>Refer to team_possession_loss_in_phase to know whether the team loses possession during the current phase. | build_up / create / finish / quick_break / transition / chaotic / direct / set_play / low_block / medium_block / high_block / defending_transition / defending_quick_break / defending_set_play / defending_direct | PP |
| `current_team_out_of_possession_next_phase_type_id` | int |  | 0 (build_up) / 1 (create) / 2 (finish) / 3 (quick_break) / 4 (transition) / 5 (chaotic) / 6 (direct) / 7 (set_play) / 8 (low_block) / 9 (medium_block) / 10 (high_block) / 11 (defending_transition) / 12 (defending_quick_break) / 13 (defending_set_play) / 14 (disruption) / 15 (defending_direct) | PP |
| `current_team_out_of_possession_next_phase_type` | str | Next phase of the team that is currently out of possession.<br>Note that this phase can be an in possession or an out of possession phase depending on whether the team regains possession during the current phase.<br>Refer to team_possession_loss_in_phase to know whether the team in possession loses possession during the current phase. | build_up / create / finish / quick_break / transition / chaotic / direct / set_play / low_block / medium_block / high_block / defending_transition / defending_quick_break / defending_set_play / disruption / defending_direct | PP |
| `current_team_in_possession_previous_phase_type_id` | int |  | 0 (build_up) / 1 (create) / 2 (finish) / 3 (quick_break) / 4 (transition) / 5 (chaotic) / 6 (direct) / 7 (set_play) / 8 (low_block) / 9 (medium_block) / 10 (high_block) / 11 (defending_transition) / 12 (defending_quick_break) / 13 (defending_set_play) / 14 (disruption) / 15 (defending_direct) | PP |
| `current_team_in_possession_previous_phase_type` | str | Previous phase of the team that is currently in possession.<br>Note that this phase can be an in possession or an out of possession phase depending on whether the team in possession was the same during the previous phase. | build_up / create / finish / quick_break / transition / chaotic / direct / set_play / low_block / medium_block / high_block / defending_transition / defending_quick_break / defending_set_play / disruption / defending_direct | PP |
| `current_team_out_of_possession_previous_phase_type_id` | int |  | 0 (build_up) / 1 (create) / 2 (finish) / 3 (quick_break) / 4 (transition) / 5 (chaotic) / 6 (direct) / 7 (set_play) / 8 (low_block) / 9 (medium_block) / 10 (high_block) / 11 (defending_transition) / 12 (defending_quick_break) / 13 (defending_set_play) / 14 (disruption) / 15 (defending_direct) | PP |
| `current_team_out_of_possession_previous_phase_type` | str | Previous phase of the team that is currently out of possession.<br>Note that this phase can be an in possession or an out of possession phase depending on whether the team in possession was the same during the previous phase. | build_up / create / finish / quick_break / transition / chaotic / direct / set_play / low_block / medium_block / high_block / defending_transition / defending_quick_break / defending_set_play / disruption / defending_direct | PP |

## Event Start / End

These attributes define how an event begins and concludes, such as whether a player’s possession ends with a pass or a shot.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `game_interruption_before_id` | int |  | 1 (corner_for) / 2 (corner_against) / 3 (free_kick_for) / 4 (free_kick_against) / 5 (goal_for) / 6 (goal_against) / 7 (goal_kick_for) / 8 (goal_kick_against) / 9 (penalty_for) / 10 (penalty_against) / 11 (throw_in_for) / 12 (throw_in_against) | PP, OBE |
| `game_interruption_before` | str | None if the player possession was preceded by another player possession.<br>Else game interruption that preceded the player possession. | corner_for / corner_against / free_kick_for / free_kick_against / goal_for / goal_against / goal_kick_for / goal_kick_against / penalty_for / penalty_against / throw_in_for / throw_in_against / None | PP, OBE |
| `game_interruption_after_id` | int |  | 1 (corner_for) / 2 (corner_against) / 3 (free_kick_for) / 4 (free_kick_against) / 5 (goal_for) / 6 (goal_against) / 7 (goal_kick_for) / 8 (goal_kick_against) / 9 (penalty_for) / 10 (penalty_against) / 11 (throw_in_for) / 12 (throw_in_against) | PP, OBE |
| `game_interruption_after` | str | None if the player possession was followed by another player possession.<br>Else game interruption that followed the player possession. | corner_for / corner_against / free_kick_for / free_kick_against / goal_for / goal_against / goal_kick_for / goal_kick_against / penalty_for / penalty_against / throw_in_for / throw_in_against / None | PP, OBE |
| `start_type_id` | int |  | 1 (pass_reception) / 2 (pass_interception) / 3 (keep_possession) / 4 (recovery) / 5 (free_kick_reception) / 6 (free_kick_interception) / 7 (throw_in_reception) / 8 (throw_in_interception) / 9 (goal_kick_reception) / 10 (goal_kick_interception) / 11 (corner_reception) / 12 (corner_interception) / 13 (unknown) | PP |
| `start_type` | str | How the player got in possession of the ball.<br>Keep possession corresponds to when the player possession does not start with a pass reception but the team in possession is still the same.<br>For instance<br>- if a player attempts a pass that is intercepted by an opponent and the ball bounces back to the player's own team.<br>- if a player shoots to the goal and the ball is saved or hits the post to be recovered but one player from the same team as the player who shot the ball. | pass_reception / pass_interception / keep_possession / recovery / free_kick_reception / free_kick_interception / throw_in_reception / throw_in_interception / goal_kick_reception / goal_kick_interception / corner_reception / corner_interception / unknown | PP |
| `end_type_id` | int |  | 1 (pass) / 2 (shot) / 3 (clearance) / 4 (foul_suffered) / 5 (possession_loss) / 6 (unknown) / 7 (direct_regain) / 8 (indirect_regain) / 9 (direct_disruption) / 10 (indirect_disruption) / 11 (foul_committed) | PP, OBE |
| `end_type` | str | How the possession ended. | pass / shot / clearance / foul_suffered / possession_loss / unknown / direct_regain / indirect_regain / direct_disruption / indirect_disruption / foul_committed / None | PP, OBE |
| `pass_angle_received` | float | Related to the pass reception that started the player possession.<br>None if the event does not start with a pass reception (start_type = pass_reception) or if the we cannot evaluate the pass trajectory.<br>Angle of the ball trajectory before reception compared to the direction of attack. | e.g. 30 | PP |
| `pass_direction_received_id` | int |  | 1 (forward) / 2 (backward) / 3 (sideway left) / 4 (sideway right) | PP |
| `pass_direction_received` | str | Related to the pass reception that started the player possession.<br>None if the event does not start with a pass reception (start_type = pass_reception) or if the we cannot evaluate the pass trajectory.<br>Direction of the ball before the player first touch and the start of the event. | forward / backward / sideway left / sideway right | PP |
| `pass_distance_received` | float | Related to the pass reception that started the player possession.<br>None if the event does not start with a pass reception (start_type = pass_reception) or if the we cannot evaluate the pass distance.<br>Distance between the pass location to the location of the reception where the player started his possession. | e.g. None, 30.1 | PP |
| `pass_range_received_id` | int |  | 1 (short) / 2 (medium) / 3 (long) | PP |
| `pass_range_received` | str | Related to the pass reception that started the player possession.<br>None if the event does not start with a pass reception (start_type = pass_reception) or if the we cannot evaluate the pass distance.<br>Range of the pass received that led to the player possession. | short (between 0 to 15 m) / medium (between 15 to 30m) / long (over 30m) / None | PP |
| `pass_outcome_id` | int |  | 1 (successful) / 2 (unsuccessful) / 3 (offside) | PP |
| `pass_outcome` | str | None, if the player possession did not end with a pass.<br>Outcome of the pass that ended the player possession. | successful / unsuccessful / offside / None | PP |
| `targeted_passing_option_event_id` | str | Event ID of the passing option targeted by the player if he attempted a pass at the end of his possession.<br>None if the player possession event did not end with a pass attempt. | e.g. 7_5 | PP |
| `high_pass` | bool | Player Option<br>None, if the passing option was not targeted or if we cannot appreciate its trajectory.<br>If the passing option receives the ball<br>- TRUE if the ball max z-coordinates during the pass is above 1.8 metres.<br>- Else FALSE.<br>If the passing option is targeted but does not receive the ball<br>- TRUE if the ball max z-coordinates during the pass is above 1.8 metres.<br>- Else None.<br>Player Possession<br>None if the player possession did not end up with a pass.<br>If the pass is complete<br>- TRUE if the ball max z-coordinates during the pass is above 1.8 metres.<br>- Else FALSE.<br>If the pass is incomplete<br>- TRUE if the ball max z-coordinates during the pass is above 1.8 metres.<br>- Else None (we cannot predict it). | None / TRUE / FALSE | PO, PP |

## Outcome

These attributes describe the consequences of an event, including its impact on possession, team advantage, and defensive effectiveness.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `lead_to_shot` | bool | TRUE if there is a shot within the 10 seconds after the end of the event.<br>Else FALSE. | TRUE / FALSE | OBR, PO, PP, OBE |
| `lead_to_goal` | bool | TRUE if there is a goal within the 10 seconds after the end of the event.<br>Else FALSE. | TRUE / FALSE | OBR, PO, PP, OBE |
| `targeted` | bool | TRUE if the player is targeted by a pass.<br>Else FALSE. | TRUE / FALSE | OBR, PO |
| `received` | bool | TRUE if the player receives the ball.<br>Else FALSE. | TRUE / FALSE | OBR, PO |
| `received_in_space` | bool | None if the player does not receive the ball (received = FALSE).<br>TRUE if the ball is received with the nearest opponent at least at 3 m away.<br>Else FALSE. | None / TRUE / FALSE | OBR, PO |
| `possession_danger` | bool | TRUE if the Team in possession EPV is above 3% for at least one frame during between the start of the engagement and the end of the player possession.<br>Else FALSE. | TRUE / FALSE | OBE |
| `beaten_by_possession` | bool | This flag captures when the defending player was beaten by the player in possession while on-ball.<br>TRUE if the team in possession chances of scoring significantly increase during the player possession, and the defender, who was goal-side and close enough to intervene, fails to prevent this increase.<br>The flag can be canceled in specific situations, such as interceptions, possession regain, or valid defensive positioning.<br>Else FALSE. | TRUE / FALSE | OBE |
| `beaten_by_movement` | bool | This flag captures when the defending player was beaten by the player in possession before he received the ball.<br>TRUE if the player fails to prevent a significant increase in the chances of scoring of the opponent team between the last pass and its reception, despite being positioned to control the receiving player at some point.<br>This flag can be canceled in specific attenuating circumstances, such as when the defender faces a 2v1 situation, maintains a stronger goal-side position, or when the reception occurs under non-threatening conditions, like a header or controlled positioning.<br>Else FALSE. | TRUE / FALSE | OBE |
| `stop_possession_danger` | bool | This flag captures when the defending annihilated a situation where the attacking team had high chances of scoring.<br>TRUE if the Team in possession has high chances of scoring at the end of the possession and the possession finishes by a pass intercepted by the defender or a regain and the defender was close to the player in possession at the possession end.<br>Else FALSE. | TRUE / FALSE | OBE |
| `reduce_possession_danger` | bool | This flag captures when the defending player reduced the danger in a situation where the attacking team had high chances of scoring.<br>TRUE if the team in possession chances of scoring decreases significantly from its peak value to the end of an opponent's possession, and the defender is positioned goal-side and close (within 5 meters) or very close (within 2.5 meters) at the end of the possession. The possession must not end with a shot.<br>Else, FALSE. | TRUE / FALSE | OBE |
| `force_backward` | bool | TRUE if the player in possession was forced to play a backward pass due to the defensive engagement.<br>In particular, the chances of the player in possession regressing need to grow significantly (+30% in percentage point) near the end of his possession and the player applying the engagement needs to be either very close or goalside.<br>Else FALSE. | TRUE / FALSE | OBE |

## Physical

These attributes capture movement and effort during an event, providing insights into player dynamics and positioning.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `distance_covered` | float | On-ball Engagements<br>Distance covered (in metres) by the player between when the player starts his physical effort (frame_physical_start) and when the event ends (frame_end).<br>Other Event Types<br>Distance covered (in metres) by the player during the event (between frame_start and frame_end).<br>It is based on the actual player's trajectory. | e.g. 10 | OBR, PO, PP, OBE |
| `trajectory_angle` | float | Refers to the angle of a player's movement, measured from the starting location of the event to where the event ends, in relation to the horizontal line directed towards the opposing goal. | e.g. 33 | OBR, PO, PP, OBE |
| `trajectory_direction_id` | int |  | 1 (forward) / 2 (backward) / 3 (sideway left) / 4 (sideway right) | OBR, PO, PP, OBE |
| `trajectory_direction` | str | Direction of the player trajectory. | forward / backward / sideway left / sideway right | OBR, PO, PP, OBE |
| `in_to_out` | bool | None if the player did not cover at least 2m during the event.<br>TRUE if the player the player<br>- moved sideway (here we use trajectory_angle absolute value is between 22.5° and 157°).<br>- started from the center channel and ends in the half space or wide channel OR started in the half space and ends in the wide channel Else FALSE. | TRUE / FALSE | OBR, PO, PP |
| `out_to_in` | bool | None if the player did not cover at least 2m during the event.<br>TRUE if the player the player<br>- moved sideway (here we use trajectory_angle absolute value is between 22.5° and 157°).<br>- started from the wide channel and ends in the center or a half space channel OR started in the half space and ends in the central channel Else FALSE. | TRUE / FALSE | OBR, PO, PP |
| `speed_avg` | float | The average speed of a player during the event (km/h) when he is detected on screen.<br>None if there are not enough data points to compute the average or if the value is not considered trustworthy enough.<br>On-ball engagements<br>Computed between the frame_physical_start and frame_end.<br>Other event types<br>Computed between the frame_start and frame_end. | e.g. 19.1 | OBR, PO, PP, OBE |
| `speed_avg_band_id` | int |  | None / 1 (jogging) / 2 (running) / 3 (hsr) / 4 (sprinting) | OBR, PO, PP, OBE |
| `speed_avg_band` | str | Speed band of the average speed.<br>None if speed_avg cannot be delivered. | None / jogging (if speed_avg below 15 km/h) / running (if speed_avg between 15 km/h and 20km/h) / hsr (if speed_avg between 20 km/h and 25km/h) / sprinting (if speed_avg above 25 km/h) | OBR, PO, PP, OBE |

## Player In Possession Details

These attributes describe the player in possession and their positioning throughout the event.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `location_to_player_in_possession_id_start` | int |  | 1 (behind) / 2 (same_line) / 3 (ahead) | OBR, PO |
| `location_to_player_in_possession_start` | str | Related position compared to the player in possession at the start of the event (on x). | behind / same_line / ahead | OBR, PO |
| `location_to_player_in_possession_id_end` | int |  | 1 (behind) / 2 (same_line) / 3 (ahead) | OBR, PO |
| `location_to_player_in_possession_end` | str | Related position compared to the player in possession at the end of the event (on x). | behind / same_line / ahead | OBR, PO |
| `distance_to_player_in_possession_start` | float | Distance (in metres) between player and player in possession at the start of the event. | e.g. 10.9 | OBR, PO |
| `distance_to_player_in_possession_end` | float | Distance (in metres) between player and player in possession at the end of the event. | eg. 23.4 | OBR, PO |
| `player_in_possession_x_start` | float | x coordinate of the player in possession at the start of the event. | e.g. 10.8 | OBR, PO |
| `player_in_possession_y_start` | float | y coordinate of the player in possession at the start of the event. | e.g. 10.8 | OBR, PO |
| `player_in_possession_channel_id_start` | int | ID of the channel of the player in possession at the start of the event | 1 (wide_left) / 2 (half_space_left) / 3 (center) / 4 (half_space_right) / 5 (wide_right) | OBR, PO |
| `player_in_possession_channel_start` | str | Channel where the player in possession is when the event starts.<br>Note that the ball may be travelling towards the player in possession at this moment and he may not have done his first touch yet. | wide_left / half_space_left / center / half_space_right / wide_right | OBR, PO |
| `player_in_possession_third_id_start` | int | ID of the third the player in possession is at the start of the event. | 1 (defensive_third) / 2 (middle_third) / 3 (attacking_third) | OBR, PO |
| `player_in_possession_third_start` | str | Third where the player in possession is when the event starts.<br>Note that the ball may be travelling towards the player in possession at this moment and he may not have done his first touch yet. | defensive_third / middle_third / attacking_third | OBR, PO |
| `player_in_possession_penalty_area_start` | bool | TRUE if the player in possession is in the penalty area when the event starts.<br>Else FALSE. | TRUE / FALSE | OBR, PO |
| `player_in_possession_x_end` | float | x coordinate of the player in possession at the end of the event. | e.g. -5.2 | OBR, PO |
| `player_in_possession_y_end` | float | y coordinate of the player in possession at the end of the event. | e.g. -5.2 | OBR, PO |
| `player_in_possession_channel_id_end` | int |  | 1 (wide_left) / 2 (half_space_left) / 3 (center) / 4 (half_space_right) / 5 (wide_right) | OBR, PO |
| `player_in_possession_channel_end` | str | Channel where the player in possession is when the event ends. Note that the ball may be travelling towards the player in possession at this moment and he may not have done his first touch yet. | wide_left / half_space_left / center / half_space_right / wide_right | OBR, PO |
| `player_in_possession_third_id_end` | int |  | 1 (defensive_third) / 2 (middle_third) / 3 (attacking_third) | OBR, PO |
| `player_in_possession_third_end` | str | Third where the player in possession is when the event ends.<br>Note that the ball may be travelling towards the player in possession at this moment and he may not have done his first touch yet. | defensive_third / middle_third / attacking_third | OBR, PO |
| `player_in_possession_penalty_area_end` | bool | TRUE if the player in possession is in the penalty area when the event ends.<br>Else FALSE. | TRUE / FALSE | OBR, PO |
| `passing_option_at_player_possession_start` | bool | TRUE if the player was a passing option during the first 0.5 seconds of the associated player possession.<br>Else FALSE. | TRUE / FALSE | OBR, PO |
| `xloss_player_possession_start` | float | The probability that the player in possession will lose the ball during that possession (including via an incomplete pass but excluding shots).<br>Computed at the start of the player possession. | TRUE / FALSE | OBE |
| `xloss_player_possession_end` | float | The probability that the player in possession will lose the ball during that possession (including via an incomplete pass but excluding shots).<br>Computed at the end of the player possession. | e.g. 0.41 | OBE |
| `xloss_player_possession_max` | float | The maximum probability observed at any point that the player in possession will lose the ball (including via an incomplete pass but excluding shots).<br>Evaluated over the duration of a player’s possession. | e.g. 0.41 | OBE |
| `xshot_player_possession_start` | float | The probability that the player’s possession will result in a shot.<br>Calculated at the start of a player’s possession. | e.g. 0.13 | OBE |
| `xshot_player_possession_end` | float | The probability that the player’s possession will result in a shot.<br>Calculated at the end of a player’s possession. | e.g. 0.15 | OBE |
| `xshot_player_possession_max` | float | The maximum probability observed at any point that the player’s possession will end with a shot.<br>Evaluated over the duration of a player’s possession. | e.g. 0.20 | OBE |

## Player Targeted

These attributes define the player targeted by a pass or engagement, capturing positioning, movement, danger and pass difficulty.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `player_targeted_id` | int | Player Possessions<br>None if the player possession event did not end with a pass attempt or we cannot determine who was the pass target.<br>Player ID of the player targeted by the player in possession if he attempted a pass at the end of his possession.<br>On-Ball Engagements<br>Player ID of the (On Ball) Player that was targeted by the on-ball engagement. | e.g. 11746 | PP, OBE |
| `player_targeted_name` | str | Player Possessions<br>None if the player possession event did not end with a pass attempt or we cannot determine who was the pass target.<br>Name of the player targeted by the player in possession if he attempted a pass at the end of his possession.<br>On-Ball Engagements<br>Name of the (On Ball) Player that was targeted by the on-ball engagement. | e.g. "T. Alexander-Arnold" | PP, OBE |
| `player_targeted_position_id` | int |  | 1(GK),2(LB),3(LWB),4(LCB),5(CB),6(RCB),7(RWB),8(RB),9(LDM),10(DM),11(RDM),12(LM),13(CM),14(RM),15(AM),16(LW),17(RW),18(LF),19(CF),20(RF) | PP, OBE |
| `player_targeted_position` | str | Player Possessions<br>None if the player possession event did not end with a pass attempt or we cannot determine who was the pass target.<br>Position of the pass target.<br>On-Ball Engagements<br>Position of the (On Ball) Player that was targeted by the on-ball engagement." | GK,LB,LWB,LCB,CB,RCB,RWB,RB,LDM,DM,RDM,LM,CM,RM,AM,LW,RW,LF,CF,RF | PP, OBE |
| `player_targeted_x_pass` | float | Related to the final pass attempted by the player in possession.<br>None if the player possession event did not end with a pass attempt or we cannot determine who was the pass target.<br>x location of the targeted player at the moment of the pass. | e.g. -3.23 | PP |
| `player_targeted_y_pass` | float | Related to the final pass attempted by the player in possession.<br>None if the player possession event did not end with a pass attempt or we cannot determine who was the pass target.<br>y location of the targeted player at the moment of the pass. | e.g. +12.45 | PP |
| `player_targeted_channel_pass_id` | int |  | 1 (wide_left) / 2 (half_space_left) / 3 (center) / 4 (half_space_right) / 5 (wide_right) | PP |
| `player_targeted_channel_pass` | str | Related to the final pass attempted by the player in possession.<br>None if the player possession event did not end with a pass attempt or we cannot determine who was the pass target.<br>Channel of the targeted player at the moment of the pass. | wide_left / half_space_left / center / half_space_right / wide_right | PP |
| `player_targeted_third_pass_id` | int |  | 1 (defensive_third) / 2 (middle_third) / 3 (attacking_third) | PP |
| `player_targeted_third_pass` | str | Related to the final pass attempted by the player in possession.<br>None if the player possession event did not end with a pass attempt or we cannot determine who was the pass target.<br>Third of the targeted player at the moment of the pass. | defensive_third / middle_third / attacking_third | PP |
| `player_targeted_penalty_area_pass` | bool | Related to the final pass attempted by the player in possession.<br>None if the player possession event did not end with a pass attempt or we cannot determine who was the pass target.<br>TRUE if the targeted player is in the penalty area when the pass occurs.<br>Else FALSE. | TRUE / FALSE / None | PP |
| `player_targeted_x_reception` | float | Related to the final pass attempted by the player in possession.<br>None if there was no pass or the pass was incomplete.<br>x location of the targeted player at the moment of the pass reception. | e.g. -3.23 | PP |
| `player_targeted_y_reception` | float | Related to the final pass attempted by the player in possession.<br>None if there was no pass or the pass was incomplete.<br>y location of the targeted player at the moment of the pass reception. | e.g. +12.45 | PP |
| `player_targeted_channel_reception_id` | int |  | 1 (wide_left) / 2 (half_space_left) / 3 (center) / 4 (half_space_right) / 5 (wide_right) | PP |
| `player_targeted_channel_reception` | str | Related to the final pass attempted by the player in possession.<br>None if there was no pass or the pass was incomplete.<br>Channel of the targeted player at the moment of the pass reception. | wide_left / half_space_left / center / half_space_right / wide_right | PP |
| `player_targeted_third_reception_id` | int |  | 1 (defensive_third) / 2 (middle_third) / 3 (attacking_third) | PP |
| `player_targeted_third_reception` | str | Related to the final pass attempted by the player in possession.<br>None if there was no pass or the pass was incomplete.<br>Third of the targeted player at the moment of the pass reception. | defensive_third / middle_third / attacking_third | PP |
| `player_targeted_penalty_area_reception` | bool | Related to the final pass attempted by the player in possession.<br>None if there was no pass or the pass was incomplete.<br>TRUE if the targeted player is in the penalty area at the moment of the pass reception.<br>Else FALSE. | TRUE / FALSE / None | PP |
| `player_targeted_distance_to_goal_start` | float | Distance between the player targeted and the (active) player goal at the start of the event. |  | OBE |
| `player_targeted_distance_to_goal_end` | float | Distance between the player targeted and the (active) player goal at the end of the event. |  | OBE |
| `player_targeted_angle_to_goal_start` | float | Angle (in degree) of the player targeted with the (active) player goal at the start of the event. | e.g. 45 | OBE |
| `player_targeted_angle_to_goal_end` | float | Angle (in degree) of the player targeted with the (active) player goal at the end of the event. | e.g. 51 | OBE |
| `player_targeted_average_speed` | float | Average speed of the targeted player. Computed between frame_physical_start and frame_end. | e.g. 14.3 | OBE |
| `player_targeted_speed_avg_band_id` | int |  | None / 1 (jogging) / 2 (running) / 3 (hsr) / 4 (sprinting) | OBE |
| `player_targeted_speed_avg_band` | str | Speed band associated to the target_average_speed. | None / jogging (if speed_avg below 15 km/h) / running (if speed_avg between 15 km/h and 20km/h) / hsr (if speed_avg between 20 km/h and 25km/h) / sprinting (if speed_avg above 25 km/h) | OBE |
| `speed_difference` | float | average_speed minus target_average_speed.<br>None if any of these speeds is not available. | e.g. 1.5 | OBE |
| `player_targeted_xpass_completion` | float | Related to the final pass attempted by the player in possession.<br>None if the player possession event did not end with a pass attempt or if we cannot determine who was the pass target.<br>Pass completion probability if the player attempted a pass at the end of his possession. | e.g. 0.65 | PP |
| `player_targeted_difficult_pass_target` | float | Related to the final pass attempted by the player in possession.<br>None if the player possession event did not end with a pass attempt or if we cannot determine who was the pass target.<br>TRUE if the probability (xpass_completion) of completing a pass to the targeted player is below 0.65 i.e. the completion chances are below 65%.<br>Else FALSE. | TRUE / FALSE / None | PP |
| `player_targeted_xthreat` | float | Related to the final pass attempted by the player in possession.<br>None if the player possession event did not end with a pass attempt or if we cannot determine who was the pass target.<br>Probability of a goal being scored in the next 10s after the pass was completed.<br>Computed at the moment of the pass, whether the pass was completed or not. | e.g. 0.012 | PP |
| `player_targeted_dangerous` | bool | Related to the final pass attempted by the player in possession.<br>None if the player possession event did not end with a pass attempt or if we cannot determine who was the pass target.<br>TRUE if the probability of a goal being scored in the next 10s after the pass was completed is about 2%.<br>FALSE if it was below 2%.<br>Computed at the moment of the pass, whether the pass was completed or not. | TRUE / FALSE / None | PP |
| `interplayer_distance` | float | Player possession<br>If a pass occurs, distance between the pass location to the player targeted at the moment of the pass.<br>Passing options<br>Distance from the pass location to the player at the moment of the pass. | e.g. None, 30.1 | PO, PP |
| `interplayer_distance_range_id` | int |  | 1 (short) / 2 (medium) / 3 (long) | PO, PP |
| `interplayer_distance_range` | str | Range of the interplayer_distance_range. | short (between 0 to 15 m) / medium (between 15 to 30m) / long (over 30m) | PO, PP |
| `interplayer_distance_start` | float | On Ball Engagements<br>Distance between the player and the player targeted at the start of the event. | e.g. 3.1 | OBE |
| `interplayer_distance_end` | float | On Ball Engagements<br>Distance between the player and the player targeted at the end of the event. | e.g. 1.8 | OBE |
| `interplayer_distance_min` | float | On Ball Engagements<br>Minimal distance between the player and the player targeted during the event when the player in possession has the ball (on-ball engagements can start before the future player in possession receives the ball). | e.g. 0.6 | OBE |
| `interplayer_distance_start_physical` | float | On Ball Engagements<br>Distance between the player and the player targeted when the player starts his physical activity. | e.g. 6.9 | OBE |
| `close_at_player_possession_start` | bool | On Ball Engagements<br>TRUE when the defender is at less than 1.5m and goalside at player possession start.<br>Else FALSE.<br>None if the defensive engagement does not overlap with the player possession start. | TRUE / FALSE | OBE |
| `interplayer_angle` | float | Player possession<br>Angle (in degree) between the direction of attack and the vector from the pass location to the player targeted at the moment of the pass.<br>Passing options<br>Angle (in degree) between the direction of attack and the vector from the pass location to the player targeted at the moment of the pass. | e.g. None, 30.1 | PO, PP |
| `interplayer_direction_id` | int |  | 1 (forward) / 2 (backward) / 3 (sideway left) / 4 (sideway right) | PO, PP |
| `interplayer_direction` | str | Direction associated to the interplayer_angle | forward / backward / sideway left / sideway right | PO, PP |
| `angle_of_engagement` | float | Angle (in degree) between the player speed and the target speed at the start of the event. | e.g. 130 | OBE |
| `goal_side_start` | bool | TRUE if the (active) player is closer to the center of his goal than the player targeted at the start of the event.<br>Else FALSE. | TRUE / FALSE | OBE |
| `goal_side_end` | bool | TRUE if the (active) player is closer to the center of his goal than the player targeted at the end of the event.<br>Else FALSE. | TRUE / FALSE | OBE |

## Teammates And Opponent Context

These attributes describe a player's positioning relative to the defensive line, team shape, and surrounding players.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `last_defensive_line_x_start` | float | x coordinate of the last defender at the start of the event. | e.g. 10.1 | OBR, PO, PP, OBE |
| `last_defensive_line_x_end` | float | x coordinate of the last defender at the end of the event. | e.g. 10.1 | OBR, PO, PP, OBE |
| `delta_to_last_defensive_line_start` | float | Distance along the x axis (in metres) between the last defender and the player at the start of the event (negative if the player passed the line). | e.g. -2.1 | OBR, PO, PP, OBE |
| `delta_to_last_defensive_line_end` | float | Distance along the x axis (in metres) between the last defender and the player at the end of the event (negative if the player passed the line). | e.g. 3.7 | OBR, PO, PP, OBE |
| `delta_to_last_defensive_line_gain` | float | Difference between delta_to_last_defensive_line_end and<br>delta_to_last_defensive_line_start. | e.g.10,1 | OBR, PO, PP, OBE |
| `last_defensive_line_height_start` | float | Distance (in metres) between the last defender and its own goal at the start of the event. | e.g. 43.0 | OBR, PO, PP, OBE |
| `last_defensive_line_height_end` | float | Distance (in metres) between the last defender and its own goal at the end of the event. | e.g. 28.8 | OBR, PO, PP, OBE |
| `last_defensive_line_height_gain` | float | Difference between last_defensive_line_height_end and<br>last_defensive_line_height_start. | e.g.10.1 | OBR, PO, PP, OBE |
| `inside_defensive_shape_start` | bool | TRUE if the player location at the start of the event is inside the opponent team shape.<br>Else FALSE.<br>The team shape corresponds to the smallest convex polygon that contains all the players from the opponent team. | TRUE / FALSE | OBR, PO, PP |
| `inside_defensive_shape_end` | bool | TRUE if the player location at the end of the event is inside the opponent team shape.<br>Else FALSE.<br>The shape corresponds to the smallest convex polygon that contains all the players from the opponent team. | TRUE / FALSE | OBR, PO, PP |
| `n_teammates_ahead_end` | int | Number of player teammates between the player and the opponent goal at the end of the event. | e.g. 5 | PP, OBE |
| `n_teammates_ahead_start` | int | Number of player teammates between the player and the opponent goal at the start of the event. | e.g. 5 | PP, OBE |
| `n_player_targeted_opponents_ahead_start` | int | Player targeted opponents between him and his opponent goal when the event starts. | e.g. 2 | OBE |
| `n_player_targeted_opponents_ahead_end` | int | Player targeted opponents between him and his opponent goal when the event ends. | e.g. 2 | OBE |
| `n_player_targeted_teammates_ahead_start` | int | Player targeted teammates between him and his opponent goal when the event starts. | e.g. 2 | OBE |
| `n_player_targeted_teammates_ahead_end` | int | Player targeted teammates between him and his opponent goal at the end of the event. | e.g. 2 | OBE |
| `n_player_targeted_teammates_within_5m_start` | int | Player targeted teammates within 5m from him at the start of the event. | e.g. 2 | OBE |
| `n_player_targeted_teammates_within_5m_end` | int | Player targeted teammates within 5m from him at the end of the event. | e.g. 2 | OBE |
| `n_player_targeted_opponents_within_5m_start` | int | Player targeted opponents within 5m from him at the start of the event. | e.g. 2 | OBE |
| `n_player_targeted_opponents_within_5m_end` | int | Player targeted opponents within 5m from him at the end of the event. | e.g. 2 | OBE |
| `separation_start` | float | Distance (in metres) from the closest opponent at the start of the event. | e.g. 3.7 | OBR, PO, PP |
| `separation_end` | float | Distance (in metres) from the closest opponent at the end of the event. | e.g. 3.7 | OBR, PO, PP |
| `separation_gain` | float | Difference between separation_end and separation_start.<br>A value > 0 shows an attacker's separation has increased.<br>A value < 0 shows an attacker's separation has decreased. | e.g. 1.1 | OBR, PO, PP |

## Pass / Passing Options Details

These attributes define key characteristics of passes, including distance, direction, difficulty, and threat level.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `pass_distance` | float | If a pass occurs and is completed, distance between the pass location to the reception location.<br>Else None. | e.g. None, 30.1 | PO, PP |
| `pass_range_id` | int |  | 1 (short) / 2 (medium) / 3 (long) | PO, PP |
| `pass_range` | str | Range of the pass_distance. | short (between 0 to 15 m) / medium (between 15 to 30m) / long (over 30m) | PO, PP |
| `pass_angle` | float | If a pass occurs and is completed, angle (in degree) between the direction of attack and the vector from the pass location to the reception location.<br>None if there was no complete pass or if we cannot complete the angle of the pass. | e.g. None, 30.1 | PO, PP |
| `pass_direction_id` | int |  | 1 (forward) / 2 (backward) / 3 (sideway left) / 4 (sideway right) | PO, PP |
| `pass_direction` | str | Direction associated with pass_angle. | forward / backward / sideway left / sideway right | PO, PP |
| `pass_ahead` | bool | Player Possession<br>None if no pass occurs.<br>TRUE if the player targeted is at least 3 m ahead of the player (in possession) along the x axis at the moment of the pass.<br>Else FALSE.<br>Passing Option<br>TRUE if the player is at least 3m ahead of the player in possession at the passing moment.<br>Else FALSE. | True / False / None | PO, PP |
| `passing_option_at_pass_moment` | bool | TRUE if the player is a passing option during the 0.5 seconds before the player in possession attempts a pass (decision frame).<br>Else FALSE. | TRUE / FALSE | PO |
| `dangerous` | bool | TRUE if the probability of a goal being scored in the next 10 seconds (xthreat) is greater than 0.02, assuming a pass was successfully served to the player.<br>Else FALSE.<br>If the player was not targeted by a pass, it is calculated at the passing moment.<br>If the player was targeted by a pass it is calculated at the moment of the pass. | TRUE / FALSE | OBR, PO |
| `difficult_pass_target` | bool | TRUE if the probability (xpass_completion) of completing a pass to the player is below 0.65 i.e. the completion chances are below 65%.<br>Else FALSE.<br>IIf the player was not targeted by a pass, it is calculated at the passing moment.<br>If the player was targeted by a pass it is calculated at the moment of the pass. | TRUE / FALSE | OBR, PO |
| `xthreat` | float | The probability that a goal will be scored 10 seconds after a player is successfully served a pass.<br>If the player was not targeted by a pass, it is calculated at the passing moment.<br>If the player was targeted by a pass it is calculated at the moment of the pass. | e.g. 0.013 | OBR, PO |
| `xpass_completion` | float | The probability of completing a pass to the player.<br>If the player was not targeted by a pass, it is calculated at the passing moment.<br>If the player was targeted by a pass it is calculated at the moment of the pass. | e.g. 0.732 | OBR, PO |
| `passing_option_score` | float | The likelihood that a player will be served the ball.<br>If the player was not targeted by a pass, it is calculated at the passing moment.<br>If the player was targeted by a pass it is calculated at the moment of the pass. | e.g. 0.791 | OBR, PO |
| `predicted_passing_option` | bool | TRUE if the target is a passing option (xreceiver >= 0.6).<br>Else FALSE. | TRUE / FALSE | OBR, PO |
| `peak_passing_option_frame` | int | Frame considered as the passing moment.<br>If the passing option is targeted it is the actual frame of the pass otherwise it is estimated (when xR.xP.xT is maximal and xR >= 0.6). | e.g. 1662 | PO |
| `n_simultaneous_passing_options` | int | The number of passing options that overlap with the current event or that happen less than 5 frames before or after it. | e.g. 3 | PO |

## Line Breaks

These attributes describe whether a line breaking pass occurred or could have occurred.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `organised_defense` | bool | Player Possession<br>None if the player possession did not end with a pass.<br>TRUE if the defense is considered as organised at the moment of the pass.<br>Else FALSE.<br>Line breaks and defensive structure information are delivered only if the organised_defense is TRUE.<br>Passing Option<br>TRUE if the defense is considered as organised at the passing moment.<br>Else FALSE.<br>Line breaks and defensive structure information are delivered only if the organised_defense is TRUE. | TRUE / FALSE | PO, PP |
| `defensive_structure` | int | Defensive structure used to determine line breaks during the pass.<br>It is dynamic and therefore differs from the formation.<br>None if the organised_defense is FALSE or None. | e.g. 442, None | PO, PP |
| `n_defensive_lines` | int | None if organised_defense is FALSE or None.<br>Else, correspond to the number of blocks of 2 or more players in the defensive_structure. | e.g. 2 or 3 | PO, PP |
| `first_line_break` | bool | None if organised_defense is FALSE or None.<br>None if for the corresponding player possession, is_header is TRUE or hand_pass is TRUE.<br>For Player Possession<br>- Assuming the player possession ended with a pass, TRUE if it breaks the first line, Else FALSE. If the pass was incomplete, this value is predicted assuming the pass was completed.<br>- None, if<br>-- we cannot evaluate/predict properly the location of the pass and/or its reception<br>-- OR if no pass was attempted<br>-- OR if there was no first line.<br>For Passing Options<br>- TRUE if it could break the first line, Else FALSE. If the player did not receive the ball (because there was no pass attempt or the pass was incomplete), this value is predicted assuming the player had been served the ball.<br>- None,<br>-- if we know that a pass occurred but we are not able to have an accurate reception location<br>-- OR if there was no first line.<br>-- we cannot evaluate/predict properly the location of the pass and/or its reception | None / TRUE / FALSE | PO, PP |
| `first_line_break_type_id` | int |  | None / 1 (Through) / 2 (Around) | PO |
| `first_line_break_type` | str | None, if we know that a pass occurred but we are not able to have an accurate reception location.<br>None if it did not broke the first line, Around if it broke the line around.<br>Through if it broke the line through.<br>If the player did not receive the ball, this value is predicted assuming the player had received the ball. | None / Through / Around | PO |
| `second_last_line_break` | bool | Player Possession<br>- None, if we know that a pass occurred but we are not able to have an accurate reception location OR if no pass was attempted OR if there was no middle line.<br>- Assuming the player possession ended with a pass, TRUE if it could break the middle line, Else FALSE. If the player did not receive the ball, this value is predicted assuming the player had been served the ball.<br>Passing Options<br>- None, if we know that a pass occurred but we are not able to have an accurate reception location OR if there was no middle line.<br>- TRUE if it could break the middle line, Else FALSE. If the player did not receive the ball, this value is predicted assuming the player had been served the ball. | None / TRUE / FALSE | PO, PP |
| `second_last_line_break_type_id` | int |  | None / 1 (Through) / 2 (Around) | PO |
| `second_last_line_break_type` | str | None, if we know that a pass occurred but we are not able to have an accurate reception location.<br>None if it did not break the middle line, Around if it did break the line around.<br>Through if it did break the line through.<br>If the player did not receive the ball, this value is predicted assuming the player had received the ball. | None / Through / Around | PO |
| `last_line_break` | bool | Player Possession<br>- None, if we know that a pass occurred but we are not able to have an accurate reception location OR if no pass was attempted OR if there was no last line.<br>- Assuming the player possession ended with a pass, TRUE if it could break the last line, Else FALSE. If the player did not receive the ball, this value is predicted assuming the player had been served the ball.<br>Passing Option<br>- None, if we know that a pass occurred but we are not able to have an accurate reception location OR if there was no last line.<br>- TRUE if it could break the last line, Else FALSE. If the player did not receive the ball, this value is predicted assuming the player had been served the ball. | None / TRUE / FALSE | PO, PP |
| `last_line_break_type_id` | int |  | None / 1 (through) / 2 (around) | PO |
| `last_line_break_type` | str | None, if we know that a pass occurred but we are not able to have an accurate reception location.<br>None if it did not break the last line, Around if it did break the line around.<br>Through if it did break the line through.<br>If the player did not receive the ball, this value is predicted assuming the player had received the ball. | None / Through / Around | PO |
| `furthest_line_break_id` | int |  | None / 1 (first_line) / 2 (second_last_line) / 3 (last_line) | PO, PP |
| `furthest_line_break` | str | Player Possession<br>None if the player did not attempt a pass or if he attempted a pass that was not a line breaking pass.<br>If a pass was attempted and completed by the player in possession, line broken that is the closest to the opponent goal.<br>If a pass was attempted but not completed by the player in possession, line that could have been broken if the pass was completed and that is the closest to the opponent goal.<br>Passing Option<br>None if at the passing moment, no line would have been broken with a complete pass.<br>Line that could have been broken with a complete pass and that is the closest to the opponent goal. | None / first_line / second_last_line / last_line | PO, PP |
| `furthest_line_break_type_id` | int |  | None / 1 (Through) / 2 (Around) | PO, PP |
| `furthest_line_break_type` | str | Type of the furthest line break. | None / Through / Around | PO, PP |

## Player Bypassed

These attributes help assess passing effectiveness in bypassing players.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `n_opponents_ahead_player_in_possession_pass_moment` | int | Opponents ahead of the player in possession when he passed the ball to the player.<br>None, if we know that a pass occurred but we are not able to have an accurate reception location. | e.g. 4, , None | PO, PP |
| `n_opponents_ahead_pass_reception` | int | Opponents ahead of the player when he received the ball.<br>If the player in possession did not pass the ball to the player, it is calculated at the passing moment.<br>None, if we know that a pass occurred but we are not able to have an accurate reception location. | e.g. 3, None | PO, PP |
| `n_opponents_bypassed` | int | For a complete pass, the difference between the number of opponents ahead of the player in possession when he releases the ball and the number of opponents ahead of the player targeted when he receives the ball.<br>For an incomplete pass, or a passing option that was not targeted, difference between the number opponents ahead of the player in possession at the pass moment and the number opponents ahead of the potential pass target at the pass moment.<br>It can be negative for a backward pass.<br>None, if we know that a pass occurred but we are not able to have an accurate reception location. | e.g. -1, 2, , None | PO, PP |

## Player Possession Specifics

These attributes provide further details on how a player possession is executed.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `one_touch` | bool | TRUE if the player possession consisted of just one touch.<br>Else FALSE. | TRUE / FALSE | PP |
| `quick_pass` | bool | TRUE if the possession lasts less than 1 second and ends with a pass but the player possession was not a one-touch.<br>Else FALSE. | TRUE / FALSE | PP |
| `carry` | bool | TRUE if the player covers at least 2 metres between the start and the end of his possession.<br>Else FALSE. | TRUE / FALSE | PP |
| `forward_momentum` | bool | TRUE if the forward momentum conditions are respected.<br>Else FALSE. | TRUE / FALSE | PP |
| `is_header` | bool | TRUE if the possession was a header.<br>Else FALSE. | TRUE / FALSE | PP |
| `hand_pass` | bool | None if the player is not the Goalkeeper.<br>TRUE if the GK possession finishes by a hand pass.<br>FALSE if the player is the Goalkeeper and he did not do a hand pass.<br>A GK can have the ball in his hand, then put it on the ground and do the pass with his foot - in this case the field hand_pass will be FALSE. | TRUE / FALSE / None | PP |
| `initiate_give_and_go` | bool | TRUE when, within 2 seconds after passing the ball, the player performs an off-ball run of subtype behind, cross_receiver, overlap, pulling_half_space, pulling_wide, run_ahead_of_the_ball, underlap, support.<br>For support runs we also impose that it starts in the attacking third and in a half_space or the central channel.<br>Else FALSE. | TRUE / FALSE | PP |

## Passing Option Availability

These attributes describe the number and characteristics of passing options available to the player in possession.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `n_passing_options` | int | Related to the passing options available to the player in possession.<br>The number of passing options occurring during the player possession. | e.g. 4 | PP |
| `n_off_ball_runs` | int | The number of off-ball runs occurring during the player possession. | e.g. 3 | PP |
| `n_passing_options_line_break` | int | Related to the passing options available to the player in possession.<br>Number of passing options events happening during the player possession that offer a line break. | e.g. 1 | PP |
| `n_passing_options_first_line_break` | int | Related to the passing options available to the player in possession.<br>Number of passing options events happening during the player possession that offer a first line break.<br>If a passing option would break several lines, we report only the closest line to the opponent goal that would be broken.<br>As a result there is no double counting between passing_options_break_first_line, passing_options_middle_line and passing_options_break_last_line. | e.g. 1 | PP |
| `n_passing_options_second_last_line_break` | int | Related to the passing options available to the player in possession.<br>Number of passing options events happening during the player possession that offer a middle line break.<br>If a passing option would break several lines, we report only the closest line to the opponent goal that would be broken.<br>As a result there is no double counting between passing_options_break_first_line, passing_options_middle_line and passing_options_break_last_line. | e.g. 1 | PP |
| `n_passing_options_last_line_break` | int | Related to the passing options available to the player in possession.<br>Number of passing options events happening during the player possession that offer a last line break.<br>If a passing option would break several lines, we report only the closest line to the opponent goal that would be broken.<br>As a result there is no double counting between passing_options_break_first_line, passing_options_middle_line and passing_options_break_last_line. | e.g. 1 | PP |
| `n_passing_options_ahead` | int | Related to the passing options available to the player in possession.<br>Number of passing options events happening during the player possession that are at least 3m ahead along the x axis at one moment. | e.g. 1 | PP |
| `n_passing_options_dangerous_difficult` | int | Related to the passing options available to the player in possession.<br>Number of passing options events happening during the player possession that are dangerous and difficult. | e.g. 1 | PP |
| `n_passing_options_dangerous_not_difficult` | int | Related to the passing options available to the player in possession.<br>Number of passing options events happening during the player possession that are dangerous and not difficult. | e.g. 1 | PP |
| `n_passing_options_not_dangerous_not_difficult` | int | Related to the passing options available to the player in possession.<br>Number of passing options events happening during the player possession that are not dangerous and not difficult. | e.g. 1 | PP |
| `n_passing_options_not_dangerous_difficult` | int | Related to the passing options available to the player in possession.<br>Number of passing options events happening during the player possession that are not dangerous and difficult. | e.g. 1 | PP |
| `n_passing_options_at_start` | int | Related to the passing options available to the player in possession.<br>Number of passing options available during the first 0.5 seconds of the player possession.<br>None if the player possession lasts less than 0.5 seconds (e.g. one touch pass). | e.g. 1 | PP |
| `n_passing_options_at_end` | int | Related to the passing options available to the player in possession.<br>Number of passing options available during the last 0.5 seconds of the player possession.<br>None if the player possession lasts less than 0.5 seconds (e.g. one touch pass). | e.g. 1 | PP |
| `n_passing_options_ahead_at_start` | int | Related to the passing options available to the player in possession.<br>Number of passing options available during the first 0.5 second of the player possession and are at least 3m ahead along the x axis from the player in possession during these first 0.5 sec. | e.g. 1 | PP |
| `n_passing_options_ahead_at_end` | int | Related to the passing options available to the player in possession.<br>Number of passing options available during the last 0.5 second of the player possession and are at least 3m ahead along the x axis from the player in possession during these last 0.5 sec. | e.g. 1 | PP |

## Off-Ball Run Specifics

These attributes describe off-ball runs, their impact on defensive lines, and their connection to passing options.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `n_simultaneous_runs` | int | The number of off-ball runs that overlap with the current event or that happen less than 5 frames before or after it. | e.g. 2 | OBR |
| `give_and_go` | bool | TRUE if the player starts his off-ball run less than 2 sec after passing the ball.<br>Else FALSE.<br>Applies only to off-ball runs of subtype behind, cross_receiver, overlap, pulling_half_space, pulling_wide, run_ahead_of_the_ball, underlap, support (for support run we also impose that it starts in the attacking third and in a half_space or the central channel). | TRUE / FALSE | OBR |
| `intended_run_behind` | bool | None if the off-ball run is not a run in behind (event_subtype <> "behind").<br>TRUE if a player shows intention to run behind the defensive line. This captures attackers who may hold their run to not be offside, or runs where players are tracked by a defender but there is intent to receive behind the defensive line.<br>Else FALSE. For example a player does break the defensive line. | None / TRUE / FALSE | OBR |
| `push_defensive_line` | bool | None if the off-ball run is not a run in behind (event_subtype <> "behind").<br>TRUE if the last defender moves back at least 10 m back during the off-ball run (between time_start and time_end).<br>Else FALSE. | None / TRUE / FALSE | OBR |
| `break_defensive_line` | bool | None if the off-ball run is not a run in behind (event_subtype <> "behind").<br>TRUE if between end_time - 1s and end_time + 1s, there is at least a frame when the player is 1 meter behind the last defender.<br>Else FALSE. | None / TRUE / FALSE | OBR |
| `passing_option_at_start` | bool | TRUE if the player was a passing option during the first 0.5 seconds of the off-ball run.<br>Else FALSE. | TRUE / FALSE | OBR |

## Player Overtaken

These attributes help evaluate a player's ability to overtake opponents through his off-ball runs.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `n_opponents_ahead_end` | int | The number of opponents (goalkeeper excluded) between the opposing team goal at the end of the event. | e.g. 3 | OBR, PP |
| `n_opponents_ahead_start` | int | The number of opponents (goalkeeper excluded) between the opposing team goal at the start of the event. | e.g. 5 | OBR, PP |
| `n_opponents_overtaken` | int | Difference between opponents_ahead_start and<br>opponents_ahead_end. | e.g. 2 | OBR, PP |

## On-Ball Engagement Specifics

These attributes help evaluate defensive coordination and ability to affect an opponent's line breaking passing options.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `affected_line_breaking_passing_option_id` | str | On-ball Engagements<br>None if the player in possession did not have any line break option during the event that was not difficult (xpass > 0.65).<br>If the player in possession had at least one passing option that was line breaking, and not difficult, then it corresponds to the event_id of one passing option with the highest xreceiver_score. | e.g. 7_5 | OBE |
| `affected_line_break_id` | int |  | None / 1 (first_line) / 2 (second_last_line) / 3 (last_line) | OBE |
| `affected_line_break` | str | On-ball Engagements<br>None if the player in possession did not have a potential line breaking passing option.<br>Else, the furthest line that was broken/would have been broken if the pass would have been attempted and completed. | None / first_line / second_last_line / last_line | OBE |
| `affected_line_breaking_passing_option_attempted` | bool | On-ball Engagements<br>None if the player in possession did have a potential line break passing option.<br>TRUE if the player in possession attempted a pass to his most likely line breaking option. | TRUE / FALSE / None | OBE |
| `affected_line_breaking_passing_option_xthreat` | float | On-ball Engagements<br>None if the player in possession did have a most likely line break passing option.<br>xthreat of the player in possession most likely line breaking option. | e.g. 0.04 | OBE |
| `affected_line_breaking_passing_option_dangerous` | bool | On-ball Engagements<br>None if the player in possession did have a most likely line break passing option.<br>TRUE if the player in possession most likely line breaking option was dangerous.<br>Else FALSE. | TRUE / FALSE / None | OBE |
| `affected_line_breaking_passing_option_run_subtype_id` | int |  | 1 (behind) / 2 (coming_short) / 3 (cross_receiver) / 4 (dropping_off) / 5 (overlap) / 6 (pulling_half_space) / 7 (pulling_wide) / 8 (run_ahead_of_the_ball) / 9 (support) / 10 (underlap) | OBE |
| `affected_line_breaking_passing_option_run_subtype` | str | On-ball Engagements<br>None if the player in possession did have a most likely line break passing option.<br>If the most likely passing option is associated with an off-ball run, then it corresponds to this off-ball run subtype. | behind / coming_short / cross_receiver / dropping_off / overlap / pulling_half_space / pulling_wide / run_ahead_of_the_ball / support / underlap / None | OBE |
| `pressing_chain` | bool | TRUE if the event is part of a pressing chain.<br>Else FALSE. | TRUE / FALSE | OBE |
| `pressing_chain_length` | int | Number of pressing events in the pressing chain.<br>None if the player was not involved in a pressing chain. | e.g. 3 | OBE |
| `pressing_chain_end_type_id` | int |  | 1 (regain) / 2 (disruption) / None | OBE |
| `pressing_chain_end_type` | str | Outcome of the pressing chain the player was involved in.<br>None if the player was not involved in a pressing chain or if the team in possession kept possession without any interruption. | regain / disruption / None | OBE |
| `pressing_chain_index` | int | It represents the sequential identifier for pressing chains that occur during a match. | e.g. 33 | OBE |
| `index_in_pressing_chain` | int | It represents the sequential position of the on-ball engagement within a specific pressing chain. The ordering is based on the start frame of the pressing. | e.g. 2 | OBE |
| `simultaneous_defensive_engagement_same_target` | bool | The number of defensive engagements towards the same target that have at least one frame in common with the current engagement. | e.g. 2 | OBE |
| `simultaneous_defensive_engagement_same_target_rank` | int | If there is at least one simultaneous engagement on the same player targeted, rank of the current engagement ordered by frame start.<br>Else None. | e.g. 1 | OBE |
| `consecutive_on_ball_engagements` | bool | TRUE if the player performed another on ball engagement in the preceding 4 seconds.<br>Else FALSE. | TRUE / FALSE | OBE |

## Data Matching

These attributes indicate to what extent key moments align with tracking data. The better the alignment, the more confident one can be in the accuracy of the event data.

| Field | Type | Description | Values | Events |
|---|---|---|---|---|
| `is_player_possession_start_matched` | bool | TRUE if we are able to match the start of the player possession with the tracking data based on the player and ball position.<br>Else FALSE | TRUE / FALSE | OBR, PO, PP, OBE |
| `is_player_possession_end_matched` | bool | TRUE if we are able to match the end of the player possession with the tracking data based on the player and ball position.<br>Else FALSE | TRUE / FALSE | OBR, PO, PP, OBE |
| `is_previous_pass_matched` | bool | None if the player possession did not start with a pass reception.<br>If the player possession started with a pass reception,<br>- TRUE if the reception was matched with the tracking.<br>- Else FALSE.<br>Then it makes sense to look at all the fields that concern the pass received (“pass_distance_received”, …). | TRUE / FALSE / None | PP, OBE |
| `is_pass_reception_matched` | bool | None if the player possession did not end with a complete pass.<br>If the player possession ended with a complete pass,<br>- TRUE if the reception was matched with the tracking<br>- Else FALSE.<br>Then it makes sense to look at all the fields that concern the pass (“pass_angle”, …). | TRUE / FALSE / None | OBR, PO, PP, OBE |
| `fully_extrapolated` | bool | TRUE if the player is never detected in the video during the whole event meaning that his position is totally predicted by our extrapolation model (either because the player is not in the field of view of the camera or he is not detected).<br>Else FALSE. | TRUE / FALSE | PO, PP |
