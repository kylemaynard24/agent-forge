# Behavioral patterns

Behavioral patterns deal with **communication and responsibility** — the question of *"how do objects interact, and who owns which piece of the work?"*

They matter when:
- Multiple objects need to coordinate without tangling every class into every other class
- Algorithms should be swappable at runtime
- You want to decouple senders of messages from receivers
- You need to add operations to an object structure without modifying the objects

## The eleven patterns

| Pattern | In one line |
| --- | --- |
| [Chain of Responsibility](chain-of-responsibility/) | Pass a request along handlers until one handles it |
| [Command](command/) | Wrap an operation as an object so it can be queued, logged, or undone |
| [Interpreter](interpreter/) | Model a small language's grammar as classes and evaluate sentences |
| [Iterator](iterator/) | Walk a collection without exposing its internals |
| [Mediator](mediator/) | Route communication between peers through a central mediator |
| [Memento](memento/) | Snapshot and restore an object's state without breaking encapsulation |
| [Observer](observer/) | Notify subscribers automatically when a subject changes |
| [State](state/) | Change an object's behavior by swapping its state object |
| [Strategy](strategy/) | Swap algorithms behind a common interface |
| [Template Method](template-method/) | Define a skeleton in the base class, let subclasses fill specific steps |
| [Visitor](visitor/) | Separate an operation from the object structure it walks |

## How they relate

- **Strategy** vs. **Template Method** — Both let you vary an algorithm. Strategy uses *composition* (swap a strategy object). Template Method uses *inheritance* (override hook methods).
- **State** vs. **Strategy** — Structurally similar. The difference is intent: State's "strategies" know about each other and transition; Strategy's don't.
- **Command** vs. **Memento** — Often paired for undo. Command records the operation; Memento records the state before.
- **Observer** vs. **Mediator** — Both coordinate multiple objects. Observer is broadcast (subject → many observers). Mediator is hub-and-spoke (peers → mediator → peers).
- **Chain of Responsibility** vs. **Command** — CoR passes the request along a chain until something handles it. Command is about the request itself as a first-class object.
- **Visitor** vs. **Iterator** — Iterator traverses; Visitor *does something at each node*. Visitor lets you add new operations without modifying node classes.
