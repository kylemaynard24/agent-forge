# Authn vs Authz

**Area:** Security and Trust Boundaries

## Intent

Separate identity proof from permission checks so access control stays honest.

## When to use

- the system is currently struggling with authn vs authz-shaped problems
- you need a more disciplined approach than trial-and-error
- you want to turn one hard-earned lesson into a reusable habit
- the example looks a lot like an endpoint that checks login but not ownership

## Why it matters

Authn vs Authz matters because strong engineers turn this move into routine behavior. They do not wait for ideal conditions. They learn to apply the right pressure even when the signals are incomplete, noisy, or politically messy.

In practice, this subtopic is less about a trick and more about a posture:

- make the important distinction visible
- choose the next observation or action deliberately
- reduce confusion faster than the system accumulates it
- leave the situation easier to reason about than you found it

## Common mistakes

- conflating logged-in with allowed
- treating secrets storage as an implementation detail
- validating too late in the request path

## Tiny example

Imagine an endpoint that checks login but not ownership. Separate identity proof from permission checks so access control stays honest. The goal is not merely to get past the moment. The goal is to make the situation legible enough that the next decision is better than the last one.

## Run the demo

```bash
node demo.js
```

The demo is intentionally small. It exists to make the shape of **Authn vs Authz** concrete before you try it in a larger system.
