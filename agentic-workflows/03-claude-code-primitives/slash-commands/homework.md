# Homework — Slash Commands

> Capture a recurring prompt as a versioned file. Test it. Iterate.

## Exercise 1: Audit your own usage

Spend a week noting every time you re-type a similar prompt in Claude Code. Write each down. After a week, look for patterns. Pick the **one** that you've used at least 5 times.

That's your first slash command candidate.

## Exercise 2: Write the slash command

Build it as `.claude/commands/<your-name>.md`:

**Constraints:**
- Has a `description` line in frontmatter (under 80 chars).
- The body is instructions to Claude, not a conversation.
- It produces a predictable output shape (numbered sections, JSON, etc.).
- It has at least one explicit constraint ("do not modify files," "limit to N tool calls," etc.).
- It includes a bail-out condition for when the input is too large or ambiguous.

## Exercise 3: Test the command

Run it three times on different inputs. Compare outputs:

- Are the sections in the same order?
- Is the format reliably structured?
- Does it follow the constraints?

If two of three outputs drift, find the prompt section that's leaking and tighten it.

## Stretch 1: Add $ARGUMENTS

Make the command parametric. The user types `/your-command some_arg`. In the body, use `$ARGUMENTS`. Document what valid arguments look like inside the body itself (so the LLM knows when to bail).

## Stretch 2: A multi-agent slash command

Write a slash command that orchestrates 2 specialist agents. (You'll need to also write the agents — see `subagents` next topic.)

Example: a `/review-this-file` command that spawns a security agent and a readability agent in parallel against the file the user names, then synthesizes.

## Reflection

- "A slash command is a function. The body is the function body. $ARGUMENTS is the parameter." Argue or refute this metaphor.
- A slash command lives in version control. What does that change about how you maintain it? (Hint: code review applies; tests apply; rotting applies.)
- When does a slash command want to become a custom agent instead?

## Done when

- [ ] You've written a real `.claude/commands/<name>.md` and run it.
- [ ] Output is consistent across 3+ runs.
- [ ] You can articulate when to write a command vs an agent vs a hook.
