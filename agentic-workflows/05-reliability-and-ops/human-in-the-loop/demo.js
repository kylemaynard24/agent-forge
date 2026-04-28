// Human-in-the-Loop — pause for approval at irreversible / ambiguous gates.
// Run: node demo.js

// Stub "user" that responds to gate prompts. In real life this is your UI.
const userResponses = {
  delete_confirmation: { decision: 'approve_with_edits', edits: { count_cap: 50 } },
  ambiguity_clarification: { decision: 'choose', choice: 'duplicates_only' }
};

function askHuman(gate) {
  console.log(`\n[GATE] ${gate.kind}`);
  console.log(`  proposed: ${gate.proposed}`);
  console.log(`  rationale: ${gate.rationale}`);
  if (gate.alternatives) console.log(`  alternatives: ${gate.alternatives.join(', ')}`);
  // In a real system: pause loop, surface UI, await user.
  const response = userResponses[gate.kind] ?? { decision: 'reject' };
  console.log(`  → user: ${JSON.stringify(response)}`);
  return response;
}

async function agentRun() {
  console.log('agent: exploring the data...');
  console.log('agent: found 100 records that look like duplicates');

  // Gate 1: ambiguity clarification BEFORE acting
  const clarif = askHuman({
    kind: 'ambiguity_clarification',
    proposed: 'identify duplicates by criteria',
    rationale: 'Two interpretations of "duplicates" possible — exact match vs near-match',
    alternatives: ['exact_match', 'duplicates_only', 'near_match']
  });

  if (clarif.decision !== 'choose') return console.log('agent: aborted; ambiguity unresolved');
  console.log(`agent: using interpretation "${clarif.choice}"`);
  console.log('agent: planning to delete 100 records...');

  // Gate 2: irreversible action
  const approve = askHuman({
    kind: 'delete_confirmation',
    proposed: 'delete 100 records matching duplicates_only',
    rationale: 'no FK references; safe per pre-flight check',
    alternatives: ['mark_deleted_instead']
  });

  if (approve.decision === 'reject') return console.log('agent: cancelled by user');
  if (approve.decision === 'approve_with_edits') {
    const cap = approve.edits?.count_cap;
    console.log(`agent: user capped delete at ${cap} records; proceeding with first ${cap}`);
  }

  console.log('agent: deletion complete (simulated)');
  console.log('agent: finished');
}

agentRun().then(() => {
  console.log(`
Take note:
  - Gates are STRUCTURED — kind, proposed, rationale, alternatives.
  - User can approve, reject, or edit.
  - The agent integrates the user's response (e.g., honors the cap).
  - The user spent ~30 seconds reviewing; not a chore.
  - In a UI: gates surface as inline approval cards; user can defer or async-approve.
`);
});
