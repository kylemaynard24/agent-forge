#!/usr/bin/env bash
# demo.sh — Autoscaling (HPA + KEDA overview)
# Run: bash demo.sh
# Requires: kubectl connected to a running cluster, metrics-server installed
#           Install metrics-server: kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

set -euo pipefail

NAMESPACE="autoscale-demo"

echo "=== 1. Create namespace ==="
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "=== 2. Deploy a CPU-bound app with resource requests ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cpu-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cpu-app
  template:
    metadata:
      labels:
        app: cpu-app
    spec:
      containers:
      - name: app
        image: nginx:1.25
        resources:
          requests:
            cpu: "100m"
            memory: "64Mi"
          limits:
            cpu: "500m"
            memory: "128Mi"
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: cpu-app
spec:
  selector:
    app: cpu-app
  ports:
  - port: 80
    targetPort: 80
EOF

kubectl wait --for=condition=Available deployment/cpu-app -n "$NAMESPACE" --timeout=60s

echo ""
echo "=== 3. Create HPA targeting 50% CPU ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: cpu-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: cpu-app
  minReplicas: 1
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 60    # shorter window for demo purposes
      policies:
      - type: Pods
        value: 1
        periodSeconds: 30
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Pods
        value: 2
        periodSeconds: 15
EOF

echo "HPA created. Initial state:"
kubectl get hpa cpu-app-hpa -n "$NAMESPACE"

echo ""
echo "=== 4. Run a load test to trigger scale-out ==="
echo "Launching a load generator pod..."
kubectl run load-generator \
  -n "$NAMESPACE" \
  --image=busybox:1.36 \
  --restart=Never \
  -- /bin/sh -c "
    echo 'Starting load...';
    while true; do
      wget -q -O- http://cpu-app.$NAMESPACE.svc.cluster.local/ > /dev/null 2>&1;
    done
  " &

LOAD_PID=$!
echo "Load generator started (background: PID $LOAD_PID)"
echo ""
echo "=== 5. Watch HPA react — checking every 15s for 2 minutes ==="
echo "Run this in a separate terminal to watch live:"
echo "  kubectl get hpa cpu-app-hpa -n $NAMESPACE -w"
echo ""
echo "Polling HPA status every 15 seconds..."
for i in $(seq 1 8); do
  sleep 15
  echo "--- $(date +%H:%M:%S) --- HPA status (iteration $i/8) ---"
  kubectl get hpa cpu-app-hpa -n "$NAMESPACE" \
    -o custom-columns='NAME:.metadata.name,MINPODS:.spec.minReplicas,MAXPODS:.spec.maxReplicas,REPLICAS:.status.currentReplicas,CPU%:.status.currentMetrics[0].resource.current.averageUtilization'
  kubectl get pods -n "$NAMESPACE" -l app=cpu-app --no-headers | wc -l | xargs echo "  Current pod count:"
done

echo ""
echo "=== 6. Stop load and watch scale-down ==="
echo "Deleting load generator pod..."
kubectl delete pod load-generator -n "$NAMESPACE" --wait=false 2>/dev/null || true

echo ""
echo "Polling for scale-down (stabilization window is 60s for this demo)..."
for i in $(seq 1 6); do
  sleep 20
  echo "--- $(date +%H:%M:%S) --- Cooldown check (iteration $i/6) ---"
  kubectl get hpa cpu-app-hpa -n "$NAMESPACE" \
    -o custom-columns='NAME:.metadata.name,REPLICAS:.status.currentReplicas,CPU%:.status.currentMetrics[0].resource.current.averageUtilization' \
    2>/dev/null || echo "(metrics not yet available)"
done

echo ""
echo "=== 7. KEDA ScaledObject example (informational — requires KEDA installed) ==="
echo ""
echo "If KEDA is installed (helm install keda kedacore/keda -n keda --create-namespace),"
echo "you can create a ScaledObject that scales to zero when an Azure Service Bus queue is empty:"
echo ""
cat <<'KEDA_EXAMPLE'
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: queue-processor
  namespace: autoscale-demo
spec:
  scaleTargetRef:
    name: queue-worker          # must match a Deployment name
  minReplicaCount: 0            # scale to zero when queue is empty
  maxReplicaCount: 10
  pollingInterval: 10           # check queue depth every 10 seconds
  cooldownPeriod: 60            # wait 60s after last message before scaling to zero
  triggers:
  - type: azure-servicebus
    metadata:
      queueName: orders
      namespace: my-servicebus-namespace
      messageCount: "5"         # target: 1 replica per 5 messages in queue
    authenticationRef:
      name: azure-servicebus-auth  # TriggerAuthentication with connection string
KEDA_EXAMPLE

echo ""
echo "Check if KEDA is installed:"
kubectl get crd scaledobjects.keda.sh 2>/dev/null && echo "KEDA is installed" || echo "KEDA is not installed — install it to try the ScaledObject example"

echo ""
echo "=== 8. Cleanup ==="
kubectl delete namespace "$NAMESPACE" --wait=false
echo "Namespace deletion in progress."

echo ""
echo "--- Done. Key takeaway: HPA scales pods based on metric averages — accurate requests and a tuned stabilization window prevent flapping; KEDA extends this to event-driven scale-to-zero. ---"
