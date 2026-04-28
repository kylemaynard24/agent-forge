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
