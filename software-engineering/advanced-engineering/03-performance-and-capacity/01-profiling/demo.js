// Profiling — tiny performance simulation.
// Run: node demo.js

const measurements = [
  { label: 'before', ms: 120 },
  { label: 'after', ms: 48 }
];

console.log('topic: Profiling');
console.log('example:', 'a request path that feels slow but has several plausible hotspots');
for (const item of measurements) {
  console.log(`${item.label}: ${item.ms}ms`);
}
console.log('lesson: measurement gives performance work a spine.');
