# Stretch prompt — 2026-05-30 (Networking)

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

## My response

_(Write your ~300–500 word answer here.)_
