// Single Responsibility — one reason to change per class.
// Run: node demo.js

// === BEFORE: one class, three actors driving changes ===
//   - Accountants want different totals.
//   - Marketing wants different formatting.
//   - Ops wants different delivery.
// Each can demand a change to BloatedReport. That's three responsibilities.

class BloatedReport {
  constructor(rows) { this.rows = rows; }
  totals() { return this.rows.reduce((s, r) => s + r.amount, 0); }
  formatHtml() {
    const total = this.totals();
    return `<table>${this.rows.map(r => `<tr><td>${r.name}</td><td>${r.amount}</td></tr>`).join('')}<tr><td>Total</td><td>${total}</td></tr></table>`;
  }
  email(to) { console.log(`[email] to=${to} body=${this.formatHtml().slice(0, 60)}...`); }
}

// === AFTER: each class has one reason to change ===

class ReportData {
  constructor(rows) { this.rows = rows; }
  computed() { return { rows: this.rows, total: this.rows.reduce((s, r) => s + r.amount, 0) }; }
}

class HtmlReportFormatter {
  format(data) {
    return `<table>${data.rows.map(r => `<tr><td>${r.name}</td><td>${r.amount}</td></tr>`).join('')}<tr><td>Total</td><td>${data.total}</td></tr></table>`;
  }
}

class CsvReportFormatter {
  format(data) {
    return 'name,amount\n' + data.rows.map(r => `${r.name},${r.amount}`).join('\n') + `\n,${data.total}`;
  }
}

class EmailDeliverer {
  deliver(to, body) { console.log(`[email] to=${to} body=${body.slice(0, 60)}...`); }
}

// === Demo ===
//
// Marketing wants a new HTML look? Touch only HtmlReportFormatter.
// Accounting wants tax included? Touch only ReportData.
// Ops wants Slack delivery? Add a SlackDeliverer — nothing else changes.

const rows = [{ name: 'Widget', amount: 50 }, { name: 'Gadget', amount: 30 }];
const data = new ReportData(rows).computed();

console.log('--- HTML via email ---');
new EmailDeliverer().deliver('boss@x', new HtmlReportFormatter().format(data));

console.log('\n--- CSV via email (same data, different formatter) ---');
new EmailDeliverer().deliver('boss@x', new CsvReportFormatter().format(data));

console.log('\nNotice: each class has ONE reason to change.');
