// Degraded Mode Design — tiny incident execution simulation.
// Run: node demo.js

const incident = {
  topic: 'Degraded Mode Design',
  situation: 'a dependency outage where failing closed would be worse than partial service',
  firstAction: 'Keep the system partially useful when full functionality is too expensive to preserve.',
  note: 'Good execution makes facts, priorities, and next actions legible.'
};

console.log('topic:', incident.topic);
console.log('situation:', incident.situation);
console.log('first action:', incident.firstAction);
console.log('note:', incident.note);
