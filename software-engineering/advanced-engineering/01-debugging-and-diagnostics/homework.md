# Homework — Debugging and Diagnostics

> Narrow the search space. Do not patch symptoms blindly.

## Exercise: Root-cause a flaky order bug

**Scenario:** An `OrderService` occasionally produces duplicate confirmation emails and incorrect totals after discounts. The failures are intermittent, logs are noisy, and teammates disagree about the cause.

**Build:**
- A minimal reproduction for at least one failure
- A written list of hypotheses ranked by confidence
- Instrumentation that helps distinguish the top two hypotheses
- A fix for the real root cause, not just the visible symptom

**Constraints:**
- You must write down at least 3 competing hypotheses before editing production logic
- At least one hypothesis must be disproven with evidence
- Your final write-up must separate **symptom**, **trigger**, **mechanism**, and **root cause**
- The fix must include one guard against regression

## Stretch

Take a second bug in the same system and show how much faster the debugging loop is once the right instrumentation already exists.

## Reflection

- What was the first plausible but wrong explanation?
- What single observation cut down the search space the most?
- Which part of the system was hardest to observe honestly?

## Done when

- [ ] You can reproduce the bug reliably enough to study it
- [ ] At least one strong hypothesis was falsified
- [ ] Your final fix addresses the cause, not just the output
- [ ] You added one regression guard: test, metric, alert, or invariant check

---

## Clean Code Lens

**Principle in focus:** Meaningful names, small functions, single responsibility

Code that is hard to debug is almost always code that is hard to read first — tangled responsibilities, opaque variable names, and 300-line methods don't just slow feature work, they make every failure investigation start from scratch. Investing in clean code is investing in a shorter debugging loop before the incident even happens.

**Exercise:** Take the OrderService scenario from this homework and identify three specific places where a clean code violation — a method doing too much, a poorly named variable, an inline anonymous callback — directly lengthens the time to locate the root cause. Rewrite just those three spots and note how the hypotheses list from the exercise shrinks.

**Reflection:** In a codebase you work in regularly, what is the single messiest function, and how much of your recent debugging time was spent inside or around it?
