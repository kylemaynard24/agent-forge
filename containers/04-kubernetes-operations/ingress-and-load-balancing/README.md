# Ingress and Load Balancing

**Area:** Kubernetes Operations

## Intent

Route external HTTP/HTTPS traffic into your cluster through a single entry point that handles TLS termination, host and path routing, and rewrite rules — instead of provisioning a separate cloud load balancer for every service.

## When to use

- Any time you need to expose HTTP or HTTPS services externally — use Ingress by default
- `type: LoadBalancer` on a Service is appropriate for a non-HTTP protocol (TCP, UDP, gRPC without HTTP routing) or when you specifically need a dedicated IP address
- On AKS, consider AGIC (Azure Application Gateway Ingress Controller) when you need WAF, Azure-native DDoS protection, or SSL offload at the Azure layer

## Why it matters

Every `type: LoadBalancer` Service on AKS provisions an Azure Load Balancer with a dedicated public IP address. At $0.005/hour per IP plus LB rules, 20 microservices costs real money. More importantly, every additional load balancer is an additional point of TLS certificate management, IP allowlisting, and WAF policy.

An Ingress controller replaces all of that with one load balancer, one IP, and one certificate authority. The routing logic lives in Kubernetes Ingress resources — readable, version-controlled, and deployable with `kubectl apply`. TLS can be automated via cert-manager so certificates rotate without manual intervention.

## Core concepts

- **Ingress resource** — a Kubernetes object that defines routing rules (host, path → Service); it is just data — it does nothing without an Ingress controller
- **Ingress controller** — a pod running in the cluster that watches Ingress resources and configures the actual proxy (nginx, AGIC, Traefik, Contour)
- **IngressClass** — a cluster-scoped resource that names an Ingress controller; use it when multiple controllers are installed; set `ingressClassName` on each Ingress to target the correct one
- **nginx Ingress controller** — the most common open-source option; uses nginx as the backing proxy; highly configurable via annotations
- **AGIC (Azure Application Gateway Ingress Controller)** — provisions an Azure Application Gateway as the proxy; native Azure WAF integration, certificate management via Azure Key Vault, HTTP/2 and WebSocket support
- **Host-based routing** — routes to different Services based on the `Host` header: `api.example.com` → api-service, `app.example.com` → frontend-service
- **Path-based routing** — routes to different Services based on the URL path: `/api` → api-service, `/static` → static-service
- **TLS termination** — the Ingress controller decrypts HTTPS at the edge; backend Services communicate over plain HTTP inside the cluster; reference a TLS Secret in the Ingress spec
- **cert-manager** — a cluster-scoped controller that automates TLS certificate issuance and renewal from Let's Encrypt (ACME) or Azure Key Vault; creates a Certificate resource and populates a Secret
- **ClusterIssuer** — a cert-manager resource that defines the certificate authority to use (ACME/Let's Encrypt, self-signed, or Azure Key Vault); referenced by Certificate or Ingress annotations
- **nginx annotation: nginx.ingress.kubernetes.io/rewrite-target** — rewrites the request path before forwarding to the backend (e.g., strip the `/api` prefix)
- **nginx annotation: nginx.ingress.kubernetes.io/use-regex** — enables regex in path rules
- **default backend** — the Service that receives traffic for any request that does not match a rule; should return a proper 404 page, not a connection refused

## Common mistakes

- **One LoadBalancer per service** — expensive and operationally complex; fix: use a single Ingress controller with path or host routing for all HTTP services
- **Not enabling TLS** — sending credentials and session tokens over plain HTTP; fix: use cert-manager with Let's Encrypt for production, a self-signed ClusterIssuer for development
- **No default backend** — unmatched requests get a raw nginx 404, not a useful error page; fix: configure `defaultBackend` in the Ingress or install a default backend Deployment
- **Using path type Prefix without understanding trailing slash behavior** — `pathType: Prefix` on `/api` matches `/api`, `/api/`, and `/api/users`; `pathType: Exact` matches only `/api`; choosing the wrong type causes 404s for valid paths

## Tiny example

Two services exposed under the same hostname, with TLS from cert-manager:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-api-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.example.com
    secretName: api-tls-cert      # cert-manager creates this Secret
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /users(/|$)(.*)
        pathType: ImplementationSpecific
        backend:
          service:
            name: users-service
            port:
              number: 80
      - path: /orders(/|$)(.*)
        pathType: ImplementationSpecific
        backend:
          service:
            name: orders-service
            port:
              number: 80
```

## Run the demo

```bash
bash demo.sh
```

The demo installs the nginx Ingress controller, deploys two services, creates an Ingress with path routing and a self-signed TLS certificate, and shows `kubectl describe ingress` with routing events.

## Deeper intuition

Think of the Ingress controller as a hotel concierge desk. Every guest (HTTP request) arrives at the single front door. The concierge reads the room number (path or host header) and directs the guest to the correct elevator (Service). The concierge also checks that the guest has a valid reservation (TLS certificate) before letting them in.

Without the concierge desk (no Ingress), every room would need its own front door (LoadBalancer), its own key management system (TLS cert), and its own security guard (WAF). That is expensive and inconsistent.

The key architectural insight: routing logic belongs in Ingress resources, not in your application code. If `/v1/users` needs to go to service A and `/v2/users` needs to go to service B, that is an Ingress rule — not an API gateway built in .NET.

## Scenario questions

### Scenario 1 — "Our Azure bill shows 15 load balancer public IPs from our AKS cluster. Each microservice was deployed with type: LoadBalancer."
**Question:** What is the migration path to reduce this to one IP?
**Answer:** Install an Ingress controller (nginx or AGIC) with a single `type: LoadBalancer` Service, change all other Services to `type: ClusterIP`, and create Ingress resources with path or host rules to replace the direct LoadBalancer exposure.
**Explanation:** The migration is incremental: install the controller, add Ingress rules for one service at a time, verify routing works, then change that service's type from LoadBalancer to ClusterIP. After all services are migrated, you have one public IP. TLS can be consolidated at the same time using cert-manager.

### Scenario 2 — "A security audit flagged that our API is accessible over HTTP and HTTPS. The HTTPS cert expired last month."
**Question:** What is the automated solution for both problems?
**Answer:** Install cert-manager, create a Let's Encrypt ClusterIssuer, annotate the Ingress with `cert-manager.io/cluster-issuer`, and add an nginx annotation to force HTTPS redirects.
**Explanation:** cert-manager watches Ingress resources with the `cert-manager.io/cluster-issuer` annotation and automatically issues and renews certificates. Add `nginx.ingress.kubernetes.io/ssl-redirect: "true"` to force HTTP → HTTPS redirect. Certificates renew automatically 30 days before expiry, so the expired cert scenario is eliminated.

### Scenario 3 — "We deployed a new Ingress resource but traffic is going to the wrong Service. kubectl get ingress shows ADDRESS is empty."
**Question:** What are the two most likely causes?
**Answer:** No Ingress controller is installed, or the `ingressClassName` does not match the installed controller's class name.
**Explanation:** An Ingress resource is inert without a controller to act on it. If the ADDRESS field is empty, it means no controller has claimed the Ingress. Check `kubectl get ingressclass` to see installed controllers and their class names. If multiple controllers are installed, each Ingress must specify `ingressClassName` to target the correct one.
