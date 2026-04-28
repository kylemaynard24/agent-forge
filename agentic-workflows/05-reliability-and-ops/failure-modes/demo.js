// Failure Modes — five common failures, each detected.
// Run: node demo.js

const tools = ['read_file', 'finish'];

function isValidTool(action) { return tools.includes(action.tool); }

function isRepeating(history, action, lookback = 3) {
  const key = JSON.stringify(action);
  const recent = history.slice(-lookback).map(h => JSON.stringify(h.action));
  return recent.length === lookback && recent.every(k => k === key);
}

function overBudget(trace, max) { return trace.length >= max; }

async function withTimeout(fn, ms) {
  return Promise.race([
    fn(),
    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))
  ]);
}

async function loop(scenario) {
  console.log(`\n=== Scenario: ${scenario} ===`);
  const trace = [];
  for (let step = 0; step < 10; step++) {
    if (overBudget(trace, 6) && scenario === 'budget') return done('budget exhausted');

    let action;
    if (scenario === 'looping') action = { tool: 'read_file', args: { path: 'a' } };
    else if (scenario === 'hallucinated') action = { tool: 'do_magic', args: {} };
    else if (scenario === 'premature_finish') action = { tool: 'finish', args: { answer: '' } };
    else if (scenario === 'budget') action = { tool: 'read_file', args: { path: `f${step}` } };
    else if (scenario === 'timeout') action = { tool: 'read_file', args: { path: 'slow' } };
    else action = { tool: 'finish', args: { answer: 'done' } };

    if (isRepeating(trace, action)) return done('looping');
    if (!isValidTool(action)) return done(`hallucinated tool: ${action.tool}`);

    let observation;
    try {
      observation = await withTimeout(async () => {
        if (scenario === 'timeout') {
          return new Promise(r => setTimeout(() => r('done'), 9999));   // never finishes
        }
        return 'tool result';
      }, 200);
    } catch (e) {
      return done(`tool ${action.tool} timed out`);
    }

    if (action.tool === 'finish') {
      if (!action.args.answer || action.args.answer.length === 0) return done('premature_finish');
      return done('success');
    }

    trace.push({ action, observation });
  }
  return done('maxSteps reached');
}

function done(reason) {
  console.log(`  → terminated: ${reason}`);
  return reason;
}

(async () => {
  await loop('looping');
  await loop('hallucinated');
  await loop('premature_finish');
  await loop('budget');
  await loop('timeout');

  console.log(`
Take note:
  - Each failure mode has a NAMED termination reason.
  - The loop NEVER throws. Every path ends with done(...).
  - Detection ≠ prevention. Detection is the safety net; prevention is design.
  - In production, each reason maps to specific alerting / dashboards.
`);
})();
