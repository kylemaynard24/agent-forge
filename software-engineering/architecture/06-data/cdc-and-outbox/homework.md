# Homework — CDC and Transactional Outbox

> Apply atomic event publication. The **constraints** are the point.

## Exercise: Reliable order events

**Scenario:** Each `placeOrder` writes an `Order` row. A downstream service must receive an `OrderPlaced` event for every committed order, exactly never for rolled-back orders, and at-least-once for the rest.

**Build:**
- A fake DB with begin/commit/rollback semantics on `orders` and `outbox` tables.
- A `placeOrder(order)` that writes to both tables in a single transaction.
- A relay that polls the outbox at 100ms intervals and publishes each unpublished row, then marks it published.
- A consumer that records which events it has seen and asserts idempotency.

**Constraints (these enforce the concept):**
- The order row and the outbox row must commit or roll back **together**. No partial writes.
- The relay must mark a row published only **after** the bus accepts it. Crash mid-publish must result in a redelivery, not a loss.
- The consumer must be idempotent — duplicate `OrderPlaced` for the same `orderId` must not produce duplicate downstream effects.
- No code path may publish to the bus directly from `placeOrder`. The relay is the only publisher.

## Stretch
- Make the bus reject 30% of publishes. Verify no events are lost.
- Replace the polling relay with a CDC-style approach: tail an append-only log of committed transactions. Discuss how it differs operationally.

## Reflection
- Without the outbox, `db.save(); bus.publish()` has two failure modes that corrupt the system. Name them and explain which is worse.

## Done when
- [ ] Rolled-back orders produce no events ever.
- [ ] All committed orders produce at least one event.
- [ ] Duplicate deliveries are absorbed by an idempotent consumer.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names — the outbox table schema is a contract read cold

An outbox column named `type` is ambiguous between event type, message type, and entity type; `event_type` is clearer but `event_type_name` plus a separate `aggregate_type` column makes the distinction between "what happened" and "to what entity" unambiguous to a developer reading the table dump during an incident. Every column in the outbox is documentation that must survive the engineer who wrote it leaving the company.

**Exercise:** Write out your outbox table schema as a `CREATE TABLE` statement with a one-line comment on each column explaining what it holds, what values are valid, and what a NULL means. If any column comment requires more than one sentence, the column name is not doing enough work — rename it.

**Reflection:** If a relay developer joined the team and could only read the outbox table schema (no application code), could they implement a correct relay from the column names and comments alone?
