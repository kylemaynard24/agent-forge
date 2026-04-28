# Homework — Command

> Encapsulate a request as an object, parameterizable, queueable, undoable.

## Exercise: Drawing app with undo/redo

**Scenario:** A small canvas-based drawing app supports `DrawCircle`, `DrawRect`, `Move`, `Delete`. The user can undo and redo any operation.

**Build:**
- A `Command` interface with `execute()` and `undo()`.
- A `Canvas` (the receiver) that the commands operate on.
- A `History` with `push(command)`, `undo()`, `redo()`.
- A `MacroCommand` that bundles a sequence of commands; `execute` runs them all, `undo` reverses them all atomically.

**Constraints (these enforce the pattern):**
- The canvas does NOT call commands — only commands call the canvas.
- `undo()` must be exact (no approximations); it must restore prior state.
- A failed step inside a `MacroCommand` rolls back successfully-executed steps.

## Stretch

Serialize the command log to JSON. On reload, replay the log to reconstruct the canvas. (Hint: include enough info per command to rebuild it from data.)

## Reflection

- Command introduces an object per operation. What's the cost? When is it worth it (undo, queueing, macros) and when isn't it?

## Done when

- [ ] Demo draws three shapes, undoes twice, redoes once, and the canvas state matches expectations.
- [ ] A macro of 3 draws can be undone in one step.
