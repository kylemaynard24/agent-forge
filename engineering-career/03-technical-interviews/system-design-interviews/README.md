# System Design Interviews

A system design interview gives you an open-ended prompt — "design a URL shortener," "design a notification system," "design Twitter's feed" — and 45-60 minutes to produce a coherent architecture.

The prompt is intentionally underspecified. That is not a bug. The first thing you are being tested on is whether you know that you need more information before designing anything.

## What system design interviews measure

The interviewer is primarily checking:

- Do you ask clarifying questions before jumping to a solution?
- Can you make reasonable estimates about scale?
- Do you know how to decompose a large problem into components?
- Can you reason through trade-offs explicitly rather than just naming technology choices?
- Do you know where the hard parts are in a given system?
- Can you handle going deeper on one component when pushed?
- Do you think about operational concerns (failure modes, observability, scalability) rather than just functional ones?

The specific technology you choose matters less than the reasoning you attach to it.

## A framework for navigating the interview

This framework is not a rigid script. It is a sequence that ensures you cover the ground the interviewer is trying to evaluate.

### Step 1: Clarify scope and requirements (5-7 minutes)

Do not start designing yet. Ask questions until you understand what you're building.

**Functional requirements**: what does the system need to do? What are the core use cases? What is explicitly out of scope?

"For a URL shortener: do we need custom slugs? Analytics on click counts? Expiration dates for links?"

**Non-functional requirements**: what are the reliability, latency, and scale expectations?

"What's the expected write volume? Read volume? What's acceptable latency for redirects? Is availability more important than consistency for this use case?"

**Constraints**: any existing systems you need to integrate with? Any technology constraints?

Write your requirements down during the interview. It signals that you are organized and it gives you a reference to check your design against.

### Step 2: Estimate scale (2-3 minutes)

Back-of-envelope math on the numbers you'll use to make design decisions. This does not need to be precise — it needs to be in the right order of magnitude.

"100M shortened URLs created per month, 10B redirects per month. That's roughly 40 writes/second and 4000 reads/second. Heavy read bias. Read path is latency-sensitive; write path is less so."

Scale estimation reveals which parts of the system need special treatment and which don't. A system with 100 requests per second needs different infrastructure choices than one with 100,000.

### Step 3: High-level design (10 minutes)

Sketch the major components and how they connect. At this stage you are not going deep — you are establishing the overall shape.

Typical components: clients, API layer, core services, databases, caches, queues, CDN.

Draw boxes and arrows. Name the communication protocols (HTTP, gRPC, async queue). Label the data stores and what lives in each.

"For the URL shortener: a thin API service receives write requests, generates a short code, writes to a key-value store, and returns the short URL. Read requests hit the API service, look up the code in the KV store (with a cache in front), and redirect."

### Step 4: Deep dive on critical components (15-20 minutes)

Pick the parts that are hardest, most interesting, or most specific to this system's requirements and go deeper. The interviewer may guide you here.

"How do you generate unique short codes at scale? What happens if two requests try to create the same code? How does the cache work and what's your eviction strategy? What happens during a database node failure?"

This is where architectural depth is demonstrated. Generic answers ("we'd use Redis for caching") are weak. Specific, reasoned answers ("we'd use Redis with a read-through cache pattern; on a cache miss we fall back to the database and populate the cache, and we'd set a TTL of 24 hours since most links are active for a short window") are strong.

### Step 5: Trade-offs and alternatives (5-10 minutes)

Revisit decisions you made and explain the alternatives you considered.

"I chose a key-value store for the redirect table because reads are by a single key and latency is critical. A relational database would give us more query flexibility if we needed analytics, but we're keeping analytics out of the hot path."

This is explicit trade-off articulation in interview form. The skills from `articulating-tradeoffs/` apply directly here.

### Step 6: Operational concerns (if time permits)

Monitoring, alerting, failure modes, capacity planning, deployment strategy. This signals that you think about systems that run in production, not just systems that work in isolation.

"How would you know if the redirect latency was degrading? What would you monitor? What would alert? If the cache cluster went down, what would the user experience be and how long would it take to recover?"

## Common mistakes in system design interviews

**Not clarifying requirements and then designing the wrong system**. The interviewer asked you to "design Twitter's feed" which is a huge underspecified space. If you design a global social network when the interviewer had something smaller in mind, you've wasted time. Clarify.

**Going very broad and never deep**. Naming every component without being able to explain how any one of them actually works. Breadth without depth does not demonstrate architectural judgment.

**Jumping to specific technologies without explaining why**. "I'd use Kafka" is not an answer. "I'd use a message queue with at-least-once delivery guarantees because the analytics consumers can tolerate duplicates but cannot tolerate missing events, and Kafka specifically because we already operate it and the team has the tooling" is an answer.

**Ignoring failure modes**. Real systems fail. If you design a system where every component works perfectly, you are designing a system that does not exist. Ask yourself: what happens if this component is unavailable? What is the degraded mode?

**Getting rattled by follow-up questions**. "What if the requirements change?" or "What if you had to scale this 100x?" are standard probing questions, not signs that your answer is wrong. Stay calm, engage with the question, and update your design if it makes sense to.

## How the architecture curriculum prepares you

The `software-engineering/architecture/` curriculum maps directly to system design interview preparation:

- `04-system-architecture/` → how to decompose systems
- `05-communication/` → how to reason about sync vs async, CQRS, event sourcing
- `06-data/` → how to reason about data ownership, caching, sharding
- `07-resilience-and-scale/` → how to talk about failure modes, circuit breakers, retries
- `08-cross-cutting/` → CAP theorem, distributed systems trade-offs

A deep pass through that curriculum, followed by designing 10-20 systems out loud (with or without an interviewer), will produce significantly better performance in this format.
