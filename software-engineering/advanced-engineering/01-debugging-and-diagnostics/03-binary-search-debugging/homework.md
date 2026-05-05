# Homework — Binary Search Debugging

> Cut the search space in half repeatedly instead of wandering through the codebase.

## Exercise

Work through a small scenario involving a regression introduced somewhere in a long pipeline.

**Build:**
- one reproducible failure or narrowed scenario
- a written hypothesis list
- one observation that disproves at least one hypothesis

**Constraints:**
- you may not start by editing production logic
- at least one plausible idea must be disproven
- your final note must distinguish symptom from cause

## Reflection

- What part of Binary Search Debugging felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Binary Search Debugging without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Small functions, one level of abstraction per function

Binary search debugging requires discrete, independently observable units to bisect — you need a midpoint that is meaningful. A 1,000-line pipeline stage with no clear internal boundaries cannot be halved; you can only wander through it. Clean code, by keeping functions small and each layer at one level of abstraction, naturally creates the bisection points that make this technique fast.

**Exercise:** Map the long pipeline from this scenario as a series of named stages, then count how many bisection steps it would take to localize the regression if the pipeline were: (a) one monolithic function, (b) 10 well-named single-responsibility functions. Calculate the maximum steps in each case and write a one-sentence argument for why function extraction is also a debugging time investment.

**Reflection:** In a pipeline you own, could you describe exactly where you would place the first bisection checkpoint — and if not, what does that say about how the code is currently structured?
