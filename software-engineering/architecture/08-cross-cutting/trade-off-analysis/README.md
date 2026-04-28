# Trade-off Analysis

**Category:** Cross-Cutting

## Intent

Architecture is the set of decisions that are expensive to change. There is no single correct architecture — only architectures that fit (or do not fit) a given set of constraints: team size, latency target, budget, scale, regulatory needs, and time-to-market. The skill is choosing **deliberately**, defending the choice in writing, and revisiting when constraints change.

## When to use

- Starting a new system (greenfield).
- Re-platforming an existing one because constraints have shifted.
- Reviewing an RFC or design doc and asking "why this and not that?"
- Onboarding to a system — understanding why the team picked what they picked.

## Trade-offs

**Pros**
- Forces priorities to be made explicit.
- Captures *why*, which survives the people who made the decision.
- Reveals when a choice is no longer aligned with current constraints.
- Defangs religious debates: "monolith vs microservices" becomes "for our team size and latency target, X."

**Cons**
- Time-consuming to do well — easy to skip under deadline pressure.
- Doc rot is real — old ADRs lie about current reality.
- Analysis paralysis: at some point, you must ship.
- Some constraints are unknowable in advance (you'll discover them by hitting them).

**Rule of thumb:** write down three options, the constraint each optimizes for, and the cost each pays. Pick one. Revisit when any constraint changes by 10x.

## Real-world analogies

- Choosing a vehicle: family car, sports car, pickup. Each is "best" for different constraints.
- Designing a building: a cottage and a skyscraper are not the same problem at different scales — they are different problems.
- Picking a route: highway, scenic, back-roads — depends on time, fuel, view.

## Run the demo

```bash
node demo.js
```

The demo is a small decision script. Given constraints (team size, latency target, budget, scale), it prints which patterns from the dojo are worth reaching for, and which are over-engineering at this stage. Try changing the inputs and see how the recommendations move.

## Deeper intuition

Cross-cutting concerns expose the pressures that ignore your clean boxes. Observability, trade-off analysis, distributed-systems fallacies, and CAP-style thinking all exist to remind you that runtime reality cuts across module boundaries and happy-path diagrams.

A strong grasp of **Trade-off Analysis** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?
