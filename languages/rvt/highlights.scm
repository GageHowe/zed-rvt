(line_comment) @comment
(block_comment) @comment

[
  "function"
  "alias"
  "declare"
  "enum"
  "allocate"
  "inline"
  "for"
  "on"
  "do"
  "if"
  "then"
  "alt"
  "altif"
  "end"
  "not"
] @keyword

[
  "each"
  "player"
  "object"
  "team"
  "randomly"
  "with"
  "label"
  "temporary"
] @keyword

[
  "true"
  "false"
  "none"
] @constant.builtin

(string) @string
(number) @number

(function_definition
  name: (identifier) @function)

(enum_definition
  name: (identifier) @type)

(call_expression
  function: (identifier) @function)

(call_expression
  function: (member_expression
    property: (identifier) @function.method))

(member_expression
  object: (identifier) @variable)

(member_expression
  property: (identifier) @property)

(subscript_expression
  object: (identifier) @variable)

(subscript_expression
  index: (number) @number)

(for_each_statement
  label: (string) @string)

(for_each_statement
  label: (number) @number)

(identifier) @variable

((identifier) @type.builtin
  (#match? @type.builtin "^(number|object|player|team|timer|script_option|script_traits|script_widget)$"))

((identifier) @variable.special
  (#match? @variable.special "^(game|global|current_object|current_player|current_team|local_player|local_team|killed_object|killer_object|killer_player|hud_player|hud_player_team|hud_target_object|hud_target_player|hud_target_player_team|hud_target_team|no_object|no_player|no_team|no_widget|all_players|all_teams|all_objects)$"))

((identifier) @constant
  (#match? @constant "^(none|absolute|relative|everyone|no_one|allies|enemies|default|mod_player|never_garbage_collect|suppress_effect|primary|secondary|force|sphere|cylinder|box|low|normal|high|blink|friendly|neutral|enemy|local)$"))

((identifier) @constant.builtin
  (#match? @constant.builtin "^(monitor|mongoose|spartan|elite|flag|bomb|skull|hill_marker|flag_stand|capture_plate|frag_grenade|plasma_grenade|dmr|assault_rifle|plasma_pistol|spiker|needle_rifle|plasma_repeater|energy_sword|magnum|needler|plasma_rifle|rocket_launcher|shotgun|sniper_rifle|beam_rifle|spartan_laser|gravity_hammer|warthog|ghost|scorpion|wraith|banshee|falcon|sabre|sprint|jetpack|armor_lock|active_camo_aa|revenant|pickup_truck|focus_rifle|respawn_zone|plasma_launcher|fusion_coil|initial_spawn_point|health_pack|fireteam_1_respawn_zone|fireteam_2_respawn_zone|fireteam_3_respawn_zone|semi_truck|soccer_ball|golf_ball|golf_club|golf_cup|dice|concussion_rifle|grenade_launcher|phantom_approach|hologram|evade|unsc_data_core|danger_zone|data_core_beam|longsword|particle_emitter_fire|phantom_scenery|pelican_scenery|covenant_drop_pod|respawn_zone_weak|respawn_zone_weak_anti|phantom_device|resupply_capsule|initial_loadout_camera|invisible_covenant_resupply_capsule|covenant_power_core|fuel_rod_gun|drop_shield|detached_machine_gun_turret|machine_gun_turret|detached_plasma_cannon|plasma_cannon|shade|electric_cart|forklift|oni_van|warthog_turret|warthog_turret_gauss|warthog_turret_rocket|scorpion_turret_anti_infantry|falcon_turret_grenade_left|falcon_turret_grenade_right|wraith_turret_anti_infantry|landmine|target_locator|block_1x1_flat|shade_gun_anti_air|shade_gun_fuel_rod|shade_gun_plasma|kill_ball|light_red|light_blue|light_green|light_orange|light_purple|light_yellow|light_white|light_red_flashing|light_yellow_flashing|fx_colorblind|fx_gloomy|fx_juicy|fx_nova|fx_olde_timey|fx_pen_and_ink|fx_purple|fx_orange|fx_green|grid|sound_emitter_alarm_1|sound_emitter_alarm_2|safe_boundary|soft_safe_boundary|kill_boundary|soft_kill_boundary|unsc_data_core_holder|covenant_power_module_stand|covenant_bomb|heavy_barrier|breakpoint_bomb_door)$"))
