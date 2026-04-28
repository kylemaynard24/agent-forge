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

## What this family trains you to notice

Behavioral patterns sharpen your sense for **control flow as design**. Many messy systems are not messy because their data structures are wrong; they are messy because responsibility is scattered and the path from cause to effect is hard to follow. This family gives names to the main ways behavior can be moved, encapsulated, sequenced, broadcast, or coordinated.

If you study this family well, you'll start seeing hidden behavioral decisions everywhere: giant `if/else` ladders that want Strategy, callback tangles that want Observer or Mediator, undo requirements that want Command plus Memento, and workflows that want an explicit chain instead of ad hoc branching.

## A good comparison habit

When two behavioral patterns look similar, ask:

- who owns the next decision
- whether behavior changes by substitution, transition, or notification
- whether the pattern improves traceability or hides control flow
- what the simplest non-pattern solution would have been

## Scenario questions

### "I have giant conditionals choosing among algorithms"

**Likely pick:** **Strategy**

**Why pick it:** the variation is algorithmic, and the rest of the context should not branch on every case.

**Why not State:** State is for behavior that changes because the object moves through modes over time. Strategy is usually selected from outside.

### "The object's allowed behavior changes as it moves through a lifecycle"

**Likely pick:** **State**

**Why pick it:** the central pain is not choosing one algorithm once; it is making mode-dependent behavior and transitions explicit.

**Why not Strategy:** Strategy objects usually do not know about each other. State objects often do, because valid transitions matter.

### "One action should be queueable, replayable, and undoable"

**Likely pick:** **Command**

**Why pick it:** the request itself needs to become an object.

**Why not Chain of Responsibility:** CoR is about passing a request along handlers. Command is about representing the request as a first-class thing.

### "One object changes and many others must react"

**Likely pick:** **Observer**

**Why pick it:** the shape is one-to-many notification.

**Why not Mediator:** Mediator shines when many peers talk through a hub. Observer is simpler and clearer when the flow is subject → subscribers.

### "Too many peers know too much about each other"

**Likely pick:** **Mediator**

**Why pick it:** it recenters coordination logic into one place instead of letting knowledge spread across every participant.

**Why not Observer:** Observer broadcasts change. Mediator routes and coordinates intentional interactions between peers.

### "I need a processing pipeline where handlers may pass or handle"

**Likely pick:** **Chain of Responsibility**

**Why pick it:** each handler gets a chance, and the chain shape itself is the point.

**Why not Template Method:** Template Method fixes the algorithm skeleton in a base class. CoR keeps the pipeline open-ended and composable.

### "I need a skeleton algorithm with overridable steps"

**Likely pick:** **Template Method**

**Why pick it:** the overall sequence is stable, but some steps vary by subtype.

**Why not Strategy:** Strategy uses composition and swaps whole behaviors more freely. Template Method is an inheritance-based answer when the algorithm skeleton itself should stay fixed.

### "I need to walk a custom collection without revealing its storage"

**Likely pick:** **Iterator**

**Why pick it:** traversal is the pressure, not the operation performed at each step.

**Why not Visitor:** Visitor adds operations over a structure; Iterator provides the walking mechanism.

### "The same object graph keeps getting new analysis passes"

**Likely pick:** **Visitor**

**Why pick it:** the structure is stable but the operations keep multiplying.

**Why not Iterator:** Iterator helps traversal, but Visitor organizes many operations across node types.

### "One user action should be logged now and replayed later"

**Likely pick:** **Command**

**Why pick it:** the action itself must become a durable, serializable, queueable thing.

**Why not Strategy:** this is not about picking an algorithm family; it is about representing a request as an object.

### "A workflow should stop as soon as one handler can answer"

**Likely pick:** **Chain of Responsibility**

**Why pick it:** the chain shape captures "try one, else next" directly.

**Why not Observer:** Observer broadcasts to many listeners; it does not model short-circuit handling.

### "A wizard screen changes available buttons depending on its internal stage"

**Likely pick:** **State**

**Why pick it:** the object's behavior changes because of internal mode, and transitions between stages matter.

**Why not Template Method:** Template Method fixes one algorithm skeleton. State organizes changing behavior across lifecycle modes.

### "A pricing or ranking algorithm should be swappable by configuration"

**Likely pick:** **Strategy**

**Why pick it:** the algorithm variation is explicit and externally chosen.

**Why not State:** there is no internal lifecycle story here; the change is policy selection.

### "An event source should notify many optional listeners without knowing them"

**Likely pick:** **Observer**

**Why pick it:** decoupled one-to-many notification is the exact shape.

**Why not Mediator:** if the source should simply publish change and not coordinate peer interactions, Observer is lighter and clearer.

### "A team wants undo, but reversing operations directly is painful"

**Likely pick:** **Command** with possible help from **Memento**

**Why pick it:** if inverse operations are messy, snapshot-based restore may be easier than perfect reverse commands.

**Why not Memento alone:** Memento preserves state; Command often still provides the user-action unit and history semantics.

### "A base workflow is fixed, but region-specific policy tweaks only affect a few steps"

**Likely pick:** **Template Method**

**Why pick it:** the algorithm skeleton is stable while small steps vary in controlled places.

**Why not Strategy:** Strategy would work, but if the sequence itself is fixed and inheritance is already the local pattern, Template Method may be more direct.

### "The system needs a tiny expression language for filtering or rules"

**Likely pick:** **Interpreter**

**Why pick it:** the moment you are really modeling grammar and evaluation, Interpreter enters the discussion.

**Why not Command:** commands model executable requests, not language structure.

### "A group of controls should coordinate through one central object instead of direct chatter"

**Likely pick:** **Mediator**

**Why pick it:** central coordination reduces peer-to-peer knowledge spread.

**Why not Observer:** Observer is better for broadcast change. Mediator is better for routed, intentional interaction.

### "You need to add a reporting or validation pass over an existing tree without editing every node class"

**Likely pick:** **Visitor**

**Why pick it:** the new operation should live outside the node classes.

**Why not Composite:** Composite gives you the tree shape. Visitor gives you the externally added operation over that shape.

## Why you would not pick a behavioral pattern

Behavioral patterns are easy to overuse because they can feel like "clean architecture for every branch." Don't add them when:

- one `if` is still readable
- the behavior is not expected to vary
- the coordination is simple and local
- the history or undo need is hypothetical

They are strongest when the flow of responsibility has become the real source of complexity.
