# Homework — Authn vs Authz

> Separate identity proof from permission checks so access control stays honest.

## Exercise

Work through a small scenario involving an endpoint that checks login but not ownership.

**Build:**
- a named trust boundary
- one protective control
- a note on residual risk

**Constraints:**
- you must distinguish what is trusted from what is merely present
- you must state one accepted risk explicitly
- the control has to match the boundary, not just the feature

## Reflection

- What part of Authn vs Authz felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Authn vs Authz without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Separation of concerns + meaningful names

Authentication and authorization are separate concerns, and mixing them in one function or one ambiguous name (`checkAccess`) hides which check failed when something goes wrong. Clean code gives each concern its own named function — `verifyIdentity` and `authorizeAction` — so a failed check is immediately self-describing without needing to read the implementation.

**Exercise:** Write two wrapper functions for an endpoint — one named to make clear it proves identity, one named to make clear it grants permission — and deliberately call them in sequence so the separation is visible in the call site, not just the definitions.

**Reflection:** If an access-denied error is raised, can a reader tell from the function name alone whether it was an authentication failure or an authorization failure?
