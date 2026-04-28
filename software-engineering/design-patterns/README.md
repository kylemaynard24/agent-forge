# GoF Design Patterns — a study path

23 patterns is a lot, and the order you read them in matters. This README is the **recommended order**, with the reasoning behind it. The full catalog is at the bottom as reference.

Each pattern directory has:

```
<pattern-name>/
  README.md     — intent, when to use, structure, trade-offs, comparisons to siblings
  demo.js       — self-contained, runnable with `node demo.js`
```

For each pattern: read the README, run the demo, then read the demo source alongside its output. Spend more time on the **comparisons** (Strategy vs. State, Decorator vs. Proxy, Adapter vs. Facade) than on the definitions — most real design questions aren't "should I use this pattern?" but "*which* of these two should I use?".

---

## The six-phase study path

You can stop between phases and come back — each phase is self-contained. Estimated time end-to-end: 8–15 hours if you re-type the demos yourself.

### Phase 1 — Fundamentals (start here)

*If you only learn four patterns, learn these.*

1. [Strategy](behavioral/strategy/)
2. [Observer](behavioral/observer/)
3. [Adapter](structural/adapter/)
4. [Singleton](creational/singleton/)

**Why first:** these four are the highest-leverage patterns in modern code.

- **Strategy** teaches polymorphism via composition — arguably the single most-used OOP idea of the last twenty years, and the one you'll see most often in codebases that use *any* pattern.
- **Observer** is quietly in nearly every system you use (DOM events, `EventEmitter`, React state, pub/sub queues). Naming it turns something familiar into a tool you can reach for deliberately.
- **Adapter** is the simplest wrapper and teaches the core structural move — one object exposes another's functionality behind a different interface.
- **Singleton** is short and familiar, and introduces "one instance, global access" together with the trade-offs that make people argue about it (hidden dependencies, testability).

Get these four into your bones and a large fraction of real-world design conversations suddenly make sense.

### Phase 2 — Wrappers, separated by intent

*Three more patterns that all wrap an object — the difference is **why**.*

5. [Decorator](structural/decorator/)
6. [Proxy](structural/proxy/)
7. [Facade](structural/facade/)

**Why here, in this order:** you already know Adapter. Now look at three more wrappers whose *intent* differs — Decorator **adds behavior**, Proxy **controls access**, Facade **simplifies a subsystem**. Reading them back-to-back trains you to pick by intent rather than by shape. All three show up constantly in real code (middleware stacks, caching layers, SDK facades).

### Phase 3 — Creation

*"How do I construct things without hard-coding the concrete class?"*

8. [Factory Method](creational/factory-method/)
9. [Abstract Factory](creational/abstract-factory/)
10. [Builder](creational/builder/)
11. [Prototype](creational/prototype/)

**Why this order:** Factory Method → Abstract Factory is a natural generalization — Factory Method defers one product to a subclass; Abstract Factory does the same for a *family* of products. Builder and Prototype are independent: Builder for step-by-step construction of complex objects, Prototype for creation by cloning. Singleton is intentionally in Phase 1, not here — it's more about access than construction, and it's more useful to grapple with early.

### Phase 4 — State and behavior over time

*"My object behaves differently depending on the situation."*

12. [State](behavioral/state/)
13. [Template Method](behavioral/template-method/)
14. [Command](behavioral/command/)
15. [Memento](behavioral/memento/)
16. [Chain of Responsibility](behavioral/chain-of-responsibility/)

**Why this order:**

- **State** is structurally identical to Strategy, which you already know — but with self-transition. The comparison *is* the lesson.
- **Template Method** vs. Strategy is another deliberate pairing: inheritance (Template Method) vs. composition (Strategy). You've now seen both answers to "how do I vary one algorithm."
- **Command** introduces "operation as a first-class object," which leads naturally into **Memento** (they pair for undo/redo).
- **Chain of Responsibility** closes out the phase as a specialized handler pipeline — think Express middleware.

### Phase 5 — Navigating and coordinating

*Patterns for structures with many moving parts.*

17. [Iterator](behavioral/iterator/)
18. [Composite](structural/composite/)
19. [Mediator](behavioral/mediator/)

**Why this order:** Iterator is nearly native in JavaScript (`Symbol.iterator`, generators, `for...of`), so it's a soft on-ramp. Composite pairs with Iterator — the natural way to walk a composite tree is via iteration. Mediator steps up one level: it coordinates *many* peers through a hub, and introduces the "who should know about whom?" question that dominates as systems grow.

### Phase 6 — Specialized / advanced

*Read these so you recognize them. Don't feel obligated to apply them.*

20. [Bridge](structural/bridge/)
21. [Flyweight](structural/flyweight/)
22. [Visitor](behavioral/visitor/)
23. [Interpreter](behavioral/interpreter/)

**Why last:** these are the rarest patterns in everyday code.

- **Bridge** matters when you genuinely have two axes of variation — and in dynamic languages you can often just pass a function where Bridge would demand a class hierarchy.
- **Flyweight** is a memory-optimization trick worth knowing, but most applications never need it.
- **Visitor** is a compiler-writer's pattern — gorgeous for ASTs and linters, overkill almost everywhere else. In JavaScript a `switch` on `node.type` is often clearer.
- **Interpreter** is the most specialized in the book — a pure GoF Interpreter is rare even in language-tooling work, where parser generators and visitor-based evaluators have largely replaced it.

