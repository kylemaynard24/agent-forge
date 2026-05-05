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

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + One Class, One Rule

Interpreter code is uniquely prone to becoming unreadable because the grammar lives in your head while the code lives on the screen — the only bridge is naming. Applied cleanly, every class name is the grammar rule it implements (`AndExpression`, `NotExpression`, `Variable`), so reading the class list reconstructs the grammar without opening a single file body. Applied messily, names like `BinaryNode` or `ExprHelper` force the reader to reverse-engineer the grammar from the implementation rather than reading it from the structure.

**Exercise:** After building your AST, write out the grammar rules as a comment block at the top of your parser file. Check that every class name is a direct, one-to-one match with a rule in that comment — if a class has no corresponding rule, it shouldn't exist; if a rule has no corresponding class, it isn't modeled.

**Reflection:** If a colleague needed to add `IMPLIES` (logical implication, `A IMPLIES B` means `NOT A OR B`) to your DSL, could they locate exactly where to add a class and exactly where to add a parser case from the class names alone — without reading any method bodies?
