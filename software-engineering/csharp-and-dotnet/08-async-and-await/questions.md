# Questions — Async and await

Four questions on the most-misunderstood part of C#.

---

### Q1. Why does I/O-bound work benefit from `Task.WhenAll` but CPU-bound work usually doesn't?

**How to think about it:**

Async/await in .NET is fundamentally about **freeing the calling thread while waiting for something external**. When you `await` a network call, the runtime hands the thread back to the thread pool — that thread can now do other work for other requests. When the network call completes, the runtime grabs *some* thread (not necessarily the same one) to continue your method from where it left off.

For I/O-bound work — reading files, calling APIs, querying databases — the *time spent waiting* is much larger than the *CPU time spent processing the result*. Sending 10 HTTP requests sequentially might take 10 seconds (10 × 1 second of network latency, almost entirely waiting). Sending them concurrently with `Task.WhenAll` takes about 1 second (they're all waiting at the same time, sharing the thread pool). 10× speedup, almost free.

For CPU-bound work — math, parsing, image transformation — the work IS CPU time. Threads can't help you "wait" for CPU; you'd need *multiple physical cores* working in parallel. Async doesn't give you that. `Task.WhenAll(cpuWork1(), cpuWork2())` running on a single thread runs them sequentially anyway — the `await` just adds overhead.

To parallelize CPU-bound work, you need actual threading: `Task.Run(() => cpuWork())` to put it on a thread-pool thread, or `Parallel.ForEach(...)` for data-parallel work. Async is the wrong primitive.

The mental model that captures both: **async is for waiting; threading is for doing.** If your method is "waiting on someone else," async wins. If it's "doing CPU work," async at best wraps the work to avoid blocking — but doesn't make it faster on its own.

The bug case to avoid: wrapping CPU work in `Task.Run` and calling it "async." This burns a thread to do the work and then awaits the burned thread — net effect is the same as doing it synchronously, plus thread-pool churn. The only legitimate use of `Task.Run(syncWork)` is when you need to keep an unrelated thread free (e.g., the UI thread in a desktop app while a CPU computation runs). For server/service code, this pattern usually hurts more than it helps.

---

### Q2. The README warned strongly against `.Result` and `.Wait()`. Why are they so dangerous, and when (if ever) is it acceptable to use them?

**How to think about it:**

`.Result` and `.Wait()` block the current thread until the awaited Task completes. In `await`-style code, the thread is freed; with these, the thread sits doing nothing while the Task runs.

Two failure modes:

**1. Deadlocks in code with a synchronization context.** When an `async` method awaits, it captures the current SynchronizationContext (in classic ASP.NET or in WPF/WinForms apps). When the awaited Task completes, the continuation tries to resume on that captured context. If the captured context is *the very thread you're blocking with `.Result`*, you have a deadlock: the continuation is queued on the thread, but the thread is sleeping inside `.Result` waiting for the Task to complete. The Task can't complete because the continuation can't run because the thread is blocked.

This is the canonical async deadlock. It bites in:
- Older ASP.NET (Web Forms, MVC 5) — has a request-thread sync context.
- WPF, WinForms — has the UI thread sync context.
- ASP.NET Core — has NO sync context, so `.Result` doesn't deadlock there. (But it still wastes a thread.)

**2. Wasted thread-pool threads.** Even when there's no sync context, `.Result` blocks the calling thread. If the Task is doing I/O (await + waiting for a network call), you've now committed a real thread to do *nothing* for the duration. Under load, that's thread-pool starvation — your service's throughput collapses because all threads are blocked in `.Result`.

When is `.Result` / `.Wait()` acceptable?

- **Truly never** in async-aware code (where the rest of the codebase uses `await`). The cost-benefit is bad.
- **In synchronous entry points that have no async option** — e.g., a constructor (constructors can't be `async` in C#). Even then, `.GetAwaiter().GetResult()` is the slightly-better form (it doesn't wrap exceptions in `AggregateException` like `.Wait()` does).
- **In `Main()` of older console apps** before C# 7.1 added `async Task Main`. Now `Main` can be async; this excuse is gone.

The senior rule: **async is contagious — once one method is async, the methods that call it should also be async, all the way up.** Breaking the chain with `.Result` is where deadlocks and thread starvation enter. If you find yourself wanting `.Result`, the right move is usually to make the calling method async too.

---

### Q3. `ConfigureAwait(false)` was a constant ritual in older C# code. The README said modern code can usually skip it. Why was it there in the first place, and why has the rule relaxed?

**How to think about it:**

`ConfigureAwait(false)` controls **where the continuation of an `await` runs**. By default, when you `await` something, the runtime captures the current `SynchronizationContext` and resumes the continuation *on that context*. For UI apps, that's the UI thread. For classic ASP.NET, that's the request thread. For library code, the captured context is whatever the caller's context happened to be.

The problem with the default: if a library awaits something, the continuation tries to run on the caller's context. If the caller blocked on the result with `.Result` (problem Q2), you deadlock. If the caller was on the UI thread, the continuation runs on the UI thread — even if it's just CPU work that doesn't need to be there. You've coupled your library to the caller's threading model.

`ConfigureAwait(false)` says "I don't care which thread the continuation runs on; pick whichever is convenient." This breaks the coupling — the library doesn't depend on the caller's context. It avoided deadlocks AND avoided unnecessary thread switches.

For library authors targeting any caller environment, the rule was: **add `.ConfigureAwait(false)` to every `await` in your library**. It was tedious — every line — but it was the correct discipline.

Why has the rule relaxed?

1. **ASP.NET Core has no SynchronizationContext.** The most common .NET server framework today simply doesn't capture context, so `ConfigureAwait(false)` is a no-op. Modern ASP.NET Core code can skip it everywhere.

2. **Console apps and Worker Services have no SynchronizationContext.** Same.

3. **Newer guidance from Microsoft has acknowledged that for application code (not libraries), the cost of typing it everywhere outweighs the benefit. Library code is still expected to use it for safety, but app code can skip it.**

Concretely, today:

- **App code (ASP.NET Core, console, Worker Service, modern Maui/Blazor):** skip `ConfigureAwait`. The default behavior works.
- **Library code (NuGet packages, anything you publish):** add `ConfigureAwait(false)` to every `await`. The library doesn't know if a future caller will be in a sync-context environment.
- **WPF/WinForms code:** be deliberate. If your continuation needs the UI thread (to update a control), default behavior is right. If it doesn't, `ConfigureAwait(false)` avoids unnecessary context switches.

The senior take: **`ConfigureAwait(false)` is a library-discipline marker, not a magic fix.** Knowing whether your code is "library" or "application" is the more important judgment than knowing the rule. App code in modern .NET environments is the simpler case; library code remains demanding because it must be safe everywhere.

---

### Q4. The homework's `StreamingProcessor.ReadInterestingLinesAsync` returned `IAsyncEnumerable<string>` instead of `Task<List<string>>`. What does `IAsyncEnumerable` give you that `Task<List<T>>` doesn't, and when should you reach for it?

**How to think about it:**

`Task<List<string>>` is a single-result async operation: the caller awaits once and gets back the entire list when the work is done. `IAsyncEnumerable<string>` is a *streaming* async operation: the caller `await foreach`es it, getting items one at a time as they become available.

The difference matters in three scenarios:

1. **Large or unbounded result sets.** If the source is a million-line file, `Task<List<string>>` materializes the entire list in memory before returning. `IAsyncEnumerable<string>` lets the caller process line by line, holding only one line at a time. Memory cost goes from O(n) to O(1).

2. **Latency to first result.** With `Task<List<string>>`, the caller waits for the *entire* operation before seeing any data. With `IAsyncEnumerable<string>`, the first result is available as soon as it's read — useful for UIs that want to display partial results, or for streaming over a network.

3. **Composable async pipelines.** You can chain async operators (with `System.Linq.Async`): `source.WhereAwait(...).SelectAwait(...).TakeAsync(10)` — the chain is fully lazy and async, much like LINQ for synchronous sequences.

When to use which:

| Use `Task<List<T>>` when... | Use `IAsyncEnumerable<T>` when... |
|---|---|
| The result set is small and bounded | The result set is large, unbounded, or unknown size |
| Callers always want the whole thing | Callers may want to consume incrementally |
| You're consuming a one-shot service call | You're streaming from a file, message queue, or long-running query |
| The collection is a meaningful unit (a paged response) | Each item is meaningful on its own (a log line, an event) |

The cost of `IAsyncEnumerable`: it's slightly heavier syntactically (you need `[EnumeratorCancellation]`, `await foreach`, the `IAsyncEnumerator` plumbing). For small result sets, `Task<List<T>>` is simpler and the right call.

The senior heuristic: **default to `Task<List<T>>` for normal-sized results; promote to `IAsyncEnumerable<T>` when streaming actually buys something** (memory, latency, composition). Don't use `IAsyncEnumerable` reflexively — it adds complexity that needs to be justified.

The deeper principle: type signatures encode the operational story. `Task<List<T>>` says "all-at-once, in memory, complete." `IAsyncEnumerable<T>` says "streaming, lazy, possibly unbounded." Picking the right one tells the caller what to expect — and prevents accidentally materializing a 10GB result set into a `List`.
