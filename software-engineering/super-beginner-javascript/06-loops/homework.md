# Homework — Loops

> Repeat work without copying and pasting the same code.

## Exercise

Create a small script related to printing every task in a todo list.

**Build:**
- one clear example using the topic correctly
- one small variation where you change the input and predict the output first
- a short explanation in plain English of what the code is doing

**Constraints:**
- keep the script small enough to explain line by line
- do not copy code without changing at least one value yourself
- write down what you expect before you run it

## Reflection

- What part of Loops felt the most natural?
- What part still feels confusing or easy to mix up?
- Could you teach this exact example to a friend without reading the file?

## Done when

- you can run the script successfully
- you can predict the output before running it
- you can explain the code in plain language

---

## Clean Code Lens

**Principle in focus:** Single Responsibility; Extract Loop Body into a Named Function

A loop that does two things — filtering items AND formatting the output AND printing them — is three responsibilities crammed into a small space. When the loop body grows past two or three lines, it is almost always trying to do too much. Extracting the body into a named function makes the loop itself trivially readable and makes the extracted logic independently testable.

**Exercise:** Write your todo-list loop so the entire body of the loop is a single function call: `tasks.forEach(printFormattedTask)`. Then write `printFormattedTask` as a separate named function. Notice that the loop now reads like a one-sentence description of what it does, and the function name explains the "how." Compare this to your original version with the logic inline.

**Reflection:** When you looked at your loop body, could you describe in one short phrase what every line in it was doing — or were there multiple distinct steps mixed together? That mismatch is the signal that a function extraction is overdue.
