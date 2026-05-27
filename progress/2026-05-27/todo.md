# 2026-05-27 — Today's slice

> **Active sprint:** [progress/sprints/2026-04-30/sprint.md](../sprints/2026-04-30/sprint.md)
> **Sprint progress:** 1 of 13 items complete · 11 remaining after today's slice
> **Working folder:** `progress/2026-05-27/working-folder/agentic-workflows/` (scaffolded; gitignored)

## 📚 Today's reading (2026-05-27)

Three short reads to keep the learning loop alive even when the sprint item is heavy.

1. **[How Airtable Built the Search Layer Behind Their AI Features](https://blog.bytebytego.com/p/how-airtable-built-the-search-layer)** — *ByteByteGo*
   Airtable's vector search system using Milvus with hierarchical partitioning, HNSW indexing, and hot/cold data management to enable semantic search across millions of customer databases.

2. **[Kafka 101](https://highscalability.com/untitled-2/)** — *High Scalability*
   A comprehensive guide to Kafka's architecture: how it handles millions of messages per second through optimized log structures, persistence strategies, and KRaft consensus.

3. **[Arc Notes Weekly #106: Arrowhead](https://architecturenotes.co/p/arc-notes-weekly-106-arrowhead)** — *Architecture Notes*
   Covers Amazon's tightened AI code review policies after outages, the NYT scaling unit test coverage with AI, and the eight levels of agentic engineering from copilot to autonomous agent teams.

## Round 1 (~90 min)

### S-02: Build `TinyAgent.cs`

**Time:** ~90 min · **Subject:** Agentic workflows · **Sprint section:** "Agentic workflows" in [sprint.md](../sprints/2026-04-30/sprint.md)

> Carried forward from the 2026-05-17 slice (originally assigned 2026-05-01). The 252-line `what-is-an-agent` README is the conceptual anchor for this build — S-02 is where you make the four-piece anatomy (LLM + tools + loop + goal) concrete in code.

Build `TinyAgent.cs` in `progress/2026-05-27/working-folder/agentic-workflows/` as a tiny C# version of the four-piece agent anatomy. Include:
- An `ILlm` interface (single method that takes the conversation/context and returns the next action to take).
- A `StubLlm` implementation that returns canned next actions (no real model call — hardcode the sequence so you can see the loop work end-to-end).
- One concrete tool: `CountLines(path)` that reads a file and returns its line count.
- A loop capped at 3 iterations, with a goal string passed into the agent. Each iteration: ask the LLM "what now?", execute the chosen action, feed the observation back. Print each step so you can watch the loop ask → act → observe.

Keep it intentionally small — about 50 lines is enough if you focus on the anatomy rather than polish. If you want a refresher on the abstractions, see [what-is-an-agent](../../agentic-workflows/01-foundations/what-is-an-agent/README.md), [classes-basics](../../software-engineering/csharp-and-dotnet/01-classes-basics/README.md), and [interfaces-and-abstract-classes](../../software-engineering/csharp-and-dotnet/04-interfaces-and-abstract-classes/README.md). If you want to run it in isolation, scaffold a console app and replace `Program.cs`.

**Done when:**
1. `TinyAgent.cs` contains `ILlm`, `StubLlm`, a `CountLines` tool, a goal, and a 3-iteration loop.
2. Each iteration prints the chosen action and resulting observation or final answer.
3. The file is saved under `progress/2026-05-27/working-folder/agentic-workflows/`.

- [ ] Mark this item complete here AND in `progress/sprints/2026-04-30/items.md` when finished.

---

When you finish all of today's items, check the boxes and re-run `/daily-tasks` for the next slice (if you have time today). Or pick this up tomorrow.

## Notes

_(Free space — jot insights, blockers, things to revisit. Persists across rounds today.)_
