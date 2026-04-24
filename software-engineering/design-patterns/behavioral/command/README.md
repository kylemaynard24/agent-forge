# Command

**Category:** Behavioral

## Intent

Encapsulate a request as an **object**. Doing so lets you parameterize clients with different requests, queue or log requests, and support **undoable** operations.

## When to use

- You need **undo/redo** (every command records how to reverse itself).
- You want to queue, schedule, or log operations.
- You want a "transactional" or "macro" grouping of actions.
- You want to decouple the thing triggering an action (menu, button, keystroke) from the thing performing it.

## Structure

```
Client  creates  ──►  Command (execute, undo)
                        │
                        ├── ConcreteCommandA
                        └── ConcreteCommandB

Invoker  holds queue / history  ──►  Command.execute()
Receiver  is what the command actually manipulates
```

## Trade-offs

**Pros**
- First-class operations — queue them, log them, reverse them
- Undo/redo falls out naturally
- Decouples sender (button) from receiver (document)

**Cons**
- More classes — one per operation
- Undo requires careful state capture (often paired with [Memento](../memento/))

## Command vs. Strategy

Both wrap behavior in objects. Intent differs:
- **Strategy** — *interchangeable algorithms* for one operation
- **Command** — *a specific operation* wrapped so it can be queued/logged/undone

## Real-world analogies

- Menu items in an editor.
- Macros — recorded sequences of operations.
- Database transactions — wrapped in a log, replayable.

## Run the demo

```bash
node demo.js
```

Demonstrates a tiny text editor with `AppendCommand` and `DeleteCommand`. Each command's `execute()` changes the editor; its `undo()` reverses it. A history stack enables multi-step undo and redo.
