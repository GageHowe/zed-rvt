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

const blockCompletions = [
  snippet("for each player do", "for each player do\n\t$0\nend"),
  snippet("for each player randomly do", "for each player randomly do\n\t$0\nend"),
  snippet("for each object do", "for each object do\n\t$0\nend"),
  snippet(
    "for each object with label do",
    "for each object with label \"${1:<label>}\" do\n\t$0\nend",
  ),
  snippet("for each team do", "for each team do\n\t$0\nend"),
  snippet("inline", "inline: ${1|do,if,altif,alt|}\n\t$0\nend"),
  snippet("on pregame: do", "on pregame: do\n\t$0\nend"),
  snippet("on init: do", "on init: do\n\t$0\nend"),
  snippet("on local init: do", "on local init: do\n\t$0\nend"),
  snippet("on host migration: do", "on host migration: do\n\t$0\nend"),
  snippet("on double host migration: do", "on double host migration: do\n\t$0\nend"),
  snippet("on object death: do", "on object death: do\n\t$0\nend"),
  snippet("on local: do", "on local: do\n\t$0\nend"),
  snippet("if", "if ${1:<condition>} then\n\t$0\nend", CompletionItemKind.Keyword),
  snippet("then", "then\n\t$0\nend", CompletionItemKind.Keyword),
  snippet("do", "do\n\t$0\nend", CompletionItemKind.Keyword),
  snippet("function", "function ${1:name}()\n\t$0\nend"),
  snippet("enum", "enum ${1:name}\n\t$0\nend"),
  item("end", CompletionItemKind.Keyword),
  item("declare", CompletionItemKind.Keyword),
  item("alias", CompletionItemKind.Keyword),
  item("not", CompletionItemKind.Keyword),
  item("alt", CompletionItemKind.Keyword),
  item("altif", CompletionItemKind.Keyword),
  snippet(
    "with network priority",
    "with network priority ${1|<priority>,local,low,high|}$0",
    CompletionItemKind.Keyword,
  ),
  item("game", CompletionItemKind.Keyword),
  item("global", CompletionItemKind.Keyword),
  item("object", CompletionItemKind.Keyword),
  item("player", CompletionItemKind.Keyword),
  item("team", CompletionItemKind.Keyword),
  snippet("script_option", "script_option[${1:n}]$0", CompletionItemKind.Keyword),
  snippet("script_traits", "script_traits[${1:n}]$0", CompletionItemKind.Keyword),
  snippet("script_widget", "script_widget[${1:n}]$0", CompletionItemKind.Keyword),
  snippet("player", "player[${1:n}]$0", CompletionItemKind.Keyword),
  snippet("team", "team[${1:n}]$0", CompletionItemKind.Keyword),
  snippet("allocate temporary", "allocate temporary ${1|<type>,number,object,player,team|}$0"),
  snippet("send_incident", "send_incident(${1:<incident>}, ${2:<cause>}, ${3:<target>})$0", CompletionItemKind.Function),
  snippet("get_random_object", "get_random_object(${1:<label>}, ${2:<exclude>})$0", CompletionItemKind.Function),
  snippet("rand", "rand(${1:<cap>})$0", CompletionItemKind.Function),
  snippet(
    "set_scenario_interpolator_state",
    "set_scenario_interpolator_state(${1:<which>}, ${2:<state>})$0",
    CompletionItemKind.Function,
  ),
  item("current_object", CompletionItemKind.Keyword),
  item("current_player", CompletionItemKind.Keyword),
  item("current_team", CompletionItemKind.Keyword),
  item("no_object", CompletionItemKind.Keyword),
  item("killed_object", CompletionItemKind.Keyword),
  item("killer_object", CompletionItemKind.Keyword),
  item("killer_player", CompletionItemKind.Keyword),
  item("death_event_damage_type", CompletionItemKind.Keyword),
  item("hud_target_object", CompletionItemKind.Keyword),
  item("hud_target_player", CompletionItemKind.Keyword),
  item("hud_target_player_team", CompletionItemKind.Keyword),
  item("hud_target_team", CompletionItemKind.Keyword),
  item("local_player", CompletionItemKind.Variable),
  item("local_team", CompletionItemKind.Variable),
  item("allocate", CompletionItemKind.Keyword),
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
  snippet("is_of_type", "is_of_type(${1:<type>})$0", CompletionItemKind.Function),
  snippet("is_out_of_bounds", "is_out_of_bounds()$0", CompletionItemKind.Function),
  snippet("shape_contains", "shape_contains(${1:other})$0", CompletionItemKind.Function),
  ...genericFunctions([
    "add_weapon",
    "animate_device_position",
    "apply_shape_color_from_player_member",
    "attach_to",
    "copy_rotation_from",
    "create_object",
    "delete",
    "detach",
    "enable_spawn_zone",
    "face_toward",
    "get_device_position",
    "get_device_power",
    "get_distance_to",
    "get_orientation",
    "get_speed",
    "kill",
    "place_at_me",
    "place_between_me_and",
    "push_upward",
    "apply_upward_impulse",
    "remove_weapon",
    "set_boundary",
    "set_device_actual_position",
    "set_device_animation_position",
    "set_device_position",
    "set_device_power",
    "set_garbage_collection_disabled",
    "set_hidden",
    "set_invincibility",
    "set_pickup_permissions",
    "set_progress_bar",
    "set_scale",
    "set_shape",
    "set_shape_visibility",
    "set_spawn_location_fireteams",
    "set_spawn_location_permissions",
    "set_waypoint_icon",
    "set_waypoint_priority",
    "set_waypoint_range",
    "set_waypoint_text",
    "set_waypoint_timer",
    "set_waypoint_visibility",
    "set_weapon_pickup_priority",
    "try_get_carrier",
    "get_carrier",
  ]),
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
  ...genericFunctions([
    "assisted_kill_of",
    "is_elite",
    "is_fireteam_leader",
    "is_monitor",
    "is_not_respawning",
    "is_spartan",
    "killer_type_is",
    "add_weapon",
    "apply_traits",
    "force_into_vehicle",
    "get_armor_ability",
    "get_button_press_duration",
    "get_button_time",
    "get_crosshair_target",
    "get_death_damage_mod",
    "get_death_damage_type",
    "get_fireteam",
    "get_killer",
    "get_scoreboard_pos",
    "get_spree_count",
    "get_vehicle",
    "get_weapon",
    "set_biped",
    "set_co_op_spawning",
    "set_fireteam",
    "set_loadout_palette",
    "set_objective_allegiance_icon",
    "set_objective_allegiance_name",
    "set_objective_text",
    "set_primary_respawn_object",
    "set_respawn_vehicle",
    "set_round_card_icon",
    "set_round_card_text",
    "set_round_card_title",
    "set_vehicle_spawning_enabled",
    "try_get_armor_ability",
    "try_get_death_damage_mod",
    "try_get_death_damage_type",
    "try_get_killer",
    "try_get_vehicle",
    "try_get_weapon",
  ]),
  item("money", CompletionItemKind.Property),
];

