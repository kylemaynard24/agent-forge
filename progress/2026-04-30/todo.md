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

**Reading material — orient yourself before opening the README:**

> _Primer:_ An "agent" is the most overloaded word in the current AI conversation. The README cuts through this by giving a precise, working definition: an LLM put inside a loop, given tools to act on the world, and pointed at a goal. The defining test for whether something is an agent — versus a chatbot or a workflow — is **who decides what to do next at runtime**. This is the vocabulary anchor for the entire 6-month dojo: every later topic (tools, loops, memory, multi-agent, reliability) is a refinement of one of the four pieces introduced here. Read this slowly; the precision pays compound interest later.

> _Key concepts you'll meet:_
> - **Agent** — LLM + tools + loop + goal. Decides each next move at runtime.
> - **Loop** — the runtime that asks the LLM "what now?", executes the chosen action, feeds the result back, asks again.
> - **Tool** — a concrete capability (read a file, run a command, query a DB). Without tools, an agent is just a chatbot.
> - **Autonomy gradient** — a 0→4 spectrum from "human acts on every output" to "agent acts unsupervised in production."
> - **Goal** — the user's intent, supplied as the prompt. The thing that lets the LLM judge "am I done yet?"

> _Watch for as you read:_ The "When to reach for an agent" / "Don't reach for one when" pair — the second list is more useful than the first. Also: the thermostat counter-example at the end of "Real-world analogies" — it sharpens what an agent **is not**.

> _Excerpt (verbatim from the linked README):_
> > "The defining difference is **who decides what to do next**. In a chatbot, the user does. In a workflow, the developer did (at design time). In an agent, the LLM does — at runtime, every step."

**Today:**
- [ ] **Step:** Read `what-is-an-agent/README.md` (132 lines, ~30 min). Capture 3–5 takeaways in the Notes section, including at least one item from "Why agents work (and why they fail)."
- [ ] **Apply:** Write a 20-line `tiny-agent.js` containing the four-piece anatomy: a stub LLM (returns canned next-action), one tool (`countLines(filename)` works), a loop (max 3 iterations), and a goal (e.g., "tell me how many lines are in `progress/README.md`"). Print each loop iteration. Save to `agentic-workflows/_solutions/applied/what-is-an-agent/2026-04-30.js`.

**Prove it — answer in Notes:**
1. The README's defining test for "agent vs chatbot vs workflow" is **who decides what to do next**. Pick a tool you actually use — is it agent / chatbot / workflow by that test? One sentence justification.
2. The autonomy gradient runs 0→4. Pick a use case in your own work you'd actually want to automate. What level would you start at, and what's the rule-of-thumb reason?
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

**Reading material — orient yourself before opening the README:**

> _Primer:_ Separation of Concerns is the most-cited word in software design and the foundation of nearly every later architecture topic. The intent is simple: each module owns one focus area, so a change in one place doesn't ripple in three directions. The hard part isn't agreeing with the principle — everyone does — it's knowing how far to take it. Over-applied SoC produces ceremony, anemic modules, and indirection that's harder to follow than the mess it replaced. Today's read is short (73 lines), so spend the saved time really sitting with the cons section and the rule of thumb. The most useful skill from this topic is being able to argue about *when not to split*.

> _Key concepts you'll meet:_
> - **Concern** — one focus area: validation, business logic, persistence, notification, UI rendering.
> - **Locality of change** — the goal: edit one concern without touching the others.
> - **Anemic module** — a SoC failure mode where the module exists but does nothing meaningful, just forwards calls.
> - **Rule of thumb (3 reasons)** — "if you can name three independent reasons a function might change, it's three functions in disguise."
> - **Restaurant analogy** — pastry / grill / dish stations: distinct concerns, one slammed station doesn't stop the others.

> _Watch for as you read:_ The "Cons" list is shorter than the "Pros" list — but the cons are where most real architecture mistakes happen. Read those 3 lines twice. Also: the "Scenario 2" question at the end deliberately argues against blindly applying the principle.

> _Excerpt (verbatim from the linked README):_
> > "Each module, file, or class owns one focus area. When a single piece of code mixes UI, business rules, and persistence, every change ripples in three directions."
> >
> > "**Rule of thumb:** If you can name three independent reasons a function might change, it's three functions in disguise."

**Today:**
- [ ] **Step:** Read `separation-of-concerns/README.md` (73 lines, ~15 min). Capture 3–5 takeaways in Notes — at least one **trade-off** (don't skip the short cons section).
- [ ] **Apply:** Write a 30-line script that mixes three concerns (e.g., reads a CSV, computes a stat, writes a report). Then split into three single-purpose files: `parse.js` (pure), `compute.js` (pure), `report.js` (I/O). Save side-by-side to `software-engineering/_solutions/applied/separation-of-concerns/2026-04-30/before.js` and `.../after/`. The "after" version should let you swap `report.js` for a no-op without touching the others.

**Prove it — answer in Notes:**
1. The rule of thumb says "if you can name three independent reasons a function might change, it's three functions in disguise." Pick a function you've written recently — name three reasons it might change. Is it really one concern or three?
2. The README lists "more files, more wiring" and "ceremony / anemic modules" as cons. Describe a real codebase where over-applied SoC made things harder, not easier.
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

**Reading material — context if the book isn't in front of you:**

> _Primer:_ Chapter 1 of Head First is the book's "why patterns matter" chapter, taught entirely through the SimUDuck example — a duck simulation game whose first design uses inheritance to share behavior. As the team adds new duck types (rubber ducks that don't quack, decoy ducks that don't fly), the inheritance hierarchy starts to break in ways that override-and-suppress can't fix cleanly. The chapter walks you through that pain on purpose, then introduces three OO design principles that resolve it: identify what varies and encapsulate it, program to an interface not an implementation, and favor composition over inheritance. The pattern that emerges is **Strategy** — pull the varying behaviors (fly, quack) out into interchangeable strategy objects that the Duck holds and delegates to. The chapter is dense and warmly illustrated; expect to spend more than one session on it.

> _Key concepts you'll meet:_
> - **Strategy pattern** — define a family of algorithms behind a common interface, make them interchangeable at runtime.
> - **Encapsulate what varies** — separate the parts that change from the parts that stay the same.
> - **Program to an interface (or supertype)** — clients depend on an abstraction; concrete implementations are swappable.
> - **Composition over inheritance** — give an object a behavior reference rather than inheriting the behavior; far more flexible at runtime.
> - **HAS-A vs IS-A** — Duck *has-a* FlyBehavior (composition) instead of Duck *is-a* FlyingThing (inheritance).

> _Watch for as you read:_ The deliberate "wrong" first design — they show you inheritance breaking before they fix it. Don't skim that part; the discomfort is the lesson. Also: the chapter contrasts Strategy with the simpler-looking alternative of conditionals and shows why "just add an if-statement" doesn't scale.

> _Excerpt (verbatim from the repo's secondary-reference README — `software-engineering/design-patterns/behavioral/strategy/README.md`):_
> > "Define a family of algorithms, encapsulate each one behind a common interface, and make them **interchangeable at runtime**. The client holds a strategy object and delegates the algorithmic work to it."
> >
> > "**Strategy vs. State:** Structurally similar. The difference is intent — Strategy: the client chooses; strategies don't transition. State: the context transitions between states; states know each other."

**Today:**
- [ ] **Step:** Start Head First Ch 1 — aim for ~30–60 minutes today. Read at least through the SimUDuck "inheritance breaks" reveal and the introduction of "encapsulating what varies." If you finish the chapter, advance the step in `progress/design-patterns/state.md` before tomorrow's run.
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
