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

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Single Responsibility Principle

A command's name is a verb phrase that describes the action from the user's perspective — `DrawCircle`, `MoveSelection`, `DeleteShape` — not an implementation label like `Command2`. Applied cleanly, the command history log reads like a readable audit trail of user intent; applied messily, `undo()` logic bleeds into the `History` or `Canvas`, making it impossible to answer "what does undoing this specific action mean?" without tracing across multiple files.

**Exercise:** Write out your `History` stack after a three-step sequence as a list of command names. Read it aloud — if it sounds like a story of what the user did, the names are clean. If it sounds like machine output, rename until it reads naturally.

**Reflection:** If the `undo()` logic for `MoveSelection` lived in the `History` class instead of the command itself, what would have to change in `History` every time you added a new command type — and what does that tell you about where responsibility belongs?
