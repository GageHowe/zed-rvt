module.exports = grammar({
  name: "rvt",

  extras: ($) => [/\s/, $.line_comment, $.block_comment],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $.function_definition,
        $.enum_definition,
        $.for_each_statement,
        $.on_statement,
        $.if_statement,
        $.inline_statement,
        $.declaration_statement,
        $.alias_statement,
        $.allocate_statement,
        $.expression_statement,
      ),

    function_definition: ($) =>
      seq(
        "function",
        field("name", $.identifier),
        "(",
        optional(commaSep1($.identifier)),
        ")",
        repeat($._statement),
        "end",
      ),

    enum_definition: ($) =>
      seq("enum", field("name", $.identifier), repeat($._statement), "end"),

    for_each_statement: ($) =>
      seq(
        "for",
        choice(
          seq("each", "player", optional("randomly")),
          seq("each", "object", optional(seq("with", "label", $.string))),
          seq("each", "team"),
        ),
        "do",
        repeat($._statement),
        "end",
      ),

    on_statement: ($) =>
      seq(
        "on",
        field(
          "event",
          choice(
            "pregame",
            "init",
            "local",
            "local init",
            "host migration",
            "double host migration",
            "object death",
          ),
        ),
        ":",
        "do",
        repeat($._statement),
        "end",
      ),

    if_statement: ($) =>
      seq(
        "if",
        field("condition", $._expression),
        "then",
        repeat($._statement),
        repeat($.altif_clause),
        optional($.alt_clause),
        "end",
      ),

    altif_clause: ($) =>
      seq("altif", field("condition", $._expression), "then", repeat($._statement)),

    alt_clause: ($) => seq("alt", repeat($._statement)),

    inline_statement: ($) =>
      seq("inline", ":", choice("do", "if", "altif", "alt"), repeat($._statement), "end"),

    declaration_statement: ($) =>
      seq(
        "declare",
        field("name", $.identifier),
        optional(seq("=", field("value", $._expression))),
      ),

    alias_statement: ($) =>
      seq("alias", field("name", $.identifier), "=", field("value", $._expression)),

    allocate_statement: ($) =>
      seq(
        "allocate",
        optional("temporary"),
        field("type", choice("number", "object", "player", "team", "timer")),
      ),

    expression_statement: ($) => $._expression,

    _expression: ($) =>
      choice(
        $.binary_expression,
        $.unary_expression,
        $.call_expression,
        $.member_expression,
        $.subscript_expression,
        $._atom,
      ),

    _atom: ($) =>
      choice($.identifier, $.number, $.string, $.boolean, $.parenthesized_expression),

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    unary_expression: ($) => prec.right(9, seq(choice("not", "-", "!"), $._expression)),

    binary_expression: ($) =>
      choice(
        ...[
          ["=", 0],
          ["or", 1],
          ["and", 2],
          ["==", 3],
          ["!=", 3],
          ["<", 4],
          [">", 4],
          ["<=", 4],
          [">=", 4],
          ["+", 5],
          ["-", 5],
          ["*", 6],
          ["/", 6],
          ["%", 6],
        ].map(([operator, precedence]) =>
          prec.left(
            precedence,
            seq(field("left", $._expression), field("operator", operator), field("right", $._expression)),
          ),
        ),
      ),

    call_expression: ($) =>
      prec(
        10,
        seq(
          field(
            "function",
            choice($.identifier, $.member_expression, $.subscript_expression),
          ),
          "(",
          optional(commaSep1($._expression)),
          ")",
        ),
      ),

    member_expression: ($) =>
      prec.left(
        11,
        seq(
          field(
            "object",
            choice($._atom, $.member_expression, $.subscript_expression, $.call_expression),
          ),
          ".",
          field("property", $.identifier),
        ),
      ),

    subscript_expression: ($) =>
      prec.left(
        11,
        seq(
          field(
            "object",
            choice($._atom, $.member_expression, $.subscript_expression, $.call_expression),
          ),
          "[",
          field("index", $._expression),
          "]",
        ),
      ),

    identifier: () => /[A-Za-z_][A-Za-z0-9_]*/,
    number: () => /\d+/,
    string: () => token(seq('"', repeat(choice(/[^"\\]+/, /\\./)), '"')),
    boolean: () => choice("true", "false", "none"),

    line_comment: () => token(seq("--", /.*/)),
    block_comment: () => token(seq("--[[", /[^\r\n]*/, "]]")),
  },
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
