// Tool Design Principles — super-tool vs decomposed.
// Run: node demo.js

// === BAD: a super-tool ===
const superTool = {
  file_op: {
    description: 'Various file operations.',
    schema: { action: 'string (read|write|delete)', path: 'string', content: 'string?' },
    fn({ action, path, content }) {
      if (action === 'read')   return fakeFs[path] ?? `ERROR: ${path} not found`;
      if (action === 'write')  { fakeFs[path] = content; return 'ok'; }
      if (action === 'delete') { delete fakeFs[path]; return 'ok'; }
      return `ERROR: unknown action ${action}`;
    }
  }
};

// === GOOD: three single-purpose tools ===
const cleanTools = {
  read_file: {
    description: 'Read a text file. Returns content, or "ERROR:" prefix on failure.',
    schema: { path: 'string (required)' },
    fn({ path }) { return fakeFs[path] ?? `ERROR: ${path} not found`; }
  },
  write_file: {
    description: 'Write text to a file. Returns "ok" on success or "ERROR:" prefix on failure.',
    schema: { path: 'string (required)', content: 'string (required)' },
    fn({ path, content }) { fakeFs[path] = content; return 'ok'; }
  },
  delete_file: {
    description: 'Delete a file. Returns "ok" on success or "ERROR:" if not found.',
    schema: { path: 'string (required)' },
    fn({ path }) {
      if (!(path in fakeFs)) return `ERROR: ${path} not found`;
      delete fakeFs[path]; return 'ok';
    }
  }
};

const fakeFs = { 'todo.txt': 'a\nb\nc' };

// === Stub LLM behaviors ===
// With the super-tool, the LLM sometimes omits 'action' or guesses wrong.
// With clean tools, the verb is in the name and the schema is exact.

function withSuperTool() {
  console.log('=== SUPER-TOOL agent ===');
  // Simulate LLM mistakes:
  const calls = [
    { tool: 'file_op', args: { path: 'todo.txt' } },                          // forgot action
    { tool: 'file_op', args: { action: 'red',  path: 'todo.txt' } },          // typo
    { tool: 'file_op', args: { action: 'read', path: 'todo.txt' } }           // finally
  ];
  for (const c of calls) {
    const result = superTool.file_op.fn(c.args);
    console.log(`  ${c.tool}(${JSON.stringify(c.args)}) → ${typeof result === 'string' ? result.slice(0, 50) : JSON.stringify(result)}`);
  }
  console.log('  3 calls to do 1 thing. The super-tool made the LLM slow.\n');
}

function withCleanTools() {
  console.log('=== CLEAN TOOLS agent ===');
  const calls = [
    { tool: 'read_file', args: { path: 'todo.txt' } }
  ];
  for (const c of calls) {
    const result = cleanTools[c.tool].fn(c.args);
    console.log(`  ${c.tool}(${JSON.stringify(c.args)}) → ${typeof result === 'string' ? result.slice(0, 50) : JSON.stringify(result)}`);
  }
  console.log('  1 call. Verb in the name. No mode-parameter confusion.\n');
}

withSuperTool();
withCleanTools();

console.log('Take note:');
console.log('  - The super-tool LLM "wasted" two calls fumbling action values.');
console.log('  - The clean LLM picked the verb-named tool directly.');
console.log('  - In real systems, every wasted call is real money and real latency.');
console.log('  - The fix is rarely "tell the LLM to be more careful"; the fix is the tool design.');
