# Storage in Kubernetes

**Area:** Kubernetes Foundations

## Intent

Persist data beyond the pod lifecycle by decoupling storage provisioning (PersistentVolumes) from storage consumption (PersistentVolumeClaims) and using StorageClasses for automatic provisioning.

## When to use

- Any stateful workload that must survive pod restarts: databases (Postgres, MySQL), message queues (RabbitMQ), caches that need persistence (Redis with AOF), file stores
- When a pod needs to write data that should outlive the pod's lifecycle
- When upgrading or restarting a stateful service without losing data

## Why it matters

Containers are ephemeral. When a pod is deleted or rescheduled to a different node, any data written to the container's writable layer is gone. This is intentional and desirable for stateless workloads. For stateful workloads, you need storage that outlives the pod.

Kubernetes models this with three objects: the PersistentVolume (PV) represents actual storage provisioned from a cloud provider or storage system. The PersistentVolumeClaim (PVC) is a request for a piece of that storage, specifying size and access mode. The StorageClass defines how PVs are provisioned automatically when a PVC is created. This three-layer model decouples the "what storage exists" concern (PV) from the "what storage I need" concern (PVC) from the "how to create storage" concern (StorageClass).

In practice on AKS, you almost never create PVs manually — the StorageClass and CSI driver handle provisioning automatically when you create a PVC. Your primary job is to define PVCs with the right size and access mode, and to understand what happens to the underlying storage when you delete the PVC.

## Core concepts

- **PersistentVolume (PV)** — a cluster-level resource representing a piece of storage (Azure Disk, Azure File Share, NFS, etc.); created manually by an admin or automatically by a StorageClass provisioner; has a lifecycle independent of any pod
- **PersistentVolumeClaim (PVC)** — a namespace-level resource representing a request for storage; specifies required size and access mode; binds to a PV that satisfies the request; pods reference PVCs, not PVs directly
- **StorageClass** — a template for dynamic provisioning; specifies a provisioner (e.g., `disk.csi.azure.com`) and parameters (disk type, IOPS tier); when a PVC is created that references a StorageClass, the provisioner creates a PV automatically
- **Dynamic provisioning** — the StorageClass provisioner creates a PV on-demand when a PVC is created; this is the standard pattern in cloud Kubernetes
- **Access modes** — how a PV can be mounted:
  - `ReadWriteOnce (RWO)` — mounted as read-write by a single node; Azure Disk supports this; the most common mode
  - `ReadOnlyMany (ROX)` — mounted as read-only by many nodes; for shared read-only content
  - `ReadWriteMany (RWX)` — mounted as read-write by many nodes simultaneously; Azure Files (NFS or SMB) supports this; Azure Disk does NOT support RWX
  - `ReadWriteOncePod (RWOP)` — Kubernetes 1.22+; mounted by a single pod only (stricter than RWO)
- **Reclaim policies** — what happens to the PV when the PVC is deleted:
  - `Delete` — the underlying storage is deleted; default for dynamically-provisioned PVs; appropriate for dev/staging where losing data is acceptable
  - `Retain` — the PV and underlying storage are kept; must be manually reclaimed; appropriate for production databases where you never want to accidentally delete data
  - `Recycle` — deprecated; don't use
- **Binding** — when a PVC finds a compatible PV, they bind to each other (1:1 relationship); a bound PV cannot be claimed by another PVC until the first PVC is deleted
- **StatefulSet** — a workload controller (like Deployment) but for stateful apps; guarantees stable pod names (`pod-0`, `pod-1`), stable network identities (via headless Service), and stable storage via `volumeClaimTemplates`
- **`volumeClaimTemplates`** — per-replica PVC specifications on a StatefulSet; each replica gets its own PVC (`data-myapp-0`, `data-myapp-1`, etc.); when a pod is rescheduled, it reattaches to the SAME PVC
- **Azure Disk CSI driver** — the AKS provisioner for Azure Managed Disks; supports `RWO` access mode; backed by Azure Premium SSD, Standard SSD, or Standard HDD; high performance for databases
- **Azure Files CSI driver** — the AKS provisioner for Azure File Shares (SMB or NFS); supports `RWX` access mode; useful for shared file storage across multiple pods
- **VolumeSnapshot** — a point-in-time snapshot of a PVC; requires a VolumeSnapshotClass and a CSI driver that supports snapshots; the correct way to back up PVC data in Kubernetes

