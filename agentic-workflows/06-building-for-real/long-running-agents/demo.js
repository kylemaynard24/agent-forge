// Long-Running Agents — checkpointed plan + memory across sessions.
// Run: node demo.js

const fs = require('fs');
const STATE_FILE = './long-running-state.json';

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return null;
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function clearState() {
  if (fs.existsSync(STATE_FILE)) fs.unlinkSync(STATE_FILE);
}

// === An "agent session": short-running loop on persistent state ===
function runSession(sessionId, maxStepsThisSession = 3) {
  console.log(`\n=== SESSION ${sessionId} ===`);

  let state = loadState();
  if (!state) {
    console.log('  No prior state. Starting fresh.');
    state = {
      goal: 'Refactor the auth module',
      plan: {
        steps: [
          { id: 's1', action: 'Inventory files',         status: 'pending' },
          { id: 's2', action: 'Identify legacy patterns', status: 'pending' },
          { id: 's3', action: 'Refactor each file',       status: 'pending' },
          { id: 's4', action: 'Run tests',                status: 'pending' },
          { id: 's5', action: 'Submit PR',                status: 'pending' }
        ]
      },
      memory: {},
      sessions: []
    };
  } else {
    console.log(`  Resuming from prior state. ${state.sessions.length} prior sessions.`);
  }

  // Execute up to maxStepsThisSession from the plan
  let stepsRunThisSession = 0;
  for (const step of state.plan.steps) {
    if (stepsRunThisSession >= maxStepsThisSession) break;
    if (step.status !== 'pending') continue;

    console.log(`  [${step.id}] ${step.action} ... done`);
    step.status = 'done';
    state.memory[`finding:${step.id}`] = `result of ${step.action}`;
    stepsRunThisSession++;
  }

  state.sessions.push({ id: sessionId, completed_steps: stepsRunThisSession });
  saveState(state);
  console.log(`  Session ${sessionId} ended. Steps done this session: ${stepsRunThisSession}.`);

  const remaining = state.plan.steps.filter(s => s.status === 'pending').length;
  console.log(`  Remaining steps: ${remaining}`);
  return remaining;
}

// === Demo ===

clearState();    // start fresh for the demo

const remainAfter1 = runSession('A');                  // 3 steps done; 2 remain
const remainAfter2 = runSession('B');                  // 2 more done; 0 remain

console.log('\n=== Final state ===');
const finalState = loadState();
console.log(`Plan progress:`);
for (const s of finalState.plan.steps) {
  console.log(`  [${s.status === 'done' ? 'x' : ' '}] ${s.id}: ${s.action}`);
}
console.log(`\nSessions: ${finalState.sessions.length}, all steps complete: ${remainAfter2 === 0 ? 'yes' : 'no'}`);
console.log(`Memory keys: ${Object.keys(finalState.memory).join(', ')}`);

clearState();    // cleanup

console.log(`
Take note:
  - The "agent" runs across sessions; each session is short.
  - State is checkpointed to disk; nothing in-context is required to survive.
  - Resume is automatic on the next session — picks up where the plan left off.
  - Memory accumulates across sessions; it's the agent's "memory," not the loop's.
  - In production: state lives in a real DB; sessions can be hours apart.
`);
