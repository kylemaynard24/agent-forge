# Homework — Factory Method

> The base class shouldn't know which concrete product it creates — the subclass decides. Force the seam.

## Exercise: Notification center

**Scenario:** A `NotificationCenter` has shared logic (logging, retries on failure, rate limiting). Subclasses `EmailCenter`, `SmsCenter`, `PushCenter` decide *which* notification gets created and dispatched.

**Build:**
- An abstract `NotificationCenter` with a template method `send(payload)` that calls `this.createNotification(payload)`, then logs, then dispatches with retry on failure.
- Three concrete centers that override only `createNotification` to return their respective notification types.
- Each `Notification` subtype has its own `dispatch()` that prints what would happen.

**Constraints (these enforce the pattern):**
- The base class must contain zero `if (type === ...)` chains.
- Adding a new `SlackCenter` is one new file with zero edits to existing files.
- Each subclass overrides exactly one method.

## Stretch

Add a `SilentNotificationCenter` that returns a `NoOpNotification` (does nothing). Show how this lets you mute a channel during incidents without modifying the parent.

## Reflection

- What's the difference between Factory Method and Abstract Factory? When would you reach for each?

## Done when

- [ ] Demo runs and shows all three centers dispatching their respective notifications.
- [ ] Adding a fourth center requires zero edits to the base class.
