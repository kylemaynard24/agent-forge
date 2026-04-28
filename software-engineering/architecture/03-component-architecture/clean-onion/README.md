# Clean Architecture (Onion)

**Category:** Component Architecture

## Intent
Concentric rings. Dependencies point **inward only**. From inside out:
1. **Entities** — enterprise-wide business rules.
2. **Use cases** — application-specific business rules.
3. **Interface adapters** — controllers, presenters, repositories that translate between use cases and the outside.
4. **Frameworks & drivers** — DBs, web frameworks, UI, devices.

The further in you go, the more stable the code. Outer rings can be replaced; inner rings shouldn't be.

## The dependency rule
Source-code dependency arrows always point *inward*. An entity never imports a use case. A use case never imports a controller. A controller never imports Express. Anything you'd be horrified to change in a year — entities, core rules — sits in the middle, depending on nothing.

## When to use
- Long-lived systems where the domain logic outlives every framework choice.
- Codebases that have already paid the cost of "we picked the wrong DB" once.
- Teams investing in test pyramids — clean architecture makes the bottom big.

## Trade-offs
**Pros**
- Domain logic is testable, fast, framework-free.
- Drivers (DB, HTTP) become boring details you can swap.
- Onboarding is structured: read inward, learn the domain first.

**Cons**
- Lots of folders, lots of "DTOs vs entities" mapping.
- Easy to over-engineer for a CRUD app.
- Trades complexity (boundaries) for stability (domain isolation).

**Rule of thumb:** Use clean architecture when the domain is the *point*. For thin CRUD apps, layered or even single-folder is fine.

## Real-world analogies
- A castle: keep (entities), inner walls (use cases), outer walls (adapters), moat (drivers). Each ring buys time for what's inside.
- An onion: peel an outer layer without disturbing the core.

## Run the demo
```bash
node demo.js
```

The demo implements a "create user" use case that imports its `User` entity but never imports the HTTP layer or the data layer's specifics — only their port interfaces.
