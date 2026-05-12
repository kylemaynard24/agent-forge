# Pods and Containers

**Area:** Kubernetes Foundations

## Intent

Understand why Kubernetes groups containers into Pods rather than scheduling individual containers, and how to correctly specify pod behavior for production workloads.

## When to use

- When writing any Kubernetes manifest that runs application code
- When designing a sidecar for logging, proxying, or metrics scraping
- When debugging a pod that won't start or keeps restarting
- When setting resource requests and limits for a new service

## Why it matters

In Kubernetes, the unit of scheduling is not the container — it's the Pod. A pod is a group of one or more containers that share a network namespace and can share storage volumes. This matters because containers in the same pod communicate over localhost (not via service DNS), share the same IP address, and have direct access to any volumes the pod mounts.

The most common misunderstanding from Docker users is trying to think of one container = one pod as the only pattern. It is the most common pattern, but multi-container pods exist specifically for cases where two processes need to be tightly coupled — sharing a file, sharing a network socket, or having one process initialize the environment before another starts.

Understanding the pod as the atomic unit also explains why you should never deploy naked pods (pods created directly without a Deployment or StatefulSet). If a naked pod's node fails, the pod is gone and nothing recreates it. A Deployment's ReplicaSet controller ensures the desired replica count is always maintained — that's the contract you actually want.

## Core concepts

- **Pod** — one or more containers sharing the same network namespace (IP + ports) and optionally sharing volumes; scheduled as a unit to a single node
- **Shared network namespace** — all containers in a pod share the same IP address and can communicate with each other via localhost; they must not bind to the same port
- **Sidecar pattern** — a helper container in the same pod that augments the main container without changing it; classic examples: log forwarding agents (Fluentd, Fluent Bit), service mesh proxies (Envoy, Linkerd), certificate renewal agents
- **Ambassador pattern** — a sidecar that acts as a proxy to external services; the main container connects to localhost and the ambassador handles the real routing and protocol translation
- **Adapter pattern** — a sidecar that transforms the main container's output into a standard format; common for exposing metrics from apps that don't speak Prometheus format
- **Init containers** — containers that run to completion before any app container starts; used for waiting on dependencies (database readiness), seed data, configuration rendering, or file permission setup; if an init container fails, the pod restarts
- **Pod lifecycle phases** — `Pending` (scheduled but containers not yet running), `Running` (at least one container is running), `Succeeded` (all containers exited 0), `Failed` (at least one container exited non-zero and will not restart), `Unknown` (node communication lost)
- **`imagePullPolicy`** — `Always` (always pull from registry), `IfNotPresent` (use cached image if present), `Never` (only use cached); default is `IfNotPresent` for tagged images, `Always` for `:latest`
- **Resource requests** — the amount of CPU/memory the scheduler reserves on a node for this container; the pod will not be scheduled unless a node has this much available; expressed as `cpu: "250m"` (millicores) and `memory: "256Mi"`
- **Resource limits** — the maximum CPU/memory the container can use; a container that exceeds its memory limit is OOMKilled; a container that exceeds its CPU limit is throttled (not killed)
- **`emptyDir` volume** — a temporary volume created when a pod starts and deleted when it stops; shared by all containers in the pod; useful for sharing files between a sidecar and the main container
- **Naked pods** — pods created directly (not through a Deployment or StatefulSet); if the node fails, they are gone; only use for one-off debugging or jobs

## Common mistakes

- **Deploying naked pods for application workloads** — `kubectl run myapp --image=myapp:1.0` creates a naked pod; if the node is evicted or fails, your app is gone; always wrap application pods in a Deployment
- **Not setting resource requests** — a container without resource requests looks "free" to the scheduler, which packs it onto an already-busy node; this leads to OOMKilled containers and noisy-neighbor CPU throttling
- **Setting limits without requests** — limits without requests create containers that request 0 resources but try to use up to their limit; the scheduler makes poor placement decisions; always set both
- **Putting unrelated processes in the same pod** — the frontend and backend should not be in the same pod; they need to scale independently; use separate pods and Services instead
- **Not understanding that sidecar containers share the pod lifecycle** — if the main container crashes, all sidecars keep running (and potentially accumulating logs or metrics) until the pod is restarted

## Tiny example

Here is a two-container pod where a writer container creates a file and a reader container tails it — both sharing an `emptyDir` volume:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: writer-reader
spec:
  containers:
  - name: writer
    image: alpine:3.19
    command: ["/bin/sh", "-c"]
    args:
    - |
      while true; do
        echo "$(date) - hello" >> /shared/log.txt
        sleep 5
      done
    volumeMounts:
    - name: shared-data
      mountPath: /shared

  - name: reader
    image: alpine:3.19
    command: ["/bin/sh", "-c"]
    args: ["tail -f /shared/log.txt"]
    volumeMounts:
    - name: shared-data
      mountPath: /shared

  volumes:
  - name: shared-data
    emptyDir: {}
```

Both containers share `10.x.x.x:*` as their IP. The `emptyDir` volume is created at pod start, accessible to both, and destroyed when the pod is deleted.

## Run the demo

```bash
bash demo.sh
```

The demo creates a pod with multiple containers, shows the pod spec from the API server, runs an init container, and demonstrates `kubectl exec` for interactive debugging.

## Deeper intuition

Think of a pod as a co-located process group. On a traditional Linux server, you might run Nginx and a log forwarder as separate processes with a shared log directory. They're on the same machine, they share the filesystem, and they communicate locally. A pod is exactly that pattern, lifted into Kubernetes — except instead of processes, you have containers, and instead of a shared filesystem, you have volumes. The pod boundary defines the locality guarantee: everything inside a pod is as close as possible to each other, on the same node, with shared networking.

This is why the sidecar pattern makes sense: the log forwarder needs to be on the same node as the app to read its files. The service mesh proxy needs to intercept network traffic at the localhost level. These are local coupling requirements, and the pod is the Kubernetes answer to local coupling.

## Scenario questions

### Scenario 1 — "Our app pod keeps restarting and we can't figure out why"
**Question:** `kubectl get pods` shows `CrashLoopBackOff` with restart count 15. What do you check first?
**Answer:** `kubectl logs <pod-name>` for the current logs, `kubectl logs <pod-name> --previous` for the logs from the crashed container. Then `kubectl describe pod <pod-name>` for the exit code and OOMKilled status.
**Explanation:** `CrashLoopBackOff` means the container is starting, crashing (non-zero exit), and Kubernetes is applying exponential backoff before restarting it. The exit code tells you a lot: exit 137 means OOMKilled (raise memory limit), exit 1 means application error (check logs), exit 126/127 means bad ENTRYPOINT or command (check Dockerfile or pod spec command).

### Scenario 2 — "A pod is stuck in Init:0/1 for 10 minutes"
**Question:** Your pod has one init container and it's been `Init:0/1` for 10 minutes. How do you diagnose?
**Answer:** Check the init container logs: `kubectl logs <pod-name> -c <init-container-name>`. Common causes: waiting for a service that doesn't exist (`nslookup my-db` returns NXDOMAIN), a script that requires a secret that isn't mounted, or a health check command that's timing out.
**Explanation:** Init containers are sequential and blocking. If an init container doesn't exit 0, the main containers never start. The logs from the init container are the first place to look — they usually tell you exactly what it's waiting for.
