# Liskov Substitution Principle (LSP)

**Category:** Principles (the **L** in SOLID)

## Intent
If `S` is a subtype of `T`, then objects of type `T` may be replaced by objects of type `S` without altering desirable program properties. Practically: a subclass must keep the **contract** of its parent — preconditions can't strengthen, postconditions can't weaken, invariants must hold, exceptions must be a subset.

LSP is the *behavioral* sibling of inheritance. Just because `class Square extends Rectangle` compiles doesn't mean a Square *is-a* Rectangle in the contract sense.

## When to use
- Whenever you're about to inherit. Ask: "Can a caller use my subclass anywhere they use the base, with no surprises?"
- When tests pass on the base but fail on the subclass.
- When a subclass overrides a method to throw "not supported."

## Smells of LSP violation
- A subclass overrides a method to throw `NotImplementedError`.
- Callers do `if (x instanceof SubclassA)` to decide whether to call a method.
- A subclass strengthens preconditions ("yes I implement this, but only for non-empty inputs").

## Trade-offs
**Pros**
- Real polymorphism — callers don't special-case subclasses.
- Refactors are safe; the type system actually means something.

**Cons**
- Some "natural" inheritance hierarchies (Square/Rectangle, Penguin/Bird) violate LSP. The fix is composition or different abstractions, which can feel less clean.

**Rule of thumb:** When in doubt, prefer composition over inheritance. Inheritance promises substitutability — that's a *contract*, not a syntactic shortcut.

## Real-world analogies
- A "battery" with the same shape and voltage as AAA but that explodes if a device tries to draw current — same shape, broken contract.
- A counterfeit dollar: looks like a dollar, doesn't act like one when scrutinized.

## Run the demo
```bash
node demo.js
```

The demo shows the classic Rectangle/Square LSP violation, then a fix using a separate `Shape` abstraction with no inheritance between them.

## Deeper intuition

Design principles are heuristics for preserving flexibility under change. None of them are laws; all of them can be over-applied. The point of learning them is to get better at seeing why a codebase feels rigid or slippery, not to turn every review into acronym enforcement.

A strong grasp of **Liskov Substitution Principle (LSP)** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Liskov Substitution Principle (LSP)** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Open Closed or Single Responsibility instead:** those may still matter, but **Liskov Substitution Principle (LSP)** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Liskov Substitution Principle (LSP) everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Liskov Substitution Principle (LSP)** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Liskov Substitution Principle (LSP) as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
