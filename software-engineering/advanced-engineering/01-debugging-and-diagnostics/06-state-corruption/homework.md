# Homework — State Corruption

> Recognize when the current bad value was created earlier than the visible failure.

## Exercise

Work through a small scenario involving an order that only becomes invalid after several normal-looking updates.

**Build:**
- one reproducible failure or narrowed scenario
- a written hypothesis list
- one observation that disproves at least one hypothesis

**Constraints:**
- you may not start by editing production logic
- at least one plausible idea must be disproven
- your final note must distinguish symptom from cause

## Reflection

- What part of State Corruption felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of State Corruption without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Minimize scope, prefer immutability, one level of abstraction per function

State corruption happens when mutable state travels further than it needs to — through global variables, shared object references, or long-lived caches that accumulate invisible writes. Both minimizing scope (the clean code instinct to keep a variable as local as possible) and preferring immutable data structures (value objects, records, frozen state) are design decisions that make it structurally harder for corruption to occur in the first place.

**Exercise:** For the order-update scenario in this homework, trace every place the order object is read or written across its lifetime. For each mutation point, ask: could this have been a transformation that returns a new value instead of modifying in place? Rewrite the two most dangerous mutation points as pure transformations and explain how each change narrows the set of possible corruption sources.

**Reflection:** In the codebase you work in, is your primary domain entity (order, user, session) mutated in place throughout its lifecycle — and what would it take to make at least its critical fields immutable?
