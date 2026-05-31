# Reading log

Every article surfaced by `/daily-tasks`, chronological. Most recent entries at the top. `shown N×` is how many times that article has appeared as of that date. Selection is randomized; former articles can be revisited, but anything shown in the last 2 days is on cooldown to avoid back-to-back repeats.

## 2026-05-31

- **[How DoorDash Built a Testing System to Evaluate LLMs](https://blog.bytebytego.com/p/how-doordash-built-a-testing-system)** — via [ByteByteGo](https://blog.bytebytego.com/) · shown 1×
  An automated "simulation and evaluation flywheel" that compresses LLM-agent testing from weeks to hours: an LLM customer-simulator replays historical transcripts into multi-turn conversations, and a calibrated LLM judge grades against policy criteria. Cut hallucinations 90%, with simulation gains transferring to production. A blueprint for testing non-deterministic systems.
- **[How Netflix is Using Multimodal AI to Power Video Search](https://blog.bytebytego.com/p/how-netflix-is-using-multimodal-ai)** — via [ByteByteGo](https://blog.bytebytego.com/) · shown 1×
  A three-stage pipeline orchestrating specialized models (character recognition, scene classification, dialogue transcription); raw annotations in Cassandra, offline temporal bucketing into one-second intervals, then Elasticsearch for hybrid keyword+vector search. The hard part is the fusion layer, and it trades real-time freshness for throughput.
- **[How Snapchat Serves a Billion Predictions Per Second](https://blog.bytebytego.com/p/how-snapchat-serves-a-billion-predictions)** — via [ByteByteGo](https://blog.bytebytego.com/) · shown 1×
  Snapchat's "Bento" platform: each request fans out to hundreds of candidates, split into cheap retrieval (millions→thousands) then expensive ranking within a ~100ms budget. The "boring machinery" of serialization/feature handling dominates cost, and latency — not prediction volume — drives the architecture.

## 2026-05-30

- **[Kafka 101](https://highscalability.com/untitled-2/)** — via [High Scalability](https://highscalability.com/) · shown 2×
  Traces Kafka from LinkedIn's event-streaming need to its modern design: immutable append-only logs with O(1) access, leader-based replication, and disk-first throughput via OS pagecache/read-ahead/write-behind. Also covers the ZooKeeper→KRaft consensus shift and tiered storage. The clearest mental model for why Kafka's design wins at scale.
- **[How Airtable Built the Search Layer Behind Their AI Features](https://blog.bytebytego.com/p/how-airtable-built-the-search-layer)** — via [ByteByteGo](https://blog.bytebytego.com/) · shown 2×
  How usage patterns drive architecture: semantic search on Milvus with hierarchical partitioning (~400 collections × 1,000 partitions) and HNSW indexing, made viable by offloading cold data since only ~25% of bases are touched weekly. A concrete "match the system to the workload" lesson.
- **[How Vercel Cut Build Wait Times From 90 Seconds To 5](https://blog.bytebytego.com/p/how-vercel-cut-build-wait-times-from)** — via [ByteByteGo](https://blog.bytebytego.com/) · shown 2×
  Vercel's Hive cut build provisioning 90s→5s with ephemeral Firecracker microVMs (wrapping Docker) for VM-level isolation at container speed. The 18x win compounds image caching/snapshotting, a warm pool of pre-booted cells, and ~125ms Firecracker boots — treating hostile multi-tenancy as a foundational constraint.

## 2026-05-29

- **[Must-Know Failure Modes in Distributed Systems](https://blog.bytebytego.com/p/must-know-failure-modes-in-distributed)** — via [ByteByteGo](https://blog.bytebytego.com/) · shown 1×
  A catalog of the recurring ways distributed systems break — servers that look healthy while users see errors — and the standard mitigations for each failure mode.
- **[Brief History of Scaling Uber](https://highscalability.com/brief-history-of-scaling-uber/)** — via [High Scalability](https://highscalability.com/) · shown 1×
  Uber's architectural evolution from a LAMP-stack monolith through microservices, database sharding, and dispatch-system rewrites toward cloud infrastructure.
- **[Behind AWS S3's Massive Scale](https://highscalability.com/behind-aws-s3s-massive-scale/)** — via [High Scalability](https://highscalability.com/) · shown 1×
  A look inside S3's 300+ microservices, its ShardStore storage fleet, erasure-coding replication, and how it manages IOPS constraints across millions of drives.

## 2026-05-28

- **[How CockroachDB Built Vector Indexing at Scale](https://blog.bytebytego.com/p/how-cockroachdb-built-vector-indexing)** — via [ByteByteGo](https://blog.bytebytego.com/) · shown 1×
  How CockroachDB added vector indexing to a distributed SQL database and worked through the tradeoffs needed to make nearest-neighbor search fit a multi-tenant system.
- **[Capturing A Billion Emo(j)i-ons](https://highscalability.com/capturing-a-billion-emo-j-i-ons/)** — via [High Scalability](https://highscalability.com/) · shown 1×
  Hotstar's real-time emoji pipeline: high-throughput ingestion, Kafka-backed async processing, and the design choices that let a fan-engagement feature absorb billions of events.
- **[EP216: RAGs vs Agents](https://blog.bytebytego.com/p/ep216-rags-vs-agents)** — via [ByteByteGo](https://blog.bytebytego.com/) · shown 1×
  A concise comparison of when retrieval is enough, when you need a tool-using loop, and what problem shape should push you toward one pattern over the other.

## 2026-05-27

- **[How Airtable Built the Search Layer Behind Their AI Features](https://blog.bytebytego.com/p/how-airtable-built-the-search-layer)** — via [ByteByteGo](https://blog.bytebytego.com/) · shown 1×
  Airtable's vector search system using Milvus with hierarchical partitioning, HNSW indexing, and hot/cold data management to enable semantic search across millions of customer databases.
- **[Kafka 101](https://highscalability.com/untitled-2/)** — via [High Scalability](https://highscalability.com/) · shown 1×
  A comprehensive guide to Kafka's architecture: how it handles millions of messages per second through optimized log structures, persistence strategies, and KRaft consensus.
- **[How Vercel Cut Build Wait Times From 90 Seconds To 5](https://blog.bytebytego.com/p/how-vercel-cut-build-wait-times-from)** — via [ByteByteGo](https://blog.bytebytego.com/) · shown 1×
  How Vercel built Hive, a deployment platform using Firecracker microVMs for adversarial isolation, optimized cold starts, and warm cell pools — cutting build provisioning time by 95% while keeping security guarantees.
