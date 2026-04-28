// The Agentic Loop — explicit phases with logging.
// Run: node demo.js
//
// This is the same kind of agent as the previous topic, but with the loop's
// internal phases printed so you can see exactly when each happens.

// === Tools ===
const tools = {
  list_files()        { return ['todo.txt', 'syllabus.md']; },
  read_file({ path }) { return path === 'todo.txt' ? 'a\nb\nc\nd' : 'syllabus content'; },
  finish({ answer })  { return { __done: true, answer }; }
};

// === Stub LLM with a small ReAct-style reasoning trace ===
const script = [
  { thought: 'I need to know what files exist before I can count anything.',
    action: { tool: 'list_files', args: {} } },
  { thought: 'todo.txt is the file I want. Read it.',
    action: { tool: 'read_file', args: { path: 'todo.txt' } } },
  { thought: 'It has 4 lines. Report.',
    action: { tool: 'finish', args: { answer: 'todo.txt has 4 lines' } } }
];
let i = 0;
function stubLLM(_history) { return script[i++] ?? { thought: 'give up', action: { tool: 'finish', args: { answer: 'unknown' } } }; }

// === Loop with explicit phases ===
function runAgent(goal, opts = {}) {
  const maxSteps = opts.maxSteps ?? 10;
  const history = [{ role: 'user', content: goal }];

  for (let step = 1; step <= maxSteps; step++) {
    console.log(`\n========== STEP ${step} ==========`);

    // PERCEIVE — assemble the input the LLM will see.
    console.log('[PERCEIVE] history length:', history.length, 'messages');

    // THINK — LLM emits thought + action.
    const { thought, action } = stubLLM(history);
    console.log(`[THINK]    thought: "${thought}"`);
    console.log(`[THINK]    action:  ${action.tool}(${JSON.stringify(action.args)})`);

    // ACT — dispatch tool.
    const fn = tools[action.tool];
    if (!fn) {
      const err = `unknown tool: ${action.tool}`;
      console.log(`[ACT]      ERROR: ${err}`);
      history.push({ role: 'tool', content: err });
      continue;
    }
    let result;
    try {
      result = fn(action.args);
    } catch (e) {
      console.log(`[ACT]      tool threw: ${e.message}`);
      history.push({ role: 'tool', content: `error: ${e.message}` });
      continue;
    }
    console.log(`[ACT]      executed ${action.tool}`);

    // TERMINATE — tools can declare done.
    if (result && result.__done) {
      console.log(`[OBSERVE]  result: done, answer="${result.answer}"`);
      console.log(`\n========== FINISHED in ${step} steps ==========`);
      return result.answer;
    }

    // OBSERVE — feed result back into history.
    const obsStr = typeof result === 'string' ? result : JSON.stringify(result);
    console.log(`[OBSERVE]  result: ${obsStr.length > 60 ? obsStr.slice(0, 60) + '...' : obsStr}`);
    history.push({ role: 'assistant', content: JSON.stringify({ thought, action }) });
    history.push({ role: 'tool', content: obsStr });

    // DECIDE-CONTINUE — implicit: we're back at the top of the loop.
    console.log('[DECIDE]   continue');
  }

  console.log(`\n========== HIT maxSteps=${maxSteps} ==========`);
  console.log('Agent did not finish. In production this is where you alert/fallback.');
  return null;
}

// === Run ===
runAgent('Count the lines in todo.txt.');

// Things to look at when you read the output:
//   1. Each step shows ALL FOUR PHASES in order.
//   2. The PERCEIVE phase grows each iteration (history length increases).
//   3. Termination is triggered by a tool result, not by the LLM saying "done"
//      in plain text. (Plain text is parsing brittleness; structured output is robust.)
//   4. The maxSteps cap exists for a reason. Try setting `i` to never reach `finish`
//      (delete the third script entry) and watch the cap trip.
