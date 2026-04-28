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
