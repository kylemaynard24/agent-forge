# Deployments and ReplicaSets

**Area:** Kubernetes Foundations

## Intent

Use Deployments to run replicated, self-healing workloads with controlled rolling updates and instant rollback — without manually managing pods or replica counts.

## When to use

- Any stateless application workload that needs to stay running (APIs, web frontends, workers)
- When you need rolling updates with zero downtime
- When you want automatic pod restart on failure without writing any restart logic yourself
- When you need to quickly roll back a bad release

## Why it matters

A Deployment is the promise that your application stays running. You tell Kubernetes "I want 3 replicas of this pod, always." The Deployment controller watches that contract and enforces it continuously: if a pod crashes, the controller creates a replacement. If a node fails, the controller schedules pods on healthy nodes. If you push a bad image, you roll back with a single command and the previous version is live in seconds.

The three-layer hierarchy — Deployment → ReplicaSet → Pods — is not accidental complexity. It enables the rolling update pattern: Kubernetes creates a NEW ReplicaSet for the new version, scales it up gradually, and scales down the OLD ReplicaSet at the same pace. At any point during the rollout, both versions are running. If the new version fails readiness probes, the rollout pauses and you still have the old version serving traffic. This is the zero-downtime deployment model that Docker Compose simply cannot provide.

## Core concepts

- **Deployment** — the top-level resource; owns the rollout strategy and update history; what you apply and manage
- **ReplicaSet** — created and owned by the Deployment; owns a specific set of pods with a specific template hash; you almost never interact with ReplicaSets directly
- **Pod template** — the `spec.template` field in a Deployment; when this changes (image tag, env var, etc.), Kubernetes creates a new ReplicaSet with the new template
- **`replicas`** — the desired number of running pods; the ReplicaSet controller continuously reconciles the actual count to match this
- **Rolling update strategy** — the default update strategy; replaces pods incrementally so some old and some new pods run during the transition
- **`maxSurge`** — how many extra pods above the desired count are allowed during a rollout (e.g., `maxSurge: 1` on a 3-replica deployment allows temporarily 4 pods); default is 25%
- **`maxUnavailable`** — how many pods below the desired count are allowed during a rollout; `maxUnavailable: 0` means no pods are taken down until a new one is ready; default is 25%
- **`minReadySeconds`** — how long a newly created pod must be ready (passing readiness probes) before the rollout considers it healthy and proceeds; defaults to 0, which means the rollout proceeds as soon as the container starts
- **`progressDeadlineSeconds`** — how long Kubernetes waits for the rollout to make progress before marking it Failed; default 600s
- **`kubectl rollout status`** — streams the rollout progress; exits 0 on success, non-zero on failure; essential for CI pipelines
- **`kubectl rollout undo`** — rolls back to the previous ReplicaSet; can target a specific revision with `--to-revision=N`
- **`kubectl rollout history`** — lists revision numbers and the `CHANGE-CAUSE` annotation (set via `kubernetes.io/change-cause` annotation)
- **`kubectl rollout pause` / `kubectl rollout resume`** — pauses a rollout mid-flight (useful for canary validation) and resumes it
- **`kubectl scale`** — changes the replica count without changing the pod template (no new ReplicaSet created)
- **Canary deployment** — a pattern (not a built-in feature) where you run two Deployments side by side — one for 90% of traffic (stable), one for 10% (canary) — by sharing a common label that a Service selector matches

## Common mistakes

- **Editing a ReplicaSet directly** — ReplicaSets are owned by Deployments; any change you make to a ReplicaSet will be immediately overwritten by the Deployment controller
- **Not setting `minReadySeconds`** — without it, a pod is considered ready the moment its containers start, even if it takes 10 more seconds for the app to actually initialize; `minReadySeconds: 30` gives the app time to warm up before traffic is shifted to it
- **Not reading rollout status in CI** — `kubectl apply -f deployment.yaml` returns as soon as the API server accepts the object, not when the rollout completes; always follow with `kubectl rollout status` in a CI pipeline
- **Using `kubectl replace` instead of `kubectl apply`** — `replace` is destructive (deletes and recreates), `apply` is declarative (patches the diff); use `apply` for everything
- **Deleting pods to force a "refresh"** — deleting pods when you want a new image deployed doesn't help unless you change the image tag; Kubernetes recreates the exact same pods from the same template

## Tiny example

A minimal Deployment for a web API:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapi
  annotations:
    kubernetes.io/change-cause: "Bump to v1.4.2 — fixes connection pool leak"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapi
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0  # never take a pod down until a new one is ready
  minReadySeconds: 30
  template:
    metadata:
      labels:
        app: myapi
    spec:
      containers:
      - name: api
        image: myregistry.azurecr.io/myapi:1.4.2-a3f9c12
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: "250m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        readinessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
```

With `maxUnavailable: 0`, this rollout never takes a pod down until a replacement is ready, passing readiness probes, and has been stable for `minReadySeconds` seconds.

## Run the demo

```bash
bash demo.sh
```

The demo creates a Deployment, scales it, triggers a rolling update, watches the rollout status, simulates a bad deploy with a nonexistent image tag, observes the failure, and rolls back.

## Deeper intuition

The ReplicaSet is not just an implementation detail — it's what makes rollback instant. When you update a Deployment, Kubernetes creates a new ReplicaSet but doesn't delete the old one immediately. The old ReplicaSet is scaled to 0 but kept in the cluster. When you run `kubectl rollout undo`, Kubernetes simply scales the old ReplicaSet back up and the new one back down. No image pulling, no rebuilding — the old pods restart from cached images on the same node pool. This is why rollback is fast: it's not a redeploy, it's a scale operation.

The default history limit (controlled by `revisionHistoryLimit`, default 10) determines how many old ReplicaSets are kept. If you set it to 0, you save etcd space but lose the ability to roll back without redeploying.

## Scenario questions

### Scenario 1 — "We pushed a bad image tag and pods are failing — we need this fixed in 2 minutes"
**Question:** The rollout is 40% complete, the new pods are `ImagePullBackOff`, and old pods are still running. What do you do?
**Answer:** `kubectl rollout undo deployment/myapi` — this scales the new (broken) ReplicaSet back to 0 and the old ReplicaSet back to the desired replica count. The old pods were never fully terminated, so they come back online immediately.
**Explanation:** This is the exact scenario `kubectl rollout undo` was designed for. Because `maxUnavailable: 0`, you still have old pods serving traffic during the failed rollout. The undo completes in seconds because no new image pull is needed.

### Scenario 2 — "We want to test a new version of the service with 10% of traffic before fully rolling it out"
**Question:** How do you implement a canary in Kubernetes without a service mesh?
**Answer:** Run two Deployments: `myapi-stable` with 9 replicas and `myapi-canary` with 1 replica. Both use the same label (`app: myapi`). The Service selector matches `app: myapi` and distributes traffic across all 10 pods — roughly 90/10.
**Explanation:** Kubernetes Services load-balance across all matching pods regardless of which Deployment owns them. By controlling the ratio of stable-to-canary replicas, you control the traffic split. When the canary is validated, scale stable to the new image and delete the canary Deployment. The downside vs a service mesh is that the split is by pod count, not by request percentage — with small replica counts, the distribution is approximate.
