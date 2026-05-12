# Observability in Kubernetes

**Area:** Production Kubernetes / AKS

## Intent

Wire up logs, metrics, and traces for containerized workloads so that when something breaks in production at 2am, you can find the root cause in minutes rather than hours.

## When to use

- Every production workload — observability is not optional in Kubernetes; the default `kubectl logs` experience does not scale to a multi-service system under load
- Before any significant traffic event — you want dashboards and alerts in place before you need them
- When migrating from VMs where logs were on disk — containers write to stdout/stderr; aggregation must be explicit

## Why it matters

Kubernetes creates and destroys pods constantly. When a pod crashes, `kubectl logs` on the dead pod shows nothing. When a pod is rescheduled to a different node, its previous log stream is gone. When you have 50 pods across 5 services, you cannot grep your way to the root cause. Centralized log aggregation, metrics, and traces are not DevOps luxuries — they are prerequisites for operating a container platform.

The three pillars are genuinely complementary. Metrics tell you something is wrong (latency p99 spiked). Logs tell you what happened (exception in the payment service). Traces tell you where time was spent across service boundaries (the payment service called the fraud service which called the ML model, and 80% of latency was there). You need all three.

## Core concepts

- **Container logging model** — containers must write to stdout/stderr; Kubernetes captures these streams and stores them on the node; `kubectl logs` reads from the node; when the pod is deleted, the logs are gone unless aggregated
- **Log aggregation** — a DaemonSet (e.g., Fluent Bit) runs on every node, tails container logs, and ships them to a central store (Log Analytics, Elasticsearch, Loki)
- **Azure Monitor Container Insights** — the AKS-native log aggregation solution; enabled with `--enable-addons monitoring`; sends container logs and node metrics to a Log Analytics workspace; accessible via Azure Portal and KQL queries
- **Structured logging** — logs written as JSON (one JSON object per line) rather than plain text; enables filtering by field (level, correlationId, serviceName) in any log aggregation system; use Serilog in .NET
- **stdout/stderr** — the only two streams Kubernetes aggregates; do not write logs to files inside the container; fix existing apps with a symlink (`ln -sf /proc/1/fd/1 /var/log/app.log`)
- **Prometheus** — the de facto Kubernetes metrics system; scrapes `/metrics` HTTP endpoints; stores time-series data; queried with PromQL
- **ServiceMonitor** — a Prometheus Operator CRD that tells Prometheus which Service's `/metrics` endpoint to scrape; no manual config file editing required
- **Grafana** — visualization layer for Prometheus (and other data sources); pre-built Kubernetes dashboards available at grafana.com/dashboards
- **OpenTelemetry** — a vendor-neutral SDK for instrumented distributed tracing; exports spans to Azure Monitor, Jaeger, Zipkin, or any OTLP-compatible backend
- **Azure Monitor (Application Insights)** — Azure's managed tracing and metrics backend; receives OpenTelemetry spans and provides end-to-end transaction tracking in the Azure Portal
- **`kubectl top`** — reads from the metrics-server API to show current CPU and memory for nodes and pods; point-in-time, not historical
- **`kubectl logs --previous`** — shows logs from the previous container instance of a pod (the one that crashed); critical for diagnosing OOMKill or startup crash loops
- **`kubectl describe`** — shows the event history for a pod (probe failures, image pull errors, evictions); always check this first when a pod is unhealthy
- **KubeCost** — an open-source (with a commercial tier) tool that allocates Kubernetes cluster cost by namespace, Deployment, and label; essential for chargeback and cost optimization

## Common mistakes

- **Logging to files inside the container** — `kubectl logs` shows nothing; the logs are inside the container's writable layer; fix: always write to stdout/stderr
- **Not instrumenting for traces** — logs and metrics tell you something is slow but not where across service boundaries; fix: instrument every .NET service with OpenTelemetry from day one
- **Alerting on causes instead of symptoms** — an alert for "CPU > 80%" is a cause alert; an alert for "p99 latency > 2s" is a symptom alert; symptom alerts fire when users are affected, cause alerts fire constantly for reasons that do not affect users
- **Using `kubectl logs` for production debugging** — it does not persist past pod deletion, shows only one pod at a time, and has no filtering; fix: use Azure Monitor Log Analytics or Grafana/Loki for production log queries

