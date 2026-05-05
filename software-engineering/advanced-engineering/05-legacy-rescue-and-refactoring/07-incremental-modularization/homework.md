# Homework — Incremental Modularization

> Carve clearer module boundaries out of an overgrown codebase.

## Exercise

Work through a small scenario involving a codebase whose folders no longer match actual responsibilities.

**Build:**
- one seam or safe boundary
- one behavior-preserving change
- a short next-step migration note

**Constraints:**
- you may not rewrite the whole system
- behavior must stay stable before structure gets prettier
- you must explain rollback or safe fallback

## Reflection

- What part of Incremental Modularization felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Incremental Modularization without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names + bounded context alignment

Module names after incremental modularization should reflect the bounded contexts you discovered through the work, not the file structure you started with. A folder renamed from `services/billing` to `billing-domain` signals that a bounded context was found; keeping the old name after the modularization is complete means the conceptual discovery was made but not communicated.

**Exercise:** After modularizing your scenario, list the new module names alongside the old folder or file names they replaced. For each pair, state whether the new name reflects a bounded context (a coherent business concept) or still reflects the original file organization. Rename any that still describe structure rather than concept.

**Reflection:** If a developer new to the codebase read only your module names, would they understand the business domains the system covers — or would they see a technical filing system?
