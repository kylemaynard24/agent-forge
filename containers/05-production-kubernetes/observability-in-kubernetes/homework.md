# Homework — Observability in Kubernetes

> An incident happened at 2am. Two services had elevated error rates for 12 minutes before anyone noticed. When the on-call engineer opened the cluster, there were no centralized logs, no metrics dashboard, and no alerts. The post-mortem recommendation was "add observability." You are the engineer who has to make that happen.

## Exercise: Full Observability Stack

**Scenario:** Deploy a .NET 8 API (or use a simple echo service as a stand-in) with structured JSON logging to stdout, a Prometheus-compatible `/metrics` endpoint, and Azure Monitor integration. Then build alerts that would have caught the 2am incident in under 5 minutes.

**Build:**
1. Deploy a service that writes structured JSON logs to stdout. Each log line should be a JSON object with fields: `timestamp`, `level`, `service`, `correlationId`, `message`, `durationMs`. Use Serilog's `JsonFormatter` in a real .NET app, or use a busybox loop that prints JSON for this exercise.

2. Confirm logs appear in Container Insights:
   ```kql
   ContainerLog
   | where TimeGenerated > ago(10m)
   | where LogEntry has "your-service-name"
   | extend parsed = parse_json(LogEntry)
   | project TimeGenerated, Level = parsed.level, Msg = parsed.message
   ```

3. Set up an Azure Monitor alert rule that fires when any container is OOMKilled:
   ```kql
   KubePodInventory
   | where ContainerLastStatus == "OOMKilled"
   | summarize count() by bin(TimeGenerated, 5m), Namespace
   | where count_ > 0
   ```
   Alert threshold: count > 0 over a 5-minute window.

4. Add a `/metrics` endpoint to your service (use `prometheus-net` NuGet package in .NET, or deploy a service that exposes Prometheus metrics). Create a ServiceMonitor if Prometheus Operator is installed.

**Constraints:**
- Logs must be JSON, not plain text — verify with `kubectl logs <pod> | head -1 | python -m json.tool` (must parse without error)
- The Azure Monitor alert must have an action group configured (email is fine)
- Record the Container Insights KQL query and its output in `observations.md`
- Document the time from "alert fires" to "root cause identified" in a simulated OOMKill scenario — this is your observability SLO

## Stretch 1

Instrument a .NET API with OpenTelemetry and export traces to Azure Monitor Application Insights:

```csharp
builder.Services.AddOpenTelemetry()
    .UseAzureMonitor(options => {
        options.ConnectionString = Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING");
    })
    .WithTracing(tracing => tracing.AddAspNetCoreInstrumentation());
```

Make a series of HTTP requests and view the End-to-End Transaction view in Application Insights. Identify the slowest dependency call. Document the trace in `observations.md`.

## Stretch 2

Set up a KubeCost deployment (community edition):

```bash
helm install kubecost cost-analyzer --repo https://kubecost.github.io/cost-analyzer/ \
  --namespace kubecost --create-namespace \
  --set global.prometheus.enabled=true
kubectl port-forward -n kubecost svc/kubecost-cost-analyzer 9090 &
```

Open `http://localhost:9090`. Find the most expensive namespace. Find the most expensive Deployment. Document the cost breakdown in `observations.md` — identify at least one optimization (overprovisioned resource limit, idle replicas).

## Reflection

- `kubectl logs` shows logs for a pod on the current node. What happens to those logs when the pod is rescheduled to a different node? What handles log persistence?
- An engineer argues that structured JSON logging is slower than plain text logging and hurts API performance. How do you evaluate this claim? What data would you need?
- Your application uses a correlation ID to trace requests across services. What changes in how you query logs when you have this ID versus when you do not?

## Done when

- [ ] Service is writing structured JSON logs to stdout — verified with `kubectl logs | python -m json.tool`
- [ ] Logs appear in Container Insights Log Analytics query
- [ ] Azure Monitor alert is configured for OOMKill events
- [ ] `observations.md` contains a KQL query with its output
- [ ] You can explain the difference between metrics, logs, and traces to a non-technical stakeholder in 2 minutes

---

## Clean Code Lens

**Principle in focus:** Meaningful Names (Observable Code)

Structured logging is clean code. When you write `logger.LogInformation("User {UserId} placed order {OrderId} for {Amount:C}", userId, orderId, amount)`, you are naming your events the same way you name your variables: meaningfully, consistently, and with context. The result is a log stream that is as readable as code — and queryable by any field.

Plain text logging (`Console.WriteLine("order placed")`) is the equivalent of naming a variable `x`. It works until you have to find it. In a container platform with 50 pods emitting 10,000 log lines per second, an unnamed event is invisible. A structured event with a `correlationId`, `userId`, and `durationMs` is findable in 3 seconds with a KQL query.

The discipline required is the same as for code: agree on field names across services (`correlationId`, not `correlation_id` in one service and `requestId` in another), use consistent levels (INFO for normal operations, WARN for expected failures, ERROR for unexpected failures), and include enough context that the log event stands alone without needing to be read in sequence.

**Exercise:** Audit the logging in a real or sample .NET application. Identify every log statement that: (1) uses string interpolation instead of structured logging, (2) logs at the wrong level (e.g., caught exceptions logged as DEBUG), (3) is missing context (no userId, no correlationId, no duration). Rewrite each one using the structured logging pattern.

**Reflection:** "You should log enough to diagnose any production issue without needing to deploy a new version." Is this achievable? What are the costs of over-logging versus under-logging?
