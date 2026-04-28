# Testing and Verification

**Category:** Advanced engineer track

## Intent

Build the right confidence at the right boundary. Great testing is not "more tests." It is choosing the smallest set of checks that makes the system trustworthy to change.

## When to use

- A system changes often and regressions are expensive
- Teams argue about unit versus integration tests without defining the risk
- You need to protect interfaces between services or modules
- Flaky tests are eroding trust in the suite

## What this area trains

- picking test boundaries deliberately
- contract thinking
- distinguishing fast feedback from realistic feedback
- designing for testability
- diagnosing flake and nondeterminism

## Trade-offs

**Pros**
- Stronger confidence with less redundant effort
- Faster debugging when failures say something useful
- Better system design because seams become explicit

**Cons**
- Requires up-front thought instead of reflexive test writing
- Good integration tests are slower and more expensive to maintain
- Contract tests add discipline to interface ownership

## Rule of thumb

Every test should answer one question clearly. If a failure leaves you asking "what actually broke?", the boundary is probably wrong.

## Run the demo

```bash
node demo.js
```

The demo compares a unit check, a contract check, and an integration-style check around the same small workflow so you can see what each one catches.

See also: [homework.md](homework.md) and [project.md](project.md)
