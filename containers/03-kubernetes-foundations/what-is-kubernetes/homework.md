# Homework — What Is Kubernetes

> You can memorize every kubectl command and still be confused by Kubernetes until you internalize the reconciliation model — that's the exercise here.

## Exercise: Map the Cluster and Trace the Apply Path

**Scenario:** You've joined a team that uses AKS in production. The platform lead wants you to demonstrate that you understand how the cluster works, not just how to copy-paste manifests. Your task is to produce two artifacts: a system map and a traced apply sequence.

**Build:**

**Part 1 — Draw the cluster architecture**

In plain text (ASCII art or a structured text file), draw the relationship between these components and label what each does:

```
Control Plane
├── kube-apiserver
├── etcd
├── kube-controller-manager
│   ├── Deployment Controller
│   ├── ReplicaSet Controller
│   └── Node Controller
└── kube-scheduler

Worker Node
├── kubelet
├── kube-proxy
└── container runtime (containerd)
```

For each component, write one sentence: "When [event], this component [action]."

Example: "When a new Pod with no assigned node appears in etcd, the scheduler selects the best available node and writes `spec.nodeName` to the Pod object."

**Part 2 — Run cluster inspection commands**

Connect to any Kubernetes cluster (minikube, kind, Docker Desktop, or AKS). Run the following and capture the output:

```bash
kubectl cluster-info
kubectl get nodes -o wide
kubectl get pods -n kube-system
kubectl api-resources | head -20
```

Identify at least 3 control plane components visible in `kube-system` pods. If you're on a managed cluster and can't see them, explain why (hint: managed control planes are not visible — they run in the cloud provider's infrastructure).

**Part 3 — Trace an apply event**

Apply this minimal manifest to your cluster:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: trace-test
  labels:
    purpose: tracing
spec:
  containers:
  - name: sleep
    image: alpine:3.19
    command: ["sleep", "300"]
    resources:
      requests:
        cpu: "50m"
        memory: "32Mi"
```

Then answer these questions based on what you observe:
- Which node was selected for this pod? (`kubectl get pod trace-test -o wide`)
- Why did the scheduler choose that node? (`kubectl describe node <name>` → look at allocatable resources)
- What events occurred from creation to Running? (`kubectl describe pod trace-test` → Events section)
- What happens if you manually delete the pod? (Try it — `kubectl delete pod trace-test`) Does anything recreate it? Why not?

Clean up: `kubectl delete pod trace-test`

**Constraints:**
- Part 1 must include the one-sentence description for all 7 components listed
- Part 3 must include the actual output from `kubectl describe pod trace-test`, not a paraphrase
- The answer to "what happens if you delete the pod" must reference the reconciliation model and owner references

## Stretch 1: Explore etcd Directly
If you're running a self-managed cluster (minikube or kind), `kubectl exec` into the etcd pod in `kube-system` and use `etcdctl` to read the stored state for your pod:
```bash
ETCDCTL_API=3 etcdctl get /registry/pods/default/trace-test --prefix
```
What format is the data stored in? What does this tell you about how etcd works?

## Stretch 2: Simulate a Controller
Write a bash script (or a Python script using the Kubernetes Python client) that does what a controller does: watch for pods with the label `purpose: demo` and print a message whenever one is created or deleted. This is the core loop of every Kubernetes controller.

## Reflection

- `kubectl apply` returns almost immediately. Your pod might not be running for 45 more seconds. What is happening during that gap, and which component is responsible for each step?
- If the `kube-scheduler` crashes, what happens to already-running pods? What happens to new pods that need to be scheduled?
- In a managed cluster like AKS, you don't have access to the control plane nodes. Why is this actually a benefit for most teams, and what do you lose compared to self-managed Kubernetes?

## Done when

- [ ] Architecture diagram (text file or ASCII) is written with one-sentence descriptions for all 7 components
- [ ] `kubectl get pods -n kube-system` output is captured and at least 3 components are identified and explained
- [ ] `trace-test` pod manifest has been applied and the full `kubectl describe pod trace-test` output is captured
- [ ] The apply-to-running sequence is written out step by step with component names
- [ ] The pod deletion experiment has been completed and the answer references owner references and reconciliation

---

## Clean Code Lens

**Principle in focus:** Separation of Concerns

In application code, SoC means each module handles one thing: HTTP routing, business logic, data access. In Kubernetes, the architecture embodies this principle at the infrastructure level. The API server handles validation and persistence — it doesn't schedule. The scheduler handles placement — it doesn't run containers. The kubelet runs containers — it doesn't schedule or validate manifests. The controller manager reconciles state — it doesn't talk to container runtimes.

This separation is not accidental. It makes each component independently scalable, independently testable, and independently replaceable. You can swap the container runtime from Docker to containerd to cri-o without changing the API server. You can write a custom scheduler without touching the kubelet. This is the same reason you don't write SQL in your HTTP route handler — the separation is what makes the system comprehensible and evolvable.

When you understand that Kubernetes is a collection of cooperating processes, each with one job, communicating only through the API server, you understand why failures are isolatable and why the system is resilient to partial failure. The scheduler crashing doesn't kill running pods. The controller manager restarting doesn't affect the API server's ability to serve reads.

**Exercise:** Pick one Kubernetes controller (Deployment, ReplicaSet, or Node controller) and write a 3-sentence description of its single responsibility: what it watches, what condition triggers it, and what action it takes. Then explain what would break if this controller's responsibility bled into another component's domain.

**Reflection:** Kubernetes controllers communicate exclusively through the API server — no controller talks directly to another. What coordination problems does this solve? What new problems does it introduce?
