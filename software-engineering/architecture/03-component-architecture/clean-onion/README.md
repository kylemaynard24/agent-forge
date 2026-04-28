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

## Deeper intuition

Component architecture is where local code structure turns into system shape. These topics teach you how to place business logic, dependencies, and interfaces so the important parts of the system can stay stable while implementation details remain replaceable.

A strong grasp of **Clean Architecture (Onion)** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?
