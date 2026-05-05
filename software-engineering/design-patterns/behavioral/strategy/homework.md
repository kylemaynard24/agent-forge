# Homework — Strategy

> Encapsulate interchangeable algorithms behind a common interface.

## Exercise: Pluggable cart pricing

**Scenario:** A `Cart` computes its total via a `PricingStrategy`. Strategies: `Regular`, `BlackFriday` (20% off everything), `LoyaltyMember` (free shipping + 10% off).

**Build:**
- A `PricingStrategy` interface with `price(cart) → {subtotal, shipping, discount, total}`.
- Three strategies.
- A `Cart` with `addItem`, `setStrategy(strategy)`, `total()` — where `total()` delegates to the strategy.

**Constraints (these enforce the pattern):**
- The cart never branches on which strategy it's using.
- Adding a fourth strategy requires zero edits to `Cart`.
- The strategies don't know about each other; they don't share base classes for behavior, only for the interface.

## Stretch

Combine two strategies (`LoyaltyMember + BlackFriday`). Decide on a **principled** combinator — not "just multiply both discounts", because that's a tax/promo nightmare. Document your rule (e.g., apply highest single discount; never stack; promotions are "best of"; etc.).

## Reflection

- State and Strategy share the structural shape. The differences: who decides the swap (state self-transitions; strategy is set by the client), and what changes (state changes ongoing behavior; strategy is one-shot per call).

## Done when

- [ ] Same `Cart` with same items produces three different totals under three strategies.
- [ ] Adding a `StudentDiscount` strategy is a single new file.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Open/Closed Principle

A strategy's name is its entire specification to the reader of the context class — `BlackFridayPricingStrategy` tells you which algorithm is active at a glance; `Strategy2` or `DiscountStrategy` forces the reader to open the file to understand the policy being applied. Applied cleanly, the context class reads like a policy document ("this cart is priced under the `LoyaltyMemberPricingStrategy`") and adding a new strategy is literally additive — a new file with a new descriptive name, zero edits to existing code. Applied messily, strategy names so generic that callers pass flags or enums to control behavior inside a single "strategy" class defeat the pattern entirely.

**Exercise:** Read the `Cart.total()` method and its caller without looking at any strategy class. The strategy's name should tell you everything about the pricing rule being applied — if you feel compelled to open the strategy file to understand what `total()` will return, rename the strategy until the name is self-sufficient.

**Reflection:** Your `LoyaltyMemberPricingStrategy` and `BlackFridayPricingStrategy` are each correct in isolation — but the stretch goal asks what happens when both apply simultaneously. If your answer requires adding a conditional to `Cart`, the Open/Closed Principle has been violated; what design preserves it?
