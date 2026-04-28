# Open/Closed Principle (OCP)

**Category:** Principles (the **O** in SOLID)

## Intent
Software entities should be **open for extension** and **closed for modification.** Add new behavior by adding code, not by editing old code. The mechanism is usually polymorphism: callers depend on an abstraction; new variants ship as new implementations.

## When to use
- Adding a new "type" causes shotgun surgery — N files edited, N new branches added.
- Bugs keep regressing in modules that "weren't supposed to change."
- A domain has known variation points (payment methods, file formats, themes).

## Trade-offs
**Pros**
- New variants don't risk old ones.
- Strategies, plugins, themes become natural.
- Code review is bounded — diff is one new file, not edits across many.

**Cons**
- One more interface to learn.
- Premature OCP = a plugin system with one plugin = pure ceremony.

**Rule of thumb:** Wait for the *second* variant before applying OCP. The shape of the abstraction reveals itself once you see two cases.

## Real-world analogies
- A USB hub: plug in a new device. You don't re-solder the hub.
- A camera body with interchangeable lenses. The body is closed, the lens mount is open.

## Run the demo
```bash
node demo.js
```

The demo starts with an `if (shape.type === 'circle')` chain, then refactors to a `Shape` interface where adding `Triangle` requires zero edits to the calculator.

## Deeper intuition

Design principles are heuristics for preserving flexibility under change. None of them are laws; all of them can be over-applied. The point of learning them is to get better at seeing why a codebase feels rigid or slippery, not to turn every review into acronym enforcement.

A strong grasp of **Open/Closed Principle (OCP)** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?
