# Design patterns — master syllabus (beginner → expert)

Source of truth for the `daily-tasks` skill. Walks you from "I've never named a pattern" to "I know which of two similar patterns fits a problem and can defend rejecting one." Follows the **six-phase study path** in `software-engineering/design-patterns/README.md` (which is pedagogically better than GoF book order: it interleaves families by intent and starts with the highest-leverage patterns).

For each topic the canonical step order is **read → demo → implement**. The "implement" step uses the topic's `homework.md` (where present) and writes to `software-engineering/_solutions/design-patterns/<family>/<topic>/`. Some patterns may not yet have a `homework.md` — in that case the implement step is "build a small original example using the pattern correctly" and put it under the same `_solutions/...` path.

The skill picks the next topic by `(level, index)` in `state.md`. When a topic's `implement` step is done, advance the index by 1; when the index passes the end of a level, advance the level.

---

## Level 1 — Beginner: Fundamentals (the four highest-leverage patterns)

Goal: name and apply Strategy, Observer, Adapter, Singleton without prompting; recognize them in any codebase.

| # | Topic | Path |
|---|---|---|
| 1 | strategy | `software-engineering/design-patterns/behavioral/strategy/` |
| 2 | observer | `software-engineering/design-patterns/behavioral/observer/` |
| 3 | adapter | `software-engineering/design-patterns/structural/adapter/` |
| 4 | singleton | `software-engineering/design-patterns/creational/singleton/` |

**Level capstone:** find each of these four patterns in real code (your project or open-source). Write a 1-paragraph note per pattern: what it is, why it fits there, what would break if it weren't.

---

## Level 2 — Intermediate: Wrappers and creation

Goal: pick by intent — distinguish Decorator (adds behavior), Proxy (controls access), Facade (simplifies subsystem), and the family of construction patterns.

| # | Topic | Path |
|---|---|---|
| 1 | decorator | `software-engineering/design-patterns/structural/decorator/` |
| 2 | proxy | `software-engineering/design-patterns/structural/proxy/` |
| 3 | facade | `software-engineering/design-patterns/structural/facade/` |
| 4 | factory-method | `software-engineering/design-patterns/creational/factory-method/` |
| 5 | abstract-factory | `software-engineering/design-patterns/creational/abstract-factory/` |
| 6 | builder | `software-engineering/design-patterns/creational/builder/` |
| 7 | prototype | `software-engineering/design-patterns/creational/prototype/` |

**Level capstone:** write a 1-page summary contrasting Adapter / Decorator / Proxy / Facade. They look similar in UML; they aren't. If you can't tell them apart in writing, you don't yet understand them.

---

## Level 3 — Advanced: State, behavior over time, navigating and coordinating

Goal: master the behavioral patterns most common in real systems; learn the deliberate Strategy-vs-State and Strategy-vs-Template-Method comparisons.

| # | Topic | Path |
|---|---|---|
| 1 | state | `software-engineering/design-patterns/behavioral/state/` |
| 2 | template-method | `software-engineering/design-patterns/behavioral/template-method/` |
| 3 | command | `software-engineering/design-patterns/behavioral/command/` |
| 4 | memento | `software-engineering/design-patterns/behavioral/memento/` |
| 5 | chain-of-responsibility | `software-engineering/design-patterns/behavioral/chain-of-responsibility/` |
| 6 | iterator | `software-engineering/design-patterns/behavioral/iterator/` |
| 7 | composite | `software-engineering/design-patterns/structural/composite/` |
| 8 | mediator | `software-engineering/design-patterns/behavioral/mediator/` |

**Level capstone:** build an undoable drawing app OR a CLI command processor that uses Command + Memento + at least three other patterns from this level.

---

## Level 4 — Expert: Specialized patterns + capstone (extends beyond repo)

Goal: recognize the rare patterns when they appear, and design a real system using patterns *because the problem fits them* — never the other way around.

| # | Topic | Path / source |
|---|---|---|
| 1 | bridge | `software-engineering/design-patterns/structural/bridge/` |
| 2 | flyweight | `software-engineering/design-patterns/structural/flyweight/` |
| 3 | visitor | `software-engineering/design-patterns/behavioral/visitor/` |
| 4 | interpreter | `software-engineering/design-patterns/behavioral/interpreter/` |
| 5 | repo capstone — "Design Vocabulary in Action" | `software-engineering/SYLLABUS.md` Stage 2 Capstone. Build a small system using ≥6 GoF patterns *that fit* + 2-page design doc with at least one *rejected* pattern. |
| 6 | read GoF *Design Patterns* — chapters on the four patterns you find hardest. Write a 1-page synthesis | external. Deliverable in `_solutions/external/` |
| 7 | refactor a real codebase to introduce or remove a pattern, with measurements | external. Deliverable: before/after diffs + 1-page write-up of what improved and what didn't |
| 8 | original capstone — pick a non-trivial system you'd actually use, build it, and document every pattern you adopted *and* every one you rejected | external |

For external topics: no `README.md`/`demo.js`/`homework.md` — the deliverable is the implement step. Skip read/demo for them.

---

## Reading alongside

- *Design Patterns* — Gamma/Helm/Johnson/Vlissides (the GoF book) — Levels 1–4 reference
- *Head First Design Patterns* — Freeman/Robson (Levels 1–2 if you want a friendlier on-ramp)
- *Refactoring* — Fowler (Level 3+ for "when to introduce a pattern")
