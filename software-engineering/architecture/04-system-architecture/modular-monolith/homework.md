# Homework — Modular Monolith

> One deployable. Enforced module boundaries.

## Exercise: Define a public API for an existing module

**Scenario:** You have a monolith with three modules: `billing`, `notifications`, `users`. Code throughout the app reaches directly into `users/db/queries.js` and `users/util/email-validator.js`.

**Build:**
- Define `users/index.js` (public API). Export ONLY: `createUser`, `getUserById`, `getUserByEmail`, `User` type.
- Mark all other files as internal (you can use a folder convention: `users/_internal/`).
- Add an ESLint rule (or in JS without TS, a lint-style script) that fails CI if any file outside `users/` imports from `users/_internal/`.
- Refactor every caller in `billing` and `notifications` to use only the public API.

**Constraints (these enforce the concept):**
- After the refactor, `grep -r "from 'users/_internal" billing/ notifications/` returns nothing.
- The public API doesn't leak DB types (no `User extends Knex.Model` in the export).
- Adding a new internal helper doesn't require coordinating with `billing` or `notifications`.
- You can swap the underlying DB driver without touching `billing` or `notifications`.

## Stretch
Write down the *signature contract* of the `users` module's public API in a comment block at the top of `users/index.js`. Include:
- Inputs (types and constraints).
- Outputs and error modes.
- Idempotency / ordering guarantees.

This contract is what survives if you ever extract `users` into its own service.

## Reflection
- "Module boundaries that need discipline have already failed." How do you make boundaries harder to violate than to respect?
- Why is `users/index.js` better than `users/UserService.js` as the public face? (Hint: services and types and interfaces all live behind the index — callers don't know what kind of thing they imported.)

## Done when
- [ ] No cross-module file reaches past `users/index.js`.
- [ ] CI fails if someone tries to.
- [ ] You can describe the `users` module to a new hire by handing them only `index.js`.
