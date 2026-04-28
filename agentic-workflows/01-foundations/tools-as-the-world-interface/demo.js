// Tools — good, bad, and the agent's behavior across them.
// Run: node demo.js

// === GOOD TOOLS ===
const goodTools = {
  read_file: {
    description: 'Read the contents of a file. Returns text content or "ENOENT: <path>" if not found. Use for text files only.',
    schema:      { path: 'string (required) — absolute or relative path' },
    fn({ path }) {
      const fs = { 'todo.txt': 'a\nb\nc\nd' };
      return fs[path] ?? `ENOENT: ${path}`;
    }
  },
  count_lines: {
    description: 'Count newlines in a string. Returns an integer. Use after read_file to count lines.',
    schema:      { text: 'string (required)' },
    fn({ text }) { return text.split('\n').length; }
  },
  finish: {
    description: 'End the agent run with a final answer. Always call this when you have the answer.',
    schema:      { answer: 'string (required)' },
    fn({ answer }) { return { __done: true, answer }; }
  }
};

// === BAD TOOLS — for contrast ===
const badTools = {
  // Vague name + super-tool
  do_thing: {
    description: 'Do various file operations.',
    schema:      { action: 'string', target: 'string', maybe_extra: 'any?' },
    fn({ action, target }) {
      if (action === 'read') return goodTools.read_file.fn({ path: target });
      if (action === 'count') return target.split('\n').length;
      return 'unknown action';
    }
  },
  // Two confusables
  run_query:    { description: 'Run a query.',    schema: { q: 'string' }, fn: () => '...' },
  run_sql:      { description: 'Run SQL.',         schema: { sql: 'string' }, fn: () => '...' },
};

// === Stub LLM that picks tools given a tool set ===
function stubLLM(toolSet, scenario) {
  // Hardcoded "decisions" — in real life the LLM would pick.
  if (toolSet === goodTools) {
    return [
      { tool: 'read_file',  args: { path: 'todo.txt' } },
      { tool: 'count_lines', args: { text: '__obs__' } },
      { tool: 'finish',     args: { answer: 'todo.txt has __obs__ lines' } }
    ];
  }
  // With bad tools, the model "gets confused" — picks the super-tool with vague args
  return [
    { tool: 'do_thing', args: { action: 'read',  target: 'todo.txt' } },
    { tool: 'do_thing', args: { action: 'count', target: '__obs__' } },
    { tool: 'finish',   args: { answer: 'todo.txt has __obs__ lines' } }   // hallucinated finish — not in bad set!
  ];
}

// === Tiny loop ===
function runAgent(toolSet, label) {
  console.log(`\n=== ${label} ===`);
  const script = stubLLM(toolSet, null);
  let lastObs = null;

  for (const action of script) {
    const args = JSON.parse(JSON.stringify(action.args));
    for (const k of Object.keys(args)) {
      if (typeof args[k] === 'string' && args[k].includes('__obs__')) {
        args[k] = args[k].replace('__obs__', lastObs);
      }
    }
    const def = toolSet[action.tool];
    if (!def) {
      console.log(`  agent picked tool '${action.tool}' — NOT IN TOOL SET. Halt.`);
      return;
    }
    console.log(`  -> ${action.tool}(${JSON.stringify(args)})`);
    const result = def.fn(args);
    if (result && result.__done) {
      console.log(`  finished: ${result.answer}`);
      return;
    }
    lastObs = result;
    console.log(`  observed: ${typeof result === 'string' ? result.slice(0, 40) : result}`);
  }
}

runAgent(goodTools, 'GOOD TOOLS — clean, named-for-verb, one-purpose');
runAgent(badTools,  'BAD TOOLS — vague super-tool, agent hallucinates "finish"');

console.log('\nLessons:');
console.log('  - With good tools, the agent reliably composes read_file -> count_lines -> finish.');
console.log('  - With a vague super-tool, even when it works, you can\'t tell from the trace what the agent intended.');
console.log('  - The agent hallucinated `finish` against bad-tools because the bad set lacks one.');
console.log('    Lesson: not having a `finish` tool is a tool-design bug.');
