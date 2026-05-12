# Services and Networking

**Area:** Kubernetes Foundations

## Intent

Expose pods to other workloads inside and outside the cluster using stable DNS names and load-balanced endpoints that survive pod restarts and rolling updates.

## When to use

- Every time you need one workload to call another (ClusterIP)
- When you need external access for testing or development (NodePort)
- When you need a cloud load balancer for production external traffic (LoadBalancer)
- When you need stable DNS for a StatefulSet (headless Service)

## Why it matters

Pods are ephemeral. Their IPs change every time they restart, reschedule, or are replaced by a rolling update. If Service A hard-codes Service B's pod IP, it will break the next time B's pod is replaced. Services solve this by providing a stable virtual IP (ClusterIP) and a stable DNS name that always resolve to the currently healthy pods behind them. A Service is not a proxy you deploy — it's a routing rule that kube-proxy maintains in the kernel's iptables on every node.

Understanding Services is non-negotiable for building anything with more than one component in Kubernetes. The frontend calls the backend by Service name (`http://backend-svc/api/v1/...`), and Kubernetes handles routing to whichever backend pod is currently healthy, regardless of how many times those pods have restarted.

## Core concepts

- **ClusterIP** — the default Service type; assigns a stable virtual IP reachable only inside the cluster; paired with a DNS name in CoreDNS; cannot be accessed from outside the cluster
- **NodePort** — exposes the Service on a static port (30000–32767) on every node's IP; accessible from outside the cluster by hitting any node IP on that port; useful for local development but not for production (doesn't go through a cloud load balancer, no TLS, ties to node IPs)
- **LoadBalancer** — creates a cloud load balancer (Azure Load Balancer on AKS, ELB on EKS) and assigns it an external IP; the standard production mechanism for external HTTP/HTTPS traffic; more expensive than NodePort because it provisions a cloud resource per Service
- **ExternalName** — maps a Service name to an external DNS name; useful for pointing cluster workloads at services outside the cluster (e.g., a managed database) using the same Service DNS pattern
- **kube-proxy** — runs on each node and programs iptables (or ipvs) rules to route traffic destined for a ClusterIP to one of the healthy pod IPs; no per-request proxying — it's pure kernel routing
- **iptables mode** — the default kube-proxy mode; uses random selection across pod IPs via DNAT rules; not efficient at very high connection counts
- **ipvs mode** — an alternative kube-proxy mode; uses a dedicated load-balancing kernel module; more efficient at scale; configurable algorithms (round-robin, least connections, etc.)
- **CoreDNS** — the cluster DNS server; runs as a Deployment in `kube-system`; resolves Service names to ClusterIPs; automatically populated when a Service is created
- **DNS name format** — `<service-name>.<namespace>.svc.cluster.local`; within the same namespace you can use just `<service-name>`; across namespaces you need the full qualified name or at least `<service-name>.<namespace>`
- **Endpoints** — an automatically managed resource that lists the IP:port of every healthy pod matching the Service selector; kube-proxy reads Endpoints to know where to route traffic
- **EndpointSlice** — the modern replacement for Endpoints (Kubernetes 1.21+); more efficient for large numbers of pods; automatically created alongside Services
- **Selector** — the label query on a Service that determines which pods are in the Endpoints list; a pod must have ALL the selector labels to be included
- **Headless Service** — a Service with `clusterIP: None`; DNS returns the individual pod IPs instead of a single ClusterIP; used for StatefulSets where clients need to connect to a specific pod (e.g., a specific database replica)

## Common mistakes

