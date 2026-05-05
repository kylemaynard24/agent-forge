# Homework — Database Per Service

> Apply private data ownership. The **constraints** are the point.

## Exercise: Inventory and Pricing as separate services

**Scenario:** Build two services — `InventoryService` (stock counts per SKU) and `PricingService` (current price per SKU). Each owns its own data. A "product detail" endpoint composes both.

**Build:**
- Two service modules, each with its own private in-memory store.
- A public API per service: `getStock(sku)`, `getPrice(sku)`, etc. No store export.
- A composer that builds `{ sku, price, inStock, available }` by calling both services.
- A change to the `InventoryService` schema (e.g. add a `warehouseId`) that does **not** require any change in `PricingService` or its callers.

**Constraints (these enforce the concept):**
- Each service's store must be inaccessible from outside its module. Enforce with closures or `#` private fields.
- The composer must not touch internal data — only public methods.
- No shared types between services beyond the SKU string. Each service defines its own DTO.
- Demonstrate the schema change in inventory without altering pricing or the composer's contract.

## Stretch
- Add a third service: `ReviewsService`. The composer should be able to add reviews with no change to the other two services.
- Cache the pricing result in the composer for 1 second. What new bug class did you just enable?

## Reflection
- A product manager asks for "all SKUs with stock < 10 and price > $50". With one DB this is a JOIN. With database-per-service, what is your answer? Pick a concrete approach and defend the trade-offs.

## Done when
- [ ] Two services with truly private stores.
- [ ] Composer endpoint produces a unified product view.
- [ ] Inventory schema change does not break pricing.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names — schema and store names encode ownership boundaries

Naming the inventory service's internal store `inventoryStore` rather than a generic `db` or `store` makes the ownership boundary visible at the point of declaration; when a developer sees `pricingStore` and `inventoryStore` side by side, the boundary is enforced by reading, not only by module access control. The clean code principle is that names should reveal intent — and in a database-per-service design, the most important intent to reveal is who owns this data.

**Exercise:** Review every variable name and method name in your two services that refers to a data store or a DTO. Ensure the service name is part of the identifier (`inventoryRecord`, not just `record`; `pricingStore`, not just `store`). Then verify the composer uses neither store's naming vocabulary — it should speak in terms of the composed output only.

**Reflection:** When you add the `warehouseId` field to `InventoryService`, what names in `PricingService` would have to change if the two services shared a single DTO type — and what does that tell you about naming and coupling?
