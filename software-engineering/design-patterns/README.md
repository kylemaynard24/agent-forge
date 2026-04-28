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

## Pattern-selection clinic

One of the hardest parts of learning patterns is that many real design questions sound like:

> "I know there is probably a pattern here. I just don't know **which one**."

The right way to answer that is not to ask "which class diagram matches?" but:

1. what problem is changing?
2. who needs to stay insulated from that change?
3. what kind of indirection is justified?
4. what is the simplest thing that could work first?

The scenarios below are intentionally phrased like design interview questions or code review conversations.

### Scenario 1 — "Pricing rules keep changing every quarter"

**Question:** You have checkout logic with `if/else` branches for regular pricing, loyalty pricing, flash-sale pricing, and regional pricing. New rules keep arriving. Which pattern fits best?

**Pick:** [Strategy](behavioral/strategy/)

**Why pick it:** The thing changing is the **algorithm** for pricing. Strategy lets the checkout flow stay stable while pricing behavior changes behind a common interface.

**Why not pick these instead:**
- **State** — wrong intent. State is for behavior that changes because the object moves through internal states over time. Pricing rules are usually chosen *from outside* based on business conditions.
- **Template Method** — inheritance is a heavier answer here. Strategy keeps variation compositional and easier to combine or swap.
- **Chain of Responsibility** — use it only if multiple handlers may inspect and pass the request onward. Most pricing decisions are "pick one pricing algorithm," not "walk a handler chain."

### Scenario 2 — "We integrated a third-party shipping SDK and its interface is awkward"

**Question:** Your app expects `ship(order)`, but the vendor SDK exposes a weird sequence like `createShipment(payload)` followed by `dispatchShipment(id)`. What pattern fits?

**Pick:** [Adapter](structural/adapter/)

**Why pick it:** The real pressure is **interface mismatch**. Adapter lets your code talk to the vendor through your own expected contract.

**Why not pick these instead:**
- **Facade** — choose Facade only if you want to simplify a **whole subsystem** for easier use. Adapter is narrower: "make this thing look like the shape I already need."
- **Proxy** — Proxy controls access to a compatible interface. It does not solve a bad shape mismatch by itself.
- **Bridge** — Bridge is for two dimensions that vary independently. This is not a two-axis hierarchy problem; it is just a translation problem.

### Scenario 3 — "We keep adding logging, caching, and authorization around one service"

**Question:** A `ReportService` works, but now you want to layer logging, timing, caching, and permission checks without exploding subclasses. What pattern is the best first candidate?

**Pick:** usually [Decorator](structural/decorator/)

**Why pick it:** The core behavior is fine. You want to **wrap it with extra responsibilities** in combinations that can change over time.

**Why not pick these instead:**
- **Proxy** — choose Proxy when the main concern is controlling access to the real subject (lazy loading, remote access, permissions, cache gateway). If the primary intent is "add behavior around calls," Decorator is usually the clearer mental model.
- **Inheritance** — subclass stacks like `CachingLoggingAuthorizedReportService` decay quickly.
- **Facade** — Facade hides subsystem complexity; it is not the best tool for composable cross-cutting behavior.

### Scenario 4 — "A UI object changes behavior as it moves through a lifecycle"

**Question:** An order can be `Draft`, `Submitted`, `Paid`, `Shipped`, or `Cancelled`, and the available actions change in each state. Which pattern fits best?

**Pick:** [State](behavioral/state/)

**Why pick it:** The object's behavior changes because of its **internal lifecycle state**. State makes those transitions explicit and keeps state-specific logic out of giant branch piles.

**Why not pick these instead:**
- **Strategy** — Strategy swaps algorithms, usually chosen by the client or context. State is about the object's *own* current mode and often the state objects know the valid transitions.
- **Command** — Command can model actions like `ShipOrder`, but it does not by itself organize the changing behavior of the order across its lifecycle.
- **Memento** — Memento captures past state for restore/undo; it does not organize state-specific behavior.

### Scenario 5 — "We need undo/redo in a drawing or editor tool"

**Question:** Users trigger actions like draw, move, resize, and delete. Later they want undo and redo. Which pattern or pattern pair should you think about first?

**Pick:** [Command](behavioral/command/) often paired with [Memento](behavioral/memento/)

**Why pick it:** Command turns user actions into first-class objects that can be queued, logged, replayed, and undone. Memento becomes useful when the cleanest undo mechanism is restoring a captured snapshot rather than reversing each command manually.

