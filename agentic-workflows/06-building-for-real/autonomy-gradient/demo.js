// The Autonomy Gradient — same agent, three levels.
// Run: node demo.js

// === An agent action ===
const action = { tool: 'Write', args: { path: 'src/billing.js', content: '...' } };
const sensitiveAction = { tool: 'Bash', args: { command: 'rm -rf /tmp/scratch' } };

// === Policy by level ===
function policy(level, action) {
  // Level 1: every action gates.
  if (level === 1) return 'gate';

  // Level 2: read-only auto, writes gate, dangerous deny.
  if (level === 2) {
    if (action.tool === 'Read' || action.tool === 'Grep') return 'auto';
    if (action.tool === 'Bash' && /rm -rf/.test(JSON.stringify(action.args))) return 'gate';
    return 'gate';
  }

  // Level 3: writes auto in approved paths; risky still gates.
  if (level === 3) {
    if (action.tool === 'Read' || action.tool === 'Grep') return 'auto';
    if (action.tool === 'Bash' && /rm -rf/.test(JSON.stringify(action.args))) return 'gate';
    if (action.tool === 'Write' && action.args.path.startsWith('src/')) return 'auto';
    return 'gate';
  }
}

function dispatch(level, action, label) {
  const decision = policy(level, action);
  const sym = decision === 'auto' ? '→' : '⏸';
  console.log(`  ${sym} ${decision.padEnd(5)} ${action.tool}(${JSON.stringify(action.args).slice(0, 60)})`);
}

console.log('=== Level 1: gate everything ===');
dispatch(1, { tool: 'Read', args: { path: 'a.js' } });
dispatch(1, action);
dispatch(1, sensitiveAction);

console.log('\n=== Level 2: auto-read, gate writes ===');
dispatch(2, { tool: 'Read', args: { path: 'a.js' } });
dispatch(2, action);
dispatch(2, sensitiveAction);

console.log('\n=== Level 3: auto-write in src/, gate sensitive ===');
dispatch(3, { tool: 'Read', args: { path: 'a.js' } });
dispatch(3, action);
dispatch(3, sensitiveAction);

console.log(`
Take note:
  - Level 1: maximum control, slowest.
  - Level 2: reads auto-allowed; user pace stays high.
  - Level 3: writes in trusted paths auto; sensitive still gated.
  - The 'rm -rf' case stays gated at every level — some actions never auto-allow.
  - Promotion: only after observed pattern of safe behavior at the lower level.
`);
