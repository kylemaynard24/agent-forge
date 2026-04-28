// Event-Driven — producers publish; multiple subscribers react independently.
// Run: node demo.js

// === Tiny in-process event bus ===
class EventBus {
  constructor() { this.handlers = new Map(); }
  on(eventName, handler) {
    if (!this.handlers.has(eventName)) this.handlers.set(eventName, []);
    this.handlers.get(eventName).push(handler);
  }
  async publish(eventName, payload) {
    const list = this.handlers.get(eventName) ?? [];
    // We run subscribers concurrently; failures are isolated per subscriber.
    await Promise.allSettled(list.map(async h => {
      try { await h(payload); }
      catch (e) { console.log(`[bus] subscriber for ${eventName} failed:`, e.message); }
    }));
  }
}

const bus = new EventBus();

// === Producer: orders ===
class OrderService {
  constructor(bus) { this.bus = bus; }
  async place(order) {
    console.log(`[orders] placed ${order.id}`);
    await this.bus.publish('OrderPlaced', order);
    return { ok: true };
  }
}

// === Subscribers (knows nothing about each other) ===

// 1) Email
bus.on('OrderPlaced', async order => {
  console.log(`[email] sending confirmation to ${order.email}`);
});

// 2) Inventory
bus.on('OrderPlaced', async order => {
  console.log(`[inventory] decrementing ${order.qty} of ${order.sku}`);
});

// 3) Analytics — added later. Producer is unchanged.
bus.on('OrderPlaced', async order => {
  console.log(`[analytics] revenue += ${order.total}`);
});

// 4) Flaky one — its failure must not break the others.
bus.on('OrderPlaced', async _ => {
  throw new Error('flaky subscriber boom');
});

// === Demo ===

(async () => {
  const orders = new OrderService(bus);
  await orders.place({ id: 'A1', sku: 'Widget', qty: 2, total: 100, email: 'kyle@x' });
  console.log('\nOne event, multiple independent reactions. Adding a new reaction = adding a new subscriber.');
})();
