# Homework — Publish / Subscribe

> Apply topic-based decoupling. The **constraints** are the point.

## Exercise: User-signup fan-out

**Scenario:** When a `UserRegistered` event fires, four things must happen: send a welcome email, create a CRM record, warm a recommendation cache, and notify a Slack channel. Each can fail independently.

**Build:**
- An `EventBus` with `subscribe(topic, handler)` and `publish(topic, event)`.
- Four subscribers to `UserRegistered`, each with realistic latency (50-300ms).
- A failure-injection switch on each subscriber so you can break any one at runtime.
- A correlation ID on every event, threaded through every subscriber's logs.

**Constraints (these enforce the concept):**
- The publisher must not know how many subscribers exist; do not pass a list, do not import them.
- A subscriber failure must not affect any other subscriber.
- Subscribers must be `async` and run with no shared ordering guarantees — make this visible in the log.
- Adding a fifth subscriber must require **zero changes** to the publisher or to the other subscribers.

## Stretch
- Add a `subscribeOnce` helper. When would you use it?
- Add a wildcard topic match (e.g. `user.*`) and reflect on whether it makes the system clearer or murkier.

## Reflection
- How would you debug "we sent two welcome emails for the same user"? What would you instrument?

## Done when
- [ ] One publish triggers four handlers.
- [ ] Killing any one handler does not affect the others.
- [ ] Correlation ID appears in every log line.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names — topic names are the pub-sub system's API surface

A topic named `user-events` tells consumers nothing about versioning, what triggered the event, or what fields to expect; a topic named `users.v1.registered` communicates the domain entity, the schema version, and the specific business fact in a single glance. Because topics are subscribed to by name across service boundaries, a vague topic name is the pub-sub equivalent of a method named `doStuff` in a public library.

**Exercise:** Rename your `UserRegistered` topic to follow a `<domain>.<version>.<pastTenseVerb>` convention (e.g., `users.v1.registered`). Then add a second topic `users.v2.registered` with one additional field and verify that your v1 subscriber continues to work without modification — demonstrating that the version in the name is enforcing a real boundary.

**Reflection:** If you needed to add a breaking field to the event payload, what would change in the topic name — and how does that name change protect the four existing subscribers?
