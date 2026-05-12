# Homework — Ingress and Load Balancing

> Your Azure bill arrived. Fifteen microservices, fifteen public IPs, fifteen load balancers. The platform team is asking questions. You have one afternoon to fix it.

## Exercise: Unified API Gateway

**Scenario:** You are consolidating 3 microservices (users, orders, health) behind a single Ingress. Each service currently has its own `type: LoadBalancer` Service. Your job is to migrate them to `type: ClusterIP` and expose them all through a single nginx Ingress with TLS.

**Build:**
1. Deploy 3 mock services (use `hashicorp/http-echo` or nginx with ConfigMap-mounted index.html) with `type: ClusterIP` — name them `users-svc`, `orders-svc`, `health-svc`
2. Create a single Ingress resource that routes:
   - `api.example.local/users` → `users-svc:80`
   - `api.example.local/orders` → `orders-svc:80`
   - `api.example.local/health` → `health-svc:80`
3. Add a TLS secret (self-signed) for the host `api.example.local` and enable `ssl-redirect` via annotation
4. Test all three paths using `curl -H "Host: api.example.local"` — each should return a distinct response
5. Check `kubectl describe ingress` and verify the backend services are resolved (not `<error>`)

**Constraints:**
- All three Services must be `type: ClusterIP` — verify with `kubectl get svc -o wide`
- The Ingress must use `pathType: Prefix` for all routes — document the behavior difference between `Prefix` and `Exact` in `observations.md`
- TLS must be configured — a self-signed cert is acceptable; document the `kubectl create secret tls` command you used
- Add a default backend that returns a 404 page for unmatched routes — use a fourth Deployment serving a simple 404 response

## Stretch 1

Add rate limiting to the `/users` path using nginx annotations:

```yaml
nginx.ingress.kubernetes.io/limit-rps: "10"
nginx.ingress.kubernetes.io/limit-connections: "5"
```

Test rate limiting by sending rapid requests with a loop:

```bash
for i in $(seq 1 20); do
  curl -s -o /dev/null -w "%{http_code}\n" -H "Host: api.example.local" http://<INGRESS_IP>/users
done
```

Observe the 503 responses when the limit is exceeded. Document the threshold at which throttling begins.

## Stretch 2

Install cert-manager and create a self-signed `ClusterIssuer`. Annotate the Ingress with `cert-manager.io/cluster-issuer: selfsigned` and remove the manually-created TLS Secret. Verify that cert-manager automatically creates the Secret by watching:

```bash
kubectl get certificate -n ingress-demo -w
kubectl get secret -n ingress-demo
```

Document the Certificate resource's `READY` field and the Secret it created.

## Reflection

- The nginx annotation `nginx.ingress.kubernetes.io/rewrite-target: /` strips the path prefix before forwarding. If you route `/users` to `users-svc` with this annotation, what URL does `users-svc` see? When is this annotation necessary and when is it harmful?
- What happens to a client request that arrives at the Ingress for a host that has no matching rule? How does this differ from a host match with no matching path?
- AGIC (Azure Application Gateway Ingress Controller) and nginx Ingress are both valid options on AKS. What are two concrete scenarios where AGIC is the better choice?

## Done when

- [ ] All three services return distinct responses via the single Ingress
- [ ] `kubectl get svc` confirms all three backend services are `ClusterIP`
- [ ] TLS is configured and `curl -sk` over HTTPS works for all paths
- [ ] `kubectl describe ingress` shows the Ingress has an ADDRESS and no endpoint errors
- [ ] Default backend returns 404 for unmatched paths
- [ ] `observations.md` documents the `pathType` behavior difference

---

## Clean Code Lens

**Principle in focus:** Separation of Concerns

The Ingress resource is a clean separation of concerns in action: routing logic lives in Kubernetes YAML (version-controlled, reviewable, auditable), not in your application code. Your .NET API does not need to know that it lives at `/users` — it just handles HTTP requests at `/`. The routing concern is owned entirely by the Ingress layer.

This principle extends to TLS. Your application code should never manage certificates. cert-manager handles issuance, rotation, and storage. The Ingress controller handles termination. The backend service handles business logic. Each layer owns exactly one concern.

The cost of violating this separation is visceral: if routing logic is inside your application, a path change requires a code deploy. If TLS is managed manually, a certificate expiry requires a human to notice and act. When concerns are separated and each is owned by the right layer, changes to one do not ripple into the others.

**Exercise:** Audit a real or sample application for routing logic embedded in application code (e.g., an API Gateway service that reads a config file and proxies requests). Identify every piece of routing logic that could be moved to an Ingress resource. Draw the before/after architecture and calculate how many code deploys would be eliminated by the migration.

**Reflection:** Separation of concerns is a code-level principle. Does it translate cleanly to infrastructure? What are the limits — at what point does infrastructure-level routing logic become too complex and need to move back into application code?
