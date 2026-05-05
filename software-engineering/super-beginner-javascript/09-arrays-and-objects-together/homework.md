# Homework — Arrays and Objects Together

> Model realistic data by combining lists and structured records.

## Exercise

Create a small script related to keeping a classroom roster or product catalog.

**Build:**
- one clear example using the topic correctly
- one small variation where you change the input and predict the output first
- a short explanation in plain English of what the code is doing

**Constraints:**
- keep the script small enough to explain line by line
- do not copy code without changing at least one value yourself
- write down what you expect before you run it

## Reflection

- What part of Arrays and Objects Together felt the most natural?
- What part still feels confusing or easy to mix up?
- Could you teach this exact example to a friend without reading the file?

## Done when

- you can run the script successfully
- you can predict the output before running it
- you can explain the code in plain language

---

## Clean Code Lens

**Principle in focus:** Data Structure Shape as Documentation

When you combine arrays and objects, the shape of the data structure becomes as important as the code that processes it. A well-named structure like `{ students: [{ name, grade, isEnrolled }] }` communicates the domain model immediately — someone can understand what the data represents before reading a single line of logic. An opaque structure like `{ items: [{ v1, v2, flag }] }` forces the reader to reverse-engineer the meaning from the operations performed on it.

**Exercise:** Build your classroom roster or product catalog, then write a comment above the data structure declaration that describes it in one plain-English sentence — as if you were explaining it to a new teammate over the phone. If you find yourself struggling to write that sentence, or if the sentence needs the word "and" multiple times, the structure is probably trying to hold too many concepts at once.

**Reflection:** Did you name your array to reflect what it contains (`students`, `products`) rather than what it is (`list`, `data`, `items`)? A reader who sees `const data = [...]` has learned nothing; a reader who sees `const enrolledStudents = [...]` already understands the context.
