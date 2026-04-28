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
