# DRY, KISS, YAGNI

**Category:** Fundamentals

## Intent
Three principles for restraint. They pull in different directions and *all three are wrong some of the time.* The skill is knowing which applies.

- **DRY** (Don't Repeat Yourself) — every piece of *knowledge* should have one authoritative source.
- **KISS** (Keep It Simple, Stupid) — prefer the obvious solution; complexity should be earned, not imagined.
- **YAGNI** (You Aren't Gonna Need It) — don't build features (or extension points) for hypothetical futures.

## When each applies — and when it's wrong

| Principle | Applies when... | Misapplied when... |
|---|---|---|
| DRY | Two pieces of code encode the *same* business rule. | Two pieces of code happen to *look* alike but mean different things. (Premature DRY = wrong abstraction.) |
| KISS | You're adding indirection "in case." | You're choosing simple at the cost of correctness. |
| YAGNI | You're building config, plugin systems, or generic frameworks "for later." | You're tearing out tests or error handling because "we don't need them yet." |

## The most common mistake
**False DRY.** Two functions look 80% the same; you extract a shared helper; six months later one needs a small variation; the helper grows a flag; then another flag; then another. Eventually you have a Frankenstein that's harder to read than two duplicates would have been. **Rule: duplicate first, abstract on the third occurrence.**

## Trade-offs
**Pros (collectively)**
- Less code, less maintenance.
- Fewer accidental complexity sources.
- Future you doesn't pay for fictional future requirements.

**Cons**
- DRY done early hides differences and creates couplings.
- KISS without rigor produces something that works for the demo and breaks in prod.
- YAGNI taken to extreme produces brittle code that's painful to extend when you *do* need it.

**Rule of thumb:** Duplicate three times, then DRY. Build the simplest thing that *correctly* solves the problem, then stop.

## Real-world analogies
- DRY: a single source of truth for "the company's tax rate" — not three copies in three modules.
- KISS: a paper notebook beats an enterprise wiki for a 3-person team.
- YAGNI: don't pour a foundation for a tower if you're building a shed.

## Run the demo
```bash
node demo.js
```

The demo shows a "wrong DRY" abstraction — two operations that looked similar but encoded different rules — being unwound back into two simple variants.

## Deeper intuition

Fundamental design topics are the physics of software. They look simple because they are old and broadly stated, but they keep reappearing because every architecture eventually pays for violating them. Treat them less like slogans and more like recurring force diagrams: where is knowledge concentrated, where does change ripple, and where are you accidentally making two concerns rise and fall together?

A strong grasp of **DRY, KISS, YAGNI** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?
