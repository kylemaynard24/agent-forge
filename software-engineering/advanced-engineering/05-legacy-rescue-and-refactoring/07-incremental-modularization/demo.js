// Incremental Modularization — tiny modernization simulation.
// Run: node demo.js

const legacy = { raw: 'LEGACY_RESULT', callersKnowTooMuch: true };
const seam = { stableContract: true, translatedValue: { status: 'ok', raw: legacy.raw } };

console.log('topic: Incremental Modularization');
console.log('example:', 'a codebase whose folders no longer match actual responsibilities');
console.log('legacy shape:', legacy);
console.log('new seam:', seam);
console.log('lesson: safer change starts when the first seam exists.');
