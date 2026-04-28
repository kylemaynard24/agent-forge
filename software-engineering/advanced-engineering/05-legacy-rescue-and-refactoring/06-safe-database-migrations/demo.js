// Safe Database Migrations — tiny modernization simulation.
// Run: node demo.js

const legacy = { raw: 'LEGACY_RESULT', callersKnowTooMuch: true };
const seam = { stableContract: true, translatedValue: { status: 'ok', raw: legacy.raw } };

console.log('topic: Safe Database Migrations');
console.log('example:', 'a table split or column rename on a live system');
console.log('legacy shape:', legacy);
console.log('new seam:', seam);
console.log('lesson: safer change starts when the first seam exists.');
