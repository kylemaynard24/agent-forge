// SSRF — tiny security boundary simulation.
// Run: node demo.js

const request = { actor: 'user-a', resourceOwner: 'user-b', allowed: false };

console.log('topic: SSRF');
console.log('example:', 'a feature that fetches remote URLs on behalf of users');
console.log('actor:', request.actor);
console.log('resource owner:', request.resourceOwner);
console.log('allowed:', request.allowed);
console.log('lesson: security becomes clearer when the trust boundary is explicit.');
