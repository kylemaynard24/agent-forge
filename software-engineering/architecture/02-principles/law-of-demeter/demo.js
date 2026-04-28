// Law of Demeter — talk only to your immediate friends.
// Run: node demo.js

// === BEFORE: caller reaches through the wallet to its money to its currency ===

class MoneyAsk {
  constructor(amount, currency) { this.amount = amount; this.currency = currency; }
  withdraw(n) {
    if (n > this.amount) throw new Error('insufficient');
    this.amount -= n;
  }
}

class WalletAsk {
  constructor(money) { this.money = money; }
  getMoney()    { return this.money; }      // <-- exposes internals
  getCurrency() { return this.money.currency; }
}

const ask = new WalletAsk(new MoneyAsk(100, 'USD'));

// Callers do this:
ask.getMoney().withdraw(10);                 // <-- LoD violation
console.log('After ask-style:', ask.getMoney().amount);

// What's wrong:
// - The caller knows wallet contains a `money` object.
// - The caller knows that money has a `withdraw` method.
// - If we change Wallet to hold a `Balance` instead of `Money`, every caller breaks.

// === AFTER: tell the wallet what you want; it does the work ===

class MoneyTell {
  constructor(amount, currency) { this.amount = amount; this.currency = currency; }
}

class WalletTell {
  constructor(money) { this._money = money; }    // private-by-convention
  withdraw(n) {
    if (n > this._money.amount) throw new Error('insufficient');
    this._money.amount -= n;
  }
  balance()  { return this._money.amount; }
  currency() { return this._money.currency; }
}

const tell = new WalletTell(new MoneyTell(100, 'USD'));
tell.withdraw(10);                              // tell, don't ask
console.log('After tell-style:', tell.balance(), tell.currency());

// What changed:
// - Caller talks ONLY to the wallet. It doesn't know there's a Money object inside.
// - We can swap Wallet's internals for `{ cents: number, ccy: string }` later — no caller breaks.

console.log('\nNot all chains are LoD violations:');
console.log([1, 2, 3].filter(n => n > 1).map(n => n * 2));   // pipeline of pure ops on values
console.log('Pure value pipelines (filter().map().reduce()) are fine — those are not collaborators.');
