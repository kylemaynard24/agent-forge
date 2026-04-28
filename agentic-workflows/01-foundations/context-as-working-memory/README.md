# Context as Working Memory

**Category:** Foundations

## What is the context?

The **context window** is the LLM's working memory — the entire prompt visible to the model on a single call. It includes:

- The system prompt (who the agent is, how to behave).
- The goal (what the user wants).
- The full message history (prior turns: agent's tool calls, observations).
- The tool definitions (names, schemas, descriptions).
- Any retrieved or injected context (memory recall, RAG snippets).

Modern model context windows are large (200K+ tokens for Claude). It's tempting to think this means "you can stuff anything in." That is the most expensive mistake in agent design.

## Two truths about context

### 1. Long context costs you

Every token costs money and latency. A 100K-token prompt isn't free; on a long-running agent that loops 30 times, the cost compounds. Worse, **most LLMs degrade with very long context** — the model attends well to the start and end but loses fidelity in the middle. (This is the "lost in the middle" effect, well-documented in research.)

A bloated prompt isn't just slower and pricier. It's *worse at the task*.

### 2. Context shapes behavior more than instructions

Tell the model "be concise" in the system prompt; pour 50KB of verbose log output into the history; the model will become verbose. The history *is* the example. What the agent sees is what the agent will resemble.

This is why **observation hygiene** (what you put back into the loop) matters more than people realize.

## The four sources of bloat

1. **Verbose tool outputs.** A `read_file` that dumps a 5,000-line file into the next observation. Truncate or summarize.
2. **Repeated tool calls.** Each loop iteration re-includes prior tool calls and observations. After 20 iterations of repetitive actions, the prompt is enormous and most of it is noise.
3. **Long tool definitions.** 30 tools each with a paragraph-long description = a heavy system prompt.
4. **Carried-over thinking.** Some patterns include the model's "thoughts" in subsequent turns. Useful for ReAct continuity; expensive for long runs.

## Strategies for managing context

### Truncation
The simplest: cap the size of any single observation. `read_file` returns the first 500 lines, with `[truncated, total: 5000 lines]` appended. The LLM can call `read_file` again with an offset if it needs more.

### Summarization (compaction)
When history grows past a threshold, summarize older turns into a brief "what's happened so far" and replace them. Claude Code does this when conversations approach context limits — the **AutoCompact** behavior.

### Retrieval (don't preload)
Instead of stuffing background docs into every prompt, give the agent a `search_docs(query)` tool. The model retrieves *only what it needs, when it needs it*. This is the core idea behind RAG — but used inside an agent loop, not as a one-shot.

### Memory off-context
Persistent state (notes, learned facts) lives in files, a DB, or a vector store. The agent reads/writes via tools. The context window doesn't grow as memory grows — only the *current turn's relevant slice* enters context.

### Selective re-inclusion
After many steps, you don't need the full back-history of every observation. Keep the goal, the latest plan, and the last few observations; drop the middle.

## The "context budget" mental model

Treat context like a budget — usually expressed in tokens but you can also think in characters or messages. Decide the budget per slice:

| Slice | Typical share |
|---|---|
| System prompt + tool defs | 5–15% |
| Goal + current task | 1–5% |
| History (last N turns) | 30–60% |
| Memory recall / retrieval | 10–30% |
| Headroom (model output) | 10–20% |

If a slice grows past its share, you have a leak. Find it and plug it.

## What gets lost when context overflows

Claude (and most modern LLMs) won't reject a long prompt — but performance degrades:
- Earlier instructions get attended to less.
- The model conflates similar earlier passages.
- Long observations bury the recent goal.
- Tool schemas in a long prompt may get partially "forgotten."

The symptoms: the agent stops following instructions, picks the wrong tool, or repeats earlier work.

## Trade-offs of strategies

**Truncation**
- Pros: simple, deterministic, cheap.
- Cons: information loss; the agent may need to re-fetch.

**Summarization**
- Pros: compresses heavily; preserves arc of the run.
- Cons: requires an LLM call to summarize; lossy in subtle ways.

**Retrieval**
- Pros: scales context independent of corpus size.
- Cons: needs an indexing pipeline; retrieval quality dominates.

**Memory off-context**
- Pros: unbounded long-term memory; agent runs are stateful across sessions.
- Cons: read/write is now a tool call; another failure surface.

**Rule of thumb:** Default to *truncation*. Add *summarization* when truncation loses too much. Add *retrieval* when your corpus is too large to fit even after truncation.

## Real-world analogies

- A whiteboard. As discussion progresses you erase old notes (compaction) or move them to a notepad (memory off-context). You don't keep adding without ever clearing.
- A surgeon's mental load: focus on the current step; documentation handles long-term state.
- A chess player's working memory: not every move ever made — the current position plus a few candidate lines.

## Run the demo

```bash
node demo.js
```

The demo simulates a long-running agent and shows three context strategies — naive, truncate, summarize — with explicit measurements of context size, cost, and degradation.

## Deeper intuition

Foundations are where you build the core mental model of an agent: what it is, what makes it different from a chatbot or workflow, and which primitives matter before you worry about polish. These topics are worth over-learning because every later design choice depends on them.

The best way to study **Context as Working Memory** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?
