# Homework — Memory Patterns

> Build a file-backed memory system. Add structure, GC, and explicit recall.

## Exercise 1: File-backed key-value memory

Build a memory module backed by an actual file (e.g., `memory.json` or one file per entry under `./memory/`).

**Tools:**
- `note_save({key, content, tags?})` — writes an entry. Updates `last_updated`.
- `note_load({key})` — fetches by exact key.
- `note_list({tag?})` — list keys, optionally filtered by tag.
- `note_search({query})` — substring search across keys and contents.
- `note_delete({key})` — removes an entry.

**Constraints:**
- Each entry has at minimum: `{ key, content, tags, created_at, last_updated, last_recalled }`.
- All tools are robust to malformed inputs (missing key, etc.) — return clear errors.
- Concurrency-safe enough for one process: subsequent calls see prior writes.
- The agent never auto-loads memory; it must explicitly call `note_load` or `note_search`.

## Exercise 2: Garbage collection

Add a GC step that runs (manually or on a schedule):
- Drops entries with `tag = "ephemeral"` older than 24 hours.
- Drops entries with `last_recalled` older than 90 days.
- Reports what was dropped.

**Constraints:**
- GC is idempotent: running it twice in a row drops nothing on the second run.
- A user-facing `memory_diag()` tool reports counts and recently-pruned entries.

## Exercise 3: A multi-session task

Build a small task that demonstrates persistence:

- Session 1: the agent receives "remember that I prefer Python over Ruby."
- Session 2 (fresh agent process): the user asks "what should I write this script in?"
- The agent retrieves the preference and answers accordingly.

**Constraints:**
- Session 2 has no in-context memory of session 1.
- The agent's first action in session 2 should be to *check memory* (search or list).
- The system prompt encodes "before answering, check memory for relevant notes."

## Stretch: Add semantic memory (light)

Add a fourth tool: `note_search_semantic({query})`. Implementation options:
- **Real:** integrate a small embedding model (sentence-transformers, OpenAI embeddings) and a local FAISS-like index.
- **Stub:** TF-IDF or simple bag-of-words similarity, no model.

Compare the recall quality on 5 example queries. Where does substring search fail? Where does semantic search help? Where does it surprise you (false positives)?

## Reflection

- "Memory is what the agent calls; not what we auto-inject." Why is this distinction important? (Hint: context bloat; LLM attention; user trust.)
- File-backed vs vector memory: what's the simplest test for whether you need vector? (Hint: do queries work with substring search? If yes, file-backed is enough.)
- A 90-day TTL feels arbitrary. How would you justify it for your specific use case? Your own life — what's your equivalent?

## Done when

- [ ] Memory persists between two separate process invocations.
- [ ] GC has run and dropped some entries; you have logs proving it.
- [ ] The multi-session demo works without context-window memory.
- [ ] You've articulated when you'd reach for vector memory and when you wouldn't.

---

## Clean Code Lens

**Principle in focus:** Minimize Shared Mutable State + Explicit Mutation

Persistent memory is shared mutable state — it outlives any single agent session and can be read or written by any future invocation — which means all the discipline that applies to global variables applies here: be explicit about what is stored, name keys clearly enough that their purpose is obvious in six months, and make staleness visible rather than silent. The `last_updated` and `last_recalled` fields in your schema are exactly what clean code asks for when shared state must exist: a record of every mutation, named for what it tracks.

**Exercise:** Review every key you wrote to memory in your multi-session demo. Apply the same naming standard you'd use for a public API field: the key name alone should communicate what the entry contains, who set it, and roughly when it matters. Rename any key that requires reading the content to understand its purpose.

**Reflection:** The GC step drops entries older than 90 days — a hard-coded policy embedded in the implementation. In software design, where would you put that policy so it could be changed without touching the GC logic itself, and what does that tell you about the relationship between configuration and code in stateful systems?
