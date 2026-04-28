# Debugging and Diagnostics

**Category:** Advanced engineer track

## Intent

Turn vague symptoms into narrow, testable hypotheses until you reach the real root cause. Good debugging is not "being clever in the moment." It is disciplined search under uncertainty.

## When to use

- A bug report says "sometimes this fails" and the reproduction is weak
- The symptom appears far away from the cause
- Logs are noisy and the first guess is probably wrong
- You need to fix the problem without destabilizing everything around it

## What this area trains

- symptom sharpening
- minimal reproductions
- shrinking the search space
- adding instrumentation without thrashing
- distinguishing symptom, trigger, mechanism, and root cause

## Trade-offs

**Pros**
- Faster path to the actual fault
- Fewer random edits and less superstition
- Better incident notes and bug reports

**Cons**
- Slower than "just try something" in the first ten minutes
- Requires writing down hypotheses instead of free-associating
- Can feel procedural until the habit becomes automatic

## Rule of thumb

If you cannot say what observation would prove your current hypothesis wrong, you are not debugging yet. You are guessing.

## Run the demo

```bash
node demo.js
```

The demo shows a small checkout bug, then narrows it through evidence rather than by editing code until the tests go green.

See also: [homework.md](homework.md) and [project.md](project.md)
