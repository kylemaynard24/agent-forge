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
