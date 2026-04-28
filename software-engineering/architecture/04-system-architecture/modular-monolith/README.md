# Modular Monolith

**Category:** System Architecture

## Intent
Still **one** deployable, **one** process — but with **enforced module boundaries**. Each module exposes an explicit public API; other modules cannot reach into its internals. The shape of microservices, without the operational tax.

A modular monolith is what most teams *should* mean when they say "we need to break things up." It's the cheapest path to clean boundaries.

## When to use
- Your monolith has grown enough that "where does this go?" stops having an obvious answer.
- Multiple teams want autonomy over a slice without the cost of separate deployments.
- You want the *option* to extract microservices later without committing now.

## Trade-offs
**Pros**
- All the upsides of monolith (one DB, in-process calls, easy refactor).
- Boundaries are visible and enforced (lint rules, package boundaries, public API exports).
- Easier to extract a service later — the seam is already there.

**Cons**
- Discipline-dependent: if the language doesn't enforce boundaries, drift is inevitable.
- Slightly more ceremony than a free-for-all monolith.
- Module boundaries are only as good as the public APIs you write — leaky APIs leak.

**Rule of thumb:** Reach for modular monolith when you're tempted to say "microservices." 80% of the benefit at 5% of the cost.

## How to enforce boundaries
1. Each module is its own folder/package with an `index.js` (or `public-api.js`) that re-exports the public surface.
2. Other modules import only from that public surface — never from internal paths.
3. A lint rule (eslint `no-restricted-imports`) prevents `import from 'modules/foo/internal/bar'`.
4. Modules communicate via interfaces (function signatures or in-process events), not by reaching into each other's data.

## Real-world analogies
- A house with floors: rooms within a floor share walls; doors are explicit.
- A LEGO set: studs (public APIs) are the only connection points — pieces don't fuse internally.

## Run the demo
```bash
node demo.js
```

The demo defines three modules with explicit public APIs. A fourth module ("admin") tries to reach into the internals of one — and the lint-style guard blocks it.

## Deeper intuition

System architecture topics change the unit of thinking from classes to deployable pieces and interaction styles. The important question is no longer just 'is this code clean?' but 'what does this topology make easy, expensive, risky, or organizationally awkward?'

A strong grasp of **Modular Monolith** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Modular Monolith** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Microservices or Monolith instead:** those may still matter, but **Modular Monolith** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Modular Monolith everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Modular Monolith** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Modular Monolith as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
