# software-engineering

A learning-oriented collection of software engineering references and runnable demos.

## Contents

- [design-patterns/](design-patterns/) — the 23 Gang of Four design patterns, each with a README and a runnable JavaScript demo.
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
