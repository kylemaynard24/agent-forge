# Homework — Collections and LINQ

Build a small log-analysis tool that uses LINQ for filtering, grouping, aggregation, and projection.

## Build it

1. **Define a `LogEntry` record:**
   ```csharp
   public record LogEntry(
       DateTime Timestamp,
       string Level,         // "INFO", "WARN", "ERROR"
       string Service,       // e.g., "auth", "api", "worker"
       string Message,
       int? UserId);
   ```

2. **Generate sample data.** In a static class or method, build a `List<LogEntry>` of about 50 entries with varied timestamps (spread across the last 24 hours), levels, services, and a mix of `null` and concrete `UserId` values. Use random selection from arrays for variety.

3. **Write LINQ queries** for the following questions, each as a separate method that takes `IEnumerable<LogEntry>` and returns the answer:
   - **`int CountErrors(IEnumerable<LogEntry> logs)`** — total count of `ERROR` level entries.
   - **`Dictionary<string, int> ErrorCountByService(IEnumerable<LogEntry> logs)`** — error count per service, descending by count.
   - **`IReadOnlyList<int> TopAffectedUsers(IEnumerable<LogEntry> logs, int top)`** — distinct user IDs (excluding null) sorted by how many error entries they have, take top N.
   - **`TimeSpan AverageTimeBetweenErrors(IEnumerable<LogEntry> logs)`** — gap between consecutive error timestamps, averaged. Hint: use `.Zip()` on the sequence and its tail.
   - **`IEnumerable<LogEntry> RecentByLevel(IEnumerable<LogEntry> logs, string level, int n)`** — most recent N entries of a given level. Lazy — return `IEnumerable`, not a materialized list.

4. **In `Program.cs`:**
   - Generate the sample logs.
   - Call each method and print results readably.
   - Demonstrate the difference between iterating `RecentByLevel(...)` once vs twice — show the work re-executes (use `Console.WriteLine` inside a `Where` predicate to make execution visible).

## Done when

- [ ] Every method uses LINQ method syntax (no manual `for`/`foreach` accumulation).
- [ ] Return types are honest: lazy-returning methods return `IEnumerable<T>`; materialized results return `IReadOnlyList<T>` or `Dictionary<K,V>`.
- [ ] You can articulate why `AverageTimeBetweenErrors` would be wrong if it didn't materialize the sequence first (think about ordering + iteration).
- [ ] You can explain the lazy-evaluation re-execution behavior you observed.

## Bonus

- Add a `IEnumerable<(LogEntry First, LogEntry Last)> ConsecutiveErrorsBySameUser(...)` that pairs adjacent error entries when they're for the same user — useful for finding error storms.
- Write the same queries in LINQ *query syntax* (`from ... where ... select ...`) and compare readability.
- Convert one of the queries to operate on `IAsyncEnumerable<LogEntry>` using `System.Linq.Async`.

## Save to

`progress/<today>/working-folder/csharp-and-dotnet/06-logs/`.

---

## Clean Code Lens

**Principle in focus:** LINQ Chains as Readable Sentences; Named Intermediate Variables for Complex Queries

A well-written LINQ chain reads like a description of the problem: `logs.Where(isError).GroupBy(byService).OrderByDescending(byCount)` narrates its intent. When a chain grows past three or four clauses, or when the lambda expressions become multi-line, it starts to resist reading. At that point, breaking the chain into named intermediate variables — `var errorLogs = logs.Where(...)`, `var groupedByService = errorLogs.GroupBy(...)` — gives each step a name that explains what it produces, not just what operation was applied.

**Exercise:** Take your `ErrorCountByService` method and write it as a single LINQ expression chain with no intermediate variables. Then rewrite it by assigning each meaningful step to a named variable. Read both versions aloud. In the named version, each variable name should describe the result of the step, not the operation (e.g., `errorsByService`, not `grouped`). Compare how fast a reader can follow each version.

**Reflection:** In `AverageTimeBetweenErrors`, you needed to materialize and sort the sequence before using `.Zip`. What would have happened if you had left it lazy — and what does that pitfall reveal about the difference between a LINQ chain that is easy to read and a LINQ chain that is easy to reason about correctly?
