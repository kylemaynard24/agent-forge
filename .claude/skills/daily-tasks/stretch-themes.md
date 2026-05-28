# Stretch prompt themes

The `/daily-tasks` skill picks one theme from this list each day and generates a research question within it. The question must NOT overlap with today's reading list or today's sprint item — the goal is adjacent territory, not reinforcement.

Edit this list to bias future prompts: add themes you want more of, remove ones you've covered enough, reorder to influence which gets picked when the recency check kicks in.

## Themes

- **Distributed systems fundamentals** — consistent hashing, CAP theorem, consensus (Paxos/Raft), replication strategies, partitioning, vector clocks, logical time
- **Database internals** — storage engines (LSM vs B-tree), WAL, MVCC, isolation levels, indexes, query planners, transaction managers
- **Concurrency** — locks, lock-free structures, optimistic vs pessimistic concurrency, deadlock detection, memory models, actors vs CSP
- **Operating systems** — processes vs threads, IPC, virtual memory, page tables, schedulers, file systems, syscalls
- **Networking** — TCP internals, UDP use cases, HTTP/1 → /2 → /3 evolution, TLS handshake, DNS, load balancing approaches
- **Performance** — latency vs throughput, queuing theory (Little's law), tail latencies, batching, backpressure, caching hierarchies
- **System design patterns** — rate limiting, circuit breakers, bulkheads, idempotency, sagas, outbox pattern, CQRS, event sourcing
- **Compilers and language runtimes** — memory models, GC strategies (mark/sweep, generational, tracing), JIT vs AOT, optimization passes
- **Security fundamentals** — OAuth/OIDC flows, JWT pitfalls, cryptographic primitives, zero-trust, defense in depth
- **Historical / origin context** — why X protocol or system exists (e.g., why Kafka over RabbitMQ, why gRPC over REST, why Kubernetes over Mesos)

## How prompts are generated

- The skill reads the most recent 14 entries from `progress/stretch-prompt-log.md` (if present) to avoid re-picking the same theme or asking the same question twice.
- It picks a theme not used recently, then generates a focused research question within it.
- The question must NOT touch any subject covered in today's reading list or today's sprint item — that's the whole point of "stretch."
- Questions should be answerable in 300–500 words of writing after 15–30 min of research. Not a textbook chapter, not a tweet.
