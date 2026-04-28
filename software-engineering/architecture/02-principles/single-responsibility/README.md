# Single Responsibility Principle (SRP)

**Category:** Principles (the **S** in SOLID)

## Intent
A class (or module) should have **one reason to change**. Robert Martin's framing: a responsibility is *an actor* — a stakeholder whose needs drive change. If two stakeholders can demand changes to the same class, those are two responsibilities living in one place.

## When to use
This is a default. Apply it when:
- A class is named with "And" or "Manager" or "Util."
- A small change requires you to understand half the file.
- Two unrelated bugs both touch the same class.

## Common mistake
"One method per class" or "files should be short" is **not** SRP. A 500-line class with one responsibility is fine. A 30-line class with three is not.

## Trade-offs
**Pros**
- Edits stay local; less merge conflict.
- Tests target one behavior at a time.
- The name predicts the contents.

**Cons**
- More files, more imports.
- Splitting too eagerly produces anemic classes that just shuffle data.

**Rule of thumb:** If you can describe a class with one *and*-free sentence, it's probably right. "The `Invoice` formats and emails and persists itself" is three classes.

## Real-world analogies
- A line cook handles cooking. A server handles serving. If the cook also seats guests, the kitchen halts when guests come in.
- A traffic light has one job — signaling. The intersection's drainage is somebody else's problem.

## Run the demo
```bash
node demo.js
```

The demo shows a `Report` class doing generation + formatting + emailing — three actors — and splits it into three classes that can change independently.

## Deeper intuition

Design principles are heuristics for preserving flexibility under change. None of them are laws; all of them can be over-applied. The point of learning them is to get better at seeing why a codebase feels rigid or slippery, not to turn every review into acronym enforcement.

A strong grasp of **Single Responsibility Principle (SRP)** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?
