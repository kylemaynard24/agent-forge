// Rollback Strategy — tiny incident execution simulation.
// Run: node demo.js

const incident = {
  topic: 'Rollback Strategy',
  situation: 'a release that partially works but is actively hurting users',
  firstAction: 'Know when reverting is safer than pushing forward with the fix.',
  note: 'Good execution makes facts, priorities, and next actions legible.'
};

console.log('topic:', incident.topic);
console.log('situation:', incident.situation);
console.log('first action:', incident.firstAction);
console.log('note:', incident.note);
