// Coupling & Cohesion — tight vs loose coupling, side by side.
// Run: node demo.js

// === TIGHTLY COUPLED ===
// OrderProcessor reaches into SMTP-specific details. If we switch to SES,
// SendGrid, or batched async, OrderProcessor breaks.

class TightSmtpClient {
  open() { console.log('[smtp] opening connection'); }
  send(to, body) { console.log(`[smtp] sending to ${to}: ${body}`); }
  close() { console.log('[smtp] closing connection'); }
}

class TightOrderProcessor {
  process(order) {
    const smtp = new TightSmtpClient();
    smtp.open();             // <-- knows SMTP lifecycle
    smtp.send(order.email, `Order ${order.id} ok`);
    smtp.close();
  }
}

// === LOOSELY COUPLED ===
// OrderProcessor depends on a small Notifier interface and is given one.
// Changing the transport is a wiring change, not a code change.

class LooseEmailNotifier {
  notify(to, message) { console.log(`[email] ${to}: ${message}`); }
}

class LooseSmsNotifier {
  notify(to, message) { console.log(`[sms]   ${to}: ${message}`); }
}

class LooseOrderProcessor {
  constructor(notifier) { this.notifier = notifier; }
  process(order) {
    this.notifier.notify(order.email, `Order ${order.id} ok`);
  }
}

// === Demo ===

const order = { id: 'X1', email: 'kyle@example.com' };

console.log('--- TIGHT: OrderProcessor knows SMTP internals ---');
new TightOrderProcessor().process(order);
console.log('Try swapping to SMS here? You have to edit OrderProcessor.\n');

console.log('--- LOOSE: OrderProcessor only knows the Notifier contract ---');
new LooseOrderProcessor(new LooseEmailNotifier()).process(order);
new LooseOrderProcessor(new LooseSmsNotifier()).process(order);
console.log('Swapping transports is a single wiring change.\n');

// === Cohesion ===
// Both LooseEmailNotifier and LooseSmsNotifier do *one* thing: notify.
// They have HIGH cohesion — name and contents agree.
//
// A class named "OrderUtils" that does pricing + emailing + logging would
// have LOW cohesion: name is vague because contents are unrelated.
console.log('Cohesion: LooseEmailNotifier does exactly one thing. Its name predicts its contents.');
