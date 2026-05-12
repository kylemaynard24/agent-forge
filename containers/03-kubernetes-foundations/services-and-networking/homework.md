# Homework — Services and Networking

> If you're using pod IPs anywhere in your Kubernetes configuration, you're doing it wrong. Services exist so you never have to.

## Exercise: Two-Tier App Wired by Service Name

**Scenario:** You're deploying a two-component app: a simple HTTP frontend and an HTTP backend. The frontend must call the backend using the Kubernetes Service DNS name — not an IP, not a hostname from outside the cluster. You'll prove DNS resolution works, demonstrate that traffic routing survives a rolling update of the backend, and add a NodePort for external test access.

**Build:**

**Component 1 — Backend**

Create a Deployment (`backend`) with 3 replicas of `nginx:1.25-alpine`. Create a ClusterIP Service (`backend-svc`) that routes to it on port 80.

```yaml
# Skeleton — complete this
apiVersion: v1
kind: Service
metadata:
  name: backend-svc
  namespace: <your-namespace>
spec:
  selector:
    app: backend         # must match the Deployment pod template labels
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

**Component 2 — Frontend**

Create a Deployment (`frontend`) with 1 replica. The container should run a shell loop that calls `http://backend-svc/` every 5 seconds and logs the HTTP status code. Use `alpine:3.19` with `wget` or install `curl` in the startup command.

**Step 1 — Prove DNS resolution:**
```bash
kubectl exec -it <frontend-pod> -- nslookup backend-svc
```
Expected output includes the ClusterIP assigned to `backend-svc`.

**Step 2 — Prove cross-namespace DNS:**
Create the same backend in namespace `backend-ns`. From the frontend pod in `frontend-ns`, resolve it:
```bash
kubectl exec -it <frontend-pod> -n frontend-ns -- nslookup backend-svc.backend-ns
```
Prove the full name `backend-svc.backend-ns.svc.cluster.local` also works.

**Step 3 — Prove traffic survives a rolling update:**
While the frontend is calling the backend every 5 seconds, trigger a rolling update on the backend (`nginx:1.25-alpine` → `nginx:1.26-alpine`). Watch the frontend logs. Traffic should continue to return HTTP 200 throughout the rollout — no connection errors.

**Step 4 — Add a NodePort for external access:**
Create a NodePort Service (`backend-nodeport`) that exposes the backend on port 30081. Get a node IP (`kubectl get nodes -o wide`), and access it from your laptop: `curl http://<node-ip>:30081/`.

**Constraints:**
- Frontend must call backend by Service DNS name, not by ClusterIP (the IP will change if you recreate the Service; DNS won't)
- The rolling update step must show continuous HTTP 200 responses in frontend logs during the backend update — capture 10+ log lines spanning the update window
- NodePort must work from outside the cluster (your laptop)

## Stretch 1: Headless Service and StatefulSet DNS
Create a StatefulSet (`postgres-ss`, 1 replica, `postgres:16-alpine` image) with a headless Service (`postgres-headless`, `clusterIP: None`). From a debug pod, `nslookup postgres-headless` and observe that it returns a pod IP directly (not a ClusterIP). Also resolve `postgres-ss-0.postgres-headless` — this is how StatefulSet pods get stable, individual DNS names.

## Stretch 2: Network Policy for Isolation
Install a CNI plugin that supports NetworkPolicy (Calico, Cilium, or AKS with Azure CNI). Create a NetworkPolicy that allows ONLY the `frontend` app to reach `backend-svc`. Prove that a debug pod in the same namespace (but without the `app: frontend` label) cannot reach the backend. This is the Kubernetes equivalent of a firewall rule.

## Reflection

- You have 3 backend pods. The Service distributes requests across all 3. But your backend is stateful — some requests must hit the same pod. What's the Service configuration change that adds client-IP-based session stickiness?
- A developer adds a new pod with `app: backend` in the same namespace to test something. What happens to your Service's Endpoints? Is this a problem?
- Your LoadBalancer Service has an external IP. A network admin wants to restrict which source IPs can reach it. What Service field controls this?

## Done when

- [ ] Backend Deployment (3 replicas) and ClusterIP Service are created
- [ ] Frontend Deployment is created and calling backend by service name
- [ ] `kubectl exec <frontend-pod> -- nslookup backend-svc` succeeds and shows the ClusterIP
- [ ] Cross-namespace DNS is proven with the fully qualified name
- [ ] Frontend log output (10+ lines) captured during backend rolling update shows continuous HTTP 200
- [ ] NodePort Service created and accessed successfully from outside the cluster
- [ ] `kubectl get endpoints backend-svc` shows 3 pod IPs

---

## Clean Code Lens

**Principle in focus:** Dependency Inversion Principle

In application code, DIP says high-level modules should not depend on low-level modules — both should depend on abstractions. In Kubernetes networking, a Service is the abstraction. Your frontend (high-level) depends on the Service (`backend-svc`) rather than on specific pod IPs (low-level). The pods behind the Service are implementation details that can change freely — they're replaced on rolling updates, rescheduled to different nodes, and scaled up or down — without the frontend knowing or caring.

This is exactly why you must never use pod IPs in configuration or code. A pod IP is a low-level implementation detail. It couples your caller to a specific instance of a service. When that instance is replaced (and in Kubernetes it will be — frequently), the coupling breaks. The Service is the stable interface. It's the port that application code, configuration files, and other services should depend on.

The same principle applies to Service selectors. Your Service doesn't depend on a specific pod — it depends on a label set (`app: backend`). Any pod with that label can fulfill the contract. When you add replicas, you add more fulfillments of the contract, and the Service discovers them automatically. When you remove a pod, the Endpoints controller removes it from the Service's backend pool without any configuration change.

**Exercise:** Audit the environment variables and configuration files in a current or recent project. Find every hardcoded IP address. For each one, write a one-sentence explanation of what breaks when that IP changes, and what Service or DNS name should replace it.

**Reflection:** CoreDNS maps Service names to ClusterIPs in real time. If you create and then delete a Service with the same name, the ClusterIP changes. A running pod that cached the old ClusterIP will start failing. How do you prevent this in production, and what component would handle the cache invalidation problem automatically?
