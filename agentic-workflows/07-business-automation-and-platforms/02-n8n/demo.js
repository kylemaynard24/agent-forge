// n8n — where it starts to win.
// Run: node demo.js

const workflow = {
  trigger: 'lead form submitted',
  steps: [
    'enrich company data via API',
    'score lead',
    'route to CRM',
    'notify sales in Slack'
  ],
  whyN8n: [
    'custom API step',
    'branching on score',
    'clear failure path for enrichment step',
    'room to add AI later without changing platforms'
  ]
};

console.log('workflow:', workflow.trigger);
console.log('steps:', workflow.steps.join(' -> '));
console.log('why n8n:', workflow.whyN8n.join(' | '));
