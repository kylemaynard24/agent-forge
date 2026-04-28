# software-engineering

A learning-oriented collection of software engineering references and runnable demos.

## Contents

- [design-patterns/](design-patterns/) — the 23 Gang of Four design patterns, each with a README and a runnable JavaScript demo.
- [super-beginner-javascript/](super-beginner-javascript/) — a beginner-first JavaScript teaching track from variables and conditionals through functions, objects, and basic OOP.
- [advanced-engineering/](advanced-engineering/) — advanced engineer track materials for debugging, testing, performance, security, modernization, and incident response.

## How to run the demos

Each pattern directory contains a `demo.js` that is **self-contained** (no imports, no `npm install`). Run with:

```bash
node path/to/demo.js
```

Any recent Node.js version works (Node 14+). Output is printed to the console with commentary showing the pattern in action.

## How to think about this section

`software-engineering/` is the part of the repo that teaches enduring design judgment. The topics here are less about syntax and more about pressure: where complexity accumulates, where dependencies point, how boundaries stay healthy, and why some designs stay easy to change while others calcify.

A useful way to read this area is to move back and forth between two scales. The design-patterns material trains your eye at the class and object level. The architecture material trains your eye at the component and system level. Strong engineers can connect the two: they see how local design habits eventually shape global system behavior.

## How to know you're making progress

You're getting real value from this section when you can:

- explain a concept in terms of the problem pressure that created it
- compare sibling ideas without falling back to buzzwords
- reject a fashionable design choice for a concrete reason
- look at an existing codebase and name which trade-off it already made

## Question-driven orientation

### "When should I spend time in this section?"

**Answer:** Spend time here when you want to improve your software engineering judgment across design, architecture, and execution.

**Explanation:** A section guide is most useful when it helps you choose the right learning path on purpose. The point is not to read everything at once. The point is to understand what kinds of problems this section trains you to notice and solve.

### "How should I study this without turning it into passive reading?"

**Answer:** Read the concept, predict the demo, run it, change something small, and explain the result out loud.

**Explanation:** This repo works best when each README turns into a decision habit. If you can explain when to use the idea, when not to use it, and what trade-off it introduces, the topic is starting to become real knowledge instead of reference material.
