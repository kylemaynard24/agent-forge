// ADRs and RFCs — tiny incident execution simulation.
// Run: node demo.js

const incident = {
  topic: 'ADRs and RFCs',
  situation: 'a system change that has more than one reasonable design path',
  firstAction: 'Use lightweight writing to align engineering decisions before complexity compounds.',
  note: 'Good execution makes facts, priorities, and next actions legible.'
};

console.log('topic:', incident.topic);
console.log('situation:', incident.situation);
console.log('first action:', incident.firstAction);
console.log('note:', incident.note);
