# Stretch prompt — 2026-05-28

**Theme:** Operating systems

**Question:** When a process memory-maps a file, what work do the OS page cache and page tables each do, and why can `mmap` outperform repeated `read()` calls for some workloads but backfire for others?

**Why this matters:** This builds intuition for how user-space code meets kernel memory management. That mental model shows up in databases, search engines, build tools, and any system that moves lots of bytes efficiently.

**Angles to cover:**
- Explain page cache vs virtual memory vs page tables: what gets set up at `mmap` time, and what only happens on the first page fault.
- Compare `mmap` with explicit `read()` loops for sequential scans and random access, including syscalls, copies, and lazy loading.
- Give 1–2 failure modes or trade-offs, such as page-fault storms, tricky writeback behavior, or address-space pressure.

---

## My response

_(Write ~300–500 words here.)_
