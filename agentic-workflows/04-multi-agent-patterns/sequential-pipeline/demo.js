// Sequential Pipeline — research → outline → draft.
// Run: node demo.js

// Each stage takes structured input and produces structured output.

function researcher(query) {
  console.log(`[stage 1] researcher("${query}")`);
  return {
    topic: query,
    sources: [
      { url: 'https://example.com/a', claim: 'Postgres logical replication added in 2017.' },
      { url: 'https://example.com/b', claim: 'CDC patterns enable downstream eventing.' },
      { url: 'https://example.com/c', claim: 'Schema evolution remains a hard problem.' }
    ]
  };
}

function outliner(research) {
  console.log(`[stage 2] outliner(research with ${research.sources.length} sources)`);
  return {
    title: `On ${research.topic}`,
    sections: [
      { title: 'Background', claims: [research.sources[0]] },
      { title: 'Why it matters', claims: [research.sources[1]] },
      { title: 'Open challenges', claims: [research.sources[2]] }
    ]
  };
}

function writer(outline) {
  console.log(`[stage 3] writer(outline with ${outline.sections.length} sections)`);
  const paragraphs = outline.sections.map(s => {
    const claim = s.claims[0]?.claim ?? '';
    return `## ${s.title}\n\n${claim} This subsection unpacks the implications.`;
  });
  return {
    title: outline.title,
    body: paragraphs.join('\n\n'),
    citations: outline.sections.flatMap(s => s.claims.map(c => c.url))
  };
}

// === The pipeline ===

function runPipeline(query) {
  console.log(`\n=== Running pipeline for: "${query}" ===\n`);
  const stage1 = researcher(query);
  const stage2 = outliner(stage1);
  const stage3 = writer(stage2);
  return stage3;
}

const result = runPipeline('Postgres CDC patterns');

console.log('\n=== FINAL ARTIFACT ===\n');
console.log(`# ${result.title}\n\n${result.body}\n\n---\nCitations:\n${result.citations.map(c => `- ${c}`).join('\n')}`);

console.log(`
Take note:
  - Each stage takes a structured input and produces a structured output.
  - The next stage depends on the previous — no parallelism here.
  - Stage 4 (editor) could be added without touching the others.
  - In production, persist each stage's output: if stage 3 crashes, you can
    resume from stage 2's saved artifact.
  - The "stages as separate agents" version would have each be a
    .claude/agents/<role>.md file invoked sequentially by an orchestrator.
`);
