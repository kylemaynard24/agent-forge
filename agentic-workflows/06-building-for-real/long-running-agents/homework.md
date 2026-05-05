# Homework — Long-Running Agents

> Build an agent that survives across sessions. Memory is the spine.

## Exercise 1: Checkpoint a plan

Take the plan-then-act agent from `02-single-agent-design/plans-and-tasks`. Add:

- The plan persists to a JSON file at every status change.
- A new agent process loads the plan, sees what's done, continues.

**Constraints:**
- Persistence is atomic — partial writes don't corrupt the file.
- Each plan update is a checkpoint with a timestamp.
- A test: launch session A, complete 2 steps, kill the process; launch session B, verify it picks up at step 3.

## Exercise 2: Identity continuity

Add memory (from `02-single-agent-design/memory-patterns`) to the long-running agent. Across sessions:

- The agent remembers prior findings.
- Saying "what did you learn last time?" works.
- Memory persists across multiple processes.

**Constraints:**
- Memory has explicit shape (not free-text).
- A memory dump is human-readable.
- The agent doesn't auto-load all memory into context; it explicitly retrieves.

## Exercise 3: Compactify a session

When a single session approaches a context budget, summarize older history:

- Detect: history > N tokens.
- Action: summarize older turns into one entry; keep the last 3 turns full.
- Continue the session.

**Constraint:** the summary preserves the goal, current plan progress, and any open tasks. It loses verbose details — that's the point.

## Stretch 1: Background scheduler

Implement an agent that runs on a schedule (e.g., every hour):

- Cron triggers a session.
- Session checks state, processes any pending work, persists.
- Exits.

The agent has no continuous loop — it's a series of triggered sessions. Yet from the user's view, it's "always working."

## Stretch 2: Memory schema migration

Your memory schema evolves. v1 had `{topic, content}`; v2 adds `tags`.

Build a migration:
- On load, detect old-shape entries.
- Migrate to new shape (e.g., add empty `tags`).
- Save the migrated state.
- Old data is preserved; new code can read both shapes.

This is the kind of work that separates a hobby agent from a production one.

## Reflection

- "A long-running agent's identity is its memory." What happens if memory is corrupted? (Hint: this is real; design for backup.)
- "Most 'long-running' use cases are actually short-running sessions sharing memory." Defend or refute.
- Why is "auto-load everything from memory" a foot-gun? (Hint: prompt bloat; defeats selective recall.)

## Done when

- [ ] Plan persists; resume across kill-and-restart works.
- [ ] Memory persists; identity continues across sessions.
- [ ] You've handled at least one schema-migration scenario.
- [ ] You can articulate when "long-running" is genuinely warranted vs. when "many short sessions" is the right framing.

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names; make the implicit explicit

An unnamed checkpoint is an unnamed save point — if the agent crashes and restores, you need the checkpoint name to know whether you are resuming from `after_data_collection` or `after_partial_writes`. Checkpoint names like `plan_approved`, `all_sources_fetched`, and `report_draft_complete` encode the phase boundary, making the resume logic readable and the risk of partial-state corruption diagnosable without reading the full state blob.

**Exercise:** Name every checkpoint in your long-running agent after the phase it completes (not after the step that triggers it), then verify that a restore log line using only the checkpoint name tells you exactly where execution will resume.

**Reflection:** If a long-running agent is interrupted mid-run and a colleague needs to decide whether to resume it or restart it from scratch, does the checkpoint name alone give them enough information to make that call?
