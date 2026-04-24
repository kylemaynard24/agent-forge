# How orchestration works — a walkthrough

This is a step-by-step trace of what actually happens when you run `/review-crew`. Read alongside [`../docs/multi-agent.md`](../docs/multi-agent.md) (concepts) and [`../.claude/commands/review-crew.md`](../.claude/commands/review-crew.md) (the real command).

## The players

1. **Main session** — the Claude Code session you type at. Orchestrates.
2. **Subagents** — `security-reviewer`, `perf-reviewer`, `readability-reviewer`. Each has its own context window and tool allowlist.
3. **The orchestrator prompt** — the body of `.claude/commands/review-crew.md`. It's instructions *to the main Claude*, not to the subagents.

## What main Claude "sees"

When you type `/review-crew`, the harness injects the command body into the main session as if you had pasted it. So from main Claude's point of view, it just got a detailed set of instructions:

> Review the current branch with three specialist agents running in parallel. 1. Identify changed files...

Main Claude then follows those instructions using its tools.

## Step-by-step trace

Suppose you're on `feat/jwt-migration`:

### 1. Identify the work

Main Claude calls the `Bash` tool: `git diff main...HEAD --name-only`. Say it returns:

```
auth/jwt.py
auth/sessions.py
auth/decorators.py
tests/auth/test_mixed_traffic.py
```

If it had returned empty, main Claude would stop here and say "nothing to review."

### 2. Fan out — three agents, ONE message

Main Claude emits three `Agent` tool calls **in the same assistant message**:

```
Agent(subagent_type="security-reviewer",    prompt=<file list + framing>)
Agent(subagent_type="perf-reviewer",        prompt=<file list + framing>)
Agent(subagent_type="readability-reviewer", prompt=<file list + framing>)
```

**Because they're in one message, they run in parallel.** If main Claude accidentally sends them one at a time, you get sequential execution — ~3x slower for no benefit. This is why the command body says "in a SINGLE message" in bold.

### 3. Each agent works independently

Each subagent:

- Opens a fresh context window
- Loads its own system prompt (the body of its `.md` file)
- Gets the task prompt written by main Claude
- Can use only the tools declared in its frontmatter
- Reads files, forms findings, writes a single report
- Returns one message to the main session

Critically, agents **do not see** main's conversation or each other's work. Isolation is a feature, not a bug — a security reviewer who hears "but perf matters more" will soften its findings.

### 4. Main Claude synthesizes

With the three reports in hand, main Claude:

- Buckets findings by severity across reviewers
- Deduplicates (if sec and readability both flagged the same naming issue, collapse into one)
- Cites which reviewer raised each — `[sec]`, `[perf]`, `[read]`
- Produces the consolidated report
- Ends with the verdict line: `ship` / `fix-then-ship` / `rework`

### 5. You see the result

Only the synthesized report. The three individual agent reports aren't shown unless you ask *"show me the raw agent outputs."*

## Why this shape works

| Property | Why it matters |
| --- | --- |
| **Parallel** | 3 agents in parallel ≈ 1/3 wall clock of sequential |
| **Isolated contexts** | Agents can't contaminate each other's judgment |
| **Small tool allowlists** | Each agent's context stays focused on its job |
| **Explicit synthesis rules** | Deterministic structure (Blockers / Fixes / Nits / verdict) |
| **Main context stays clean** | You see one report, not three novels |

## Common failure modes (and fixes)

| Failure | Cause | Fix |
| --- | --- | --- |
| Reports dumped verbatim instead of synthesized | Synthesis instruction too vague | Make the step explicit with rules ("deduplicate", "cite each reviewer") |
| Agents give conflicting takes with no reconciliation | No tie-break rule | Tell main Claude how to handle disagreements |
| One agent blows through context | Scope too broad | Tighten the agent's system prompt; restrict tools |
| Orchestration runs serially | Main Claude sent calls in separate messages | Be explicit: "in a single message" (or "in parallel") in the command body |
| Agent misses files | Vague task prompt | Pass the exact file list, not "the branch" |

## Extending it

Add a fourth reviewer (e.g. `docs-reviewer`):

1. Create `.claude/agents/docs-reviewer.md` with a focused system prompt and tools.
2. Edit `.claude/commands/review-crew.md`:
   - Add a fourth `Agent` call in the parallel fan-out
   - Add the new reviewer's findings into the synthesis buckets (`[docs]` citation key)
3. Restart Claude Code — commands reload on session start.

## Related orchestration shapes

The review crew is one shape. Others follow the same pattern, just with different specialists:

- **Planning crew** — `explorer` + `architect` + `risk-analyst` reviewing a proposal
- **Research crew** — N domain-focused explorers answering "where does X happen in this codebase?"
- **Variant crew** — N implementers drafting different approaches to the same API
- **Red team crew** — `attacker` + `defender` + `auditor` for threat modeling

See [../docs/multi-agent.md](../docs/multi-agent.md) for the full catalog.
