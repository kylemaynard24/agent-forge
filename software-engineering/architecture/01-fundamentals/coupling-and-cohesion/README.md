# Coupling and Cohesion

**Category:** Fundamentals

## Intent
**Coupling** measures how dependent modules are on each other's internals. **Cohesion** measures how related a module's contents are. Aim for **low coupling** and **high cohesion**: modules should be self-contained inside and minimally entangled outside.

## When to use
This is a lens, not a technique. Apply it whenever you're:
- Drawing a module boundary.
- Reviewing a PR that touches three "unrelated" files (often a coupling smell).
- Naming something — bad names usually signal poor cohesion.

## Trade-offs
**Pros of low coupling**
- Refactor one module without breaking others.
- Test in isolation; mock less.

**Pros of high cohesion**
- The module's purpose is obvious from its name.
- Changes that belong together live together.

**Cons (as a rule)**
- Pursued blindly, it produces tiny modules with deep call chains.
- "Lowest possible coupling" can become "no shared code" — DRY suffers.

**Rule of thumb:** If a change to module A forces a change to module B, they're more coupled than they look.

## Coupling spectrum (worst → best)
1. **Content coupling** — B reaches into A's internals. (Avoid.)
2. **Common coupling** — both share a global. (Avoid.)
3. **Control coupling** — A passes a flag that controls B's logic.
4. **Data coupling** — A passes B exactly the data B needs.
5. **No coupling** — they don't talk.

## Real-world analogies
- USB-C: every device exposes the same minimal contract — high cohesion (one job), low coupling (universal plug).
- A team where everyone CCs everyone on every email: high coupling, low cohesion.

## Run the demo
```bash
node demo.js
```

The demo contrasts a tightly-coupled order/email pair (the order code knows SMTP details) with a loosely-coupled version (the order code only knows a `Notifier` interface).

## Deeper intuition

Fundamental design topics are the physics of software. They look simple because they are old and broadly stated, but they keep reappearing because every architecture eventually pays for violating them. Treat them less like slogans and more like recurring force diagrams: where is knowledge concentrated, where does change ripple, and where are you accidentally making two concerns rise and fall together?

A strong grasp of **Coupling and Cohesion** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Coupling and Cohesion** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Dry Kiss Yagni or Separation of Concerns instead:** those may still matter, but **Coupling and Cohesion** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Coupling and Cohesion everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Coupling and Cohesion** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Coupling and Cohesion as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
