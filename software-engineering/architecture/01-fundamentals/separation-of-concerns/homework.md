# Homework — Separation of Concerns

> Untangle a function doing too much. The constraints force the seams.

## Exercise: Refactor a bloated registration handler

**Scenario:** You inherit a 60-line function `registerUser(req, res)` that does everything: read form data, validate email + password strength, hash the password, insert a DB row, send a welcome email, log the event, write the response.

**Build:**
- Identify the concerns (aim for at least four modules).
- Refactor without changing externally observable behavior.
- Wire them together in a thin orchestrator that lives at the HTTP edge.

**Constraints (these enforce the concept):**
- The validation module knows nothing about HTTP, DB, or email.
- The persistence module knows nothing about HTTP or email.
- No module imports more than one other domain module directly.
- You can swap the mailer for a no-op in a test with one line of wiring.

## Stretch
Write three unit tests, each exercising exactly one module without standing up the others. If you find yourself mocking, the seam isn't clean enough.

## Reflection
- Where did you draw the line between "concern" and "step"? Defend the line.
- Which concern would you split next if the file grew?

## Done when
- [ ] Each module is independently testable without mocking unrelated dependencies.
- [ ] Mailer swap is one line.
- [ ] No module imports HTTP types except the orchestrator.
