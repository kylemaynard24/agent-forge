# Homework — Exceptions and using

Build a small file-processing utility that exercises proper exception handling, resource management, and the Try* pattern.

## Build it

1. **`ConfigLoader` static class** with two parallel methods, demonstrating throw-vs-return:
   - `Dictionary<string, string> Load(string path)` — reads a key=value file. Throws `FileNotFoundException` (let it propagate) on missing file. Throws a custom `ConfigParseException` (you define) with line numbers for malformed lines.
   - `bool TryLoad(string path, out Dictionary<string, string>? config, out string? error)` — returns false with an error string instead of throwing. The non-throwing alternative for callers that expect failure.

2. **`ConfigParseException` class:**
   - Inherits from `Exception`.
   - Has a `int LineNumber` property and an `string Line` property.
   - Constructor takes message + line number + line content.

3. **`AtomicFileWriter` sealed class** implementing `IDisposable`:
   - Constructor takes a target path. Internally writes to a temp file (`<path>.tmp`).
   - Method `void Write(string content)` writes to the temp file.
   - Method `void Commit()` renames the temp file to the target path (atomic rename on most filesystems).
   - `Dispose()`:
     - If `Commit()` was called, do nothing (the temp file is already moved).
     - If not, delete the temp file. (Cleans up on exception/abandonment.)
   - Idempotent — `Dispose()` can be called twice safely.

4. **In `Program.cs`:**
   - Demonstrate `ConfigLoader.Load` succeeding on a valid file.
   - Demonstrate `Load` throwing on a malformed file (catch and print the line number).
   - Demonstrate `TryLoad` returning false on the same malformed file (no exception).
   - Demonstrate `AtomicFileWriter` succeeding (write + commit + verify file exists).
   - Demonstrate `AtomicFileWriter` cleaning up after a thrown exception (write some lines, throw before commit, verify the target file does NOT exist and the temp is gone).

## Done when

- [ ] `ConfigParseException` carries useful diagnostic info (line number, line content), not just a message.
- [ ] `Load` throws on bad input; `TryLoad` returns false. Same logic underneath, different surface.
- [ ] `AtomicFileWriter` is `sealed` and implements `Dispose` correctly (idempotent, cleans up on early exit).
- [ ] You used `using` declarations (not `using` statements) in the `Program.cs` demo.
- [ ] You can articulate when to throw vs when to return false.

## Bonus

- Add an async version: `AtomicFileWriter` implementing `IAsyncDisposable` using `await using`.
- Show the difference in stack trace between `throw;` and `throw ex;` — log both, observe the difference, write up which preserves the original throw site.
- Add a `using static` directive somewhere in your code where it makes things more readable.

## Save to

`progress/<today>/working-folder/csharp-and-dotnet/09-config/`.

---

## Clean Code Lens

**Principle in focus:** Exception Messages as Actionable Documentation; No Swallowed Exceptions

An exception message is the most important string in a failure path — it is the first thing an engineer reads when something goes wrong in production. "Parse error" is a lie by omission. "Line 7: expected 'key=value', got 'keyvalue' — check that each config line contains exactly one '=' sign" is documentation that saves an hour of debugging. Swallowed exceptions (`catch (Exception) { }`) are even worse: they replace a true statement about what went wrong with silence, making the program appear to succeed when it did not.

**Exercise:** Look at your `ConfigParseException` and read the message it produces as if you are an engineer who has never seen this codebase. Does the message tell you what was wrong, where it was wrong, and what you would need to fix to make it right? If any of those three elements is missing, rewrite the message until all three are present. Then look at every `catch` block in your code and verify none of them swallow the exception without at minimum logging it.

**Reflection:** Your `TryLoad` method returns `false` and an error string instead of throwing — and your `Load` method throws. Both call the same underlying parse logic. Which surface did you find easier to write tests for, and does that tell you anything about when each pattern genuinely belongs?
