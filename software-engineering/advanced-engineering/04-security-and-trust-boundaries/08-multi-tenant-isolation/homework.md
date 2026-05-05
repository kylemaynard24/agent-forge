# Homework — Multi-tenant Isolation

> Make tenant boundaries explicit in both code and data access.

## Exercise

Work through a small scenario involving an admin tool that was built for one customer and then reused for many.

**Build:**
- a named trust boundary
- one protective control
- a note on residual risk

**Constraints:**
- you must distinguish what is trusted from what is merely present
- you must state one accepted risk explicitly
- the control has to match the boundary, not just the feature

## Reflection

- What part of Multi-tenant Isolation felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Multi-tenant Isolation without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names + making scope explicit

In a multi-tenant system, a bare `userId` is ambiguous — it does not say whose user, relative to which tenant. Encoding tenant scope in names or types (`tenantScopedUserId`, `TenantContext.userId`) makes cross-tenant data leaks visible as a naming inconsistency: any function receiving a plain `userId` where a scoped one is expected becomes a red flag at read time.

**Exercise:** Introduce a naming convention or wrapper type in your scenario that encodes tenant scope, then trace through one data access path to confirm that a developer using an unscoped ID where a scoped one is required would produce a type mismatch or an obviously wrong name that reviewers would catch.

**Reflection:** If a developer accidentally passes one tenant's `userId` into a data access function scoped to a different tenant, would anything in the names or types make that mistake visible before the code runs?
