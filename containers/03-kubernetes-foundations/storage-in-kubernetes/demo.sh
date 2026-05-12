#!/usr/bin/env bash
# demo.sh — Storage in Kubernetes
# Run: bash demo.sh
# Requires: kubectl configured against a live cluster with a StorageClass available
#           Works best on AKS (uses 'default' StorageClass backed by Azure Disk)
#           On minikube: uses 'standard' StorageClass backed by host path
#           On kind: install local-path-provisioner first
# What this shows: PVC creation, pod with persistent storage, data survival across pod deletion

set -euo pipefail

NAMESPACE="storage-demo"

echo "=== 1. List available StorageClasses ==="
kubectl get storageclass
echo ""
echo "The (default) StorageClass is used when a PVC doesn't specify one."
echo "On AKS: 'default' = Azure Standard SSD, 'managed-premium' = Azure Premium SSD"
echo "On minikube: 'standard' = host-path (not suitable for production)"

# Detect the default StorageClass name
DEFAULT_SC=$(kubectl get storageclass -o jsonpath='{.items[?(@.metadata.annotations.storageclass\.kubernetes\.io/is-default-class=="true")].metadata.name}' 2>/dev/null | awk '{print $1}')
echo ""
echo "Using default StorageClass: ${DEFAULT_SC:-<none found — you may need to specify one>}"

echo ""
echo "=== 2. Create a demo namespace ==="
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "=== 3. Create a PersistentVolumeClaim ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-data
spec:
  accessModes:
  - ReadWriteOnce       # one node can mount this as read-write
  resources:
    requests:
      storage: 1Gi      # minimum 1 Gi from the StorageClass provisioner
  # storageClassName: default  # Omitting = use the default StorageClass
EOF

echo ""
echo "PVC status (may be Pending until a pod mounts it):"
kubectl get pvc app-data -n "$NAMESPACE"

echo ""
echo "=== 4. Deploy a pod that writes data to the PVC ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: v1
kind: Pod
metadata:
  name: data-writer
spec:
  containers:
  - name: writer
    image: alpine:3.19
    command: ["/bin/sh", "-c"]
    args:
    - |
      echo "Writing data to persistent volume..."
      echo "Written at: $(date)" > /data/timestamp.txt
      echo "Pod name: $HOSTNAME" >> /data/timestamp.txt
      echo "Data entry 1" >> /data/records.csv
      echo "Data entry 2" >> /data/records.csv
      echo "Data entry 3" >> /data/records.csv
      echo ""
      echo "Files written:"
      ls -la /data/
      echo ""
      echo "Content of timestamp.txt:"
      cat /data/timestamp.txt
      echo ""
      echo "Content of records.csv:"
      cat /data/records.csv
      sleep 30
    volumeMounts:
    - name: app-storage
      mountPath: /data
    resources:
      requests:
        cpu: "50m"
        memory: "32Mi"
  volumes:
  - name: app-storage
    persistentVolumeClaim:
      claimName: app-data
EOF

echo ""
echo "Waiting for data-writer pod to complete its writes..."
kubectl wait --for=condition=Ready pod/data-writer -n "$NAMESPACE" --timeout=120s

echo ""
echo "PVC status now (should be Bound — the pod triggered provisioning):"
kubectl get pvc app-data -n "$NAMESPACE"

echo ""
echo "PV that was automatically provisioned:"
kubectl get pv

echo ""
echo "Data written by the pod:"
kubectl logs data-writer -n "$NAMESPACE"

echo ""
echo "=== 5. Delete the pod (simulating pod death / rescheduling) ==="
echo "This should NOT delete the PVC or the data."
kubectl delete pod data-writer -n "$NAMESPACE"

echo ""
echo "After pod deletion — PVC still exists and is still Bound:"
kubectl get pvc app-data -n "$NAMESPACE"
kubectl get pv

echo ""
echo "=== 6. Create a NEW pod that reads the same PVC ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: v1
kind: Pod
metadata:
  name: data-reader
spec:
  containers:
  - name: reader
    image: alpine:3.19
    command: ["/bin/sh", "-c"]
    args:
    - |
      echo "=== Reading data from persistent volume ==="
      echo ""
      echo "Files found in /data:"
      ls -la /data/
      echo ""
      echo "Contents of timestamp.txt (written by PREVIOUS pod):"
      cat /data/timestamp.txt
      echo ""
      echo "Contents of records.csv (written by PREVIOUS pod):"
      cat /data/records.csv
      echo ""
      echo "Data persisted across pod deletion and recreation!"
      sleep 30
    volumeMounts:
    - name: app-storage
      mountPath: /data
    resources:
      requests:
        cpu: "50m"
        memory: "32Mi"
  volumes:
  - name: app-storage
    persistentVolumeClaim:
      claimName: app-data
EOF

kubectl wait --for=condition=Ready pod/data-reader -n "$NAMESPACE" --timeout=120s

echo ""
echo "Data reader pod output — this is reading data written by the PREVIOUS pod:"
kubectl logs data-reader -n "$NAMESPACE"

echo ""
echo "=== 7. Describe the PVC and PV for full detail ==="
kubectl describe pvc app-data -n "$NAMESPACE"

echo ""
echo "=== 8. Demonstrate StatefulSet with volumeClaimTemplates ==="
kubectl apply -n "$NAMESPACE" -f - << 'EOF'
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: stateful-app
spec:
  serviceName: stateful-app-headless
  replicas: 2
  selector:
    matchLabels:
      app: stateful-app
  template:
    metadata:
      labels:
        app: stateful-app
    spec:
      containers:
      - name: app
        image: alpine:3.19
        command: ["/bin/sh", "-c"]
        args:
        - |
          echo "Pod $HOSTNAME starting..."
          echo "My data is at /data — listing:"
          ls -la /data/ || echo "(empty)"
          echo "Writing my identity..."
          echo "I am $HOSTNAME, started at $(date)" >> /data/identity.txt
          sleep 300
        volumeMounts:
        - name: data
          mountPath: /data
        resources:
          requests:
            cpu: "50m"
            memory: "32Mi"
  volumeClaimTemplates:            # each pod gets its own PVC
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 512Mi
EOF

echo ""
echo "Waiting for StatefulSet pods..."
kubectl rollout status statefulset/stateful-app -n "$NAMESPACE" --timeout=120s

echo ""
echo "StatefulSet pods (note the stable names: -0 and -1):"
kubectl get pods -n "$NAMESPACE" -l app=stateful-app

echo ""
echo "Each pod got its own PVC:"
kubectl get pvc -n "$NAMESPACE"

echo ""
echo "=== 9. Clean up ==="
echo "Deleting the namespace (which deletes PVCs — and since default reclaimPolicy=Delete,"
echo "this also deletes the underlying Azure Disks/hostPath volumes)"
kubectl delete namespace "$NAMESPACE" --ignore-not-found=true

echo ""
echo "Check that PVs are gone (or in Released state for Retain policy):"
kubectl get pv 2>/dev/null | grep -E "storage-demo|$NAMESPACE" || echo "All PVs from demo cleaned up."

echo ""
echo "--- Done. Key takeaway: PVCs outlive pods — data written to a PVC-backed volume survives pod deletion and rescheduling; StatefulSets give each replica a dedicated, stable PVC so stateful workloads maintain data identity across restarts. ---"
