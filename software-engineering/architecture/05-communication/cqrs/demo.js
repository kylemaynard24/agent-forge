// CQRS — separate write model (commands -> events) from read model (queries)
// Run: node demo.js
// Single process; the read model subscribes to the write model's events.

// --- Write side: commands, validation, events ---

class ProductWriteModel {
  #products = new Map(); // minimal internal state for invariants
  #subscribers = [];

  on(handler) {
    this.#subscribers.push(handler);
  }

  #emit(event) {
    for (const s of this.#subscribers) s(event);
  }

  createProduct(id, name, priceCents) {
    if (this.#products.has(id)) throw new Error(`product ${id} already exists`);
    if (priceCents <= 0) throw new Error('price must be positive');
    this.#products.set(id, { id, name, priceCents, stock: 0 });
    this.#emit({ type: 'ProductCreated', id, name, priceCents });
  }

  restock(id, qty) {
    const p = this.#products.get(id);
    if (!p) throw new Error(`unknown product ${id}`);
    if (qty <= 0) throw new Error('restock qty must be positive');
    p.stock += qty;
    this.#emit({ type: 'Restocked', id, qty, newStock: p.stock });
  }

  changePrice(id, priceCents) {
    const p = this.#products.get(id);
    if (!p) throw new Error(`unknown product ${id}`);
    p.priceCents = priceCents;
    this.#emit({ type: 'PriceChanged', id, priceCents });
  }
}

// --- Read side: denormalized catalog optimized for queries ---

class CatalogReadModel {
  #catalog = new Map(); // { id, name, priceDollars, inStock, lastUpdated }

  apply(event) {
    if (event.type === 'ProductCreated') {
      this.#catalog.set(event.id, {
        id: event.id,
        name: event.name,
        priceDollars: (event.priceCents / 100).toFixed(2),
        inStock: false,
        lastUpdated: new Date().toISOString(),
      });
    } else if (event.type === 'Restocked') {
      const row = this.#catalog.get(event.id);
      row.inStock = event.newStock > 0;
      row.lastUpdated = new Date().toISOString();
    } else if (event.type === 'PriceChanged') {
      const row = this.#catalog.get(event.id);
      row.priceDollars = (event.priceCents / 100).toFixed(2);
      row.lastUpdated = new Date().toISOString();
    }
  }

  // Query API — shaped for the UI, not for the writer.
  listInStock() {
    return [...this.#catalog.values()].filter((r) => r.inStock);
  }

  byId(id) {
    return this.#catalog.get(id);
  }
}

// --- Demo ---

console.log('=== CQRS demo ===\n');

const writes = new ProductWriteModel();
const catalog = new CatalogReadModel();
writes.on((e) => {
  console.log(`  event -> ${e.type} ${JSON.stringify({ ...e, type: undefined })}`);
  catalog.apply(e);
});

console.log('Commands:');
writes.createProduct('p1', 'Notebook', 1299);
writes.createProduct('p2', 'Pen', 199);
writes.restock('p1', 10);
writes.changePrice('p1', 1499);

console.log('\nRead model — listInStock():');
console.table(catalog.listInStock());

console.log('Read model — byId("p2") (created but never restocked):');
console.log(' ', catalog.byId('p2'));

console.log('\nWrite shape and read shape are different by design. That is CQRS.');
