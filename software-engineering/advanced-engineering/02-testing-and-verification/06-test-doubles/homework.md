# Homework — Test Doubles

> Choose fakes, stubs, spies, or mocks deliberately instead of reflexively.

## Exercise

Work through a small scenario involving a payments dependency that should not run in every local test.

**Build:**
- one small verification target
- at least two different boundary choices
- a note explaining why one boundary is the better fit

**Constraints:**
- each check must answer one clear question
- at least one boundary choice must be justified in writing
- you must name one low-value test idea and reject it

## Reflection

- What part of Test Doubles felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Test Doubles without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, reveal intent, make the substitution explicit

The type of test double you choose is a design decision that should be visible in the name: `MockPaymentService`, `StubEmailSender`, and `SpyAuditLogger` each tell the reader exactly what behavior is being substituted and why. A field named simply `mock` or `double` forces every reader to inspect the setup code to understand what the test is actually controlling, which is the same burden as a variable named `temp` — technically accurate, practically useless.

**Exercise:** For the payments dependency scenario in this homework, decide which test double type (fake, stub, spy, or mock) is most appropriate for three different test objectives. For each choice, write the double's class or variable name to encode its type and the boundary it replaces, and write a one-sentence justification for why that double type — rather than one of the others — is the correct choice for that objective.

**Reflection:** In a test suite you maintain, are the test double names distinguishing between fakes, stubs, spies, and mocks — or is everything called `mock` regardless of whether it verifies interactions, returns canned values, or provides a real in-memory implementation?
