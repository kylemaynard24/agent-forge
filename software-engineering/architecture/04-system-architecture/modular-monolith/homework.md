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

---

## Clean Code Lens

**Principle in focus:** The Public API as a Named Contract — `index.js` Is the Interface, Not a File

In a modular monolith, `users/index.js` is the clean code boundary made tangible: it is a named, explicit contract that says "these four exports are everything `users` promises to the world," exactly as a well-designed class interface promises exactly what callers may depend on and hides everything else. A module that leaks DB types through its public API (`User extends Knex.Model`) has committed the same error as a class that exposes its private fields — the implementation detail becomes part of the contract, and the module can never change its internals without breaking callers.

**Exercise:** Read `users/index.js` as if you are `billing` — a module that has no access to `users/_internal/`. Write down every assumption `billing` must make about `users` based solely on the public API surface. Then check whether any of those assumptions encode infrastructure details (e.g., that `getUserById` returns a synchronous result, that `User` has a specific DB shape). Each infrastructure assumption in the public API is a coupling that will make the eventual service extraction harder than it needs to be.

**Reflection:** The homework notes that `users/index.js` is better than `users/UserService.js` as the module's public face because callers don't know what kind of thing they imported. What does this reveal about the difference between *hiding the implementation* and *hiding the implementation type* — and why does the latter matter more as a module grows?
