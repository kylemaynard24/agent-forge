// Client Delivery Stack — a simple architecture sketch.
// Run: node demo.js

const stack = {
  orchestration: 'n8n',
  systemOfRecord: 'Supabase',
  operatorView: 'Airtable or internal dashboard',
  alerts: 'Slack',
  docs: 'Notion',
  billing: 'Stripe'
};

for (const [layer, tool] of Object.entries(stack)) {
  console.log(`${layer}: ${tool}`);
}

console.log('question: if a job fails, who sees it first and where do they act?');
