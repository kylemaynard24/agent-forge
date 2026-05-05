# Homework — Saga

> Apply compensating transactions. The **constraints** are the point.

## Exercise: Order-fulfillment saga

**Scenario:** Placing an order requires four steps across services: reserve inventory, charge payment, allocate shipping label, send confirmation email. Any step can fail.

**Build:**
- Four service stubs, each with `do` and `undo` operations and configurable failure injection.
- A saga orchestrator that runs steps in order and runs compensations in **reverse** order on failure.
- An idempotency check on every operation: calling `reserve(orderId)` twice must not double-reserve.
- A run log that prints every step, every compensation, and every retry.

**Constraints (these enforce the concept):**
- No step may share state with another step except via the saga's own context.
- Compensations must run in **reverse** order of completed steps. Enforce this with a stack.
- A compensation that fails must be retried — the system cannot give up and leave money/inventory leaked.
- The "send email" step is non-compensatable (you cannot un-send an email). Decide where it must go in the order and defend the choice.

## Stretch
- Convert the orchestrated saga into a **choreographed** version: each service listens to events and reacts. Which is easier to reason about?
- Inject a failure during compensation. How does the system recover?

## Reflection
- A real charge succeeded but the inventory reservation expired before the charge confirmation arrived. What does compensation look like, and what is the customer-visible artifact?

## Done when
- [ ] Happy path: all 4 steps succeed; no compensations run.
- [ ] Failure at step 3 triggers compensation of steps 2 and 1 in reverse.
- [ ] Calling the saga twice with the same order ID does not double anything.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names — saga step and compensation names reveal domain intent

A step named `step3` or `allocate()` hides what domain action is being taken; `AllocateShippingLabel` is unambiguous in the run log and the compensation name `VoidShippingLabel` immediately communicates what is being undone and why. When a saga fails at 3am, the on-call engineer reads the run log — clean step names turn a fifteen-minute incident into a two-minute diagnosis.

**Exercise:** Review your four `do`/`undo` operation pairs and apply the rule: the `undo` name must make the `do` name obvious without looking at the code (e.g., `ReserveInventory` / `ReleaseInventoryReservation`). Rename any pair where the compensation name could be confused with a different step's undo.

**Reflection:** If the run log showed `step2 compensation failed` versus `ChargePayment compensation failed — RefundPayment`, which would an on-call engineer be able to act on without reading the source code?
