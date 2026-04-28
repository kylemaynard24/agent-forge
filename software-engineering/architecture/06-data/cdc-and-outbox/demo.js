// Transactional Outbox — event published iff the row committed
// Run: node demo.js
// One process; the "transaction" is simulated with a staged-commit object.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Fake DB with primitive transactions ---

class TxDB {
  committed = { orders: [], outbox: [] };

  begin() {
    const staged = { orders: [], outbox: [] };
    return {
      insertOrder: (o) => staged.orders.push(o),
      insertOutbox: (e) => staged.outbox.push({ ...e, id: crypto.randomUUID(), published: false }),
      commit: () => {
        this.committed.orders.push(...staged.orders);
        this.committed.outbox.push(...staged.outbox);
      },
      rollback: () => {
        // staged is discarded; nothing visible
      },
    };
  }

  unpublishedOutbox() {
    return this.committed.outbox.filter((e) => !e.published);
  }

  markPublished(id) {
    const e = this.committed.outbox.find((e) => e.id === id);
    if (e) e.published = true;
  }
}

const crypto = require('crypto');
const db = new TxDB();

// --- Business write: order + outbox in ONE transaction ---

async function placeOrder(order, { forceFail = false } = {}) {
  const tx = db.begin();
  try {
    tx.insertOrder(order);
    tx.insertOutbox({ type: 'OrderPlaced', orderId: order.id, total: order.total });
    if (forceFail) throw new Error('payment auth failed');
    tx.commit();
    console.log(`  committed order ${order.id} + outbox event`);
  } catch (err) {
    tx.rollback();
    console.log(`  ROLLED BACK order ${order.id} + outbox event (${err.message})`);
  }
}

// --- Outbox relay: polls and publishes ---

class Bus {
  published = [];
  publish(event) {
    this.published.push(event);
    console.log(`  bus: published ${event.type} for ${event.orderId}`);
  }
}

const bus = new Bus();

async function runRelayOnce() {
  for (const e of db.unpublishedOutbox()) {
    bus.publish(e);
    db.markPublished(e.id);
  }
}

// --- Demo ---

(async () => {
  console.log('=== Transactional Outbox demo ===\n');

  console.log('1) Successful order — both order and outbox commit:');
  await placeOrder({ id: 'A-1', total: 49.99 });

  console.log('\n2) Failed order — payment auth failure rolls back BOTH:');
  await placeOrder({ id: 'A-2', total: 19.95 }, { forceFail: true });

  console.log('\n3) Another successful order:');
  await placeOrder({ id: 'A-3', total: 8.5 });

  console.log('\nDB state before relay runs:');
  console.log('  committed orders:', db.committed.orders.map((o) => o.id));
  console.log('  outbox unpublished:', db.unpublishedOutbox().length);

  console.log('\nRelay polls the outbox and publishes:');
  await runRelayOnce();

  console.log('\nFinal:');
  console.log('  events on bus:', bus.published.map((e) => `${e.type}(${e.orderId})`));
  console.log(
    '\nA-2 was rolled back, so its event NEVER appeared in outbox or bus. That is the guarantee.'
  );
})();
