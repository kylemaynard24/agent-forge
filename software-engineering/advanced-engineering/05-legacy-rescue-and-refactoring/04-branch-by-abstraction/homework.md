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

---

## Clean Code Lens

**Principle in focus:** Meaningful names + naming under uncertainty

The abstraction introduced for branch-by-abstraction needs a name that will survive both the old and new implementations — naming it too early after the new implementation (`NewPaymentProcessor`) creates a name that becomes wrong as soon as the migration is complete. A name that describes the role rather than the current implementation (`PaymentProcessor`) ages better across both sides of the branch.

**Exercise:** Write down the name you chose for your abstraction layer, then ask: does this name describe the role the abstraction plays, or does it describe one of its implementations? If it describes an implementation, rename it to describe the role and confirm it reads naturally with both the old and new implementations plugged in.

**Reflection:** When the migration is finished and the old implementation is deleted, will your abstraction's name still be accurate — or will it carry a hint of the migration history that future readers will find confusing?
