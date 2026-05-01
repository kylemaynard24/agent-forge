# Questions — Exceptions and using

Three questions on error-handling judgment.

---

### Q1. The homework had two parallel methods: `Load` (throws) and `TryLoad` (returns false). What's the principle for picking which form an API should use, and why is it usually wrong to *only* offer one?

**How to think about it:**

The choice depends on **whether the failure is exceptional or expected**.

`Load` (throws) is right when:
- Failure indicates the **caller did something wrong** (passed a bad path, bad config, invalid arguments). The caller should fix their code; they shouldn't be silently routing around the failure with try/catch.
- Failure is rare — the success path is overwhelmingly normal. Throwing is fine because the cost (stack walk + allocation) only matters in the failure case.
- The caller couldn't reasonably handle the failure — letting it propagate up to a global handler is more honest than swallowing it.

`TryLoad` (returns) is right when:
- Failure is a **normal expected outcome** — "this file might or might not be there, depending on environment."
- The caller is going to check anyway; making them write try/catch is friction.
- Performance matters and exceptions are too expensive (in tight loops, exceptions are dramatically slower than success-path code).

The principle is: **exceptions are for exceptional situations**. Using exceptions for ordinary control flow makes code slow, hard to read (the happy path is in a `try` block; the failure path is in a `catch`), and confuses readers about what's normal vs surprising.

Why offer both? Different callers want different things:

- The CLI tool that loads a config at startup wants `Load` — if config is missing, the program should crash with a useful message. Try/catch would obscure the real problem.
- The fallback layer that tries multiple config sources wants `TryLoad` — it expects misses; it's not an error to fall through to the next source.

The .NET BCL is full of these pairs: `Parse` / `TryParse`, `GetValue` / `TryGetValue`, `Convert.ToInt32` (throws) / `int.TryParse`. Each pair recognizes that the same operation has different failure semantics depending on the caller.

The senior take: when designing an API where failure is plausibly expected, **offer both forms**. The cost is small (the throwing version typically calls the Try version internally); the benefit is callers can pick the right shape for their situation. APIs that only offer the throwing form force every caller to write defensive try/catch around expected misses.

---

### Q2. The homework asked you to compare `throw;` and `throw ex;` in stack traces. What's the difference, and why does it matter in production debugging?

**How to think about it:**

Both forms re-throw an exception you've caught. The difference is what they do to the stack trace.

```csharp
catch (Exception ex)
{
    Logger.Error(ex);

    throw;     // option A
    // throw ex;  // option B
}
```

**`throw;`** preserves the *original throw site* in the stack trace. The exception's stack still points to wherever the original `throw` happened — which is what you want when debugging. The handler shows up in the trace as a transit point, not as the origin.

**`throw ex;`** rewrites the stack trace to point to the line where you wrote `throw ex;`. The original throw site is **lost**. From the trace, it looks like the exception originated in your handler — which is misleading and makes the bug much harder to find.

In production debugging, stack traces are often the only artifact you have to figure out where a bug came from. A trace that says "exception thrown at line 42" — when line 42 is just a re-throw — sends you on a hunt for a bug that isn't there. The actual bug is in some method called several layers down, but the trace doesn't show that path.

The C# compiler will warn you about `throw ex;` (treating it as a stack-clobbering pattern), but the warning is easy to ignore. The discipline is: **use `throw;` (no parameter) to re-throw without changing anything**. If you genuinely want a different exception (wrap the original with more context), throw a new exception with the original as `InnerException`:

```csharp
catch (Exception ex)
{
    throw new OrderProcessingException("Failed to submit order", ex);  // preserves the original
}
```

The inner exception's stack trace stays intact; the new exception adds context. This is the clean way to add information at a layer without losing where the problem originated.

The senior take: this is one of those "small detail with outsized debugging cost" rules. The mechanical fix (always `throw;`, never `throw ex;`) is trivial. The cost of getting it wrong is hours of confusion when a real production exception has a misleading trace. Memorize the rule and never break it.

---

### Q3. The README emphasized `IDisposable` + `using` for resource cleanup. Why doesn't the garbage collector handle this, given that .NET has GC?

**How to think about it:**

The garbage collector reclaims **managed memory** — objects allocated on the heap that the program no longer references. It doesn't know about *external resources* the object holds: file handles, network sockets, database connections, OS handles, locks. Those are owned by the OS or another subsystem, not by the .NET memory manager.

When an object referencing a file handle becomes unreachable, the GC will eventually collect the object's memory — but the file handle stays open until the GC runs (which can be much later) AND only if the class implements a finalizer that releases the handle. Even then, finalizers are slow and run on a single dedicated thread; relying on them is bad design.

The `IDisposable` pattern provides **deterministic cleanup**: the moment the `using` scope exits, `Dispose()` runs. The file is closed, the connection is released, the lock is freed. You don't wait for the GC to notice; you don't depend on finalizers; the resource is freed at a predictable point in your program's flow.

Why does this matter?

1. **Resource limits.** OS file handles, network sockets, and database connections are scarce. Holding them longer than needed exhausts the limits. A leaky service that opens but doesn't close database connections will eventually fail with "too many open connections" — even though the GC has plenty of memory.

2. **Lock contention.** A lock held until the GC runs is a lock that other threads can't acquire. Worst-case: deadlock or starvation in code that *should* be safe.

3. **External invariants.** A file with unwritten buffered data won't actually contain that data until `Dispose()` (or an explicit `Flush()`) runs. Code that reads the file expecting the writes to be visible will see incomplete data.

4. **Predictability.** GC timing is opaque; `using` is deterministic. You can read code and know exactly when resources are released.

The pattern, in short:
- **Memory** is managed by the GC. Don't worry about it.
- **External resources** are managed by `IDisposable` + `using`. Worry about them.

The senior discipline: **anything that implements `IDisposable` should be wrapped in `using`**. There are essentially no exceptions in modern code — the cost of `using` is one keyword, the cost of forgetting it is a class of resource-leak bugs that are notoriously hard to track down.

The deeper principle: resource ownership is a real concept in your code, and the language gives you syntax (`using`, `await using`) to express it precisely. Use the syntax. Expressed ownership is checked by the compiler; informal "I'll remember to clean it up later" is checked by production failures.
