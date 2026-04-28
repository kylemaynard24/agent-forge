// Hexagonal — domain core surrounded by ports; adapters plug in.
// Run: node demo.js

// === DOMAIN CORE ===
// Knows only about ports. No HTTP, no console, no test framework.

// Driven ports (what the core needs):
//   Notifier:  { notify(channel, message): Promise<void> | void }
//   Repository: { save(order): void;  findById(id): Order | null }

class OrderService {
  constructor({ repository, notifier }) {
    this.repo = repository;
    this.notifier = notifier;
  }

  place(order) {
    if (order.amount <= 0) throw new Error('amount must be positive');
    this.repo.save(order);
    this.notifier.notify(order.email, `Order ${order.id} placed`);
    return { ok: true, id: order.id };
  }

  fulfill(id) {
    const order = this.repo.findById(id);
    if (!order) throw new Error('not found');
    order.status = 'fulfilled';
    this.notifier.notify(order.email, `Order ${id} shipped`);
  }
}

// === DRIVEN ADAPTERS ===

class InMemoryRepo {
  constructor() { this.byId = new Map(); }
  save(o) { this.byId.set(o.id, o); }
  findById(id) { return this.byId.get(id) ?? null; }
}

class ConsoleNotifier {
  notify(channel, msg) { console.log(`[notify] ${channel}: ${msg}`); }
}

class RecordingNotifier {
  constructor() { this.events = []; }
  notify(channel, msg) { this.events.push({ channel, msg }); }
}

// === DRIVING ADAPTERS (toy: imagine HTTP routes / CLI / queue handlers) ===

function httpAdapter(service) {
  return {
    POST_orders(body) { return service.place(body); },
    POST_fulfill(id) { service.fulfill(id); return { ok: true }; }
  };
}

// === Demo: same core, different adapters ===

console.log('--- Production wiring (console notifier) ---');
const prodCore = new OrderService({ repository: new InMemoryRepo(), notifier: new ConsoleNotifier() });
const prodHttp = httpAdapter(prodCore);
console.log(prodHttp.POST_orders({ id: 'A1', amount: 50, email: 'kyle@x' }));
console.log(prodHttp.POST_fulfill('A1'));

console.log('\n--- Test wiring (recording notifier) — no console output ---');
const recorder = new RecordingNotifier();
const testCore = new OrderService({ repository: new InMemoryRepo(), notifier: recorder });
testCore.place({ id: 'B1', amount: 25, email: 't@x' });
testCore.fulfill('B1');
console.log('recorded events:', recorder.events);

// Notice: OrderService is unchanged across both wirings.
// The core depends on PORT shapes (notifier.notify, repo.save). Adapters provide them.
