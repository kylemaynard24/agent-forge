# Template Method

**Category:** Behavioral

## Intent

Define the **skeleton of an algorithm** in a base class, deferring specific steps to subclasses. The shape of the algorithm is fixed; subclasses fill in the pieces that vary.

## When to use

- You have several algorithms that share the same overall shape but differ in individual steps.
- You want to enforce an order of operations (e.g. "always open a transaction, then do X, then close").
- You want shared cross-cutting steps (logging, validation) to happen for every variant without being repeated.

## Structure

```
AbstractClass
 + templateMethod()  ──► final, non-override     (the skeleton)
      │
      └─ calls: primitive1()  ◄── subclass overrides
                primitive2()  ◄── subclass overrides
                hook()        ◄── optional override (default no-op)

ConcreteClassA, B, C  ── override the primitives
```

In languages with `final`, the template method is marked `final` so subclasses can't break the skeleton. JavaScript doesn't have `final`, so it's a convention.

## Trade-offs

**Pros**
- Shared skeleton lives in one place
- Subclasses only fill in the parts that differ
- Natural place for hooks (optional steps)

**Cons**
- Inheritance-heavy — opposite of composition
- Liskov Substitution Principle pressure — subclasses must respect the base's contract
- "Protected" primitive methods are a bit of a leaky abstraction

## Template Method vs. Strategy

Both vary one algorithm. Mechanism differs:
- **Template Method** — *inheritance*. The base class owns the skeleton; subclasses override hooks.
- **Strategy** — *composition*. The context holds a strategy object; behavior can swap at runtime.

Template Method is static (chosen by subclass); Strategy is dynamic (chosen by object reference).

## Real-world analogies

- Unit testing base classes — `setUp()`, `test*()`, `tearDown()`.
- Data pipelines — `extract()`, `transform()`, `load()`.
- Web frameworks' request lifecycle hooks.

## Run the demo

```bash
node demo.js
```

Demonstrates a `ReportGenerator` base class with a template `generate()` method that calls `fetchData()`, `transform()`, `format()`, and a `log` hook. Two subclasses (`SalesReport`, `InventoryReport`) override the primitives; the skeleton stays shared.

## Deeper intuition

Behavioral patterns are about where decisions live and how control flows between objects. They become useful when logic is correct in isolation but hard to follow as a system because too many objects know too much about each other or because behavior varies in ways that are currently trapped in conditionals.

When you study **Template Method**, focus less on memorizing participants and more on spotting the design pressure it resolves. Patterns become powerful when you can recognize the force first and name the pattern second. The pattern is usually just the cleanest way of making an important distinction explicit.

## What to notice in real code

- What is the stable interface or responsibility, and what is allowed to vary?
- Which dependency or decision has been moved somewhere more explicit?
- What extra indirection does this pattern add, and is the payoff worth it here?
- Which nearby pattern would someone confuse with this one, and why is this a better fit?
