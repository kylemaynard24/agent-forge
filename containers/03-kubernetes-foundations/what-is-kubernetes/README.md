# What Is Kubernetes

**Area:** Kubernetes Foundations

## Intent

Understand the architecture of a Kubernetes cluster — what the control plane does, what worker nodes do, and how the declarative reconciliation model makes self-healing and rolling updates possible.

## When to use

- Before touching any Kubernetes resource — the mental model here underlies every other concept in this section
- When you're debugging a mysterious cluster behavior and need to know which component to look at
- When you need to explain to a colleague why Kubernetes behaves the way it does

## Why it matters

Kubernetes is not a container runner. Docker runs containers. Kubernetes is a state reconciliation engine that happens to run containers as a side effect. When you understand this distinction, every Kubernetes behavior becomes predictable. Pods restart because the desired state says there should be N replicas and the actual state has N-1. Deployments roll out gradually because the rolling update strategy defines the pace of reconciliation. Nodes get evicted when they're out of resources because the scheduler's job is to maintain desired state across the available capacity.

Without this mental model, Kubernetes feels like magic that sometimes fails mysteriously. With it, every behavior has a cause you can find and a fix you can apply.

## Core concepts

- **Control plane** — the brains of the cluster; runs on dedicated nodes (or is managed for you in AKS, EKS, GKE); contains the API server, etcd, controller manager, and scheduler
- **API server (`kube-apiserver`)** — the single entry point for all cluster operations; validates and persists every resource change to etcd; all other components communicate through the API server, not directly with each other
- **etcd** — a distributed key-value store that holds the entire cluster state; the source of truth; losing etcd without a backup means losing the cluster state entirely
- **Controller manager (`kube-controller-manager`)** — runs a collection of controllers (Deployment controller, ReplicaSet controller, Node controller, etc.); each controller watches the API server for its resource type and takes action to bring actual state in line with desired state
- **Scheduler (`kube-scheduler`)** — watches for newly created Pods with no assigned node and selects the best node based on resource requests, affinity rules, taints, and tolerations
- **Worker node** — a machine (VM or physical) that runs your workloads; managed by the control plane
- **kubelet** — the agent running on each worker node; watches the API server for Pods assigned to its node and instructs the container runtime to start or stop containers accordingly
- **kube-proxy** — runs on each worker node; maintains iptables or ipvs rules that implement Service routing (ClusterIP, NodePort)
- **Container runtime** — the software that actually runs containers; containerd is the default in modern Kubernetes (Docker was removed as a runtime in 1.24)
- **Declarative model** — you describe the desired state (3 replicas of this image) in a manifest and apply it; Kubernetes continuously compares actual vs desired state and takes corrective action
- **Reconciliation loop** — the core pattern: watch for desired state, observe actual state, compute the diff, take action to close the diff, repeat forever
- **`kubectl`** — the command-line client for the Kubernetes API; it sends HTTP requests to the API server; it has no direct contact with pods or nodes
- **kubeconfig** — a YAML file (default: `~/.kube/config`) that stores cluster connection information (API server URL, credentials, CA cert) and context names; `kubectl config use-context` switches between clusters

## Common mistakes

- **Thinking `kubectl` is talking to pods directly** — kubectl talks to the API server only; if the API server is unreachable, kubectl fails, but your pods may still be running fine
- **Confusing desired state with actual state** — `kubectl get deployment` shows the desired replica count; `kubectl get pods` shows what's actually running; they can diverge during rollouts or when the cluster has resource pressure
- **Assuming control plane components are on worker nodes** — in managed Kubernetes (AKS, EKS), the control plane is invisible to you; you see only worker nodes; in self-managed clusters, control plane nodes are separate and should not run workloads
- **Editing etcd directly** — never edit etcd; all changes go through the API server, which validates them and writes to etcd; direct etcd edits bypass validation and can corrupt cluster state

## Tiny example

When you run `kubectl apply -f deployment.yaml`, here is the exact chain of events:

1. `kubectl` reads `deployment.yaml`, sends an HTTP POST/PUT to the API server
2. The API server validates the manifest (schema, admission webhooks), then writes the Deployment object to etcd
3. The Deployment controller (inside `kube-controller-manager`) sees the new Deployment and creates a ReplicaSet
4. The ReplicaSet controller sees the new ReplicaSet and creates Pod objects (no node assigned yet)
5. The scheduler sees the unscheduled Pods and selects nodes, updating each Pod's `spec.nodeName` field in etcd via the API server
6. The kubelet on each selected node sees a Pod assigned to it, pulls the image (if not cached), and starts the container via containerd
7. The kubelet reports pod status back to the API server, which stores it in etcd
8. `kubectl get pods` reads the current pod objects from etcd via the API server and displays them

Every step is asynchronous. The `kubectl apply` command returns as soon as the API server accepts the object — your pods may not be running for another 30–60 seconds.

## Run the demo

```bash
bash demo.sh
```

The demo walks through `kubectl cluster-info`, node inspection, listing system pods to identify control plane components, and exploring available API resources.

## Deeper intuition

The reconciliation loop is the most important idea in Kubernetes. Every controller runs a loop that looks like this in pseudocode:

```
loop forever:
  desired = read desired state from API server
  actual  = observe actual state (running pods, endpoints, etc.)
  if desired != actual:
    take action to close the gap
  sleep briefly
  repeat
```

This means Kubernetes is eventually consistent. You apply a change, and the system converges toward your desired state. How fast it converges depends on the controllers involved and the available resources. If convergence never happens (a pod is stuck Pending because there's no node with enough CPU), the controller keeps trying — it will never give up silently.

## Scenario questions

### Scenario 1 — "Why can't I just use Docker Compose in production?"
**Question:** A colleague argues that Docker Compose is simpler and works for them locally. Why is it insufficient for production?
**Answer:** Docker Compose runs on a single host. If that host fails, everything goes down. It has no cross-node scheduling, no built-in health-based restart, no rolling update strategy, and no integration with cloud networking or storage.
**Explanation:** The key difference is that Kubernetes is designed for failure as a normal operating condition. Node failures, pod crashes, and network partitions are expected and handled. Compose has no such model — it assumes the host is healthy and available, which is not a valid assumption for production infrastructure.

### Scenario 2 — "What does Kubernetes actually DO when I apply a manifest?"
**Question:** Trace the path from `kubectl apply -f my-deployment.yaml` to pods running on nodes.
**Answer:** kubectl → API server (validates + writes to etcd) → Deployment controller (creates ReplicaSet) → ReplicaSet controller (creates Pods) → Scheduler (assigns Pods to nodes) → kubelet on each node (pulls image + starts container via containerd).
**Explanation:** Understanding this chain tells you where to look when something goes wrong. Pod stuck Pending? Look at scheduler events. Pod created but container not starting? Look at kubelet events and container runtime logs. API server rejecting the manifest? Check for admission webhook errors or schema violations.
