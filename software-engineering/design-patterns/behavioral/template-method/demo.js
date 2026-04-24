// Template Method — report generator with overridable steps
// Run: node demo.js

class ReportGenerator {
  // Template method — the fixed skeleton. Don't override.
  generate() {
    console.log(`\n-- generating ${this.name()} --`);
    const raw = this.fetchData();
    this.beforeTransform?.(raw);        // optional hook
    const processed = this.transform(raw);
    const output = this.format(processed);
    this.log(`wrote ${output.length} chars`);
    return output;
  }

  // Subclasses must implement:
  name()         { throw new Error('name()'); }
  fetchData()    { throw new Error('fetchData()'); }
  transform(_)   { throw new Error('transform()'); }
  format(_)      { throw new Error('format()'); }

  // Default implementation (can be overridden)
  log(message) {
    console.log(`  [log] ${message}`);
  }
}

// --- Concrete subclasses ---

class SalesReport extends ReportGenerator {
  name() { return 'Sales report'; }

  fetchData() {
    return [
      { item: 'widget', qty: 10, price: 19.99 },
      { item: 'gadget', qty: 3,  price: 49.99 },
      { item: 'sprocket', qty: 25, price: 4.99 },
    ];
  }

  transform(rows) {
    return rows.map(r => ({ ...r, revenue: r.qty * r.price }));
  }

  format(rows) {
    const lines = rows.map(r =>
      `  ${r.item.padEnd(10)} × ${String(r.qty).padStart(3)}  = $${r.revenue.toFixed(2)}`
    );
    const total = rows.reduce((s, r) => s + r.revenue, 0);
    return ['SALES', ...lines, `  TOTAL: $${total.toFixed(2)}`].join('\n');
  }
}

class InventoryReport extends ReportGenerator {
  name() { return 'Inventory report'; }

  fetchData() {
    return [
      { item: 'widget',   onHand: 120, reorderAt: 50 },
      { item: 'gadget',   onHand: 8,   reorderAt: 20 },
      { item: 'sprocket', onHand: 0,   reorderAt: 100 },
    ];
  }

  transform(rows) {
    return rows.map(r => ({ ...r, needsReorder: r.onHand < r.reorderAt }));
  }

  format(rows) {
    const lines = rows.map(r =>
      `  ${r.item.padEnd(10)} onHand=${String(r.onHand).padStart(4)} ${r.needsReorder ? '⚠ reorder' : ''}`
    );
    return ['INVENTORY', ...lines].join('\n');
  }

  // Overriding the hook — custom logging
  log(message) {
    console.log(`  [inventory-audit] ${new Date().toISOString()}  ${message}`);
  }
}

// --- Demo ---

console.log('=== Template Method demo ===');

for (const report of [new SalesReport(), new InventoryReport()]) {
  const output = report.generate();
  console.log(output);
}

console.log('\nKey idea: the skeleton (generate) lives in the base class and is');
console.log('never copy-pasted. Subclasses only supply the varying steps.');
