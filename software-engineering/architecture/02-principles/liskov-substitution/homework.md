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
