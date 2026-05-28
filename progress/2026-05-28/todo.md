# 2026-05-28 — Today's slice

> **Active sprint:** [progress/sprints/2026-04-30/sprint.md](../sprints/2026-04-30/sprint.md)
> **Sprint progress:** 1 of 13 items complete · 11 remaining after today's slice
> **Working folder:** `progress/2026-05-28/working-folder/agentic-workflows/` (scaffolded; gitignored)

## 📚 Today's reading (2026-05-28)

Three short reads to keep the learning loop alive even when the sprint item is heavy. The source link goes to the site's archive — click it if you want deeper resources beyond the single article we picked today.

1. **[How CockroachDB Built Vector Indexing at Scale](https://blog.bytebytego.com/p/how-cockroachdb-built-vector-indexing)** — via [ByteByteGo](https://blog.bytebytego.com/)
   How CockroachDB added vector indexing to a distributed SQL database and worked through the tradeoffs needed to make nearest-neighbor search fit a multi-tenant system.

2. **[Capturing A Billion Emo(j)i-ons](https://highscalability.com/capturing-a-billion-emo-j-i-ons/)** — via [High Scalability](https://highscalability.com/)
   Hotstar's real-time emoji pipeline: high-throughput ingestion, Kafka-backed async processing, and the design choices that let a fan-engagement feature absorb billions of events.

3. **[EP216: RAGs vs Agents](https://blog.bytebytego.com/p/ep216-rags-vs-agents)** — via [ByteByteGo](https://blog.bytebytego.com/)
   A concise comparison of when retrieval is enough, when you need a tool-using loop, and what problem shape should push you toward one pattern over the other.

## 🧪 Stretch prompt (2026-05-28)

Adjacent-territory research — deliberately unrelated to today's reading and sprint item. ~15–30 min of research, ~300–500 words of your own writing.

**Question:** When a process memory-maps a file, what work do the OS page cache and page tables each do, and why can `mmap` outperform repeated `read()` calls for some workloads but backfire for others?

**Why this matters:** This builds intuition for how user-space code meets kernel memory management. That mental model shows up in databases, search engines, build tools, and any system that moves lots of bytes efficiently.

**Angles to cover:**
- Explain page cache vs virtual memory vs page tables: what gets set up at `mmap` time, and what only happens on the first page fault.
- Compare `mmap` with explicit `read()` loops for sequential scans and random access, including syscalls, copies, and lazy loading.
- Give 1–2 failure modes or trade-offs, such as page-fault storms, tricky writeback behavior, or address-space pressure.

**Write your response in** [`stretch-prompt.md`](stretch-prompt.md) — it's tracked, so your writeups accumulate into a portfolio of thinking over time.

## Round 1 (~90 min)

### S-02: Build `TinyAgent.cs`

**Time:** ~90 min · **Subject:** Agentic workflows · **Sprint section:** "Agentic workflows" in [sprint.md](../sprints/2026-04-30/sprint.md)

> Carried forward from the 2026-05-17 slice (originally assigned 2026-05-01). The 252-line `what-is-an-agent` README is the conceptual anchor for this build — S-02 is where you make the four-piece anatomy (LLM + tools + loop + goal) concrete in code.

Build `TinyAgent.cs` in `progress/2026-05-28/working-folder/agentic-workflows/` as a tiny C# version of the four-piece agent anatomy. Include:
- An `ILlm` interface (single method that takes the conversation/context and returns the next action to take).
- A `StubLlm` implementation that returns canned next actions (no real model call — hardcode the sequence so you can see the loop work end-to-end).
- One concrete tool: `CountLines(path)` that reads a file and returns its line count.
- A loop capped at 3 iterations, with a goal string passed into the agent. Each iteration: ask the LLM "what now?", execute the chosen action, feed the observation back. Print each step so you can watch the loop ask → act → observe.

Keep it intentionally small — about 50 lines is enough if you focus on the anatomy rather than polish. If you want a refresher on the abstractions, see [what-is-an-agent](../../agentic-workflows/01-foundations/what-is-an-agent/README.md), [classes-basics](../../software-engineering/csharp-and-dotnet/01-classes-basics/README.md), and [interfaces-and-abstract-classes](../../software-engineering/csharp-and-dotnet/04-interfaces-and-abstract-classes/README.md). If you want to run it in isolation, scaffold a console app and replace `Program.cs`.

**Done when:**
1. `TinyAgent.cs` contains `ILlm`, `StubLlm`, a `CountLines` tool, a goal, and a 3-iteration loop.
2. Each iteration prints the chosen action and resulting observation or final answer.
3. The file is saved under `progress/2026-05-28/working-folder/agentic-workflows/`.

- [ ] Mark this item complete here AND in `progress/sprints/2026-04-30/items.md` when finished.

---

When you finish all of today's items, check the boxes and re-run `/daily-tasks` for the next slice (if you have time today). Or pick this up tomorrow.

## Notes

_(Free space — jot insights, blockers, things to revisit. Persists across rounds today.)_
