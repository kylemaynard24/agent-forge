# Homework — Single Responsibility

> One class, one reason to change. Find the actors.

## Exercise: Untangle an Order god-class

**Scenario:** An `Order` class with: `validate`, `persist`, `sendConfirmationEmail`, `generateInvoice`, `computeShippingLabel`, `refund`, `exportToTaxSystem`. Each method serves a different stakeholder.

**Build:**
- For each method, name the **actor** (stakeholder/department) who would request a change to it.
- Group methods by actor.
- Split into single-actor classes/modules. Keep `Order` as a plain value type holding data.
- An orchestrator at the edge wires them together.

**Constraints (these enforce the concept):**
- Each new class must be describable in an *and*-free sentence.
- `Order` itself has zero behavior — it's pure data.
- Tests can target one new class without spinning up the others.
- No new class has more than 5 public methods.

## Stretch
Pick TWO responsibilities that you intentionally keep together (despite SRP) and defend why — usually because the invariant requires the data and the rule to be co-located. SRP is a default, not a law.

## Reflection
- SRP and encapsulation can fight: enforcing an invariant on `balance` wants the rule next to the data, but the audit-log requirement wants the rule elsewhere. How do you decide?
- "Reason to change" is fuzzy. What's a sharper test? (Hint: who's the human asking for the change?)

## Done when
- [ ] Each class has one stakeholder.
- [ ] No method's name surprises you given the class name.
- [ ] You've articulated one place SRP would have been wrong, and why.
