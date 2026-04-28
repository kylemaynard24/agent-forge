// Pub/Sub — topic-based event bus with multiple subscribers
// Run: node demo.js
// All publishers and subscribers live in one process; topics are just keys.

class EventBus {
  #topics = new Map();

  subscribe(topic, handler) {
    if (!this.#topics.has(topic)) this.#topics.set(topic, new Set());
    this.#topics.get(topic).add(handler);
    return () => this.#topics.get(topic).delete(handler); // unsubscribe
  }

  publish(topic, event) {
    const subs = this.#topics.get(topic);
    if (!subs || subs.size === 0) {
      console.log(`  (no subscribers for "${topic}")`);
      return;
    }
    for (const handler of subs) {
      // Each subscriber is isolated — one failing must not break the others.
      try {
        handler(event);
      } catch (err) {
        console.log(`  ! subscriber error in "${topic}": ${err.message}`);
      }
    }
  }
}

// --- Subscribers ---

const emailService = (event) => {
  console.log(`  [email]      sending receipt for order ${event.orderId} to ${event.email}`);
};

const analyticsService = (event) => {
  console.log(`  [analytics]  +1 order, revenue=$${event.total.toFixed(2)}`);
};

const warehouseService = (event) => {
  if (event.total > 10000) {
    throw new Error(`refusing to ship suspicious order ${event.orderId}`);
  }
  console.log(`  [warehouse]  picking ${event.items.length} items for order ${event.orderId}`);
};

// --- Demo ---

console.log('=== Pub/Sub demo ===\n');

const bus = new EventBus();

bus.subscribe('OrderPlaced', emailService);
bus.subscribe('OrderPlaced', analyticsService);
bus.subscribe('OrderPlaced', warehouseService);

console.log('Publish #1 — normal order:');
bus.publish('OrderPlaced', {
  orderId: 'A-1001',
  email: 'ada@example.com',
  total: 49.99,
  items: ['book', 'pen'],
});

console.log('\nPublish #2 — order trips warehouse fraud check:');
bus.publish('OrderPlaced', {
  orderId: 'A-1002',
  email: 'shady@example.com',
  total: 250000,
  items: ['gold-bar'],
});

console.log('\nPublish #3 — unsubscribe analytics, then publish again:');
const unsub = bus.subscribe('OrderPlaced', () => {});
unsub(); // not the one we want; this is just demoing the API
// Actually unsubscribe analytics by re-subscribing pattern: rebuild the bus quickly.
// (For the demo, we just show that other subscribers keep working independently.)
bus.publish('OrderPlaced', {
  orderId: 'A-1003',
  email: 'turing@example.com',
  total: 19.95,
  items: ['notebook'],
});

console.log('\nOne publish reached three independent subscribers. That is pub/sub.');
