# Homework — Delegates, events, and functional C#

Build a small event-driven system that uses delegates, events, and the functional Strategy form.

## Build it

1. **`Stopwatch` class** with:
   - A private `bool _running`.
   - An event `event EventHandler? StartedRunning;` and `event EventHandler? StoppedRunning;`.
   - Methods `Start()`, `Stop()`, `Reset()` that toggle `_running` and raise the appropriate events.
   - A property `bool IsRunning => _running;`.

2. **`StopwatchDisplay` class** that subscribes to a `Stopwatch`'s events and prints messages on each transition. Constructor takes a `Stopwatch` and wires up subscriptions. Implement `IDisposable` so `Dispose()` unsubscribes — demonstrating the lifecycle discipline. Use `using var display = new StopwatchDisplay(stopwatch);` in the demo to see auto-disposal.

3. **`OrderProcessor` class** with a method:
   ```csharp
   public ProcessResult Process(
       Order order,
       Func<Order, ValidationResult> validator,
       Func<Order, decimal> pricer,
       Action<Order, decimal> auditor)
   ```
   The processor calls `validator`, then `pricer`, then `auditor`. Each is a *strategy* the caller passes in. This is composition via Func/Action without any interfaces.

4. **In `Program.cs`:**
   - Create a `Stopwatch`. Create a `StopwatchDisplay` wrapping it (using `using`).
   - Start, stop, start, stop the stopwatch — show subscriber output.
   - Let the `using` go out of scope; the display unsubscribes automatically.
   - Raise more events on the stopwatch — show the display does NOT print (because it unsubscribed).
   - Use `OrderProcessor` with three different strategy combinations (e.g., a strict validator, a loose validator; a normal pricer, a discounted pricer; a console auditor, a silent auditor). Show the same processor producing different end-to-end behavior based on which strategies are passed.

## Done when

- [ ] `Stopwatch` raises events; `StopwatchDisplay` subscribes via `+=` in its constructor and unsubscribes via `-=` in its `Dispose()`.
- [ ] After the `using` scope exits, no more output from the display.
- [ ] `OrderProcessor` works with different combinations of validator/pricer/auditor without modification.
- [ ] You can articulate why making `validator`/`pricer`/`auditor` `Func<>`/`Action<>` parameters is preferable to defining three single-method interfaces in this case.

## Bonus

- Add a `LoggingEvents` static class with extension methods on `Stopwatch` like `LogToConsole(this Stopwatch sw)` that subscribes; show how extension-based subscribers reduce boilerplate.
- Demonstrate the loop-variable capture bug from the README (deliberately create the bug, then fix it).

## Save to

`progress/<today>/working-folder/csharp-and-dotnet/07-events/`.
