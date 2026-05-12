#!/usr/bin/env bash
# demo.sh — Namespaces and RBAC
# Run: bash demo.sh
# Requires: kubectl configured against a live cluster with cluster-admin or equivalent
# What this shows: namespace creation, ResourceQuota, ServiceAccount, Role,
#                  RoleBinding, and kubectl auth can-i permission testing

set -euo pipefail

NAMESPACE="rbac-demo"

echo "=== 1. Create a demo namespace ==="
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "List namespaces — see yours alongside system namespaces:"
kubectl get namespaces

echo ""
echo "=== 2. Apply a ResourceQuota to cap CPU and memory for this namespace ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-quota
spec:
  hard:
    requests.cpu: "2"
    requests.memory: "2Gi"
    limits.cpu: "4"
    limits.memory: "4Gi"
    pods: "10"
    count/secrets: "20"
    count/configmaps: "20"
EOF

echo ""
echo "ResourceQuota applied — any pod creation that would exceed these limits is rejected:"
kubectl describe resourcequota team-quota -n "$NAMESPACE"

echo ""
echo "=== 3. Apply a LimitRange to set defaults for pods that don't specify resources ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
spec:
  limits:
  - type: Container
    default:
      cpu: "100m"
      memory: "128Mi"
    defaultRequest:
      cpu: "50m"
      memory: "64Mi"
    max:
      cpu: "1"
      memory: "1Gi"
EOF

echo ""
echo "LimitRange set — pods without resource specs will get these defaults:"
kubectl describe limitrange default-limits -n "$NAMESPACE"

echo ""
echo "=== 4. Create a dedicated ServiceAccount for an application ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: v1
kind: ServiceAccount
metadata:
  name: readonly-app
  namespace: rbac-demo
automountServiceAccountToken: false  # disable if app doesn't need K8s API access
EOF

echo ""
echo "ServiceAccount created:"
kubectl get serviceaccount readonly-app -n "$NAMESPACE"

echo ""
echo "=== 5. Create a Role that allows only read access to Pods ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: rbac-demo
rules:
- apiGroups: [""]           # "" means core API group (pods, services, configmaps, etc.)
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
# Notably absent: "create", "update", "patch", "delete"
EOF

echo ""
echo "Role created — it allows only read operations on pods:"
kubectl describe role pod-reader -n "$NAMESPACE"

echo ""
echo "=== 6. Bind the Role to the ServiceAccount ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pod-reader-binding
  namespace: rbac-demo
subjects:
- kind: ServiceAccount
  name: readonly-app
  namespace: rbac-demo
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
EOF

echo ""
echo "RoleBinding applied — readonly-app can now read pods in this namespace."

echo ""
echo "=== 7. Test permissions with kubectl auth can-i ==="

SA="system:serviceaccount:${NAMESPACE}:readonly-app"

echo ""
echo "Can readonly-app GET pods? (should be YES)"
kubectl auth can-i get pods --as="$SA" -n "$NAMESPACE"

echo ""
echo "Can readonly-app LIST pods? (should be YES)"
kubectl auth can-i list pods --as="$SA" -n "$NAMESPACE"

echo ""
echo "Can readonly-app DELETE pods? (should be NO)"
kubectl auth can-i delete pods --as="$SA" -n "$NAMESPACE"

echo ""
echo "Can readonly-app GET secrets? (should be NO)"
kubectl auth can-i get secrets --as="$SA" -n "$NAMESPACE"

echo ""
echo "Can readonly-app CREATE deployments? (should be NO)"
kubectl auth can-i create deployments --as="$SA" -n "$NAMESPACE"

echo ""
echo "Can readonly-app GET pods in a DIFFERENT namespace? (should be NO — Role is namespace-scoped)"
kubectl auth can-i get pods --as="$SA" -n kube-system

echo ""
echo "=== 8. Create a deploy-bot ServiceAccount with deploy but not delete permissions ==="
kubectl apply -n "$NAMESPACE" -f - << 'YAML'
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: deploy-bot
  namespace: rbac-demo
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deployer
  namespace: rbac-demo
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch"]
  # "delete" is intentionally absent
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: deployer-binding
  namespace: rbac-demo
subjects:
- kind: ServiceAccount
  name: deploy-bot
  namespace: rbac-demo
roleRef:
  kind: Role
  name: deployer
  apiGroup: rbac.authorization.k8s.io
YAML

echo ""
DEPLOY_SA="system:serviceaccount:${NAMESPACE}:deploy-bot"

echo "deploy-bot permission checks:"
echo "Can it CREATE deployments? (YES)"
kubectl auth can-i create deployments --as="$DEPLOY_SA" -n "$NAMESPACE"

echo "Can it UPDATE deployments? (YES)"
kubectl auth can-i update deployments --as="$DEPLOY_SA" -n "$NAMESPACE"

echo "Can it DELETE deployments? (NO)"
kubectl auth can-i delete deployments --as="$DEPLOY_SA" -n "$NAMESPACE"

echo "Can it DELETE pods? (NO)"
kubectl auth can-i delete pods --as="$DEPLOY_SA" -n "$NAMESPACE"

echo ""
echo "=== 9. Demonstrate ResourceQuota enforcement ==="
echo "Creating a pod that FITS within the quota..."
kubectl run quota-ok \
  --image=alpine:3.19 \
  --restart=Never \
  -n "$NAMESPACE" \
  --requests='cpu=100m,memory=128Mi' \
  --limits='cpu=200m,memory=256Mi' \
  --command -- sleep 60

echo ""
echo "Current quota usage after creating one pod:"
kubectl describe resourcequota team-quota -n "$NAMESPACE" | grep -A 5 "Resource"

echo ""
echo "=== 10. Clean up ==="
kubectl delete namespace "$NAMESPACE" --ignore-not-found=true

echo ""
echo "--- Done. Key takeaway: RBAC grants are additive and namespace-scoped by default — use a dedicated ServiceAccount per workload, grant only the verbs it needs, verify with kubectl auth can-i, and never start with cluster-admin as a shortcut. ---"
