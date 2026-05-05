# Homework — Snapshot Testing Trade-offs

> Use snapshots where output shape matters, and reject them where they become noise.

## Exercise

Work through a small scenario involving a renderer that changes often but should preserve high-level structure.

**Build:**
- one small verification target
- at least two different boundary choices
- a note explaining why one boundary is the better fit

**Constraints:**
- each check must answer one clear question
- at least one boundary choice must be justified in writing
- you must name one low-value test idea and reject it

## Reflection

- What part of Snapshot Testing Trade-offs felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Snapshot Testing Trade-offs without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, reveal intent, avoid noise

A snapshot file named `test.snap` or `__snapshots__/renderer.test.js.snap` with a key of `renders correctly 1` is the testing equivalent of a variable named `data` — it tells you a snapshot exists but not what structural contract it enforces. When snapshots inevitably drift, a poorly named one forces the reviewer to diff the entire blob to understand whether the change is intentional; a well-named one (`invoiceSummary_with_discount_shows_adjusted_total`) makes the review a two-second check.

**Exercise:** For the renderer scenario in this homework, define three snapshots with names that encode the component, the input state being rendered, and the structural guarantee being preserved. Then write the one-sentence review comment you would write when each snapshot is updated in a PR — if you cannot write a clear, specific comment from the name alone, rename the snapshot until you can.

**Reflection:** In a snapshot test suite you work with, could you look at the snapshot file names in a failing CI check and know, before opening a diff, whether the change is a bug or an expected update?
