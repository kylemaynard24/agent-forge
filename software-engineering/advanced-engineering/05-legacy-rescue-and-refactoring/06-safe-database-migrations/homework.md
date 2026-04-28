# Homework — Safe Database Migrations

> Change data shape without betting the release on one irreversible step.

## Exercise

Work through a small scenario involving a table split or column rename on a live system.

**Build:**
- one seam or safe boundary
- one behavior-preserving change
- a short next-step migration note

**Constraints:**
- you may not rewrite the whole system
- behavior must stay stable before structure gets prettier
- you must explain rollback or safe fallback

## Reflection

- What part of Safe Database Migrations felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Safe Database Migrations without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible
