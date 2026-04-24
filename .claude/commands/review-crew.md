---
description: Multi-agent review crew — security + perf + readability in parallel, then synthesized
---

Review the current branch with three specialist agents running in parallel.

1. **Identify changed files.** Run `git diff main...HEAD --name-only`. If the result is empty, stop and say there's nothing to review.

2. **Fan out — in a SINGLE message, spawn three agents in parallel:**
   - `security-reviewer` — pass the file list, ask for prioritized security findings
   - `perf-reviewer` — same list, performance findings
   - `readability-reviewer` — same list, clarity findings

   Parallelism matters here. Don't call them one at a time.

3. **Synthesize** once all three return, into ONE consolidated report:
   - **Blockers** — anything CRITICAL or HIGH from any reviewer
   - **Recommended fixes** — MEDIUM severity
   - **Nits** — low priority
   Deduplicate overlapping findings. Cite which reviewer(s) raised each: `[sec]`, `[perf]`, `[read]`.

4. **Verdict line** at the end: exactly one of `ship` / `fix-then-ship` / `rework`.
