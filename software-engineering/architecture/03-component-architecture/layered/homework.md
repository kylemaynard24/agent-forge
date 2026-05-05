# Homework — Layered Architecture

> Layers only call down. Enforce the rule.

## Exercise: Detangle a fat controller

**Scenario:** A 200-line `OrderController` parses the HTTP request, validates input, looks up the customer's tier, computes a discount, writes to the DB, sends a confirmation email, and returns JSON. Tests need an HTTP server, a database, and a mailer.

**Build:**
- Move data access into an `OrderRepository`.
- Move discount + ordering rules into an `OrderService`.
- Keep only HTTP plumbing (parse req, format response) in the controller.
- Wire them at the composition root (entry-point file).

**Constraints (these enforce the concept):**
- Controllers don't import any DB types.
- Services don't import any HTTP types (no `req`, `res`, `Request`, status codes — except mapped via thrown errors).
- Repositories don't import service or HTTP types.
- A unit test of the service runs with no network and no mailer.

## Stretch
A new requirement: emails should be sent asynchronously via a queue, not in-line. Where does this change live? Defend why the answer should NOT be "the controller."

## Reflection
- What's the most common way layered architecture rots? (Hint: a "utils" or "helpers" layer everyone imports from.)
- When you can't decide whether logic is "business" or "data," what does that signal about your design?

## Done when
- [ ] Controller contains no SQL or DB types.
- [ ] Service contains no HTTP types.
- [ ] You can call the service from a CLI script without modification.

---

## Clean Code Lens

**Principle in focus:** Each Layer's Interface Hides the Layer Below — Encapsulation at Scale

Layers are a clean code principle applied at the architectural level: just as a class hides its fields behind methods, a layer hides the layer below it behind an interface that speaks the vocabulary of the layer above. When a service leaks SQL types or a controller imports repository classes directly, the layer boundary has failed at its core promise — it has stopped being an abstraction and become a thin label on a transparent dependency.

**Exercise:** For each layer boundary in your refactor (`Controller → Service`, `Service → Repository`), write down every type that crosses the boundary as a parameter or return value. Verify that none of those types belong to the layer being called — the `OrderService` should accept and return domain types, not `KnexQueryBuilder` or `Request`. Any infrastructure or HTTP type that crosses a layer boundary is a clean code smell at the architectural scale.

**Reflection:** The most common rot path for layered architecture is a "utils" or "helpers" layer that every other layer imports from. Why does a shared utility layer undermine the *direction* discipline that makes layering work — and what's the right alternative when two layers genuinely share a small piece of logic?
