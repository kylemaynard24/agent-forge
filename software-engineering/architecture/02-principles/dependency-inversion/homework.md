# Homework — Dependency Inversion

> Make business logic depend on interfaces, not vendors.

## Exercise: Free your billing code from Stripe

**Scenario:** `MonthlyBilling.run()` directly imports and constructs `StripeClient`. Tests need network. Switching to Adyen for EU customers is "two weeks of work" because the SDK calls are sprinkled through the policy.

**Build:**
- A `PaymentGateway` interface (define the contract in a comment block in JS).
- A `StripeGateway` adapter that implements the interface against the Stripe SDK.
- An `AdyenGateway` adapter (stub it).
- Refactor `MonthlyBilling` to take a `PaymentGateway` via constructor.

**Constraints (these enforce the concept):**
- `MonthlyBilling.js` must contain neither "Stripe" nor "Adyen."
- The interface lives next to the policy, not in a separate `interfaces/` folder.
- A unit test of `MonthlyBilling` must not hit any network or instantiate any SDK.
- Region-routing logic ("EU customers go to Adyen") lives in **wiring**, not in the policy.

## Stretch
Add a `RetryGateway` decorator that wraps any `PaymentGateway` and retries transient failures. Compose it: `new RetryGateway(new StripeGateway(...))`. The policy doesn't know retries are happening.

## Reflection
- DIP says "depend on abstractions." Abstractions live near *whom* — the high-level policy, or the low-level module? Why does that matter?
- DIP and OCP often arrive together. Why? (Hint: both rest on polymorphism through abstraction.)

## Done when
- [ ] `grep -ri 'Stripe\|Adyen' src/billing/policy/` returns nothing.
- [ ] Tests of `MonthlyBilling` run with no network, no SDK init.
- [ ] You can swap region routing without editing the policy.

---

## Clean Code Lens

**Principle in focus:** Name Things from the Reader's Perspective (specifically: the high-level module's perspective)

DIP inverts the dependency *and* the naming authority: the interface lives with the policy, so its name should be chosen by the policy's author, not the infrastructure author. `PaymentGateway` names a *billing concept*; `StripeChargeExecutor` names an *infrastructure concept* — and if the latter bleeds into the policy layer, the inversion was structural but not semantic.

**Exercise:** Read your `PaymentGateway` interface aloud as if you're a billing domain expert who has never heard of Stripe or Adyen. Does every method name and parameter name make immediate sense in that context? Identify any parameter named after a vendor concept (e.g., `paymentIntentId`, `chargeToken`) and rename it to the billing concept it actually represents (e.g., `transactionId`, `chargeReference`).

**Reflection:** The `RetryGateway` decorator from the stretch exercise wraps another `PaymentGateway` — so both the decorator and the wrapped implementation share the same interface name. Does this naming feel right, and what does it reveal about how DIP enables behavior composition without the policy ever knowing?
