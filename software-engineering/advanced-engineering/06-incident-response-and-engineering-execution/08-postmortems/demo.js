// Postmortems — tiny incident execution simulation.
// Run: node demo.js

const incident = {
  topic: 'Postmortems',
  situation: 'a production issue likely to recur unless the learning is made explicit',
  firstAction: 'Write incident analysis that improves systems rather than assigning blame.',
  note: 'Good execution makes facts, priorities, and next actions legible.'
};

console.log('topic:', incident.topic);
console.log('situation:', incident.situation);
console.log('first action:', incident.firstAction);
console.log('note:', incident.note);
