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

## Scenario questions

These questions are meant to turn **Unit vs Integration Boundaries** into an operational instinct. Read them like incident prompts: what are you seeing, what move should happen next, and what mistake are you trying to avoid under pressure?

### Scenario 1 — "The system is noisy, stressful, and people want to skip straight to action"

**Question:** You are in the middle of a real engineering problem and the room wants to jump ahead before the situation is legible. Is this topic the kind of move that should slow people down and sharpen the next step?

**Answer:** Usually yes.

**Explanation:** This topic matters when disciplined engineering beats improvisation. The point is not process for its own sake. The point is to reduce confusion, make the next move more informed, and avoid creating a second problem while reacting to the first.

**Why not jump first to Testability Design or Contract Testing:** adjacent skills matter, but they often work best after **Unit vs Integration Boundaries** has made the problem clearer, safer, or more measurable.

### Scenario 2 — "A team keeps confusing activity with progress"

**Question:** An engineer says, "We're doing a lot already, so we must be handling this well." Does **Unit vs Integration Boundaries** help test whether the team is actually making the system easier to reason about?

**Answer:** Yes.

**Explanation:** Strong operational topics give you a quality bar for action. **Unit vs Integration Boundaries** is useful when you need to ask whether the current work is actually reducing uncertainty, restoring control, or increasing confidence instead of merely producing motion.

**Why not treat effort as evidence:** because under pressure, busy teams can still thrash. The value of **Unit vs Integration Boundaries** is that it gives you a sharper standard for what "better" looks like.
