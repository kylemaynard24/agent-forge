// Runbooks — tiny incident execution simulation.
// Run: node demo.js

const incident = {
  topic: 'Runbooks',
  situation: 'a recurring failure that is always re-diagnosed from scratch',
  firstAction: 'Capture the first useful response steps before the next stressful hour arrives.',
  note: 'Good execution makes facts, priorities, and next actions legible.'
};

console.log('topic:', incident.topic);
console.log('situation:', incident.situation);
console.log('first action:', incident.firstAction);
console.log('note:', incident.note);
