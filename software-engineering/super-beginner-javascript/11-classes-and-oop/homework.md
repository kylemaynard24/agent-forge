# Homework — Classes and OOP

> Organize behavior and data together when the problem starts to feel object-shaped.

## Exercise

Create a small script related to modeling a bank account, game character, or shopping cart.

**Build:**
- one clear example using the topic correctly
- one small variation where you change the input and predict the output first
- a short explanation in plain English of what the code is doing

**Constraints:**
- keep the script small enough to explain line by line
- do not copy code without changing at least one value yourself
- write down what you expect before you run it

## Reflection

- What part of Classes and OOP felt the most natural?
- What part still feels confusing or easy to mix up?
- Could you teach this exact example to a friend without reading the file?

## Done when

- you can run the script successfully
- you can predict the output before running it
- you can explain the code in plain language

---

## Clean Code Lens

**Principle in focus:** Class Names Are Nouns; Method Names Are Verbs; Single Responsibility

A class should be so focused that its name is easy: `BankAccount`, `ShoppingCart`, `GameCharacter`. When a class is hard to name — when you find yourself writing `AccountManagerHandlerUtil` — it is almost always doing too much. Methods tell you what the object can do: `deposit()`, `addItem()`, `takeDamage()`. A method named `process()` or `handle()` is a sign that it is doing something the class cannot clearly describe.

**Exercise:** After writing your class, try to name it with a single concrete noun and name every method with a single action verb. If you cannot do this without lying (the name does not reflect what the code actually does), that is your signal to split the class or rename the method to be honest. Write down the final names and check: do the method names sound like things this specific object should be able to do?

**Reflection:** Does your class have any method that feels like it belongs to a different object? For example, does your `BankAccount` class also print receipts, or send emails? What would those responsibilities look like as separate classes?
