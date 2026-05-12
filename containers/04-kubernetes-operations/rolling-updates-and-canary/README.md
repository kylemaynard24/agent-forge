# Rolling Updates and Canary Deployments

**Area:** Kubernetes Operations

## Intent

Deploy new versions of your application without downtime — and with an escape hatch that limits blast radius when something goes wrong.

## When to use

- Every production code deployment — rolling updates should be the default strategy
- Risky changes (schema migrations, algorithm changes, new integrations) — canary routes a small percentage of traffic to the new version first
- Stateful workloads with breaking changes — Recreate strategy deliberately causes brief downtime rather than running two incompatible versions simultaneously

## Why it matters

A deployment without a strategy is a gamble. You push code, all pods restart at once, and for 30 seconds your users get connection refused. Rolling updates solve this by replacing pods incrementally — old pods serve traffic while new pods come up. But rolling updates alone are binary: 100% of traffic hits the new version as soon as it scales up. A canary deployment keeps most traffic on the stable version until you have confidence the new version is healthy.

PodDisruptionBudgets are the safety net you set before any update strategy: they tell Kubernetes that regardless of what it is trying to do (drain, scale-down, rolling update), it must keep a minimum number of your pods running. Without a PDB, a node drain event can take all your pods offline simultaneously even if your rolling update strategy would have been safe.

## Core concepts

- **RollingUpdate strategy** — the default; replaces pods incrementally, controlled by `maxSurge` and `maxUnavailable`
- **maxSurge** — how many extra pods above `replicas` can exist during an update (e.g., `maxSurge: 1` on 3 replicas = up to 4 pods temporarily); set higher to speed up updates
- **maxUnavailable** — how many pods below `replicas` can be unavailable during an update (e.g., `maxUnavailable: 0` = no pod is removed until a replacement is Ready); set to 0 for zero-downtime
- **Recreate strategy** — terminates all pods before starting new ones; causes deliberate downtime; correct when two versions cannot safely run simultaneously (e.g., a DB schema migration that breaks the old code)
- **minReadySeconds** — how many seconds a pod must be in Ready state before Kubernetes considers it "available" and moves on to replacing the next old pod; acts as a bake time to catch fast-failing deploys
- **PodDisruptionBudget (PDB)** — a policy object that limits voluntary disruption; `minAvailable: 2` means at least 2 pods must be running at all times during node drains, rolling updates, and evictions
- **Blue-green deployment** — two identical Deployments (blue = current, green = new); traffic is switched by patching the Service selector from `version: blue` to `version: green`; instant switch, no incremental rollout; easy rollback (patch selector back)
- **Canary deployment** — two Deployments sharing a single Service selector; the ratio of replicas controls traffic split (3 v1 pods + 1 v2 pod = 75%/25% split); graduated by increasing v2 replicas and decreasing v1
- **kubectl rollout status** — blocks until a rolling update is complete or shows progress
- **kubectl rollout undo** — reverts to the previous ReplicaSet; fast rollback without redeployment

## Common mistakes

- **No PDB** — during a node drain or cluster upgrade, Kubernetes evicts pods with no regard for availability; with 3 replicas and no PDB, all 3 can be drained simultaneously; fix: always add a PDB for production Deployments
- **maxUnavailable: 100%** — this equals a Recreate strategy with none of the explicitness; all pods are terminated before new ones start; fix: set `maxUnavailable: 0` and use `maxSurge: 1` for zero-downtime rolling updates
- **No minReadySeconds** — a pod that starts and immediately fails will be counted as Available, causing Kubernetes to continue the rolling update with a broken new version; fix: set `minReadySeconds: 30` to give crash-loop detection time to fire
- **Canary with Deployment-level traffic split but no Service mesh** — native Kubernetes canary uses replica counts as the traffic split mechanism; you cannot do 1% without running 99 v1 pods and 1 v2 pod; fix: use a service mesh (Istio, Linkerd) or Ingress annotations for percentage-based traffic splitting

## Tiny example

A zero-downtime rolling update configuration:

```yaml
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # allow 4 pods temporarily during update
      maxUnavailable: 0    # never go below 3 available pods
  minReadySeconds: 15      # wait 15s before counting a pod as "done"
```

A PDB ensuring at least 2 pods survive any disruption:

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: my-api-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: my-api
```

A canary setup — both Deployments use `app: my-api` as the selector label, so the Service sends traffic to both:

```yaml
# v1 Deployment: 3 replicas → ~75% of traffic
# v2 Deployment: 1 replica  → ~25% of traffic
# Service selector: app: my-api (matches both)
```

## Run the demo

```bash
bash demo.sh
```

The demo deploys 3 replicas, sets a PDB, triggers a rolling update, shows a canary split in action, and demonstrates blue-green by patching the Service selector.

## Deeper intuition

Think of a rolling update like rotating the guard at a checkpoint. You do not send everyone home at once and leave the checkpoint unmanned (Recreate). You bring in one new guard, check they know the post (readiness probe passes), then release one old guard. The checkpoint is always staffed.

A canary is like a controlled experiment in production. You do not trust lab results alone — you put 10% of real users on the new version and watch what happens. If the error rate is the same, you graduate to 25%, then 50%, then 100%. If the error rate spikes, you pull the canary immediately and only 10% of users were affected.

Blue-green is a full rehearsal. The new version is running in production with zero traffic. When you flip the switch (Service selector patch), 100% of traffic moves instantly. Rollback is equally instant — flip the switch back. The cost is running double the infrastructure during the transition.

## Scenario questions

### Scenario 1 — "We did a rolling update. The first 2 new pods looked healthy, then the third new pod had a bug that causes it to crash every 30 seconds. By the time we noticed, all 3 old pods were gone."
**Question:** What two configuration changes would have prevented complete replacement of all old pods before the bug was detected?
**Answer:** `minReadySeconds` set to a value long enough for the crash loop to be detected, and `maxUnavailable: 0` to prevent removing old pods until new ones are proven stable.
**Explanation:** With `minReadySeconds: 60` and a crash-loop that manifests within 30 seconds, the pod will never be counted as Available. The rolling update will stall at the failing pod rather than continuing to replace old replicas. The update can then be rolled back with `kubectl rollout undo`.

### Scenario 2 — "We want to test a new payment flow on 5% of traffic before full rollout. We only have 5 pods total."
**Question:** Can native Kubernetes canary achieve 5% traffic with 5 pods?
**Answer:** Not precisely. With 5 total pods, the minimum canary increment is 1 pod = 20% of traffic (1/5). Achieving 5% would require 19 v1 pods + 1 v2 pod = 20 total pods.
**Explanation:** Native Kubernetes canary uses replica counts for traffic splitting, which is coarse-grained. For fine-grained percentage-based splitting (5%, 1%, 0.1%), you need a service mesh (Istio VirtualService/DestinationRule weights) or an Ingress controller that supports traffic weighting (nginx `canary-weight` annotation). Plan your canary strategy before committing to an infrastructure approach.

### Scenario 3 — "During a cluster upgrade, Kubernetes drained a node and took 4 out of 4 replicas of our API offline simultaneously."
**Question:** What Kubernetes object was missing?
**Answer:** A PodDisruptionBudget.
**Explanation:** Node drain honors PodDisruptionBudgets. If a PDB with `minAvailable: 2` had been in place, the drain would only evict pods one or two at a time, ensuring at least 2 were always running. Without a PDB, drain evicts as many pods as needed as fast as it can. Add a PDB to every production Deployment before the next maintenance window.
