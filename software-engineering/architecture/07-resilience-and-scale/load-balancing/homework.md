# Homework — Load Balancing

> Apply distribution strategies. The **constraints** are the point.

## Exercise: Smart LB for an image-resize service

**Scenario:** You run 5 image-resize workers behind one load balancer. Most requests are tiny thumbnails; a small fraction are 50MP RAW files that take 2 seconds. Round-robin causes long tail latency when a thumbnail lands behind a RAW file.

**Build:**
- A `LoadBalancer` interface and four strategies: `RoundRobin`, `LeastConnections`, `WeightedRoundRobin` (capacity-aware), `Random`.
- A simulator with a stream of mixed-cost requests.
- A report comparing P50, P95, P99, and wall-clock under each strategy.

**Constraints (these enforce the concept):**
- All strategies share the **same** `Backend` interface — swap is one-line.
- Weighted RR uses backend weights from config (e.g., `{a: 1, b: 2, c: 1}`) — derive the schedule deterministically.
- Backends must expose `inFlight` and a `health()` signal; an unhealthy backend is skipped without breaking the rotation.
- Run identical request streams across strategies so the comparison is apples-to-apples.

## Stretch
- Add **EWMA latency** as a tie-breaker in least-connections (prefer the backend with both fewer in-flight calls and lower recent latency).
- Add a **Power of Two Choices**: pick two backends at random, send to the less-loaded one. Often beats both naive strategies.

## Reflection
- Round-robin is fair by request count. Least-connections is fair by load. Which "fairness" does your service actually need, and why?

## Done when
- [ ] Strategy is swappable without changing call sites.
- [ ] Unhealthy backends are excluded automatically.
- [ ] You can produce a P95 latency table across all strategies on the same trace.
