# Strategy

**Category:** Behavioral

## Intent

Define a family of algorithms, encapsulate each one behind a common interface, and make them **interchangeable at runtime**. The client holds a strategy object and delegates the algorithmic work to it.

## When to use

- You have multiple variants of an algorithm (sort orders, pricing rules, payment methods, compression schemes).
- You want to pick the variant at runtime, not at class-definition time.
- You want to avoid conditional branches that keep growing as new variants appear.

## Structure

```
Context              Strategy (interface)
 - strategy: S        + execute(input)
 + doSomething()           ▲
     └─ delegates to       │
        strategy.execute() ConcreteStrategyA, B, C, ...
```

## Trade-offs

**Pros**
- Swap algorithms at runtime
- New variants = new classes, no `switch`/`if` sprawl
- Testable in isolation — each strategy is a focused object

**Cons**
- More classes than a conditional
- Clients must know that strategies exist and choose one
- Can over-decompose — not every variant belongs as its own class

## JavaScript note

In JS, first-class functions often make the pattern lighter — a "strategy" can be a plain function passed in, no class required. The class form is shown here to match the canonical GoF shape.

## Strategy vs. State

Structurally similar. The difference is intent:
- **Strategy** — the client chooses; strategies don't transition.
- **State** — the context transitions between states; states know each other.

## Strategy vs. Template Method

Both vary one algorithm. Mechanism differs:
- **Template Method** — inheritance: subclass overrides hooks in a base class's skeleton.
- **Strategy** — composition: pass in a strategy object; the context holds a reference.

## Real-world analogies

- Array sort comparators: `arr.sort(byPrice)` vs. `arr.sort(byName)`
- Payment processors: credit / PayPal / crypto
- Compression: gzip / brotli / zstd chosen based on client's `Accept-Encoding`

## Run the demo

```bash
node demo.js
```

Demonstrates a `Checkout` context with three `PaymentStrategy` implementations: credit card, PayPal, and crypto. The checkout swaps strategies at runtime without knowing their internals.
