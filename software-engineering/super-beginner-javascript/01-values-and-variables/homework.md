# Homework — Values and Variables

> Learn how JavaScript stores information in named places.

## Exercise

Create a small script related to tracking a player name and score in a tiny game.

**Build:**
- one clear example using the topic correctly
- one small variation where you change the input and predict the output first
- a short explanation in plain English of what the code is doing

**Constraints:**
- keep the script small enough to explain line by line
- do not copy code without changing at least one value yourself
- write down what you expect before you run it

## Reflection

- What part of Values and Variables felt the most natural?
- What part still feels confusing or easy to mix up?
- Could you teach this exact example to a friend without reading the file?

## Done when

- you can run the script successfully
- you can predict the output before running it
- you can explain the code in plain language

---

## Clean Code Lens

**Principle in focus:** Intention-Revealing Names

A variable name is the first piece of documentation anyone reads. When you write `let x = 0` instead of `let playerScore = 0`, you force every future reader — including yourself in two weeks — to decode what `x` is before they can understand what the code does.

**Exercise:** Write your player name and score script twice. In the first version, use single-letter or vague names (`n`, `s`, `val`). In the second, give every variable the clearest possible name. Read both versions aloud. Notice how the second version narrates itself and the first one demands mental translation.

**Reflection:** Did you pick a shorter name anywhere because it was faster to type? Would a teammate scanning the code understand that variable's purpose in under three seconds?
