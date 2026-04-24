# examples

Runnable demos and templates for Claude Code primitives. The agents, commands, and skills in this repo's `.claude/` folder are wired up to work out of the box — start `claude` in this directory and the commands show up in the picker.

## What's installed and runnable

### Agents (`.claude/agents/`)

| File | Purpose |
| --- | --- |
| `explainer.md` | Explains a file / function / module |
| `security-reviewer.md` | Security review specialist |
| `perf-reviewer.md` | Performance review specialist |
| `readability-reviewer.md` | Clarity / maintainability review specialist |

### Slash commands (`.claude/commands/`)

| Command | What it does |
| --- | --- |
| `/hello` | Trivial sanity check — says hi and describes the repo |
| `/explain <path>` | Delegates to the `explainer` agent |
| `/pr-desc` | Drafts a PR description from the current branch's git state |
| `/review-crew` | **Orchestration demo** — runs three reviewer agents in parallel and synthesizes |

### Skills (`.claude/skills/`)

| Skill | Fires when |
| --- | --- |
| `test-first` | You ask to implement new behavior or fix a reproducible bug |

## What's opt-in (not auto-installed)

| Folder | Contents |
| --- | --- |
| `examples/hooks/` | A `PreToolUse` hook that blocks `rm -rf` outside `/tmp`. See its README to install. |
| `examples/plans/` | Prompt templates and an annotated example of plan output. |
| `examples/orchestration-walkthrough.md` | Step-by-step trace of what happens when `/review-crew` runs. |

## Try the demos

Start Claude Code in this directory, then:

```text
/hello                              # sanity check — should work immediately
/explain docs/multi-agent.md        # delegates to the explainer agent
/pr-desc                            # drafts a PR description (needs commits on branch)
/review-crew                        # orchestration demo (needs diffs against main)
```

Testing the skill:

> Start a fresh conversation and say:
> *"I want to implement a function that parses ISO 8601 date strings."*
>
> The `test-first` skill should load and steer you toward writing a failing test first.

## Running `/review-crew` on a real diff

If there are no changes against main yet, make a small one:

```bash
echo "// demo change" >> README.md
git add README.md && git commit -m "demo: review-crew input"
```

Then in Claude Code:

```text
/review-crew
```

You'll see the main session spawn three agents in parallel, then return one consolidated report with a `ship` / `fix-then-ship` / `rework` verdict.

## Using these outside this repo

Everything in `.claude/` is project-scoped — only active when `claude` runs from this directory. To make a specific piece global, symlink it into `~/.claude/`:

```bash
ln -s "$(pwd)/.claude/agents/explainer.md" ~/.claude/agents/explainer.md
ln -s "$(pwd)/.claude/commands/review-crew.md" ~/.claude/commands/review-crew.md
# The command references the three reviewer agents — symlink those too if you want /review-crew to work globally
```

## Reference

- Concepts → [../docs/](../docs/)
- Orchestration walkthrough → [orchestration-walkthrough.md](orchestration-walkthrough.md)
- Plan templates → [plans/plan-prompts.md](plans/plan-prompts.md)
- Annotated plan example → [plans/annotated-plan.md](plans/annotated-plan.md)
- Hooks demo → [hooks/README.md](hooks/README.md)
