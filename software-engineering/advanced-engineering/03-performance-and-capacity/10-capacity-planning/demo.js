// Capacity Planning — tiny performance simulation.
// Run: node demo.js

const measurements = [
  { label: 'before', ms: 120 },
  { label: 'after', ms: 48 }
];

console.log('topic: Capacity Planning');
console.log('example:', 'a product feature expected to multiply traffic over one quarter');
for (const item of measurements) {
  console.log(`${item.label}: ${item.ms}ms`);
}
console.log('lesson: measurement gives performance work a spine.');
