# Async and await

The single most-misunderstood part of C#. The mechanical syntax is easy; the mental model is the hard part. This README spends as much time on **when not to use async** as on the syntax.

## What async is for

Async/await exists for **I/O concurrency** — keeping a thread free while waiting for the network, disk, or another long-running operation to complete. It is **not**:

- A way to make CPU-bound code faster (use threads/parallelism for that).
- A general performance technique to apply everywhere.
- Free; it has overhead.

The mental model: when you `await` something, the current method **suspends** at that point and returns control to the caller. When the awaited operation completes, the runtime resumes your method from where it left off. The thread that was running your method is freed up to do other work in the meantime.

## The basic shape

```csharp
public async Task<int> CountLinesAsync(string path, CancellationToken ct)
{
    using var reader = new StreamReader(path);
    int count = 0;
    while (await reader.ReadLineAsync(ct) is not null)
    {
        count++;
    }
    return count;
}

// Caller
int n = await CountLinesAsync("data.txt", CancellationToken.None);
```

Three things to internalize:

1. **`async` methods return `Task` or `Task<T>`** (or `ValueTask` / `IAsyncEnumerable<T>`). They almost never return `void` — `async void` is reserved for event handlers and is a footgun otherwise.
2. **`await` unwraps a `Task<T>` into a `T`** (or just suspends if the task is `Task` with no return value).
3. **The method is named `...Async`** by convention. This is not enforced, but every BCL async method follows it.

## Cancellation tokens

```csharp
public async Task<string> FetchAsync(Uri url, CancellationToken ct)
{
    using var client = new HttpClient();
    var response = await client.GetAsync(url, ct);
    return await response.Content.ReadAsStringAsync(ct);
}

// Caller
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
var content = await FetchAsync(new Uri("https://example.com"), cts.Token);
```

Pass a `CancellationToken` through every async method. The token lets a caller signal "give up, I don't need this anymore" — for timeouts, user-initiated cancels, or upstream failures. **Forgetting to plumb the token through is one of the most common review findings in async C# code.**

The token doesn't actually cancel the operation by itself — the awaited operation has to *check* the token. Most BCL operations do, automatically. Custom long-running operations need to check `ct.IsCancellationRequested` periodically and call `ct.ThrowIfCancellationRequested()`.

## ConfigureAwait — what it is and why it matters

When you `await`, the continuation (the code after the `await`) needs to run *somewhere*. By default, it tries to run on the **synchronization context** that was active when the await began — for UI apps, that's the UI thread; for ASP.NET Classic, the request thread. For libraries you write, this can deadlock the caller.

```csharp
// In LIBRARY code, default to ConfigureAwait(false)
var content = await client.GetAsync(url).ConfigureAwait(false);
```

`ConfigureAwait(false)` says: "I don't care which thread the continuation runs on — pick whichever is convenient." This avoids the synchronization context dependency.

**Modern simplification:** ASP.NET Core (the modern web stack) doesn't have a synchronization context, so `ConfigureAwait` is mostly irrelevant for ASP.NET Core code. For console apps and worker services, also irrelevant. For libraries that might be used in WPF/WinForms/older ASP.NET, you should still use `ConfigureAwait(false)` defensively.

The .NET team's modern guidance: in app code targeting only ASP.NET Core / console / Worker Service, you can skip `ConfigureAwait(false)`. In library code, use it.

## async void — the one place to use it (and the trap)

```csharp
// The ONLY appropriate use: event handlers
button.Click += async (sender, args) =>
{
    try
    {
        await DoWorkAsync();
    }
    catch (Exception ex)
    {
        // MUST handle exceptions here — async void exceptions can crash the process
        Logger.Error(ex);
    }
};
```

Anywhere else: return `Task` (or `Task<T>`). `async void` exceptions don't propagate to the caller — they get raised on the synchronization context and often crash the process. `async void` methods can't be awaited, so the caller has no way to know when they're done.

## Common pitfalls

### `.Result` and `.Wait()` — almost always wrong

```csharp
// DON'T:
var result = SomeAsyncMethod().Result;
SomeAsyncMethod().Wait();
```

