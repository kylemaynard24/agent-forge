# Homework — Anti-Corruption Layers

> Translate between old and new models so each side keeps its own language.

## Exercise

Work through a small scenario involving a legacy billing model with names that poison newer code.

**Build:**
- one seam or safe boundary
- one behavior-preserving change
- a short next-step migration note

**Constraints:**
- you may not rewrite the whole system
- behavior must stay stable before structure gets prettier
- you must explain rollback or safe fallback

## Reflection

- What part of Anti-Corruption Layers felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Anti-Corruption Layers without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names + vocabulary isolation

The ACL translates between two vocabularies, and its method names should use the new system's vocabulary so callers never need to speak the legacy language. An ACL method named `getInvoiceFromLegacyBillingRecord` forces callers to understand the legacy concept; one named `getInvoice` keeps the legacy term inside the ACL where it belongs.

**Exercise:** Review the method names on your ACL. For each one that contains a legacy term — a name, concept, or field from the old system — rename it so only new-system vocabulary appears at the interface. Verify that after renaming, callers can be written using only the new vocabulary.

**Reflection:** If you removed the ACL tomorrow, would callers need to learn any legacy terminology to communicate directly with the old system? That gap between the two answers is the value your ACL's vocabulary isolation is providing.
