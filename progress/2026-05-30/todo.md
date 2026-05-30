# 2026-05-30 — Today's slice

> **Active sprint:** [progress/sprints/2026-04-30/sprint.md](../sprints/2026-04-30/sprint.md)
> **Sprint progress:** 1 of 13 items complete · 11 remaining after today's slice
> **Working folder:** `progress/2026-05-30/working-folder/agentic-workflows/` (scaffolded; gitignored)

## 📚 Today's reading (2026-05-30)

Three short reads to keep the learning loop alive even when the sprint item is heavy. The source link goes to the site's archive — click it if you want deeper resources beyond the single article we picked today.

1. **[Kafka 101](https://highscalability.com/untitled-2/)** — via [High Scalability](https://highscalability.com/)
   How Kafka pushes millions of messages/sec through an append-only log: persistence strategy, replication, and the move from ZooKeeper to KRaft consensus.

2. **[How Airtable Built the Search Layer Behind Their AI Features](https://blog.bytebytego.com/p/how-airtable-built-the-search-layer)** — via [ByteByteGo](https://blog.bytebytego.com/)
   Airtable's semantic search over millions of isolated customer bases using Milvus, HNSW indexing, hierarchical partitioning, and hot/cold data management.

3. **[How Vercel Cut Build Wait Times From 90 Seconds To 5](https://blog.bytebytego.com/p/how-vercel-cut-build-wait-times-from)** — via [ByteByteGo](https://blog.bytebytego.com/)
   Vercel's Hive platform: Firecracker microVMs for adversarial isolation, optimized cold starts, and a warm pool of pre-booted cells for an 18x build speedup.

_Thin fetch today: Quastor 403'd, Dev Interrupted only had eng-leadership posts (not deep technical), and Architecture Notes returned only weekly roundups. So today's three are catalog revisits from the 2026-05-27 list — all strong reads worth a second pass._

## 🧪 Stretch prompt (2026-05-30)

Adjacent-territory research — deliberately unrelated to today's reading and sprint item. ~15–30 min of research, ~300–500 words of your own writing.

**Question:** What is head-of-line blocking, how does it show up at both the TCP layer and the HTTP/2 layer, and why did HTTP/3 move to QUIC over UDP to fix it?

**Why this matters:** This is the clearest worked example of why "a higher layer can't outrun a limitation baked into the layer below it." HTTP/2 multiplexed requests but still sat on TCP's in-order byte stream — so it couldn't escape transport-level blocking. Understanding this explains real latency cliffs on lossy/mobile networks and why QUIC exists at all.

**Primer (my quick take):** Head-of-line (HOL) blocking is when the first item in a queue stalls everything behind it, even when those later items are ready. HTTP/1.1 had it at the request level (one slow response blocks the connection). HTTP/2 fixed *application-level* HOL by multiplexing many streams over one connection — but all those streams still ride a single TCP byte stream, and TCP guarantees in-order delivery. So one lost packet makes TCP withhold *all* later bytes (including bytes for unrelated streams) until the retransmit arrives — transport-level HOL blocking that HTTP/2 can't see or avoid. HTTP/3 drops TCP for QUIC (built on UDP), which tracks streams independently, so a lost packet only stalls its own stream, not the others.

**Angles to cover:**
- Define HOL blocking and trace it across HTTP/1.1 (request-level) → HTTP/2 (solved at app layer) → still-present TCP transport-level blocking.
- Explain *why* TCP's in-order delivery guarantee forces the block, and how QUIC's per-stream delivery sidesteps it.
- Give 1–2 caveats: QUIC still has some HOL within a single stream, plus the cost/tradeoffs of moving reliability + congestion control into user space over UDP.

**Resources to read:**
- [TCP head-of-line blocking — HTTP/3 explained (haxx.se)](https://http3-explained.haxx.se/en/why-quic/why-tcphol) — From Daniel Stenberg (curl author); the canonical, concise explanation of the TCP-level problem QUIC solves.
- [Head-of-Line Blocking in QUIC and HTTP/3: The Details — Web Performance Calendar](https://calendar.perfplanet.com/2020/head-of-line-blocking-in-quic-and-http-3-the-details/) — Robin Marx's deep, precise treatment, including where QUIC still has residual HOL blocking.
- [HTTP/3 vs. HTTP/2: A detailed comparison — Catchpoint](https://www.catchpoint.com/http3-vs-http2) — A readable engineering comparison that grounds the theory in real performance differences.

**Write your response in** [`stretch-prompt.md`](stretch-prompt.md) — it's tracked, so your writeups accumulate into a portfolio of thinking over time.

## Round 1 (~90 min)

### S-02: Build `TinyAgent.cs`

**Time:** ~90 min · **Subject:** Agentic workflows · **Sprint section:** "Agentic workflows" in [sprint.md](../sprints/2026-04-30/sprint.md)

> Carried forward from the 2026-05-29 slice (originally assigned 2026-05-01). The 252-line `what-is-an-agent` README is the conceptual anchor for this build — S-02 is where you make the four-piece anatomy (LLM + tools + loop + goal) concrete in code.

Build `TinyAgent.cs` in `progress/2026-05-30/working-folder/agentic-workflows/` as a tiny C# version of the four-piece agent anatomy. Include:
- An `ILlm` interface (single method that takes the conversation/context and returns the next action to take).
- A `StubLlm` implementation that returns canned next actions (no real model call — hardcode the sequence so you can see the loop work end-to-end).
- One concrete tool: `CountLines(path)` that reads a file and returns its line count.
- A loop capped at 3 iterations, with a goal string passed into the agent. Each iteration: ask the LLM "what now?", execute the chosen action, feed the observation back. Print each step so you can watch the loop ask → act → observe.

Keep it intentionally small — about 50 lines is enough if you focus on the anatomy rather than polish. If you want a refresher on the abstractions, see [what-is-an-agent](../../agentic-workflows/01-foundations/what-is-an-agent/README.md), [classes-basics](../../software-engineering/csharp-and-dotnet/01-classes-basics/README.md), and [interfaces-and-abstract-classes](../../software-engineering/csharp-and-dotnet/04-interfaces-and-abstract-classes/README.md). If you want to run it in isolation, scaffold a console app and replace `Program.cs`.

**Done when:**
1. `TinyAgent.cs` contains `ILlm`, `StubLlm`, a `CountLines` tool, a goal, and a 3-iteration loop.
2. Each iteration prints the chosen action and resulting observation or final answer.
3. The file is saved under `progress/2026-05-30/working-folder/agentic-workflows/`.

- [ ] Mark this item complete here AND in `progress/sprints/2026-04-30/items.md` when finished.

---

When you finish all of today's items, check the boxes and re-run `/daily-tasks` for the next slice (if you have time today). Or pick this up tomorrow.

## Notes

_(Free space — jot insights, blockers, things to revisit. Persists across rounds today.)_