Ending here gives you coverage without letting rare patterns crowd out the ones you'll actually reach for.

---

## Why not alphabetical? Why not by category?

- **Alphabetical** is easy but arbitrary — it doesn't help you learn.
- **By category** (creational → structural → behavioral, the GoF book's order) front-loads Singleton and delays high-leverage patterns like Strategy and Observer.

The order above is optimized for two things at once:

1. **High-leverage first.** Phase 1 covers the patterns you'll genuinely use every week. Phase 6 covers the patterns you'll need a handful of times in your career. If you run out of time at Phase 3, you still come away strong.
2. **Deliberate pairings.** Learning Strategy just before State makes the State README's comparison with Strategy click. Learning Adapter just before Decorator/Proxy/Facade trains you to separate structural shape from intent. Learning Command just before Memento shows you how they combine for undo. The order is chosen so each README's "vs. sibling" section lands on a sibling you've already seen.

If you're prepping for an interview or cramming for a course, Phase 1–3 covers >80% of what comes up. Phase 4–5 fills in what's left. Phase 6 is a completeness pass.

---

## Full catalog (reference)

### Creational (5) — how objects are created

| Pattern | Intent in one line |
| --- | --- |
| [Singleton](creational/singleton/) | Ensure a class has exactly one instance and give it a global access point |
| [Factory Method](creational/factory-method/) | Defer object creation to subclasses via an overridable method |
| [Abstract Factory](creational/abstract-factory/) | Create families of related objects without specifying concrete classes |
| [Builder](creational/builder/) | Construct a complex object step-by-step, separating construction from representation |
| [Prototype](creational/prototype/) | Create new objects by cloning an existing instance instead of instantiating a class |

### Structural (7) — how objects are composed

| Pattern | Intent in one line |
| --- | --- |
| [Adapter](structural/adapter/) | Make an incompatible interface work with client code that expects a different one |
| [Bridge](structural/bridge/) | Decouple an abstraction from its implementation so the two can vary independently |
| [Composite](structural/composite/) | Treat individual objects and compositions of objects uniformly |
| [Decorator](structural/decorator/) | Add behavior to an object dynamically by wrapping it |
| [Facade](structural/facade/) | Provide a simple interface over a complex subsystem |
| [Flyweight](structural/flyweight/) | Share fine-grained objects efficiently by separating intrinsic from extrinsic state |
| [Proxy](structural/proxy/) | Stand in for another object to control access, defer creation, or add cross-cutting logic |

### Behavioral (11) — how objects communicate

| Pattern | Intent in one line |
| --- | --- |
| [Chain of Responsibility](behavioral/chain-of-responsibility/) | Pass a request along a chain until one handler handles it |
| [Command](behavioral/command/) | Encapsulate a request as an object so it can be queued, logged, or undone |
| [Interpreter](behavioral/interpreter/) | Represent a small language's grammar as a class hierarchy and evaluate sentences |
| [Iterator](behavioral/iterator/) | Access elements of a collection without exposing its underlying representation |
| [Mediator](behavioral/mediator/) | Centralize complex communication between peers through a mediator object |
| [Memento](behavioral/memento/) | Capture an object's state so it can be restored later without violating encapsulation |
| [Observer](behavioral/observer/) | Notify many objects automatically when one object changes |
| [State](behavioral/state/) | Let an object alter its behavior when its internal state changes |
| [Strategy](behavioral/strategy/) | Encapsulate interchangeable algorithms behind a common interface |
| [Template Method](behavioral/template-method/) | Define an algorithm's skeleton, letting subclasses override specific steps |
| [Visitor](behavioral/visitor/) | Separate an algorithm from the object structure it operates on |

---

## Running everything

```bash
# Run one demo
node creational/singleton/demo.js

# Run every demo in sequence (smoke test)
find . -name demo.js | sort | xargs -n1 node
```

## A word on JavaScript and patterns

The GoF book is written in C++ and Smalltalk. In JavaScript:

- **Singleton** — a module already is one. The class form is shown for completeness.
- **Iterator** — first-class via `Symbol.iterator` and generators. The pattern is almost built in.
- **Prototype** — every JS object has a prototype link; the pattern is close to the language's bones.
- **Strategy / Command / Observer** — first-class functions make these lighter than in class-heavy languages.

The demos use ES6 classes to match the book's shape. In real code you'd often write these more concisely with functions or modules — but the pattern *shape* reads more clearly with classes.

## How to know a pattern has "clicked"

A pattern has not clicked when you can draw its class diagram from memory. It has clicked when you can look at an unfamiliar codebase and notice the design pressure that pattern responds to: algorithm swapping, object creation control, wrapper intent, broadcast updates, undoable actions, tree-shaped structures, and so on.

The most important habit in this section is comparison. Patterns become useful in the moment where two or three shapes all seem plausible and you need to explain why one is the better fit. Keep asking not just "what is this pattern?" but "what other nearby pattern would someone confuse it with, and what makes them different in practice?"

## Questions to carry through the catalog

- What source of change is this pattern isolating?
- What new indirection does it introduce?
- What simpler alternative would I try first?
- If I removed this pattern, where would complexity leak back into the system?
