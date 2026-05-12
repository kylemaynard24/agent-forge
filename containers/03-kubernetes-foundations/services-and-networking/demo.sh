#!/usr/bin/env bash
# demo.sh — Services and Networking
# Run: bash demo.sh
# Requires: kubectl configured against a live cluster
# What this shows: ClusterIP service creation, DNS resolution from inside the cluster,
#                  LoadBalancer service (AKS provisions an Azure LB), endpoints inspection

set -euo pipefail

NAMESPACE="services-demo"

echo "=== 1. Create a demo namespace ==="
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "=== 2. Deploy a backend service ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: server
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: "50m"
            memory: "32Mi"
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
EOF

kubectl rollout status deployment/backend -n "$NAMESPACE" --timeout=90s

echo ""
echo "=== 3. Create a ClusterIP Service for the backend ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: backend-svc
spec:
  selector:
    app: backend
  ports:
  - port: 80        # callers use this port
    targetPort: 80  # pod container listens on this port
  type: ClusterIP
EOF

echo ""
echo "Service created:"
kubectl get service backend-svc -n "$NAMESPACE"

echo ""
echo "=== 4. Inspect the Endpoints — Kubernetes auto-populated this ==="
kubectl get endpoints backend-svc -n "$NAMESPACE"
echo "(These are the pod IPs of the 3 running backend pods)"

echo ""
kubectl describe endpoints backend-svc -n "$NAMESPACE"

echo ""
echo "=== 5. Describe the Service ==="
kubectl describe service backend-svc -n "$NAMESPACE"

echo ""
echo "=== 6. Prove DNS resolution from inside the cluster ==="
echo "Launching a debug pod in the same namespace..."
kubectl run dns-test \
  --image=alpine:3.19 \
  --restart=Never \
  -n "$NAMESPACE" \
  --command -- sleep 60

kubectl wait --for=condition=Ready pod/dns-test -n "$NAMESPACE" --timeout=30s

echo ""
echo "DNS lookup of 'backend-svc' (short name, same namespace):"
kubectl exec dns-test -n "$NAMESPACE" -- nslookup backend-svc

echo ""
echo "DNS lookup of fully qualified name:"
kubectl exec dns-test -n "$NAMESPACE" -- nslookup "backend-svc.${NAMESPACE}.svc.cluster.local"

echo ""
echo "HTTP request to backend via service name:"
kubectl exec dns-test -n "$NAMESPACE" -- wget -qO- http://backend-svc/ | head -5

echo ""
echo "=== 7. Show what happens when we query a non-existent service ==="
echo "Attempting to resolve a service that doesn't exist:"
kubectl exec dns-test -n "$NAMESPACE" -- nslookup nonexistent-svc 2>&1 || true
echo "(Expected: NXDOMAIN or server can't find it — the Service doesn't exist)"

echo ""
echo "=== 8. Deploy a frontend and connect it to backend by service name ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: client
        image: alpine:3.19
        command: ["/bin/sh", "-c"]
        args:
        - |
          apk add --no-cache curl -q
          while true; do
            echo "Calling backend: $(curl -s -o /dev/null -w '%{http_code}' http://backend-svc/)"
            sleep 10
          done
        resources:
          requests:
            cpu: "50m"
            memory: "32Mi"
EOF

kubectl rollout status deployment/frontend -n "$NAMESPACE" --timeout=60s

echo ""
echo "Frontend logs — it's calling backend by service name, getting HTTP 200:"
sleep 12
kubectl logs -n "$NAMESPACE" -l app=frontend --tail=3

echo ""
echo "=== 9. Create a NodePort Service (for external testing, not production) ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: backend-nodeport
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080  # accessible at <any-node-ip>:30080
  type: NodePort
EOF

kubectl get service backend-nodeport -n "$NAMESPACE"
echo "(Access this at <node-ip>:30080 from outside the cluster)"

echo ""
echo "=== 10. (AKS only) Create a LoadBalancer Service — provisions an Azure Load Balancer ==="
echo "NOTE: This step creates a real Azure resource and may incur cost."
echo "Skipping automatic execution — run manually if you're on AKS:"
echo ""
cat << 'MANIFEST'
apiVersion: v1
kind: Service
metadata:
  name: backend-lb
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-health-probe-request-path: "/"
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
MANIFEST
echo ""
echo "After applying: kubectl get service backend-lb -n $NAMESPACE --watch"
echo "Wait for EXTERNAL-IP to be assigned (usually 1-2 minutes on AKS)"

echo ""
echo "=== 11. Clean up ==="
kubectl delete namespace "$NAMESPACE" --ignore-not-found=true

echo ""
echo "--- Done. Key takeaway: a ClusterIP Service gives pods a stable DNS name and virtual IP — kube-proxy handles routing to healthy pod IPs automatically, so your app code never needs to know pod IPs or handle pod restarts. ---"
