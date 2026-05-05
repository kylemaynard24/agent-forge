# Homework — Async and await

Build a small async file processor that exercises sequential vs concurrent waits, cancellation, and the most common pitfalls.

## Build it

1. **`FileLineCounter` class** with:
   - `Task<int> CountLinesAsync(string path, CancellationToken ct)` — reads a file line-by-line asynchronously and returns the count. Use `StreamReader.ReadLineAsync(ct)`.
   - `Task<Dictionary<string, int>> CountLinesInManyAsync(IEnumerable<string> paths, CancellationToken ct)` — counts lines in many files. Implement TWO versions side by side:
     - `CountLinesInManyAsync_Sequential` — `await` each file in turn.
     - `CountLinesInManyAsync_Concurrent` — fire all `CountLinesAsync` calls and await with `Task.WhenAll`.
   - Time both versions in your demo.

2. **`StreamingProcessor` class** with:
   - `IAsyncEnumerable<string> ReadInterestingLinesAsync(string path, Func<string, bool> filter, [EnumeratorCancellation] CancellationToken ct = default)` — reads lines asynchronously and yields only those matching the filter. The point: streaming results without materializing the whole file.

3. **In `Program.cs`:**
   - Create 3 sample files in `Path.GetTempPath()` with different sizes (e.g., 100, 1000, 10000 lines). Use `await File.WriteAllLinesAsync(...)`.
   - Time the sequential vs concurrent counting. Show the speedup (concurrent should be ~3x faster for I/O-bound work).
   - Use `StreamingProcessor` to print lines containing the word "FOO" — show that processing starts before the file is fully read.
   - Demonstrate cancellation: start a long-running `CountLinesAsync` with a `CancellationTokenSource` set to cancel after 50ms. Catch `OperationCanceledException`.
   - Clean up the temp files at the end.

## Done when

- [ ] All async methods accept and propagate `CancellationToken`.
- [ ] No `.Result` or `.Wait()` anywhere; everything is async-all-the-way.
- [ ] No `async void` (your `Main` is `async Task Main()`).
- [ ] Concurrent version is measurably faster than sequential.
- [ ] You can articulate why I/O-bound work benefits from `Task.WhenAll` but CPU-bound work doesn't.

## Bonus

- Add a controlled-concurrency variant using `Parallel.ForEachAsync(...)` with `MaxDegreeOfParallelism = 4` so you don't open 1000 file handles at once.
- Wrap a sync method (`int CountLinesSync(string path)`) and demonstrate why `public Task<int> CountLinesAsync(string path) => Task.Run(() => CountLinesSync(path));` is an anti-pattern (hint: it doesn't actually scale; it just burns a thread pool thread per "async" call).
- Use `IAsyncEnumerable` with `await foreach` and a `WithCancellation(ct)` extension — show graceful cancellation mid-iteration.

## Save to

`progress/<today>/working-folder/csharp-and-dotnet/08-files/`.

---

## Clean Code Lens

**Principle in focus:** Async Method Names End in `Async`; `CancellationToken` Makes Intent Explicit

The `Async` suffix is a promise to every caller: "this method will not block your thread." It is also a searchable signal — a reader scanning for async entry points can find them instantly. `CancellationToken ct` in every method signature is a different kind of documentation: it says "this operation respects cancellation, and if you have a token, you should pass it." A method that accepts work but silently ignores a `CancellationToken` is a method that lies about its cancellation behavior.

**Exercise:** Look at your `CountLinesInManyAsync_Sequential` and `CountLinesInManyAsync_Concurrent` side by side. The only structural difference is `await` vs `Task.WhenAll`, but that difference means everything about throughput. Now rename both methods to make the difference obvious in the name itself — something like `...Sequential` and `...Concurrent`. Confirm that the names now tell a caller which version to reach for without reading the body.

**Reflection:** In the sequential version, if the second file's `CancellationToken` fires, the first file's result is already complete and its lines counted. In the concurrent version, cancellation can abandon mid-flight tasks. Does your current method name communicate this behavioral difference to a caller — and should it?
