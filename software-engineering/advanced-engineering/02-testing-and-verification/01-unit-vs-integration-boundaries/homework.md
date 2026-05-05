# Homework — Unit vs Integration Boundaries

> Choose the smallest trustworthy boundary for the question you need answered.

## Exercise

Work through a small scenario involving a checkout flow whose business rules and dependency wiring fail in different ways.

**Build:**
- one small verification target
- at least two different boundary choices
- a note explaining why one boundary is the better fit

**Constraints:**
- each check must answer one clear question
- at least one boundary choice must be justified in writing
- you must name one low-value test idea and reject it

## Reflection

- What part of Unit vs Integration Boundaries felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Unit vs Integration Boundaries without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, reveal scope in the name

A test name must encode not just what is being verified but at which boundary — `testUser` fails both requirements, while `unitTest_applyDiscount_returnsZeroForFreeItems` and `integrationTest_checkoutFlow_reservesInventoryBeforeChargingCard` both communicate scope, subject, and expected behavior without opening the test body. Naming your tests to their boundary level is how you build a suite that teams can scan without reading every assertion.

**Exercise:** For the checkout scenario, write three test names for unit-level checks and two for integration-level checks. Each name must encode: the boundary (unit/integration), the subject under test, and the expected outcome. Then evaluate whether any of the integration test names could be confused for a unit test and vice versa, and adjust until the distinction is unambiguous from the name alone.

**Reflection:** Looking at the test names in a project you work on, can you immediately tell which ones exercise real infrastructure versus pure logic — or do you have to open the file to find out?
