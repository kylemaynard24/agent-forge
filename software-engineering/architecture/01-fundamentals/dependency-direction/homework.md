# Homework — Dependency Direction

> Stable things should not depend on volatile things. Make the wiring obey.

## Exercise: Reverse a bad dependency

**Scenario:** Your codebase has `BillingPolicy` (the high-level rule: "charge subscribers monthly, retry failures 3x") that imports `StripeClient` directly:

```js
import { StripeClient } from './integrations/stripe.js';
class BillingPolicy { run() { new StripeClient().charge(...) } }
```

This means: tests need Stripe; switching to Adyen requires editing BillingPolicy; Stripe SDK changes ripple into business logic. **Reverse the arrow.**

**Build:**
- A `PaymentGateway` interface (in JS, document the contract in a comment block).
- A `StripeGateway` implementation that adapts the Stripe SDK to the interface.
- A `FakeGateway` for tests.
- Refactor `BillingPolicy` to take a `PaymentGateway` via constructor.

**Constraints (these enforce the concept):**
- `BillingPolicy.js` must NOT contain the word `Stripe`.
- The interface must live with the policy (the high-level module owns its abstractions).
- Tests for `BillingPolicy` must not import any HTTP, DB, or Stripe code.
- Adding an Adyen impl requires zero edits to `BillingPolicy`.

## Stretch
Map your dependency graph as a directed graph. Find any cycles. There should be none. (Cycles = "A depends on B depends on A" = neither can be tested or shipped without the other.)

## Reflection
- Why does putting the interface near the policy feel weird at first? (Hint: most tutorials put interfaces in a separate `/interfaces` folder, which is wrong — it's not a layer.)
- What's the runtime cost of this indirection? Is it ever measurable?

## Done when
- [ ] `grep -r 'Stripe' src/billing/` returns nothing.
- [ ] Your billing tests run with no network and no SDK.
- [ ] You can articulate the difference between "import depends on" and "calls at runtime."
