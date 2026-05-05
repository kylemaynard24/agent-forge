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

---

## Clean Code Lens

**Principle in focus:** Single Responsibility Principle + Meaningful Names

Each `visit` method in a visitor is a single operation on a single element type — `visitAdd` in the `Evaluator` does exactly one thing: compute the sum of two evaluated sub-expressions. Applied cleanly, a visitor class reads as a complete, self-contained algorithm — you can read `Evaluator` top to bottom and understand the full evaluation semantics without touching any node class. Applied messily, a visitor whose `visitAdd` also handles logging, caching, and error formatting has collapsed the separation that makes the pattern valuable, and its method names no longer describe the operation honestly.

**Exercise:** Read your `PrettyPrinter` class in isolation, covering the AST node files. The method names (`visitNumber`, `visitAdd`, `visitMultiply`, `visitNegate`) and their bodies should fully specify the pretty-printing algorithm — if understanding one method requires you to open a node class, the visitor isn't self-contained enough.

**Reflection:** The stretch goal asks you to add a `Power` node and notice that every existing visitor must be updated — this is the expression problem in action. Given that trade-off, what naming or structural convention could you adopt that makes it immediately obvious to a future developer adding a new node type that they must update every registered visitor?
