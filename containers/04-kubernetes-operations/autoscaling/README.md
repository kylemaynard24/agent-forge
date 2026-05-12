# Autoscaling

**Area:** Kubernetes Operations

## Intent

Automatically adjust the number of pod replicas (or node count) in response to real demand — so you are not paying for idle capacity or dropping requests during spikes.

## When to use

- Any stateless service that experiences variable load — scale on CPU for general throughput, scale on custom metrics for queue-backed processors
- Event-driven workloads (message queues, Service Bus topics) where CPU does not correlate with backlog depth — use KEDA
- Scale-to-zero for background jobs and batch processors that should run only when there is work

## Why it matters

Fixed replica counts are a lie you tell yourself in the name of simplicity. A service with `replicas: 3` either wastes money at 3am when load is near zero, or drops requests at 2pm when load peaks above what 3 replicas can handle. Autoscaling converts that tradeoff into a sliding window — you set the floor and ceiling, and Kubernetes moves the current value to match reality.

The more subtle reason autoscaling matters is that it forces you to correctly instrument and resource your pods. HPA works by comparing current CPU usage to the CPU request. If your CPU request is wrong — too low means HPA thinks you are always at 100%, too high means it never scales — the autoscaler misbehaves in ways that look like random flapping. Getting autoscaling right requires that resource limits are already correct.

## Core concepts

- **HPA (Horizontal Pod Autoscaler)** — watches a metric (typically CPU or memory as a percentage of request), compares it to a target, and adjusts `Deployment.spec.replicas` accordingly
- **Scale up threshold** — HPA adds replicas when current metric / target > 1.1 (10% tolerance to prevent flapping)
- **Scale down threshold** — HPA removes replicas when current metric / target < 0.9 for a sustained stabilization window
- **stabilizationWindowSeconds** — how long HPA waits after a metric drops before actually removing replicas (default 300s for scale-down, 0s for scale-up); prevents thrashing
- **minReplicas / maxReplicas** — the floor and ceiling; set `minReplicas: 0` only with KEDA (standard HPA cannot scale to zero)
- **KEDA (Kubernetes Event-Driven Autoscaling)** — extends HPA with event-source triggers: Azure Service Bus queue depth, Azure Storage Queue, Kafka consumer group lag, cron schedule, HTTP request rate
- **ScaledObject** — the KEDA CRD that wraps a Deployment (or Job) and connects it to a trigger; KEDA manages the HPA object behind the scenes
- **Scale to zero** — KEDA can scale a Deployment to 0 replicas when the trigger metric is 0 (e.g., empty queue); the HPA's `minReplicas` floor does not apply here
- **VPA (Vertical Pod Autoscaler)** — adjusts the CPU and memory requests on individual pods; `Off` = recommendations only, `Initial` = set on creation, `Auto` = live adjustment (evicts pods)
- **VPA + HPA conflict** — running VPA in `Auto` mode alongside HPA on CPU is dangerous: VPA changes requests, which changes what HPA thinks the utilization percentage is, causing oscillation; safe combination is VPA `Off` or `Initial` + HPA on custom metrics
- **Cluster Autoscaler** — adds or removes nodes from a node pool when pods are Pending (no room to schedule) or nodes are underutilized; works alongside HPA, not instead of it

## Common mistakes

- **HPA on CPU only for latency-sensitive apps** — a gRPC service that holds long-lived connections may have low CPU but be at capacity; fix: expose a custom metric (active connections, queue depth) and HPA on that
- **VPA Auto + HPA CPU simultaneously** — VPA changes requests → HPA recalculates utilization percentage → HPA scales up or down unexpectedly → VPA reacts → oscillation loop; fix: do not run both on CPU at the same time
- **minReplicas: 1 with no startup probe** — when the single pod is replaced by HPA scale-up, there is a brief window with 0 healthy pods; fix: always set a readiness probe so the new pod is not added to the Service until it is ready
- **Forgetting stabilizationWindowSeconds on scale-down** — default is 300s; for batch jobs that complete fast, this means 5 minutes of idle pods after the work is done; fix: tune per-workload

