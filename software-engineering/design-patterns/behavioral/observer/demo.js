// Observer — stock ticker with multiple subscribers
// Run: node demo.js

// --- Subject ---

class Subject {
  constructor() { this._observers = new Set(); }
  subscribe(o)   { this._observers.add(o); }
  unsubscribe(o) { this._observers.delete(o); }
  notify(data)   { for (const o of this._observers) o.update(this, data); }
}

class StockTicker extends Subject {
  constructor(symbol) {
    super();
    this.symbol = symbol;
    this.price = null;
  }
  setPrice(price) {
    const prev = this.price;
    this.price = price;
    this.notify({ symbol: this.symbol, prev, price });
  }
}

// --- Observers ---

class UIDisplay {
  update(_subject, { symbol, prev, price }) {
    const arrow = prev == null ? ' ' : (price > prev ? '▲' : price < prev ? '▼' : '─');
    console.log(`  [UI]        ${symbol}  ${price.toFixed(2)} ${arrow}`);
  }
}

class Portfolio {
  constructor(holding = 100) { this.holding = holding; this.totalPnL = 0; }
  update(subject, { prev, price }) {
    if (prev == null) return;
    const pnl = (price - prev) * this.holding;
    this.totalPnL += pnl;
    console.log(`  [portfolio] ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}  (running: $${this.totalPnL.toFixed(2)})`);
  }
}

class TradeLogger {
  update(_subject, { symbol, price }) {
    console.log(`  [log]       ${new Date().toISOString()}  ${symbol}=${price}`);
  }
}

// --- Demo ---

console.log('=== Observer demo ===\n');

const appl = new StockTicker('AAPL');
const ui = new UIDisplay();
const portfolio = new Portfolio(100);
const logger = new TradeLogger();

appl.subscribe(ui);
appl.subscribe(portfolio);
appl.subscribe(logger);

console.log('tick 1 — price 190.50');
appl.setPrice(190.50);

console.log('\ntick 2 — price 192.10');
appl.setPrice(192.10);

console.log('\ntick 3 — price 188.75  (UI unsubscribed)');
appl.unsubscribe(ui);
appl.setPrice(188.75);

console.log('\nKey idea: StockTicker has no idea what UIDisplay, Portfolio, or');
console.log('TradeLogger do. It just calls notify(); observers react on their own.');
