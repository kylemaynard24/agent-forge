# 2026-05-29 — Today's slice

> **Active sprint:** [progress/sprints/2026-04-30/sprint.md](../sprints/2026-04-30/sprint.md)
> **Sprint progress:** 1 of 13 items complete · 11 remaining after today's slice
> **Working folder:** `progress/2026-05-29/working-folder/agentic-workflows/` (scaffolded; gitignored)

## 📚 Today's reading (2026-05-29)

Three short reads to keep the learning loop alive even when the sprint item is heavy. The source link goes to the site's archive — click it if you want deeper resources beyond the single article we picked today.

1. **[Must-Know Failure Modes in Distributed Systems](https://blog.bytebytego.com/p/must-know-failure-modes-in-distributed)** — via [ByteByteGo](https://blog.bytebytego.com/)
   A catalog of the recurring ways distributed systems break — servers that look healthy while users see errors — and the standard mitigations for each failure mode.

2. **[Brief History of Scaling Uber](https://highscalability.com/brief-history-of-scaling-uber/)** — via [High Scalability](https://highscalability.com/)
   Uber's architectural evolution from a LAMP-stack monolith through microservices, database sharding, and dispatch-system rewrites toward cloud infrastructure.

3. **[Behind AWS S3's Massive Scale](https://highscalability.com/behind-aws-s3s-massive-scale/)** — via [High Scalability](https://highscalability.com/)
   A look inside S3's 300+ microservices, its ShardStore storage fleet, erasure-coding replication, and how it manages IOPS constraints across millions of drives.

_Couldn't reach Quastor or Dev Interrupted today, and Architecture Notes returned only weekly roundups — so today's three come from ByteByteGo and High Scalability._

## 🧪 Stretch prompt (2026-05-29)

Adjacent-territory research — deliberately unrelated to today's reading and sprint item. ~15–30 min of research, ~300–500 words of your own writing.

**Question:** How does a generational garbage collector work, and why does the "weak generational hypothesis" make collecting the young generation far cheaper than scanning the whole heap?

**Why this matters:** Almost every managed runtime you'll ship on — the CLR, the JVM, Go, Node — leans on generational (or generational-ish) GC. Knowing why young collections are cheap explains real-world tuning knobs, allocation-rate pauses, and why "just allocate less in the hot path" is timeless advice.

**Primer (my quick take):** The weak generational hypothesis is the empirical observation that *most objects die young* — a huge fraction of allocations become garbage almost immediately, while the few that survive tend to live a long time. A generational collector exploits this by splitting the heap into a small young generation (frequent, fast "minor" collections) and a larger old generation (rare "major" collections). Because the young gen is small and mostly garbage, a minor GC only has to copy the handful of survivors out, so it reclaims the bulk of memory while touching a fraction of the heap. The catch is tracking old→young pointers (via a write barrier / remembered set) so the collector can scan only the young gen without missing live references.

**Angles to cover:**
- State the weak generational hypothesis and why it holds in practice; define young/old generations and promotion.
- Explain *why* a minor collection is cheap — copying collection of survivors, work proportional to live data not total allocated, and the role of the write barrier / remembered set for cross-generation references.
- Give 1–2 trade-offs or failure modes: promotion of mid-lived objects causing major-GC pressure, write-barrier overhead, or pathological allocation patterns that defeat the hypothesis.

**Resources to read:**
- [Introducing Generational ZGC — Inside.java](https://inside.java/2023/11/28/gen-zgc-explainer/) — The OpenJDK team's own explainer on why they made ZGC generational, with a clear motivation for the hypothesis.
- [Generations — Oracle HotSpot GC Tuning Guide](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/generations.html) — The canonical vendor doc describing young/old generations, minor vs major collections, and promotion.
- [A deep dive into Java garbage collectors — Datadog](https://www.datadoghq.com/blog/understanding-java-gc/) — A well-regarded engineering explainer comparing real collectors and how generational design shapes their pause behavior.

**Write your response in** [`stretch-prompt.md`](stretch-prompt.md) — it's tracked, so your writeups accumulate into a portfolio of thinking over time.

## Round 1 (~90 min)

### S-02: Build `TinyAgent.cs`

**Time:** ~90 min · **Subject:** Agentic workflows · **Sprint section:** "Agentic workflows" in [sprint.md](../sprints/2026-04-30/sprint.md)

> Carried forward from the 2026-05-28 slice (originally assigned 2026-05-01). The 252-line `what-is-an-agent` README is the conceptual anchor for this build — S-02 is where you make the four-piece anatomy (LLM + tools + loop + goal) concrete in code.

Build `TinyAgent.cs` in `progress/2026-05-29/working-folder/agentic-workflows/` as a tiny C# version of the four-piece agent anatomy. Include:
- An `ILlm` interface (single method that takes the conversation/context and returns the next action to take).
- A `StubLlm` implementation that returns canned next actions (no real model call — hardcode the sequence so you can see the loop work end-to-end).
- One concrete tool: `CountLines(path)` that reads a file and returns its line count.
- A loop capped at 3 iterations, with a goal string passed into the agent. Each iteration: ask the LLM "what now?", execute the chosen action, feed the observation back. Print each step so you can watch the loop ask → act → observe.

Keep it intentionally small — about 50 lines is enough if you focus on the anatomy rather than polish. If you want a refresher on the abstractions, see [what-is-an-agent](../../agentic-workflows/01-foundations/what-is-an-agent/README.md), [classes-basics](../../software-engineering/csharp-and-dotnet/01-classes-basics/README.md), and [interfaces-and-abstract-classes](../../software-engineering/csharp-and-dotnet/04-interfaces-and-abstract-classes/README.md). If you want to run it in isolation, scaffold a console app and replace `Program.cs`.

**Done when:**
1. `TinyAgent.cs` contains `ILlm`, `StubLlm`, a `CountLines` tool, a goal, and a 3-iteration loop.
2. Each iteration prints the chosen action and resulting observation or final answer.
3. The file is saved under `progress/2026-05-29/working-folder/agentic-workflows/`.

- [ ] Mark this item complete here AND in `progress/sprints/2026-04-30/items.md` when finished.

---

When you finish all of today's items, check the boxes and re-run `/daily-tasks` for the next slice (if you have time today). Or pick this up tomorrow.

## Notes

_(Free space — jot insights, blockers, things to revisit. Persists across rounds today.)_
