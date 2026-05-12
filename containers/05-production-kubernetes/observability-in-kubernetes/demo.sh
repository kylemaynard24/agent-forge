#!/usr/bin/env bash
# demo.sh — Observability in Kubernetes
# Run: bash demo.sh
# Requires: kubectl connected to a cluster, metrics-server installed
#           For AKS Container Insights: cluster must have --enable-addons monitoring

set -euo pipefail

NAMESPACE="obs-demo"

echo "=== 1. Create namespace ==="
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "=== 2. Deploy an app that writes structured JSON logs to stdout ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: json-logger
spec:
  replicas: 2
  selector:
    matchLabels:
      app: json-logger
  template:
    metadata:
      labels:
        app: json-logger
    spec:
      containers:
      - name: app
        image: busybox:1.36
        command:
        - /bin/sh
        - -c
        - |
          i=0
          while true; do
            i=$((i+1))
            # Structured JSON log to stdout — this is what Container Insights/Fluent Bit receives
            echo "{\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"level\":\"INFO\",\"service\":\"json-logger\",\"message\":\"processed request\",\"requestId\":\"req-$i\",\"durationMs\":$((RANDOM % 200 + 10))}"
            sleep 2
          done
        resources:
          requests:
            cpu: "10m"
            memory: "8Mi"
          limits:
            cpu: "50m"
            memory: "16Mi"
EOF

kubectl wait --for=condition=Available deployment/json-logger -n "$NAMESPACE" --timeout=60s

echo ""
echo "=== 3. kubectl logs — stream from a single pod ==="
POD=$(kubectl get pods -n "$NAMESPACE" -l app=json-logger -o jsonpath='{.items[0].metadata.name}')
echo "Showing last 5 log lines from $POD:"
kubectl logs "$POD" -n "$NAMESPACE" --tail=5

echo ""
echo "=== 4. kubectl logs from all pods with a label selector ==="
echo "Showing last 3 lines from ALL json-logger pods:"
kubectl logs -n "$NAMESPACE" -l app=json-logger --tail=3 --prefix

echo ""
echo "=== 5. Deploy a pod that will crash so we can show --previous ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: v1
kind: Pod
metadata:
  name: crash-demo
spec:
  restartPolicy: OnFailure
  containers:
  - name: app
    image: busybox:1.36
    command:
    - /bin/sh
    - -c
    - |
      echo "Starting up..."
      echo "Critical error occurred at $(date)" >&2
      exit 1
    resources:
      requests:
        cpu: "10m"
        memory: "8Mi"
      limits:
        cpu: "50m"
        memory: "16Mi"
EOF

echo "Waiting for crash-demo to fail and restart..."
sleep 15

echo ""
echo "--- kubectl logs --previous (logs from the crashed container) ---"
kubectl logs crash-demo -n "$NAMESPACE" --previous 2>/dev/null || \
  echo "(pod may not have restarted yet — wait a few seconds and try: kubectl logs crash-demo -n $NAMESPACE --previous)"

echo ""
echo "--- kubectl describe pod crash-demo — exit code and events ---"
kubectl describe pod crash-demo -n "$NAMESPACE" | grep -A 5 "Last State\|Exit Code\|Events:" | head -30

echo ""
echo "=== 6. kubectl top nodes and pods (requires metrics-server) ==="
kubectl top nodes 2>/dev/null || echo "(metrics-server not available — install: kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml)"
echo ""
kubectl top pods -n "$NAMESPACE" 2>/dev/null || echo "(metrics-server not available)"

echo ""
echo "=== 7. Prometheus ServiceMonitor example (informational) ==="
echo ""
echo "If the Prometheus Operator is installed, this ServiceMonitor scrapes /metrics:"
cat <<'PROMETHEUS_EXAMPLE'
# First: install Prometheus Operator
# helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-api-monitor
  namespace: monitoring          # namespace where Prometheus is running
  labels:
    release: kube-prometheus-stack  # must match Prometheus's serviceMonitorSelector
spec:
  namespaceSelector:
    matchNames:
    - obs-demo                   # namespace where the app lives
  selector:
    matchLabels:
      app: my-api                # selects the Service to scrape
  endpoints:
  - port: http                   # port name on the Service
    path: /metrics
    interval: 30s
PROMETHEUS_EXAMPLE

echo ""
echo "=== 8. Azure Monitor Container Insights KQL examples (informational) ==="
echo ""
echo "Run these queries in Azure Portal > Log Analytics Workspace > Logs"
echo "(requires AKS cluster with --enable-addons monitoring)"
echo ""
cat <<'KQL_EXAMPLES'
// --- Find all OOMKilled containers in the last 24 hours ---
KubePodInventory
| where TimeGenerated > ago(24h)
| where ContainerLastStatus == "OOMKilled"
| project TimeGenerated, Namespace, PodName = Name, ContainerName
| order by TimeGenerated desc

// --- Top 10 pods by memory usage ---
Perf
| where TimeGenerated > ago(30m)
| where ObjectName == "K8SContainer" and CounterName == "memoryWorkingSetBytes"
| summarize AvgMemMB = avg(CounterValue) / 1024 / 1024 by InstanceName
| top 10 by AvgMemMB desc

// --- Container restart count spike ---
KubePodInventory
| where TimeGenerated > ago(1h)
| summarize MaxRestarts = max(ContainerRestartCount) by PodName = Name, Namespace
| where MaxRestarts > 3
| order by MaxRestarts desc

// --- Structured log query (JSON logs from app containers) ---
ContainerLog
| where TimeGenerated > ago(30m)
| where LogEntry has "json-logger"
| extend parsed = parse_json(LogEntry)
| project TimeGenerated,
          Level = tostring(parsed.level),
          Service = tostring(parsed.service),
          Message = tostring(parsed.message),
          DurationMs = toint(parsed.durationMs)
| where DurationMs > 100
| order by TimeGenerated desc
KQL_EXAMPLES

echo ""
echo "=== 9. OpenTelemetry .NET setup example (informational) ==="
cat <<'OTEL_EXAMPLE'
// In Program.cs — add OpenTelemetry with Azure Monitor exporter:
// dotnet add package Azure.Monitor.OpenTelemetry.AspNetCore

builder.Services.AddOpenTelemetry()
    .UseAzureMonitor(options => {
        options.ConnectionString = builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"];
    })
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddSqlClientInstrumentation())
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddRuntimeInstrumentation());
OTEL_EXAMPLE

echo ""
echo "=== 10. Cleanup ==="
kubectl delete namespace "$NAMESPACE" --wait=false
echo "Namespace deletion in progress."

echo ""
echo "--- Done. Key takeaway: kubectl logs + describe handle debugging single pods; Container Insights + Prometheus + OpenTelemetry give you the full picture across all pods, all time. ---"
