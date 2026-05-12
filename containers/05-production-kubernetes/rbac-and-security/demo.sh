#!/usr/bin/env bash
# demo.sh — RBAC and Security
# Run: bash demo.sh
# Requires: kubectl connected to a cluster with Azure CNI or Calico (for NetworkPolicy)

set -euo pipefail

NAMESPACE="security-demo"

echo "=== 1. Create namespace ==="
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "=== 2. Deploy a fully hardened pod ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: v1
kind: Pod
metadata:
  name: hardened-app
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 1000
    fsGroup: 1000
  containers:
  - name: app
    image: nginx:1.25
    ports:
    - containerPort: 8080
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
      seccompProfile:
        type: RuntimeDefault
    volumeMounts:
    - name: tmp
      mountPath: /tmp
    - name: nginx-cache
      mountPath: /var/cache/nginx
    - name: nginx-run
      mountPath: /var/run
    - name: nginx-logs
      mountPath: /var/log/nginx
    resources:
      requests:
        cpu: "50m"
        memory: "32Mi"
      limits:
        cpu: "200m"
        memory: "64Mi"
  volumes:
  - name: tmp
    emptyDir: {}
  - name: nginx-cache
    emptyDir: {}
  - name: nginx-run
    emptyDir: {}
  - name: nginx-logs
    emptyDir: {}
EOF

echo "Waiting for hardened pod..."
kubectl wait --for=condition=Ready pod/hardened-app -n "$NAMESPACE" --timeout=60s || \
  echo "(pod may be pending due to image user — checking...)"

echo ""
echo "=== 3. Show what an attacker gains WITHOUT securityContext ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: v1
kind: Pod
metadata:
  name: insecure-app
spec:
  containers:
  - name: app
    image: busybox:1.36
    command: ["sleep", "3600"]
    # No securityContext — runs as root, writable filesystem, all capabilities
    resources:
      requests:
        cpu: "10m"
        memory: "8Mi"
      limits:
        cpu: "50m"
        memory: "16Mi"
EOF

kubectl wait --for=condition=Ready pod/insecure-app -n "$NAMESPACE" --timeout=30s

echo ""
echo "--- Insecure pod: who am I? (should be root) ---"
kubectl exec -n "$NAMESPACE" insecure-app -- whoami

echo ""
echo "--- Insecure pod: can I write to /? (should succeed) ---"
kubectl exec -n "$NAMESPACE" insecure-app -- touch /i-am-root 2>/dev/null && \
  echo "DANGER: wrote to root filesystem" || echo "(blocked)"

echo ""
echo "--- Insecure pod: capabilities (many dangerous capabilities) ---"
kubectl exec -n "$NAMESPACE" insecure-app -- cat /proc/1/status | grep CapEff || true

echo ""
echo "=== 4. Test the hardened pod's security restrictions ==="
echo ""
echo "--- Hardened pod: who am I? (should be 1000, not root) ---"
kubectl exec -n "$NAMESPACE" hardened-app -- id 2>/dev/null || \
  echo "(exec may fail if pod didn't start — check: kubectl describe pod hardened-app -n $NAMESPACE)"

echo ""
echo "--- Hardened pod: try to write to root filesystem (should FAIL) ---"
kubectl exec -n "$NAMESPACE" hardened-app -- touch /cannot-write-here 2>&1 || \
  echo "(expected: read-only file system)"

echo ""
echo "--- Hardened pod: can write to /tmp (emptyDir volume) ---"
kubectl exec -n "$NAMESPACE" hardened-app -- touch /tmp/this-is-ok && \
  echo "Wrote to /tmp: OK (emptyDir is writable)" || echo "(unexpected failure)"

echo ""
echo "=== 5. Apply a default-deny NetworkPolicy ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
# Block ALL ingress to all pods in this namespace
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress
EOF
echo "Default-deny ingress NetworkPolicy applied."

