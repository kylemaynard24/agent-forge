// Hierarchical — 3-level decomposition + aggregation.
// Run: node demo.js

let llmCalls = 0;
async function fakeLLM(level, prompt) {
  llmCalls++;
  await new Promise(r => setTimeout(r, 30));
  return `[${level}] response to: ${prompt.slice(0, 40)}`;
}

// === Worker (leaf) ===
async function worker(angle) {
  return await fakeLLM('worker', `research the angle: ${angle}`);
}

// === Manager (middle level) ===
async function manager(subtopic) {
  // Decompose into angles
  const angles = [`${subtopic}: history`, `${subtopic}: state of the art`, `${subtopic}: open questions`];
  // Fan out workers
  const findings = await Promise.all(angles.map(worker));
  // Synthesize at this level — that's what makes the manager NOT just a passthrough
  const synthesis = await fakeLLM('manager', `synthesize: ${findings.join(' | ')}`);
  return { subtopic, findings, synthesis };
}

// === Top (CEO) ===
async function topAgent(topic) {
  // Decompose into sub-topics
  const subtopics = [`${topic} — technical`, `${topic} — business`];
  // Each subtopic dispatched to a manager
  const reports = await Promise.all(subtopics.map(manager));
  // Top-level synthesis
  const synthesis = await fakeLLM('top', `final synthesis: ${reports.map(r => r.synthesis).join(' | ')}`);
  return { topic, reports, synthesis };
}

(async () => {
  const start = Date.now();
  const result = await topAgent('Postgres CDC patterns');
  const wall = Date.now() - start;

  console.log('=== Hierarchical run ===');
  console.log(`LLM calls: ${llmCalls}`);
  console.log(`Wall time: ${wall}ms`);
  console.log(`\nResult tree:`);
  for (const r of result.reports) {
    console.log(`  ${r.subtopic}`);
    for (const f of r.findings) console.log(`    - ${f.slice(0, 60)}`);
    console.log(`    [synthesis] ${r.synthesis.slice(0, 60)}`);
  }
  console.log(`\nTop synthesis: ${result.synthesis.slice(0, 80)}`);

  console.log(`
Take note:
  - 3 levels: top (1 call) + 2 managers (2 + 6 worker calls) + 1 top synthesis = many calls.
  - Fan-out at each level happens in parallel (Promise.all).
  - The total LLM-call cost grows quickly with depth × width.
  - If a manager just concatenated worker outputs without LLM-synthesizing,
    it would be dead weight. The synthesis step is what justifies the level.
`);
})();
