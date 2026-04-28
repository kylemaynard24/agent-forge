// Queue Backpressure — tiny performance simulation.
// Run: node demo.js

const measurements = [
  { label: 'before', ms: 120 },
  { label: 'after', ms: 48 }
];

console.log('topic: Queue Backpressure');
console.log('example:', 'a worker system that accepts jobs faster than it can finish them');
for (const item of measurements) {
  console.log(`${item.label}: ${item.ms}ms`);
}
console.log('lesson: measurement gives performance work a spine.');
