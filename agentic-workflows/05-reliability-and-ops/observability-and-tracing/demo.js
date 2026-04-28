// Observability and Tracing — per-run JSON trace.
// Run: node demo.js

const fs = require('fs');

class Tracer {
  constructor(runId) {
    this.runId = runId;
    this.start = Date.now();
    this.steps = [];
    this.totals = { tokens_in: 0, tokens_out: 0, ms: 0 };
  }

  recordStep({ thought, action, observation, tokens_in = 0, tokens_out = 0, ms = 0 }) {
    this.steps.push({
      step: this.steps.length + 1,
      thought, action, observation, tokens_in, tokens_out, ms,
      at: Date.now()
    });
    this.totals.tokens_in += tokens_in;
    this.totals.tokens_out += tokens_out;
    this.totals.ms += ms;
  }

  finish(outcome) {
    return {
      run_id: this.runId,
      started_at: new Date(this.start).toISOString(),
      ended_at: new Date().toISOString(),
      duration_ms: Date.now() - this.start,
      outcome,
      steps: this.steps,
      totals: { ...this.totals, cost_usd: this.totals.tokens_out * 0.000015 + this.totals.tokens_in * 0.000003 }
    };
  }
}

// === Run a fake agent with tracing ===
const tracer = new Tracer('run-' + Math.random().toString(36).slice(2, 8));

tracer.recordStep({
  thought: 'I need to inspect the diff first.',
  action: { tool: 'git_diff', args: {} },
  observation: '+- 12 files changed; 234 insertions; 56 deletions',
  tokens_in: 800, tokens_out: 40, ms: 600
});

tracer.recordStep({
  thought: 'Many files; focus on auth/.',
  action: { tool: 'read_file', args: { path: 'auth/login.py' } },
  observation: '... (500 lines elided) ...',
  tokens_in: 1200, tokens_out: 50, ms: 900
});

tracer.recordStep({
  thought: 'No critical issues. Submit clean review.',
  action: { tool: 'finish', args: { issues: [], confidence: 'high' } },
  observation: '__done__',
  tokens_in: 600, tokens_out: 30, ms: 400
});

const trace = tracer.finish('success');

const tracePath = './demo-trace.json';
fs.writeFileSync(tracePath, JSON.stringify(trace, null, 2));

console.log('=== Run trace summary ===\n');
console.log(`run_id:  ${trace.run_id}`);
console.log(`outcome: ${trace.outcome}`);
console.log(`steps:   ${trace.steps.length}`);
console.log(`tokens:  ${trace.totals.tokens_in} in, ${trace.totals.tokens_out} out`);
console.log(`cost:    $${trace.totals.cost_usd.toFixed(6)}`);
console.log(`wall:    ${trace.duration_ms}ms`);
console.log(`\nSaved to ${tracePath}`);

console.log(`
Take note:
  - Every step has thought + action + observation + tokens + ms.
  - run_id correlates logs across systems.
  - Tokens × price = cost; visible per run.
  - This trace is enough to debug 80% of issues.
  - In production: send to Datadog/Honeycomb; or even SQLite.
  - Inspect with: cat demo-trace.json | jq '.steps[] | {step, action, ms, tokens_in}'
`);
