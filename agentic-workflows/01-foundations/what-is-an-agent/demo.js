// What is an agent? — a minimal agent in 60 lines.
// Run: node demo.js
//
// No API key required. The "LLM" is a stub function that returns canned actions.
// The loop, tool dispatch, and observation flow are real.

// === 1) TOOLS — the agent's hands and eyes ===
const tools = {
  read_file(args) {
    const fakeFs = { 'todo.txt': 'buy milk\nwrite syllabus\ncommit dojo' };
    return fakeFs[args.path] ?? `ENOENT: ${args.path}`;
  },
  count_lines(args) {
    return args.text.split('\n').length;
  },
  finish(args) {
    return { done: true, answer: args.answer };
  }
};

// === 2) STUB LLM — replace with a real API call in production ===
// Given the conversation so far, returns the next action.
// In real life, the LLM picks; here we hardcode the script for clarity.
const cannedResponses = [
  { tool: 'read_file', args: { path: 'todo.txt' } },
  { tool: 'count_lines', args: { text: '__USE_LAST_OBSERVATION__' } },
  { tool: 'finish', args: { answer: 'There are __USE_LAST_OBSERVATION__ lines in todo.txt.' } }
];
let stepIndex = 0;
function stubLLM(_history) {
  const action = cannedResponses[stepIndex++];
  return action ?? { tool: 'finish', args: { answer: 'I give up.' } };
}

// === 3) THE LOOP — perceive, decide, act, observe, repeat ===
function runAgent(goal, maxSteps = 10) {
  const history = [{ role: 'user', content: goal }];
  let lastObservation = null;

  for (let step = 0; step < maxSteps; step++) {
    console.log(`\n--- step ${step + 1} ---`);

    // PERCEIVE: include observation from previous step.
    if (lastObservation !== null) history.push({ role: 'tool', content: lastObservation });

    // THINK: ask the LLM what to do next.
    const action = stubLLM(history);
    if (action.args.text === '__USE_LAST_OBSERVATION__') action.args.text = lastObservation;
    if (typeof action.args.answer === 'string' && action.args.answer.includes('__USE_LAST_OBSERVATION__')) {
      action.args.answer = action.args.answer.replace('__USE_LAST_OBSERVATION__', lastObservation);
    }
    console.log(`agent decides: ${action.tool}(${JSON.stringify(action.args)})`);

    // ACT: dispatch the tool call.
    const fn = tools[action.tool];
    if (!fn) {
      lastObservation = `error: unknown tool ${action.tool}`;
      console.log(`tool error: ${lastObservation}`);
      continue;
    }
    const observation = fn(action.args);

    // TERMINATE: tools can signal completion.
    if (observation && observation.done) {
      console.log(`\n=== agent finished ===\nfinal answer: ${observation.answer}`);
      return observation.answer;
    }

    // OBSERVE: record the result for the next iteration.
    lastObservation = observation;
    console.log(`observation: ${JSON.stringify(observation)}`);
    history.push({ role: 'assistant', content: JSON.stringify(action) });
  }

  console.log('agent hit maxSteps without finishing');
  return null;
}

// === 4) GOAL — what the agent is trying to do ===
const goal = 'Tell me how many lines are in todo.txt.';
runAgent(goal);

// Take note: the four pieces are all here.
//   tools          — the dictionary above
//   stubLLM        — the decision-maker (a real one would call Claude)
//   runAgent       — the loop
//   goal           — the user's intent, fed into the first prompt
