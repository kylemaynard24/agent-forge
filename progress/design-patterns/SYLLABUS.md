# Design patterns — master syllabus (Head First chapter order, beginner → expert)

Source of truth for the `daily-tasks` skill. Follows the table of contents of *Head First Design Patterns* (2nd edition, 2020 — Freeman/Robson). Each **chapter** is one topic, and each topic typically spans **4–7 working days** because Head First chapters are long, illustrated, and dense with "Sharpen your pencil" exercises that earn their time.

> Edition note: this syllabus assumes the 2nd edition (2020) chapter list. If your copy is the 1st edition (2004), the order is the same through Ch 12 but Ch 13 is shorter and the appendix has slightly fewer leftover patterns. Adjust as needed.

For each chapter the canonical step order is **read → demo → implement**:

- **read** — work through the chapter at your own pace. Often spans 2–3 days for a full Head First chapter; the skill will keep assigning "continue reading" tasks until you advance the step.
- **demo** — type out the chapter's main running code example yourself (don't paste — typing builds the muscle memory). Run it. Modify it. Predict before re-running.
- **implement** — do the chapter's "Sharpen your pencil" / exercises AND build a small original example that uses the chapter's pattern in a different domain. Save to `software-engineering/_solutions/design-patterns/headfirst-ch<N>-<short>/`.

Repo content under `software-engineering/design-patterns/<family>/<pattern>/` is a **secondary reference** — the linked README/demo/homework give a second angle on the same pattern, and the skill includes them as additional resources. For chapters covering multiple patterns (Ch 4, 7, 9), all relevant pattern dirs are linked.

The skill picks the next chapter by `(level, index)` in `state.md`. When a chapter's `implement` step is done, advance the index by 1; when the index passes the level's last chapter, advance the level.

---

## Level 1 — Beginner: Foundations of pattern thinking (Chapters 1–5)

The five most-used patterns and the chapters where the book teaches you HOW to think in patterns, not just enumerate them.

| # | Chapter | Pattern(s) | Running example | Repo refs |
|---|---|---|---|---|
| 1 | Ch 1: Welcome to Design Patterns | Strategy | SimUDuck | `software-engineering/design-patterns/behavioral/strategy/` |
| 2 | Ch 2: Keeping Your Objects in the Know | Observer | Weather Station | `software-engineering/design-patterns/behavioral/observer/` |
| 3 | Ch 3: Decorating Objects | Decorator | Starbuzz Coffee | `software-engineering/design-patterns/structural/decorator/` |
| 4 | Ch 4: Baking with OO Goodness | Factory Method + Abstract Factory | Pizza Store | `software-engineering/design-patterns/creational/factory-method/`, `software-engineering/design-patterns/creational/abstract-factory/` |
| 5 | Ch 5: One of a Kind Objects | Singleton | Chocolate Boiler | `software-engineering/design-patterns/creational/singleton/` |

**Level capstone:** find each of these patterns (Strategy, Observer, Decorator, Factory, Singleton) in real code — your project, an open-source codebase, or a framework you use. 1-paragraph note per pattern: what it is, why it fits there, what would break without it.

---

## Level 2 — Intermediate: Encapsulation and adaptation (Chapters 6–8)

Three more patterns that show how to encapsulate change.

| # | Chapter | Pattern(s) | Running example | Repo refs |
|---|---|---|---|---|
| 1 | Ch 6: Encapsulating Invocation | Command | Remote Control | `software-engineering/design-patterns/behavioral/command/` |
| 2 | Ch 7: Being Adaptive | Adapter + Facade | Turkey/Duck adapter, Home Theater facade | `software-engineering/design-patterns/structural/adapter/`, `software-engineering/design-patterns/structural/facade/` |
| 3 | Ch 8: Encapsulating Algorithms | Template Method | Coffee/Tea (CaffeineBeverage) | `software-engineering/design-patterns/behavioral/template-method/` |

**Level capstone:** write a 1-page summary contrasting Adapter / Decorator / Proxy / Facade. They look similar in UML; they aren't. If you can't tell them apart in writing, you don't yet understand them.

---

## Level 3 — Advanced: Composing and controlling (Chapters 9–12)

Patterns that work on collections, manage state, control access, and combine other patterns.

| # | Chapter | Pattern(s) | Running example | Repo refs |
|---|---|---|---|---|
| 1 | Ch 9: Well-Managed Collections | Iterator + Composite | Diner / Pancake House menu | `software-engineering/design-patterns/behavioral/iterator/`, `software-engineering/design-patterns/structural/composite/` |
| 2 | Ch 10: The State of Things | State | Gumball Machine | `software-engineering/design-patterns/behavioral/state/` |
| 3 | Ch 11: Controlling Object Access | Proxy | Gumball Machine monitor | `software-engineering/design-patterns/structural/proxy/` |
| 4 | Ch 12: Patterns of Patterns | Compound Patterns / MVC | Duck simulator revisited | (combines Strategy, Observer, Adapter, Composite, Iterator, MVC) |

**Level capstone:** rebuild the Ch 12 Duck simulator in your own style. Document each pattern you used and at least one pattern you considered but rejected.

---

## Level 4 — Expert: Real-world judgment + leftover patterns (Chapter 13 + Appendix)

The patterns the book treats as less critical, plus the meta-skill of choosing patterns wisely (and rejecting them when the problem doesn't fit).

| # | Chapter / topic | Pattern(s) | Notes |
|---|---|---|---|
| 1 | Ch 13: Patterns in the Real World | (no new pattern) | Anti-patterns, when NOT to apply patterns, refactoring to patterns. Implement step: pick a small piece of your own code, identify a pattern that's hiding in it, refactor to make it explicit (or argue why you shouldn't). |
| 2 | Appendix — Bridge | Bridge | `software-engineering/design-patterns/structural/bridge/` |
| 3 | Appendix — Builder | Builder | `software-engineering/design-patterns/creational/builder/` |
| 4 | Appendix — Chain of Responsibility | Chain of Resp | `software-engineering/design-patterns/behavioral/chain-of-responsibility/` |
| 5 | Appendix — Flyweight | Flyweight | `software-engineering/design-patterns/structural/flyweight/` |
| 6 | Appendix — Interpreter | Interpreter | `software-engineering/design-patterns/behavioral/interpreter/` |
| 7 | Appendix — Mediator | Mediator | `software-engineering/design-patterns/behavioral/mediator/` |
| 8 | Appendix — Memento | Memento | `software-engineering/design-patterns/behavioral/memento/` |
| 9 | Appendix — Prototype | Prototype | `software-engineering/design-patterns/creational/prototype/` |
| 10 | Appendix — Visitor | Visitor | `software-engineering/design-patterns/behavioral/visitor/` |
| 11 | Original capstone — pick a non-trivial system you'd actually use, build it, document every pattern adopted AND every one rejected | external | Deliverable: design doc + working code in `_solutions/external/capstone/` |

For the appendix patterns, Head First gives a one-page treatment, so the workload is smaller — typically 2–3 days each (a short read, a small example, a paragraph contrasting it with a sibling pattern).

For the external capstone: no `README.md`/`demo.js`/`homework.md` — the deliverable is the implement step. Multi-day implement is fine; the skill will give you a sub-goal per day.

---

## Reading alongside

- *Head First Design Patterns* (2nd ed, 2020) — Freeman/Robson — primary text
- *Design Patterns* (Gamma/Helm/Johnson/Vlissides) — GoF reference for the formal version of each pattern
- *Refactoring* (Fowler) — for "when to introduce a pattern" judgment
