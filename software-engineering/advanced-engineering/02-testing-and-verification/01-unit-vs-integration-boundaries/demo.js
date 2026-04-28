// Unit vs Integration Boundaries — tiny verification simulation.
// Run: node demo.js

const checks = [
  { name: 'fast check', scope: 'narrow boundary', value: true },
  { name: 'workflow check', scope: 'broader boundary', value: true }
];

console.log('topic: Unit vs Integration Boundaries');
console.log('question:', 'Choose the smallest trustworthy boundary for the question you need answered.');
for (const check of checks) {
  console.log(`${check.name} -> ${check.scope} -> ${check.value ? 'PASS' : 'FAIL'}`);
}
console.log('lesson: choose the boundary that answers the real risk.');
