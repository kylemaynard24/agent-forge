# Homework — Open/Closed

> Add behavior by writing new code, not editing existing code.

## Exercise: Pluggable order discounts

**Scenario:** `applyDiscount(order, type)` has branches for `'STUDENT'`, `'SENIOR'`, `'BLACK_FRIDAY'`, `'EMPLOYEE'`. Each new promo adds another branch. Marketing wants to add `BUNDLE_DEAL` and `LOYALTY_TIER_3`. The function has had three regression bugs in the past quarter.

**Build:**
- Define a `Discount` interface with `apply(order) → DiscountResult`.
- Move each existing discount into its own class.
- A `Checkout` that takes one or more discounts and applies them in order.

**Constraints (these enforce the concept):**
- Adding `BUNDLE_DEAL` is **one new file with zero edits** to existing files.
- The `Checkout` class never references a discount by name.
- Discounts don't know about each other.
- No `switch` or `if (type === ...)` chain anywhere in the final code.

## Stretch
What if two discounts apply at once? Decide and document a stacking rule (highest single? sum? first-match? best-of?). Make sure your code enforces it.

## Reflection
- OCP can become absurd: a plugin system for one plugin. What's your test for "is this OCP earning its keep?"
- Could you achieve the same result with first-class functions instead of classes? Compare.

## Done when
- [ ] `BUNDLE_DEAL` is added without touching any existing file except by import.
- [ ] No `if (type === ...)` chain remains.
- [ ] You can explain why OCP without polymorphism is just wishful thinking.