## Common mistakes

- **Using ReadWriteMany with Azure Disk** — Azure Disk is a block device that can only be attached to one node at a time; requesting `RWX` with an Azure Disk StorageClass will leave your PVC perpetually in `Pending` state; use Azure Files for `RWX`
- **Deleting a PVC before migrating data** — with `Delete` reclaim policy (the default), deleting the PVC deletes the underlying Azure Disk immediately and permanently; always verify the reclaim policy before deleting PVCs in production
- **Using Deployments instead of StatefulSets for stateful apps** — a Deployment's multiple replicas might all try to mount the same `RWO` PVC, but only one node can attach an Azure Disk; use a StatefulSet, which gives each replica its own PVC
- **Not setting storage requests accurately** — a PVC's storage request is fixed after creation (resizing is possible but requires the StorageClass to support volume expansion and a pod restart); over-provision slightly for databases rather than under-provision
- **Forgetting that PVCs are namespace-scoped** — a PVC in `namespace-a` cannot be used by a pod in `namespace-b`; PVs are cluster-scoped, but PVCs are not

## Tiny example

A Postgres database using dynamic provisioning:

```yaml
# PVC — request 10 Gi of Azure SSD storage
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: managed-premium   # AKS built-in StorageClass for Premium SSD
```

```yaml
# Pod using the PVC
spec:
  containers:
  - name: postgres
    image: postgres:16-alpine
    env:
    - name: POSTGRES_PASSWORD
      valueFrom:
        secretKeyRef:
          name: postgres-secret
          key: password
    volumeMounts:
    - name: data
      mountPath: /var/lib/postgresql/data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: postgres-data
```

When the pod is deleted and recreated, it binds to the same PVC and finds all the data intact.

## Run the demo

```bash
bash demo.sh
```

The demo creates a PVC using the default AKS StorageClass, deploys a pod that writes data, deletes the pod, recreates it, and proves data persisted. Shows `kubectl get pv,pvc` throughout.

## Deeper intuition

The PV/PVC model is an abstraction boundary. The platform team (or cloud provider) manages what storage exists (PVs). The application team declares what storage it needs (PVCs). Neither needs to know the other's details. The StorageClass is the contract between them — the application team says "I need Premium SSD storage" (StorageClass name), and the provisioner creates whatever Azure resource that maps to.

This decoupling also enables portability. If you write your manifests against StorageClass names rather than specific cloud resources, you can switch between cloud providers by creating equivalent StorageClasses in the target environment. Your application manifests don't change.

StatefulSets take this further: each replica has a name (`myapp-0`, `myapp-1`), a stable DNS entry (through a headless Service), and a dedicated PVC (`data-myapp-0`, `data-myapp-1`). This is the minimum necessary infrastructure for running a replicated database in Kubernetes — each instance needs its own storage and a predictable identity so cluster-internal replication protocols (like Postgres streaming replication) can work reliably.

## Scenario questions

### Scenario 1 — "We deleted the staging database PVC and lost all data — how do we prevent this in production?"
**Question:** What two changes would prevent accidental data loss from PVC deletion in production?
**Answer:** First, set the StorageClass `reclaimPolicy: Retain` so deleting the PVC doesn't delete the underlying Azure Disk. Second, set up VolumeSnapshots on a schedule so you have point-in-time backups that don't depend on the PVC existing.
**Explanation:** The default `Delete` reclaim policy is sensible for dev (you never need old dev data) but dangerous for production. `Retain` keeps the PV and the underlying disk even after the PVC is deleted — you can attach it to a new PVC to recover the data. Snapshots are an additional safety net for the case where the disk itself is corrupted.

### Scenario 2 — "Our PVC has been in Pending state for 10 minutes"
**Question:** `kubectl get pvc` shows `STATUS: Pending`. What are the most likely causes?
**Answer:** Check `kubectl describe pvc <name>` for events. Most common causes: (1) the requested StorageClass doesn't exist in the cluster — `kubectl get storageclass` to check; (2) requested access mode not supported by the StorageClass (RWX on Azure Disk); (3) node selector or zone constraints don't match any available capacity; (4) the cluster's storage quota is exhausted.
**Explanation:** `kubectl describe pvc` almost always tells you exactly what the provisioner tried and why it failed. For Azure, look for "ProvisioningFailed" events with an Azure error message. The most common fix is correcting the StorageClass name or access mode.
