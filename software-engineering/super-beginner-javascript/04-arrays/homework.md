# Homework — Arrays

> Store ordered lists of values and work through them step by step.

## Exercise

Create a small script related to keeping a shopping list or a list of class names.

**Build:**
- one clear example using the topic correctly
- one small variation where you change the input and predict the output first
- a short explanation in plain English of what the code is doing

**Constraints:**
- keep the script small enough to explain line by line
- do not copy code without changing at least one value yourself
- write down what you expect before you run it

## Reflection

- What part of Arrays felt the most natural?
- What part still feels confusing or easy to mix up?
- Could you teach this exact example to a friend without reading the file?

## Done when

- you can run the script successfully
- you can predict the output before running it
- you can explain the code in plain language

---

## Clean Code Lens

**Principle in focus:** Method Names as a Statement of Intent

`forEach`, `map`, `filter`, and `reduce` are not interchangeable tools that happen to loop — each one makes a specific promise. `map` says "I am transforming every element into something new." `filter` says "I am keeping only the elements that qualify." Using `forEach` when you mean `map` (or a manual loop when you mean `filter`) obscures what the code is doing before anyone reads the body.

**Exercise:** Write your shopping-list script using only a manual `for` loop first. Then rewrite it using the array method that most honestly describes what each piece of code is doing — printing every item is `forEach`, building a list of uppercase names is `map`, keeping only the affordable items is `filter`. Compare how quickly a reader can understand the intent in each version.

**Reflection:** Did you reach for `forEach` out of habit when a different method would have been more expressive? What does that choice hide from the next person reading the code?
