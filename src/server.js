"use strict";

const documents = new Map();

const CompletionItemKind = {
  Text: 1,
  Method: 2,
  Function: 3,
  Constructor: 4,
  Field: 5,
  Variable: 6,
  Class: 7,
  Interface: 8,
  Module: 9,
  Property: 10,
  Unit: 11,
  Value: 12,
  Enum: 13,
  Keyword: 14,
  Snippet: 15,
  Color: 16,
  File: 17,
  Reference: 18,
  Folder: 19,
  EnumMember: 20,
  Constant: 21,
  Struct: 22,
  Event: 23,
  Operator: 24,
  TypeParameter: 25,
};

const InsertTextFormat = {
  PlainText: 1,
  Snippet: 2,
};

const MarkupKind = {
  Markdown: "markdown",
  PlainText: "plaintext",
};

const objectTypeChoices =
  "<type>,spartan,elite,monitor,flag,bomb,skull,hill_marker,flag_stand,capture_plate,frag_grenade,plasma_grenade,dmr,assault_rifle,plasma_pistol,spiker,needle_rifle,plasma_repeater,energy_sword,magnum,needler,plasma_rifle,rocket_launcher,shotgun,sniper_rifle,beam_rifle,spartan_laser,gravity_hammer,warthog,ghost,scorpion,wraith,banshee,mongoose,falcon,sabre,sprint,jetpack,armor_lock,active_camo_aa,revenant,pickup_truck,focus_rifle,respawn_zone,plasma_launcher,fusion_coil,initial_spawn_point,health_pack,fireteam_1_respawn_zone,fireteam_2_respawn_zone,fireteam_3_respawn_zone,semi_truck,soccer_ball,golf_ball,golf_club,golf_cup,dice,concussion_rifle,grenade_launcher,phantom_approach,hologram,evade,unsc_data_core,danger_zone,data_core_beam,longsword,particle_emitter_fire,phantom_scenery,pelican_scenery,covenant_drop_pod,respawn_zone_weak,respawn_zone_weak_anti,phantom_device,resupply_capsule,initial_loadout_camera,invisible_covenant_resupply_capsule,covenant_power_core,fuel_rod_gun,drop_shield,detached_machine_gun_turret,machine_gun_turret,detached_plasma_cannon,plasma_cannon,shade,electric_cart,forklift,oni_van,warthog_turret,warthog_turret_gauss,warthog_turret_rocket,scorpion_turret_anti_infantry,falcon_turret_grenade_left,falcon_turret_grenade_right,wraith_turret_anti_infantry,landmine,target_locator,block_1x1_flat,shade_gun_anti_air,shade_gun_fuel_rod,shade_gun_plasma,kill_ball,light_red,light_blue,light_green,light_orange,light_purple,light_yellow,light_white,light_red_flashing,light_yellow_flashing,fx_colorblind,fx_gloomy,fx_juicy,fx_nova,fx_olde_timey,fx_pen_and_ink,fx_purple,fx_orange,fx_green,grid,sound_emitter_alarm_1,sound_emitter_alarm_2,safe_boundary,soft_safe_boundary,kill_boundary,soft_kill_boundary,unsc_data_core_holder,covenant_power_module_stand,covenant_bomb,heavy_barrier,breakpoint_bomb_door";
const objectVariantChoices =
  "<variant-string-id>,default,carter,jun,female,male,emile,player_skull,kat,minor,officer,ultra,space,spec_ops,general,zealot,mp,jetpack,gauss,troop,rocket,fr,pl,35_spire_fp";
const objectCreateFlagsChoices =
  "<flags>,none,never_garbage_collect,suppress_effect,absolute_orientation";
const widgetIconChoices =
  "<icon>,none,speaker,dead_teammate_marker,lightning_bolt,bullseye,diamond,bomb,flag,skull,crown,vip,padlock,territory_a,territory_b,territory_c,territory_d,territory_e,territory_f,terrtory_g,territory_h,territory_i,supply,supply_health,supply_air_drop,supply_ammo,arrow,defend,ordnance,inward";
const visibilityChoices =
  "<who>,no_one,everyone,allies,enemies,default,mod_player";
const vehicleChoices =
  "<vehicle type>,warthog,ghost,scorpion,wraith,banshee,mongoose,falcon,sabre,revenant,pickup_truck,semi_truck,machine_gun_turret,plasma_cannon,shade,electric_cart,forklift,oni_van,warthog_turret,warthog_turret_gauss,warthog_turret_rocket,scorpion_turret_anti_infantry,falcon_turret_grenade_left,falcon_turret_grenade_right,wraith_turret_anti_infantry,shade_gun_anti_air,shade_gun_fuel_rod,shade_gun_plasma";
const timerRateChoices =
  "<rate>,-1000%,-500%,-400%,-300%,-200%,-175%,-150%,-125%,-100%,-75%,-50%,-25%,-10%,0%,10%,25%,50%,75%,100%,125%,150%,175%,200%,300%,400%,500%,1000%";

