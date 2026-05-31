# 2026-05-31 — Today's slice

> **Active sprint:** [progress/sprints/2026-04-30/sprint.md](../sprints/2026-04-30/sprint.md)
> **Sprint progress:** 1 of 13 items complete · 11 remaining after today's slice
> **Working folder:** `progress/2026-05-31/working-folder/agentic-workflows/` (scaffolded; gitignored)

## 📚 Today's reading (2026-05-31)

Three short reads to keep the learning loop alive even when the sprint item is heavy. The source link goes to the site's archive — click it if you want deeper resources beyond the single article we picked today.

1. **[How DoorDash Built a Testing System to Evaluate LLMs](https://blog.bytebytego.com/p/how-doordash-built-a-testing-system)** — via [ByteByteGo](https://blog.bytebytego.com/)
   DoorDash tackles the problem of safely iterating on an LLM support agent when deterministic testing is impossible, by building an automated "simulation and evaluation flywheel" that compresses test cycles from weeks to hours. It replays historical transcripts through an LLM-powered *customer simulator* to generate realistic multi-turn conversations, then uses a second LLM as a *calibrated judge* to grade the agent against explicit policy criteria. The payoff was concrete — a 90% reduction in hallucinations — and, crucially, gains made in simulation transferred reliably to production. Worth reading as a blueprint for testing non-deterministic systems.

2. **[How Netflix is Using Multimodal AI to Power Video Search](https://blog.bytebytego.com/p/how-netflix-is-using-multimodal-ai)** — via [ByteByteGo](https://blog.bytebytego.com/)
   Netflix makes a huge video archive searchable with a three-stage pipeline that orchestrates specialized models (character recognition, scene classification, dialogue transcription) whose outputs arrive in different formats and time resolutions. Raw annotations land in Cassandra; an offline *temporal bucketing* step fuses the multimodal signals into one-second intervals; the enriched buckets are indexed in Elasticsearch for hybrid keyword-and-vector search. The real lesson: the hardest engineering is in the *fusion layer*, not the models — and the design deliberately trades real-time freshness for throughput.

3. **[How Snapchat Serves a Billion Predictions Per Second](https://blog.bytebytego.com/p/how-snapchat-serves-a-billion-predictions)** — via [ByteByteGo](https://blog.bytebytego.com/)
   Snapchat's "Bento" platform is built around one core asymmetry: a single user request fans out into hundreds of candidate evaluations before collapsing back into a ranked feed. It splits work into two stages — cheap *retrieval* trims millions of candidates to thousands, then expensive *ranking* models score those within a hard ~100ms latency budget. The standout insight is that the "boring machinery" of serialization and feature handling often dominates cost more than the model math, and that *latency*, not raw prediction volume, drives the deepest architectural choices at scale.

## 🧪 Stretch prompt (2026-05-31)

⏳ Carried forward since `2026-05-30` — still open. This one stays until you write your response; it's meant to be hard.

Adjacent-territory research — deliberately unrelated to today's reading and sprint item. ~15–30 min of research, ~300–500 words of your own writing.

**Question:** What is head-of-line blocking, how does it show up at both the TCP layer and the HTTP/2 layer, and why did HTTP/3 move to QUIC over UDP to fix it?

**Why this matters:** This is the clearest worked example of why "a higher layer can't outrun a limitation baked into the layer below it." HTTP/2 multiplexed requests but still sat on TCP's in-order byte stream — so it couldn't escape transport-level blocking. Understanding this explains real latency cliffs on lossy/mobile networks and why QUIC exists at all.

**Primer (my quick take):** Head-of-line (HOL) blocking is when the first item in a queue stalls everything behind it, even when those later items are ready. HTTP/1.1 had it at the request level (one slow response blocks the connection). HTTP/2 fixed *application-level* HOL by multiplexing many streams over one connection — but all those streams still ride a single TCP byte stream, and TCP guarantees in-order delivery. So one lost packet makes TCP withhold *all* later bytes (including bytes for unrelated streams) until the retransmit arrives — transport-level HOL blocking that HTTP/2 can't see or avoid. HTTP/3 drops TCP for QUIC (built on UDP), which tracks streams independently, so a lost packet only stalls its own stream, not the others.

**Angles to cover:**
- Define HOL blocking and trace it across HTTP/1.1 (request-level) → HTTP/2 (solved at app layer) → still-present TCP transport-level blocking.
- Explain *why* TCP's in-order delivery guarantee forces the block, and how QUIC's per-stream delivery sidesteps it.
- Give 1–2 caveats: QUIC still has some HOL within a single stream, plus the cost/tradeoffs of moving reliability + congestion control into user space over UDP.

**Resources to read:**
- [TCP head-of-line blocking — HTTP/3 explained (haxx.se)](https://http3-explained.haxx.se/en/why-quic/why-tcphol) — From the curl/HTTP-stack world; the canonical, concise explanation of the TCP-level problem. Walks through how HTTP/2 multiplexing over a *single* TCP connection becomes a liability: one lost packet stalls the whole connection (all streams) until retransmission. Memorable practical detail — at ~2% packet loss, HTTP/1 with its multiple connections can actually outperform HTTP/2, because losses are spread across connections instead of blocking one shared pipe. Sets up exactly why QUIC's per-stream independence matters.
- [Head-of-Line Blocking in QUIC and HTTP/3: The Details — Web Performance Calendar](https://calendar.perfplanet.com/2020/head-of-line-blocking-in-quic-and-http-3-the-details/) — Robin Marx's rigorous, myth-busting deep dive. Traces HOL blocking across all three generations (HTTP/1.1 app-layer → HTTP/2 solves that but exposes TCP transport-layer → QUIC makes streams transport-aware), then makes the contrarian argument that **removing transport HOL blocking "probably won't help all that much"** for real web performance, since optimal resource delivery is often sequential anyway. Read this one for the nuance most explainers skip — including where QUIC *still* has residual HOL blocking.
- [HTTP/3 vs. HTTP/2: A detailed comparison — Catchpoint](https://www.catchpoint.com/http3-vs-http2) — A breadth-first engineering comparison across seven dimensions: transport (TCP vs QUIC), multiplexing, connection setup, encryption, error recovery, server push, and network mobility. Lighter on the HOL-blocking theory than the other two, but the best for situating HOL blocking among QUIC's *other* wins — faster handshakes, 0-RTT resumption, and connection migration. Includes practical code/implementation notes.

**Terminology to learn:**
- **Head-of-line (HOL) blocking** — when the first item in a queue stalls everything behind it, even though the later items are ready to go.
- **Multiplexing** — carrying many independent logical streams (requests/responses) over a single connection at once.
- **In-order / reliable delivery** — TCP's guarantee that bytes are handed to the app in the exact order sent; the reason a single gap forces TCP to wait.
- **Packet loss & retransmission** — a dropped packet must be resent; TCP withholds all later bytes until the missing one arrives (the root of transport-layer HOL blocking).
- **QUIC** — "Quick UDP Internet Connections"; a transport built on UDP that implements its own reliability, ordering, and congestion control, with streams tracked independently.
- **Stream independence (transport-aware streams)** — QUIC knows which bytes belong to which stream, so a loss in one stream doesn't block delivery of the others.
- **Round-trip time (RTT) / 0-RTT** — latency of one network round trip; 0-RTT lets a *resumed* QUIC connection send application data in the very first packet, with no handshake wait.
- **Connection migration** — QUIC's ability to keep a connection alive across a network change (e.g., Wi-Fi → cellular) by identifying it with a connection ID rather than the IP/port 4-tuple.

**Write your response in** [`stretch-prompt.md`](stretch-prompt.md) — it's tracked, so your writeups accumulate into a portfolio of thinking over time.

## Round 1 (~90 min)

### S-02: Build `TinyAgent.cs`

**Time:** ~90 min · **Subject:** Agentic workflows · **Sprint section:** "Agentic workflows" in [sprint.md](../sprints/2026-04-30/sprint.md)

> Carried forward (originally assigned 2026-05-01; most recently from the 2026-05-30 slice). The 252-line `what-is-an-agent` README is the conceptual anchor for this build — S-02 is where you make the four-piece anatomy (LLM + tools + loop + goal) concrete in code.

Build `TinyAgent.cs` in `progress/2026-05-31/working-folder/agentic-workflows/` as a tiny C# version of the four-piece agent anatomy. Include:
- An `ILlm` interface (single method that takes the conversation/context and returns the next action to take).
- A `StubLlm` implementation that returns canned next actions (no real model call — hardcode the sequence so you can see the loop work end-to-end).
- One concrete tool: `CountLines(path)` that reads a file and returns its line count.
- A loop capped at 3 iterations, with a goal string passed into the agent. Each iteration: ask the LLM "what now?", execute the chosen action, feed the observation back. Print each step so you can watch the loop ask → act → observe.

Keep it intentionally small — about 50 lines is enough if you focus on the anatomy rather than polish. If you want a refresher on the abstractions, see [what-is-an-agent](../../agentic-workflows/01-foundations/what-is-an-agent/README.md), [classes-basics](../../software-engineering/csharp-and-dotnet/01-classes-basics/README.md), and [interfaces-and-abstract-classes](../../software-engineering/csharp-and-dotnet/04-interfaces-and-abstract-classes/README.md). If you want to run it in isolation, scaffold a console app and replace `Program.cs`.

**Done when:**
1. `TinyAgent.cs` contains `ILlm`, `StubLlm`, a `CountLines` tool, a goal, and a 3-iteration loop.
2. Each iteration prints the chosen action and resulting observation or final answer.
3. The file is saved under `progress/2026-05-31/working-folder/agentic-workflows/`.

- [ ] Mark this item complete here AND in `progress/sprints/2026-04-30/items.md` when finished.

---

When you finish all of today's items, check the boxes and re-run `/daily-tasks` for the next slice (if you have time today). Or pick this up tomorrow.

## Notes

_(Free space — jot insights, blockers, things to revisit. Persists across rounds today.)_
