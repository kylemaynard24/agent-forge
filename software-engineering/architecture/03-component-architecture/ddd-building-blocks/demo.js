// DDD Building Blocks — Entity, Value Object, Aggregate, Repository.
// Run: node demo.js

// === VALUE OBJECT ===
// Equality by value, immutable.
class Money {
  constructor(amount, currency) {
    Object.freeze(this);
    this.amount = amount; this.currency = currency;
  }
  add(other) {
    if (other.currency !== this.currency) throw new Error('currency mismatch');
    return new Money(this.amount + other.amount, this.currency);
  }
  equals(other) { return other instanceof Money && other.amount === this.amount && other.currency === this.currency; }
  toString() { return `${this.amount} ${this.currency}`; }
}

// Another value object — an OrderLine. No identity. Compared by value.
class OrderLine {
  constructor(sku, qty, price) {
    Object.freeze(this);
    this.sku = sku; this.qty = qty; this.price = price; // price is a Money
  }
  subtotal() { return new Money(this.price.amount * this.qty, this.price.currency); }
  equals(other) {
    return other instanceof OrderLine
      && other.sku === this.sku && other.qty === this.qty && other.price.equals(this.price);
  }
}

// === AGGREGATE: Order is the root; OrderLine values live inside ===
class Order {
  #id; #lines = []; #status = 'open'; #creditLimit;

  constructor(id, creditLimit /* Money */) {
    this.#id = id; this.#creditLimit = creditLimit;
  }

  get id() { return this.#id; }
  get status() { return this.#status; }
  get lines() { return [...this.#lines]; }     // copy, not reference

  addLine(line) {
    if (this.#status !== 'open') throw new Error('order locked');
    const tentativeTotal = [...this.#lines, line]
      .reduce((sum, l) => sum.add(l.subtotal()), new Money(0, this.#creditLimit.currency));
    if (tentativeTotal.amount > this.#creditLimit.amount) {
      throw new Error(`would exceed credit limit ${this.#creditLimit}`);
    }
    this.#lines.push(line);  // OK now: invariant holds
  }

  total() {
    return this.#lines.reduce((sum, l) => sum.add(l.subtotal()), new Money(0, this.#creditLimit.currency));
  }

  submit() {
    if (this.#lines.length === 0) throw new Error('cannot submit empty order');
    this.#status = 'submitted';
  }
}

// === REPOSITORY: collection-like access to aggregates ===
class OrderRepository {
  constructor() { this._byId = new Map(); }
  save(order) { this._byId.set(order.id, order); }
  findById(id) { return this._byId.get(id) ?? null; }
  // Notice: no findOrderLineById. You only fetch ROOTS.
}

// === Demo ===

const order = new Order('A1', new Money(100, 'USD'));
order.addLine(new OrderLine('SKU1', 2, new Money(20, 'USD')));   // 40 USD
order.addLine(new OrderLine('SKU2', 1, new Money(50, 'USD')));   // 50 USD
console.log('Total:', order.total().toString());                  // 90 USD

console.log('\n--- Trying to exceed credit limit ---');
try {
  order.addLine(new OrderLine('SKU3', 1, new Money(50, 'USD')));   // 50 more -> 140 > 100
} catch (e) { console.log('rejected:', e.message); }

console.log('\n--- Value-object equality ---');
const a = new OrderLine('SKU1', 2, new Money(20, 'USD'));
const b = new OrderLine('SKU1', 2, new Money(20, 'USD'));
console.log('a === b ?', a === b);              // false: different objects
console.log('a.equals(b) ?', a.equals(b));      // true: same value

const repo = new OrderRepository();
repo.save(order);
console.log('\nFetched:', repo.findById('A1').total().toString());
