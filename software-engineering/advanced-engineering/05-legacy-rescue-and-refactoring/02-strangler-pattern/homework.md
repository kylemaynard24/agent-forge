# Homework — Strangler Pattern

> Replace old behavior incrementally while the old system keeps serving.

## Exercise

Work through a small scenario involving a monolith endpoint being moved behind a newer façade.

**Build:**
- one seam or safe boundary
- one behavior-preserving change
- a short next-step migration note

**Constraints:**
- you may not rewrite the whole system
- behavior must stay stable before structure gets prettier
- you must explain rollback or safe fallback

## Reflection

- What part of Strangler Pattern felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Strangler Pattern without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible
