# Homework — Objects

> Group related information together under named properties.

## Exercise

Create a small script related to representing one student with a name, age, and grade.

**Build:**
- one clear example using the topic correctly
- one small variation where you change the input and predict the output first
- a short explanation in plain English of what the code is doing

**Constraints:**
- keep the script small enough to explain line by line
- do not copy code without changing at least one value yourself
- write down what you expect before you run it

## Reflection

- What part of Objects felt the most natural?
- What part still feels confusing or easy to mix up?
- Could you teach this exact example to a friend without reading the file?

## Done when

- you can run the script successfully
- you can predict the output before running it
- you can explain the code in plain language

---

## Clean Code Lens

**Principle in focus:** Object Properties as a Public Contract

Every property name you put on an object is a promise to every piece of code that reads it. `student.n` is a broken promise — no reader knows if that is "name," "number," or something else entirely. `student.fullName`, `student.gradeLevel`, and `student.isEnrolled` form a small vocabulary that documents itself.

**Exercise:** Build your student object with deliberately vague property names first (`n`, `a`, `g`). Then rename every property to the clearest possible term — not `studentName` (the fact it belongs to a student is already in context), just `name`, `age`, `gradeLevel`. Finally, read back both versions and measure how long it takes to understand what the object represents.

**Reflection:** Did you add any property "just in case" you might need it later? Does having an unused or unclear property on an object make the object harder to understand as a whole?