**Why not pick these instead:**
- **Strategy** — the problem is not choosing one algorithm; it is preserving and replaying user operations.
- **Chain of Responsibility** — a pipeline may dispatch actions, but it does not make them storable as undoable units.
- **Observer** — observers can react to commands, but they do not represent the commands.

### Scenario 6 — "A set of screens all need updates when one model changes"

**Question:** A stock ticker, dashboard, logger, and alert panel all need to react when market data changes. Which pattern fits?

**Pick:** [Observer](behavioral/observer/)

**Why pick it:** One subject changes; many dependents need notification. That is exactly Observer's broadcast shape.

**Why not pick these instead:**
- **Mediator** — choose Mediator when many peers need coordination through a hub. Observer is cleaner when the shape is one subject broadcasting to many listeners.
- **Pub/Sub infrastructure** — that may be how you implement it at system level, but conceptually the object-level pattern here is still Observer.
- **Singleton** — global access to data does not solve coordinated update flow.

### Scenario 7 — "A request should move through several checks until one handles it"

**Question:** A support action might be handled by a billing rule, then a permissions rule, then a fallback rule. Which pattern should be in the conversation first?

**Pick:** [Chain of Responsibility](behavioral/chain-of-responsibility/)

**Why pick it:** the shape is sequential handling with optional pass-through. Each handler either deals with the request or hands it onward.

**Why not pick these instead:**
- **Command** — Command packages the request. It does not define the handler pipeline.
- **Strategy** — Strategy chooses one algorithm. CoR gives several handlers a chance in order.
- **Mediator** — Mediator coordinates peers; here the important structure is a chain, not a hub.

### Scenario 8 — "Construction has become unreadable because everything is optional"

**Question:** A report export object now takes file format, locale, date range, watermark, filters, sort order, and delivery mode. Which pattern fits best?

**Pick:** [Builder](creational/builder/)

**Why pick it:** the pain is step-by-step assembly with readability and validation concerns.

**Why not pick these instead:**
- **Factory Method** — the main problem is not choosing a subclass.
- **Prototype** — cloning helps when you already have a configured exemplar; it does not fix construction clarity.
- **Facade** — Facade simplifies subsystem use, not object assembly.

### Scenario 9 — "Two different UI themes must stay internally consistent"

**Question:** Dark mode and light mode both need matching buttons, menus, dialogs, and notifications. Which pattern is the cleanest fit?

**Pick:** [Abstract Factory](creational/abstract-factory/)

**Why pick it:** the pressure is a **family** of related products that must vary together.

**Why not pick these instead:**
- **Builder** — Builder assembles one object over time.
- **Factory Method** — Factory Method is narrower; Abstract Factory fits when several related products must remain in the same family.
- **Strategy** — themes are not primarily algorithm swaps.

### Scenario 10 — "Users need both local and remote access through the same client shape"

**Question:** Sometimes an image is local, sometimes it is fetched remotely, but the client should treat both the same. Which pattern is worth considering?

**Pick:** [Proxy](structural/proxy/)

**Why pick it:** the proxy can stand in for the real subject, hide remoteness, lazy loading, or caching, and preserve the same client surface.

**Why not pick these instead:**
- **Adapter** — Adapter translates an incompatible interface. If the surface is already the same, translation is not the problem.
- **Decorator** — Decorator communicates optional behavior layering. Proxy communicates controlled or indirect access to the real thing.
- **Facade** — Facade is broader than a one-subject stand-in problem.

### Scenario 11 — "The same operation keeps getting added to a tree of syntax nodes"

**Question:** You have an AST with nodes like `Literal`, `BinaryExpression`, and `CallExpression`, and every few weeks you add a new traversal operation. Which pattern should you consider?

**Pick:** [Visitor](behavioral/visitor/)

**Why pick it:** the object structure is relatively stable, but the operations keep multiplying.

**Why not pick these instead:**
- **Iterator** — Iterator helps you walk the structure, but not organize many separate operations on it.
- **Composite** — Composite represents the tree shape. Visitor organizes operations over it.
- **Strategy** — Strategy swaps one algorithm behind one context, not many operations across many node types.

### Scenario 12 — "I have a lot of similar tiny objects and memory matters"

**Question:** A map editor has millions of tree tiles, and each tile repeats the same visual/type data while only location changes. Which pattern deserves a look?

**Pick:** [Flyweight](structural/flyweight/)

**Why pick it:** the pressure is separating intrinsic shared state from extrinsic contextual state to save memory.

**Why not pick these instead:**
- **Prototype** — Prototype clones objects; Flyweight minimizes how many heavy objects exist at all.
- **Singleton** — one global instance does not solve repeated lightweight instances.
- **Composite** — Composite handles tree structure, not memory sharing across many similar nodes.