const blockCompletions = [
  snippet("for each player do", "for each player do\n\t$0\nend", CompletionItemKind.Snippet, "Iterate over every player."),
  snippet("for each player randomly do", "for each player randomly do\n\t$0\nend", CompletionItemKind.Snippet, "Iterate over players in a randomized order."),
  snippet("for each object do", "for each object do\n\t$0\nend", CompletionItemKind.Snippet, "Iterate over every object."),
  snippet(
    "for each object with label do",
    "for each object with label \"${1:<label>}\" do\n\t$0\nend",
    CompletionItemKind.Snippet,
    "Iterate over objects that match a Forge label.",
  ),
  snippet("for each team do", "for each team do\n\t$0\nend", CompletionItemKind.Snippet, "Iterate over every team."),
  snippet("inline", "inline: ${1|do,if,altif,alt|}\n\t$0\nend", CompletionItemKind.Snippet, "Create an inline RVT block."),
  snippet("on pregame: do", "on pregame: do\n\t$0\nend", CompletionItemKind.Snippet, "Run once during pregame setup."),
  snippet("on init: do", "on init: do\n\t$0\nend", CompletionItemKind.Snippet, "Run once when the script initializes."),
  snippet("on local init: do", "on local init: do\n\t$0\nend", CompletionItemKind.Snippet, "Run once for each local client during initialization."),
  snippet("on host migration: do", "on host migration: do\n\t$0\nend", CompletionItemKind.Snippet, "Handle host migration."),
  snippet("on double host migration: do", "on double host migration: do\n\t$0\nend", CompletionItemKind.Snippet, "Handle repeated host migration recovery."),
  snippet("on object death: do", "on object death: do\n\t$0\nend", CompletionItemKind.Snippet, "Handle object death events."),
  snippet("on local: do", "on local: do\n\t$0\nend", CompletionItemKind.Snippet, "Run local-only logic."),
  snippet("if", "if ${1:<condition>} then\n\t$0\nend", CompletionItemKind.Keyword, "Start a conditional block."),
  snippet("then", "then\n\t$0\nend", CompletionItemKind.Keyword, "Insert a `then ... end` block."),
  snippet("do", "do\n\t$0\nend", CompletionItemKind.Keyword, "Insert a `do ... end` block."),
  snippet("function", "function ${1:name}()\n\t$0\nend", CompletionItemKind.Snippet, "Define a user function."),
  snippet("enum", "enum ${1:name}\n\t$0\nend", CompletionItemKind.Snippet, "Define a user enum."),
  item("end", CompletionItemKind.Keyword, "Close the current RVT block."),
  item("declare", CompletionItemKind.Keyword, "Declare a variable."),
  item("alias", CompletionItemKind.Keyword, "Bind a readable name to an expression."),
  item("not", CompletionItemKind.Keyword, "Negate a condition."),
  item("alt", CompletionItemKind.Keyword, "Create the fallback branch of an `if` block."),
  item("altif", CompletionItemKind.Keyword, "Create another conditional branch."),
  snippet(
    "with network priority",
    "with network priority ${1|<priority>,local,low,high|}$0",
    CompletionItemKind.Keyword,
    "Adjust network priority for object creation or iteration.",
  ),
  item("game", CompletionItemKind.Keyword, "Game settings and round state namespace."),
  item("global", CompletionItemKind.Keyword, "Global variable namespace."),
  item("object", CompletionItemKind.Keyword, "Object variable namespace."),
  item("player", CompletionItemKind.Keyword, "Player variable namespace."),
  item("team", CompletionItemKind.Keyword, "Team variable namespace."),
  snippet("script_option", "script_option[${1:n}]$0", CompletionItemKind.Keyword, "Reference a script option."),
  snippet("script_traits", "script_traits[${1:n}]$0", CompletionItemKind.Keyword, "Reference a trait set."),
  snippet("script_widget", "script_widget[${1:n}]$0", CompletionItemKind.Keyword, "Reference a HUD widget."),
  snippet("player", "player[${1:n}]$0", CompletionItemKind.Keyword, "Reference a player slot."),
  snippet("team", "team[${1:n}]$0", CompletionItemKind.Keyword, "Reference a team slot."),
  snippet("allocate temporary", "allocate temporary ${1|<type>,number,object,player,team|}$0", CompletionItemKind.Snippet, "Allocate a temporary script variable."),
  snippet("send_incident", "send_incident(${1:<incident>}, ${2:<cause>}, ${3:<target>})$0", CompletionItemKind.Function, "Send a built-in game incident."),
  snippet("get_random_object", "get_random_object(${1:<label>}, ${2:<exclude>})$0", CompletionItemKind.Function, "Pick a random object by label."),
  snippet("rand", "rand(${1:<cap>})$0", CompletionItemKind.Function, "Generate a random number up to a cap."),
  snippet(
    "set_scenario_interpolator_state",
    "set_scenario_interpolator_state(${1:<which>}, ${2:<state>})$0",
    CompletionItemKind.Function,
    "Set a scenario interpolator state.",
  ),
  item("current_object", CompletionItemKind.Keyword, "Current object in object iteration or event scope."),
  item("current_player", CompletionItemKind.Keyword, "Current player in player iteration or event scope."),
  item("current_team", CompletionItemKind.Keyword, "Current team in team iteration scope."),
  item("no_object", CompletionItemKind.Keyword, "Null object value."),
  item("killed_object", CompletionItemKind.Keyword, "Object that was killed in an object death event."),
  item("killer_object", CompletionItemKind.Keyword, "Object that caused a death event."),
  item("killer_player", CompletionItemKind.Keyword, "Player credited for a death event."),
  item("death_event_damage_type", CompletionItemKind.Keyword, "Damage type from the active death event."),
  item("hud_target_object", CompletionItemKind.Keyword, "Current HUD target object."),
  item("hud_target_player", CompletionItemKind.Keyword, "Current HUD target player."),
  item("hud_target_player_team", CompletionItemKind.Keyword, "Team of the current HUD target player."),
  item("hud_target_team", CompletionItemKind.Keyword, "Current HUD target team."),
  item("local_player", CompletionItemKind.Variable, "Player for the local client."),
  item("local_team", CompletionItemKind.Variable, "Team for the local client."),
  item("allocate", CompletionItemKind.Keyword, "Allocate a script variable."),
];

