# Stage 4: Kubernetes Operations

Running apps in Kubernetes is the easy part — keeping them running reliably under real load is the work.

This section comes **after** Kubernetes Foundations — you can deploy apps, now learn to keep them running reliably in production.

## Contents

- [health-checks/](health-checks/) — Configure liveness, readiness, and startup probes so Kubernetes knows when your app is ready for traffic and when it needs to be restarted
- [resource-limits/](resource-limits/) — Set CPU and memory requests and limits so your app is scheduled correctly and doesn't starve or OOM-kill its neighbors
- [autoscaling/](autoscaling/) — Automatically scale pods horizontally with HPA and event-driven triggers with KEDA, and understand when VPA fits
- [rolling-updates-and-canary/](rolling-updates-and-canary/) — Deploy new versions safely using rolling updates, canary splits, and blue-green switches without dropping traffic
- [ingress-and-load-balancing/](ingress-and-load-balancing/) — Route external traffic into your cluster through a single Ingress controller instead of one LoadBalancer per service

## How to use this section

Each topic has three artifacts:
1. **`README.md`** — the concept and why it matters
2. **`demo.sh`** — annotated shell commands you can run
3. **`homework.md`** — a constrained exercise

## How to know this section is working

- You can deploy an app and have Kubernetes automatically remove it from Service endpoints when it is unhealthy — without restarting it
- You can run a load test and watch pods scale out, then watch them scale back in after the stabilization window
- You can deploy a new version of an app to 20% of traffic, confirm it is healthy, and graduate it to 100% — all without downtime

## Question-driven orientation

### Scenario 1 — "Our app takes 45 seconds to warm up its cache on startup. Kubernetes keeps restarting it before it's ready."
**Question:** Which probe type was designed exactly for this situation?
**Answer:** The startup probe.
**Explanation:** A startup probe disables liveness and readiness checks until it succeeds. You set `failureThreshold * periodSeconds` to cover your worst-case startup time. Once the startup probe passes, liveness and readiness take over. Without it, an aggressive liveness probe will restart the pod before it has a chance to finish initializing.

### Scenario 2 — "Our API latency spiked after the last deploy. Metrics show CPU throttling even though we haven't hit our limits."
**Question:** How can you be getting CPU throttled if you haven't hit the CPU limit?
**Answer:** Throttling happens when a container tries to use more CPU than its limit allows in a given accounting period (100ms by default). It does not require sustained high CPU — even short bursts above the limit are throttled. The symptom is increased latency with no apparent CPU saturation.
**Explanation:** CPU limits in Kubernetes use Linux CFS bandwidth control. Set them too low and your app gets throttled on every burst. The fix is either to raise the limit or — in latency-sensitive services — remove the CPU limit entirely and rely on requests for scheduling guarantees only.

### Scenario 3 — "We're running 20 microservices in AKS. Our Azure bill shows 20 public IP addresses."
**Question:** What is the architectural fix?
**Answer:** Replace Service type LoadBalancer on each service with a single Ingress controller that has one LoadBalancer Service.
**Explanation:** Each `type: LoadBalancer` Service provisions its own Azure Load Balancer public IP. An Ingress controller consolidates all inbound traffic through one IP and routes it internally by host or path rules. This eliminates 19 of those 20 IPs and gives you centralized TLS termination, rewrite rules, and rate limiting.

### Scenario 4 — "During a node drain for maintenance, Kubernetes took all 3 replicas of our API offline at once."
**Question:** What single resource would have prevented this?
**Answer:** A PodDisruptionBudget (PDB).
**Explanation:** A PDB tells Kubernetes the minimum number of pods that must remain available during voluntary disruptions like node drains and rolling updates. With `minAvailable: 2` and 3 replicas, Kubernetes will only evict one pod at a time, ensuring at least 2 stay up during the maintenance window.
