// Critic / Reviewer — producer + critic in a bounded revise loop.
// Run: node demo.js

let producerPass = 0;

function producer(brief, prevCritique) {
  producerPass++;
  console.log(`\n[producer] pass ${producerPass}`);

  // Simulate progressive improvement based on critique
  if (producerPass === 1) {
    return { title: 'Q3 Plan', goals: ['ship feature X'] };  // missing budget, owner
  }
  if (producerPass === 2) {
    return { title: 'Q3 Plan', goals: ['ship feature X'], owner: 'Kyle' };  // still missing budget
  }
  return { title: 'Q3 Plan', goals: ['ship feature X'], owner: 'Kyle', budget: 50000 };
}

function critic(artifact) {
  console.log(`[critic] reviewing artifact`);
  const issues = [];
  if (!artifact.owner) issues.push({ severity: 'high', message: 'missing required field: owner' });
  if (!artifact.budget) issues.push({ severity: 'high', message: 'missing required field: budget' });
  if (!artifact.goals || artifact.goals.length < 2) issues.push({ severity: 'low', message: 'recommend at least 2 goals' });

  const verdict = issues.some(i => i.severity === 'high')
    ? 'revise'
    : (issues.length > 0 ? 'accept_with_notes' : 'accept');
  return { verdict, issues };
}

function runWithRevise(brief, maxRevisions = 3) {
  let artifact = producer(brief, null);
  let critique = null;

  for (let revision = 0; revision <= maxRevisions; revision++) {
    critique = critic(artifact);
    console.log(`[critic] verdict: ${critique.verdict}, issues: ${critique.issues.length}`);

    if (critique.verdict !== 'revise') break;
    if (revision === maxRevisions) {
      console.log(`[runner] max revisions reached, returning best-effort`);
      break;
    }
    artifact = producer(brief, critique);
  }

  return { artifact, critique, revisions: producerPass - 1 };
}

const result = runWithRevise('Draft a Q3 plan');

console.log('\n=== FINAL ===');
console.log('Artifact:', JSON.stringify(result.artifact, null, 2));
console.log('Verdict:', result.critique.verdict);
console.log('Revisions:', result.revisions);

console.log(`
Take note:
  - Producer + critic operate in turn. Critic gates "good enough."
  - Bounded loop (3 revisions max) prevents infinite churn.
  - "accept_with_notes" lets minor issues through (low-severity).
  - In real life, the critic is a separate LLM with a different system prompt.
  - Multiple critics (security + perf + readability) is the /review-crew pattern.
`);
