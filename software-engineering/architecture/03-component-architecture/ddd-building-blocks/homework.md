# Homework — DDD Building Blocks

> Model the domain with entities, value objects, and aggregates.

## Exercise: Inventory aggregate

**Scenario:** A warehouse has SKUs with quantities. Operations: receive (increment), reserve (mark some as held for an order), release (un-reserve), ship (decrement, can only ship reserved items). Invariant: `available + reserved = onHand`. You can never reserve more than `available`.

**Build:**
- A `Sku` value object (id + name + sizeUnit).
- A `StockLevel` value object (`onHand`, `reserved`). Immutable; provides `available()`.
- An `InventoryItem` aggregate root with `sku`, `level`, plus methods `receive(qty)`, `reserve(qty)`, `release(qty)`, `ship(qty)`. Each method enforces the invariant atomically.
- An `InventoryRepository` with `save(item)`, `findBySku(sku)`.

**Constraints (these enforce the concepts):**
- Value objects are immutable (`Object.freeze` or private fields + no setters).
- Mutating `level` directly from outside `InventoryItem` must be impossible.
- The repository returns only roots — there is no `findStockLevel` API.
- Every operation either fully succeeds or throws; **no partial state**.

## Stretch
Add a `Reservation` value object that tracks *which order* a reservation belongs to. Now `release` must specify which reservation (so a different order's reservation isn't accidentally released). Where does this complexity belong — inside `InventoryItem`, or in a new aggregate?

## Reflection
- "Aggregates as small as possible." Why? (Hint: lock contention, invariant leakage, cross-aggregate coordination becomes eventual consistency.)
- Why is the repository for an aggregate, not a sub-entity?

## Done when
- [ ] Reserving more than available throws and leaves state untouched.
- [ ] You can fetch an item, mutate it through its methods, save it, and re-fetch it consistently.
- [ ] Value objects are equal-by-value and cannot be mutated after construction.
