# Homework — Context as Working Memory

> Treat the context window like a budget. Spend it deliberately.

## Exercise 1: Implement an observation-truncation policy

Take the loop from `the-agentic-loop`. Add a function `prepareObservation(rawOutput, opts)` that:
- Truncates strings longer than `maxChars` (e.g., 1000), appending `[truncated, original N chars]`.
- For arrays/objects, summarizes structure rather than dumping content (`{ users: [3 items], total: 248 }` not `{ users: [{...}, {...}, {...}], ... }` blob).
- Marks the truncation in a way the LLM can re-fetch if needed (e.g., adds `[call read_file again with offset=1000 for more]`).

**Constraints:**
- Every observation routes through `prepareObservation` — no exceptions.
- The agent must be able to ask for "more" and get the next chunk. (Hint: tools take an `offset` argument.)
- Truncation logic is tested independently of the loop.

## Exercise 2: Add a context-budget gauge

Compute and log the current prompt size in tokens (or characters) at every step. When it crosses a threshold (say, 50K tokens), trigger a summarization.

**Build:**
- A token-count approximator (or use `tiktoken` if you want real numbers).
- A `summarizeHistory(messages)` function that compresses older turns into a single summary message. Keep the system prompt + goal + last 3 turns intact.
- Trigger summarization when over budget. Run summarization, log how much was reclaimed.

**Constraints:**
- The summary message is clearly tagged as a summary (`[summary] ...`) so the LLM knows it's lossy.
- Summarization preserves: the goal, the high-level path so far, any open sub-tasks.
- The system prompt and tool definitions are NEVER summarized — they're invariants.

## Exercise 3: Memory-off-context

Add a `notes` system: an external file (or in-memory KV) where the agent can write/read short notes. Add two tools:
- `note_save({key, content})` — stores a note.
- `note_load({key})` — fetches a note.

The agent uses these to persist findings across context-window pressure. When the history is summarized, the persisted notes survive.

**Constraint:** Notes are NOT auto-injected into context. The agent must explicitly call `note_load` to retrieve. This is intentional — it forces selective retrieval.

## Stretch: Lost-in-the-middle test

Construct a test that demonstrates the "lost in the middle" effect on a long context. (Most modern models still show this somewhat.) Place a critical instruction in the middle of a long history and observe whether the agent obeys it. Move the same instruction to the end. Compare.

If you don't have an API budget for this, simulate the symptom: hand-roll a stub LLM that "obeys" instructions only from the head/tail of context, and write a regression test that detects when an important rule slid into the middle.

## Reflection

- Why does context summarization beat context truncation in some cases and lose in others?
- Memory-off-context lets the agent persist arbitrary state. What's the cost? (Hint: another failure surface; another tool to mis-call; auditability.)
- "If your agent gets dumb after step 15, look at your context, not your prompt." Argue for or against.

## Done when

- [ ] No tool output reaches the LLM at full size — everything passes through the truncator.
- [ ] You can run a 30-step agent without the prompt exceeding your budget.
- [ ] The agent uses `note_save` to persist information that would otherwise be lost in summarization.
- [ ] You can explain the trade-offs of truncation vs summarization vs retrieval to a teammate.

---

## Clean Code Lens

**Principle in focus:** Minimize Scope + Explicit State

Context management is state management: the context window is a global variable that grows with every step, and the same discipline that warns against wide scope in code applies here — the more that lives in context, the harder it becomes to reason about what the agent "knows" at any point. The `[summary]` tag and the `[truncated, original N chars]` annotation are the agentic equivalents of naming a variable clearly and documenting a mutation — they make implicit state changes explicit and readable.

**Exercise:** Audit your loop after a 10-step run and identify every piece of context that is still present but no longer needed for any future step. Write a `contextPrunePolicy(history, currentStep)` function that removes that stale state with a named rationale for each removal — treat it like cleaning up variables that have gone out of scope.

**Reflection:** The homework requires the agent to explicitly call `note_load` rather than auto-injecting notes into context. What clean code principle does that enforce, and what would go wrong if notes were injected automatically — both in terms of correctness and in terms of how hard the agent would be to debug?
