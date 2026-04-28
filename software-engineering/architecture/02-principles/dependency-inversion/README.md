# Dependency Inversion Principle (DIP)

**Category:** Principles (the **D** in SOLID)

## Intent
- High-level modules should not depend on low-level modules. Both should depend on **abstractions**.
- Abstractions should not depend on details. Details should depend on abstractions.

In practice: business logic doesn't import a Stripe SDK or a Postgres client. It defines an interface (`PaymentGateway`, `UserRepository`), and concrete adapters implement the interface from the outside in.

## DIP vs Dependency Direction (the fundamental)
The fundamental concept is "stable things shouldn't depend on volatile things." DIP is the practical recipe: introduce an abstraction owned by the high-level module, and have the low-level module implement it.

## When to use
- Business logic imports HTTP, DB, or vendor SDKs directly.
- You can't test the high-level rule without spinning up infrastructure.
- Replacing a vendor (Stripe → Adyen) requires editing the policy code.

## Trade-offs
**Pros**
- Business logic is testable in isolation.
- Vendor swaps are wiring changes, not code changes.
- The expensive-to-change layer (rules) doesn't depend on the cheap-to-change layer (drivers).

**Cons**
- Indirection — "click to definition" lands on an interface.
- Over-applied, every call goes through three indirections.

**Rule of thumb:** If your business logic imports the word "Stripe" (or "Postgres", or "Redis", or "Express"), DIP is missing.

## Real-world analogies
- Wall outlets: the wall doesn't know what's plugged in. The lamp depends on the standard, not the wall.
- Standard testing protocols (ISO, ASTM): the experimenter depends on the spec, the lab provides instruments that meet it.

## Run the demo
```bash
node demo.js
```

The demo defines `OrderProcessor` depending on a `PaymentGateway` abstraction; an in-memory mock and a "Stripe-like" adapter both implement it. The processor is identical across both runs.
