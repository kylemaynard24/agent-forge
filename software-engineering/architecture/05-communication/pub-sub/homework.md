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
