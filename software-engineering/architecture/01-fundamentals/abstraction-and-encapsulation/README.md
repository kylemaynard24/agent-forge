# Abstraction and Encapsulation

**Category:** Fundamentals

## Intent
- **Abstraction** — exposing *what* something does while hiding *how*. The interface tells you "deposit money"; not "increment a 64-bit integer in this struct."
- **Encapsulation** — bundling state with the operations that maintain its invariants, and *hiding* that state so callers can't break the invariants.

The two travel together. Abstraction is the cover; encapsulation is the lock.

## When to use
- Whenever you have a value with rules (Money, Email, BankAccount, Date range) — wrap it.
- When clients are reaching into your internals to do work that should be your responsibility.
- When fixing a bug requires changing 12 callers, not 1 — your data is too exposed.

## Trade-offs
**Pros**
- Invariants are enforced in one place.
- Internals can change without breaking callers.
- Bugs caused by "what if balance is negative?" become impossible to express.

**Cons**
- More boilerplate up front (constructors, accessors).
- Bad abstractions are worse than no abstractions — they leak in surprising ways and are expensive to remove.

**Rule of thumb:** If callers are doing arithmetic on your fields to compute something derived, that derivation belongs on you.

## Real-world analogies
- A car's gas pedal is an *abstraction*: you don't manage fuel injection. The fuel tank is *encapsulated*: you can't pour gasoline directly into the engine cylinders.
- A vending machine: you press a button (interface). You can't reach inside.

## Run the demo
```bash
node demo.js
```

The demo contrasts an exposed-balance account that callers can corrupt with an encapsulated account that enforces "no overdraft" as an invariant.

## Deeper intuition

Fundamental design topics are the physics of software. They look simple because they are old and broadly stated, but they keep reappearing because every architecture eventually pays for violating them. Treat them less like slogans and more like recurring force diagrams: where is knowledge concentrated, where does change ripple, and where are you accidentally making two concerns rise and fall together?

A strong grasp of **Abstraction and Encapsulation** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?
