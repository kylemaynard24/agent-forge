// Least Privilege — tiny security boundary simulation.
// Run: node demo.js

const request = { actor: 'user-a', resourceOwner: 'user-b', allowed: false };

console.log('topic: Least Privilege');
console.log('example:', 'an internal tool running with production-wide credentials because it was easy');
console.log('actor:', request.actor);
console.log('resource owner:', request.resourceOwner);
console.log('allowed:', request.allowed);
console.log('lesson: security becomes clearer when the trust boundary is explicit.');
