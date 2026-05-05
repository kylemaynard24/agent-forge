// Platform Selection and Service Design — simple fit matrix.
// Run: node demo.js

const scenarios = [
  {
    name: 'Small sales team, common SaaS apps, wants fast wins',
    recommend: 'Zapier or Make',
    reason: 'speed, common connectors, low implementation friction'
  },
  {
    name: 'Operations workflow with custom APIs, AI steps, and retry logic',
    recommend: 'n8n',
    reason: 'more control over branching, custom logic, hosting, and observability'
  },
  {
    name: 'Prototype AI assistant with visual flow editing and quick iteration',
    recommend: 'Flowise, Langflow, or Dify',
    reason: 'faster agent and RAG prototyping than building the whole stack from scratch'
  }
];

for (const scenario of scenarios) {
  console.log(`scenario: ${scenario.name}`);
  console.log(`recommend: ${scenario.recommend}`);
  console.log(`why: ${scenario.reason}\n`);
}

console.log('rule of thumb: optimize for the maintenance model, not the demo.');
