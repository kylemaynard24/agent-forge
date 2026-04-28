// Anti-Corruption Layers — tiny modernization simulation.
// Run: node demo.js

const legacy = { raw: 'LEGACY_RESULT', callersKnowTooMuch: true };
const seam = { stableContract: true, translatedValue: { status: 'ok', raw: legacy.raw } };

console.log('topic: Anti-Corruption Layers');
console.log('example:', 'a legacy billing model with names that poison newer code');
console.log('legacy shape:', legacy);
console.log('new seam:', seam);
console.log('lesson: safer change starts when the first seam exists.');
