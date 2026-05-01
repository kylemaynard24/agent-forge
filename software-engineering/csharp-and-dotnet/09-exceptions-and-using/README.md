# Exceptions and `using`

Two intertwined topics: how C# represents and handles errors, and how it manages resources that need explicit cleanup.

## Exceptions — basic shape

```csharp
try
{
    var content = File.ReadAllText("data.txt");
}
catch (FileNotFoundException ex)
{
    Console.WriteLine($"File missing: {ex.FileName}");
}
catch (UnauthorizedAccessException)
{
    Console.WriteLine("Permission denied.");
}
catch (Exception ex) when (ex.Message.Contains("retry"))  // exception filter (C# 6+)
{
    Console.WriteLine("Transient — could retry.");
}
finally
{
    Console.WriteLine("Always runs.");
}
```

C#'s exception system is structurally similar to Java's. Some specifics:

- Every exception derives from `System.Exception`.
- C# does **not** have checked exceptions. Methods can throw anything; the type system doesn't track it.
- Catch by *type*; the most specific clause wins. Use `Exception` only as a last resort, and only when you can do something meaningful with it.
- `when` clauses (filters) let you catch conditionally — runs the filter to decide whether to enter the catch block. Useful for type-based-but-conditional handling.
- `finally` runs on both success and exception paths. Use for cleanup that doesn't fit the `using` pattern.

## When to throw

The .NET guideline: throw when the method **cannot fulfill its contract**. Don't throw for normal control flow — exceptions are expensive (stack walk, allocation) and they obscure the happy path.

| Situation | Throw or return? |
|---|---|
| Caller passed an invalid argument | Throw `ArgumentException`/`ArgumentNullException`/`ArgumentOutOfRangeException` |
| Object is in a state that can't perform the operation | Throw `InvalidOperationException` |
| Operation isn't supported (interface stub, etc.) | Throw `NotSupportedException` (NOT `NotImplementedException` for shipped code) |
| Item not found in a lookup the caller is *expected* to handle | Return `null` / `false` / a result type — don't throw |
| Item not found when caller expected it | Throw `KeyNotFoundException` or similar |
| External system is unavailable | Throw a domain-specific exception |

Pattern: **`Try*` methods** for the "expected failure" case:

```csharp
if (dict.TryGetValue(key, out var value)) { /* found */ }
else { /* not found, no exception thrown */ }
```

When you write your own API with an expected-miss case, follow the same shape.

## Custom exception types

```csharp
public class OrderValidationException(string message, IEnumerable<string> errors)
    : Exception(message)
{
    public IReadOnlyList<string> Errors { get; } = errors.ToList();
}

throw new OrderValidationException("Order failed validation",
    new[] { "Total must be positive", "Customer email required" });
```

Domain-specific exceptions help callers handle different failure modes distinctly. Keep custom exceptions focused — one per *category* of failure, not one per *instance*.

## What NOT to do

- **`catch (Exception) { }`** — silently swallowing errors. The bug is now invisible. If you genuinely need to catch and ignore, log it at minimum.
- **`throw ex;`** — re-throws but resets the stack trace. Use bare `throw;` to preserve the original stack.
  ```csharp
  catch (Exception ex)
  {
      Logger.Error(ex);
      throw;          // GOOD — preserves stack
      // throw ex;    // BAD — resets stack
  }
  ```
- **Exceptions for control flow.** Using `try/catch` to test whether something exists, instead of using `Try*` methods.
- **Catching `Exception` in middleware/global handlers without rethrowing.** Hides bugs that should bubble up to a centralized handler that knows what to do.
- **Throwing from constructors of widely-used types.** Constructor failures are surprising and hard to recover from — design so that failures happen in factory methods or initialization helpers that callers explicitly invoke.

## `using` and `IDisposable`

C# uses `IDisposable` for resources that need explicit cleanup — file handles, network connections, locks, GDI handles, anything tied to the OS.

```csharp
public interface IDisposable
{
    void Dispose();
}

// Old-school using statement — disposes when the scope exits
using (var stream = new FileStream("data.txt", FileMode.Open))
{
    // use stream
}  // stream.Dispose() called here, even on exception

// Modern using DECLARATION (C# 8+) — disposes when the enclosing scope exits
public void ReadFile()
{
    using var stream = new FileStream("data.txt", FileMode.Open);
    // use stream
    // stream.Dispose() called when ReadFile returns
}
```

The `using` declaration form is preferred in modern code — less indentation, same guarantee.

## Implementing `IDisposable` correctly

The full Microsoft-recommended pattern is verbose; for most cases, this simpler form is enough:

```csharp
public sealed class MyResource : IDisposable
{
    private readonly FileStream _stream;
    private bool _disposed;

    public MyResource(string path)
    {
        _stream = new FileStream(path, FileMode.Open);
    }

    public void Dispose()
    {
        if (_disposed) return;
        _stream.Dispose();
        _disposed = true;
    }
}
```

Two important details:

1. **Make the class `sealed` if possible** — the unsealed `IDisposable` pattern requires the more elaborate `protected virtual Dispose(bool disposing)` form. Sealing avoids that.
2. **Idempotency** — calling `Dispose()` twice should be safe. The `_disposed` flag handles that.

## `IAsyncDisposable`

For resources that need async cleanup (network sockets, async DB connections):

```csharp
public sealed class MyAsyncResource : IAsyncDisposable
{
    public async ValueTask DisposeAsync()
    {
        await SomeAsyncCleanupAsync();
    }
}

// Caller uses `await using`
await using var resource = new MyAsyncResource();
// ... use it ...
// DisposeAsync() awaited automatically when scope exits
```

If a class implements both `IDisposable` and `IAsyncDisposable` (some types do, like `DbContext`), prefer `await using` — async disposal usually does extra work to flush properly.

## Common mistakes

- **Forgetting to `using` a disposable.** The resource leaks; you find out under load. Always `using` anything that implements `IDisposable`.
- **`Dispose()` from a constructor when something fails.** If a constructor partially succeeds and then throws, the partially-constructed object is never returned, and the GC will run finalizers (if any), but explicit `Dispose` won't run. Design so resources are acquired *after* the dangerous setup, or use a factory method that wraps the unsafe construction.
- **Disposing something twice.** If a method disposes a passed-in resource the caller also disposes, you double-dispose. Document who owns the lifecycle.

## Where to next

- Topic `10-namespaces-projects-csproj` — how the build system is structured.
