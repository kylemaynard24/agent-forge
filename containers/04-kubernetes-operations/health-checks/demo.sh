#!/usr/bin/env bash
# demo.sh — Health Checks
# Run: bash demo.sh
# Requires: kubectl connected to a running cluster (minikube, kind, or AKS)

set -euo pipefail

NAMESPACE="health-demo"

echo "=== 1. Create namespace ==="
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "=== 2. Deploy app with liveness + readiness + startup probes ==="
# We use a simple nginx image and an initContainer that sleeps to simulate slow startup.
# A ConfigMap provides a minimal health endpoint script via a mounted file — we use
# the nginx default page as /healthz and /readyz for simplicity in this demo.
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: probe-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: probe-demo
  template:
    metadata:
      labels:
        app: probe-demo
    spec:
      initContainers:
      - name: slow-init
        image: busybox:1.36
        command: ["sh", "-c", "echo 'Simulating 8s startup...'; sleep 8; echo 'Init done'"]
      containers:
      - name: app
        image: nginx:1.25
        ports:
        - containerPort: 80
        startupProbe:
          httpGet:
            path: /
            port: 80
          failureThreshold: 10   # 10 * 2s = 20s window (covers our 8s init)
          periodSeconds: 2
        livenessProbe:
          httpGet:
            path: /
            port: 80
          periodSeconds: 10
          failureThreshold: 3
          timeoutSeconds: 2
        readinessProbe:
          httpGet:
            path: /
            port: 80
          periodSeconds: 5
          failureThreshold: 3
          timeoutSeconds: 2
---
apiVersion: v1
kind: Service
metadata:
  name: probe-demo
spec:
  selector:
    app: probe-demo
  ports:
  - port: 80
    targetPort: 80
EOF

echo ""
echo "=== 3. Watch pods come up (startup probe fires during init) ==="
echo "Waiting 20s for pods to become ready..."
kubectl wait --for=condition=Ready pod -l app=probe-demo -n "$NAMESPACE" --timeout=60s
kubectl get pods -n "$NAMESPACE" -o wide

echo ""
echo "=== 4. Show Service endpoints — both pods should be listed ==="
kubectl get endpoints probe-demo -n "$NAMESPACE"

echo ""
echo "=== 5. Simulate readiness failure — exec a bad config into one pod ==="
echo "We will block port 80 on one pod by stopping nginx."
POD1=$(kubectl get pods -n "$NAMESPACE" -l app=probe-demo -o jsonpath='{.items[0].metadata.name}')
echo "Target pod: $POD1"
# Stop nginx inside the container — readiness probe will fail, pod leaves endpoints
kubectl exec -n "$NAMESPACE" "$POD1" -- nginx -s stop 2>/dev/null || true

echo ""
echo "Waiting 20s for readiness probe to detect the failure..."
sleep 20

echo ""
echo "=== 6. Check endpoints — the stopped pod should be REMOVED ==="
kubectl get endpoints probe-demo -n "$NAMESPACE"
echo ""
echo "--- Pod status (should show 0/1 Ready for the stopped pod) ---"
kubectl get pods -n "$NAMESPACE"

echo ""
echo "=== 7. Check RESTART COUNT — readiness failure should NOT cause restarts ==="
kubectl get pods -n "$NAMESPACE" -o custom-columns='NAME:.metadata.name,READY:.status.containerStatuses[0].ready,RESTARTS:.status.containerStatuses[0].restartCount'

echo ""
echo "=== 8. Deploy a pod with a LIVENESS probe that will fail to show restarts ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: v1
kind: Pod
metadata:
  name: liveness-fail-demo
spec:
  containers:
  - name: app
    image: busybox:1.36
    command: ["sh", "-c", "sleep 5 && echo 'app started' && sleep 3600"]
    livenessProbe:
      exec:
        # This command will succeed at first (file exists) then fail after we delete it
        command: ["test", "-f", "/tmp/healthy"]
      initialDelaySeconds: 6
      periodSeconds: 5
      failureThreshold: 2
EOF

echo ""
echo "Creating the /tmp/healthy file so liveness passes initially..."
sleep 8
kubectl exec -n "$NAMESPACE" liveness-fail-demo -- touch /tmp/healthy
echo "Liveness passing. Sleeping 15s..."
sleep 15
echo "Now removing /tmp/healthy to trigger liveness failure..."
kubectl exec -n "$NAMESPACE" liveness-fail-demo -- rm /tmp/healthy 2>/dev/null || echo "(pod may have restarted already)"

echo ""
echo "Waiting 30s for liveness failure to trigger a restart..."
sleep 30
echo ""
echo "=== 9. Restart count for liveness-fail-demo (should be > 0) ==="
kubectl get pod liveness-fail-demo -n "$NAMESPACE" -o custom-columns='NAME:.metadata.name,RESTARTS:.status.containerStatuses[0].restartCount,REASON:.status.containerStatuses[0].lastState.terminated.reason'

echo ""
echo "=== 10. kubectl describe to see probe failure events ==="
kubectl describe pod liveness-fail-demo -n "$NAMESPACE" | grep -A 20 "Events:"

echo ""
echo "=== 11. Cleanup ==="
kubectl delete namespace "$NAMESPACE" --wait=false
echo "Namespace deletion in progress."

echo ""
echo "--- Done. Key takeaway: readiness failure removes a pod from Service endpoints without restarting it; liveness failure restarts the pod — never conflate the two. ---"
