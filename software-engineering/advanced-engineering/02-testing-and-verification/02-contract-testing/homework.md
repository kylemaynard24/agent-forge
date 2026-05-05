# Homework — Contract Testing

> Protect an interface between modules or services without booting the whole world.

## Exercise

Work through a small scenario involving a shipping service that must return an agreed response shape.

**Build:**
- one small verification target
- at least two different boundary choices
- a note explaining why one boundary is the better fit

**Constraints:**
- each check must answer one clear question
- at least one boundary choice must be justified in writing
- you must name one low-value test idea and reject it

## Reflection

- What part of Contract Testing felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Contract Testing without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, tests as documentation, reveal intent

A contract test is executable documentation of an interface agreement — its name should make the contract terms unambiguous to anyone who reads the test report without opening the source. `ConsumerCanCallGetShipmentByOrderId_WithValidOrderId_Returns200WithTrackingNumber` is more words, but it is a contract; `ContractTest1` is noise that tells you a test ran and nothing else.

**Exercise:** For the shipping service scenario, write the full test names for three consumer-side contract tests and two provider-side verification tests. Each name should encode: which consumer or provider is being verified, the specific endpoint or method under contract, the input conditions, and the guaranteed response shape. Then write a one-sentence "contract statement" for each test as if it were a clause in a service agreement.

**Reflection:** If the shipping service team changed their response schema and your contract tests caught it, would the failing test name alone tell the shipping team's engineer exactly which contract clause was violated — or would they need to read the test body?
