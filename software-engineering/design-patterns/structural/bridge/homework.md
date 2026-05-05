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

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Separation of Concerns

Bridge produces two independent hierarchies, and the naming burden is doubled — each class must communicate its role on its own axis clearly enough that a reader can understand the whole combination just from the class names at the call site: `new UrgentNotification(new SlackTransport())` should describe both the policy and the channel without opening either file. Applied cleanly, abstraction names describe *what kind of behavior* (`UrgentNotification` — retry policy, elevated priority) and implementation names describe *the mechanism* (`SlackTransport` — how bytes move); applied messily, names like `NotificationImpl2` or `ConcreteTransportA` collapse both axes into meaningless labels, requiring the reader to open files to understand the combination.

**Exercise:** Write all nine combinations from your demo as a table: notification type × transport. The combination should be understandable from the class names alone — if you need to read any class body to answer "does `ScheduledNotification` with `SmsTransport` retry on failure?", the abstraction's name isn't carrying enough information.

**Reflection:** The pattern enforces that `Notification` only calls `transport.send(message)` — one method, one name. What would happen to the Bridge's clean separation if `UrgentNotification` needed to call `transport.getFailureType()` to decide retry behavior, and how does the stretch goal's question reveal the boundary between clean extension and leaking concerns?
