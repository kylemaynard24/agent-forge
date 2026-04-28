// Concurrency Bugs — tiny debugging simulation.
// Run: node demo.js

const situation = {
  topic: 'Concurrency Bugs',
  symptom: 'two workers updating the same job record at nearly the same time',
  nextMove: 'Reason about ordering, races, and shared state under parallel execution.',
  lesson: 'The right next observation is usually worth more than a random code edit.'
};

console.log('topic:', situation.topic);
console.log('symptom:', situation.symptom);
console.log('next move:', situation.nextMove);
console.log('lesson:', situation.lesson);
