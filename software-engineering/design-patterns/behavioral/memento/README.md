# Memento

**Category:** Behavioral

## Intent

Capture an object's internal state (into a **memento** object) so the object can be restored to that state later — without violating its encapsulation. The memento is a black box to everyone except the originator.

## When to use

- You need snapshots: undo/redo, checkpoints, "save game," editor history.
- You want to restore state without exposing internal fields as public API.
- You want to separate the *storage* of history (the caretaker) from the *thing being snapshotted* (the originator).

## Structure

```
Originator   ──►  save()     → Memento   (opaque)
             ◄──  restore(memento)

Caretaker    holds Memento[]  (doesn't inspect them, just stores)
```

Three roles:
- **Originator** — the object whose state you want to snapshot.
- **Memento** — the snapshot itself; opaque to outside code.
- **Caretaker** — keeps the mementos; requests save/restore on the originator.

## Trade-offs

**Pros**
- Keeps snapshotting logic inside the originator (encapsulation preserved)
- Separates storage (history) from the thing being tracked
- Clean pairing with [Command](../command/) for undo

**Cons**
- Mementos can be large — be careful with memory (full-state snapshots vs. diffs)
- Restoring might need to recreate transient state (e.g. event subscriptions)

## Real-world analogies

- **Save points in a game**
- **Editor undo stack** — each memento captures pre-change state
- **Database transactions' savepoints**

## Memento vs. Command (for undo)

- Command — *"I'll remember the action so I can reverse it."*
- Memento — *"I'll remember the state before so I can restore it."*

Memento is simpler when the action is hard to invert (or too many small actions to track). Command is cheaper when each action is easily reversible.

## Run the demo

```bash
node demo.js
```

Demonstrates a `TextEditor` originator with `save()` / `restore(memento)`, and a `History` caretaker that stacks mementos for unlimited undo/redo.
