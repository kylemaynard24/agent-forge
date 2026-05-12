#!/usr/bin/env bash
# demo.sh — Deployments and ReplicaSets
# Run: bash demo.sh
# Requires: kubectl configured against a live cluster
# What this shows: deployment creation, scaling, rolling update, rollout status,
#                  failed deployment simulation, and rollback

set -euo pipefail

NAMESPACE="deployments-demo"

echo "=== 1. Create a demo namespace ==="
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "=== 2. Create an initial Deployment (nginx v1.25) ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webserver
  annotations:
    kubernetes.io/change-cause: "Initial deploy — nginx 1.25"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webserver
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  minReadySeconds: 5
  template:
    metadata:
      labels:
        app: webserver
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: "50m"
            memory: "32Mi"
          limits:
            cpu: "100m"
            memory: "64Mi"
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
EOF

echo ""
echo "Waiting for initial rollout to complete..."
kubectl rollout status deployment/webserver -n "$NAMESPACE" --timeout=90s

echo ""
echo "=== 3. Check what Kubernetes created ==="
echo "The Deployment:"
kubectl get deployment webserver -n "$NAMESPACE" -o wide

echo ""
echo "The ReplicaSet (owned by the Deployment):"
kubectl get replicasets -n "$NAMESPACE"

echo ""
echo "The Pods (owned by the ReplicaSet):"
kubectl get pods -n "$NAMESPACE" -o wide

echo ""
echo "=== 4. Scale the Deployment to 5 replicas ==="
kubectl scale deployment webserver -n "$NAMESPACE" --replicas=5

echo ""
echo "Waiting for scale to complete..."
kubectl rollout status deployment/webserver -n "$NAMESPACE" --timeout=60s

kubectl get pods -n "$NAMESPACE"

echo ""
echo "=== 5. Trigger a GOOD rolling update — upgrade nginx to 1.26 ==="
kubectl set image deployment/webserver nginx=nginx:1.26 -n "$NAMESPACE"
kubectl annotate deployment/webserver -n "$NAMESPACE" \
  kubernetes.io/change-cause="Upgrade to nginx 1.26 — security patch" \
  --overwrite

echo ""
echo "Watch the rolling update (new pods come up, old ones go down):"
kubectl rollout status deployment/webserver -n "$NAMESPACE" --timeout=120s

echo ""
echo "Now we have 5 pods on nginx 1.26. Notice the ReplicaSet history:"
kubectl get replicasets -n "$NAMESPACE"
echo "(Two ReplicaSets: the old one scaled to 0, the new one at 5)"

echo ""
echo "=== 6. Simulate a FAILED rollout — use a nonexistent image tag ==="
kubectl set image deployment/webserver nginx=nginx:this-tag-does-not-exist -n "$NAMESPACE"
kubectl annotate deployment/webserver -n "$NAMESPACE" \
  kubernetes.io/change-cause="BAD: trying to upgrade to nonexistent tag" \
  --overwrite

echo ""
echo "Watching the failed rollout (will timeout or show error):"
kubectl rollout status deployment/webserver -n "$NAMESPACE" --timeout=60s || true

echo ""
echo "Look at the pods — some are new (ImagePullBackOff or ErrImagePull), some old are still running:"
kubectl get pods -n "$NAMESPACE"

echo ""
echo "=== 7. Roll back to the previous good version ==="
kubectl rollout undo deployment/webserver -n "$NAMESPACE"

echo ""
echo "Rolling back to nginx:1.26 — this should be fast (no image pull needed):"
kubectl rollout status deployment/webserver -n "$NAMESPACE" --timeout=90s

echo ""
kubectl get pods -n "$NAMESPACE"

echo ""
echo "=== 8. Check rollout history ==="
kubectl rollout history deployment/webserver -n "$NAMESPACE"
echo ""
echo "Notice the CHANGE-CAUSE annotations — this is why documenting your rollouts matters."

echo ""
echo "=== 9. Roll back to a SPECIFIC revision ==="
echo "Rolling back to revision 1 (original nginx:1.25):"
kubectl rollout undo deployment/webserver -n "$NAMESPACE" --to-revision=1

kubectl rollout status deployment/webserver -n "$NAMESPACE" --timeout=90s

echo ""
echo "Verify we're back on nginx:1.25:"
kubectl get pods -n "$NAMESPACE" -o jsonpath='{range .items[*]}{.spec.containers[0].image}{"\n"}{end}' | sort -u

echo ""
echo "=== 10. Demonstrate pause and resume (useful for canary validation) ==="
kubectl rollout pause deployment/webserver -n "$NAMESPACE"
kubectl set image deployment/webserver nginx=nginx:1.26 -n "$NAMESPACE"
echo "Rollout paused after starting the update. 0 new pods created yet."
kubectl get replicasets -n "$NAMESPACE"

echo ""
echo "Resuming rollout..."
kubectl rollout resume deployment/webserver -n "$NAMESPACE"
kubectl rollout status deployment/webserver -n "$NAMESPACE" --timeout=90s

echo ""
echo "=== 11. Clean up ==="
kubectl delete namespace "$NAMESPACE" --ignore-not-found=true

echo ""
echo "--- Done. Key takeaway: Deployments maintain desired state via ReplicaSets, roll out changes incrementally, and keep the old ReplicaSet around at scale 0 so rollback is instant — not a redeploy, just a scale operation. ---"
