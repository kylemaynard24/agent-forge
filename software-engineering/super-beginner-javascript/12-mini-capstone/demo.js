// Mini Capstone — beginner JavaScript demo.
// Run: node demo.js

console.log('topic: Mini Capstone');
console.log('example: building a console-based student tracker, task app, or mini shop');
const tasks = [
  { title: 'Read README', done: false },
  { title: 'Run demo', done: true }
];
for (const task of tasks) {
  console.log(task.title + ': ' + (task.done ? 'done' : 'not done'));
}
console.log('lesson: Combine the beginner topics into one small program you can explain confidently.');
