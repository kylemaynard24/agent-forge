// Root-Cause Analysis Writing — tiny debugging simulation.
// Run: node demo.js

const situation = {
  topic: 'Root-Cause Analysis Writing',
  symptom: 'a bug that keeps returning because the team remembers the fix but not the cause',
  nextMove: 'Write the debugging story clearly enough that others learn from it.',
  lesson: 'The right next observation is usually worth more than a random code edit.'
};

console.log('topic:', situation.topic);
console.log('symptom:', situation.symptom);
console.log('next move:', situation.nextMove);
console.log('lesson:', situation.lesson);
