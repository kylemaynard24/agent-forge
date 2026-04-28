// Repro Minimization — tiny debugging simulation.
// Run: node demo.js

const situation = {
  topic: 'Repro Minimization',
  symptom: 'a flaky invoice import that only fails on large messy files',
  nextMove: 'Reduce a failing case to the smallest input and environment that still fails.',
  lesson: 'The right next observation is usually worth more than a random code edit.'
};

console.log('topic:', situation.topic);
console.log('symptom:', situation.symptom);
console.log('next move:', situation.nextMove);
console.log('lesson:', situation.lesson);
