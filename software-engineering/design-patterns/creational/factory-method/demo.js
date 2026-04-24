// Factory Method — Document creators
// Run: node demo.js

// --- Product hierarchy ---

class Document {
  constructor(title) {
    this.title = title;
    this.createdAt = new Date().toISOString();
  }
  render() {
    throw new Error('render() must be implemented by subclass');
  }
}

class Invoice extends Document {
  render() { return `INVOICE: ${this.title}  (due on receipt)`; }
}

class Report extends Document {
  render() { return `REPORT: ${this.title}\n  ─ Section 1\n  ─ Section 2`; }
}

class Memo extends Document {
  render() { return `MEMO — ${this.title}`; }
}

// --- Creator hierarchy ---

class DocumentCreator {
  // The "template" — shared work wrapped around the factory method.
  createDocument(title) {
    console.log(`[creator] creating a ${this.kind()} titled "${title}"`);
    const doc = this.factoryMethod(title);    // <-- the factory method
    console.log(`[creator] created at ${doc.createdAt}`);
    return doc;
  }
  factoryMethod(_title) {
    throw new Error('factoryMethod() must be overridden');
  }
  kind() {
    throw new Error('kind() must be overridden');
  }
}

class InvoiceCreator extends DocumentCreator {
  factoryMethod(title) { return new Invoice(title); }
  kind() { return 'invoice'; }
}

class ReportCreator extends DocumentCreator {
  factoryMethod(title) { return new Report(title); }
  kind() { return 'report'; }
}

class MemoCreator extends DocumentCreator {
  factoryMethod(title) { return new Memo(title); }
  kind() { return 'memo'; }
}

// --- Demo ---

console.log('=== Factory Method demo ===\n');

const creators = [new InvoiceCreator(), new ReportCreator(), new MemoCreator()];

for (const creator of creators) {
  const doc = creator.createDocument('Q1 summary');
  console.log(doc.render());
  console.log();
}
