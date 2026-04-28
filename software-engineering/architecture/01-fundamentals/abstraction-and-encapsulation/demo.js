// Abstraction & Encapsulation — exposing what, hiding how.
// Run: node demo.js

// === BAD: state is exposed. Callers can break invariants. ===

class LeakyAccount {
  constructor(balance) { this.balance = balance; }
}

const leaky = new LeakyAccount(100);
leaky.balance -= 200;       // <-- nothing stops this
console.log('Leaky account balance:', leaky.balance, '(invariant violated)');

// Worse: every caller now needs to know how to "deposit". Each writes the same
// `acct.balance += amount`. If we later add an audit log, EVERY caller needs to
// be edited. The data is the API.

// === GOOD: state is encapsulated, behavior is the API. ===

class Account {
  #balance;
  #ledger = [];

  constructor(initial) {
    if (initial < 0) throw new Error('initial balance must be non-negative');
    this.#balance = initial;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error('deposit must be positive');
    this.#balance += amount;
    this.#ledger.push({ type: 'deposit', amount, at: Date.now() });
  }

  withdraw(amount) {
    if (amount <= 0) throw new Error('withdraw must be positive');
    if (amount > this.#balance) throw new Error('insufficient funds');
    this.#balance -= amount;
    this.#ledger.push({ type: 'withdraw', amount, at: Date.now() });
  }

  get balance() { return this.#balance; }
  get ledger() { return [...this.#ledger]; }   // copy: callers can't mutate ours
}

const acct = new Account(100);
acct.deposit(50);
acct.withdraw(30);
console.log('Encapsulated balance:', acct.balance);

console.log('\n--- Try to break the invariant ---');
try { acct.withdraw(9999); } catch (e) { console.log('blocked:', e.message); }
try { acct.deposit(-1); } catch (e) { console.log('blocked:', e.message); }

// And the abstraction: callers say `deposit`, not `acct.balance += 50`.
// We can later add audit logging, fraud checks, currency conversion — all
// without touching a single caller.

console.log('\nLedger (internals):', acct.ledger);
console.log('Direct field access works?', acct.balance);    // ok via getter
console.log('Mutate balance directly?', (() => {
  acct.balance = 999999;
  return acct.balance;                                       // unchanged
})());
