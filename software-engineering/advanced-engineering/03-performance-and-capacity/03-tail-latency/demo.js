// Tail Latency — tiny performance simulation.
// Run: node demo.js

const measurements = [
  { label: 'before', ms: 120 },
  { label: 'after', ms: 48 }
];

console.log('topic: Tail Latency');
console.log('example:', 'a service whose average latency is fine but P95 is painful');
for (const item of measurements) {
  console.log(`${item.label}: ${item.ms}ms`);
}
console.log('lesson: measurement gives performance work a spine.');
