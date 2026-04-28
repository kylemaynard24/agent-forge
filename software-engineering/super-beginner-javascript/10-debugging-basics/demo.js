// Debugging Basics — beginner JavaScript demo.
// Run: node demo.js

console.log('topic: Debugging Basics');
console.log('example: finding why a calculator returns the wrong answer');
function add(a, b) {
  return a - b; // bug on purpose
}
console.log('expected 5, got:', add(2, 3));
console.log('lesson: inspect inputs and outputs first.');
console.log('lesson: Learn to inspect values and reason about why a program is behaving strangely.');
