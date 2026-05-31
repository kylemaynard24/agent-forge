# Research archive

The durable, human-facing record of every piece of technical reading surfaced by `/daily-tasks` — both the daily **blog reading list** and the daily **stretch-prompt resources** — together with the summaries and terminology generated for each. Newest day first.

**Why this file exists:** the daily `stretch-prompt.md` stubs are ephemeral (they get deleted when an unworked day carries forward), so the rich resource summaries + terminology would otherwise be lost. This archive keeps them permanently. It's a portfolio of technical reading to revisit, not an operational ledger — the skill still uses `reading-log.md` and `stretch-prompt-log.md` for de-duplication and recency.

---

## 2026-05-31

### 📚 Reading

1. **[How DoorDash Built a Testing System to Evaluate LLMs](https://blog.bytebytego.com/p/how-doordash-built-a-testing-system)** — via [ByteByteGo](https://blog.bytebytego.com/)
   DoorDash tackles the problem of safely iterating on an LLM support agent when deterministic testing is impossible, by building an automated "simulation and evaluation flywheel" that compresses test cycles from weeks to hours. It replays historical transcripts through an LLM-powered *customer simulator* to generate realistic multi-turn conversations, then uses a second LLM as a *calibrated judge* to grade the agent against explicit policy criteria. The payoff was concrete — a 90% reduction in hallucinations — and gains made in simulation transferred reliably to production. A blueprint for testing non-deterministic systems.

2. **[How Netflix is Using Multimodal AI to Power Video Search](https://blog.bytebytego.com/p/how-netflix-is-using-multimodal-ai)** — via [ByteByteGo](https://blog.bytebytego.com/)
   Netflix makes a huge video archive searchable with a three-stage pipeline that orchestrates specialized models (character recognition, scene classification, dialogue transcription) whose outputs arrive in different formats and time resolutions. Raw annotations land in Cassandra; an offline *temporal bucketing* step fuses the multimodal signals into one-second intervals; the enriched buckets are indexed in Elasticsearch for hybrid keyword-and-vector search. The real lesson: the hardest engineering is in the *fusion layer*, not the models — and the design deliberately trades real-time freshness for throughput.

3. **[How Snapchat Serves a Billion Predictions Per Second](https://blog.bytebytego.com/p/how-snapchat-serves-a-billion-predictions)** — via [ByteByteGo](https://blog.bytebytego.com/)
   Snapchat's "Bento" platform is built around one core asymmetry: a single user request fans out into hundreds of candidate evaluations before collapsing back into a ranked feed. It splits work into two stages — cheap *retrieval* trims millions of candidates to thousands, then expensive *ranking* models score those within a hard ~100ms latency budget. The standout insight: the "boring machinery" of serialization and feature handling often dominates cost more than the model math, and *latency*, not raw prediction volume, drives the deepest architectural choices at scale.

_Stretch prompt: the 2026-05-30 Networking prompt (head-of-line blocking / QUIC) is still open and carried forward — see its entry under 2026-05-30 below._

---

## 2026-05-30

### 📚 Reading

1. **[Kafka 101](https://highscalability.com/untitled-2/)** — via [High Scalability](https://highscalability.com/)
   Traces Kafka from LinkedIn's need for a centralized event-streaming backbone to its modern architecture, built on immutable append-only logs with O(1) access and leader-based replication. The throughput trick is that Kafka writes everything to disk and leans on OS-level pagecache, read-ahead, and write-behind batching — turning sequential disk I/O into a feature rather than a bottleneck. It also covers the recent shift from ZooKeeper to KRaft (Kafka's own Raft consensus) for metadata, plus tiered storage. The clearest mental model for *why* Kafka's design choices win at scale.

2. **[How Airtable Built the Search Layer Behind Their AI Features](https://blog.bytebytego.com/p/how-airtable-built-the-search-layer)** — via [ByteByteGo](https://blog.bytebytego.com/)
   A case study in how real usage patterns — not generic optimization — should drive your architecture. Airtable runs semantic search on Milvus with aggressive hierarchical partitioning (≈400 collections × 1,000 partitions per cluster) and HNSW indexing for the latency/recall tradeoff. The key insight: since only ~25% of customer bases are touched in a given week, memory-hungry HNSW only becomes viable through cold-data offloading and tiering.

3. **[How Vercel Cut Build Wait Times From 90 Seconds To 5](https://blog.bytebytego.com/p/how-vercel-cut-build-wait-times-from)** — via [ByteByteGo](https://blog.bytebytego.com/)
   Vercel's "Hive" platform cut build provisioning from 90s to 5s by running each build in an ephemeral Firecracker microVM (wrapping a Docker container) for VM-level isolation at near-container speed. The 18x win compounds three things: faster cold boots via image caching + snapshotting, a warm pool of pre-booted idle cells, and Firecracker's ~125ms boot time. The deeper lesson: treating hostile multi-tenancy as a *foundational* constraint rather than bolting security on later.

### 🧪 Stretch prompt — Networking

**Question:** What is head-of-line blocking, how does it show up at both the TCP layer and the HTTP/2 layer, and why did HTTP/3 move to QUIC over UDP to fix it?

**Resources:**
- [TCP head-of-line blocking — HTTP/3 explained (haxx.se)](https://http3-explained.haxx.se/en/why-quic/why-tcphol) — From the curl/HTTP-stack world; the canonical, concise explanation of the TCP-level problem. Walks through how HTTP/2 multiplexing over a *single* TCP connection becomes a liability: one lost packet stalls the whole connection (all streams) until retransmission. Memorable practical detail — at ~2% packet loss, HTTP/1 with its multiple connections can actually outperform HTTP/2, because losses are spread across connections instead of blocking one shared pipe.
- [Head-of-Line Blocking in QUIC and HTTP/3: The Details — Web Performance Calendar](https://calendar.perfplanet.com/2020/head-of-line-blocking-in-quic-and-http-3-the-details/) — Robin Marx's rigorous, myth-busting deep dive. Traces HOL blocking across all three generations (HTTP/1.1 app-layer → HTTP/2 solves that but exposes TCP transport-layer → QUIC makes streams transport-aware), then argues that **removing transport HOL blocking "probably won't help all that much"** for real web performance, since optimal resource delivery is often sequential anyway. Read for the nuance most explainers skip — including where QUIC *still* has residual HOL blocking.
- [HTTP/3 vs. HTTP/2: A detailed comparison — Catchpoint](https://www.catchpoint.com/http3-vs-http2) — A breadth-first engineering comparison across seven dimensions: transport (TCP vs QUIC), multiplexing, connection setup, encryption, error recovery, server push, and network mobility. Best for situating HOL blocking among QUIC's *other* wins — faster handshakes, 0-RTT resumption, and connection migration. Includes practical code/implementation notes.

**Terminology:**
- **Head-of-line (HOL) blocking** — when the first item in a queue stalls everything behind it, even though the later items are ready to go.
- **Multiplexing** — carrying many independent logical streams (requests/responses) over a single connection at once.
- **In-order / reliable delivery** — TCP's guarantee that bytes are handed to the app in the exact order sent; the reason a single gap forces TCP to wait.
- **Packet loss & retransmission** — a dropped packet must be resent; TCP withholds all later bytes until the missing one arrives (the root of transport-layer HOL blocking).
- **QUIC** — "Quick UDP Internet Connections"; a transport built on UDP that implements its own reliability, ordering, and congestion control, with streams tracked independently.
- **Stream independence (transport-aware streams)** — QUIC knows which bytes belong to which stream, so a loss in one stream doesn't block delivery of the others.
- **Round-trip time (RTT) / 0-RTT** — latency of one network round trip; 0-RTT lets a *resumed* QUIC connection send application data in the very first packet, with no handshake wait.
- **Connection migration** — QUIC's ability to keep a connection alive across a network change (e.g., Wi-Fi → cellular) by identifying it with a connection ID rather than the IP/port 4-tuple.

---

## 2026-05-29

### 📚 Reading

1. **[Must-Know Failure Modes in Distributed Systems](https://blog.bytebytego.com/p/must-know-failure-modes-in-distributed)** — via [ByteByteGo](https://blog.bytebytego.com/)
   A catalog of the recurring ways distributed systems break — servers that look healthy while users see errors — and the standard mitigations for each failure mode.

2. **[Brief History of Scaling Uber](https://highscalability.com/brief-history-of-scaling-uber/)** — via [High Scalability](https://highscalability.com/)
   Uber's architectural evolution from a LAMP-stack monolith through microservices, database sharding, and dispatch-system rewrites toward cloud infrastructure.

3. **[Behind AWS S3's Massive Scale](https://highscalability.com/behind-aws-s3s-massive-scale/)** — via [High Scalability](https://highscalability.com/)
   A look inside S3's 300+ microservices, its ShardStore storage fleet, erasure-coding replication, and how it manages IOPS constraints across millions of drives.

### 🧪 Stretch prompt — Compilers and language runtimes

**Question:** How does a generational garbage collector work, and why does the "weak generational hypothesis" make collecting the young generation far cheaper than scanning the whole heap?

**Resources:**
- [Introducing Generational ZGC — Inside.java](https://inside.java/2023/11/28/gen-zgc-explainer/) — The OpenJDK team's own explainer on why they made ZGC generational, with a clear motivation for the hypothesis.
- [Generations — Oracle HotSpot GC Tuning Guide](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/generations.html) — The canonical vendor doc describing young/old generations, minor vs major collections, and promotion.
- [A deep dive into Java garbage collectors — Datadog](https://www.datadoghq.com/blog/understanding-java-gc/) — A well-regarded engineering explainer comparing real collectors and how generational design shapes their pause behavior.

_(Terminology lists were not yet captured on this day — the feature started 2026-05-30.)_

---

## 2026-05-28

### 📚 Reading

1. **[How CockroachDB Built Vector Indexing at Scale](https://blog.bytebytego.com/p/how-cockroachdb-built-vector-indexing)** — via [ByteByteGo](https://blog.bytebytego.com/)
   How CockroachDB added vector indexing to a distributed SQL database and worked through the tradeoffs needed to make nearest-neighbor search fit a multi-tenant system.

2. **[Capturing A Billion Emo(j)i-ons](https://highscalability.com/capturing-a-billion-emo-j-i-ons/)** — via [High Scalability](https://highscalability.com/)
   Hotstar's real-time emoji pipeline: high-throughput ingestion, Kafka-backed async processing, and the design choices that let a fan-engagement feature absorb billions of events.

3. **[EP216: RAGs vs Agents](https://blog.bytebytego.com/p/ep216-rags-vs-agents)** — via [ByteByteGo](https://blog.bytebytego.com/)
   A concise comparison of when retrieval is enough, when you need a tool-using loop, and what problem shape should push you toward one pattern over the other.

### 🧪 Stretch prompt — Operating systems

**Question:** When a process memory-maps a file, what work do the OS page cache and page tables each do, and why can `mmap` outperform repeated `read()` calls for some workloads but backfire for others?

**Resources:**
- [Page Cache, the Affair Between Memory and Files — manybutfinite](https://manybutfinite.com/post/page-cache-the-affair-between-memory-and-files/) — A clear, diagram-driven explainer of how the page cache sits between your process and the disk.
- [How Memory Maps (mmap) Deliver 25x Faster File Access in Go — Varnish](https://info.varnish-software.com/blog/how-memory-maps-mmap-deliver-25x-faster-file-access-in-go) — A practical, benchmarked look at when mmap wins and by how much.
- [Are You Sure You Want to Use MMAP in Your DBMS? (CIDR 2022)](https://db.cs.cmu.edu/mmap-cidr2022/) — The well-known paper on exactly when mmap backfires — correctness and performance traps for data-heavy systems.

_(Terminology lists were not yet captured on this day — the feature started 2026-05-30.)_

---

## 2026-05-27

### 📚 Reading

1. **[How Airtable Built the Search Layer Behind Their AI Features](https://blog.bytebytego.com/p/how-airtable-built-the-search-layer)** — via [ByteByteGo](https://blog.bytebytego.com/)
   Airtable's vector search system using Milvus with hierarchical partitioning, HNSW indexing, and hot/cold data management to enable semantic search across millions of customer databases.

2. **[Kafka 101](https://highscalability.com/untitled-2/)** — via [High Scalability](https://highscalability.com/)
   A comprehensive guide to Kafka's architecture: how it handles millions of messages per second through optimized log structures, persistence strategies, and KRaft consensus.

3. **[How Vercel Cut Build Wait Times From 90 Seconds To 5](https://blog.bytebytego.com/p/how-vercel-cut-build-wait-times-from)** — via [ByteByteGo](https://blog.bytebytego.com/)
   How Vercel built Hive, a deployment platform using Firecracker microVMs for adversarial isolation, optimized cold starts, and warm cell pools — cutting build provisioning time by 95% while keeping security guarantees.

### 🧪 Stretch prompt — Distributed systems fundamentals

**Question:** What is consistent hashing, what specific problem does it solve that plain `hash(key) % N` does not, and how do real systems use it?

_(Resources and terminology were not archived for this day — archiving of stretch resources started 2026-05-28, and terminology started 2026-05-30.)_
