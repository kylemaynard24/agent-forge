# Repro Minimization

**Area:** Debugging and Diagnostics

## Intent

Reduce a failing case to the smallest input and environment that still fails.

## When to use

- the system is currently struggling with repro minimization-shaped problems
- you need a more disciplined approach than trial-and-error
- you want to turn one hard-earned lesson into a reusable habit
- the example looks a lot like a flaky invoice import that only fails on large messy files

## Why it matters

Repro Minimization matters because strong engineers turn this move into routine behavior. They do not wait for ideal conditions. They learn to apply the right pressure even when the signals are incomplete, noisy, or politically messy.

In practice, this subtopic is less about a trick and more about a posture:

- make the important distinction visible
- choose the next observation or action deliberately
- reduce confusion faster than the system accumulates it
- leave the situation easier to reason about than you found it

## Common mistakes

- editing code before stabilizing the reproduction
- conflating the visible symptom with the root cause
- trusting one noisy log line more than a pattern of evidence

## Tiny example

Imagine a flaky invoice import that only fails on large messy files. Reduce a failing case to the smallest input and environment that still fails. The goal is not merely to get past the moment. The goal is to make the situation legible enough that the next decision is better than the last one.

## Run the demo

```bash
node demo.js
```

The demo is intentionally small. It exists to make the shape of **Repro Minimization** concrete before you try it in a larger system.
