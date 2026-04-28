// Separation of Concerns — refactor a bloated handler into three modules.
// Run: node demo.js

// === BEFORE: one function does everything ===

function handleOrderBloated(order, db, mailer) {
  // validation
  if (!order.id || !order.amount || order.amount <= 0) {
    throw new Error('Invalid order');
  }
  // persistence
  db.save(`orders:${order.id}`, JSON.stringify(order));
  // notification
  mailer.send(order.email, `Order ${order.id} confirmed`);
}

// === AFTER: three concerns, three modules ===

// 1) Validation — knows business rules; nothing else.
function validateOrder(order) {
  if (!order.id) throw new Error('Order missing id');
  if (!order.amount || order.amount <= 0) throw new Error('Order amount must be positive');
  if (!order.email) throw new Error('Order missing email');
}

// 2) Persistence — knows the storage shape; nothing else.
function persistOrder(db, order) {
  db.save(`orders:${order.id}`, JSON.stringify(order));
}

// 3) Notification — knows how to talk to the customer.
function notifyCustomer(mailer, order) {
  mailer.send(order.email, `Order ${order.id} confirmed`);
}

// Composition lives at the edge — the orchestrator wires concerns together.
function handleOrderClean(order, deps) {
  validateOrder(order);
  persistOrder(deps.db, order);
  notifyCustomer(deps.mailer, order);
}

// === Demo ===

const inMemoryDb = {
  store: new Map(),
  save(k, v) { this.store.set(k, v); console.log(`[db] saved ${k}`); }
};

const realMailer = { send(to, msg) { console.log(`[mailer] -> ${to}: ${msg}`); } };
const noopMailer = { send() { /* nothing */ } };

const order = { id: 'A1', amount: 50, email: 'kyle@example.com' };

console.log('--- Clean handler with real mailer ---');
handleOrderClean(order, { db: inMemoryDb, mailer: realMailer });

console.log('\n--- Clean handler with no-op mailer (e.g., in tests) ---');
handleOrderClean({ ...order, id: 'A2' }, { db: inMemoryDb, mailer: noopMailer });
console.log('Swapping the mailer required zero changes to validation or persistence.');

console.log('\n--- Validation rejects bad orders before any side effect ---');
try {
  handleOrderClean({ id: 'A3', amount: -5, email: 'bad@x' }, { db: inMemoryDb, mailer: realMailer });
} catch (err) {
  console.log('rejected:', err.message);
  console.log('db has key A3?', inMemoryDb.store.has('orders:A3'));
}
