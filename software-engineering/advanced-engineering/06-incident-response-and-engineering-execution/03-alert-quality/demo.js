// Alert Quality — tiny incident execution simulation.
// Run: node demo.js

const incident = {
  topic: 'Alert Quality',
  situation: 'a dashboard that fires often enough that people mute it mentally',
  firstAction: 'Tune alerts so they are actionable, timely, and worth trusting.',
  note: 'Good execution makes facts, priorities, and next actions legible.'
};

console.log('topic:', incident.topic);
console.log('situation:', incident.situation);
console.log('first action:', incident.firstAction);
console.log('note:', incident.note);
