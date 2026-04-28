# Homework — Monolith

> Build the right monolith first. Microservices later, if ever.

## Exercise: Add a feature to a monolith and notice the costs you DIDN'T pay

**Scenario:** You have a small monolith (todo app, blog, whatever). Add a "notifications" feature: when a user is mentioned in a comment, log a notification for them. They can see their unread notifications.

**Build:**
- A `Notifications` module with `create(userId, message)`, `unread(userId)`, `markRead(notificationId)`.
- Modify the `Comments` module: when a comment text contains `@username`, look up that user and call `Notifications.create(...)`.

**Constraints (these enforce monolith awareness):**
- All three modules (Users, Comments, Notifications) live in one codebase, one process.
- They share the same data store (or in-memory state).
- Cross-module calls are direct function calls — no event bus, no HTTP, no queues.

## Stretch
Write a sentence for each "cost you didn't pay":
- No network round-trip on the mention lookup.
- No need to deal with "what if Notifications is down?"
- No saga to handle "comment created but notification failed."
- No service-to-service authentication.
- No version skew between deployments.

Then sketch what each of those would look like if Notifications were a separate service. This is your YAGNI defense for the next "should we be microservices?" conversation.

## Reflection
- A monolith does not mean a *messy* monolith. What's the difference, and how does the next chapter (modular monolith) push back on that confusion?
- When does the monolith start to hurt? Pick three concrete signals — not "when we have many services" but actual symptoms.

## Done when
- [ ] `@user` mentions create notifications without leaving the process.
- [ ] You can articulate at least 3 distributed-systems problems that don't apply here.
- [ ] You're suspicious of arguments that say "we need to be microservices" without naming a concrete pain.
