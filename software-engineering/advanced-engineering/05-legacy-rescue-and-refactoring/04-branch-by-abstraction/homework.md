# Homework — Branch by Abstraction

> Introduce a stable abstraction first, then swap implementations behind it.

## Exercise

Work through a small scenario involving a core dependency that cannot be replaced in one cut.

**Build:**
- one seam or safe boundary
- one behavior-preserving change
- a short next-step migration note

**Constraints:**
- you may not rewrite the whole system
- behavior must stay stable before structure gets prettier
- you must explain rollback or safe fallback

## Reflection

- What part of Branch by Abstraction felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Branch by Abstraction without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible
