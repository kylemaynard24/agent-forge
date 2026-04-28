// Plans and Tasks — plan-then-act with replanning.
// Run: node demo.js

// === A plan is structured state ===

function makePlan(goal, steps) {
  return {
    goal,
    steps: steps.map((action, i) => ({ id: `s${i + 1}`, action, status: 'pending', notes: '' }))
  };
}

function printPlan(plan) {
  console.log(`\nPlan: ${plan.goal}`);
  for (const s of plan.steps) {
    const mark = { pending: '[ ]', done: '[x]', failed: '[!]', skipped: '[~]' }[s.status];
    console.log(`  ${mark} ${s.id}: ${s.action}${s.notes ? ' — ' + s.notes : ''}`);
  }
}

// === Stub planner (would be an LLM call) ===
function planner(goal) {
  return makePlan(goal, [
    'List files in src/auth/',
    'Read each .py file',
    'Identify legacy patterns',
    'Propose refactor changes',
    'Apply changes'
  ]);
}

// === Stub executor — picks tool & status per step ===
async function executeStep(step, ctx) {
  console.log(`\n  -> executing ${step.id}: ${step.action}`);

  // Pretend tool calls. Step 3 fails to demonstrate replan.
  if (step.id === 's3' && !ctx.retried) {
    return { status: 'failed', notes: 'no obvious patterns; need clearer criteria' };
  }
  if (step.id === 's5') {
    return { status: 'done', notes: '4 files modified' };
  }
  return { status: 'done', notes: 'ok' };
}

// === Replan when a step fails ===
function replan(plan, failedStep) {
  // A real agent would call the LLM with the plan + failure to get a new plan.
  // We hand-roll a replan: insert a clarifying step before the failed one.
  const insertAt = plan.steps.findIndex(s => s.id === failedStep.id);
  const clarify = {
    id: `${failedStep.id}_clarify`,
    action: `Clarify criteria for "${failedStep.action}" with the user`,
    status: 'pending',
    notes: 'inserted by replan'
  };
  plan.steps.splice(insertAt, 0, clarify);
  // Reset the failed step to pending; we'll retry after clarification.
  failedStep.status = 'pending';
  failedStep.notes = 'will retry after clarification';
  return plan;
}

// === Loop: plan → execute → maybe replan → execute → ... → finish ===
async function run(goal) {
  let plan = planner(goal);
  printPlan(plan);

  const ctx = { retried: false };
  for (let safety = 0; safety < 20; safety++) {
    const next = plan.steps.find(s => s.status === 'pending');
    if (!next) break;       // all done

    const result = await executeStep(next, ctx);
    next.status = result.status;
    next.notes = result.notes;

    if (result.status === 'failed') {
      console.log(`  step ${next.id} failed — replanning`);
      plan = replan(plan, next);
      ctx.retried = true;
      printPlan(plan);
    }
  }

  printPlan(plan);
  console.log('\nDone.');
}

run('Refactor the auth module');

console.log(`
Take note:
  - The plan is structured state (a JS object) that gets updated each step.
  - Status values are explicit: pending / done / failed / skipped.
  - When a step fails, the agent doesn't crash — it replans.
  - The plan is the audit trail. After the run, you can see what was tried.
  - In production, persist this plan to disk (see memory-patterns).
`);
