# Homework — Mutation Testing Mindset

> Ask whether your tests would catch plausible wrong implementations.

## Exercise

Work through a small scenario involving a helper function whose tests all pass even when logic is subtly inverted.

**Build:**
- one small verification target
- at least two different boundary choices
- a note explaining why one boundary is the better fit

**Constraints:**
- each check must answer one clear question
- at least one boundary choice must be justified in writing
- you must name one low-value test idea and reject it

## Reflection

- What part of Mutation Testing Mindset felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Mutation Testing Mindset without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Tests as specification, reveal intent, name what you verify

A surviving mutant is a gap in your specification, and naming the behavior you expected to catch makes those gaps deliberate and visible rather than accidental. The clean code discipline of writing tests that say what they verify — not just that they run — directly determines your mutation score: a test named `discountIsAppliedBeforeTax` will catch a mutant that reorders the operations; a test named `testDiscount` probably will not.

**Exercise:** For the helper function scenario in this homework, manually introduce three plausible mutations (e.g., flip a comparison operator, swap the order of two operations, change a boundary value by one). For each mutation, identify which existing test should kill it and write a test name that makes the targeted behavior explicit. If no existing test kills the mutant, write the missing test name and its assertion before writing its implementation.

**Reflection:** In a function you tested recently, could you list the specific behaviors your tests verify by reading only the test names — and would that list cover every mutant you would be embarrassed to ship?
