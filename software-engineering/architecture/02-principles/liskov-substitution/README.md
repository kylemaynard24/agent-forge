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
