# Homework — Testability Design

> Shape code so important decisions are easy to observe and verify.

## Exercise

Work through a small scenario involving a large service method that mixes pure rules with side effects.

**Build:**
- one small verification target
- at least two different boundary choices
- a note explaining why one boundary is the better fit

**Constraints:**
- each check must answer one clear question
- at least one boundary choice must be justified in writing
- you must name one low-value test idea and reject it

## Reflection

- What part of Testability Design felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Testability Design without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Single responsibility, dependency injection, small functions

Testability and clean code are not separate goals — they are the same investment viewed from different angles. A function that is hard to test because it mixes pure business logic with database calls, email sends, and time reads is also hard to read, reason about, and modify safely; separating those concerns for testability produces cleaner code as a side effect.

**Exercise:** Take the large service method from this scenario that mixes pure rules with side effects. Draw a boundary between the pure decision logic and the side-effecting operations. Extract the pure logic into a function that takes plain data and returns plain data — no dependencies, no infrastructure calls. Write one unit test for the extracted function and note how much shorter and clearer the test is compared to what it would have taken to test the original mixed method. Then write the one-line sentence that describes what the extracted function does.

**Reflection:** In the last service method you wrote or reviewed, was it easy to test the business rules without booting infrastructure — and if not, what single extraction would have made the most important decision directly testable?
