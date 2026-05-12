#!/usr/bin/env bash
# demo.sh — ConfigMaps and Secrets
# Run: bash demo.sh
# Requires: kubectl configured against a live cluster
# What this shows: ConfigMap creation from literals and files, Secret creation,
#                  env var injection, volume mount injection, base64 decode risk

set -euo pipefail

NAMESPACE="configsecret-demo"

echo "=== 1. Create a demo namespace ==="
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "=== 2. Create a ConfigMap from literals ==="
kubectl create configmap app-config \
  -n "$NAMESPACE" \
  --from-literal=LOG_LEVEL=info \
  --from-literal=MAX_WORKERS=4 \
  --from-literal=FEATURE_FLAG_DARK_MODE=true \
  --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "ConfigMap contents:"
kubectl get configmap app-config -n "$NAMESPACE" -o yaml

echo ""
echo "=== 3. Create a ConfigMap from a file ==="
# Write a config file to disk
CONFIG_FILE="$(mktemp)"
cat > "$CONFIG_FILE" << 'EOF'
{
  "database": {
    "pool_size": 10,
    "timeout_seconds": 30,
    "retry_attempts": 3
  },
  "cache": {
    "ttl_seconds": 300
  }
}
EOF

kubectl create configmap app-feature-config \
  -n "$NAMESPACE" \
  --from-file=config.json="$CONFIG_FILE" \
  --dry-run=client -o yaml | kubectl apply -f -

rm -f "$CONFIG_FILE"

echo "File-based ConfigMap:"
kubectl describe configmap app-feature-config -n "$NAMESPACE"

echo ""
echo "=== 4. Create a Secret (note: this is NOT encryption — it's base64 encoding) ==="
kubectl create secret generic db-credentials \
  -n "$NAMESPACE" \
  --from-literal=username=dbadmin \
  --from-literal=password=SuperSecretPassword123 \
  --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "Secret 'describe' hides the values (as it should):"
kubectl describe secret db-credentials -n "$NAMESPACE"

echo ""
echo "=== 5. DEMONSTRATE THE BASE64 RISK ==="
echo "kubectl get secret with -o json exposes the base64-encoded values:"
RAW=$(kubectl get secret db-credentials -n "$NAMESPACE" -o jsonpath='{.data.password}')
echo "Raw base64 value: $RAW"

echo ""
echo "Anyone can decode it instantly:"
echo "$RAW" | base64 --decode
echo ""
echo "^ That is the 'secret'. base64 is encoding, NOT encryption."
echo "Real security requires: etcd encryption at rest + RBAC restricting Secret access"
echo "OR use Azure Key Vault / external secrets operator so the value never enters etcd."

echo ""
echo "=== 6. Deploy a pod that uses the ConfigMap and Secret as environment variables ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: v1
kind: Pod
metadata:
  name: config-env-demo
spec:
  containers:
  - name: app
    image: alpine:3.19
    command: ["/bin/sh", "-c"]
    args:
    - |
      echo "=== Environment variables from ConfigMap ==="
      echo "LOG_LEVEL=$LOG_LEVEL"
      echo "MAX_WORKERS=$MAX_WORKERS"
      echo "FEATURE_FLAG_DARK_MODE=$FEATURE_FLAG_DARK_MODE"
      echo ""
      echo "=== Secret injected as env var ==="
      echo "DB_USER=$DB_USER"
      echo "DB_PASS=${DB_PASS:0:3}*** (first 3 chars only, for safety)"
      sleep 300
    env:
    - name: LOG_LEVEL
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: LOG_LEVEL
    - name: MAX_WORKERS
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: MAX_WORKERS
    - name: FEATURE_FLAG_DARK_MODE
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: FEATURE_FLAG_DARK_MODE
    - name: DB_USER
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: username
    - name: DB_PASS
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: password
    resources:
      requests:
        cpu: "50m"
        memory: "32Mi"
EOF

kubectl wait --for=condition=Ready pod/config-env-demo -n "$NAMESPACE" --timeout=30s

echo ""
echo "Pod environment variable output:"
kubectl logs config-env-demo -n "$NAMESPACE"

echo ""
echo "=== 7. Deploy a pod that mounts ConfigMap and Secret as FILES ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: v1
kind: Pod
metadata:
  name: config-volume-demo
spec:
  containers:
  - name: app
    image: alpine:3.19
    command: ["/bin/sh", "-c"]
    args:
    - |
      echo "=== ConfigMap mounted as a JSON file ==="
      cat /etc/config/config.json
      echo ""
      echo "=== Secret mounted as files ==="
      echo "Files in /etc/secret:"
      ls -la /etc/secret/
      echo ""
      echo "Username file contents:"
      cat /etc/secret/username
      echo ""
      echo "Password file (truncated):"
      head -c 3 /etc/secret/password
      echo "*** (truncated)"
      sleep 300
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
      readOnly: true
    - name: secret-volume
      mountPath: /etc/secret
      readOnly: true
    resources:
      requests:
        cpu: "50m"
        memory: "32Mi"

  volumes:
  - name: config-volume
    configMap:
      name: app-feature-config

  - name: secret-volume
    secret:
      secretName: db-credentials
      defaultMode: 0400  # read-only by owner only
EOF

kubectl wait --for=condition=Ready pod/config-volume-demo -n "$NAMESPACE" --timeout=30s

echo ""
echo "Pod volume-mount output:"
kubectl logs config-volume-demo -n "$NAMESPACE"

echo ""
echo "=== 8. Demonstrate live ConfigMap update (volume mount hot-reload) ==="
echo "Updating LOG_LEVEL from 'info' to 'debug' in the ConfigMap..."
kubectl patch configmap app-config -n "$NAMESPACE" \
  --patch '{"data":{"LOG_LEVEL":"debug"}}'

echo "Updated ConfigMap:"
kubectl get configmap app-config -n "$NAMESPACE" -o jsonpath='{.data.LOG_LEVEL}'
echo ""
echo "(For volume-mounted configs, kubelet syncs the new value within ~60 seconds.)"
echo "(For env-var-mounted configs, you must restart the pod to pick up changes.)"

echo ""
echo "=== 9. Clean up ==="
kubectl delete namespace "$NAMESPACE" --ignore-not-found=true

echo ""
echo "--- Done. Key takeaway: base64 is not encryption — Kubernetes Secrets require etcd encryption at rest AND RBAC restrictions to provide real secrecy; for production credentials, use an external secrets manager like Azure Key Vault so sensitive values never land in etcd. ---"
