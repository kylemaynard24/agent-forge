# Homework — Load Testing

> Probe system behavior under increasing pressure before production does it for you.

## Exercise

Work through a small scenario involving a service launch where nobody knows the safe concurrency range.

**Build:**
- a baseline measurement
- one improvement attempt
- a before/after summary with trade-offs

**Constraints:**
- you may not claim success without numbers
- the workload or traffic shape must be named
- you must state one cost introduced by the optimization

## Reflection

- What part of Load Testing felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Load Testing without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, tests as documentation, reveal the scenario

A load test scenario named `test3` or `scenario_v2_final` tells you a test ran; a scenario named `checkout_under_black_friday_peak_200rps` tells you the user journey, the load shape, and the traffic level — all from the name alone. Load test names are the documentation that will be read when production is on fire and someone asks "did we test this traffic pattern?"

**Exercise:** For the service launch scenario in this homework, design a load test suite with five named scenarios. Each scenario name must encode: the user journey being simulated, the load shape or concurrency level, and the condition being probed (normal, peak, degraded dependency, burst). Then write the one-sentence pass criteria for each scenario — the specific metric threshold that must hold for the launch to proceed — and confirm that each criterion references a named constant rather than a magic number.

**Reflection:** In a load test suite you have run or inherited, could you look at the scenario names alone and reconstruct which production traffic patterns were validated and which were not — or would you need to read the test scripts to understand what was actually tested?
