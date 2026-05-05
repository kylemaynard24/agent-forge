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

---

## Clean Code Lens

**Principle in focus:** Interface Segregation Principle + Minimal Surface Area

The memento's clean-code discipline is about making the interface as narrow as it can possibly be — the caretaker's view of the memento should be so thin that there is literally nothing to misuse. Applied cleanly, the `Memento` type exposed to the caretaker is an opaque token: no readable fields, no methods beyond identity — the caretaker can only store it and return it. Applied messily, a memento that exposes `.text` or `.cursor` as readable properties invites the caretaker to start reasoning about history by content rather than by position, coupling it to the editor's internal model.

**Exercise:** Write the narrowest possible TypeScript (or JSDoc) type for what the `History` class is allowed to see on a `Memento`. It should have zero readable domain fields. If you find yourself adding a `label` or `timestamp` for display purposes, put those on a wrapper that `History` owns — not on the memento itself.

**Reflection:** The "wide" interface lets the originator see everything, the "narrow" interface lets the caretaker see nothing — this asymmetry is intentional. If you later need to add a `previewText` to show in an undo menu, where does that state live, and why does that answer preserve the memento's encapsulation guarantee?
