// Make and Zapier — simple comparison.
// Run: node demo.js

const comparisons = [
  ['Zapier', 'best for very common SaaS handoffs and fast internal wins'],
  ['Make', 'best for richer visual scenarios with more branching and transforms'],
  ['Migration signal', 'custom APIs, complex retries, margin pressure, and messy maintenance']
];

for (const [tool, note] of comparisons) {
  console.log(`${tool}: ${note}`);
}
