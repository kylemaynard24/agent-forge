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

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Open/Closed Principle

The factory method's name is a declaration about the family of objects being created — `createNotification` tells the reader that subclasses decide the product type, and the concrete center's class name (`EmailCenter`, `SmsCenter`) tells the reader which family. Applied cleanly, the base class reads like a policy template ("every notification center logs, retries, and dispatches") and each subclass is a single, obvious specialization. Applied messily, a base class whose `createNotification` contains conditional logic based on a `this.type` property has folded the factory method back into a switch statement — the `new` keyword has just been moved, not removed.

**Exercise:** Read only the base `NotificationCenter` class — not the subclasses. The method that calls `this.createNotification()` should read like a complete, domain-correct algorithm for "how do we send a notification?" If you find yourself wanting to open a subclass to understand what `send()` does, the base class is not self-documenting its algorithm clearly enough.

**Reflection:** The constraint says each subclass overrides exactly one method — but the class name (`EmailCenter`) carries the full story of what that override does. If someone renamed `EmailCenter` to `ConcreteNotificationCenter1`, what information would be lost, and how much of the pattern's clean-code value depends on the subclass name rather than the code?