const teamMembers = [
  ...globalMembers,
  item("score", CompletionItemKind.Property),
  snippet("script_stat", "script_stat[${1:n}]", CompletionItemKind.Property),
  ...genericFunctions([
    "has_alliance_status",
    "has_any_players",
    "get_scoreboard_pos",
    "set_co_op_spawning",
    "set_primary_respawn_object",
    "set_vehicle_spawning_enabled",
    "set_respawn_vehicle",
  ]),
];

const timerMembers = genericFunctions(["is_zero", "reset", "set_rate"]);

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
    return;
  }

  if (message.method === "textDocument/didChange") {
    const change = message.params.contentChanges.at(-1);
    if (change) {
      documents.set(message.params.textDocument.uri, change.text);
    }
    return;
  }

  if (message.method === "textDocument/didClose") {
    documents.delete(message.params.textDocument.uri);
    return;
  }

  if (message.method === "textDocument/completion") {
    reply(message.id, complete(message.params));
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

  if (lower.endsWith("game.")) return gameMembers;
  if (lower.endsWith("global.")) return lower.includes("allocate") ? allocateTypes : globalMembers;
  if (isObjectContext(lower)) return lower.includes("allocate") ? allocateTypes : objectMembers;
  if (isPlayerContext(lower)) return lower.includes("allocate") ? allocateTypes : playerMembers;
  if (isTeamContext(lower)) return lower.includes("allocate") ? allocateTypes : teamMembers;
  if (isTimerContext(lower)) return timerMembers;

  return blockCompletions;
}

function isObjectContext(prefix) {
  return (
    prefix.endsWith("object.") ||
    prefix.endsWith("biped.") ||
    prefix.endsWith("obj.") ||
    /object\\[\\d+\\]\\.$/.test(prefix)
  );
}

function isPlayerContext(prefix) {
  return prefix.endsWith("player.") || /player\\[\\d+\\]\\.$/.test(prefix);
}

function isTeamContext(prefix) {
  return prefix.endsWith("team.") || /team\\[\\d+\\]\\.$/.test(prefix);
}

function isTimerContext(prefix) {
  return prefix.endsWith("timer.") || /timer\\[\\d+\\]\\.$/.test(prefix);
}

function item(label, kind = CompletionItemKind.Text) {
  return { label, kind };
}

function snippet(label, insertText, kind = CompletionItemKind.Snippet) {
  return {
    label,
    kind,
    insertText,
    insertTextFormat: InsertTextFormat.Snippet,
  };
}

function genericFunctions(labels) {
  return labels.map((label) =>
    snippet(label, `${label}($1)$0`, CompletionItemKind.Function),
  );
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
