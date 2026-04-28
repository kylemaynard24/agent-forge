# Homework — Interpreter

> Define a grammar; build an AST; each node knows how to interpret itself.

## Exercise: Boolean expression DSL

**Scenario:** Define a tiny boolean DSL with `AND`, `OR`, `NOT`, and variables. Parse `"(rainy AND NOT weekend) OR holiday"` into an AST whose nodes each implement `interpret(context)`.

**Build:**
- A `Node` base type with `interpret(context) → boolean`.
- Subtypes: `Variable`, `Not`, `And`, `Or`.
- A simple recursive-descent parser that produces an AST from the source string.
- A demo that evaluates the same expression with two different contexts (`{rainy: true, weekend: false, holiday: false}`, etc.).

**Constraints (these enforce the pattern):**
- Each node owns its interpretation logic — there is no central `switch (node.type)`.
- Adding a new operation (like `XOR`) is a new class with `interpret` and a parser tweak — zero edits to existing nodes.
- The context is a plain object passed down; nodes don't mutate it.

## Stretch

Add `toString()` per node so the AST round-trips back into source text (with proper precedence and parentheses).

## Reflection

- Interpreter is rare in modern code (we usually reach for parser combinators or proper compilers). When does it still earn its keep?

## Done when

- [ ] Three different contexts produce the expected boolean for the parsed expression.
- [ ] Adding `XOR` requires no edits to `And`, `Or`, `Not`, or `Variable`.
