// Hand-Off vs Delegation — same scenario, different shapes.
// Run: node demo.js

const userRequest = "I want to build a real-time chat app. Should I use websockets?";

// === DELEGATION ===
// Orchestrator handles the user; spawns specialists; synthesizes; replies.

async function delegationFlow() {
  console.log('\n=== DELEGATION ===');
  console.log('orchestrator: receiving user request');

  // Spawn specialists
  const networkingResult = await fakeAgent('networking-specialist', 'recommend transport for chat');
  const dbResult = await fakeAgent('database-specialist', 'recommend storage for chat messages');

  // Synthesize
  const synthesis = `Recommendation: ${networkingResult} + ${dbResult}`;
  console.log(`orchestrator: synthesized response → "${synthesis}"`);
  console.log('orchestrator: replies to user');
}

// === HAND-OFF ===
// Router classifies; transfers to specialist; specialist owns the rest.

async function handOffFlow() {
  console.log('\n=== HAND-OFF ===');
  console.log('router: classifying user request');
  const intent = 'real-time-architecture';
  console.log(`router: intent="${intent}", handing off to specialist`);
  console.log('router: (router is now done)');

  // Specialist takes over — has its own conversation with the user
  const specialistReply = await fakeAgent('realtime-architect', userRequest);
  console.log(`realtime-architect: replies to user → "${specialistReply}"`);
}

async function fakeAgent(name, prompt) {
  await new Promise(r => setTimeout(r, 50));
  return `[${name}] suggests: pick websockets if low-latency matters, otherwise long-poll.`;
}

(async () => {
  await delegationFlow();
  await handOffFlow();

  console.log(`
Take note:
  - DELEGATION: orchestrator stays in charge; synthesizes; replies. Two specialists' inputs.
  - HAND-OFF: router decides; specialist OWNS the response. Router is done.
  - When the user asks a follow-up:
    * Delegation: orchestrator handles it (might re-delegate).
    * Hand-off: the realtime-architect handles it directly.
  - Hand-off is uncommon in Claude Code; most "multi-agent" cases are delegation.
  - Reach for hand-off when the rest of the conversation truly belongs in a different specialty.
`);
})();
