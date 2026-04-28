# Homework — Skills

> Convert a recurring "always do X when Y" pattern into a skill. Make the trigger crisp.

## Exercise 1: Pick a candidate

In your work, identify a behavior that should kick in *automatically* when a relevant context appears. Examples:
- "When writing tests, always include both happy and edge cases."
- "When editing CSS, always check for unused selectors."
- "When proposing a refactor, always show the before/after side by side."

Pick one. The trigger should be intent-based, not literal-keyword-based.

## Exercise 2: Write the skill

Build it under `.claude/skills/<your-name>/SKILL.md`:

**Constraints:**
- The `description` field crisply states *when this skill applies* in 1-2 sentences. The harness uses this to decide whether to load.
- The body has actionable steps, not vague principles ("be helpful" is not a skill body).
- Include an explicit "When NOT to apply" section. Without it, the skill triggers too often.

## Exercise 3: Test the trigger

Try 5 phrasings of user requests:
- 2 that should clearly trigger the skill.
- 1 that's borderline.
- 2 that should NOT trigger.

Observe whether the skill loads. If it triggers on the wrong cases, refine the description. If it misses the right cases, refine the description. The description is the test surface.

## Stretch 1: Multi-skill conflict

Write a *second* skill whose trigger condition could plausibly overlap with the first. Now: how does Claude decide which to apply when both could fire?

Document the resolution. Options:
- Make the descriptions disjoint (refine triggers).
- Add an explicit precedence note in the bodies.
- Combine them (if they really should always fire together).

## Stretch 2: Skill + slash command + agent — the full triad

Pick a workflow that uses all three:
- A **slash command** to kick it off.
- A **skill** that's automatically loaded when relevant.
- An **agent** that does specialized work the slash command delegates.

Sketch the file structure and how they hand off to each other. Build it small.

## Reflection

- A skill is more like a "personality trait" than a "command." When does that framing help, and when does it mislead?
- "Skills auto-trigger on intent." This is also their failure mode — they fire when you didn't want them to. How do you defend against this?
- If your description is "be a careful coder," that's not a skill — it's a prompt smell. Why? (Hint: the description must specify *triggering criteria*, not desired behavior.)

## Done when

- [ ] You've written a real `.claude/skills/<name>/SKILL.md` that loads when intended.
- [ ] You've tested at least 5 user phrasings and tuned the description.
- [ ] You can articulate when a slash command becomes a skill becomes an agent.
