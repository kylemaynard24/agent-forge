// Threat Modeling — tiny security boundary simulation.
// Run: node demo.js

const request = { actor: 'user-a', resourceOwner: 'user-b', allowed: false };

console.log('topic: Threat Modeling');
console.log('example:', 'a new product flow that feels simple until you ask who could misuse it');
console.log('actor:', request.actor);
console.log('resource owner:', request.resourceOwner);
console.log('allowed:', request.allowed);
console.log('lesson: security becomes clearer when the trust boundary is explicit.');
