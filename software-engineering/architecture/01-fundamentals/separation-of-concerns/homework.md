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

---

## Clean Code Lens

**Principle in focus:** Meaningful Names as Concern Boundaries

Each concern deserves a name that defines both what it does *and* what it explicitly refuses to do — a module called `UserValidator` makes a clean promise that it validates users and nothing else, while a module called `UserHelper` or `UserUtils` signals that concerns were never really separated, just redistributed. If you can't name a concern without reaching for "and" or "util", the separation is incomplete.

**Exercise:** Write a one-sentence description of each module you created in the refactor, using the form: "[ModuleName] is responsible for [X] and knows nothing about [Y]." The "knows nothing about" clause is the test — if you struggle to fill it in, the module's boundary hasn't been drawn sharply enough to give it a trustworthy name.

**Reflection:** The orchestrator is the one place all concerns are visible together. How do you name an orchestrator so it communicates "I coordinate, I don't execute" — and what names (like `UserRegistrationService`) accidentally imply it does more than coordinate?
