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
