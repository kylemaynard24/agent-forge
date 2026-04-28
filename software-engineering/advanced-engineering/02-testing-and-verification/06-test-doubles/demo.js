// Test Doubles — tiny verification simulation.
// Run: node demo.js

const checks = [
  { name: 'fast check', scope: 'narrow boundary', value: true },
  { name: 'workflow check', scope: 'broader boundary', value: true }
];

console.log('topic: Test Doubles');
console.log('question:', 'Choose fakes, stubs, spies, or mocks deliberately instead of reflexively.');
for (const check of checks) {
  console.log(`${check.name} -> ${check.scope} -> ${check.value ? 'PASS' : 'FAIL'}`);
}
console.log('lesson: choose the boundary that answers the real risk.');
