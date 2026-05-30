# Stretch prompt log

Every stretch research prompt surfaced by `/daily-tasks`, chronological (most recent first). The skill reads the most recent 14 entries to avoid repeating themes/questions.

## 2026-05-30 — Networking

What is head-of-line blocking, how does it show up at both the TCP layer and the HTTP/2 layer, and why did HTTP/3 move to QUIC over UDP to fix it?

## 2026-05-29 — Compilers and language runtimes

How does a generational garbage collector work, and why does the "weak generational hypothesis" make collecting the young generation far cheaper than scanning the whole heap?

## 2026-05-28 — Operating systems

When a process memory-maps a file, what work do the OS page cache and page tables each do, and why can `mmap` outperform repeated `read()` calls for some workloads but backfire for others?

## 2026-05-27 — Distributed systems fundamentals

What is consistent hashing, what specific problem does it solve that plain `hash(key) % N` does not, and how do real systems use it?