const gameMembers = [
  snippet("show_message_to", "show_message_to(${1|<who>,current_player,current_team|}, ${2|<sound>,none,announce_slayer,announce_ctf,announce_ctf_captured|}, \"${3:<text>}\")", CompletionItemKind.Function),
  snippet("hud_post_message", "hud_post_message(${1|<who>,current_player,current_team|}, ${2|<sound>,none,announce_slayer,announce_ctf,announce_ctf_captured|}, \"${3:<text>}\")", CompletionItemKind.Function),
  snippet("hs_function_call", "hs_function_call(${1|<function ID>|})", CompletionItemKind.Function),
  item("end_round()", CompletionItemKind.Function),
  item("play_sound_for()", CompletionItemKind.Function),
  ...[
    "betrayal_booting",
    "betrayal_penalty",
    "current_round",
    "dead_players_can_talk",
    "dont_team_restrict_chat",
    "fireteams_enabled",
    "friendly_fire",
    "grace_period_time",
    "grenades_enabled",
    "indestructable_vehicles",
    "lives_per_round",
    "loadout_cam_time",
    "perfection_enabled",
    "powerup_duration_blue",
    "powerup_duration_red",
    "powerup_duration_yellow",
    "proximity_voice",
    "respawn_growth",
    "respawn_time",
    "respawn_traits_time",
    "round_limit",
    "round_time_limit",
    "round_timer",
    "rounds_to_win",
    "score_to_win",
    "sudden_death_time",
    "sudden_death_timer",
    "suicide_penalty",
    "symmetry",
    "symmetry_get",
    "team_lives_per_round",
    "teams_enabled",
  ].map((label) => item(label, CompletionItemKind.Property)),
];

const allocateTypes = [
  item("number", CompletionItemKind.Variable),
  item("object", CompletionItemKind.Variable),
  item("player", CompletionItemKind.Variable),
  item("team", CompletionItemKind.Variable),
];

const globalMembers = [
  snippet("number", "number[${1:n}]$0", CompletionItemKind.Variable),
  snippet("object", "object[${1:n}]$0", CompletionItemKind.Variable),
  snippet("player", "player[${1:n}]$0", CompletionItemKind.Variable),
  snippet("team", "team[${1:n}]$0", CompletionItemKind.Variable),
  snippet("timer", "timer[${1:n}]$0", CompletionItemKind.Variable),
];

