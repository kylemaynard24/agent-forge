# Homework — Strings, Numbers, and Booleans

> Understand the basic value types you will use constantly.

## Exercise

Create a small script related to taking text input, calculating totals, and checking yes/no conditions.

**Build:**
- one clear example using the topic correctly
- one small variation where you change the input and predict the output first
- a short explanation in plain English of what the code is doing

**Constraints:**
- keep the script small enough to explain line by line
- do not copy code without changing at least one value yourself
- write down what you expect before you run it

## Reflection

- What part of Strings, Numbers, and Booleans felt the most natural?
- What part still feels confusing or easy to mix up?
- Could you teach this exact example to a friend without reading the file?

## Done when

- you can run the script successfully
- you can predict the output before running it
- you can explain the code in plain language

---

## Clean Code Lens

**Principle in focus:** Choosing the Right Type as a Clarity Decision

Using the right primitive type is not just about correctness — it communicates intent. Storing a yes/no answer as the number `1` or `0` forces every reader to remember your convention. Storing it as a `boolean` makes the intent self-evident at a glance.

**Exercise:** In your script that handles text input, totals, and yes/no checks, look at each variable and ask: "Is the type I chose the most honest type for this value?" Try deliberately using the wrong type somewhere (e.g., store an `isEligible` flag as a string `"yes"`), then refactor back — notice how much extra mental work the wrong type creates.

**Reflection:** When you performed a calculation, did you need to convert a string to a number first? What does that conversion tell you about how the data was originally stored, and was there a cleaner way to have it from the start?
