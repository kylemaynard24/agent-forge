// Session and Token Design — tiny security boundary simulation.
// Run: node demo.js

const request = { actor: 'user-a', resourceOwner: 'user-b', allowed: false };

console.log('topic: Session and Token Design');
console.log('example:', 'an app moving from cookies to tokens without a threat review');
console.log('actor:', request.actor);
console.log('resource owner:', request.resourceOwner);
console.log('allowed:', request.allowed);
console.log('lesson: security becomes clearer when the trust boundary is explicit.');