const objectMembers = [
  ...globalMembers,
  item("spawn_sequence", CompletionItemKind.Property),
  item("team", CompletionItemKind.Property),
  item("health", CompletionItemKind.Property),
  item("max_health", CompletionItemKind.Property),
  item("max_shields", CompletionItemKind.Property),
  item("shields", CompletionItemKind.Property),
  snippet("has_forge_label", "has_forge_label(\"${1:label}\")$0", CompletionItemKind.Function),
  snippet("is_in_use", "is_in_use()$0", CompletionItemKind.Function),
  snippet("is_of_type", `is_of_type(\${1|${objectTypeChoices}|})$0`, CompletionItemKind.Function),
  snippet("is_out_of_bounds", "is_out_of_bounds()$0", CompletionItemKind.Function),
  snippet("shape_contains", "shape_contains(${1:other})$0", CompletionItemKind.Function),
  snippet("add_weapon", "add_weapon(${1|<weapon>,flag,bomb,skull,dmr,assault_rifle,plasma_pistol,spiker,needle_rifle,plasma_repeater,energy_sword,magnum,needler,plasma_rifle,rocket_launcher,shotgun,sniper_rifle,beam_rifle,spartan_laser,gravity_hammer,focus_rifle,plasma_launcher,golf_club,concussion_rifle,grenade_launcher,unsc_data_core,fuel_rod_gun,detached_machine_gun_turret,detached_plasma_cannon,target_locator,covenant_bomb|}, ${2|<mode>,primary,secondary,force|})$0", CompletionItemKind.Function),
  snippet("animate_device_position", "animate_device_position(${1:animation_target}, ${2:animation_duration}, ${3:acceleration}, ${4:deceleration})$0", CompletionItemKind.Function),
  snippet("apply_shape_color_from_player_member", "apply_shape_color_from_player_member(${1:member})$0", CompletionItemKind.Function),
  snippet("attach_to", "attach_to(${1:<basis>}, ${2:<x>}, ${3:<y>}, ${4:<z>}, ${5|<reference_frame>,absolute,relative|})$0", CompletionItemKind.Function),
  snippet("copy_rotation_from", "copy_rotation_from(${1:<other>}, ${2|<all_axes>,true,false|})$0", CompletionItemKind.Function),
  snippet("create_object", `create_object(\${1|${objectTypeChoices}|}, \${2:<label>}, \${3|${objectCreateFlagsChoices}|}, \${4:<x>}, \${5:<y>}, \${6:<z>}, \${7|${objectVariantChoices}|})$0`, CompletionItemKind.Function),
  snippet("delete", "delete()$0", CompletionItemKind.Function),
  snippet("detach", "detach()$0", CompletionItemKind.Function),
  snippet("enable_spawn_zone", "enable_spawn_zone(${1|0,1|})$0", CompletionItemKind.Function),
  snippet("face_toward", "face_toward(${1:<other>}, ${2:<x>}, ${3:<y>}, ${4:<z>})$0", CompletionItemKind.Function),
  snippet("get_device_position", "get_device_position()$0", CompletionItemKind.Function),
  snippet("get_device_power", "get_device_power()$0", CompletionItemKind.Function),
  snippet("get_distance_to", "get_distance_to(${1:<other>})$0", CompletionItemKind.Function),
  snippet("get_orientation", "get_orientation()$0", CompletionItemKind.Function),
  snippet("get_speed", "get_speed()$0", CompletionItemKind.Function),
  snippet("kill", "kill(${1|<silent>,true,false|})$0", CompletionItemKind.Function),
  snippet("place_at_me", `place_at_me(\${1|${objectTypeChoices}|}, \${2:<label>}, \${3|${objectCreateFlagsChoices}|}, \${4:<x>}, \${5:<y>}, \${6:<z>}, \${7|${objectVariantChoices}|})$0`, CompletionItemKind.Function),
  snippet("place_between_me_and", `place_between_me_and(\${1:<other>}, \${2|${objectTypeChoices}|}, \${3:radius})$0`, CompletionItemKind.Function),
  snippet("push_upward", "push_upward()$0", CompletionItemKind.Function),
  snippet("apply_upward_impulse", "apply_upward_impulse()$0", CompletionItemKind.Function),
  snippet("remove_weapon", "remove_weapon(${1|<mode>,primary,secondary|}, ${2|<delete>,true,false|})$0", CompletionItemKind.Function),
  snippet("set_boundary", "set_boundary(${1|<type>,none,sphere,cylinder,box|})$0", CompletionItemKind.Function),
  snippet("set_device_actual_position", "set_device_actual_position(${1:<position>})$0", CompletionItemKind.Function),
  snippet("set_device_animation_position", "set_device_animation_position(${1|<animation>,mp_boneyard_a_idle_start,mp_boneyard_a_fly_in,mp_boneyard_a_idle_mid,mp_boneyard_a_fly_out,mp_boneyard_b_fly_in,mp_boneyard_b_idle_mid,mp_boneyard_b_fly_out,mp_boneyard_b_idle_start,mp_boneyard_a_leave1,mp_boneyard_b_leave1,mp_boneyard_b_pickup,mp_boneyard_b_idle_pickup,mp_boneyard_a,mp_boneyard_b,mp_spire_fp|}, ${2:<position>})$0", CompletionItemKind.Function),
  snippet("set_device_position", "set_device_position(${1:<position>})$0", CompletionItemKind.Function),
  snippet("set_device_power", "set_device_power(${1:<power>})$0", CompletionItemKind.Function),
  snippet("set_garbage_collection_disabled", "set_garbage_collection_disabled(${1|0,1|})$0", CompletionItemKind.Function),
  snippet("set_hidden", "set_hidden(${1|true,false|})$0", CompletionItemKind.Function),
  snippet("set_invincibility", "set_invincibility(${1|0,1|})$0", CompletionItemKind.Function),
  snippet("set_pickup_permissions", `set_pickup_permissions(\${1|${visibilityChoices}|})$0`, CompletionItemKind.Function),
  snippet("set_progress_bar", `set_progress_bar(\${1:<timer>}, \${2|${visibilityChoices}|})$0`, CompletionItemKind.Function),
  snippet("set_scale", "set_scale(${1:<scale>})$0", CompletionItemKind.Function),
  snippet("set_shape", "set_shape(${1|<type>,none,sphere,cylinder,box|})$0", CompletionItemKind.Function),
  snippet("set_shape_visibility", `set_shape_visibility(\${1|${visibilityChoices}|})$0`, CompletionItemKind.Function),
  snippet("set_spawn_location_fireteams", "set_spawn_location_fireteams(${1|<fireteam_indice>,none,all|})$0", CompletionItemKind.Function),
  snippet("set_fireteam_respawn_filter", "set_fireteam_respawn_filter(${1|<fireteam_indice>,none,all|})$0", CompletionItemKind.Function),
  snippet("set_spawn_location_permissions", `set_spawn_location_permissions(\${1|${visibilityChoices}|})$0`, CompletionItemKind.Function),
  snippet("set_waypoint_icon", `set_waypoint_icon(\${1|${widgetIconChoices}|})$0`, CompletionItemKind.Function),
  snippet("set_waypoint_priority", "set_waypoint_priority(${1|<priority>,low,normal,high,blink|})$0", CompletionItemKind.Function),
  snippet("set_waypoint_range", "set_waypoint_range(${1:<min>}, ${2:<max>})$0", CompletionItemKind.Function),
  snippet("set_waypoint_text", "set_waypoint_text(\"${1:<text>}\")$0", CompletionItemKind.Function),
  snippet("set_waypoint_timer", "set_waypoint_timer(${1|<timer>,none|})$0", CompletionItemKind.Function),
  snippet("set_waypoint_visibility", `set_waypoint_visibility(\${1|${visibilityChoices}|})$0`, CompletionItemKind.Function),
  snippet("set_weapon_pickup_priority", "set_weapon_pickup_priority(${1|<priority>,normal,high,automatic|})$0", CompletionItemKind.Function),
  snippet("try_get_carrier", "try_get_carrier()$0", CompletionItemKind.Function),
  snippet("get_carrier", "get_carrier()$0", CompletionItemKind.Function),
];

