# Homework — Event Sourcing

> Apply append-only history with derived state. The **constraints** are the point.

## Exercise: Shopping cart from events

**Scenario:** Build a shopping cart whose state lives only as events: `ItemAdded`, `ItemRemoved`, `QuantityChanged`, `CartCheckedOut`.

**Build:**
- An append-only event log (array is fine, but treat it as immutable).
- A `cartState(events)` pure fold that returns `{ items: { sku: qty }, checkedOut: bool }`.
- Command functions (`addItem`, `removeItem`, `setQuantity`, `checkout`) that validate and append.
- A `replayUpTo(seq)` so you can ask: "what did this cart look like 3 events ago?".

**Constraints (these enforce the concept):**
- No mutable cart object. State only exists as the result of folding the log.
- A command must never modify a past event. Only append.
- A command may reject (throw) — rejections produce no event.
- Two `cartState(log)` calls on the same log must always be equal (referential transparency on the fold).

## Stretch
- Add a snapshot every 100 events to speed up replay. When does the snapshot become wrong?
- Add an event version field and handle a `QuantityChanged.v2` that adds a `reason` field without breaking v1.

## Reflection
- A bug shipped that double-counted quantities. With a traditional CRUD store, you would have lost data. With event sourcing, what is your recovery move?

## Done when
- [ ] Cart state computed from a 10+ event log.
- [ ] Historical state at 3 different points.
- [ ] Invalid command rejected with no event appended.
