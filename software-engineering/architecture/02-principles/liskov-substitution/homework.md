# Homework — Liskov Substitution

> A subclass must honor the contract of its parent. Inheritance is a promise.

## Exercise: Find the LSP violation in a real hierarchy

**Scenario:** Your codebase has:
```
class Bird { fly() { ... } eat() { ... } }
class Eagle extends Bird { ... }
class Penguin extends Bird { fly() { throw new Error('penguins do not fly'); } }
```

Caller: `function feedAndRelease(b) { b.eat(); b.fly(); }`. Calling with a Penguin throws.

**Build:**
- Diagnose the LSP violation precisely (what part of the contract did `Penguin` break?).
- Propose two different fixes. Implement one.

  Fix A: split `Bird` into two abstractions (`FlyingBird`, `Bird`) so callers requiring flight only accept `FlyingBird`.

  Fix B: replace inheritance with composition + capabilities (`Bird` has-a `Locomotion` strategy; some have `Flying`, some have `Walking`).

- Update `feedAndRelease` to require only what it actually uses.

**Constraints (these enforce the concept):**
- After the fix, no method throws "not supported."
- No caller does `instanceof` to decide whether a method is callable.
- Adding a `Bat` (mammal that flies) is straightforward.

## Stretch
Now design the same domain with an `interface Flyable` and `interface Eater` (small interfaces) and let species mix and match. This previews the next principle, **Interface Segregation**.

## Reflection
- "Inheritance is a promise of substitutability." If you wouldn't write a unit test asserting the subclass meets the parent's contract, should you really be using inheritance?
- Why is `Square extends Rectangle` the canonical bad example? Because it's mathematically tempting and pragmatically wrong. Where else have you seen this pattern in real code?

## Done when
- [ ] No subclass throws "not supported" for a parent method.
- [ ] `feedAndRelease(penguin)` no longer makes sense to write — the type system or the function signature prevents it.
- [ ] You can articulate "preconditions can't strengthen; postconditions can't weaken" in your own words.

---

## Clean Code Lens

**Principle in focus:** Names Are Contracts — Don't Let Subtypes Make the Name Lie

LSP is fundamentally a naming contract: when a type is called `Bird` and `Bird` has a `fly()` method, every subtype named as a `Bird` is implicitly promising that it can fly. `Penguin extends Bird` makes the name `Bird` a lie for all callers who reasonably expect flight — the type name and the behavior have diverged. Clean code at the type hierarchy level means the name of a parent type describes *only* the behavioral contract that every subtype will keep.

**Exercise:** After your fix, read the type names in your hierarchy aloud as behavioral promises: "A `FlyingBird` will always be able to fly," "A `Bird` will always be able to eat." For each type, write the promise as a one-sentence assertion and verify that every concrete implementation in your system would pass it. If any concrete type would fail the assertion, the type name is still lying.

**Reflection:** The `Square extends Rectangle` example is broken because `setWidth` and `setHeight` are independent on a Rectangle but coupled on a Square — the subtype can't keep the parent's mutation contract. Where in your current or past codebases have you seen this same pattern: a subtype that can't keep a parent's *mutation* promise (not just a capability promise)?
