# Capstone 3: Harden for Production — Health, Limits, Autoscaling, Ingress

**Track:** Containers
**Estimated time:** ~4 hours
**Prerequisites:** Stages 1–4 + Capstone 2

## What you'll build

You will take the AKS deployment from Capstone 2 and transform it from "works in production" to "production-hardened." Every item on the hardening checklist addresses a real failure mode observed in production Kubernetes clusters: incorrect probes causing restart loops, missing limits allowing noisy neighbors, no HPA causing capacity problems, no PDB causing downtime during node drains, no TLS exposing credentials over HTTP, flat networking allowing lateral movement after a compromise.

By the end, you will have a deployment that: fails safe under load (HPA scales out), survives node maintenance without downtime (PDB + rolling update strategy), routes all external traffic through a single TLS-terminating Ingress, prevents compromised pods from reaching other services (NetworkPolicy), and runs with the minimum privileges required (securityContext).

## Why this capstone

The gap between "deployed to Kubernetes" and "production-ready on Kubernetes" is exactly what this capstone addresses. Teams often skip the hardening step under time pressure, then spend 10x the time debugging production incidents that these controls would have prevented. Doing the hardening once on a real deployment gives you the muscle memory to do it on every future deployment as a first-class concern, not an afterthought.

This is also the capstone where all the Stage 4 topics converge: health checks, resource limits, autoscaling, rolling updates, and Ingress all work together in a single deployment. Seeing how they interact is more valuable than any of them in isolation.

## Deliverables

