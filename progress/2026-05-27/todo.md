# 2026-05-27 — Today's slice

> **Active sprint:** [progress/sprints/2026-04-30/sprint.md](../sprints/2026-04-30/sprint.md)
> **Sprint progress:** 1 of 13 items complete · 11 remaining after today's slice
> **Working folder:** `progress/2026-05-27/working-folder/agentic-workflows/` (scaffolded; gitignored)

## 📚 Today's reading (2026-05-27)

Three short reads to keep the learning loop alive even when the sprint item is heavy. The source link goes to the site's archive — click it if you want deeper resources beyond the single article we picked today.

1. **[How Airtable Built the Search Layer Behind Their AI Features](https://blog.bytebytego.com/p/how-airtable-built-the-search-layer)** — via [ByteByteGo](https://blog.bytebytego.com/)
   Airtable's vector search system using Milvus with hierarchical partitioning, HNSW indexing, and hot/cold data management to enable semantic search across millions of customer databases.

2. **[Kafka 101](https://highscalability.com/untitled-2/)** — via [High Scalability](https://highscalability.com/)
   A comprehensive guide to Kafka's architecture: how it handles millions of messages per second through optimized log structures, persistence strategies, and KRaft consensus.

3. **[How Vercel Cut Build Wait Times From 90 Seconds To 5](https://blog.bytebytego.com/p/how-vercel-cut-build-wait-times-from)** — via [ByteByteGo](https://blog.bytebytego.com/)
   How Vercel built Hive, a deployment platform using Firecracker microVMs for adversarial isolation, optimized cold starts, and warm cell pools — cutting build provisioning time by 95% while keeping security guarantees.

## 🧪 Stretch prompt (2026-05-27)

Adjacent-territory research — deliberately unrelated to today's reading and sprint item. ~15–30 min of research, ~300–500 words of your own writing.

**Question:** What is consistent hashing, what specific problem does it solve that plain `hash(key) % N` does not, and how do real systems use it?

**Why this matters:** Consistent hashing is the backbone of how distributed caches, databases, and load balancers spread keys across nodes while keeping rebalancing cheap when a node joins or leaves — a foundational idea you'll keep running into in system design.

**Angles to cover:**
- Walk through the failure of naive modulo hashing: what happens to cached keys when `N` changes from 4 nodes to 5?
- Explain the hash ring and how a key maps to a node; then explain virtual nodes (vnodes) and what problem they fix.
- Name 2–3 real systems that use it (e.g., Amazon Dynamo, Cassandra, memcached clients, CDNs) and one concrete trade-off or limitation.

**Write your response in** [`stretch-prompt.md`](stretch-prompt.md) — it's tracked, so your writeups accumulate into a portfolio of thinking over time.

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
