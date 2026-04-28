# Facade

**Category:** Structural

## Intent

Provide a **simple, high-level interface** over a complex subsystem. The facade gives clients a single clean API; behind it, the facade coordinates many lower-level classes.

## When to use

- A subsystem has grown complex and most clients only need a few common workflows.
- You want to reduce coupling between clients and the subsystem's internals.
- You want a *default* path through the subsystem while leaving the underlying classes reachable for power users.

## Structure

```
Client ──► Facade ──┬──► SubsystemA
                    ├──► SubsystemB
                    └──► SubsystemC
```

The facade owns the orchestration; subsystem classes stay unaware that a facade exists (they don't depend on it).

## Trade-offs

**Pros**
- Simpler client code — one dependency instead of several
- Internal refactors stay internal (clients don't notice)
- A natural place to handle cross-cutting concerns (logging, transactions, error translation)

**Cons**
- Risk of the facade becoming a "god object" that accrues every possible workflow
- Can hide legitimate flexibility — if power users always have to reach past the facade, the facade isn't actually helping

## Facade vs. Adapter

- **Adapter** conforms to a *specific existing* interface.
- **Facade** invents a *new, simpler* interface that didn't exist before.

## Real-world analogies

- A hotel concierge — one person handles taxis, restaurant reservations, tickets, etc.
- A compiler's `compile(source)` that hides lex/parse/optimize/emit.
- `fetch()` over the network stack.

## Run the demo

```bash
node demo.js
```

Demonstrates an `OrderService` facade that orchestrates `Inventory`, `Payment`, `Shipping`, and `EmailService` subsystems. The client calls one method; the facade handles the sequence, rollback on failure, and notifications.

## Deeper intuition

Structural patterns are about reshaping relationships without rewriting the underlying behavior. They earn their keep when a system needs compatibility, composition, simplification, access control, or independent variation across different dimensions of the design.

When you study **Facade**, focus less on memorizing participants and more on spotting the design pressure it resolves. Patterns become powerful when you can recognize the force first and name the pattern second. The pattern is usually just the cleanest way of making an important distinction explicit.

## What to notice in real code

- What is the stable interface or responsibility, and what is allowed to vary?
- Which dependency or decision has been moved somewhere more explicit?
- What extra indirection does this pattern add, and is the payoff worth it here?
- Which nearby pattern would someone confuse with this one, and why is this a better fit?
