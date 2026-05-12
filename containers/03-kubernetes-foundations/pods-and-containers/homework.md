# Homework — Pods and Containers

> The pod is not a container — it's a co-location contract. Once you feel that distinction in your hands, multi-container design starts to make sense.

## Exercise: Two Containers, One Shared Volume, One Init Gate

**Scenario:** You're building an infrastructure for a batch processing job. Before the main processing container starts, an init container must perform setup (simulated here as writing a configuration seed file). Two app containers then share a volume: one writes data, the other reads and validates it. You need to prove the entire lifecycle works with `kubectl logs`.

**Build:** A single pod manifest that demonstrates three concepts simultaneously:
1. An init container that writes a file to a shared volume before the main containers start
2. A writer container that appends timestamped messages to a shared log file
3. A reader container that tails the same file (proving the shared volume works)

**The manifest you should write (`shared-volume-pod.yaml`):**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: shared-volume-demo
spec:
  # Your init container here: name="initializer", image=alpine:3.19
  # Command: sleep 5, then write "ready" to /data/status.txt
  initContainers: []  # fill this in

  containers:
  # writer: appends "message N at <date>" to /data/messages.txt every 2 seconds
  # reader: reads /data/status.txt on start (proving init ran first), then tails /data/messages.txt
  # Both mount the same emptyDir volume at /data
  - name: placeholder
    image: alpine:3.19
    command: ["sleep", "1"]
```

Fill in the manifest completely. Add resource requests to every container (`cpu: 50m`, `memory: 32Mi`).

**Constraints:**
- The init container must exit 0 before either app container starts — prove this by having the reader check for `/data/status.txt` on startup and print an error if it doesn't exist
- Both app containers must mount the SAME volume — a single `emptyDir` named `data-vol`
- Do NOT use a Deployment — this is a naked pod exercise, specifically to understand the difference
- Run the pod for at least 30 seconds and capture logs from all three containers (init, writer, reader)

**Proof required:**
```bash
kubectl logs shared-volume-demo -c initializer    # shows init ran and wrote status.txt
kubectl logs shared-volume-demo -c writer          # shows messages being written
kubectl logs shared-volume-demo -c reader          # shows status.txt was found + messages being tailed
```

**After completing the exercise:** delete the pod with `kubectl delete pod shared-volume-demo`. Then try to figure out: if a node failed and the pod was on that node, would it come back? Why not? What would you need to add to your setup to make it resilient?

## Stretch 1: Add a Liveness Probe
Add a liveness probe to the writer container that checks whether `/data/messages.txt` has been written to in the last 30 seconds. If the writer stops writing (simulated by a `sleep` that's too long), the probe should fail and Kubernetes should restart the container. Observe the restart with `kubectl get pod --watch`.

## Stretch 2: Ambassador Sidecar
Replace the reader container with an ambassador-pattern sidecar: instead of reading the file directly, the reader exposes the last 10 lines of `/data/messages.txt` over HTTP on port 8080 (use `nc` or a tiny Python HTTP server). Prove you can access it via `kubectl port-forward`.

## Reflection

- You have two containers in a pod. Container A crashes (exits 1). What happens to Container B? Does the pod restart?
- Your init container runs `nslookup my-database-service` to wait until a Service exists. The Service doesn't exist yet. What happens to the pod, and how long will it wait?
- You realize your app and its log forwarder should NOT be in the same pod after all — they need to scale independently. How do you redesign this without losing the log forwarding capability?

## Done when

- [ ] `shared-volume-pod.yaml` is complete with init container, writer, and reader
- [ ] Both app containers mount the same `emptyDir` volume
- [ ] Resource requests are set on all containers
- [ ] Pod runs successfully (`kubectl get pod shared-volume-demo` shows `Running`)
- [ ] All three log captures are included (`kubectl logs` for init, writer, reader)
- [ ] Reader logs show it found `/data/status.txt` (proving init ran first)
- [ ] Written explanation of why a naked pod won't recover from node failure

---

## Clean Code Lens

**Principle in focus:** Open/Closed Principle — open for extension, closed for modification

In application code, OCP means you add behavior through extension (new classes, new implementations) rather than modification (changing existing code). The sidecar pattern is the container-level embodiment of this principle. Your application container is closed for modification — you don't change the app to add log forwarding, metrics scraping, or TLS termination. Instead, you extend the pod with a sidecar container that adds those capabilities alongside the unchanged application.

This has a profound operational benefit: you can add, upgrade, or replace infrastructure sidecars (a Fluentd version bump, a new Envoy release, a certificate renewal agent) without touching application code or requiring an application deployment. The app team and the platform team can move independently. The application container is the closed unit; the sidecar is the extension mechanism.

The same principle applies to init containers. Rather than baking initialization logic into your application startup sequence (which couples your app to infrastructure concerns), you put it in an init container that runs before your app is even aware the pod exists. Your app opens to ready-state concerns only; infrastructure readiness is handled externally.

**Exercise:** Identify a cross-cutting concern in your current or recent project (logging, tracing, configuration reloading, certificate management). Write a 2-paragraph design note on whether this concern belongs in the application code, an init container, or a sidecar — and why. What interface (shared volume path, localhost port, environment variable) would the sidecar use to communicate with the main container?

**Reflection:** The sidecar pattern increases the number of containers per pod, which increases resource requests and complexity. At what point does a sidecar become the wrong pattern, and what would you use instead (hint: DaemonSet, node-level agent)?