These block the current thread waiting for the async operation. In some contexts, this **deadlocks** (the continuation is waiting for the thread you're blocking on). In all contexts, it defeats the point of async.

Use `await` all the way up. If you have a sync entry point that needs to call async (rare in modern code — `Main` can be `async Task`), you're forced to use `.GetAwaiter().GetResult()` or `Task.Run(() => ...).Result`, but treat these as design smells.

### Async-over-sync wrapping

```csharp
// DON'T:
public Task<int> CountAsync() => Task.FromResult(SomeSyncCount());

// Or worse:
public async Task<int> CountAsync() => await Task.Run(() => SomeSyncCount());
```

Wrapping a sync method in `Task.FromResult` or `Task.Run` doesn't make it async — it just adds overhead and (in the `Task.Run` case) burns a thread pool thread. If the underlying work is sync, the API should be sync. Don't pretend.

### Forgetting to await

```csharp
// BUG: returns a Task that may complete later, but the caller didn't await — fire and forget
public async Task ProcessAsync()
{
    SaveAsync();  // <-- missed `await`
    return;
}
```

The compiler warns about this in modern C# (`CS4014`), but it's easy to ignore. If you genuinely want fire-and-forget, be explicit: `_ = SaveAsync();` (with appropriate exception handling — exceptions on un-awaited tasks are unobserved and can be lost).

### Awaiting in a tight loop

```csharp
foreach (var url in urls)
{
    var content = await FetchAsync(url);
    Console.WriteLine(content.Length);
}
```

This fetches each URL sequentially. If you want them concurrent:

```csharp
var fetches = urls.Select(FetchAsync).ToList();
var contents = await Task.WhenAll(fetches);
```

`Task.WhenAll` waits for all of them; `Task.WhenAny` waits for the first. For controlled concurrency (don't make 10,000 simultaneous requests), use `Parallel.ForEachAsync` (.NET 6+) with a `ParallelOptions.MaxDegreeOfParallelism`.

## ValueTask — when not to use Task

`ValueTask<T>` is a struct alternative to `Task<T>` for the case where the operation **often completes synchronously** (e.g., a cache that frequently hits). It avoids allocating a `Task<T>` for the synchronous case.

Don't reach for it everywhere — it has subtle rules (you can only await it once, you can't WhenAll a bunch of them safely). Use `Task<T>` by default. Use `ValueTask<T>` only in performance-critical hot paths after measuring.

## IAsyncEnumerable — async iteration

```csharp
public async IAsyncEnumerable<string> StreamLinesAsync(
    string url,
    [EnumeratorCancellation] CancellationToken ct = default)
{
    using var client = new HttpClient();
    using var stream = await client.GetStreamAsync(url, ct);
    using var reader = new StreamReader(stream);

    while (await reader.ReadLineAsync(ct) is { } line)
    {
        yield return line;
    }
}

// Caller
await foreach (var line in StreamLinesAsync("https://...", ct))
{
    Console.WriteLine(line);
}
```

The async equivalent of `IEnumerable<T>` + `yield return`. Use when you want to stream results as they arrive rather than materialize a whole collection.

## Async and the four sprint subjects

- **Agentic workflows:** every API call to Claude is async. Tool execution loops are async pipelines. Cancellation tokens are critical (an agent loop that runs forever burns money).
- **Architecture:** async crosses architectural boundaries. The interface a domain layer exposes should be async if any implementation might do I/O — even if today's implementation is sync. (You can wrap a sync implementation as `Task.FromResult(...)` for the in-memory case.)
- **Design patterns:** several patterns map naturally to async — Strategy with async strategies, Observer with `IAsyncEnumerable`, Command with async `Execute`.
- **DevOps:** Bicep/Azure CLI work is sync from your perspective; the deployment engine is async behind the scenes. C# code targeting Azure SDK clients (`StorageClient`, `KeyVaultClient`, `SqlConnection`) all expose async methods — use them.

## Where to next

- Topic `09-exceptions-and-using` — async + exceptions has subtle rules; `using` and `await using` are both important.
