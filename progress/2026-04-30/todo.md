# 2026-04-30 — Daily todo

## Yesterday

Sprint starting — no prior day.

---

## Agentic workflows — Level 1 (Beginner — Foundations)

**Topic:** `what-is-an-agent` (#1 in level) — step: `read`

**Files:**
- Master syllabus: [progress/agentic-workflows/SYLLABUS.md](../agentic-workflows/SYLLABUS.md)
- README: [agentic-workflows/01-foundations/what-is-an-agent/README.md](../../agentic-workflows/01-foundations/what-is-an-agent/README.md)
- Demo: [agentic-workflows/01-foundations/what-is-an-agent/demo.js](../../agentic-workflows/01-foundations/what-is-an-agent/demo.js)
- Homework: [agentic-workflows/01-foundations/what-is-an-agent/homework.md](../../agentic-workflows/01-foundations/what-is-an-agent/homework.md)
- Section syllabus: [agentic-workflows/SYLLABUS.md](../../agentic-workflows/SYLLABUS.md)

**Today:**
- [ ] **Step:** Read `what-is-an-agent/README.md` (132 lines, ~30 min). Capture 3–5 takeaways in the Notes section, including at least one item from the "Why agents work (and why they fail)" list.
- [ ] **Apply:** Write a 20-line `tiny-agent.js` containing the four-piece anatomy: a stub LLM (returns canned next-action), one tool (`countLines(filename)` is fine), a loop (max 3 iterations), and a goal (e.g., "tell me how many lines are in `progress/README.md`"). Run it and print each loop iteration. Save to `agentic-workflows/_solutions/applied/what-is-an-agent/2026-04-30.js`.

**Prove it — answer in Notes:**
1. The README's defining test for "agent vs chatbot vs workflow" is **who decides what to do next**. Pick a tool you actually use — is it agent / chatbot / workflow by that test? Justify in one sentence.
2. The autonomy gradient runs 0→4. Pick a use case in your own work you'd actually want to automate. What level would you start at, and what's your "rule of thumb" reason?
3. The README says agents fail when "the tool set is too rich (paralysis) or too sparse (impossibility)." Give one concrete example of each — they can be hypothetical, but be specific (which tools, which task).

---

## Software architecture — Level 1 (Beginner — Fundamentals + Principles)

**Topic:** `separation-of-concerns` (#1 in level) — step: `read`

**Files:**
- Master syllabus: [progress/architecture/SYLLABUS.md](../architecture/SYLLABUS.md)
- README: [software-engineering/architecture/01-fundamentals/separation-of-concerns/README.md](../../software-engineering/architecture/01-fundamentals/separation-of-concerns/README.md)
- Demo: [software-engineering/architecture/01-fundamentals/separation-of-concerns/demo.js](../../software-engineering/architecture/01-fundamentals/separation-of-concerns/demo.js)
- Homework: [software-engineering/architecture/01-fundamentals/separation-of-concerns/homework.md](../../software-engineering/architecture/01-fundamentals/separation-of-concerns/homework.md)
- Section syllabus: [software-engineering/SYLLABUS.md](../../software-engineering/SYLLABUS.md)

**Today:**
- [ ] **Step:** Read `separation-of-concerns/README.md` (73 lines, ~15 min). Capture 3–5 takeaways in Notes — make sure at least one is a **trade-off** (the cons section is short; don't skip it).
- [ ] **Apply:** Write a 30-line script that mixes three concerns (e.g., reads a CSV, computes a stat, writes a report file). Then split it into three single-purpose files: `parse.js` (pure), `compute.js` (pure), `report.js` (I/O). Save both versions side-by-side to `software-engineering/_solutions/applied/separation-of-concerns/2026-04-30/before.js` and `.../after/`. The "after" version should let you swap `report.js` for a no-op without touching the others (mirroring the README's demo).

**Prove it — answer in Notes:**
1. The rule of thumb says "if you can name three independent reasons a function might change, it's three functions in disguise." Pick a function you've written recently — name three reasons it might change. Is it really one concern or three in disguise?
2. The README lists "more files, more wiring" and "ceremony / anemic modules" as cons. Describe a real codebase (yours or one you've used) where over-applied SoC made things harder, not easier.
3. Restaurant analogy: pastry / grill / dish stations. What's the equivalent split for a typical "create an order" web feature? Name three stations and what each owns.

---

## Design patterns — Level 1 (Beginner — Foundations of pattern thinking) — Head First Ch 1

**Topic:** `Ch 1: Welcome to Design Patterns` (#1 in level) — step: `read`
**Pattern(s):** Strategy
**Running example:** SimUDuck

**Files:**
- Master syllabus: [progress/design-patterns/SYLLABUS.md](../design-patterns/SYLLABUS.md)
- Head First chapter: read in your physical/digital copy of *Head First Design Patterns* (2nd ed, 2020) — Chapter 1
- Repo Strategy reference — README: [software-engineering/design-patterns/behavioral/strategy/README.md](../../software-engineering/design-patterns/behavioral/strategy/README.md)
- Repo Strategy reference — Demo: [software-engineering/design-patterns/behavioral/strategy/demo.js](../../software-engineering/design-patterns/behavioral/strategy/demo.js)
- Repo Strategy reference — Homework: [software-engineering/design-patterns/behavioral/strategy/homework.md](../../software-engineering/design-patterns/behavioral/strategy/homework.md)
- Family overview: [software-engineering/design-patterns/behavioral/README.md](../../software-engineering/design-patterns/behavioral/README.md)

**Today:**
- [ ] **Step:** Start Head First Ch 1 — aim for ~30–60 minutes today. Read at least through the SimUDuck "inheritance breaks" reveal and the first introduction of "encapsulating what varies." If you finish the chapter, advance the step in `progress/design-patterns/state.md` before tomorrow's run.
- [ ] **Apply:** Type (don't paste) a 15-line example: a `Sorter` class with a swappable `compare` Strategy. Implement two concrete strategies (`byLength`, `byAlphabetical`), instantiate the sorter twice with each, sort `["bee", "a", "elephant"]` with both, print results. Save to `software-engineering/_solutions/applied/headfirst-ch1-strategy/2026-04-30.js`.

**Prove it — answer in Notes:**
1. The Duck simulator started with `Duck` as a base class and added `fly()`. In your own words: what specifically broke when they tried to put `fly()` on the base class? What did inheritance promise that it couldn't deliver?
2. Ch 1 introduces three OO principles: "identify the aspects that vary, encapsulate them," "program to an interface, not an implementation," and "favor composition over inheritance." Pick the one that feels **least** intuitive to you and explain why. Don't pretend they all click the first time.
3. Name a Strategy hiding in code you've worked with under a different name (common aliases: "policy", "handler", "provider", "selector", "comparator"). What's the strategy interface in that case, and what concrete strategies exist?

---

## Notes

_(Free space — answer the "Prove it" questions here, jot insights, blockers, things to revisit.)_

### Agentic workflows — answers

1.
2.
3.

### Software architecture — answers

1.
2.
3.

### Design patterns — answers

1.
2.
3.
