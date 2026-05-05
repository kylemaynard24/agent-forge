# Homework — Flyweight

> Share fine-grained objects to support large numbers efficiently.

## Exercise: Styled text editor

**Scenario:** Store 1,000,000 styled characters where each character has a style: `{font, size, color, bold, italic}`. Most characters share fewer than 50 distinct styles. Naive: 1M × 5 fields per char = wasteful.

**Build:**
- A `Style` (flyweight) with the five intrinsic style fields.
- A `StyleFactory` that returns the *same* `Style` instance for the same combination of fields.
- A `Character` (or just `{ char, style }` tuple) that holds the character plus a reference to a shared `Style`.
- A demo that creates 1,000,000 characters cycling through 20 styles, then measures memory before/after the optimization (use `process.memoryUsage()`).

**Constraints (these enforce the pattern):**
- The flyweight must be **immutable**. Two characters sharing a `Style` must not be able to mutate each other's appearance.
- The `StyleFactory` must guarantee structural uniqueness — `factory.get({font:'Arial',...})` and a second call with the same fields return the *same* JavaScript reference.
- Position (where the character is on screen) is **extrinsic** — it lives on the character, not the style.

## Stretch

Bold a 100-character range. The 100 characters' styles change to bolded variants — but unaffected characters (and the original Style instances) must remain shared.

## Reflection

- What is *intrinsic* vs *extrinsic* state, and why does Flyweight only share intrinsic?
- When is Flyweight a premature optimization?

## Done when

- [ ] Memory measurement shows >10x reduction vs naive.
- [ ] `factory.get(s) === factory.get(s)` for equal styles.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Separation of Concerns

The flyweight's central discipline is keeping intrinsic and extrinsic state strictly separated — and that discipline must be visible in the names. Applied cleanly, a variable named `sharedStyle` or `intrinsicStyle` announces that it is shared and immutable, while `charPosition` or `screenX` announces that it is per-instance; a reader can reconstruct the flyweight's memory model from the variable names alone. Applied messily, variables named `style`, `data`, or `props` on both the flyweight and the character force the reader to trace through the factory logic to understand which state is shared and which is contextual — the naming has hidden the pattern's key structural decision.

**Exercise:** Go through every field in your `Style` (flyweight) class and every field in your `Character` (context) structure and label each one explicitly: `// intrinsic — shared` or `// extrinsic — per-instance`. If any field's label surprises you or is ambiguous, either the name needs to change or the field is in the wrong place.

**Reflection:** The `StyleFactory` guarantees structural uniqueness — two calls with the same fields return the same reference. This guarantee is only useful because `Style` is immutable. What would happen to the naming convention and the invariant if you allowed callers to mutate a `Style` after retrieval, and why does immutability and the naming discipline reinforce each other here?
