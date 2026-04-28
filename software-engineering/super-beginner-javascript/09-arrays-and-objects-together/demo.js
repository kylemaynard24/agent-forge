// Arrays and Objects Together — beginner JavaScript demo.
// Run: node demo.js

console.log('topic: Arrays and Objects Together');
console.log('example: keeping a classroom roster or product catalog');
const students = [
  { name: 'Ava', grade: 'A' },
  { name: 'Leo', grade: 'B' }
];
for (const student of students) {
  console.log(student.name + ' -> ' + student.grade);
}
console.log('lesson: Model realistic data by combining lists and structured records.');
