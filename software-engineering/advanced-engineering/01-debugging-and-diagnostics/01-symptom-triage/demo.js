// Symptom Triage — tiny debugging simulation.
// Run: node demo.js

const situation = {
  topic: 'Symptom Triage',
  symptom: 'a checkout report that only says "sometimes it is broken"',
  nextMove: 'Turn broad complaints into specific, observable failure statements.',
  lesson: 'The right next observation is usually worth more than a random code edit.'
};

console.log('topic:', situation.topic);
console.log('symptom:', situation.symptom);
console.log('next move:', situation.nextMove);
console.log('lesson:', situation.lesson);
