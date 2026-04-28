# Strangler Pattern

**Area:** Legacy Rescue and Refactoring

## Intent

Replace old behavior incrementally while the old system keeps serving.

## When to use

- the system is currently struggling with strangler pattern-shaped problems
- you need a more disciplined approach than trial-and-error
- you want to turn one hard-earned lesson into a reusable habit
- the example looks a lot like a monolith endpoint being moved behind a newer façade

## Why it matters

Strangler Pattern matters because strong engineers turn this move into routine behavior. They do not wait for ideal conditions. They learn to apply the right pressure even when the signals are incomplete, noisy, or politically messy.

In practice, this subtopic is less about a trick and more about a posture:

- make the important distinction visible
- choose the next observation or action deliberately
- reduce confusion faster than the system accumulates it
- leave the situation easier to reason about than you found it

## Common mistakes

- using "legacy" as permission to rewrite recklessly
- mixing behavior changes with structural cleanup
- promising large migrations before proving one safe step

## Tiny example

Imagine a monolith endpoint being moved behind a newer façade. Replace old behavior incrementally while the old system keeps serving. The goal is not merely to get past the moment. The goal is to make the situation legible enough that the next decision is better than the last one.

## Run the demo

```bash
node demo.js
```

The demo is intentionally small. It exists to make the shape of **Strangler Pattern** concrete before you try it in a larger system.
