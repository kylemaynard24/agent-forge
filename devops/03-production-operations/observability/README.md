# Observability

Observability is the ability to understand what is happening inside a running system from the outside, by examining its outputs. A system is observable if you can answer the question "why is this behaving this way?" without modifying the system or guessing.

This is different from monitoring, which is the practice of watching known metrics and alerting when they cross thresholds. Monitoring tells you *that* something is wrong. Observability tells you *why*.

## The three pillars

Observability is often described as having three pillars: metrics, logs, and traces. Each provides a different lens on system behavior.

**Metrics** are aggregated, numeric measurements over time. A metric has a name, a value, and dimensions (labels). Examples: `http_requests_total{status=500, endpoint="/api/orders"}`, `memory_usage_bytes{instance="prod-01"}`. Metrics are efficient to store (just numbers, not text) and efficient to query (aggregations over time series). They are good for answering "what is the system doing right now?" and "how has behavior changed over time?"

Metrics are bad at answering "why is this happening?" because aggregation loses individual events. A `p99_latency = 2000ms` metric tells you 1% of requests are slow, but not which requests or why.

**Logs** are discrete, timestamped records of events. A log entry captures what happened at a specific moment: a request came in, an error occurred, a batch job completed. Logs are expressive — they can include arbitrary context. They are expensive to store and slow to query at scale.

Logs are good at answering "what happened for this specific request?" They are bad at answering "how often does this happen?" because querying large log volumes is slow.

**Traces** are records of a request's journey through a distributed system. A trace has a root span (the initial request) and child spans (downstream calls, database queries, cache lookups). Each span has a start time, duration, and metadata. Together, a trace reconstructs the exact path and timing of a specific request.

Traces are good at answering "why was this specific request slow?" and "which downstream call caused this failure?" They require instrumentation — you must explicitly add trace context to your code and propagate it through service calls.

## Why you need all three

The three pillars complement each other:

A metric alert fires: error rate on `/api/checkout` is above 5%. → Metrics told you *that* something is wrong.

You query logs for the time window of the alert, filtered to errors: you see 400 Bad Request errors with a specific error message. → Logs told you *what* is wrong.

You take a trace ID from one of the failing requests: you see the trace shows a call to the payment service timing out at 29 seconds, which causes the checkout to fail with a 400. → Traces told you *where* and *why*.

None of the three pillars alone would have given you the complete picture. You need all three.

## SLIs and SLOs

A Service Level Indicator (SLI) is a measurement of a specific aspect of service quality: "the fraction of requests that complete successfully in under 500ms." An SLO (Service Level Objective) is the target value for that measurement: "99th percentile latency under 500ms for 99.5% of requests in a rolling 30-day window."

SLOs are important because they define "healthy" in a precise, measurable way. Without an SLO, every discussion about whether the system is performing well is subjective. With an SLO, the discussion is grounded in data: "we are at 99.3% for the past 30 days. Our SLO is 99.5%. We have consumed 60% of our error budget."

**Error budget** is the key concept: if your SLO is 99.5%, your error budget is 0.5% of requests over the measurement window. You can spend this budget on: unavoidable failures, risky deployments, system changes. When the error budget is exhausted, you stop making risky changes and focus on reliability.

This framework changes how teams think about reliability: it is not "we never have failures" but "we have a budget for failures and we spend it intentionally."

## Azure Monitor and Application Insights

Azure Monitor is the platform for collecting and querying observability data from Azure resources. Application Insights is a subcomponent of Azure Monitor focused on application-level telemetry: request rates, error rates, response times, dependency calls.

**Application Insights automatic instrumentation** provides request tracking, dependency tracking, exception tracking, and performance counters with minimal code changes. For .NET and Java applications running in App Service or Container Apps, auto-instrumentation requires only enabling it in the resource configuration.

**Custom metrics** are the most valuable part of Application Insights. A custom metric is a named, dimensioned measurement that your code explicitly emits. Examples: `checkout_completed` (increment on every successful checkout), `email_queue_depth` (emit the current queue depth every minute), `report_generation_seconds` (emit the time to generate each report).

Custom metrics let you monitor what matters to your business, not just what Azure measures by default.

**KQL (Kusto Query Language)** is the query language for Azure Monitor. It is columnar and designed for time-series data. Core operations:
- `requests | where resultCode == "500"` — filter
- `requests | summarize count() by bin(timestamp, 1m)` — aggregate into time buckets
- `requests | extend duration_ms = duration` — add computed columns
- `requests | join dependencies on operation_Id` — join tables

Fluency in KQL is what separates engineers who can investigate production issues quickly from those who are stuck waiting for someone else to build a dashboard for them.

## Designing for observability

Observability is not something you add after a system is built — it is something you design in. Questions to ask when building any new component:

**What does "healthy" look like?** If you can't answer this precisely, you can't build a useful alert. "The service should respond in under 200ms for 99% of requests" is specific enough to measure and alert on.

**What are the most common failure modes?** These should each have a log message and ideally a metric. If a critical failure can happen silently (no log, no metric change), it will go undetected until a user complains.

**What context does a log message need to be useful?** A log that says "error processing request" without a request ID, user ID, or any indication of what went wrong is worse than no log — it creates noise without signal. Every log entry should contain enough context to understand what was happening when it was emitted.

**Can you trace a request end-to-end?** If your system makes multiple downstream calls for a single user request, can you answer "what happened for user X at 2:34pm?" by following a single trace? If not, your tracing is incomplete.
