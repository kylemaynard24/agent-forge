# Homework — State

> Let an object change its behavior when its internal state changes — by swapping the state object.

## Exercise: Vending machine

**Scenario:** Model a vending machine with states `Idle`, `HasMoney`, `Dispensing`, `OutOfStock`. Inputs: `insertCoin`, `selectItem`, `dispense`, `refill`.

**Build:**
- A `VendingMachine` that holds a reference to a current `State`.
- Four state classes, each with the four input methods.
- Each state's methods either do something + transition, or reject (illegal-in-this-state).

**Constraints (these enforce the pattern):**
- Transition logic lives inside the state classes — the machine just forwards inputs to its current state.
- The `VendingMachine` has zero `if (this.state === ...)` chains.
- Each state class encodes only the legal transitions out of itself.

## Stretch

Make illegal transitions **literally inexpressible**: e.g., `Idle` should not even have a `dispense` method, so calling it is a TypeError. Decide whether you want safety-by-typing or safety-by-runtime-rejection — defend the choice.

## Reflection

- State vs Strategy: same structure (object holds a behavior reference and delegates), different intent. What's the difference?

## Done when

- [ ] A clean coin → select → dispense flow works.
- [ ] Inserting a coin while dispensing is rejected with a clear reason.
- [ ] Restocking from `OutOfStock` returns to `Idle`.
