// State Corruption — tiny debugging simulation.
// Run: node demo.js

const situation = {
  topic: 'State Corruption',
  symptom: 'an order that only becomes invalid after several normal-looking updates',
  nextMove: 'Recognize when the current bad value was created earlier than the visible failure.',
  lesson: 'The right next observation is usually worth more than a random code edit.'
};

console.log('topic:', situation.topic);
console.log('symptom:', situation.symptom);
console.log('next move:', situation.nextMove);
console.log('lesson:', situation.lesson);
