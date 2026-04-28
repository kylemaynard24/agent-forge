// Multi-tenant Isolation — tiny security boundary simulation.
// Run: node demo.js

const request = { actor: 'user-a', resourceOwner: 'user-b', allowed: false };

console.log('topic: Multi-tenant Isolation');
console.log('example:', 'an admin tool that was built for one customer and then reused for many');
console.log('actor:', request.actor);
console.log('resource owner:', request.resourceOwner);
console.log('allowed:', request.allowed);
console.log('lesson: security becomes clearer when the trust boundary is explicit.');