const playerMembers = [
  ...globalMembers,
  item("biped", CompletionItemKind.Property),
  item("rating", CompletionItemKind.Property),
  item("score", CompletionItemKind.Property),
  snippet("script_stat", "script_stat[${1:n}]", CompletionItemKind.Property),
  item("team", CompletionItemKind.Property),
  item("frag_grenades", CompletionItemKind.Property),
  item("plasma_grenades", CompletionItemKind.Property),
  snippet("assisted_kill_of", "assisted_kill_of(${1:<victim>})$0", CompletionItemKind.Function),
  snippet("is_elite", "is_elite()$0", CompletionItemKind.Function),
  snippet("is_fireteam_leader", "is_fireteam_leader()$0", CompletionItemKind.Function),
  snippet("is_monitor", "is_monitor()$0", CompletionItemKind.Function),
  snippet("is_not_respawning", "is_not_respawning()$0", CompletionItemKind.Function),
  snippet("is_spartan", "is_spartan()$0", CompletionItemKind.Function),
  snippet("killer_type_is", "killer_type_is(${1|<types>,guardians,suicide,kill,betrayal,quit|})$0", CompletionItemKind.Function),
  snippet("add_weapon", "add_weapon(${1:<weapon>})$0", CompletionItemKind.Function),
  snippet("apply_traits", "apply_traits(${1:<traits>})$0", CompletionItemKind.Function),
  snippet("force_into_vehicle", "force_into_vehicle(${1:<vehicle>})$0", CompletionItemKind.Function),
  snippet("get_armor_ability", "get_armor_ability()$0", CompletionItemKind.Function),
  snippet("get_button_press_duration", "get_button_press_duration(${1|<button>,jump,switch_grenade,context_primary,melee_attack,equipment,throw_grenade,fire_primary,crouch,scope_zoom,night_vision,fire_secondary,fire_tertiary,vehicle_trick|})$0", CompletionItemKind.Function),
  snippet("get_button_time", "get_button_time(${1|<button>,jump,switch_grenade,context_primary,melee_attack,equipment,throw_grenade,fire_primary,crouch,scope_zoom,night_vision,fire_secondary,fire_tertiary,vehicle_trick|})$0", CompletionItemKind.Function),
  snippet("get_crosshair_target", "get_crosshair_target()$0", CompletionItemKind.Function),
  snippet("get_death_damage_mod", "get_death_damage_mod()$0", CompletionItemKind.Function),
  snippet("get_death_damage_type", "get_death_damage_type()$0", CompletionItemKind.Function),
  snippet("get_fireteam", "get_fireteam()$0", CompletionItemKind.Function),
  snippet("get_killer", "get_killer()$0", CompletionItemKind.Function),
  snippet("get_scoreboard_pos", "get_scoreboard_pos()$0", CompletionItemKind.Function),
  snippet("get_spree_count", "get_spree_count()$0", CompletionItemKind.Function),
  snippet("get_vehicle", "get_vehicle()$0", CompletionItemKind.Function),
  snippet("get_weapon", "get_weapon(${1|<which>,primary,secondary|})$0", CompletionItemKind.Function),
  snippet("record_griefer_penalty", "record_griefer_penalty()$0", CompletionItemKind.Function),
  snippet("set_biped", "set_biped(${1:<biped>})$0", CompletionItemKind.Function),
  snippet("set_co_op_spawning", "set_co_op_spawning(${1|<enable>,true,false|})$0", CompletionItemKind.Function),
  snippet("set_fireteam", "set_fireteam(${1:<index>})$0", CompletionItemKind.Function),
  snippet("set_loadout_palette", "set_loadout_palette(${1|<palette>,none,spartan_tier_1,spartan_tier_2,spartan_tier_3,elite_tier_1,elite_tier_2,elite_tier_3|})$0", CompletionItemKind.Function),
  snippet("set_objective_allegiance_icon", `set_objective_allegiance_icon(\${1|${widgetIconChoices}|})$0`, CompletionItemKind.Function),
  snippet("set_objective_allegiance_name", "set_objective_allegiance_name(${1:<text>})$0", CompletionItemKind.Function),
  snippet("set_objective_text", "set_objective_text(${1:<text>})$0", CompletionItemKind.Function),
  snippet("set_primary_respawn_object", "set_primary_respawn_object(${1:<respawn>})$0", CompletionItemKind.Function),
  snippet("set_req_purchase_modes", "set_req_purchase_modes(${1:<modes>})$0", CompletionItemKind.Function),
  snippet("set_requisition_palette", "set_requisition_palette(${1:<palette>})$0", CompletionItemKind.Function),
  snippet("set_respawn_vehicle", `set_respawn_vehicle(\${1|${vehicleChoices}|})$0`, CompletionItemKind.Function),
  snippet("set_round_card_icon", `set_round_card_icon(\${1|${widgetIconChoices}|})$0`, CompletionItemKind.Function),
  snippet("set_round_card_text", "set_round_card_text(${1:<text>})$0", CompletionItemKind.Function),
  snippet("set_round_card_title", "set_round_card_title(${1:<text>})$0", CompletionItemKind.Function),
  snippet("set_vehicle_spawning_enabled", "set_vehicle_spawning_enabled(${1|true,false|})$0", CompletionItemKind.Function),
  snippet("try_get_armor_ability", "try_get_armor_ability()$0", CompletionItemKind.Function),
  snippet("try_get_death_damage_mod", "try_get_death_damage_mod()$0", CompletionItemKind.Function),
  snippet("try_get_death_damage_type", "try_get_death_damage_type()$0", CompletionItemKind.Function),
  snippet("try_get_killer", "try_get_killer()$0", CompletionItemKind.Function),
  snippet("try_get_vehicle", "try_get_vehicle()$0", CompletionItemKind.Function),
  snippet("try_get_weapon", "try_get_weapon(${1|<which>,primary,secondary|})$0", CompletionItemKind.Function),
  item("money", CompletionItemKind.Property),
];

