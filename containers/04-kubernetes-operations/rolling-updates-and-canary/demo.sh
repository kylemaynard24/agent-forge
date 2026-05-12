#!/usr/bin/env bash
# demo.sh — Rolling Updates and Canary Deployments
# Run: bash demo.sh
# Requires: kubectl connected to a running cluster

set -euo pipefail

NAMESPACE="deploy-demo"

echo "=== 1. Create namespace ==="
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "=== 2. Deploy v1 with 3 replicas and zero-downtime rolling update config ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-api
  annotations:
    kubernetes.io/change-cause: "Initial v1 deployment"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # up to 4 pods during update
      maxUnavailable: 0    # never below 3 available pods
  minReadySeconds: 10      # must be Ready for 10s before counting as stable
  template:
    metadata:
      labels:
        app: my-api
        version: v1
    spec:
      containers:
      - name: app
        image: nginx:1.24   # v1 uses nginx 1.24
        ports:
        - containerPort: 80
        readinessProbe:
          httpGet:
            path: /
            port: 80
          periodSeconds: 5
          failureThreshold: 3
        resources:
          requests:
            cpu: "50m"
            memory: "32Mi"
          limits:
            cpu: "200m"
            memory: "64Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: my-api
spec:
  selector:
    app: my-api
  ports:
  - port: 80
    targetPort: 80
EOF

kubectl wait --for=condition=Available deployment/my-api -n "$NAMESPACE" --timeout=60s
echo ""
echo "v1 is running:"
kubectl get pods -n "$NAMESPACE" -l app=my-api

echo ""
echo "=== 3. Apply a PodDisruptionBudget (minAvailable: 2) ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: my-api-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: my-api
EOF
echo "PDB created:"
kubectl get pdb my-api-pdb -n "$NAMESPACE"

echo ""
echo "=== 4. Trigger a rolling update to v2 ==="
kubectl set image deployment/my-api app=nginx:1.25 -n "$NAMESPACE"
kubectl annotate deployment my-api kubernetes.io/change-cause="Update to nginx 1.25 (v2)" \
  -n "$NAMESPACE" --overwrite

echo "Watching rollout status..."
kubectl rollout status deployment/my-api -n "$NAMESPACE" --timeout=120s
echo ""
echo "Pod versions after rolling update:"
kubectl get pods -n "$NAMESPACE" -l app=my-api -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[0].image}{"\n"}{end}'

echo ""
echo "Rollout history:"
kubectl rollout history deployment/my-api -n "$NAMESPACE"

echo ""
echo "=== 5. Rollback to v1 ==="
kubectl rollout undo deployment/my-api -n "$NAMESPACE"
kubectl rollout status deployment/my-api -n "$NAMESPACE" --timeout=60s
echo "After rollback — image should be nginx:1.24:"
kubectl get pods -n "$NAMESPACE" -l app=my-api -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[0].image}{"\n"}{end}'

echo ""
echo "=== 6. Canary deployment — 75% v1, 25% v2 ==="
echo "Deploying canary Deployment (v2) — 1 replica alongside 3 v1 replicas..."
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-api-canary
spec:
  replicas: 1             # 1 canary pod + 3 stable pods = 25% canary traffic
  selector:
    matchLabels:
      app: my-api         # same selector as the Service — traffic goes to BOTH Deployments
      track: canary
  template:
    metadata:
      labels:
        app: my-api
        track: canary
        version: v2
    spec:
      containers:
      - name: app
        image: nginx:1.25   # canary runs the new version
        ports:
        - containerPort: 80
        readinessProbe:
          httpGet:
            path: /
            port: 80
          periodSeconds: 5
        resources:
          requests:
            cpu: "50m"
            memory: "32Mi"
          limits:
            cpu: "200m"
            memory: "64Mi"
EOF

kubectl wait --for=condition=Available deployment/my-api-canary -n "$NAMESPACE" --timeout=60s
echo ""
echo "Pods after canary deployment (3x v1 + 1x v2 canary):"
kubectl get pods -n "$NAMESPACE" -l app=my-api \
  -o custom-columns='NAME:.metadata.name,VERSION:.metadata.labels.version,IMAGE:.spec.containers[0].image'

echo ""
echo "Service endpoints now include both v1 and v2 pods:"
kubectl get endpoints my-api -n "$NAMESPACE"

echo ""
echo "=== 7. Blue-green via Service selector patch ==="
echo "Adding a 'blue' Deployment (identical to the canary approach but with different labels)..."
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-api-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-api-green
  template:
    metadata:
      labels:
        app: my-api-green
        slot: green
    spec:
      containers:
      - name: app
        image: nginx:1.25
        ports:
        - containerPort: 80
        readinessProbe:
          httpGet:
            path: /
            port: 80
          periodSeconds: 5
        resources:
          requests:
            cpu: "50m"
            memory: "32Mi"
          limits:
            cpu: "200m"
            memory: "64Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: my-api-bluegreen
spec:
  selector:
    app: my-api-green    # currently pointing at green
  ports:
  - port: 80
    targetPort: 80
EOF

kubectl wait --for=condition=Available deployment/my-api-green -n "$NAMESPACE" --timeout=60s

echo ""
echo "Service currently routes to green:"
kubectl get service my-api-bluegreen -n "$NAMESPACE" -o jsonpath='{.spec.selector}'
echo ""

echo "Simulating blue-green switch back to 'blue' (patch selector)..."
kubectl patch service my-api-bluegreen -n "$NAMESPACE" \
  -p '{"spec":{"selector":{"app":"my-api"}}}'

echo "Service now routes to blue (original my-api pods):"
kubectl get service my-api-bluegreen -n "$NAMESPACE" -o jsonpath='{.spec.selector}'
echo ""

echo ""
echo "=== 8. Cleanup ==="
kubectl delete namespace "$NAMESPACE" --wait=false
echo "Namespace deletion in progress."

echo ""
echo "--- Done. Key takeaway: rolling updates with maxUnavailable=0 and a PDB are the baseline for safe deployments — canary adds blast-radius control, blue-green adds instant rollback. ---"
