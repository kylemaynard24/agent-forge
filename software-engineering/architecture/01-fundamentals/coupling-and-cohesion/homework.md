# Homework — Coupling and Cohesion

> Lower coupling, raise cohesion. The constraints make it visible.

## Exercise: Detangle a god-class

**Scenario:** You inherit `UserManager` with these methods all in one file:
`createUser`, `validateEmail`, `hashPassword`, `sendWelcomeEmail`, `logAudit`,
`exportUsersToCSV`, `parseCSVImport`, `formatPhoneNumber`, `geocodeAddress`,
`computeSubscriptionRenewalDate`.

**Build:**
- Group the methods by cohesion. Name each group with a noun that predicts its contents.
- Move each group to its own module.
- Wire `createUser` so it depends on the smallest possible set of those modules.

**Constraints (these enforce the concept):**
- After splitting, no module exposes more than 5 public methods.
- A group's name must predict 100% of its contents (no `XyzUtils` or `XyzHelpers`).
- `createUser` must not import unrelated modules (e.g., the CSV importer).
- Use *data coupling*: pass exactly the inputs each module needs, not the whole `User` object.

## Stretch
Compute a coupling matrix: for each pair of modules, mark "depends on" / "depends on" / "neither". Aim for fewer than `n` total edges (where `n` = number of modules). If you have a star around one module, that module is the new god.

## Reflection
- Which method was hardest to place? Why? (Often it's the one that doesn't really belong anywhere.)
- Did splitting make any test simpler? If no test got simpler, you may have just shuffled deck chairs.

## Done when
- [ ] No module's name lies about its contents.
- [ ] `createUser`'s import list is short and obvious.
- [ ] Tests for `validateEmail` don't need a database.
