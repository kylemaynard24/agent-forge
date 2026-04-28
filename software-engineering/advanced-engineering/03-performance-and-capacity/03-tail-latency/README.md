# Tail Latency

**Area:** Performance and Capacity

## Intent

Care about the slow worst-case requests that users actually remember.

## When to use

- the system is currently struggling with tail latency-shaped problems
- you need a more disciplined approach than trial-and-error
- you want to turn one hard-earned lesson into a reusable habit
- the example looks a lot like a service whose average latency is fine but P95 is painful

## Why it matters

Tail Latency matters because strong engineers turn this move into routine behavior. They do not wait for ideal conditions. They learn to apply the right pressure even when the signals are incomplete, noisy, or politically messy.

In practice, this subtopic is less about a trick and more about a posture:

- make the important distinction visible
- choose the next observation or action deliberately
- reduce confusion faster than the system accumulates it
- leave the situation easier to reason about than you found it

## Common mistakes

- optimizing cold paths because they look ugly
- benchmarking unrealistic toy cases and calling it done
- improving averages while tail latency gets worse

## Tiny example

Imagine a service whose average latency is fine but P95 is painful. Care about the slow worst-case requests that users actually remember. The goal is not merely to get past the moment. The goal is to make the situation legible enough that the next decision is better than the last one.

## Run the demo

```bash
node demo.js
```

The demo is intentionally small. It exists to make the shape of **Tail Latency** concrete before you try it in a larger system.
