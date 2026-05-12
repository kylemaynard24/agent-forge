# Resource Limits

**Area:** Kubernetes Operations

## Intent

Set CPU and memory requests and limits so the scheduler places your pod on a node with enough capacity and the runtime enforces a ceiling that prevents one app from starving its neighbors.

## When to use

- Every production workload — no exceptions
- Dev and staging deployments — sizing in lower environments with VPA recommender data gives you a calibrated baseline before it matters
- Any time you add a new service — defaults set by LimitRange are not a substitute for intentional sizing

## Why it matters

Without resource requests, the Kubernetes scheduler has no data to make placement decisions. Pods end up stacked on nodes that cannot support them. Under load, an unconstrained process can consume all available memory on a node, triggering the OOM killer for neighboring processes — your app takes down someone else's app (or vice versa). Without CPU limits, one runaway job can throttle every other container on the node.

The flip side is just as dangerous: limits set too low cause CPU throttling at any traffic level (invisible latency spikes, no errors) and OOMKilled crashes on memory spikes. Most outages caused by resource configuration come from one of three scenarios: no limits at all, limits set to the exact value as requests (no burst headroom), or limits so low the app throttles constantly.

## Core concepts

- **Request** — what the scheduler treats as "reserved" for this container on the node; the node must have at least this much free to schedule the pod
- **Limit** — the maximum the container is allowed to consume; enforced by the Linux kernel after scheduling
- **CPU throttling** — when a container tries to use more CPU than its limit in a 100ms accounting window, the kernel throttles it; the container does not crash, but latency increases; this is silent and hard to detect without metrics
- **OOMKilled** — when a container tries to allocate more memory than its limit, the kernel kills it; `kubectl describe pod` shows `OOMKilled` as the termination reason
- **Guaranteed QoS** — both request and limit are set and are equal for all containers; highest eviction priority (last to go); correct for stable, predictable workloads
- **Burstable QoS** — at least one container has a request or limit set but they are not equal; middle eviction priority; correct for most production workloads
- **BestEffort QoS** — no requests or limits set at all; first to be evicted under node pressure; never use in production
- **LimitRange** — a namespace-scoped policy that applies default requests and limits when a Pod does not specify them; prevents BestEffort workloads from landing in a namespace
- **ResourceQuota** — a namespace-scoped policy that caps total CPU, memory, and object counts across all pods in the namespace; used to prevent one team from consuming the whole cluster
- **VPA (Vertical Pod Autoscaler)** — observes actual CPU and memory usage over time and recommends (or automatically sets) request values; `Off` mode = recommendations only, `Initial` = sets on pod creation, `Auto` = updates live pods (will evict and reschedule)

## Common mistakes

- **No limits set** — BestEffort QoS; first to be evicted under node pressure; a noisy neighbor can kill your app; fix: always set at minimum a memory limit
- **Limits too low for CPU** — silent latency degradation through throttling; fix: use `kubectl top pod` and Prometheus `container_cpu_throttled_seconds_total` to detect throttling, then raise limits
- **Memory limit equals memory request** — leaves no headroom for normal GC spikes; a .NET app allocating a burst of objects for a large request gets OOMKilled; fix: set limit at 1.5–2x request for most apps
- **Setting CPU limit to 1 for a multi-threaded app** — a .NET API using the thread pool across 8 cores will be hard-throttled; fix: profile actual peak usage and set the limit to cover the 95th percentile

## Tiny example

A .NET 8 API in production, sized conservatively with room to burst:

```yaml
resources:
  requests:
    cpu: "250m"      # scheduler reserves 0.25 cores; node must have this free
    memory: "256Mi"  # scheduler reserves 256MB
  limits:
    cpu: "1000m"     # can burst to 1 core before CPU throttling kicks in
    memory: "512Mi"  # OOMKilled if it tries to exceed 512MB
```

The Burstable QoS class means: during idle periods, the pod uses ~250m CPU and 200MB RAM. During a traffic spike, it can use up to 1 CPU and 512MB RAM. If it tries to use 513MB, the kernel kills the container and Kubernetes restarts it.

## Run the demo

```bash
bash demo.sh
```

The demo creates pods with and without limits, triggers an OOMKilled event, shows CPU throttling behavior, and uses `kubectl top` to observe real consumption.

## Deeper intuition

Think of requests as your seat reservation on a train. The train (node) will not board more passengers than it has reserved seats — the scheduler guarantees you a seat before you get on. But once you are on the train, you are not physically constrained to your seat. You can sprawl into the aisle (burst above request) up to a point.

Limits are the conductor's ceiling. If you try to take up three seats (exceed your memory limit), the conductor removes you from the train (OOMKill). If you talk too loudly (exceed CPU limit), the conductor tells you to quiet down (throttle) — you stay on the train but can only do so much.

The key insight: requests affect scheduling (before the pod lands on a node), limits affect runtime (after the pod is running). They solve different problems and must be calibrated independently.

## Scenario questions

### Scenario 1 — "Our API is healthy, traffic is normal, but p99 latency spiked after the latest deploy. No errors in logs. CPU looks fine in Azure Monitor."
**Question:** What resource-related issue could cause silent latency spikes with no errors?
**Answer:** CPU throttling — the CPU limit is too low and the container is being throttled by the Linux CFS scheduler.
**Explanation:** Throttling does not appear as high CPU in most dashboards — it appears as "CPU usage is normal but requests are slow." Check `container_cpu_cfs_throttled_seconds_total` in Prometheus, or run `kubectl exec -- cat /sys/fs/cgroup/cpu/cpu.stat` inside the container and look at `throttled_time`. Fix by raising the CPU limit or removing it entirely for latency-sensitive services.

### Scenario 2 — "A pod keeps restarting. kubectl describe shows 'OOMKilled'. We checked and memory usage looked fine in the dashboard."
**Question:** Why might the dashboard show low memory while OOMKill still occurs?
**Answer:** Memory limits are enforced at the instant of allocation, not as an average. A single large request that triggers a memory spike can breach the limit before any monitoring scrape captures it.
**Explanation:** Prometheus scrapes every 15–30 seconds by default. A .NET app processing a large CSV file might allocate 200MB for 2 seconds, hit the limit, get killed, and then the scrape shows 0MB (the pod restarted). Increase the memory limit and watch for OOMKill events in `kubectl get events`, not just dashboard averages.

### Scenario 3 — "We deployed a new team's service to our shared namespace. It consumed all CPU on the node and throttled every other pod."
**Question:** What two Kubernetes objects should have been in place to prevent this?
**Answer:** A LimitRange (to enforce defaults if the team did not set limits) and a ResourceQuota (to cap the total CPU the namespace is allowed to consume).
**Explanation:** LimitRange prevents BestEffort pods by injecting defaults when no resource spec is present. ResourceQuota caps the namespace-level aggregate, so even if the new service sets limits, those limits cannot sum to more than the quota allows. Both are defense-in-depth — neither alone is sufficient.
