// Flowise, Langflow, and Dify — what each tends to optimize for.
// Run: node demo.js

const tools = [
  ['Flowise', 'broad visual AI workflow building with open-source flexibility'],
  ['Langflow', 'developer-friendly flow prototyping and serving with Python under the hood'],
  ['Dify', 'more productized AI app building with app surfaces and knowledge workflows']
];

for (const [tool, strength] of tools) {
  console.log(`${tool}: ${strength}`);
}

console.log('warning: visual AI tooling does not remove the need for evals, tracing, and clear boundaries.');
