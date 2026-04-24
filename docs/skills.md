# Skills

A **skill** is a named capability the model can choose to load and invoke *on its own* when it decides the skill is relevant. Unlike a slash command (which you type), a skill fires because the model recognized a matching situation.

## Skill vs. command vs. agent

| | Triggered by | Runs in | Good for |
| --- | --- | --- | --- |
| Slash command | You typing `/name` | Main context | Reusable prompts you invoke explicitly |
| Skill | Model recognizing a match | Main context | Capabilities that *should apply automatically* |
| Agent | Main Claude delegating | Separate context | Isolated, specialist work |

Example: you might have a `/review` command you call when you want a review. You'd make it a **skill** if you want Claude to always apply review conventions *whenever* it reviews code, without you asking.

## File layout

Skills are folders, not single files:

```
.claude/skills/<skill-name>/
  SKILL.md           required — the skill definition
  <anything else>    optional — reference docs, examples, helpers
```

`SKILL.md` frontmatter:

```markdown
---
name: migration-safety-check
description: Use when reviewing, writing, or deploying SQL migrations. Checks for destructive ops, missing indexes, and lock risks before committing.
---

When this skill is active:

1. Before approving any migration, enumerate: destructive ops (DROP, TRUNCATE),
   NOT NULL additions on large tables, missing indexes on new FKs.
2. For each risk, name the specific row count threshold at which it becomes dangerous.
3. If any CRITICAL risk is present, refuse to apply the migration and recommend
   a phased rollout instead.

Reference safer-migration patterns in ./patterns.md.
```

### The `description` field matters most

The model reads it to decide whether to load the skill. Bad descriptions = the skill never fires or fires at the wrong time.

- ❌ "Helps with databases"
- ✅ "Use when reviewing, writing, or deploying SQL migrations. Checks for destructive ops, missing indexes, and lock risks."

Include concrete triggers — verbs and nouns that would appear in a user message.

## Auto-loading behavior

When Claude sees a user message that plausibly matches a skill's description, it loads `SKILL.md` into context and follows its instructions. Skills stay loaded until the model decides the topic has changed.

This is why you shouldn't stuff everything into a skill — loading a 500-line SKILL.md eats context. Put reference material in sibling files and tell the skill to read them *when needed*.

## Skill body tips

- Lead with the **trigger conditions** — when does this apply?
- Give concrete procedures, not vague principles
- Reference external files (patterns, templates, examples) instead of inlining them
- End with failure modes — what should the skill *not* be used for

## When to reach for a skill

- The behavior should apply **any time** a certain topic comes up, without you re-invoking it
- You want to encode a team norm ("we always write tests before implementation")
- You have a knowledge base of patterns you want the model to consult when relevant

If the answer is "I want this when I type `/X`," it's a command, not a skill.

## A starter skill

`.claude/skills/test-first/SKILL.md`:

```markdown
---
name: test-first
description: Use when implementing new behavior or fixing bugs with reproducible symptoms. Writes a failing test before the implementation.
---

When implementing new behavior or a reproducible bug fix:

1. Write the failing test first. Run it and confirm it fails for the right reason.
2. Implement the smallest change that makes it pass.
3. Don't refactor in the same step as the fix — separate commits.
4. If you can't write a failing test first (e.g., the bug is flaky or env-specific),
   say so explicitly and describe what verification you'll do instead.
```

## Gotchas

- **Over-eager descriptions fire too often.** "Use when writing code" will load on every task.
- **Under-specific descriptions never fire.** If your skill doesn't load when you expect, the description is probably too vague.
- **Skills don't replace CLAUDE.md** — CLAUDE.md always loads. Skills load conditionally. Use CLAUDE.md for things that *always* apply to this repo; use skills for things that apply in specific situations.

## Where to go next

- Commands you invoke explicitly → [slash-commands.md](slash-commands.md)
- Event-driven automation → [hooks.md](hooks.md)