## Tiny example

Deploy an API with HPA targeting 60% CPU utilization:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 60
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 120   # wait 2 min before removing replicas
      policies:
      - type: Pods
        value: 1
        periodSeconds: 60               # remove at most 1 pod per minute
```

And a KEDA ScaledObject that scales to zero when an Azure Service Bus queue is empty:

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: queue-processor
spec:
  scaleTargetRef:
    name: queue-worker
  minReplicaCount: 0        # scale to zero when queue is empty
  maxReplicaCount: 20
  triggers:
  - type: azure-servicebus
    metadata:
      queueName: orders
      namespace: my-servicebus-namespace
      messageCount: "5"     # one replica per 5 messages
```

## Run the demo

```bash
bash demo.sh
```

The demo deploys an app with an HPA, runs a load test to trigger scale-out, watches `kubectl get hpa -w`, stops the load, and watches scale-in with the stabilization window.

## Deeper intuition

HPA is a control loop, not a trigger. It runs every 15 seconds and asks: "given what I see right now, what is the desired replica count?" The answer is computed as:

```
desiredReplicas = ceil(currentReplicas * (currentMetricValue / desiredMetricValue))
```

If you have 3 replicas, current CPU is 90%, target is 60%: `ceil(3 * (90/60)) = ceil(4.5) = 5`. HPA wants 5 replicas. If your current metric drops to 30%: `ceil(5 * (30/60)) = ceil(2.5) = 3`. But the stabilization window prevents acting on that immediately.

The implication: HPA reacts to averages across all pods, not individual pod pressure. One pod at 200% CPU and two pods at 0% averages to 67% — HPA thinks things are fine. This is why per-pod metrics and KEDA's per-trigger approach can be more accurate for heterogeneous workloads.

## Scenario questions

### Scenario 1 — "We added HPA to our .NET API targeting 70% CPU. The pod count is constantly oscillating between 2 and 6 replicas, never stabilizing."
**Question:** What are the two most likely causes of HPA flapping?
**Answer:** Too short a stabilization window on scale-down, or CPU request set too low (making utilization percentage appear much higher than actual load warrants).
**Explanation:** If the stabilization window is too short (or zero), HPA scales down the moment the metric drops, then scales back up when the next burst arrives. Increase `scaleDown.stabilizationWindowSeconds` to 180–300. If the CPU request is 50m but the app idles at 45m, HPA thinks it is always at 90% utilization and keeps scaling up.

### Scenario 2 — "We want to scale our Azure Service Bus message processor to zero during off-hours and scale up instantly when messages arrive."
**Question:** Can standard Kubernetes HPA achieve this? If not, what should you use?
**Answer:** No. Standard HPA cannot scale to zero replicas. Use KEDA with the azure-servicebus trigger and `minReplicaCount: 0`.
**Explanation:** HPA enforces a minimum of 1 replica by design. KEDA bypasses this by managing the HPA object itself and can set replicas to 0 when the trigger metric is zero. When a message arrives, KEDA activates the ScaledObject and scales from 0 to `minReplicaCount` (1) within seconds — the activation threshold is separate from the scaling threshold.

### Scenario 3 — "Our cluster ran out of nodes and new pods are stuck in Pending. HPA is trying to scale up but nothing is scheduling."
**Question:** HPA is working correctly — why are pods still Pending, and what is the fix?
**Answer:** The Cluster Autoscaler has not yet added nodes, or node pool autoscaling is not enabled.
**Explanation:** HPA adds pod replicas; it cannot add nodes. The Cluster Autoscaler (AKS: `--enable-cluster-autoscaler` on the node pool) detects Pending pods caused by insufficient node capacity and adds nodes to accommodate them. Without it, HPA can request more pods but the scheduler has nowhere to place them. Enable Cluster Autoscaler on the node pool with appropriate min/max node counts.
