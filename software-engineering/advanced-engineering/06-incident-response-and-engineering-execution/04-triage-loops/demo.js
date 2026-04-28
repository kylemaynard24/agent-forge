// Triage Loops — tiny incident execution simulation.
// Run: node demo.js

const incident = {
  topic: 'Triage Loops',
  situation: 'an incident with several plausible failure domains',
  firstAction: 'Move repeatedly through detect, assess, act, and reassess without freezing.',
  note: 'Good execution makes facts, priorities, and next actions legible.'
};

console.log('topic:', incident.topic);
console.log('situation:', incident.situation);
console.log('first action:', incident.firstAction);
console.log('note:', incident.note);
