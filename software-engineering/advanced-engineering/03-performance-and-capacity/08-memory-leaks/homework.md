# Homework — Memory Leaks

> Track references and allocations that survive longer than they should.

## Exercise

Work through a small scenario involving a process that degrades after hours rather than seconds.

**Build:**
- a baseline measurement
- one improvement attempt
- a before/after summary with trade-offs

**Constraints:**
- you may not claim success without numbers
- the workload or traffic shape must be named
- you must state one cost introduced by the optimization

## Reflection

- What part of Memory Leaks felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Memory Leaks without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Single responsibility, use language idioms for resource cleanup, minimize scope

Resource cleanup code — closing connections, releasing handles, unsubscribing listeners — is often the ugliest and most error-prone code in a codebase because it is retrofitted around logic rather than structured into it. Language-level resource management patterns (`using` in C#, `try-with-resources` in Java, RAII in C++) are clean code applied to memory: they tie resource lifetime to scope, remove the cleanup from the happy path, and make it structurally impossible to forget the release.

**Exercise:** For the slow-degrading process scenario in this homework, identify the resource that is leaking and rewrite the acquisition and release using the idiomatic resource management pattern for your language of choice. Then compare the line count and cyclomatic complexity of the original finally/close pattern versus the structured version, and write one sentence explaining why the structured version is both cleaner and safer.

**Reflection:** In a codebase you work in, are there resource acquisitions — database connections, HTTP clients, file handles, event subscriptions — that are released in ad-hoc `finally` blocks rather than through a scoped ownership pattern, and what would it take to migrate the highest-risk one?
