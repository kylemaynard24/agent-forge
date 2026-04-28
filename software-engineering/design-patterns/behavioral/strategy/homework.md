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
