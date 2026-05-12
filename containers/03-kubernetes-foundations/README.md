# Kubernetes Foundations

Move from running one container to orchestrating many across a cluster.

This section comes **after** Docker — you know how to build and run containers locally, now learn how Kubernetes takes those containers and runs them reliably at scale across a fleet of machines. The mental shift is significant: you stop thinking about "run this container on this machine" and start thinking about "declare what I want, let the system figure out how."

## Contents

- [what-is-kubernetes/](what-is-kubernetes/) — Understand the control plane, worker nodes, and the declarative reconciliation model that makes Kubernetes work
- [pods-and-containers/](pods-and-containers/) — The Pod is Kubernetes' atomic unit — not the container — and understanding why changes how you design workloads
- [deployments-and-replicasets/](deployments-and-replicasets/) — Manage replicated, self-healing, rolling-update-capable workloads through the Deployment abstraction
- [services-and-networking/](services-and-networking/) — Expose workloads inside and outside the cluster using stable DNS names and load-balanced endpoints
- [configmaps-and-secrets/](configmaps-and-secrets/) — Separate configuration from application code and inject it safely at runtime
- [namespaces-and-rbac/](namespaces-and-rbac/) — Divide a cluster into logical boundaries and control who can do what with Role-Based Access Control
- [storage-in-kubernetes/](storage-in-kubernetes/) — Persist data beyond the pod lifecycle using PersistentVolumes, PersistentVolumeClaims, and StorageClasses

## How to use this section

Each topic has three artifacts:
1. **`README.md`** — the concept and why it matters
2. **`demo.sh`** — annotated shell commands you can run
3. **`homework.md`** — a constrained exercise

## How to know this section is working

- You can apply a Deployment manifest, watch a rolling update succeed, and roll it back — without looking anything up
- You can explain the path from `kubectl apply` to a running pod in terms of the specific control plane components involved
- You can debug a pod that's stuck in `Pending` or `CrashLoopBackOff` without guessing — you know which commands to run and what to look for

## Question-driven orientation

### Scenario 1 — "Why can't we just use Docker Compose in production?"
**Question:** Your team runs everything with `docker-compose up`. The manager asks why you need Kubernetes. What's your answer?
**Answer:** Docker Compose runs containers on a single host. Kubernetes runs them across a fleet of machines, reschedules them if a node fails, rolls out updates without downtime, scales replicas on demand, and integrates with cloud load balancers, storage, and identity systems.
**Explanation:** Compose is a great local development and single-host tool. It has no concept of node failure, no built-in load balancing, no rolling update strategy, and no cluster-wide resource management. Kubernetes addresses every one of those gaps — at the cost of significantly higher operational complexity. The question isn't "is Kubernetes better than Compose?" — it's "do my operational requirements exceed what Compose can handle?" For most production workloads serving real traffic across redundant infrastructure, they do.

### Scenario 2 — "A pod is stuck in Pending — what do you do?"
**Question:** `kubectl get pods` shows your pod in `Pending` state for 10 minutes. Walk through your diagnosis.
**Answer:** Run `kubectl describe pod <name>` and read the `Events` section at the bottom. The most common causes are: insufficient CPU/memory on available nodes (Insufficient cpu), a PVC that hasn't been bound (volume not found), a node selector or toleration mismatch (no nodes match), or an image pull failure (ErrImagePull).
**Explanation:** `kubectl describe` is your first tool for almost every pod-level problem. It aggregates the scheduler events, kubelet events, and object conditions into one readable output. Most pending issues are either resource pressure (add nodes or lower requests) or misconfiguration (fix node selectors, fix PVC, fix image name).

### Scenario 3 — "We accidentally deleted the Deployment but the pods are still running — what happens next?"
**Question:** If a Deployment is deleted but the pods it owns are still running, what does Kubernetes do?
**Answer:** Kubernetes garbage-collects the orphaned pods. The Deployment owned a ReplicaSet which owned the Pods. When the Deployment is deleted, the ReplicaSet is deleted, and the pods are terminated — typically within seconds.
**Explanation:** Kubernetes uses owner references to track object relationships. When a parent object is deleted, the garbage collector finds all objects with that owner reference and removes them. This is why you should never manually delete ReplicaSets or edit pods owned by a Deployment — the owning controller will immediately reconcile back to the desired state and your manual change will be overwritten or the object will be recreated.
