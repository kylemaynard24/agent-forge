#!/usr/bin/env bash
# demo.sh — Pods and Containers
# Run: bash demo.sh
# Requires: kubectl configured against a live cluster (minikube, kind, AKS, etc.)
# What this shows: pod creation, multi-container pods with shared volumes,
#                  init containers, exec into running pods, and pod spec inspection

set -euo pipefail

NAMESPACE="pods-demo"

echo "=== 1. Create a demo namespace ==="
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "=== 2. Deploy a single-container pod and inspect it ==="
kubectl apply -f - -n "$NAMESPACE" << 'EOF'
apiVersion: v1
kind: Pod
metadata:
  name: single-container
  labels:
    demo: pods
spec:
  containers:
  - name: app
    image: alpine:3.19
    command: ["sleep", "300"]
    resources:
      requests:
        cpu: "50m"
        memory: "32Mi"
      limits:
        cpu: "100m"
        memory: "64Mi"
EOF

echo ""
echo "Waiting for single-container pod to be Ready..."
kubectl wait --for=condition=Ready pod/single-container -n "$NAMESPACE" --timeout=60s

echo ""
echo "=== 3. Inspect the full pod spec as stored in the API server ==="
echo "(Notice all the fields Kubernetes has defaulted for you)"
kubectl get pod single-container -n "$NAMESPACE" -o yaml | head -60

echo ""
echo "=== 4. exec into the running container ==="
echo "The pod's container has a shell. Let's use it:"
kubectl exec -it single-container -n "$NAMESPACE" -- sh -c "echo 'Inside the container'; hostname; id"

echo ""
echo "=== 5. Deploy a multi-container pod with a shared emptyDir volume ==="
kubectl apply -f - -n "$NAMESPACE" << 'EOF'
apiVersion: v1
kind: Pod
metadata:
  name: writer-reader
  labels:
    demo: pods
spec:
  containers:
  - name: writer
    image: alpine:3.19
    command: ["/bin/sh", "-c"]
    args:
    - |
      i=0
      while true; do
        echo "$(date) - message $i" >> /shared/log.txt
        i=$((i+1))
        sleep 3
      done
    volumeMounts:
    - name: shared-data
      mountPath: /shared
    resources:
      requests:
        cpu: "50m"
        memory: "32Mi"

  - name: reader
    image: alpine:3.19
    command: ["/bin/sh", "-c"]
    args: ["sleep 5 && tail -f /shared/log.txt"]
    volumeMounts:
    - name: shared-data
      mountPath: /shared
    resources:
      requests:
        cpu: "50m"
        memory: "32Mi"

  volumes:
  - name: shared-data
    emptyDir: {}
EOF

echo ""
echo "Waiting for writer-reader pod to be Ready..."
kubectl wait --for=condition=Ready pod/writer-reader -n "$NAMESPACE" --timeout=60s

echo ""
echo "=== 6. Read logs from each container separately ==="
echo "Sleeping 8s to let the writer generate some messages..."
sleep 8

echo ""
echo "Writer container output (what it wrote to the shared volume):"
kubectl logs writer-reader -n "$NAMESPACE" -c writer | head -5

echo ""
echo "Reader container output (reading from the same shared volume):"
kubectl logs writer-reader -n "$NAMESPACE" -c reader | head -5

echo ""
echo "=== 7. exec into a specific container in a multi-container pod ==="
kubectl exec writer-reader -n "$NAMESPACE" -c reader -- cat /shared/log.txt | head -5
echo "(Both containers see the same /shared/log.txt — the emptyDir volume)"

echo ""
echo "=== 8. Deploy a pod with an init container ==="
kubectl apply -f - -n "$NAMESPACE" << 'EOF'
apiVersion: v1
kind: Pod
metadata:
  name: init-demo
  labels:
    demo: pods
spec:
  initContainers:
  - name: wait-and-seed
    image: alpine:3.19
    command: ["/bin/sh", "-c"]
    args:
    - |
      echo "Init container: waiting 5 seconds (simulating dependency check)..."
      sleep 5
      echo "Init container: writing seed file..."
      echo "initialized at $(date)" > /shared/init-output.txt
    volumeMounts:
    - name: init-data
      mountPath: /shared

  containers:
  - name: main-app
    image: alpine:3.19
    command: ["/bin/sh", "-c"]
    args:
    - |
      echo "Main container started — reading init output:"
      cat /shared/init-output.txt
      sleep 300
    volumeMounts:
    - name: init-data
      mountPath: /shared

  volumes:
  - name: init-data
    emptyDir: {}
EOF

echo ""
echo "=== 9. Watch the init container complete before the main app starts ==="
echo "Watch for: Init:0/1 → PodInitializing → Running"
kubectl get pod init-demo -n "$NAMESPACE" --watch &
WATCH_PID=$!
sleep 20
kill $WATCH_PID 2>/dev/null || true

echo ""
echo "Pod status after waiting:"
kubectl get pod init-demo -n "$NAMESPACE"

echo ""
echo "Init container logs:"
kubectl logs init-demo -n "$NAMESPACE" -c wait-and-seed

echo ""
echo "Main container logs (it read the file the init container created):"
kubectl logs init-demo -n "$NAMESPACE" -c main-app

echo ""
echo "=== 10. Show pod phase transitions ==="
kubectl describe pod init-demo -n "$NAMESPACE" | grep -A 20 "Events:"

echo ""
echo "=== 11. Clean up ==="
kubectl delete namespace "$NAMESPACE" --ignore-not-found=true

echo ""
echo "--- Done. Key takeaway: a pod is a group of containers sharing network and optional storage — the sidecar and init container patterns both rely on this shared context, which is the core design principle that makes pods more powerful than standalone containers. ---"
