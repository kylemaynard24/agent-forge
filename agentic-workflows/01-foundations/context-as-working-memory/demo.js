// Context as Working Memory — three strategies, measured.
// Run: node demo.js

// We simulate "context" as a list of message strings.
// "Tokens" is approximated by character count (good enough for the lesson).

function tokensOf(history)  { return history.reduce((s, m) => s + m.length, 0); }
function summarizeOldTurns(history) {
  // Keep last 3 turns; replace older ones with a single summary.
  if (history.length <= 4) return history;
  const head = history[0];                       // system / goal
  const tail = history.slice(-3);                // recent
  const middleCount = history.length - 1 - 3;
  const summary = `[summary] elided ${middleCount} earlier turns covering exploration of repo files.`;
  return [head, summary, ...tail];
}

// Three context strategies:

function naiveAppend(history, msg) {
  return [...history, msg];
}

function truncateLargeObservations(history, msg, maxObs = 80) {
  if (msg.length > maxObs) {
    msg = msg.slice(0, maxObs) + ` [truncated, original ${msg.length} chars]`;
  }
  return [...history, msg];
}

function summarizingHistory(history, msg) {
  const next = [...history, msg];
  return summarizeOldTurns(next);
}

// === Run the same long agent under each strategy ===

const strategies = {
  naive: naiveAppend,
  truncate: truncateLargeObservations,
  summarize: summarizingHistory
};

function simulate(strategyName) {
  const append = strategies[strategyName];
  let history = [`[system] you are a research agent`, `[user] explore the repo`];
  const checkpoints = [];

  // Simulate 12 turns. Some observations are "huge" (3000 chars).
  for (let i = 1; i <= 12; i++) {
    const big = (i % 4 === 0);
    const obs = big
      ? `[observation ${i}] ` + 'lorem '.repeat(600)        // ~3000 chars
      : `[observation ${i}] file scanned, found N matches`; // small
    history = append(history, `[action ${i}] explore_dir / ` );
    history = append(history, obs);
    if (i % 3 === 0) checkpoints.push({ turn: i, tokens: tokensOf(history), len: history.length });
  }

  return { strategyName, finalTokens: tokensOf(history), finalLength: history.length, checkpoints };
}

const results = Object.keys(strategies).map(simulate);

console.log('=== Context size after the same 12-turn run, three strategies ===\n');
console.log(`${'strategy'.padEnd(11)} ${'final tokens'.padStart(14)} ${'final msgs'.padStart(12)}`);
for (const r of results) {
  console.log(`${r.strategyName.padEnd(11)} ${String(r.finalTokens).padStart(14)} ${String(r.finalLength).padStart(12)}`);
}

console.log('\nCheckpoints (every 3 turns) — naive grows linearly with observation size:');
for (const r of results) {
  console.log(`\n${r.strategyName}:`);
  for (const c of r.checkpoints) {
    console.log(`  turn ${c.turn}: ${c.tokens} tokens, ${c.len} messages`);
  }
}

console.log('\nObservations (heh):');
console.log('  1. Naive grows ~linearly with EACH big observation. Eventually exceeds budget.');
console.log('  2. Truncate caps each observation; final size grows with TURN COUNT, not observation size.');
console.log('  3. Summarize compresses older history into one message, keeping the prompt small.');
console.log('\nIn production, you usually mix strategies: truncate huge tool outputs AND summarize long histories.');
