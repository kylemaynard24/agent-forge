# Homework — Hexagonal (Ports and Adapters)

> Move infrastructure to the edges. Make the core a hexagon with named ports.

## Exercise: Convert a coupled service to hexagonal

**Scenario:** `SubscriptionService` directly imports a Postgres client, the SendGrid SDK, and an Express `req` object. Tests are slow; swapping providers is "next quarter's work."

**Build:**
- Identify the **driven ports**: what does the core *need*? (Likely: `SubscriptionRepository`, `EmailSender`, `Clock`.)
- Identify the **driving ports**: what does the core *offer*? (Likely use cases: `subscribe(...)`, `cancel(...)`.)
- Move the core into a `core/` folder; move adapters to `adapters/http/`, `adapters/postgres/`, `adapters/sendgrid/`, `adapters/test/`.
- Wire everything in a single composition-root file.

**Constraints (these enforce the concept):**
- Nothing in `core/` imports any third-party SDK or framework.
- Each port is a small interface (≤4 methods).
- Tests in `core/` use only test adapters and complete in milliseconds.
- Adding a CLI delivery mechanism is a new adapter file with no edits to the core.

## Stretch
Add a `Clock` port so time-dependent logic (renewal dates, expirations) doesn't depend on `Date.now()`. The test adapter is a controllable clock; the prod adapter wraps `Date`.

## Reflection
- Hexagonal and Clean Architecture share DNA. What's the relationship? (Hint: hex is the older, simpler frame; Clean adds explicit concentric rings.)
- "Ports are interfaces" — but in JS, interfaces don't formally exist. How do you keep them honest? (Type checks? Conventions? TS?)

## Done when
- [ ] `grep -r 'pg\|sendgrid\|express' core/` returns nothing.
- [ ] Core tests run with no network, no DB, no mailer.
- [ ] Adding a CLI command for `cancel` requires no core edits.

---

## Clean Code Lens

**Principle in focus:** Name Ports from the Application's Perspective, Adapters from the Infrastructure's

In Hexagonal Architecture, port names belong to the application's vocabulary (`SubscriptionRepository`, `EmailSender`, `Clock`) while adapter names belong to the infrastructure's (`PostgresSubscriptionRepository`, `SendGridEmailSender`, `SystemClock`). This split means a developer reading the core never encounters an infrastructure concept by name, and a developer reading an adapter immediately knows both what it connects to and what application port it satisfies.

**Exercise:** Audit your port names by applying this test: could the name appear in a conversation with a product manager who has never heard of Postgres or SendGrid? If yes, the port is correctly named from the application's perspective. Then check your adapter names: does each one encode both the technology (`Postgres`, `SendGrid`) and the port it implements (`SubscriptionRepository`, `EmailSender`)? If an adapter name omits either half, a future developer won't know what it connects or what it satisfies without reading the code.

**Reflection:** The `Clock` port is named from the application's perspective (the app needs to know the current time) rather than from the system's (`SystemTime`, `DateProvider`). What does choosing "Clock" over "DateProvider" reveal about how port naming should favor the *use case* over the *capability*?
