// Flaky Test Diagnosis — tiny verification simulation.
// Run: node demo.js

const checks = [
  { name: 'fast check', scope: 'narrow boundary', value: true },
  { name: 'workflow check', scope: 'broader boundary', value: true }
];

console.log('topic: Flaky Test Diagnosis');
console.log('question:', 'Find nondeterminism in tests before it poisons trust in the suite.');
for (const check of checks) {
  console.log(`${check.name} -> ${check.scope} -> ${check.value ? 'PASS' : 'FAIL'}`);
}
console.log('lesson: choose the boundary that answers the real risk.');
