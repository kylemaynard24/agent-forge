# Homework — Alert Quality

> Tune alerts so they are actionable, timely, and worth trusting.

## Exercise

Work through a small scenario involving a dashboard that fires often enough that people mute it mentally.

**Build:**
- one timeline or incident note
- one mitigation or response move
- one follow-up that reduces future confusion

**Constraints:**
- facts and hypotheses must be separated
- the first move may be mitigation rather than full repair
- one communication artifact must be readable by a non-expert

## Reflection

- What part of Alert Quality felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Alert Quality without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names + actionability

Alert names are the entry point to an incident, and an alert named "HighLatency" is less actionable than "p99_checkout_latency_exceeds_500ms" for the same reason a function named `process` is less useful than `chargeCustomerCard`. The name should encode what is being measured, what threshold was crossed, and ideally what service is affected — so the engineer paged can form a hypothesis before opening a dashboard.

**Exercise:** Take the alert that was being mentally muted in your scenario and rename it to include: the metric name, the threshold, the affected service or endpoint, and the direction of violation. Then write the runbook link that the alert should reference.

**Reflection:** If you were paged by this alert at 3am, does the alert name give you enough context to form your first hypothesis before you open a dashboard — or does the name just tell you something is wrong?
