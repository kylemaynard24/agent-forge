# Homework — Bridge

> Decouple an abstraction from its implementation so they can vary independently.

## Exercise: Notification × Transport

**Scenario:** Build a `Notification` hierarchy (`SimpleNotification`, `UrgentNotification` that retries 3x, `ScheduledNotification`) that's independent from a `Transport` hierarchy (`Email`, `Sms`, `Slack`).

**Build:**
- A `Notification` abstraction holding a reference to a `Transport`.
- Three notification subclasses with different policies (no retry, retry-3, scheduled).
- Three transport implementations.
- A demo that combines them: `new Urgent(new Slack())`, `new Scheduled(new Email())`, etc.

**Constraints (these enforce the pattern):**
- Adding a new transport (e.g., `WhatsApp`) must touch zero notification classes.
- Adding a new notification subtype must touch zero transports.
- The `Notification` class must not know how the transport actually sends — it only calls `transport.send(message)`.

## Reflection

Compute how many classes naive inheritance would need for **4 notifications × 5 transports**: 4 × 5 = 20. With Bridge: 4 + 5 = 9. Now imagine 6 × 8.

## Stretch

What happens when `UrgentNotification` needs the transport's *failure type* to decide whether to retry (e.g., retry on `NetworkError`, not on `AuthError`)? How do you keep Bridge intact without leaking transport types into the notification?

## Done when

- [ ] Demo runs all combinations.
- [ ] Adding a 4th transport requires zero edits to notification classes.
