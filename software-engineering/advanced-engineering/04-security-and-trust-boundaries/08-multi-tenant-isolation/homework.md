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
