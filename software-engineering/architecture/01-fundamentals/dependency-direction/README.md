# Dependency Direction

**Category:** Fundamentals

## Intent
Dependencies should point toward **stable abstractions**, not toward volatile concrete details. High-level policy ("a user signed in") shouldn't depend on low-level mechanism ("a row was inserted into the `users` table in PostgreSQL"). Both depend on an abstraction in the middle.

## When to use
- When low-level details (DB driver, HTTP client, file system) are imported deep inside business logic.
- When swapping an implementation requires editing dozens of files.
- When tests can't run without a database, message queue, and three external services.

## Source-code dependency vs runtime call direction
These are not the same. At runtime, the policy *calls* the database. But in source code, the policy *depends on* an interface — and the database depends on (implements) that interface. The arrow in source flips while the call goes the same way.

```
Source-code dependency:    Runtime call:
Policy ──▶ Interface       Policy ──▶ Storage impl
           ▲                          
           │                          
       Storage impl                   
```

## Trade-offs
**Pros**
- Test policies without standing up infrastructure.
- Swap the database without touching policies.
- The expensive-to-change parts (business rules) don't depend on the cheap-to-change parts (frameworks, drivers).

**Cons**
- One more layer (the interface).
- Indirection makes "click through to definition" land on an abstract method.

**Rule of thumb:** Stable things shouldn't depend on volatile things.

## Real-world analogies
- A wall outlet is a stable interface; the device plugged in is volatile (you can swap a phone for a lamp). The wall doesn't depend on the lamp.
- A standard testing protocol — the experiment depends on the spec, not on a particular lab's instruments.

## Run the demo
```bash
node demo.js
```

The demo defines a `UserPolicy` that depends on a `UserStorage` interface, then swaps two implementations (in-memory and "Postgres-like") without touching the policy.
