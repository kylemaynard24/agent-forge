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

---

## Clean Code Lens

**Principle in focus:** Meaningful names + no legacy vocabulary pollution

The strangler pattern works incrementally, but each strangled component carries a naming debt if it keeps the legacy name after the design has changed. A new clean implementation named after the old thing (`LegacyOrderProcessor` renamed to `OrderProcessor` without the design change the rename implies) misleads readers about what the code actually does.

**Exercise:** For the component you strangled in your scenario, write out both the legacy name and the name that accurately reflects the new design. If they are the same, check whether the new design actually deserves a different name — if the design changed, the name should too.

**Reflection:** If you kept the legacy name on the new implementation, what assumption would a future developer make about the code that would be incorrect — and how long before they discovered the mismatch?