## Tiny example

Container Insights KQL query to find recent pod OOMKilled events:

```kql
KubePodInventory
| where TimeGenerated > ago(24h)
| where ContainerLastStatus == "OOMKilled"
| project TimeGenerated, Namespace, PodName = Name, ContainerName, ContainerLastStatus
| order by TimeGenerated desc
```

A .NET Serilog configuration for structured JSON logging to stdout:

```csharp
Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Service", "my-api")
    .WriteTo.Console(new JsonFormatter())  // JSON to stdout
    .CreateLogger();
```

A Prometheus ServiceMonitor:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-api-monitor
spec:
  selector:
    matchLabels:
      app: my-api
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
```

## Run the demo

```bash
bash demo.sh
```

The demo shows `kubectl logs`, `kubectl logs --previous`, `kubectl top`, Container Insights KQL examples, a Prometheus ServiceMonitor, and `kubectl describe` event inspection.

## Deeper intuition

Think of observability as the difference between flying with instruments and flying blind. A plane with no instruments can still fly in clear weather — the pilot sees the horizon, sees the ground, knows their altitude by feel. But at night, in clouds, after an engine change? The pilot needs instruments. Every reading. All the time.

Your application in Kubernetes is always flying in clouds. You cannot see pods. You cannot SSH to a container and read a log file. You cannot feel the memory pressure building. The instruments (logs, metrics, traces) are not optional tools for experts — they are the only way you can see what is happening. Without them, you are flying blind and eventually something will hit the mountain.

The three pillars are genuinely different instruments: the altimeter (metrics) tells you your current state, the black box (logs) tells you what happened, and the flight path recorder (traces) tells you the sequence of events across time and space. You need all three.

## Scenario questions

### Scenario 1 — "A pod crashed at 3am. kubectl logs shows nothing. kubectl get pod shows it has been restarted 5 times."
**Question:** What two commands give you the most useful information about why it crashed?
**Answer:** `kubectl logs <pod> --previous` (logs from the crashed container) and `kubectl describe pod <pod>` (event history, exit code, OOMKill indicator).
**Explanation:** `--previous` shows the logs from the last terminated container instance. `kubectl describe` shows the exit code (137 = OOMKill, 1 = application error) and the event history (probe failures, image pull errors). These two commands together usually give you the root cause without needing a centralized log system.

### Scenario 2 — "Our API's p99 latency doubled after the last deployment. Metrics show normal CPU and memory. Logs show no errors."
**Question:** What observability capability is missing that would find this issue fastest?
**Answer:** Distributed tracing.
**Explanation:** A latency increase with no errors and normal resource usage is classic "something downstream is slow." Distributed traces show the full request path across service boundaries, with timing for each span. You would see that one downstream service call went from 50ms average to 800ms — even though the calling service's logs show no errors (the downstream call succeeded, just slowly). OpenTelemetry + Azure Monitor Application Insights would surface this in the end-to-end transaction view.

### Scenario 3 — "We are getting an alert: 'Kubernetes node CPU is above 90%'. We investigate and nothing seems to be affecting users. Is this a good alert?"
**Question:** Why is this a poor alerting strategy, and what should replace it?
**Answer:** This is a cause-based alert. Node CPU at 90% does not necessarily mean users are affected — it depends on what is consuming the CPU and whether the app is throttled. Alert on symptoms: user-facing latency p99, error rate, or request success rate.
**Explanation:** Good alerts fire when users are affected. An alert for "p99 latency > 1s for 5 minutes" fires when the user experience is degraded — regardless of whether the cause is CPU, a slow database, a bug, or a network partition. Infrastructure alerts (CPU, memory, disk) belong on a dashboard for capacity planning, not in your on-call pager queue.
