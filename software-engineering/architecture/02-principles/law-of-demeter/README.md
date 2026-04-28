# Law of Demeter (LoD)

**Category:** Principles (Bonus — not part of SOLID)

## Intent
**Talk only to your immediate friends.** A method `m` of object `O` may invoke methods on:
1. `O` itself.
2. `m`'s parameters.
3. Objects `m` creates.
4. `O`'s direct fields.

It may **not** reach through chains of objects to call methods on strangers. Also called "tell, don't ask."

`a.getB().getC().doSomething()` — this is a Demeter violation. You're poking through `a` and `b` to talk to `c`. Now `a`'s caller is coupled to the structure of `b` and `c`.

## When to use
- Code is full of `.x.y.z.method()` chains.
- Mocking a single thing for tests requires building a five-level object graph.
- You change `B`'s internals and unrelated callers of `A` break.

## Trade-offs
**Pros**
- Less structural coupling — callers don't know how `A` is built inside.
- "Tell, don't ask" leads to behavior on the right object.
- Mocking is easier — you only mock direct collaborators.

**Cons**
- Wrappers add methods that just delegate (`a.doToC(...)` calls `b.doToC(...)`).
- Sometimes a chain is *fine* — fluent builders, immutable data pipelines.

**Rule of thumb:** Object chains hurt when objects have *behavior*. Pure data pipelines (`list.filter().map().reduce()`) are not LoD violations — they're operating on values, not collaborators.

## Real-world analogies
- A boss asking the assistant to print: `boss.tellAssistantToPrint()` — not `boss.assistant.printer.start()`.
- A hotel guest asks the front desk for a wake-up call. They don't reach into the back office, walk to the PBX, and program it themselves.

## Run the demo
```bash
node demo.js
```

The demo contrasts `wallet.getMoney().withdraw(10)` (the caller knows wallet contains a money object with a withdraw method) against `wallet.withdraw(10)` (tell the wallet what you want; it knows how).

## Deeper intuition

Design principles are heuristics for preserving flexibility under change. None of them are laws; all of them can be over-applied. The point of learning them is to get better at seeing why a codebase feels rigid or slippery, not to turn every review into acronym enforcement.

A strong grasp of **Law of Demeter (LoD)** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?

## Scenario questions

These questions are here to train recognition, not memorization. The goal is to get faster at seeing when **Law of Demeter (LoD)** is the right lens, when it is only part of the answer, and when a nearby idea might fit better.

### Scenario 1 — "A design keeps getting harder to change because too many details leak outward"

**Question:** You are reviewing a system and notice that callers know too much about internals, so even small changes ripple outward. Should this topic be one of the first ideas you reach for?

**Answer:** Usually yes.

**Explanation:** This topic is valuable when the real problem is not just "messy code" but misplaced knowledge, tangled boundaries, or a design that makes change travel farther than it should. In architecture, the first win is often naming the force correctly before jumping to a fix.

**Why not start with Interface Segregation or Liskov Substitution instead:** those may still matter, but **Law of Demeter (LoD)** is the stronger first lens when the core question is how to shape the design so the right responsibility sits in the right place and fewer changes leak across the boundary.

### Scenario 2 — "A team wants a clean rule, but the system is full of trade-offs"

**Question:** Someone says, "We should apply Law of Demeter (LoD) everywhere." Is that a good architectural instinct?

**Answer:** Not automatically.

**Explanation:** Architecture topics are decision tools, not commandments. **Law of Demeter (LoD)** helps when its specific pressure is present, but over-applying any principle can create ceremony, fragmentation, or needless indirection. A mature answer is usually "use more of this here, less of it there, and know why."

**Why not treat Law of Demeter (LoD) as a universal default:** because architecture is about balancing forces. If the simpler design already works, blindly pushing harder on one principle can make the system worse even though the principle itself is sound.