### Scenario 13 — "The same collection should be traversable without exposing internals"

**Question:** You want client code to loop through a custom collection, but you do not want callers depending on its internal structure. Which pattern is relevant?

**Pick:** [Iterator](behavioral/iterator/)

**Why pick it:** the problem is controlled traversal, not transformation or coordination.

**Why not pick these instead:**
- **Visitor** — Visitor adds operations over a structure; Iterator gives a traversal mechanism.
- **Composite** — Composite organizes part-whole trees; Iterator handles walking the collection.
- **Facade** — Facade simplifies subsystem access, not element traversal.

### Scenario 14 — "Old and new APIs need to coexist during migration"

**Question:** A new service layer expects clean domain contracts, but a legacy dependency still speaks in awkward names and weird payloads. Which pattern is a great first move?

**Pick:** [Adapter](structural/adapter/)

**Why pick it:** translation buys you a seam so the new code depends on your language, not the legacy dependency's shape.

**Why not pick these instead:**
- **Facade** — Facade is broader. If the key need is shape translation at a boundary, Adapter is more exact.
- **Bridge** — Bridge would be overkill unless two hierarchies must vary independently.
- **Prototype** — cloning does not solve contract mismatch.

### Scenario 15 — "A class keeps changing because new reporting formats are requested"

**Question:** A reporting object now supports CSV, PDF, JSON, and XML exports, and format-specific logic is spreading through one class. What pattern should you ask about first?

**Pick:** usually [Strategy](behavioral/strategy/), sometimes [Template Method](behavioral/template-method/)

**Why pick Strategy first:** if whole export algorithms vary and you want composition, Strategy is usually the cleaner default.

**Why you might choose Template Method instead:** if the export sequence is fixed — gather data, transform, serialize, write — but a few steps vary, Template Method can fit.

**Why not pick these instead:**
- **Facade** — Facade might simplify generation for clients, but it does not organize the changing algorithm family.
- **Builder** — Builder is for construction, not behavior variation.
- **State** — report format is not usually a lifecycle mode.

### Scenario 16 — "Several UI widgets are tangled because they all talk to each other directly"

**Question:** A dialog has buttons, list panels, and filter chips, and every one of them knows too much about the others. Which pattern deserves attention?

**Pick:** [Mediator](behavioral/mediator/)

**Why pick it:** the main problem is peer-to-peer coordination sprawl. Mediator recenters that communication.

**Why not pick these instead:**
- **Observer** — Observer broadcasts change, but it is weaker when the system needs routed interaction and coordination logic.
- **Singleton** — a global coordinator often hides the problem rather than structuring it well.
- **Chain of Responsibility** — the shape is not a pipeline; it is mesh-like communication.

### Scenario 17 — "The product flow needs a tiny rule language"

**Question:** The business wants expressions like `country == "US" AND total > 100` to drive discount eligibility. Which pattern can be relevant, even if used sparingly?

**Pick:** [Interpreter](behavioral/interpreter/)

**Why pick it:** when the domain truly becomes a tiny language, Interpreter gives a way to model grammar and evaluation.

**Why not pick these instead:**
- **Strategy** — Strategy swaps algorithms; it does not model a language structure.
- **Command** — Command packages actions, not grammar rules.
- **Visitor** — Visitor may help process an AST, but Interpreter is the direct answer to the "tiny language" problem.

### Scenario 18 — "A subsystem should expose one obvious call for the 80% case"

**Question:** There are five lower-level services to generate and send an invoice, but most callers just want `sendInvoice(order)`. Which pattern is usually the best first answer?

**Pick:** [Facade](structural/facade/)

**Why pick it:** the complexity is legitimate, but most clients should not need to learn it.

**Why not pick these instead:**
- **Adapter** — the issue is not one incompatible API; it is too much subsystem knowledge leaking outward.
- **Proxy** — the pain is not controlled access to one subject.
- **Mediator** — the goal is simplification for clients, not coordination among peers.

## A good pattern-choice question to ask yourself

Before you pick a pattern, ask:

> "What would the code look like if I **didn't** use a pattern here?"

If the non-pattern version is still small, clear, and unlikely to change, do that.

If the non-pattern version immediately turns into:

- growing conditionals
- tangled dependencies
- repeated setup logic
- wrapper subclasses
- hidden lifecycle modes
- unclear object-to-object coordination

then you are probably looking at a real pattern-shaped problem rather than pattern tourism.
