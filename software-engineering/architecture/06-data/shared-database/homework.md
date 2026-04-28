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
