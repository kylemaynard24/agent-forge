# Homework — Conditionals

> Make the program choose between different paths with if/else logic.

## Exercise

Create a small script related to showing different messages depending on a quiz score.

**Build:**
- one clear example using the topic correctly
- one small variation where you change the input and predict the output first
- a short explanation in plain English of what the code is doing

**Constraints:**
- keep the script small enough to explain line by line
- do not copy code without changing at least one value yourself
- write down what you expect before you run it

## Reflection

- What part of Conditionals felt the most natural?
- What part still feels confusing or easy to mix up?
- Could you teach this exact example to a friend without reading the file?

## Done when

- you can run the script successfully
- you can predict the output before running it
- you can explain the code in plain language

---

## Clean Code Lens

**Principle in focus:** Intention-Revealing Conditions; Extract Variable

When a condition like `score >= 70 && score < 90 && !isAbsent` sits directly inside an `if`, the reader must parse the logic and then figure out what it means. Extracting it into a named boolean — `const isPassing = score >= 70 && score < 90 && !isAbsent` — turns the condition into a sentence.

**Exercise:** Take the quiz-score script and extract every boolean expression in every `if`/`else if` into a named variable before the conditional block. The `if` statements should end up reading like plain English: `if (isPassing)`, `if (isHighDistinction)`. Show the before and after, and confirm the logic is identical.

**Reflection:** Was there a condition you almost left inline because it felt "too simple to name"? Read it again — does the name you would give it actually make the code clearer than the raw expression?
