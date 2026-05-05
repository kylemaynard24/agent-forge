# Homework — Legacy Rescue and Refactoring

> Create one safe seam, then move through it.

## Exercise: Modernize one ugly slice

**Scenario:** You have an older service with a large function, hidden dependencies, and inconsistent naming. Everyone wants it cleaner, but nobody trusts a big rewrite.

**Build:**
- A dependency map of the ugly slice
- One adapter, seam, or wrapper that creates a safer boundary
- One behavior-preserving refactor behind that seam
- A rollback note describing how you would back out the change

**Constraints:**
- You may not rewrite the whole module
- You must preserve behavior before improving structure
- At least one change must reduce coupling, not just improve style
- You must state what remains ugly and why you are leaving it alone for now

## Stretch

Sketch a strangler-style migration plan for the next two seams after the one you implemented.

## Reflection

- What part of the old system was carrying hidden knowledge?
- What did the seam make easier to test or reason about?
- Why would a rewrite have been riskier here?

## Done when

- [ ] New code depends on the seam, not directly on the old mess
- [ ] Existing behavior is preserved
- [ ] You can name the next safe move without promising a total rewrite

---

## Clean Code Lens

**Principle in focus:** Expressive code + incremental improvement

Refactoring is the act of applying clean code principles to existing code — the goal is not just to make the system work, but to make its intent legible to the next person who reads it. A behavior-preserving refactor that leaves the code harder to understand has achieved nothing; the test is whether a reader can now see why the code does what it does.

**Exercise:** After completing your refactor, read the changed code aloud as if explaining it to a colleague. Note any sentence where you have to say "it actually means..." or "what this is really doing is..." — each of those is a signal the names or structure still need work.

**Reflection:** Did the refactor make the intent of the code clearer, or did it only make the structure different? How would you tell the difference?
