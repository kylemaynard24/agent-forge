#!/usr/bin/env bash
# demo.sh — What Is Kubernetes
# Run: bash demo.sh
# Requires: kubectl installed and configured (kubeconfig pointing at a live cluster)
#           Works with: minikube, kind, Docker Desktop K8s, AKS, EKS, GKE
# What this shows: cluster inspection, control plane component identification,
#                  node structure, and available API resource types

set -euo pipefail

echo "=== 1. Verify cluster connectivity and get basic info ==="
kubectl cluster-info
echo ""
echo "This tells you the API server address and CoreDNS location."

echo ""
echo "=== 2. List all nodes in the cluster ==="
kubectl get nodes -o wide
echo ""
echo "Notice the columns: NAME, STATUS, ROLES, AGE, VERSION, INTERNAL-IP, OS-IMAGE, KERNEL-VERSION"
echo "ROLES shows which nodes are 'control-plane' vs worker nodes."

echo ""
echo "=== 3. Describe a node to see its capacity and allocated resources ==="
NODE=$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')
echo "Describing node: $NODE"
echo ""
kubectl describe node "$NODE" | head -60
echo ""
echo "(Truncated — in a real session, scroll to see Capacity, Allocatable, and Non-terminated Pods)"

echo ""
echo "=== 4. List pods across ALL namespaces — spot the control plane components ==="
echo "In a managed cluster (AKS/EKS), you won't see control-plane pods — they're hidden."
echo "In minikube or kind, you WILL see them in kube-system:"
echo ""
kubectl get pods -A --sort-by='.metadata.namespace'
echo ""
echo "Look for these in kube-system:"
echo "  kube-apiserver-*        → the API server"
echo "  etcd-*                  → the cluster state store"
echo "  kube-controller-manager-* → runs all controllers"
echo "  kube-scheduler-*        → assigns pods to nodes"
echo "  coredns-*               → cluster DNS"
echo "  kube-proxy-*            → handles Service routing on each node"

echo ""
echo "=== 5. Inspect the kube-system namespace in detail ==="
kubectl get all -n kube-system
echo ""
echo "Everything here is infrastructure — your workloads go in their own namespaces."

echo ""
echo "=== 6. Examine the cluster's API resources ==="
echo "These are all the types of objects Kubernetes knows about:"
echo ""
kubectl api-resources | head -30
echo ""
echo "(Full list has 50+ resource types. Each is a kind of object you can create with kubectl apply.)"

echo ""
echo "=== 7. Show current kubeconfig contexts ==="
echo "A context is a named combination of cluster + namespace + user:"
kubectl config get-contexts
echo ""
echo "Current context:"
kubectl config current-context

echo ""
echo "=== 8. Check the API server version ==="
kubectl version --output=yaml
echo ""
echo "Client version is your kubectl. Server version is the cluster. Keep them within 1 minor version."

echo ""
echo "=== 9. Show the reconciliation model in action ==="
echo "Creating a pod that will be immediately scheduled and started:"
kubectl run demo-probe \
  --image=alpine:3.19 \
  --restart=Never \
  --command -- sleep 30 2>/dev/null || true

echo ""
echo "Watch the pod transition through phases (Pending → Running):"
echo "kubectl get pod demo-probe --watch"
echo "(Press Ctrl-C to stop watching after you see it Running)"
kubectl wait --for=condition=Ready pod/demo-probe --timeout=30s 2>/dev/null || true

echo ""
kubectl get pod demo-probe -o wide
echo ""
echo "The scheduler selected a node. The kubelet started the container. All without you specifying where."

echo ""
echo "=== 10. Clean up ==="
kubectl delete pod demo-probe --ignore-not-found=true

echo ""
echo "--- Done. Key takeaway: kubectl talks to the API server, which writes to etcd, which triggers controllers, which schedule pods, which the kubelet runs — every action follows this chain, and every debugging session starts by understanding where in the chain something went wrong. ---"