const teamMembers = [
  ...globalMembers,
  item("score", CompletionItemKind.Property),
  snippet("script_stat", "script_stat[${1:n}]", CompletionItemKind.Property),
  snippet("has_alliance_status", "has_alliance_status(${1:<other>}, ${2|<status>,friendly,neutral,enemy|})$0", CompletionItemKind.Function),
  snippet("has_any_players", "has_any_players()$0", CompletionItemKind.Function),
  snippet("get_scoreboard_pos", "get_scoreboard_pos()$0", CompletionItemKind.Function),
  snippet("set_co_op_spawning", "set_co_op_spawning(${1|<enable>,true,false|})$0", CompletionItemKind.Function),
  snippet("set_primary_respawn_object", "set_primary_respawn_object(${1:<respawn>})$0", CompletionItemKind.Function),
  snippet("set_respawn_filter", "set_respawn_filter(${1:<filter>})$0", CompletionItemKind.Function),
  snippet("set_vehicle_spawning_enabled", "set_vehicle_spawning_enabled(${1|true,false|})$0", CompletionItemKind.Function),
  snippet("set_respawn_vehicle", `set_respawn_vehicle(\${1|${vehicleChoices}|})$0`, CompletionItemKind.Function),
];

const timerMembers = [
  snippet("is_zero", "is_zero()$0", CompletionItemKind.Function),
  snippet("reset", "reset()$0", CompletionItemKind.Function),
  snippet("set_rate", `set_rate(\${1|${timerRateChoices}|})$0`, CompletionItemKind.Function),
];

const widgetMembers = [
  snippet("set_icon", `set_icon(\${1|${widgetIconChoices}|})$0`, CompletionItemKind.Function, "Set the HUD widget icon."),
  snippet("set_meter_params", "set_meter_params(${1:<min>}, ${2:<max>})$0", CompletionItemKind.Function, "Set the meter range for a widget."),
  snippet("set_text", "set_text(\"${1:<text>}\"${2:, ${3:<value>}})$0", CompletionItemKind.Function, "Set HUD widget text, optionally with a formatted value."),
  snippet("set_value_text", "set_value_text(${1:<value>})$0", CompletionItemKind.Function, "Set the numeric value text for a widget."),
  snippet("set_visibility", "set_visibility(${1:<who>}, ${2|true,false|})$0", CompletionItemKind.Function, "Show or hide a widget for a player or team."),
];

const memberTables = new Map([
  ["game", gameMembers],
  ["global", globalMembers],
  ["object", objectMembers],
  ["player", playerMembers],
  ["team", teamMembers],
  ["timer", timerMembers],
  ["widget", widgetMembers],
]);

const triggers = ["."]; 

let buffer = "";
let nextId = 1;
const pending = new Map();

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  consume();
});

function consume() {
  while (true) {
    const headerEnd = buffer.indexOf("\r\n\r\n");
    if (headerEnd < 0) return;
    const header = buffer.slice(0, headerEnd);
    const match = header.match(/Content-Length: (\\d+)/i);
    if (!match) {
      buffer = "";
      return;
    }
    const length = Number(match[1]);
    const bodyStart = headerEnd + 4;
    if (buffer.length < bodyStart + length) return;
    const body = buffer.slice(bodyStart, bodyStart + length);
    buffer = buffer.slice(bodyStart + length);
    handle(JSON.parse(body));
  }
}

