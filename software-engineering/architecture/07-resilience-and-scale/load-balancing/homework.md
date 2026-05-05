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

---

## Clean Code Lens

**Principle in focus:** Meaningful Names — strategy names encode the selection criterion, not the implementation detail

`LeastConnections` names the selection criterion (fewest in-flight requests); a custom strategy called `SmartBalancer` or `BetterLB` names nothing — a reader must open the implementation to understand the criterion. When you implement EWMA latency or Power of Two Choices, the class name `EwmaLeastLatency` or `PowerOfTwoChoices` makes the algorithm self-documenting at the call site where the strategy is configured.

**Exercise:** Write a one-sentence docstring for each of your four strategy classes using the template: "Selects the backend with [selection criterion], preferring [tie-breaker] when [condition]." If you cannot complete that template from the class name alone, the name is not carrying enough information — revise it.

**Reflection:** When the EWMA stretch strategy is added as a fifth option, how would you name it so that a developer configuring the load balancer in YAML can choose between `least-connections` and the EWMA variant without reading either implementation?