- **Using NodePort in production** — NodePort ties you to specific node IPs, doesn't integrate with cloud load balancers, and has a non-standard port range; use LoadBalancer or an Ingress controller for production external traffic
- **Not understanding that service selectors are label-based** — a Service with `selector: app: myapp` will include ALL pods with `app: myapp` in the cluster, regardless of Deployment; this is a feature, but also a gotcha if you have pods with the same label in the same namespace that shouldn't receive traffic
- **Connecting to pod IPs directly** — pod IPs change; hardcoding or saving a pod IP is always wrong in Kubernetes; always use the Service DNS name
- **Expecting Sessions/Affinity by default** — Services by default use random selection (stateless); if your app requires session affinity, set `sessionAffinity: ClientIP` on the Service
- **Forgetting to check the port name/number match** — a Service's `port` is what callers use; `targetPort` is what the container listens on; they must match the container's `containerPort` or the traffic silently drops

## Tiny example

Frontend calling backend by Service name:

```yaml
# backend Service
apiVersion: v1
kind: Service
metadata:
  name: backend-svc
  namespace: myapp
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 8080  # container listens on 8080, but callers use port 80
  type: ClusterIP     # only reachable inside the cluster
```

Frontend container environment or code uses: `http://backend-svc/api/v1/...`

Kubernetes DNS resolves `backend-svc` → ClusterIP → kube-proxy routes to a backend pod at :8080.

If a backend pod restarts and gets a new IP, the Endpoints object is automatically updated. The ClusterIP doesn't change. The frontend code doesn't change. Nothing breaks.

## Run the demo

```bash
bash demo.sh
```

The demo creates a ClusterIP Service, proves DNS resolution from inside the cluster, creates a LoadBalancer Service (on AKS this provisions an Azure LB), and shows `kubectl get endpoints` and `kubectl describe service`.

## Deeper intuition

A Service is a forwarding rule, not a running process. When you create a ClusterIP Service, nothing new starts running. kube-proxy on every node adds iptables rules that say "for any traffic destined for 10.96.0.50:80, randomly DNAT to one of {10.244.1.5:8080, 10.244.2.3:8080, 10.244.3.7:8080}." Those backend IPs come from the Endpoints object, which is updated every time a pod's readiness state changes.

This is why a Service with no matching pods (wrong label selector, all pods failing readiness) still has a ClusterIP and a DNS name — but connections to it time out. The ClusterIP exists, but the iptables rules have no backend IPs to forward to. `kubectl get endpoints <svc-name>` will show an empty `ENDPOINTS` column in this case. That's your first debugging stop when a Service isn't working.

## Scenario questions

### Scenario 1 — "Our frontend can't reach the backend by service name"
**Question:** `curl http://backend-svc` from a frontend pod returns "Could not resolve host." What do you check?
**Answer:** First check `kubectl get endpoints backend-svc` — are there any IPs listed? If not, the selector isn't matching any pods. Then check `kubectl get pods -l app=backend` — do the pods exist and are they Ready? Then check `kubectl exec -it <frontend-pod> -- nslookup backend-svc` — does CoreDNS resolve it? Also verify the namespace: if frontend and backend are in different namespaces, use `backend-svc.backend-namespace`.
**Explanation:** DNS works → check selector → check pod readiness → check namespace is the diagnostic ladder. Most "service not reachable" issues are either a label mismatch between the Service selector and the pod labels, or pods failing readiness probes and being excluded from Endpoints.

### Scenario 2 — "We have a LoadBalancer Service but it's stuck in 'Pending' for the external IP"
**Question:** `kubectl get service myapp-lb` shows `EXTERNAL-IP: <pending>` after 10 minutes. What's happening?
**Answer:** On AKS, a LoadBalancer Service triggers the cloud-controller-manager to provision an Azure Load Balancer and assign a public IP. If it's stuck, check: does the AKS cluster have permissions to create Azure resources in its resource group? Is there a quota limit on public IPs? Is the cluster network policy blocking the provisioning? Check `kubectl describe service myapp-lb` for events.
**Explanation:** `<pending>` means the cloud provider hasn't fulfilled the load balancer request yet. It's almost always a cloud-level issue — quota, permissions, or a misconfigured cluster identity — not a Kubernetes issue.
