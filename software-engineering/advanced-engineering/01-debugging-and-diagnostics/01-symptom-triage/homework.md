# Homework — Symptom Triage

> Turn broad complaints into specific, observable failure statements.

## Exercise

Work through a small scenario involving a checkout report that only says "sometimes it is broken".

**Build:**
- one reproducible failure or narrowed scenario
- a written hypothesis list
- one observation that disproves at least one hypothesis

**Constraints:**
- you may not start by editing production logic
- at least one plausible idea must be disproven
- your final note must distinguish symptom from cause

## Reflection

- What part of Symptom Triage felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Symptom Triage without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, reveal intent

Clean code produces clean symptoms: when a stack trace lands in `calculateDiscountedTotal` rather than an anonymous callback or a method named `process`, you already know which concern failed before you read a single line of the frame. Well-named functions turn a vague complaint like "checkout is broken" into a precise failure location in seconds.

**Exercise:** Take a stack trace from a real or simulated checkout failure and walk it twice — once assuming every frame has a meaningful, single-responsibility name, and once assuming half the frames are named `handler`, `callback`, or `util`. Write down how many minutes the triage takes in each case and what information was missing in the second walk.

**Reflection:** When you last triaged a production symptom, did the function names in the stack trace accelerate or slow down your search — and what would you rename today to improve the next incident?
