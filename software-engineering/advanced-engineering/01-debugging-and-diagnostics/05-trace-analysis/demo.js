// Trace Analysis — tiny debugging simulation.
// Run: node demo.js

const situation = {
  topic: 'Trace Analysis',
  symptom: 'a request that touches several services before timing out',
  nextMove: 'Use span timing and call trees to locate the slow or broken boundary.',
  lesson: 'The right next observation is usually worth more than a random code edit.'
};

console.log('topic:', situation.topic);
console.log('symptom:', situation.symptom);
console.log('next move:', situation.nextMove);
console.log('lesson:', situation.lesson);
