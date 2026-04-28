# Severity Models

**Area:** Incident Response and Engineering Execution

## Intent

Classify incidents by impact and urgency so the response matches reality.

## When to use

- the system is currently struggling with severity models-shaped problems
- you need a more disciplined approach than trial-and-error
- you want to turn one hard-earned lesson into a reusable habit
- the example looks a lot like an outage where every team member uses a different severity word

## Why it matters

Severity Models matters because strong engineers turn this move into routine behavior. They do not wait for ideal conditions. They learn to apply the right pressure even when the signals are incomplete, noisy, or politically messy.

In practice, this subtopic is less about a trick and more about a posture:

- make the important distinction visible
- choose the next observation or action deliberately
- reduce confusion faster than the system accumulates it
- leave the situation easier to reason about than you found it

## Common mistakes

- waiting for certainty before communicating
- arguing severity from ego rather than user impact
- writing postmortems that list events but hide lessons

## Tiny example

Imagine an outage where every team member uses a different severity word. Classify incidents by impact and urgency so the response matches reality. The goal is not merely to get past the moment. The goal is to make the situation legible enough that the next decision is better than the last one.

## Run the demo

```bash
node demo.js
```

The demo is intentionally small. It exists to make the shape of **Severity Models** concrete before you try it in a larger system.
