// Testability Design — tiny verification simulation.
// Run: node demo.js

const checks = [
  { name: 'fast check', scope: 'narrow boundary', value: true },
  { name: 'workflow check', scope: 'broader boundary', value: true }
];

console.log('topic: Testability Design');
console.log('question:', 'Shape code so important decisions are easy to observe and verify.');
for (const check of checks) {
  console.log(`${check.name} -> ${check.scope} -> ${check.value ? 'PASS' : 'FAIL'}`);
}
console.log('lesson: choose the boundary that answers the real risk.');
