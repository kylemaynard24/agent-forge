# Project — Verification Strategy Pack

## Goal

Take one medium-small project and turn its tests into a **clear confidence model** instead of a pile of checks.

## Deliverables

1. A map of the major boundaries in the system
2. A proposed test strategy by boundary type
3. A working test suite covering unit, integration, and contract layers
4. A note on what belongs in end-to-end tests versus lower layers
5. A flake and maintenance risk section

## Constraints

- Do not chase 100% coverage
- At least one test must protect against a future refactor, not just today's implementation
- At least one test must simulate a dependency failure path
- Your strategy note must explain why one seductive test idea is not worth the maintenance cost

## Done when

- [ ] A teammate could read your note and understand the suite design
- [ ] Each major boundary has an intentional protection mechanism
- [ ] You can delete one low-value test and feel good about it
