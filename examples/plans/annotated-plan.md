# Annotated plan example

A realistic plan output with inline commentary on what makes it good. Use as a yardstick when judging plans Claude gives you.

---

## User prompt

> Plan the JWT migration. Context: we're migrating from cookie-based sessions to signed JWTs because legal flagged the session-token storage.
>
> I care most about:
> - No flag-day for existing sessions
> - Keeping the `@require_auth` decorator signature unchanged
> - A test covering mixed cookie+JWT traffic during the transition.

## Plan (with annotations)

**Goal restated:** Migrate from cookie sessions to JWTs without a flag day, preserving `@require_auth`'s signature, and validating mixed-traffic handling with an integration test.

> ✅ **Restates the goal in its own words** — proves comprehension before diving in. If the restated goal is wrong, you catch it now instead of after the code is written.

### Scope

- In: `auth/sessions.py`, `auth/decorators.py`, `auth/jwt.py` (new), `tests/auth/*`
- Out: `admin/auth.py` (separate auth system), client SDK changes (follow-up PR)

> ✅ **Explicit in/out scope** — prevents drift mid-implementation. The "out" list is at least as important as the "in."

### Files and changes

1. **`auth/jwt.py`** — new. Exports `encode(payload) -> str`, `decode(token) -> dict | None`. Uses the `cryptography` library (already in deps).
2. **`auth/sessions.py`** — add `resolve_session(request) -> Session | None`. Tries JWT header first, falls back to existing cookie path. Returns the same `Session` object from either source.
3. **`auth/decorators.py`** — `@require_auth` now calls `resolve_session` instead of `read_cookie`. **Signature unchanged** — callers don't need to change.
4. **`tests/auth/test_mixed_traffic.py`** — new. Parametrized across: JWT-only, cookie-only, both present (JWT wins), neither (401).

> ✅ **Specific paths, specific functions, specific signatures.** You can push back on any of these individually ("actually I want `decode` to raise, not return `None`") instead of re-litigating the whole plan.

### Order of operations

1. Land `auth/jwt.py` + unit tests. Nothing calls it yet — zero runtime risk.
2. Land `resolve_session` with its fallback logic + tests. Decorator still on the cookie path.
3. Flip `@require_auth` to call `resolve_session`. Land with the mixed-traffic integration test.
4. After one release cycle and telemetry confirms zero cookie traffic, remove the fallback. **Separate PR.**

> ✅ **Phased rollout.** Each phase ships independently. Phase 4 is gated on telemetry, not time.

### Rollback

- Phases 1–2: revert the new code. No user-visible change.
- Phase 3: revert the decorator change. The cookie fallback still exists.
- Phase 4: don't — landing phase 4 means we've already confirmed cookies aren't in use.

> ✅ **Rollback story per phase** — not "well we'd revert." Named, specific, and explains why phase 4 is intentionally a one-way door.

### Alternatives considered

- **Replace cookies wholesale, no fallback.** Rejected — flag day for users mid-session.
- **Dual-write (set both cookie and JWT for a release cycle).** Rejected — legal flagged cookie *storage*, not issuance; dual-write still stores cookies.
- **Opaque tokens instead of JWTs.** Rejected — requires a session store we'd have to build; JWT is self-contained.

> ✅ **Names alternatives and reasons for rejection.** A plan without rejections skipped the thinking step. This is the difference between "Claude does what I say" and "Claude weighs options."

### Open questions

1. How should we handle the `X-Session-Id` header the mobile client sends today? (Out of scope here; flagging for mobile team.)
2. JWT TTL — match the current 30-day cookie lifetime, or shorter? Leaning shorter (7 days) with silent refresh; want your call.

> ✅ **Surfaces ambiguity rather than hiding it.** Question 2 is one the planner genuinely can't answer — forcing the decision to the right place.

---

## What to demand in every plan

- **Restated goal** — so you catch misunderstandings early
- **Specific paths and signatures** — not "update auth code"
- **Phases with rollback stories** — not "land it all"
- **Rejected alternatives with reasons** — shows judgment, not obedience
- **Open questions** — shows honesty about ambiguity
- **Named tests** — not "we'll add tests"

When a plan is missing one of these, say so and ask for it before approving. It's cheaper than discovering the gap during implementation.

## When a plan is *too* elaborate

Not every task needs all of the above. A 3-line typo fix doesn't need a rollback story. Use judgment — match plan depth to task risk. If you find yourself planning a trivial change, skip plan mode and just edit.
