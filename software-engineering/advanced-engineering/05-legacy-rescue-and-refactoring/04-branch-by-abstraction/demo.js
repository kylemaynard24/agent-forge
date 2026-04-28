// Branch by Abstraction — tiny modernization simulation.
// Run: node demo.js

const legacy = { raw: 'LEGACY_RESULT', callersKnowTooMuch: true };
const seam = { stableContract: true, translatedValue: { status: 'ok', raw: legacy.raw } };

console.log('topic: Branch by Abstraction');
console.log('example:', 'a core dependency that cannot be replaced in one cut');
console.log('legacy shape:', legacy);
console.log('new seam:', seam);
console.log('lesson: safer change starts when the first seam exists.');
