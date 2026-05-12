#!/usr/bin/env bash
# demo.sh — Ingress and Load Balancing
# Run: bash demo.sh
# Requires: kubectl connected to a cluster, helm installed
#           Works with minikube (minikube addons enable ingress) or kind or AKS

set -euo pipefail

NAMESPACE="ingress-demo"

echo "=== 1. Create namespace ==="
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "=== 2. Install nginx Ingress controller (if not already installed) ==="
if ! kubectl get ingressclass nginx &>/dev/null; then
  echo "nginx IngressClass not found — installing via Helm..."
  helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
  helm repo update
  helm install ingress-nginx ingress-nginx/ingress-nginx \
    --namespace ingress-nginx \
    --create-namespace \
    --set controller.replicaCount=1 \
    --wait --timeout=120s
  echo "nginx Ingress controller installed."
else
  echo "nginx IngressClass already present — skipping install."
fi

echo ""
echo "IngressClasses available in this cluster:"
kubectl get ingressclass

echo ""
echo "=== 3. Deploy two backend services ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
# app-v1: returns "Hello from v1"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app-v1
  template:
    metadata:
      labels:
        app: app-v1
    spec:
      containers:
      - name: app
        image: hashicorp/http-echo:0.2.3
        args: ["-text=Hello from v1", "-listen=:5678"]
        ports:
        - containerPort: 5678
        resources:
          requests:
            cpu: "10m"
            memory: "16Mi"
          limits:
            cpu: "50m"
            memory: "32Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: app-v1
spec:
  selector:
    app: app-v1
  ports:
  - port: 80
    targetPort: 5678
---
# app-v2: returns "Hello from v2"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-v2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app-v2
  template:
    metadata:
      labels:
        app: app-v2
    spec:
      containers:
      - name: app
        image: hashicorp/http-echo:0.2.3
        args: ["-text=Hello from v2", "-listen=:5678"]
        ports:
        - containerPort: 5678
        resources:
          requests:
            cpu: "10m"
            memory: "16Mi"
          limits:
            cpu: "50m"
            memory: "32Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: app-v2
spec:
  selector:
    app: app-v2
  ports:
  - port: 80
    targetPort: 5678
EOF

kubectl wait --for=condition=Available deployment/app-v1 deployment/app-v2 \
  -n "$NAMESPACE" --timeout=60s
echo "Both services are running."

echo ""
echo "=== 4. Create Ingress with path-based routing ==="
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: demo-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: demo.local
    http:
      paths:
      - path: /v1
        pathType: Prefix
        backend:
          service:
            name: app-v1
            port:
              number: 80
      - path: /v2
        pathType: Prefix
        backend:
          service:
            name: app-v2
            port:
              number: 80
EOF

echo ""
echo "Ingress resource created:"
kubectl describe ingress demo-ingress -n "$NAMESPACE"

echo ""
echo "=== 5. Test path routing ==="
INGRESS_IP=$(kubectl get service ingress-nginx-controller -n ingress-nginx \
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || \
  kubectl get service ingress-nginx-controller -n ingress-nginx \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "")

if [ -z "$INGRESS_IP" ]; then
  echo "Note: Ingress controller does not have an external IP yet (may need a few minutes on cloud)."
  echo "On minikube, run: minikube tunnel (in another terminal) or use: minikube ip"
  INGRESS_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}' 2>/dev/null || echo "127.0.0.1")
  echo "Using node IP: $INGRESS_IP (may require NodePort)"
fi

echo "Ingress IP/hostname: $INGRESS_IP"
echo ""
echo "Testing /v1 path (should return 'Hello from v1'):"
curl -s --max-time 5 -H "Host: demo.local" "http://$INGRESS_IP/v1" 2>/dev/null || \
  echo "(connection failed — ensure ingress controller has an external IP and try manually: curl -H 'Host: demo.local' http://<INGRESS_IP>/v1)"

echo ""
echo "Testing /v2 path (should return 'Hello from v2'):"
curl -s --max-time 5 -H "Host: demo.local" "http://$INGRESS_IP/v2" 2>/dev/null || \
  echo "(connection failed — try manually after ingress IP is assigned)"

echo ""
echo "=== 6. Add TLS with a self-signed certificate ==="
echo "Generating a self-signed cert for demo.local..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /tmp/demo-tls.key \
  -out /tmp/demo-tls.crt \
  -subj "/CN=demo.local/O=demo" \
  -addext "subjectAltName=DNS:demo.local" 2>/dev/null

kubectl create secret tls demo-tls \
  --cert=/tmp/demo-tls.crt \
  --key=/tmp/demo-tls.key \
  -n "$NAMESPACE" \
  --dry-run=client -o yaml | kubectl apply -f -

# Update ingress to use TLS
cat <<'EOF' | kubectl apply -n "$NAMESPACE" -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: demo-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - demo.local
    secretName: demo-tls    # our self-signed cert
  rules:
  - host: demo.local
    http:
      paths:
      - path: /v1
        pathType: Prefix
        backend:
          service:
            name: app-v1
            port:
              number: 80
      - path: /v2
        pathType: Prefix
        backend:
          service:
            name: app-v2
            port:
              number: 80
EOF

echo ""
echo "Ingress with TLS configured. Testing HTTPS (self-signed — using -k to skip verification):"
curl -sk --max-time 5 -H "Host: demo.local" "https://$INGRESS_IP/v1" 2>/dev/null || \
  echo "(try: curl -sk -H 'Host: demo.local' https://<INGRESS_IP>/v1)"

echo ""
echo "=== 7. kubectl describe ingress — events and rules ==="
kubectl describe ingress demo-ingress -n "$NAMESPACE"

echo ""
echo "=== 8. Show cert-manager ClusterIssuer example (informational) ==="
echo ""
echo "In production, replace the self-signed cert with cert-manager + Let's Encrypt:"
cat <<'CERT_MANAGER_EXAMPLE'
# Install cert-manager:
# helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --set installCRDs=true

apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
    - http01:
        ingress:
          class: nginx

# Then annotate your Ingress:
# cert-manager.io/cluster-issuer: "letsencrypt-prod"
# cert-manager automatically creates and rotates the TLS Secret.
CERT_MANAGER_EXAMPLE

echo ""
echo "=== 9. Cleanup ==="
kubectl delete namespace "$NAMESPACE" --wait=false
rm -f /tmp/demo-tls.key /tmp/demo-tls.crt
echo "Namespace deletion in progress."

echo ""
echo "--- Done. Key takeaway: one Ingress controller with one public IP replaces a LoadBalancer per service — add cert-manager and you get automated TLS with zero ongoing certificate management. ---"
