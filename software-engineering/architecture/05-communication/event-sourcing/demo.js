// Event Sourcing — bank account whose balance is computed from events
// Run: node demo.js
// One process; the "log" is just an array.

class EventLog {
  #events = [];

  append(event) {
    const stamped = { ...event, seq: this.#events.length + 1, at: Date.now() };
    this.#events.push(stamped);
    return stamped;
  }

  all() {
    return [...this.#events];
  }

  upTo(seq) {
    return this.#events.filter((e) => e.seq <= seq);
  }
}

// --- Aggregate: pure fold over the log ---

function balanceFrom(events) {
  return events.reduce((bal, e) => {
    if (e.type === 'Deposited') return bal + e.amount;
    if (e.type === 'Withdrew') return bal - e.amount;
    if (e.type === 'AccountOpened') return 0;
    return bal;
  }, 0);
}

// --- Command handlers: validate against current state, then append ---

function deposit(log, amount) {
  if (amount <= 0) throw new Error('deposit must be positive');
  return log.append({ type: 'Deposited', amount });
}

function withdraw(log, amount) {
  if (amount <= 0) throw new Error('withdraw must be positive');
  const current = balanceFrom(log.all());
  if (current < amount) throw new Error(`insufficient funds: have ${current}, need ${amount}`);
  return log.append({ type: 'Withdrew', amount });
}

// --- Demo ---

console.log('=== Event Sourcing demo ===\n');

const log = new EventLog();
log.append({ type: 'AccountOpened', owner: 'Ada' });

deposit(log, 100);
deposit(log, 50);
withdraw(log, 30);
const checkpoint = log.all().length; // remember this point in history
deposit(log, 200);
withdraw(log, 75);

console.log('Event log:');
for (const e of log.all()) {
  const detail = e.amount != null ? `$${e.amount}` : (e.owner || '');
  console.log(`  #${e.seq}  ${e.type.padEnd(14)} ${detail}`);
}

console.log('\nBalances are *computed*, not stored:');
console.log(`  current balance:           $${balanceFrom(log.all())}`);
console.log(`  balance at event #${checkpoint}:        $${balanceFrom(log.upTo(checkpoint))}`);
console.log(`  balance after first 3:     $${balanceFrom(log.upTo(3))}`);

// Try an illegal command — only accepted events are recorded.
try {
  withdraw(log, 999999);
} catch (err) {
  console.log(`\nRejected command: ${err.message}`);
}

console.log(`\nLog size unchanged after rejection: ${log.all().length} events.`);
console.log('The log is the source of truth. State is a fold.');
