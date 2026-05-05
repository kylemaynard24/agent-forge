# Homework — Behavior Preservation

> Protect existing behavior while cleaning internals so trust is not lost.

## Exercise

Work through a small scenario involving a cleanup where users should notice nothing except fewer bugs later.

**Build:**
- one seam or safe boundary
- one behavior-preserving change
- a short next-step migration note

**Constraints:**
- you may not rewrite the whole system
- behavior must stay stable before structure gets prettier
- you must explain rollback or safe fallback

## Reflection

- What part of Behavior Preservation felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Behavior Preservation without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Expressive code + the "reads better" standard

A behavior-preserving refactor should produce a diff where the intent is clearer, not just the structure different. The clean code test is "does this read better than before?" — if the answer requires explaining why the new structure is better, the names and organization have not yet done their job.

**Exercise:** After your behavior-preserving refactor, read the before and after versions side by side and write one sentence for each that describes what the code is doing in plain language. If the after sentence is not noticeably clearer than the before sentence, identify which name or structural choice is still obscuring the intent.

**Reflection:** Could you hand the refactored code to a developer who had never seen the original and have them describe the behavior accurately — without needing you to explain what changed?
