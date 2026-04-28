// Prompt Versioning and Regression Tests — minimal registry.
// Run: node demo.js

// === Versioned prompt registry ===
const promptRegistry = {
  'reviewer:v1.0.0': {
    system: 'You are a code reviewer. Find issues.',
    model: 'claude-sonnet-4-6',
    notes: 'Initial release.'
  },
  'reviewer:v1.1.0': {
    system: 'You are a senior code reviewer. Find issues, ranked by severity (low/med/high).',
    model: 'claude-sonnet-4-6',
    notes: 'Added severity levels in output.'
  },
  'reviewer:v2.0.0': {
    system: 'You are a senior code reviewer. Output JSON with issues, severity, and remediation.',
    model: 'claude-sonnet-4-6',
    notes: 'Breaking change: output is JSON, not prose.'
  }
};

// === Eval suite (5 fixtures, very simplified) ===
const fixtures = [
  { name: 'finds-eval-bug',     input: 'review: x = eval(input)', mustContain: ['eval', 'high'] },
  { name: 'no-issues',          input: 'review: x = 1 + 2',       mustContain: [] },
  { name: 'severity-included',  input: 'review: x = eval(input)', mustContain: ['high'] },
  { name: 'json-output-v2',     input: 'review: x = 1 + 2',       mustContain: ['{'] },
  { name: 'short-output',       input: 'review: x = 1 + 2',       maxChars: 200 }
];

// === Stub LLM that "responds" based on version ===
function fakeLLM(version, input) {
  const prompt = promptRegistry[version];
  if (version.startsWith('reviewer:v1.0')) {
    return input.includes('eval') ? 'Found a security issue with eval.' : 'No issues.';
  }
  if (version.startsWith('reviewer:v1.1')) {
    return input.includes('eval') ? 'Severity: high. Issue: eval on user input.' : 'Severity: low. No critical issues.';
  }
  if (version.startsWith('reviewer:v2.0')) {
    return JSON.stringify({
      issues: input.includes('eval') ? [{ msg: 'eval on input', severity: 'high' }] : [],
      remediation: input.includes('eval') ? 'Use a safe parser' : null
    });
  }
}

// === Eval runner ===
function runEvals(version) {
  const results = fixtures.map(f => {
    const out = fakeLLM(version, f.input);
    const failures = [];
    if (f.mustContain) {
      for (const term of f.mustContain) {
        if (!out.toLowerCase().includes(term.toLowerCase())) failures.push(`missing: ${term}`);
      }
    }
    if (f.maxChars && out.length > f.maxChars) failures.push(`output too long: ${out.length} > ${f.maxChars}`);
    return { name: f.name, pass: failures.length === 0, failures };
  });
  const passed = results.filter(r => r.pass).length;
  return { version, passed, total: results.length, results };
}

// === Compare three versions ===
const reports = ['reviewer:v1.0.0', 'reviewer:v1.1.0', 'reviewer:v2.0.0'].map(runEvals);

console.log('=== Prompt-version regression report ===\n');
console.log('version          | pass / total | notes');
console.log('-----------------+--------------+----------------------------------');
for (const r of reports) {
  const note = promptRegistry[r.version].notes;
  console.log(`${r.version.padEnd(16)} | ${r.passed} / ${r.total}        | ${note}`);
}

console.log('\nRegression alert: did any version drop pass rate from the prior?\n');
for (let i = 1; i < reports.length; i++) {
  const prev = reports[i - 1], cur = reports[i];
  if (cur.passed < prev.passed) {
    console.log(`  ⚠ ${cur.version} regressed: ${prev.passed} → ${cur.passed} pass`);
  } else {
    console.log(`  ✓ ${cur.version} did not regress`);
  }
}

console.log(`
Take note:
  - Each prompt has a version; each version has notes.
  - The eval suite runs per-version; results are comparable.
  - Regression alert is automatic ("pass rate dropped").
  - In CI: this gates merging a prompt change.
  - In prod: log the prompt_version on each run for forensic correlation.
`);
