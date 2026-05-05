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

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Single Responsibility Principle

The state class name is a precise claim about what machine condition is active — `HasMoney` is more honest than `State2` or `WaitingState` because it names the distinguishing fact, not a position in a sequence. Applied cleanly, opening any state class tells you immediately which machine behaviors are legal right now, because every method is either a valid action or an explicit rejection — and the class contains nothing else. Applied messily, a monolithic `VendingMachineState` with a `currentState` enum field and one large switch per method is structurally the same as having no State pattern at all.

**Exercise:** For each of your four state classes, write a one-sentence contract: "In this state, the machine guarantees X and rejects Y." If you can't write that sentence without mentioning another state's concerns, the class boundary is in the wrong place.

**Reflection:** The stretch goal asks whether illegal transitions should be inexpressible at the type level or caught at runtime — how does your answer to that question change the *names* you give to the state interface's methods?
