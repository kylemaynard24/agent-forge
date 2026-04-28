// Config and Env Drift — tiny debugging simulation.
// Run: node demo.js

const situation = {
  topic: 'Config and Env Drift',
  symptom: 'a deployment that only fails in staging or one specific region',
  nextMove: 'Notice when code is fine but runtime configuration is lying to you.',
  lesson: 'The right next observation is usually worth more than a random code edit.'
};

console.log('topic:', situation.topic);
console.log('symptom:', situation.symptom);
console.log('next move:', situation.nextMove);
console.log('lesson:', situation.lesson);
