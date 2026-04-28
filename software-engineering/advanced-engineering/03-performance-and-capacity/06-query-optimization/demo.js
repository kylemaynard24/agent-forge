// Query Optimization — tiny performance simulation.
// Run: node demo.js

const measurements = [
  { label: 'before', ms: 120 },
  { label: 'after', ms: 48 }
];

console.log('topic: Query Optimization');
console.log('example:', 'an ORM query that creates an N+1 surprise');
for (const item of measurements) {
  console.log(`${item.label}: ${item.ms}ms`);
}
console.log('lesson: measurement gives performance work a spine.');
