("(" @open
  ")" @close)

("[" @open
  "]" @close)

((for_each_statement
  "do" @open
  "end" @close)
  (#set! newline.only))

((on_statement
  "do" @open
  "end" @close)
  (#set! newline.only))

((if_statement
  "then" @open
  "end" @close)
  (#set! newline.only))

((inline_statement
  ":" @open
  "end" @close)
  (#set! newline.only))