- [ ] Liveness probe: GET /healthz (process-only check, no DB dependency)
- [ ] Readiness probe: GET /readyz (returns 503 if DB unreachable)
- [ ] Startup probe covering a 30-second initialization window
- [ ] Resource requests and limits sized appropriately (not too tight to OOMKill on burst)
- [ ] HPA: min 2, max 8 replicas, target 70% CPU, with stabilization window
- [ ] PodDisruptionBudget: minAvailable 2
- [ ] nginx Ingress controller installed; all external traffic through one public IP
- [ ] TLS termination via cert-manager with a self-signed ClusterIssuer (or Let's Encrypt if DNS is available)
- [ ] NetworkPolicy: default-deny-ingress + allow from ingress controller namespace only
- [ ] securityContext: runAsNonRoot, readOnlyRootFilesystem, allowPrivilegeEscalation: false, drop ALL capabilities
- [ ] Load test: `k6` or `hey` sends 100 concurrent requests for 2 minutes; HPA scales to at least 4 replicas; after load stops, scales back to 2

## Architecture overview

```
Internet
  │ HTTPS
  ▼
Azure Load Balancer (one IP, one LB — not one per service)
  │
  ▼
nginx Ingress Controller (TLS termination, cert-manager cert)
  │
  │ /healthz, /api/*  (host: api.example.local)
  ▼
ClusterIP Service: my-api
  │
  ├── Pod 1 (securityContext: non-root, readonly, no caps)
  ├── Pod 2
  ├── ... (HPA: 2–8 replicas, 70% CPU target)
  └── PDB: minAvailable 2

NetworkPolicy:
  - default-deny-ingress (all pods in namespace)
  - allow-from-ingress (my-api pods ← ingress-nginx namespace only)
```

## Step-by-step guide

### Phase 1: Probes and resource limits (~45 min)

1. Update the Deployment from Capstone 2 to add all three probes and correct resource sizing.

   Patch the Deployment's container spec:
   ```yaml
   startupProbe:
     httpGet:
       path: /healthz
       port: 8080
     failureThreshold: 15    # 15 * 2s = 30s startup window
     periodSeconds: 2

   livenessProbe:
     httpGet:
       path: /healthz         # process-only check — never check DB here
       port: 8080
     periodSeconds: 10
     failureThreshold: 3
     timeoutSeconds: 3

   readinessProbe:
     httpGet:
       path: /readyz           # check DB connectivity here
       port: 8080
     periodSeconds: 5
     failureThreshold: 3
     timeoutSeconds: 3

   resources:
     requests:
       cpu: "100m"
       memory: "128Mi"
     limits:
       cpu: "500m"
       memory: "256Mi"
   ```

2. Apply the update:
   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl rollout status deployment/my-api -n my-app
   ```

3. Verify probes are configured:
   ```bash
   kubectl describe pod -n my-app -l app=my-api | grep -A 10 "Liveness\|Readiness\|Startup"
   ```

### Phase 2: HPA and PDB (~30 min)

1. Create `k8s/hpa.yaml`:
   ```yaml
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
     name: my-api-hpa
     namespace: my-app
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: my-api
     minReplicas: 2
     maxReplicas: 8
     metrics:
     - type: Resource
       resource:
         name: cpu
         target:
           type: Utilization
           averageUtilization: 70
     behavior:
       scaleDown:
         stabilizationWindowSeconds: 180
         policies:
         - type: Pods
           value: 1
           periodSeconds: 60
   ```

2. Create `k8s/pdb.yaml`:
   ```yaml
   apiVersion: policy/v1
   kind: PodDisruptionBudget
   metadata:
     name: my-api-pdb
     namespace: my-app
   spec:
     minAvailable: 2
     selector:
       matchLabels:
         app: my-api
   ```

3. Apply and verify:
   ```bash
   kubectl apply -f k8s/hpa.yaml -f k8s/pdb.yaml
   kubectl get hpa -n my-app
   kubectl get pdb -n my-app
   ```

### Phase 3: nginx Ingress with TLS (~45 min)

1. Install nginx Ingress controller via Helm:
   ```bash
   helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
   helm repo update
   helm install ingress-nginx ingress-nginx/ingress-nginx \
     --namespace ingress-nginx \
     --create-namespace \
     --set controller.replicaCount=2 \
     --wait --timeout 120s
   ```

2. Get the Ingress controller's external IP:
   ```bash
   kubectl get service ingress-nginx-controller -n ingress-nginx -w
   # Wait for EXTERNAL-IP to be assigned
   INGRESS_IP=$(kubectl get service ingress-nginx-controller -n ingress-nginx \
     -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
   echo "Ingress IP: $INGRESS_IP"
   ```

3. Install cert-manager:
   ```bash
   helm repo add jetstack https://charts.jetstack.io
   helm repo update
   helm install cert-manager jetstack/cert-manager \
     --namespace cert-manager \
     --create-namespace \
     --set installCRDs=true \
     --wait --timeout 120s
   ```

4. Create a self-signed ClusterIssuer (`k8s/cluster-issuer.yaml`):
   ```yaml
   apiVersion: cert-manager.io/v1
   kind: ClusterIssuer
   metadata:
     name: selfsigned-issuer
   spec:
     selfSigned: {}
   ```

5. Create the Ingress resource (`k8s/ingress.yaml`):
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: my-api-ingress
     namespace: my-app
     annotations:
       cert-manager.io/cluster-issuer: "selfsigned-issuer"
       nginx.ingress.kubernetes.io/ssl-redirect: "true"
   spec:
     ingressClassName: nginx
     tls:
     - hosts:
       - api.example.local
       secretName: my-api-tls
     rules:
     - host: api.example.local
       http:
         paths:
         - path: /
           pathType: Prefix
           backend:
             service:
               name: my-api-internal
               port:
                 number: 80
   ```

6. Change the API Service back to ClusterIP only (remove the LoadBalancer Service from Capstone 2):
   ```bash
   kubectl delete service my-api-external -n my-app 2>/dev/null || true
   ```

7. Apply and verify:
   ```bash
   kubectl apply -f k8s/cluster-issuer.yaml -f k8s/ingress.yaml
   kubectl get certificate -n my-app -w    # wait for READY=True
   kubectl describe ingress my-api-ingress -n my-app
   ```

8. Test (using Host header to simulate DNS):
   ```bash
   curl -sk -H "Host: api.example.local" "https://$INGRESS_IP/healthz"
   ```

### Phase 4: NetworkPolicy and securityContext (~45 min)

1. Create `k8s/networkpolicy.yaml`:
   ```yaml
   # Default deny all ingress in the namespace
   apiVersion: networking.k8s.io/v1
   kind: NetworkPolicy
   metadata:
     name: default-deny-ingress
     namespace: my-app
   spec:
     podSelector: {}
     policyTypes:
     - Ingress
   ---
   # Allow ingress only from the ingress controller
   apiVersion: networking.k8s.io/v1
   kind: NetworkPolicy
   metadata:
     name: allow-from-ingress-nginx
     namespace: my-app
   spec:
     podSelector:
       matchLabels:
         app: my-api
     policyTypes:
     - Ingress
     ingress:
     - from:
       - namespaceSelector:
           matchLabels:
             kubernetes.io/metadata.name: ingress-nginx
       ports:
       - port: 8080
   ```

2. Update the Deployment to add securityContext. Add to the container spec:
   ```yaml
   securityContext:
     runAsNonRoot: true
     runAsUser: 1000
     runAsGroup: 1000
     allowPrivilegeEscalation: false
     readOnlyRootFilesystem: true
     capabilities:
       drop: ["ALL"]
     seccompProfile:
       type: RuntimeDefault
   volumeMounts:
   - name: tmp
     mountPath: /tmp
   ```

   Add to the pod spec:
   ```yaml
   volumes:
   - name: tmp
     emptyDir: {}
   ```

3. Apply and verify:
   ```bash
   kubectl apply -f k8s/networkpolicy.yaml
   kubectl apply -f k8s/deployment.yaml
   kubectl rollout status deployment/my-api -n my-app
   kubectl exec -n my-app $(kubectl get pod -n my-app -l app=my-api -o name | head -1) -- whoami
   # Should return: a non-root username or UID 1000
   ```

### Phase 5: Load test to verify HPA (~30 min)

1. Install `hey` (HTTP load generator):
   ```bash
   brew install hey
   # or: go install github.com/rakyll/hey@latest
   ```

2. Run the load test:
   ```bash
   hey -n 10000 -c 100 -H "Host: api.example.local" \
     "https://$INGRESS_IP/healthz" -k

   # In another terminal, watch the HPA:
   kubectl get hpa my-api-hpa -n my-app -w
   ```

3. Observe scale-out:
   - HPA should show CPU% above target
   - Replicas should increase toward maxReplicas
   - `kubectl get pods -n my-app -w` shows new pods starting

4. Stop the load test and watch scale-in:
   ```bash
   kubectl get hpa my-api-hpa -n my-app -w
   # After ~3 minutes (stabilization window), replicas should return to 2
   ```

5. Document in `observations.md`:
   - Peak replica count during load test
   - Time from load start to first scale-out event
   - Time from load stop to scale-in to minReplicas

## Stretch goals

- Run `trivy k8s --report summary cluster` to scan your running cluster for security misconfigurations and compare against your hardened Deployment
- Configure KEDA with a cron trigger to scale the API to 0 during off-hours (midnight to 6am) and back to `minReplicas` during business hours
- Add Azure Defender for Containers to the cluster and review the security recommendations it generates for your workload

## Teardown

```bash
# Remove all application resources
kubectl delete namespace my-app cert-manager ingress-nginx --wait=false

# Delete all Azure resources
az group delete --name rg-capstone-containers --yes --no-wait
```

Verify no public IPs remain (these incur ongoing charges):
```bash
az network public-ip list --resource-group rg-capstone-containers --output table 2>/dev/null || \
  echo "Resource group deleted"
```

## Reflection questions

1. You now have two layers of availability protection: the HPA minimum (`minReplicas: 2`) and the PDB (`minAvailable: 2`). Are these redundant? What does each one protect against that the other does not?
2. The NetworkPolicy allows traffic from the `ingress-nginx` namespace using `namespaceSelector`. If someone creates a pod in a different namespace with a pod selector that could match, does the NetworkPolicy allow it? Why or why not?
3. After this capstone, your cluster has: cert-manager in `cert-manager`, nginx-ingress in `ingress-nginx`, your app in `my-app`, and Flux (after Capstone 4) in `flux-system`. How does this multi-namespace architecture affect your operational runbook for "something is broken with the API"?
