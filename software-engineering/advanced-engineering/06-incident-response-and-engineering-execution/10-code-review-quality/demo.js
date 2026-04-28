// Code Review Quality — tiny incident execution simulation.
// Run: node demo.js

const incident = {
  topic: 'Code Review Quality',
  situation: 'a pull request where style comments are crowding out system-level concerns',
  firstAction: 'Raise team quality by making review comments precise, useful, and trade-off aware.',
  note: 'Good execution makes facts, priorities, and next actions legible.'
};

console.log('topic:', incident.topic);
console.log('situation:', incident.situation);
console.log('first action:', incident.firstAction);
console.log('note:', incident.note);
