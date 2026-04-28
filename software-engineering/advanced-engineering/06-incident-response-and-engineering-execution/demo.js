// Incident Response and Engineering Execution — a tiny incident loop.
// Run: node demo.js

const incident = {
  symptoms: ['checkout errors spiking', 'payment latency > 5s', 'support tickets rising'],
  severity: 'SEV-2',
  suspectedCause: 'payment provider timeout',
  mitigation: 'temporarily disable one slow retry path and fail fast',
  followUp: 'add provider-specific latency alert and a clearer runbook step'
};

console.log('detect:', incident.symptoms);
console.log('classify:', incident.severity);
console.log('hypothesis:', incident.suspectedCause);
console.log('mitigate:', incident.mitigation);
console.log('communicate: "We see elevated checkout failures, mitigation is in progress."');
console.log('follow-up:', incident.followUp);
