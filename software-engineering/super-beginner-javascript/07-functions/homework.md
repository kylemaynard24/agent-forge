# Homework — Functions

> Package reusable behavior into named building blocks.

## Exercise

Create a small script related to creating a helper that greets users or calculates totals.

**Build:**
- one clear example using the topic correctly
- one small variation where you change the input and predict the output first
- a short explanation in plain English of what the code is doing

**Constraints:**
- keep the script small enough to explain line by line
- do not copy code without changing at least one value yourself
- write down what you expect before you run it

## Reflection

- What part of Functions felt the most natural?
- What part still feels confusing or easy to mix up?
- Could you teach this exact example to a friend without reading the file?

## Done when

- you can run the script successfully
- you can predict the output before running it
- you can explain the code in plain language

---

## Clean Code Lens

**Principle in focus:** Function Names as Contracts; Single Responsibility

A function name is a promise about what the function does. `greetUser` should greet — not also log to a file, calculate a discount, and update a counter. When a function does two things, its name either lies (it names only one) or becomes vague (`processStuff`). The rule of thumb: if you need the word "and" to describe what a function does, it should be two functions.

**Exercise:** Write a function called `greetAndCalculate` that both prints a greeting and returns a total. Then split it into `greetUser(name)` and `calculateTotal(items)`. Call both from the same place. Notice that the split version is easier to test, easier to reuse, and easier to name — because each piece does exactly one thing.

**Reflection:** Look at your function that calculates totals. Does it also format the output, or validate the input, or do anything else? Every extra responsibility is a hidden coupling — what would you have to change if the formatting rules changed?
