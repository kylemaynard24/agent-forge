// Contract Testing — tiny verification simulation.
// Run: node demo.js

const checks = [
  { name: 'fast check', scope: 'narrow boundary', value: true },
  { name: 'workflow check', scope: 'broader boundary', value: true }
];

console.log('topic: Contract Testing');
console.log('question:', 'Protect an interface between modules or services without booting the whole world.');
for (const check of checks) {
  console.log(`${check.name} -> ${check.scope} -> ${check.value ? 'PASS' : 'FAIL'}`);
}
console.log('lesson: choose the boundary that answers the real risk.');
