# Homework — Shared Database

> Apply (and feel) the coupling. The **constraints** are the point.

## Exercise: Cause your own pain, then fix it

**Scenario:** Two services — `BillingService` and `ReportingService` — both query the same `invoices` table. The billing team wants to rename `amount_cents` to `amount_minor_units`.

**Build:**
- A shared `db` object with an `invoices` table.
- Both services running queries against it.
- A "schema migration" that renames the column.
- A test run that exercises both services before and after the migration.

**Constraints (these enforce the concept):**
- Both services must read the **same** column directly. No abstraction layer.
- The migration must happen as a single mutation on `db`. No coordination layer.
- One service must be updated to the new name; the other deliberately not.
- The broken service's failure must be **silent** (returns wrong data, not an error). That is the realistic horror.

## Stretch
- Add a "view" or wrapper that both services consume to insulate them from the rename. Where does that live, and who owns it?
- Add a third service that writes a new column. What is the deploy ordering required to introduce it safely?

## Reflection
- The team has 6 services on this DB. A column rename now requires coordinating 6 deploys. Estimate the engineering hours per change. When does extracting a service-owned DB pay for itself?

## Done when
- [ ] Both services work pre-migration.
- [ ] One returns wrong / undefined data post-migration without throwing.
- [ ] You can articulate, in writing, the exact moment this design starts costing more than it saves.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names — table naming conventions are the only enforced boundary in a shared schema

When two services share a single database, a table named `invoices` is owned by no one; a table named `billing_invoices` carries the owning service's name as a prefix, making ownership visible to every developer who runs a query or reads a migration file. Naming conventions in a shared schema are not cosmetic — they are the last line of defense against accidental cross-service coupling when no module boundary exists.

**Exercise:** Extend your shared `db` to include a second logical domain (e.g., add a `reporting_snapshots` table). Apply a strict prefix convention (`billing_` and `reporting_`) to every table. Then write a lint rule (even a comment-level convention document) that explains the prefix scheme and what constitutes a violation, so the convention survives beyond the engineers who invented it.

**Reflection:** When the billing team renames `billing_invoices.amount_cents`, what would a prefix-plus-documentation convention have made visible that a bare table name `invoices` would not?
