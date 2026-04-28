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