function handle(message) {
  if (message.method === "initialize") {
    reply(message.id, {
      capabilities: {
        textDocumentSync: 1,
        completionProvider: {
          resolveProvider: false,
          triggerCharacters: triggers,
        },
        hoverProvider: true,
      },
      serverInfo: {
        name: "rvt-language-server",
        version: "0.1.0",
      },
    });
    notify("$/logTrace", { message: "RVT language server initialized." });
    return;
  }

  if (message.method === "initialized") {
    return;
  }

  if (message.method === "shutdown") {
    reply(message.id, null);
    return;
  }

  if (message.method === "exit") {
    process.exit(0);
  }

  if (message.method === "textDocument/didOpen") {
    documents.set(message.params.textDocument.uri, message.params.textDocument.text);
    publishDiagnostics(message.params.textDocument.uri);
    return;
  }

  if (message.method === "textDocument/didChange") {
    const change = message.params.contentChanges.at(-1);
    if (change) {
      documents.set(message.params.textDocument.uri, change.text);
      publishDiagnostics(message.params.textDocument.uri);
    }
    return;
  }

  if (message.method === "textDocument/didClose") {
    documents.delete(message.params.textDocument.uri);
    notify("textDocument/publishDiagnostics", {
      uri: message.params.textDocument.uri,
      diagnostics: [],
    });
    return;
  }

  if (message.method === "textDocument/completion") {
    reply(message.id, complete(message.params));
    return;
  }

  if (message.method === "textDocument/hover") {
    reply(message.id, hover(message.params));
    return;
  }

  if (message.id != null) {
    reply(message.id, null);
  }
}

function complete(params) {
  const text = documents.get(params.textDocument.uri) || "";
  const lines = text.split(/\\r?\\n/);
  const line = lines[params.position.line] || "";
  const prefix = line.slice(0, params.position.character);
  const lower = prefix.toLowerCase();
  const aliasTypes = collectAliasTypes(text);
  const memberType = inferMemberTargetType(lower, aliasTypes);

  if (lower.endsWith("game.")) return gameMembers;
  if (lower.endsWith("global.")) return lower.includes("allocate") ? allocateTypes : globalMembers;
  if (memberType === "object") return lower.includes("allocate") ? allocateTypes : objectMembers;
  if (memberType === "player") return lower.includes("allocate") ? allocateTypes : playerMembers;
  if (memberType === "team") return lower.includes("allocate") ? allocateTypes : teamMembers;
  if (memberType === "timer") return timerMembers;
  if (memberType === "widget") return widgetMembers;

  return blockCompletions;
}

function hover(params) {
  const text = documents.get(params.textDocument.uri) || "";
  const lines = text.split(/\r?\n/);
  const line = lines[params.position.line] || "";
  const aliasTypes = collectAliasTypes(text);
  const member = getMemberContextAt(line, params.position.character, aliasTypes);
  if (member) {
    const entry = getCompletionEntry(member.type, member.name);
    if (!entry) return null;
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: renderDocumentation(entry, member.type),
      },
    };
  }

  const word = wordAt(line, params.position.character);
  const topLevel = blockCompletions.find((entry) => entry.label === word);
  if (!topLevel) return null;
  return {
    contents: {
      kind: MarkupKind.Markdown,
      value: renderDocumentation(topLevel),
    },
  };
}

