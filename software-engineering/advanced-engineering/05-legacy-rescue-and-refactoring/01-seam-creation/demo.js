// Seam Creation — tiny modernization simulation.
// Run: node demo.js

const legacy = { raw: 'LEGACY_RESULT', callersKnowTooMuch: true };
const seam = { stableContract: true, translatedValue: { status: 'ok', raw: legacy.raw } };

console.log('topic: Seam Creation');
console.log('example:', 'a giant module whose callers all know too much');
console.log('legacy shape:', legacy);
console.log('new seam:', seam);
console.log('lesson: safer change starts when the first seam exists.');
