# Memory Patterns

**Category:** Single-agent design

## What "memory" means here

In agent terminology, **memory** is *anything an agent remembers across calls*, beyond the current prompt. It comes in four common shapes:

1. **No memory.** Each invocation is fresh. The agent starts from zero every time.
2. **Conversational memory.** Within a session, prior turns are visible (this is just the context window).
3. **File-backed memory.** Notes/artifacts persisted to disk. Read/write via tools.
4. **Vector memory.** Semantic recall via embeddings. The agent retrieves relevant past info from a store.

Each is a different design decision with different costs.

## Pattern 1: No memory (stateless)

Every invocation is isolated. The agent reads the request, acts, returns, forgets.

**When to use:**
- Tasks that are genuinely independent (a one-shot summarization service).
- Cost-sensitive deployments — no storage, no retrieval, no read-back.
- Compliance contexts where retaining session state is a liability.

**Cost:** the agent can't learn from past interactions. Each run reproves what it already knew.

## Pattern 2: Conversational memory (context window)

Within one session, the full message history is in the prompt. This is what you've been doing in the loop already.

**When to use:**
- Single-session multi-turn tasks (a research session, a debugging conversation).
- The session length fits in your context budget.

**Cost:** scales with session length. Eventually overflows; needs truncation/summarization (see `01-foundations/context-as-working-memory`).

## Pattern 3: File-backed memory

The agent has tools to read/write a persistent notes file (or KV store). Memory is on disk, not in context.

```
note_save({key, content})
note_load({key})
note_list()
note_search({query})
```

**When to use:**
- Long-running or recurring tasks where you want continuity across sessions.
- "Working memory" for a task that exceeds one context window.
- Auditable memory — disk is searchable, exportable, reviewable.

**Cost:** the agent must explicitly call to retrieve. If it forgets to look, it forgets the info. (This is also a feature — selective recall keeps context lean.)

**Real example:** Claude Code's `auto-memory` feature in this repo uses file-backed memory. `MEMORY.md` is the index; individual `.md` files are entries.

## Pattern 4: Vector / semantic memory

A vector store indexes prior content. The agent queries by *similarity* — semantically related, not exact-match.

```
remember({content})
recall({query, k=5})
```

`recall("Kyle's preferences for code review")` retrieves chunks that are *semantically* about review preferences, even if the original entries used different words.

**When to use:**
- Memory grows beyond easily-keyable content.
- Recall is fuzzy (you don't know exact terms; you know intent).
- Long-running personal assistants ("remember things this user has told me").

**Cost:** infrastructure (a vector DB or local index), embedding costs, retrieval quality is variable.

## Choosing a pattern

| Memory size | Recall pattern | Choose |
|---|---|---|
| Tiny | Exact-key | Conversational + system prompt injection |
| Small (KB) | Exact-key | File-backed (KV) |
| Medium (MB) | Mixed | File-backed + index |
| Large (GB+) | Semantic | Vector store |

## Memory design principles

### 1. Selective retrieval beats automatic injection

**Don't auto-inject all known memory into every prompt.** Doing so re-bloats the context.

Instead: give the agent retrieval tools and let it decide *what's relevant for the current task*. The agent's judgment guides recall.

### 2. Memory is structured, not free-text dumps

If you store "Kyle prefers concise code reviews," good. If you store "Kyle was working on a Postgres migration last Tuesday and asked me about replication and then we talked about indexes…" your memory degrades into a journal that no agent can use efficiently.

Have a memory format. Examples:
- `{ topic, fact, last_updated }` — clean, queryable.
- Tagged entries: `[preference] concise`, `[fact] Kyle owns billing service`.

### 3. Garbage collection matters

Memory grows. Without pruning, it becomes noise.

Strategies:
- **TTL.** Entries expire after N days unless refreshed.
- **Confidence + recency.** Keep high-confidence + recent; drop the rest.
- **LRU.** Discard least-recently-recalled.
- **Manual.** The agent itself prunes when storage gets too big (rare; risky).

### 4. Be explicit about what you remember

Memory is a privacy and correctness surface. The agent should be cautious about what it stores, and a user-facing "what do you remember about me?" command is a baseline of trust.

## What memory is *not*

- **Memory is not an excuse for blob context.** Storing 50KB of conversation history doesn't help if you re-load 50KB into every prompt.
- **Memory is not a substitute for the goal.** The goal is what the agent is trying to do *now*. Memory is supporting context.
- **Memory is not always the right answer.** Sometimes a stateless agent + better tools is simpler and more reliable.

## Trade-offs across patterns

| | No memory | Convo | File | Vector |
|---|---|---|---|---|
| Setup cost | none | none | low | medium |
| Per-call cost | none | grows w/ session | small (tool calls) | small (retrieval) |
| Recall quality | n/a | exact, recent | exact, queryable | fuzzy, semantic |
| Persistence | none | session | session+ | session+ |
| Auditability | n/a | full | full | partial |

**Rule of thumb:** Default to **file-backed**. Add vector memory only when file-backed isn't enough (semantic recall is genuinely needed). Most agents never need vector memory.

## Real-world analogies

- No memory: a phone call to a stranger. Every call starts from zero.
- Conversational: an in-progress conversation. You remember what was just said but not last month.
- File-backed: a notebook. Open the page you need.
- Vector: a librarian who fetches books by topic, not call number.

## Run the demo

```bash
node demo.js
```

The demo implements file-backed memory with `save`/`load`/`list`/`search` tools and runs an agent across two "sessions" — proving that information persists between runs even though the loop is fresh each time.

## Deeper intuition

Single-agent design is mostly the craft of controlling ambiguity. A strong single agent is not the one with the longest prompt; it is the one whose tools, output contracts, memory choices, and recovery rules make useful behavior easier than unhelpful behavior.

The best way to study **Memory Patterns** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?
