// Chain of Responsibility — expense approval chain
// Run: node demo.js

class Approver {
  constructor(name, limit) {
    this.name = name;
    this.limit = limit;
    this.next = null;
  }
  setNext(handler) {
    this.next = handler;
    return handler; // enables fluent chaining
  }
  handle(expense) {
    if (expense.amount <= this.limit) {
      console.log(`✔ ${this.name} approved "${expense.reason}" ($${expense.amount})`);
      return true;
    }
    if (this.next) {
      console.log(`↑ ${this.name} escalates "${expense.reason}" ($${expense.amount})`);
      return this.next.handle(expense);
    }
    console.log(`✘ no approver for "${expense.reason}" ($${expense.amount})`);
    return false;
  }
}

// --- Demo ---

console.log('=== Chain of Responsibility demo ===\n');

const manager  = new Approver('Manager',  1_000);
const director = new Approver('Director', 10_000);
const vp       = new Approver('VP',      100_000);
// (CEO could be a final link — for now, anything over $100k falls through)

manager.setNext(director).setNext(vp);

const expenses = [
  { amount: 250,    reason: 'team lunch' },
  { amount: 5_000,  reason: 'conference tickets' },
  { amount: 60_000, reason: 'GPU cluster' },
  { amount: 500_000, reason: 'office renovation' },
];

for (const e of expenses) {
  manager.handle(e);
  console.log();
}

console.log('Key idea: the sender calls one handler (manager). The chain decides');
console.log('who actually approves — or whether it falls off the end.');
