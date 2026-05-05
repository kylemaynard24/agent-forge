# Homework — Debugging Basics

> Learn to inspect values and reason about why a program is behaving strangely.

## Exercise

Create a small script related to finding why a calculator returns the wrong answer.

**Build:**
- one clear example using the topic correctly
- one small variation where you change the input and predict the output first
- a short explanation in plain English of what the code is doing

**Constraints:**
- keep the script small enough to explain line by line
- do not copy code without changing at least one value yourself
- write down what you expect before you run it

## Reflection

- What part of Debugging Basics felt the most natural?
- What part still feels confusing or easy to mix up?
- Could you teach this exact example to a friend without reading the file?

## Done when

- you can run the script successfully
- you can predict the output before running it
- you can explain the code in plain language

---

## Clean Code Lens

**Principle in focus:** Readable Code is Debuggable Code

Debugging is reading code under pressure. Code that was hard to read during normal development becomes genuinely painful to debug at 2am with a broken calculator. Clean code reduces the surface area for bugs by making every step explicit: if a value is unclear at the point it is assigned, it will still be unclear at the point it goes wrong.

**Exercise:** Look at the buggy calculator script you are debugging. Before adding any `console.log`, rewrite the confusing parts using clearer variable names and smaller steps — break compound expressions into named intermediate variables. Then see if the bug becomes obvious just from reading the cleaner version. This is the most underrated debugging technique: read-before-log.

**Reflection:** When the bug appeared, was it hiding inside a complex expression or inside code you thought was "too simple to be wrong"? How did the readability of the surrounding code affect how long it took you to find it?
