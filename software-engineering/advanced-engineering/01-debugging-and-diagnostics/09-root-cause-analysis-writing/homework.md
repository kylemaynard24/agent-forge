# Homework — Root-Cause Analysis Writing

> Write the debugging story clearly enough that others learn from it.

## Exercise

Work through a small scenario involving a bug that keeps returning because the team remembers the fix but not the cause.

**Build:**
- one reproducible failure or narrowed scenario
- a written hypothesis list
- one observation that disproves at least one hypothesis

**Constraints:**
- you may not start by editing production logic
- at least one plausible idea must be disproven
- your final note must distinguish symptom from cause

## Reflection

- What part of Root-Cause Analysis Writing felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Root-Cause Analysis Writing without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Write for the reader, separate concern, reveal intent

A root cause analysis document has the same obligation as clean code: it must be readable by someone who was not there when it was written. Vague sections like "we fixed the issue" are the documentation equivalent of a function named `doStuff` — they satisfy the minimum requirement but leave the next reader no better prepared than before.

**Exercise:** Take the recurring-bug scenario from this homework and write a one-page RCA using four explicitly labeled sections: Symptom (what users observed), Trigger (the immediate event that caused it), Mechanism (the code or system path that turned the trigger into the symptom), and Root Cause (the underlying condition that allowed the mechanism to exist). Then evaluate each sentence against this standard: could an engineer who was not on-call that day act on this sentence without asking a follow-up question?

**Reflection:** In an RCA you have written or read, was the distinction between trigger and root cause made explicit — or did the document fix the trigger and call the root cause resolved?
