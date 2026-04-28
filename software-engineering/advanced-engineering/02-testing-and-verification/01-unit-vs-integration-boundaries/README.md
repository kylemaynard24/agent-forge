# Unit vs Integration Boundaries

**Area:** Testing and Verification

## Intent

Choose the smallest trustworthy boundary for the question you need answered.

## When to use

- the system is currently struggling with unit vs integration boundaries-shaped problems
- you need a more disciplined approach than trial-and-error
- you want to turn one hard-earned lesson into a reusable habit
- the example looks a lot like a checkout flow whose business rules and dependency wiring fail in different ways

## Why it matters

Unit vs Integration Boundaries matters because strong engineers turn this move into routine behavior. They do not wait for ideal conditions. They learn to apply the right pressure even when the signals are incomplete, noisy, or politically messy.

In practice, this subtopic is less about a trick and more about a posture:

- make the important distinction visible
- choose the next observation or action deliberately
- reduce confusion faster than the system accumulates it
- leave the situation easier to reason about than you found it

## Common mistakes

- treating coverage as a confidence substitute
- testing through too many layers at once
- mocking so aggressively that the important behavior disappears

## Tiny example

Imagine a checkout flow whose business rules and dependency wiring fail in different ways. Choose the smallest trustworthy boundary for the question you need answered. The goal is not merely to get past the moment. The goal is to make the situation legible enough that the next decision is better than the last one.

## Run the demo

```bash
node demo.js
```

The demo is intentionally small. It exists to make the shape of **Unit vs Integration Boundaries** concrete before you try it in a larger system.
