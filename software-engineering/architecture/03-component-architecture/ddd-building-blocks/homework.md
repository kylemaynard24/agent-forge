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

---

## Clean Code Lens

**Principle in focus:** Ubiquitous Language — Code Uses the Domain's Exact Words

DDD's ubiquitous language is clean code applied at the model level: when a warehouse manager says "receive stock," "reserve units," and "ship reserved items," those exact words should appear as method names in the code with no translation layer in between. A method named `incrementQuantity` instead of `receive` is a naming failure that forces every developer to maintain a mental dictionary between code concepts and domain concepts.

**Exercise:** Read the four `InventoryItem` method names — `receive`, `reserve`, `release`, `ship` — to a non-developer who understands warehouse operations. Ask them to predict what each method does and what it prevents. If they can answer correctly without seeing the code, the ubiquitous language is working. Then audit `StockLevel`'s `available()` method: is "available" the exact word a warehouse manager uses, or is it a developer's approximation of "on-hand minus reserved"?

**Reflection:** The `Reservation` stretch exercise asks where to put the complexity of tracking *which order* a reservation belongs to. The answer turns on whether "a reservation belonging to an order" is a concept the domain expert uses — does your domain expert actually say "release the reservation for order #42", or do they say something simpler? How does their vocabulary tell you where the complexity belongs?
