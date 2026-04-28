// Scope and State — beginner JavaScript demo.
// Run: node demo.js

console.log('topic: Scope and State');
console.log('example: tracking score correctly without losing or leaking values');
let score = 0;
function addPoints(points) {
  score = score + points;
}
addPoints(5);
addPoints(3);
console.log('score:', score);
console.log('lesson: Understand where variables live and when values change over time.');
