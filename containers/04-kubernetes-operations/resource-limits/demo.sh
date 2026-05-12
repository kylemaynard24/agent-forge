#!/usr/bin/env bash
# demo.sh — Resource Limits
# Run: bash demo.sh
# Requires: kubectl connected to a running cluster with metrics-server installed
#           Install metrics-server: kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

set -euo pipefail

NAMESPACE="limits-demo"

echo "=== 1. Create namespace ==="
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "=== 2. Deploy a pod with NO resource limits (BestEffort QoS) ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: v1
kind: Pod
metadata:
  name: no-limits
spec:
  containers:
  - name: app
    image: nginx:1.25
    # No resources block at all — BestEffort QoS, first to be evicted
EOF
kubectl wait --for=condition=Ready pod/no-limits -n "$NAMESPACE" --timeout=30s
echo "QoS class for no-limits pod:"
kubectl get pod no-limits -n "$NAMESPACE" -o jsonpath='{.status.qosClass}'
echo ""

echo ""
echo "=== 3. Deploy a pod with requests = limits (Guaranteed QoS) ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: v1
kind: Pod
metadata:
  name: guaranteed
spec:
  containers:
  - name: app
    image: nginx:1.25
    resources:
      requests:
        cpu: "100m"
        memory: "64Mi"
      limits:
        cpu: "100m"
        memory: "64Mi"
EOF
kubectl wait --for=condition=Ready pod/guaranteed -n "$NAMESPACE" --timeout=30s
echo "QoS class for guaranteed pod:"
kubectl get pod guaranteed -n "$NAMESPACE" -o jsonpath='{.status.qosClass}'
echo ""

echo ""
echo "=== 4. Deploy a pod with requests < limits (Burstable QoS) ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: v1
kind: Pod
metadata:
  name: burstable
spec:
  containers:
  - name: app
    image: nginx:1.25
    resources:
      requests:
        cpu: "50m"
        memory: "64Mi"
      limits:
        cpu: "200m"
        memory: "128Mi"
EOF
kubectl wait --for=condition=Ready pod/burstable -n "$NAMESPACE" --timeout=30s
echo "QoS class for burstable pod:"
kubectl get pod burstable -n "$NAMESPACE" -o jsonpath='{.status.qosClass}'
echo ""

echo ""
echo "=== 5. Trigger an OOMKilled event ==="
echo "Deploying a pod with a 50Mi memory limit and a memory-hungry process..."
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: v1
kind: Pod
metadata:
  name: oom-demo
spec:
  restartPolicy: Never
  containers:
  - name: stress
    image: polinux/stress:latest
    # Allocate 100MB of memory — our limit is 50Mi, so this will OOMKill
    command: ["stress", "--vm", "1", "--vm-bytes", "100M", "--timeout", "30s"]
    resources:
      requests:
        memory: "20Mi"
      limits:
        memory: "50Mi"
EOF

echo "Waiting 15s for OOMKill to occur..."
sleep 15
echo ""
echo "--- OOM pod status (look for OOMKilled) ---"
kubectl get pod oom-demo -n "$NAMESPACE" \
  -o custom-columns='NAME:.metadata.name,STATUS:.status.phase,REASON:.status.containerStatuses[0].state.terminated.reason,EXIT_CODE:.status.containerStatuses[0].state.terminated.exitCode'

echo ""
echo "--- kubectl describe events for oom-demo ---"
kubectl describe pod oom-demo -n "$NAMESPACE" | grep -A 5 "OOMKill\|Reason\|Exit Code" || true

echo ""
echo "=== 6. Demonstrate CPU throttling ==="
echo "Deploying a CPU-intensive pod with a low CPU limit..."
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: v1
kind: Pod
metadata:
  name: cpu-throttle-demo
spec:
  containers:
  - name: stress
    image: polinux/stress:latest
    # Try to use 2 CPU cores but limit is 100m — heavy throttling expected
    command: ["stress", "--cpu", "2", "--timeout", "60s"]
    resources:
      requests:
        cpu: "50m"
      limits:
        cpu: "100m"
EOF

echo "Waiting 15s for pod to start spinning..."
sleep 15
echo ""
echo "--- CPU throttle stats inside container ---"
kubectl exec -n "$NAMESPACE" cpu-throttle-demo -- \
  cat /sys/fs/cgroup/cpu/cpu.stat 2>/dev/null || \
  kubectl exec -n "$NAMESPACE" cpu-throttle-demo -- \
  cat /sys/fs/cgroup/cpu.stat 2>/dev/null || \
  echo "(cgroup path varies by kernel version — check throttled_time field)"

echo ""
echo "=== 7. Apply a LimitRange to enforce defaults ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
spec:
  limits:
  - default:
      cpu: "200m"
      memory: "128Mi"
    defaultRequest:
      cpu: "50m"
      memory: "64Mi"
    type: Container
EOF
echo "LimitRange applied. New pods without resource specs will get these defaults:"
kubectl describe limitrange default-limits -n "$NAMESPACE"

echo ""
echo "=== 8. kubectl top pods (requires metrics-server) ==="
echo "Waiting 30s for metrics to be available..."
sleep 30
kubectl top pods -n "$NAMESPACE" 2>/dev/null || echo "(metrics-server may not be installed — run: kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml)"

echo ""
echo "=== 9. Cleanup ==="
kubectl delete namespace "$NAMESPACE" --wait=false
echo "Namespace deletion in progress."

echo ""
echo "--- Done. Key takeaway: requests affect scheduling placement, limits enforce runtime ceilings — size them independently or you will either waste capacity or OOMKill your own app. ---"
