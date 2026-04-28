// Evals for Agents — tiny eval suite with multiple check types.
// Run: node demo.js

// === Stub agent under test ===
function fakeAgent(input) {
  // Pretend this is your agent. Returns structured output.
  if (input.task.includes('summarize')) {
    return { summary: 'A short summary.', issues: [], confidence: 'high' };
  }
  if (input.task.includes('review')) {
    return {
      summary: 'Found 1 issue.',
      issues: [{ file: 'api.py', line: 42, severity: 'high' }],
      confidence: 'high'
    };
  }
  return { summary: 'unknown task', issues: [], confidence: 'low' };
}

// === Fixtures ===
const fixtures = [
  { name: 'summarize task',
    input: { task: 'summarize the auth diff' },
    checks: [
      { type: 'schema', shape: { summary: 'string', issues: 'array', confidence: 'string' } },
      { type: 'value_in', field: 'confidence', allowed: ['low', 'med', 'high'] }
    ]
  },
  { name: 'review finds issue',
    input: { task: 'review api.py' },
    checks: [
      { type: 'min_count', field: 'issues', min: 1 },
      { type: 'contains', field: 'summary', value: 'issue' }
    ]
  },
  { name: 'unknown task low confidence',
    input: { task: 'do the thing' },
    checks: [
      { type: 'value_in', field: 'confidence', allowed: ['low'] }
    ]
  }
];

// === Checkers ===
function check(output, c) {
  if (c.type === 'schema') {
    for (const [k, type] of Object.entries(c.shape)) {
      if (type === 'array' && !Array.isArray(output[k])) return `field ${k} not array`;
      if (type !== 'array' && typeof output[k] !== type) return `field ${k} not ${type}`;
    }
    return null;
  }
  if (c.type === 'value_in') {
    return c.allowed.includes(output[c.field]) ? null : `${c.field}=${output[c.field]} not in ${c.allowed}`;
  }
  if (c.type === 'min_count') {
    return (output[c.field]?.length ?? 0) >= c.min ? null : `${c.field}.length < ${c.min}`;
  }
  if (c.type === 'contains') {
    return String(output[c.field] ?? '').toLowerCase().includes(c.value.toLowerCase())
      ? null
      : `${c.field} does not contain "${c.value}"`;
  }
  return `unknown check type ${c.type}`;
}

// === Runner ===
function run() {
  const results = [];
  for (const f of fixtures) {
    const output = fakeAgent(f.input);
    const failures = f.checks.map(c => check(output, c)).filter(Boolean);
    results.push({ name: f.name, output, failures });
  }
  return results;
}

const results = run();
const passed = results.filter(r => r.failures.length === 0).length;

console.log('=== Eval suite ===\n');
for (const r of results) {
  console.log(r.failures.length === 0 ? `✓ ${r.name}` : `✗ ${r.name}`);
  if (r.failures.length) for (const f of r.failures) console.log(`    - ${f}`);
}
console.log(`\nPassed ${passed}/${results.length}`);

console.log(`
Take note:
  - Each fixture has structured input + a list of checks.
  - Checks are *aspects* of correctness, not byte-equality.
  - Schema, value_in, min_count, contains — composable, reusable.
  - Add 'llm_judge' check type for free-text outputs.
  - In CI: this becomes "block PR if pass rate drops".
`);
