# Homework — Visitor

> Add new operations over an object hierarchy without modifying the hierarchy.

## Exercise: Arithmetic AST

**Scenario:** Given an arithmetic AST (`Number`, `Add`, `Multiply`, `Negate`), implement two visitors: `Evaluator` (computes the value) and `PrettyPrinter` (produces a string like `((3 + 4) * -2)`).

**Build:**
- AST node classes, each with an `accept(visitor)` method that dispatches to the right visitor method.
- Two visitor classes implementing `visitNumber`, `visitAdd`, `visitMultiply`, `visitNegate`.
- A demo that builds `(3 + 4) * -2`, runs both visitors, and prints results.

**Constraints (these enforce the pattern):**
- Adding a new visitor (e.g., `Differentiator` that produces the symbolic derivative) must require ZERO changes to the AST node classes.
- No `instanceof` checks anywhere outside `accept`.
- Each visitor is one self-contained class.

## Stretch

Now add a new node type: `Power(base, exp)`. Notice how every existing visitor must be updated. This is Visitor's weakness — it's optimized for adding *operations*, not for adding *node types*. Discuss when Visitor is the wrong tool.

## Reflection

- The "expression problem": you can extend either operations OR types easily, but not both. Visitor picks operations. What pattern picks types? (Hint: classic OO polymorphism with methods on the types.)

## Done when

- [ ] Both visitors run over the same AST and produce correct, distinct outputs.
- [ ] Adding a `Differentiator` visitor doesn't touch the node classes.
