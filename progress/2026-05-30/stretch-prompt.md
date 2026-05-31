# Stretch prompt — 2026-05-30 (Networking)

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

## My response

_(Write your ~300–500 word answer here.)_
