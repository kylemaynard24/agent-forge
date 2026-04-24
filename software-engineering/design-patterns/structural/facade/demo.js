// Facade — OrderService hiding Inventory / Payment / Shipping / Email
// Run: node demo.js

// --- Subsystems (the "complex" internals) ---

class Inventory {
  reserve(sku, qty) {
    console.log(`[inventory] reserved ${qty} × ${sku}`);
    return `RES-${sku}-${qty}`;
  }
  release(reservationId) {
    console.log(`[inventory] released ${reservationId}`);
  }
}

class Payment {
  charge(amountCents, card) {
    if (card === 'DECLINE') {
      throw new Error('card declined');
    }
    console.log(`[payment] charged $${(amountCents / 100).toFixed(2)} on ${card}`);
    return `TXN-${Date.now()}`;
  }
  refund(txnId) {
    console.log(`[payment] refunded ${txnId}`);
  }
}

class Shipping {
  ship(sku, qty, address) {
    const tracking = `1Z${Math.floor(Math.random() * 1e6)}`;
    console.log(`[shipping] shipped ${qty} × ${sku} → ${address} (${tracking})`);
    return tracking;
  }
}

class EmailService {
  send(to, subject) {
    console.log(`[email] → ${to}: ${subject}`);
  }
}

// --- Facade ---

class OrderService {
  constructor() {
    this.inv = new Inventory();
    this.pay = new Payment();
    this.ship = new Shipping();
    this.email = new EmailService();
  }

  placeOrder({ userEmail, sku, qty, unitPriceCents, card, address }) {
    console.log(`\n[orders] placing ${qty} × ${sku} for ${userEmail}`);

    const reservation = this.inv.reserve(sku, qty);
    let txn;
    try {
      txn = this.pay.charge(unitPriceCents * qty, card);
    } catch (err) {
      this.inv.release(reservation);
      throw new Error(`order failed: ${err.message}`);
    }

    const tracking = this.ship.ship(sku, qty, address);
    this.email.send(userEmail, `Your order shipped! Tracking: ${tracking}`);

    return { txn, tracking };
  }
}

// --- Demo ---

console.log('=== Facade demo ===');

const orders = new OrderService();

// Happy path
const result = orders.placeOrder({
  userEmail: 'alice@example.com',
  sku: 'WIDGET-42',
  qty: 3,
  unitPriceCents: 1999,
  card: '****-1111',
  address: '123 Main St',
});
console.log('→ ok:', result);

// Failure path — payment declines, inventory rollback kicks in
try {
  orders.placeOrder({
    userEmail: 'bob@example.com',
    sku: 'GADGET-7',
    qty: 1,
    unitPriceCents: 4999,
    card: 'DECLINE',
    address: '456 Oak Ave',
  });
} catch (err) {
  console.log('→ failed as expected:', err.message);
}

console.log('\nKey idea: client code called one method; the facade coordinated four');
console.log('subsystems, handled ordering, and rolled back on failure.');
