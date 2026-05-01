# Homework — Inheritance and polymorphism

Two parts. Part 1 builds a small inheritance hierarchy the right way. Part 2 makes you confront a case where inheritance is the *wrong* tool, and refactor.

## Part 1 — A reasonable hierarchy

Build a tiny notification system using inheritance for genuine is-a relationships.

1. **`abstract class Notification`** — base class with:
   - `string Recipient { get; init; }` (required).
   - `string Message { get; init; }` (required).
   - `DateTime CreatedAt { get; init; } = DateTime.UtcNow;`
   - `abstract void Send();` (each subclass implements).
   - A non-virtual `string Summary() => $"[{CreatedAt:T}] To {Recipient}: {Message[..Math.Min(40, Message.Length)]}";` — note: NOT virtual; subclasses cannot polymorphically replace.

2. **`class EmailNotification : Notification`** — overrides `Send()` to print a fake email line. Adds `string Subject { get; init; }` (required).

3. **`class SmsNotification : Notification`** — overrides `Send()`. Validates in the constructor (or via property) that `Message.Length <= 160`; throws if violated.

4. **`sealed class PushNotification : EmailNotification`** — adds `string DeviceId { get; init; }` (required); overrides `Send()` and ALSO calls `base.Send()` to demonstrate the augment-don't-replace pattern. The class is `sealed` so no further inheritance.

5. **In `Program.cs`:**
   - Build a `List<Notification>` containing one of each.
   - Iterate it, calling `Send()` on each. Show that polymorphism dispatches correctly.
   - Call `Summary()` on each — confirm it works without override.
   - Try to construct an `SmsNotification` with a 200-character message; show the exception.

## Part 2 — Refactor away from inheritance

Now the wrong-design-first part. Here's a sketch of a class hierarchy:

```csharp
public class Logger { public virtual void Log(string msg) { ... } }
public class TimestampedLogger : Logger { public override void Log(string msg) { ... } }
public class JsonLogger : TimestampedLogger { public override void Log(string msg) { ... } }
public class JsonAndDatabaseLogger : JsonLogger { public override void Log(string msg) { ... } }
```

Each layer adds a feature: timestamping, JSON formatting, database persistence. This works for a moment, but it doesn't compose — you can't get JSON-without-timestamp, or database-with-plain-text, without writing more subclasses for each combination.

**Refactor this hierarchy to use composition.** Hint: the Decorator pattern is exactly this problem. Define `ILogger { void Log(string msg); }`, write small implementations like `ConsoleLogger`, `DatabaseLogger`, and DECORATORS like `TimestampDecorator(ILogger inner)`, `JsonDecorator(ILogger inner)` that wrap an inner logger. Then any combination is a chain of `new TimestampDecorator(new JsonDecorator(new ConsoleLogger()))`.

Build the refactored version. Show two different decorator chains in `Program.cs` to demonstrate composability.

## Done when

- [ ] Part 1's `Notification` hierarchy compiles, runs, and demonstrates polymorphic dispatch.
- [ ] `PushNotification` is `sealed` and calls `base.Send()`.
- [ ] Part 2's refactored loggers can produce ANY combination of timestamp + JSON + database via composition, with no class explosion.
- [ ] You can articulate which problem (Part 1's notifications vs Part 2's loggers) was a good fit for inheritance and which wasn't.

## Bonus

- In Part 1, sketch what would make the hierarchy a bad fit. (Hint: imagine you needed `EmailWithSmsBackup` — what shape would that take?)
- In Part 2, add a `FilteringDecorator(ILogger inner, Func<string, bool> filter)` that only logs messages matching the filter.

## Save to

`progress/<today>/working-folder/csharp-and-dotnet/03-notifications/` and `.../03-loggers/`.
