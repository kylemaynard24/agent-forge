# Homework — Memento

> Capture and restore an object's internal state without violating encapsulation.

## Exercise: Text editor with undo

**Scenario:** Build a text editor with undo. State = `{text, cursor, selection}`. The editor exposes `save()` (returning a memento) and `restore(memento)` — but the memento must be opaque.

**Build:**
- An `Editor` with `type(s)`, `moveCursor(pos)`, `select(start, end)`, `save() → Memento`, `restore(memento)`.
- A `Memento` class whose internals are inaccessible to anything except `Editor`.
- A `History` (caretaker) that holds mementos but cannot read or mutate them.

**Constraints (these enforce the pattern):**
- The caretaker can store the memento and hand it back, but cannot read its fields.
- Test: any attempt to read `.text` on a memento from outside `Editor` must fail (or return undefined).
- `restore()` must put the editor back in **exactly** the saved state — not a "close enough" reconstruction.

## Stretch

Cap history at 50 states with a ring buffer. Verify older states are eligible for GC after they fall off (set them to `null` and rely on weak refs if your runtime supports them).

## Reflection

- The "wide" interface lets the originator see all the memento's internals; the "narrow" interface gives the caretaker nothing. Why this asymmetry?

## Done when

- [ ] Saving, typing more, then restoring returns to the exact prior state.
- [ ] Caretaker code that tries to peek at memento internals fails (or returns nothing useful).
