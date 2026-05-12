#!/usr/bin/env bash
# demo.sh — Helm Charts
# Run: bash demo.sh
# Requires: helm 3.x installed, kubectl connected to a cluster

set -euo pipefail

CHART_DIR="/tmp/helm-demo-chart"
RELEASE="myapi"
DEV_NS="helm-dev"
PROD_NS="helm-prod"

echo "=== 1. Create a new chart scaffold ==="
rm -rf "$CHART_DIR"
helm create "$CHART_DIR/myapi"
echo "Chart created at $CHART_DIR/myapi"
echo ""
echo "Chart structure:"
find "$CHART_DIR/myapi" -type f | sort

echo ""
echo "=== 2. Customize values.yaml ==="
cat > "$CHART_DIR/myapi/values.yaml" <<'EOF'
replicaCount: 1

image:
  repository: nginx
  tag: "1.25"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

resources:
  requests:
    cpu: "50m"
    memory: "32Mi"
  limits:
    cpu: "200m"
    memory: "64Mi"

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 5
  targetCPUUtilizationPercentage: 70

ingress:
  enabled: false

serviceAccount:
  create: false
  name: ""

podAnnotations: {}
podSecurityContext: {}
securityContext: {}
nodeSelector: {}
tolerations: []
affinity: {}
EOF

echo ""
echo "=== 3. Create environment-specific values files ==="
cat > "$CHART_DIR/values-dev.yaml" <<'EOF'
replicaCount: 1
image:
  tag: "1.24"    # dev runs the previous version for testing
resources:
  requests:
    cpu: "25m"
    memory: "16Mi"
  limits:
    cpu: "100m"
    memory: "32Mi"
EOF

cat > "$CHART_DIR/values-prod.yaml" <<'EOF'
replicaCount: 3
image:
  tag: "1.25"    # prod runs the current stable version
resources:
  requests:
    cpu: "100m"
    memory: "64Mi"
  limits:
    cpu: "500m"
    memory: "128Mi"
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 8
  targetCPUUtilizationPercentage: 60
EOF

echo "Dev values file:"
cat "$CHART_DIR/values-dev.yaml"
echo ""
echo "Prod values file:"
cat "$CHART_DIR/values-prod.yaml"

echo ""
echo "=== 4. Preview rendered templates with helm template ==="
echo "--- Dev render (partial) ---"
helm template "$RELEASE" "$CHART_DIR/myapi" \
  --namespace "$DEV_NS" \
  --values "$CHART_DIR/values-dev.yaml" | grep -A 10 "kind: Deployment" | head -20

echo ""
echo "--- Prod render — replica count should be 3 ---"
helm template "$RELEASE" "$CHART_DIR/myapi" \
  --namespace "$PROD_NS" \
  --values "$CHART_DIR/values-prod.yaml" | grep "replicas:"

echo ""
echo "=== 5. Dry-run install (validates against cluster API server) ==="
kubectl create namespace "$DEV_NS" --dry-run=client -o yaml | kubectl apply -f -
helm install "$RELEASE" "$CHART_DIR/myapi" \
  --namespace "$DEV_NS" \
  --values "$CHART_DIR/values-dev.yaml" \
  --dry-run \
  --generate-name 2>/dev/null | head -30
echo "(dry-run complete — no resources deployed yet)"

echo ""
echo "=== 6. Install to dev namespace ==="
helm upgrade --install "$RELEASE" "$CHART_DIR/myapi" \
  --namespace "$DEV_NS" \
  --create-namespace \
  --values "$CHART_DIR/values-dev.yaml" \
  --wait --timeout 60s

echo ""
echo "Dev release status:"
helm status "$RELEASE" --namespace "$DEV_NS"
kubectl get pods -n "$DEV_NS"

echo ""
echo "=== 7. Install to prod namespace (different values, same chart) ==="
kubectl create namespace "$PROD_NS" --dry-run=client -o yaml | kubectl apply -f -
helm upgrade --install "$RELEASE" "$CHART_DIR/myapi" \
  --namespace "$PROD_NS" \
  --create-namespace \
  --values "$CHART_DIR/values-prod.yaml" \
  --wait --timeout 60s

echo ""
echo "Prod release — should have 3 replicas:"
kubectl get pods -n "$PROD_NS"

echo ""
echo "=== 8. Helm upgrade — change image tag in dev ==="
helm upgrade "$RELEASE" "$CHART_DIR/myapi" \
  --namespace "$DEV_NS" \
  --values "$CHART_DIR/values-dev.yaml" \
  --set image.tag=1.25 \
  --wait --timeout 60s

echo ""
echo "Dev image after upgrade (should be nginx:1.25):"
kubectl get pods -n "$DEV_NS" \
  -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[0].image}{"\n"}{end}'

echo ""
echo "=== 9. Helm release history ==="
helm history "$RELEASE" --namespace "$DEV_NS"

echo ""
echo "=== 10. Helm rollback to revision 1 ==="
helm rollback "$RELEASE" 1 --namespace "$DEV_NS" --wait
echo ""
echo "Image after rollback (should be back to nginx:1.24):"
kubectl get pods -n "$DEV_NS" \
  -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[0].image}{"\n"}{end}'
echo ""
echo "Release history after rollback:"
helm history "$RELEASE" --namespace "$DEV_NS"

echo ""
echo "=== 11. Show hook example (informational) ==="
cat <<'HOOK_EXAMPLE'
# Add this to templates/db-migration-job.yaml to run migrations before upgrade:
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}-db-migrate"
  annotations:
    "helm.sh/hook": pre-upgrade,pre-install
    "helm.sh/hook-weight": "-5"                # lower weight = runs first
    "helm.sh/hook-delete-policy": before-hook-creation
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: migration
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        command: ["dotnet", "ef", "database", "update"]
HOOK_EXAMPLE

echo ""
echo "=== 12. Cleanup ==="
helm uninstall "$RELEASE" --namespace "$DEV_NS" 2>/dev/null || true
helm uninstall "$RELEASE" --namespace "$PROD_NS" 2>/dev/null || true
kubectl delete namespace "$DEV_NS" "$PROD_NS" --wait=false 2>/dev/null || true
rm -rf "$CHART_DIR"
echo "Cleanup complete."

echo ""
echo "--- Done. Key takeaway: one Helm chart deploys to every environment — values files declare what varies, templates encode what stays constant, and helm history gives you instant rollback. ---"