function collectAliasTypes(text) {
  const aliases = new Map();
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*alias\s+([a-z_]\w*)\s*=\s*(.+?)\s*$/i);
    if (!match) continue;
    const [, name, rawValue] = match;
    const value = rawValue.toLowerCase();
    let type = null;
    if (/\bscript_widget\s*\[/.test(value)) type = "widget";
    else if (/\btimer\s*\[/.test(value)) type = "timer";
    else if (/\bplayer\s*\[/.test(value) || value.includes("current_player") || value.includes("killer_player") || value.includes("local_player")) type = "player";
    else if (/\bteam\s*\[/.test(value) || value.includes("current_team") || value.includes("local_team") || value.includes("hud_target_player_team") || value.includes("hud_target_team")) type = "team";
    else if (/\bobject\s*\[/.test(value) || value.includes("current_object") || value.includes("killed_object") || value.includes("killer_object") || value.includes("hud_target_object") || value.includes("biped")) type = "object";
    else if (/^allocate(?: temporary)?\s+(?:global\.)?(number|object|player|team|timer)\b/.test(value)) {
      type = RegExp.$1;
    } else if (aliases.has(value.trim())) {
      type = aliases.get(value.trim());
    }
    if (type) aliases.set(name.toLowerCase(), type);
  }
  return aliases;
}

function inferMemberTargetType(prefix, aliasTypes) {
  const match = prefix.match(/([a-z_][\w]*|\w+\[\d+\])\.$/i);
  if (!match) return null;
  const target = match[1].toLowerCase();

  if (
    target === "object" ||
    target === "biped" ||
    target === "obj" ||
    /^object\[\d+\]$/.test(target) ||
    target === "current_object" ||
    target === "killed_object" ||
    target === "killer_object" ||
    target === "hud_target_object"
  ) return "object";

  if (
    target === "player" ||
    /^player\[\d+\]$/.test(target) ||
    target === "current_player" ||
    target === "killer_player" ||
    target === "local_player" ||
    target === "hud_target_player"
  ) return "player";

  if (
    target === "team" ||
    /^team\[\d+\]$/.test(target) ||
    target === "current_team" ||
    target === "local_team" ||
    target === "hud_target_player_team" ||
    target === "hud_target_team"
  ) return "team";

  if (target === "timer" || /^timer\[\d+\]$/.test(target)) return "timer";
  if (target === "script_widget" || /^script_widget\[\d+\]$/.test(target)) return "widget";

  return aliasTypes.get(target) || null;
}

function getCompletionEntry(type, name) {
  return memberTables.get(type)?.find((entry) => entry.label === name) || null;
}

function getMemberContextAt(line, character, aliasTypes) {
  const prefix = line.slice(0, character);
  const match = prefix.match(/([a-z_][\w]*|\w+\[\d+\])\.([a-z_][\w]*)?$/i);
  if (!match) return null;
  const targetType = inferMemberTargetType(`${match[1]}.`, aliasTypes);
  if (!targetType || !match[2]) return null;
  return { type: targetType, name: match[2] };
}

function wordAt(line, character) {
  const clamped = Math.max(0, Math.min(character, line.length));
  const left = line.slice(0, clamped);
  const right = line.slice(clamped);
  const leftMatch = left.match(/[A-Za-z_][A-Za-z0-9_]*$/);
  const rightMatch = right.match(/^[A-Za-z0-9_]*/);
  if (!leftMatch) return "";
  return leftMatch[0] + (rightMatch ? rightMatch[0] : "");
}

function renderDocumentation(entry, namespace = null) {
  const lines = [`\`${entry.label}\``];
  if (namespace) lines.push(`Namespace: \`${namespace}\``);
  if (entry.detail) lines.push(entry.detail);
  const doc = extractDoc(entry.documentation);
  if (doc) lines.push(doc);
  return lines.join("\n\n");
}

function extractDoc(documentation) {
  if (!documentation) return "";
  if (typeof documentation === "string") return documentation;
  return documentation.value || "";
}

function item(label, kind = CompletionItemKind.Text, documentation = "") {
  const result = { label, kind };
  if (documentation) {
    result.documentation = {
      kind: MarkupKind.Markdown,
      value: documentation,
    };
  }
  return result;
}

function snippet(label, insertText, kind = CompletionItemKind.Snippet, documentation = "") {
  const result = {
    label,
    kind,
    insertText,
    insertTextFormat: InsertTextFormat.Snippet,
  };
  if (documentation) {
    result.documentation = {
      kind: MarkupKind.Markdown,
      value: documentation,
    };
  }
  return result;
}

function publishDiagnostics(uri) {
  notify("textDocument/publishDiagnostics", {
    uri,
    diagnostics: diagnose(documents.get(uri) || ""),
  });
}

function diagnose(text) {
  const lines = text.split(/\r?\n/);
  const aliasTypes = collectAliasTypes(text);
  const diagnostics = [];
  const blockStack = [];
  let inBlockComment = false;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const lowered = line.toLowerCase();
    const trimmed = lowered.trim();

    if (!inBlockComment && trimmed.startsWith("--[[")) {
      inBlockComment = true;
      if (!trimmed.includes("]]")) continue;
    }
    if (inBlockComment) {
      if (trimmed.includes("]]")) inBlockComment = false;
      continue;
    }

    if (/^\s*(function|enum|for\b|on\b|if\b|inline\b)/.test(trimmed)) {
      blockStack.push({ line: lineIndex, text: line.trim() });
    }
    if (/^\s*end\b/.test(trimmed)) {
      if (blockStack.length) blockStack.pop();
      else {
        diagnostics.push(diagnostic(lineIndex, line.indexOf("end"), 3, "Unexpected `end` with no matching block start."));
      }
    }

    const memberCall = line.match(/([A-Za-z_][A-Za-z0-9_]*|\w+\[\d+\])\.([A-Za-z_][A-Za-z0-9_]*)\s*\(/);
    if (memberCall) {
      const targetType = inferMemberTargetType(`${memberCall[1].toLowerCase()}.`, aliasTypes);
      if (targetType && targetType !== "global") {
        const known = memberTables.get(targetType);
        if (known && !known.some((entry) => entry.label === memberCall[2])) {
          diagnostics.push(
            diagnostic(
              lineIndex,
              line.indexOf(memberCall[2]),
              memberCall[2].length,
              `Unknown ${targetType} member \`${memberCall[2]}\`.`,
            ),
          );
        }
      }
    }
  }

  if (inBlockComment && lines.length) {
    diagnostics.push(diagnostic(lines.length - 1, 0, lines.at(-1).length, "Unterminated block comment."));
  }
  for (const block of blockStack) {
    diagnostics.push(diagnostic(block.line, 0, block.text.length, "Block appears to be missing a closing `end`."));
  }

  return diagnostics;
}

function diagnostic(line, startChar, length, message) {
  const start = Math.max(0, startChar);
  return {
    severity: 2,
    source: "rvt-lsp",
    message,
    range: {
      start: { line, character: start },
      end: { line, character: start + Math.max(1, length) },
    },
  };
}

function reply(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function notify(method, params) {
  send({ jsonrpc: "2.0", method, params });
}

function send(payload) {
  const json = JSON.stringify(payload);
  process.stdout.write(`Content-Length: ${Buffer.byteLength(json, "utf8")}\r\n\r\n${json}`);
}
