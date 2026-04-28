// Design Intent and Project Docs — tiny writing simulation.
// Run: node demo.js

const project = {
  change: 'Move document processing off the request thread',
  pressures: [
    'uploads are timing out during peak usage',
    'retries currently duplicate work',
    'operations needs clearer failure recovery'
  ],
  goals: [
    'keep user requests fast',
    'support retries safely',
    'preserve tenant isolation'
  ],
  nonGoals: [
    'rewrite the entire application into microservices',
    'change the user-facing upload workflow'
  ]
};

const documentPack = [
  {
    artifact: 'DI doc',
    question: 'What should this subsystem become, and why?',
    include: ['goals', 'non-goals', 'constraints', 'proposed shape', 'alternatives']
  },
  {
    artifact: 'ADR',
    question: 'Why use a queue-backed worker instead of in-process background jobs?',
    include: ['decision', 'status', 'consequences']
  },
  {
    artifact: 'Execution plan',
    question: 'How do we deliver and roll this out safely?',
    include: ['milestones', 'owners', 'migration steps', 'rollback notes']
  }
];

console.log('project:', project.change);
console.log('pressures:', project.pressures.join(' | '));
console.log('goals:', project.goals.join(' | '));
console.log('non-goals:', project.nonGoals.join(' | '));
console.log('\nrecommended documentation pack:');

for (const doc of documentPack) {
  console.log(`- ${doc.artifact}: ${doc.question}`);
  console.log(`  include: ${doc.include.join(', ')}`);
}
