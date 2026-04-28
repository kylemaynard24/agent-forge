# MVC, MVP, MVVM

**Category:** Component Architecture

## Intent
Three sibling patterns for separating UI from logic. They differ in *who holds the logic* and *how the view stays in sync with the data*.

| Pattern | View knows... | Logic lives in... | Sync style |
|---|---|---|---|
| **MVC** | Controller (and Model) | Controller | View observes Model; Controller routes input |
| **MVP** | Presenter (only) | Presenter | Presenter pushes state to View; View is dumb |
| **MVVM** | View Model (via binding) | View Model | Two-way data binding (View ↔ ViewModel) |

## When to use which
- **MVC**: classic web (Rails-style server rendering). The View is HTML; the Controller handles the request.
- **MVP**: desktop / "passive view" testing. The Presenter is fully testable; the View is a thin shell.
- **MVVM**: data-binding frameworks (WPF, SwiftUI, Vue, parts of React-with-state-libs). Reactive state.

## Trade-offs
**Pros**
- Each separates UI from logic — testable, evolvable.
- Fits common UI frameworks idiomatically.

**Cons**
- The labels mean different things to different teams. Don't argue MVC-vs-MVP without agreeing what each word means in your codebase.
- All three can devolve into a fat ___ (Controller / Presenter / ViewModel) doing too much.

**Rule of thumb:** Pick the one your framework wants you to use. Don't fight your framework.

## Real-world analogies
- MVC: a restaurant where the waiter (controller) takes the order, the kitchen (model) prepares it, and the customer (view) sees the dish.
- MVP: a play where the actors (view) only do what the director (presenter) tells them; the audience sees only what's choreographed.
- MVVM: a stock-ticker board (view) automatically updating from a market data feed (view model). Wire-once, react forever.

## Run the demo
```bash
node demo.js
```

The demo implements the same click-counter screen three ways — MVC, MVP, MVVM — and contrasts who holds the logic.

## Deeper intuition

Component architecture is where local code structure turns into system shape. These topics teach you how to place business logic, dependencies, and interfaces so the important parts of the system can stay stable while implementation details remain replaceable.

A strong grasp of **MVC, MVP, MVVM** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **MVC, MVP, MVVM** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Hexagonal Ports and Adapters or Layered instead:** those may still matter, but **MVC, MVP, MVVM** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply MVC, MVP, MVVM everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **MVC, MVP, MVVM** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat MVC, MVP, MVVM as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