echo ""
echo "=== 6. Deploy a test client and server to verify NetworkPolicy ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: v1
kind: Pod
metadata:
  name: server
  labels:
    app: server
spec:
  containers:
  - name: server
    image: hashicorp/http-echo:0.2.3
    args: ["-text=hello from server"]
    ports:
    - containerPort: 5678
    resources:
      requests:
        cpu: "10m"
        memory: "8Mi"
      limits:
        cpu: "50m"
        memory: "16Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: server
spec:
  selector:
    app: server
  ports:
  - port: 5678
    targetPort: 5678
---
apiVersion: v1
kind: Pod
metadata:
  name: client
  labels:
    app: client
spec:
  containers:
  - name: client
    image: busybox:1.36
    command: ["sleep", "3600"]
    resources:
      requests:
        cpu: "10m"
        memory: "8Mi"
      limits:
        cpu: "50m"
        memory: "16Mi"
EOF

kubectl wait --for=condition=Ready pod/server pod/client -n "$NAMESPACE" --timeout=60s

echo ""
echo "--- Without allow rule: client cannot reach server ---"
kubectl exec -n "$NAMESPACE" client -- \
  wget -q --timeout=3 -O- http://server:5678 2>&1 || \
  echo "(expected: connection timeout — NetworkPolicy is blocking)"

echo ""
echo "=== 7. Add explicit allow rule for client → server ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-client-to-server
spec:
  podSelector:
    matchLabels:
      app: server
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: client
    ports:
    - port: 5678
EOF

echo "Allow rule applied. Waiting 5s for policy to propagate..."
sleep 5

echo ""
echo "--- With allow rule: client CAN reach server ---"
kubectl exec -n "$NAMESPACE" client -- \
  wget -q --timeout=5 -O- http://server:5678 2>/dev/null || \
  echo "(NetworkPolicy enforcement depends on CNI — Azure CNI with NPM or Calico required)"

echo ""
echo "=== 8. Verify RBAC with kubectl auth can-i ==="
echo "What can the default ServiceAccount in this namespace do?"
kubectl auth can-i get pods \
  --namespace "$NAMESPACE" \
  --as "system:serviceaccount:$NAMESPACE:default" && \
  echo "default SA can get pods" || echo "default SA cannot get pods"

kubectl auth can-i get secrets \
  --namespace "$NAMESPACE" \
  --as "system:serviceaccount:$NAMESPACE:default" && \
  echo "DANGER: default SA can get secrets" || echo "default SA cannot get secrets (expected)"

echo ""
echo "=== 9. OPA/Gatekeeper ConstraintTemplate example (informational) ==="
echo ""
echo "Install Gatekeeper: helm install gatekeeper opa/gatekeeper -n gatekeeper-system --create-namespace"
echo ""
cat <<'GATEKEEPER_EXAMPLE'
# ConstraintTemplate: reject containers running as root
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: k8snoroot
spec:
  crd:
    spec:
      names:
        kind: K8sNoRoot
  targets:
  - target: admission.k8s.gatekeeper.sh
    rego: |
      package k8snoroot
      violation[{"msg": msg}] {
        container := input.review.object.spec.containers[_]
        not container.securityContext.runAsNonRoot == true
        msg := sprintf("Container %v must set runAsNonRoot: true", [container.name])
      }
---
# Constraint: enforce the template cluster-wide
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sNoRoot
metadata:
  name: no-root-containers
spec:
  match:
    kinds:
    - apiGroups: [""]
      kinds: ["Pod"]
GATEKEEPER_EXAMPLE

echo ""
echo "=== 10. Cleanup ==="
kubectl delete namespace "$NAMESPACE" --wait=false
echo "Namespace deletion in progress."

echo ""
echo "--- Done. Key takeaway: runAsNonRoot + readOnlyRootFilesystem + drop ALL capabilities + NetworkPolicy default-deny forms defense-in-depth that limits an attacker's blast radius to a single pod. ---"
