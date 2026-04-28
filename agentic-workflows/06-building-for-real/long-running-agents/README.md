# Long-Running Agents

**Category:** Building for real

## What "long-running" means

An agent that runs for **longer than one context window** — minutes, hours, days. Examples:

- A research agent investigating a topic over a day.
- A monitoring agent watching a system over weeks.
- An "AI coworker" maintaining state across sessions.

These break the basic loop pattern: a single context window can't hold everything. The architecture has to change.

## What changes

### Memory becomes the spine

In a short-running agent, the context window holds everything. In a long-running agent, memory (file-backed, vector, KV) holds the *important* state, and only a *slice* of it loads into any given context.

The agent's "session" is one context window. Across sessions, what persists is what's in memory.

### Plans persist

The plan (see `02-single-agent-design/plans-and-tasks`) is checkpointed to disk. A new session loads the plan, sees what's done, picks up where the previous session left off.

### Background work

For genuinely long-running tasks, you need background scheduling — the agent doesn't sit in a loop waiting; it queues tasks and processes them when triggered.

### Identity continuity

A long-running agent has an "identity" — a name, a memory, ongoing tasks. Users expect "the same agent" across sessions. Your architecture maintains this.

## The session-as-checkpoint pattern

A common architecture:

1. **Persistent state**: plan + memory + run history, on disk.
2. **Per-session loop**: load the persistent state into context (selectively); run the loop; checkpoint changes back to disk.
3. **Cross-session resume**: a new session reads the persistent state and continues.

This makes the agent a thin wrapper around its persistent state. The runtime loop is short-running; the *agent* is long-running.

## The "compactify and continue" pattern

When a single session approaches the context limit:

1. Run a summarization step on the history.
2. Replace the history with the summary.
3. Continue the loop in the same session.

Claude Code's AutoCompact does this. Useful when one session genuinely needs to span many steps; combine with persistent memory for things that need to outlive even compactified sessions.

## Background-driven agents

Some long-running agents aren't user-driven; they're event-driven:
- A monitoring agent runs on a cron, checks metrics, alerts if needed.
- A code-watching agent receives webhook events on PRs.
- A nightly summarizer reads the day's logs and produces a report.

These are agents but with no real-time user interaction. They run, do their thing, persist state, and exit.

## Identity and memory

A long-running agent's *identity* is its memory + its history.

If memory is wiped, you have a fresh agent. If memory is corrupted or partially lost, you have an unreliable agent.

This means:
- **Memory is critical infrastructure.** Backup, versioning, schema migrations.
- **Memory schema evolves.** When you change what gets stored, plan migration.
- **Memory has access patterns.** Read-heavy? Write-heavy? Optimize accordingly.

## Anti-patterns

- **Stateful agents without checkpoints.** Crash mid-run, lose everything.
- **Auto-loading everything from memory into context.** Defeats the point of memory off-context.
- **No memory pruning.** Eventually fills, slows down, becomes noise.
- **Identity drift.** A session changes the agent's "personality" in memory; subsequent sessions inherit the drift.
- **No way to inspect.** A long-running agent without observability is a black box.

## Trade-offs

**Pros**
- Tasks that exceed one context window become possible.
- Continuity for users (the agent "remembers").
- Background automation.

**Cons**
- Architecture is more complex (state, scheduling, recovery).
- More failure modes (corrupted memory, stale plan).
- Harder to debug — you can't replay easily.

**Rule of thumb:** Don't build a long-running agent because it sounds cool. Build one because the task genuinely requires it. Most "long-running" use cases are actually a sequence of short-running sessions sharing memory.

## Real-world analogies

- An employee with a notebook. Each day is a new "session." The notebook persists context.
- A long-running daemon (e.g., a monitoring service): runs forever, processes events, persists state.
- A diary: records of the past inform the present. Without the diary, you'd be a different person every day.

## Run the demo

```bash
node demo.js
```

The demo simulates two "sessions" of a long-running task. Session 1 starts a multi-step plan; session 2 resumes from the checkpoint. Memory persists between them.
