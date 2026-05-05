# Homework — Concurrency Bugs

> Reason about ordering, races, and shared state under parallel execution.

## Exercise

Work through a small scenario involving two workers updating the same job record at nearly the same time.

**Build:**
- one reproducible failure or narrowed scenario
- a written hypothesis list
- one observation that disproves at least one hypothesis

**Constraints:**
- you may not start by editing production logic
- at least one plausible idea must be disproven
- your final note must distinguish symptom from cause

## Reflection

- What part of Concurrency Bugs felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Concurrency Bugs without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, make concurrency intent explicit in naming

Concurrency code is the hardest code to read, and shared mutable state that looks like an ordinary field is the most dangerous kind. Clean naming signals the concurrency contract: a field called `jobCount` invites casual reads and writes, while `_jobCountLock`, `jobCountVolatile`, or `Interlocked.jobCount` (depending on your language) tells every reader that this field has synchronization requirements before they touch it.

**Exercise:** For the two-worker job record scenario, list every shared field that both workers read or write. For each field, write its current name and then a name that communicates its synchronization mechanism or concurrency risk. Then write a one-sentence comment that would appear above each field describing the invariant that must be maintained across concurrent access.

**Reflection:** In a concurrent system you have debugged or written, were the concurrency contracts communicated through naming and comments — or did you only discover them when something raced?
