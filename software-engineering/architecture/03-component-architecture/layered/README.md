# Layered Architecture

**Category:** Component Architecture

## Intent
Organize an application as a stack of layers, each with a defined responsibility. Layers only call **down**. The classic 3-layer stack: **Presentation** (HTTP, UI) → **Business** (domain rules, services) → **Data** (persistence, repositories).

## When to use
- An application with clear input/output vs business rule separation.
- Teams want predictable boundaries that survive code review.
- A team is small and a familiar default beats clever.

## The cardinal rule
**Layers only call down.** Business logic doesn't import HTTP types. The data layer doesn't import service types. Violations (a model class that imports `Request`, a controller that writes SQL) are the smell.

## Trade-offs
**Pros**
- Familiar; easy to explain to new hires.
- Predictable layout — find code by its kind.
- Different teams can own different layers.

**Cons**
- Real domains often don't fit 3 layers; one ends up overstuffed.
- "Service" layer becomes a god-bag of helpers.
- ORM-driven entities tend to grow business behavior, leaking the data layer upward.
- Cross-cutting concerns (auth, logging) belong to no single layer.

**Rule of thumb:** Layered is a fine default but rarely the *best* architecture once your domain has depth. Hexagonal and clean architecture exist because layered keeps tipping over.

## Real-world analogies
- A restaurant: front of house (presentation), kitchen (business), pantry (data).
- A factory line: assembly station (top), component bins (middle), raw materials (bottom).

## Run the demo
```bash
node demo.js
```

The demo shows a 3-layer todo app: a controller calls services, services call repositories, and only the repository touches the in-memory store.

## Deeper intuition

Component architecture is where local code structure turns into system shape. These topics teach you how to place business logic, dependencies, and interfaces so the important parts of the system can stay stable while implementation details remain replaceable.

A strong grasp of **Layered Architecture** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Layered Architecture** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with DDD Building Blocks or Hexagonal Ports and Adapters instead:** those may still matter, but **Layered Architecture** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Layered Architecture everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Layered Architecture** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Layered Architecture as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
