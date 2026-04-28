# Hexagonal Architecture (Ports and Adapters)

**Category:** Component Architecture

## Intent
The domain core lives in the middle. **Ports** are interfaces the core defines for what it needs (driven ports: repos, gateways) and what it offers (driving ports: use cases). **Adapters** plug into ports — HTTP adapter, queue adapter, in-memory test adapter.

The shape gives the architecture its name: a hexagon with multiple sides, each a port that any matching adapter can plug into. The core doesn't know which adapter is talking to it.

## Driving vs driven
- **Driving** ports/adapters drive the application: HTTP routes, CLI commands, message subscribers. They *call into* the core.
- **Driven** ports/adapters are driven by the core: databases, third-party APIs, mailers. The core *calls them*.

## When to use
- You want the domain testable without infrastructure.
- You expect to swap delivery mechanisms (HTTP today, queue tomorrow, CLI for batch jobs).
- You want explicit, named seams for everything that touches the outside world.

## Trade-offs
**Pros**
- Domain is testable in isolation; tests are fast.
- Multiple delivery mechanisms work over the same core.
- Adapters can be mocked or replaced without touching the core.

**Cons**
- More files; more "interface vs implementation" navigation.
- Pure ceremony if you have one delivery mechanism and one DB and no plans to change.

**Rule of thumb:** Reach for hexagonal when "I want to test the rule without standing up the world" matters more than "minimize indirection."

## Real-world analogies
- An electric outlet: the wall is the core; the outlet is the port; the device is the adapter. Plug in any compliant device.
- A speaker with multiple inputs (RCA, optical, Bluetooth): the speaker doesn't care which adapter sends audio.

## Run the demo
```bash
node demo.js
```

The demo defines an `OrderService` core with a `Notifier` port; it runs identically with a `ConsoleNotifier` (production-ish) and a `RecordingNotifier` (test).

## Deeper intuition

Component architecture is where local code structure turns into system shape. These topics teach you how to place business logic, dependencies, and interfaces so the important parts of the system can stay stable while implementation details remain replaceable.

A strong grasp of **Hexagonal Architecture (Ports and Adapters)** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Hexagonal Architecture (Ports and Adapters)** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Clean Onion or DDD Building Blocks instead:** those may still matter, but **Hexagonal Architecture (Ports and Adapters)** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Hexagonal Architecture (Ports and Adapters) everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Hexagonal Architecture (Ports and Adapters)** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Hexagonal Architecture (Ports and Adapters) as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
