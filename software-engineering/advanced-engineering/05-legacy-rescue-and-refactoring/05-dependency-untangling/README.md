# Dependency Untangling

**Area:** Legacy Rescue and Refactoring

## Intent

Reduce circular or hidden dependencies so change paths become visible.

## When to use

- the system is currently struggling with dependency untangling-shaped problems
- you need a more disciplined approach than trial-and-error
- you want to turn one hard-earned lesson into a reusable habit
- the example looks a lot like a service layer where every change touches unrelated files

## Why it matters

Dependency Untangling matters because strong engineers turn this move into routine behavior. They do not wait for ideal conditions. They learn to apply the right pressure even when the signals are incomplete, noisy, or politically messy.

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

Imagine a service layer where every change touches unrelated files. Reduce circular or hidden dependencies so change paths become visible. The goal is not merely to get past the moment. The goal is to make the situation legible enough that the next decision is better than the last one.

## Run the demo

```bash
node demo.js
```

The demo is intentionally small. It exists to make the shape of **Dependency Untangling** concrete before you try it in a larger system.
