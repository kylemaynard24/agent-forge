// Trade-off analysis — given constraints, recommend patterns from the dojo.
// Run: node demo.js

const ALL_PATTERNS = [
  'retry-and-timeout',
  'circuit-breaker',
  'bulkhead',
  'rate-limiting',
  'load-balancing',
  'idempotency',
  'observability',
  'cap-and-pacelc',
  'fallacies-of-distributed-computing',
];

// Each rule turns one constraint signal into a list of (pattern, justification).
function recommend(c) {
  const recs = new Map(); // pattern -> [reasons]
  const add = (pattern, reason) => {
    if (!recs.has(pattern)) recs.set(pattern, []);
    recs.get(pattern).push(reason);
  };
  const skip = new Map();
  const drop = (pattern, reason) => {
    if (!skip.has(pattern)) skip.set(pattern, []);
    skip.get(pattern).push(reason);
  };

  // Always: observability and the fallacies, regardless of size.
  add('observability', 'You cannot operate what you cannot see.');
  add('fallacies-of-distributed-computing', 'Free; pure mindset; applies from day one.');

  // Any external dependency
  if (c.callsExternalApis) {
    add('retry-and-timeout', 'Every external call needs a deadline and bounded retries.');
    add('idempotency', 'Retries are unsafe without idempotency keys on mutations.');
  } else {
    drop('retry-and-timeout', 'No external calls — premature.');
  }

  // Scale signals
  if (c.requestsPerSecond >= 100) {
    add('rate-limiting', 'At >=100 rps you will eventually need to cap abusive callers.');
  }
  if (c.replicas >= 2) {
    add('load-balancing', 'Multiple replicas require a balancing strategy.');
  } else {
    drop('load-balancing', 'Single replica — no distribution problem yet.');
  }

  // Failure-blast-radius signals
  if (c.dependsOnFlakyDownstream) {
    add('circuit-breaker', 'Flaky downstream — fail fast to protect callers and the downstream.');
  }
  if (c.multiTenant) {
    add('bulkhead', 'Multiple tenants share resources — isolate so one cannot starve others.');
  } else {
    drop('bulkhead', 'Single workload — no neighbors to protect from.');
  }

  // Distribution signals
  if (c.replicas >= 2 || c.requestsPerSecond >= 1000 || c.multiRegion) {
    add('cap-and-pacelc', 'Multi-node state means real CAP/PACELC choices to make.');
  } else {
    drop('cap-and-pacelc', 'Not (yet) a distributed-state problem.');
  }

  // Team-size and budget vetoes
  if (c.teamSize <= 2) {
    drop('circuit-breaker', 'Too small a team to operate the extra moving part — start with timeouts.');
    drop('bulkhead', 'Operationally heavy for a tiny team.');
    if (recs.has('circuit-breaker')) recs.delete('circuit-breaker');
    if (recs.has('bulkhead')) recs.delete('bulkhead');
  }
  if (c.monthlyBudgetUsd < 200) {
    drop('cap-and-pacelc', 'A single-DB setup is fine at this budget; do not buy multi-region yet.');
    if (recs.has('cap-and-pacelc')) recs.delete('cap-and-pacelc');
  }

  return { recs, skip };
}

function printPlan(label, c) {
  console.log(`\n=== ${label} ===`);
  console.log('Constraints:', JSON.stringify(c));

  const { recs, skip } = recommend(c);

  console.log('\n  Reach for:');
  for (const p of ALL_PATTERNS) {
    if (!recs.has(p)) continue;
    console.log(`    + ${p}`);
    for (const r of recs.get(p)) console.log(`        - ${r}`);
  }

  console.log('\n  Skip for now:');
  for (const p of ALL_PATTERNS) {
    if (recs.has(p)) continue;
    const reasons = skip.get(p) ?? ['Not justified by current constraints.'];
    console.log(`    - ${p}: ${reasons[0]}`);
  }
}

// Three concrete scenarios — change the inputs and re-run.
printPlan('Scenario A: solo founder, MVP, no users yet', {
  teamSize: 1, monthlyBudgetUsd: 50, requestsPerSecond: 1,
  replicas: 1, multiTenant: false, multiRegion: false,
  callsExternalApis: false, dependsOnFlakyDownstream: false,
});

printPlan('Scenario B: 8-person startup, B2B SaaS, 200 rps, calls Stripe', {
  teamSize: 8, monthlyBudgetUsd: 5000, requestsPerSecond: 200,
  replicas: 3, multiTenant: true, multiRegion: false,
  callsExternalApis: true, dependsOnFlakyDownstream: true,
});

printPlan('Scenario C: 80-person scale-up, global product, 10k rps', {
  teamSize: 80, monthlyBudgetUsd: 200000, requestsPerSecond: 10000,
  replicas: 50, multiTenant: true, multiRegion: true,
  callsExternalApis: true, dependsOnFlakyDownstream: true,
});

console.log('\nThe recommendations are not laws — they are a starting point for a design conversation.');
