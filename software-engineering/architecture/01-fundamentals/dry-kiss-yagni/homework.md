# Homework — DRY / KISS / YAGNI

> Three principles, often misapplied. Show that you can tell them apart.

## Exercise 1: Identify which principle each violation breaks

For each scenario, name the principle being misapplied and the fix:

1. A teammate proposes building an "abstract event handler factory builder" for a feature with three known event types and no plans for more.
2. The same magic discount percentage (`0.07`) appears hardcoded in the cart, the checkout summary, and the email receipt.
3. A simple `formatDate` was rewritten as a chain of curried functor combinators "for elegance." It's now five files.
4. Two functions both loop over orders and compute totals, but one is for *invoiced* orders (taxed) and the other is for *trial* orders (not taxed). A teammate wants to merge them via a `taxed: boolean` flag.
5. The auth module has `try/catch` removed because "we don't need error handling yet — happy path only."

(Some have multiple right answers. Defend the one you pick.)

## Exercise 2: Unwind a wrong-DRY abstraction

**Scenario:** You inherit a `processRecord(record, opts)` function used in 11 callers. It takes 7 boolean flags. Every quarter, someone adds a new flag because two callers diverged.

**Build:**
- Read the function. List which callers use which flags.
- For each major branch in the function, decide: is this *one rule with parameters*, or *two rules wearing the same costume*?
- Split the function into 2–4 named functions, each handling one cohesive case. Update callers.

**Constraints:**
- After the refactor, no function takes more than 2 boolean flags.
- Every named function's name describes a real business operation, not a shape (`processRecord_typeA` is not allowed).
- You may duplicate up to 5 lines across the new functions if it makes their meaning clearer. That is **fine.**

## Reflection
- "Three strikes and refactor": why three? What goes wrong at one or two?
- When is YAGNI the wrong principle to invoke? (Hint: at security boundaries, observability, and migration paths — you usually *do* need that.)

## Done when
- [ ] You can articulate the difference between "code duplication" and "knowledge duplication" in one sentence.
- [ ] Refactored `processRecord` callers each call a function whose name they trust.
- [ ] No function in the refactor has 7 booleans.
