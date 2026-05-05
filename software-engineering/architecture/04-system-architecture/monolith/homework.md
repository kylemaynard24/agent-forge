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

---

## Clean Code Lens

**Principle in focus:** Internal Structure Must Maintain Clean Code Properties or the Monolith Rots

A monolith is not an architectural style — it is a deployment unit, and its quality is entirely determined by the clean code discipline inside it. The monolith becomes hard to maintain when module names start lying (`Comments` that also handles notifications), classes accrue responsibilities, and coupling grows because there is no technical barrier to calling anything from anywhere. The deployment unit is not the problem; the loss of naming, SRP, and cohesion is.

**Exercise:** After adding `Notifications`, audit the cross-module call you introduced: `Comments` calls `Notifications.create(...)`. Write this dependency explicitly as an arrow in a module diagram and ask whether it would survive a modular monolith boundary rule (is it going through a public API, or bypassing it?). Then name the smell if `Comments` were to start importing `Notifications` internal helpers directly — this is the exact rot path a modular monolith prevents with enforced boundaries.

**Reflection:** The Stretch exercise lists costs you didn't pay (no saga, no auth, no version skew). Each of those costs maps to a distributed-systems problem that your clean, in-process code sidesteps entirely. Which of the costs on that list would be the *first* to force a real architectural change if the monolith started to hurt — and what would be the concrete symptom that told you the time had come?
