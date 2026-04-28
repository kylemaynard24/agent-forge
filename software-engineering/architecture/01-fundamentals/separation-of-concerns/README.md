# Separation of Concerns

**Category:** Fundamentals

## Intent
Each module, file, or class owns one focus area. When a single piece of code mixes UI, business rules, and persistence, every change ripples in three directions.

## When to use
- A function does more than one thing (validating + computing + saving + notifying).
- A small change in one area keeps breaking unrelated areas.
- Testing one slice requires standing up unrelated infrastructure (DB, network, mailer).
- Two people can't work on adjacent features without stepping on each other.

## Trade-offs
**Pros**
- Localized change — edit one concern without touching others.
- Easier testing — each concern is testable in isolation.
- Independent evolution — swap an implementation without ripples.

**Cons**
- More files, more wiring.
- Over-applied it produces ceremony and anemic modules.
- New folks have to learn the seams before they can read the code.

**Rule of thumb:** If you can name three independent reasons a function might change, it's three functions in disguise.

## Real-world analogies
- A restaurant kitchen: pastry, grill, and dish station own distinct concerns; one slammed station doesn't stop the others.
- A house: kitchen, bathroom, and bedroom each have one purpose. Mixing plumbing and bedroom is a code smell in carpentry too.

## Run the demo
```bash
node demo.js
```

The demo refactors a bloated `handleOrder` that mixes validation, persistence, and notification into three single-purpose modules and shows you can swap the mailer for a no-op without touching anything else.

## Deeper intuition

Fundamental design topics are the physics of software. They look simple because they are old and broadly stated, but they keep reappearing because every architecture eventually pays for violating them. Treat them less like slogans and more like recurring force diagrams: where is knowledge concentrated, where does change ripple, and where are you accidentally making two concerns rise and fall together?

A strong grasp of **Separation of Concerns** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Separation of Concerns** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Dependency Direction or Dry Kiss Yagni instead:** those may still matter, but **Separation of Concerns** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Separation of Concerns everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Separation of Concerns** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Separation of Concerns as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
