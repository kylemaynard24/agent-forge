# Stretch prompt — 2026-05-28

**Theme:** Operating systems

**Question:** When a process memory-maps a file, what work do the OS page cache and page tables each do, and why can `mmap` outperform repeated `read()` calls for some workloads but backfire for others?

**Why this matters:** This builds intuition for how user-space code meets kernel memory management. That mental model shows up in databases, search engines, build tools, and any system that moves lots of bytes efficiently.

**Primer (my quick take):** When you `mmap` a file, the kernel wires your process's virtual address range to the file's pages in the OS page cache — but no data is read yet. The first time you touch a page, a page fault makes the kernel load it (or hand you a cached copy), and the page-table entry then lets the CPU translate your virtual address straight to that physical page. The win is skipping explicit `read()` syscalls and an extra user/kernel copy; the catch is that page faults, TLB pressure, and unpredictable writeback can make `mmap` slower or harder to reason about than plain reads for some access patterns.

**Angles to cover:**
- Explain page cache vs virtual memory vs page tables: what gets set up at `mmap` time, and what only happens on the first page fault.
- Compare `mmap` with explicit `read()` loops for sequential scans and random access, including syscalls, copies, and lazy loading.
- Give 1–2 failure modes or trade-offs, such as page-fault storms, tricky writeback behavior, or address-space pressure.

**Resources to read:**
- [Page Cache, the Affair Between Memory and Files — manybutfinite](https://manybutfinite.com/post/page-cache-the-affair-between-memory-and-files/) — A clear, diagram-driven explainer of how the page cache sits between your process and the disk.
- [How Memory Maps (mmap) Deliver 25x Faster File Access in Go — Varnish](https://info.varnish-software.com/blog/how-memory-maps-mmap-deliver-25x-faster-file-access-in-go) — A practical, benchmarked look at when mmap wins and by how much.
- [Are You Sure You Want to Use MMAP in Your DBMS? (CIDR 2022)](https://db.cs.cmu.edu/mmap-cidr2022/) — The well-known paper on exactly when mmap backfires — correctness and performance traps for data-heavy systems.

---

## My response

_(Write ~300–500 words here.)_
