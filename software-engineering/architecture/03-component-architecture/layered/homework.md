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
