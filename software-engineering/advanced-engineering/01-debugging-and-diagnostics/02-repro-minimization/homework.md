# Homework — Repro Minimization

> Reduce a failing case to the smallest input and environment that still fails.

## Exercise

Work through a small scenario involving a flaky invoice import that only fails on large messy files.

**Build:**
- one reproducible failure or narrowed scenario
- a written hypothesis list
- one observation that disproves at least one hypothesis

**Constraints:**
- you may not start by editing production logic
- at least one plausible idea must be disproven
- your final note must distinguish symptom from cause

## Reflection

- What part of Repro Minimization felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Repro Minimization without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Single responsibility, small focused units

Creating a minimal reproduction is the debugging parallel of extracting a well-scoped function: in both cases you are stripping away everything irrelevant until only the essential concern remains. The discipline that lets you write a 15-line focused function is exactly the discipline that lets you reduce a 10,000-row CSV failure down to a 3-row failing input.

**Exercise:** For the flaky invoice import scenario, document every piece of the original environment you removed while minimizing the repro — file size, column count, encoding variation, network calls. Then map each removed element to a corresponding clean code concept (unnecessary dependency, hidden side effect, mixed concern) and note which ones could have been isolated earlier if the import code had cleaner boundaries.

**Reflection:** When you last minimized a reproduction, were you fighting the code structure itself — long methods, hidden globals, deeply nested conditions — and how would cleaner code have shortened the minimization process?
