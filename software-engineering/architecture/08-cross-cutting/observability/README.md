# Observability

**Category:** Cross-Cutting

## Intent

Make the running system explicable from the outside. Three signals do most of the work: **logs** (events, ideally structured), **metrics** (numbers over time, aggregable), and **traces** (causally-linked spans across a request's path). Together they answer "what happened, how often, and where?"

## When to use

- Any service that runs longer than a demo.
- Distributed systems where a single user request crosses many processes.
- Anywhere you might be paged at 2am — you cannot debug without instruments.
- Performance work — you can't optimize what you can't measure.

## Trade-offs

**Pros**
- Drastically shortens incident time-to-diagnosis.
- Traces show the cross-service path that no single log can.
- Metrics let you set SLOs and alert before users complain.
- Structured logs are searchable; freeform logs are sentiment.

**Cons**
- Costs money — log storage and trace ingestion are real line items.
- Bad cardinality (e.g., user-id as a metric label) blows up your bill and your dashboards.
- Instrumentation has overhead — sample, don't capture every span.
- Without conventions (names, fields, units), you accumulate noise rather than signal.

**Rule of thumb:** structured logs by default, metrics for rates and SLOs, traces for cross-service mysteries — and pick conventions before you instrument the second service.

## Real-world analogies

- A flight data recorder — every parameter, sampled, replayable.
- A hospital's vital-signs monitor — a few numbers a clinician can read at a glance.
- A package tracking number that follows a parcel through every facility.

## Run the demo

```bash
node demo.js
```

The demo runs a tiny tracer with `startSpan`/`endSpan`, prints a tree of nested spans for a simulated request, increments a counter for handled requests, and emits one structured log line per request.

## Deeper intuition

Cross-cutting concerns expose the pressures that ignore your clean boxes. Observability, trade-off analysis, distributed-systems fallacies, and CAP-style thinking all exist to remind you that runtime reality cuts across module boundaries and happy-path diagrams.

A strong grasp of **Observability** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?
