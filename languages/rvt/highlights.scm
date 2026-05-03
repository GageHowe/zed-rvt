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

(identifier) @variable

((identifier) @type.builtin
  (#match? @type.builtin "^(number|object|player|team|timer|script_option|script_traits|script_widget)$"))

((identifier) @variable.special
  (#match? @variable.special "^(game|global|current_object|current_player|current_team|local_player|local_team|killed_object|killer_object|killer_player|hud_target_object|hud_target_player|hud_target_player_team|hud_target_team|no_object|no_player|no_team|no_widget)$"))
