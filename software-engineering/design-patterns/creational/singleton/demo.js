// Singleton — Logger
// Run: node demo.js

class Logger {
  static #instance = null;
  #entries = [];

  constructor() {
    if (Logger.#instance) {
      throw new Error('Use Logger.getInstance() — direct `new` is not allowed.');
    }
  }

  static getInstance() {
    if (!Logger.#instance) {
      Logger.#instance = new Logger();
      Logger.#instance.#record('Logger initialized');
    }
    return Logger.#instance;
  }

  log(message) {
    this.#record(message);
  }

  history() {
    return [...this.#entries];
  }

  #record(message) {
    const entry = `[${new Date().toISOString()}] ${message}`;
    this.#entries.push(entry);
    console.log(entry);
  }
}

// --- Demo ---

console.log('=== Singleton demo ===\n');

// Module A "imports" the logger
const loggerA = Logger.getInstance();
loggerA.log('module A: user signed in');

// Module B "imports" the logger independently
const loggerB = Logger.getInstance();
loggerB.log('module B: user opened dashboard');

console.log('\nSame instance?', loggerA === loggerB); // true
console.log('Shared history length:', loggerA.history().length);

// Direct construction is blocked
try {
  new Logger();
} catch (err) {
  console.log('\nDirect `new Logger()` rejected:', err.message);
}
