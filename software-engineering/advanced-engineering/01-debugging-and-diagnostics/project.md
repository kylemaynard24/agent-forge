# Project — Diagnostic Lab

## Goal

Build a small **bug lab** containing 3 intentionally broken workflows and a short runbook for how to debug each one.

## Suggested domain

Use a simple commerce, task, or messaging app with at least:

- one calculation bug
- one state bug
- one timing or ordering bug

## Deliverables

1. A runnable app or simulation with seeded bugs
2. A reproduction guide for each bug
3. A debugging journal with hypotheses and eliminated causes
4. One fix fully implemented
5. A short note describing which instrumentation should have existed earlier

## Constraints

- Do not start from the debugger or logs alone; start from the observed symptom
- The journal must timestamp each hypothesis change
- One bug must require narrowing across more than one module
- At least one fix must improve observability as well as correctness

## Done when

- [ ] Another person could follow your reproduction guide
- [ ] Your journal makes the reasoning legible
- [ ] You can explain why the final cause was easy to miss
