# Homework — Storage in Kubernetes

> Kubernetes makes it easy to delete a PersistentVolumeClaim. It does not warn you that this also deletes your production database. That's your job.

## Exercise: StatefulSet Postgres with Persistent Storage

**Scenario:** You're deploying a Postgres instance to Kubernetes for a staging environment. The database must survive pod restarts, node rescheduling, and the occasional `kubectl delete pod` from an overzealous team member. You'll use a StatefulSet (not a Deployment) and prove data persistence across pod deletion.

**Build:**

**Step 1 — Create a namespace and a Secret for the Postgres password:**

```yaml
# postgres-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: postgres-credentials
  namespace: storage-hw
type: Opaque
stringData:
  POSTGRES_PASSWORD: "StrongP@ssw0rd99!"
  POSTGRES_USER: "appuser"
  POSTGRES_DB: "myappdb"
```

**Step 2 — Create a headless Service for the StatefulSet:**

StatefulSets need a headless Service (`clusterIP: None`) to provide stable DNS names for each pod.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-headless
  namespace: storage-hw
spec:
  clusterIP: None   # headless
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
```

**Step 3 — Create the StatefulSet:**

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: storage-hw
spec:
  serviceName: postgres-headless
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:16-alpine
        ports:
        - containerPort: 5432
        envFrom:
        - secretRef:
            name: postgres-credentials
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            cpu: "100m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        readinessProbe:
          exec:
            command: ["pg_isready", "-U", "appuser", "-d", "myappdb"]
          initialDelaySeconds: 10
          periodSeconds: 10
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 1Gi
```

**Step 4 — Write data to the database:**

```bash
# Connect to the pod and create a table + insert rows
kubectl exec -it postgres-0 -n storage-hw -- psql -U appuser -d myappdb -c "
  CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
  INSERT INTO events (message) VALUES
    ('First record'),
    ('Second record'),
    ('Third record');
  SELECT * FROM events;
"
```

**Step 5 — Delete the pod (not the StatefulSet, not the PVC):**

```bash
kubectl delete pod postgres-0 -n storage-hw
```

Watch the StatefulSet recreate it:
```bash
kubectl get pod -n storage-hw --watch
```
Wait for `postgres-0` to be Running again.

**Step 6 — Prove data survived:**

```bash
kubectl exec -it postgres-0 -n storage-hw -- psql -U appuser -d myappdb -c "SELECT * FROM events;"
```

All 3 rows must be present.

**Constraints:**
- Must use a StatefulSet, not a Deployment — document in a comment why Deployment is wrong for this use case
- The `volumeClaimTemplate` must be in the StatefulSet spec, not a separate PVC manifest
- Capture `kubectl get pvc -n storage-hw` before and after pod deletion — the PVC must remain `Bound` throughout
- The readiness probe must be present — Postgres takes time to initialize and the StatefulSet should not mark the pod Ready until Postgres is actually accepting connections

## Stretch 1: VolumeSnapshot
Check if your cluster has a VolumeSnapshotClass installed (`kubectl get volumesnapshotclass`). If so, take a snapshot of your Postgres PVC:

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: postgres-backup
  namespace: storage-hw
spec:
  volumeSnapshotClassName: <your-snapshot-class>
  source:
    persistentVolumeClaimName: data-postgres-0
```

After the snapshot is ready, simulate data loss (delete the StatefulSet and PVC), restore from the snapshot by creating a new PVC that references the snapshot as its `dataSource`, and redeploy the StatefulSet pointing at the restored PVC.

## Stretch 2: Reclaim Policy Investigation
Create a new StorageClass (or find one with `reclaimPolicy: Retain` on your cluster). Create a PVC using it, write data, delete the PVC, and observe that the PV and the underlying disk still exist. Manually reclaim the PV: update its `spec.claimRef` to nil (so it's Available again) and then create a new PVC that binds to it. Prove the data is still there.

## Reflection

- You're running Postgres in a StatefulSet with 1 replica. You want to scale to 3 replicas for read-replica-based scaling. What does each additional pod's PVC contain? Is it a copy of the primary's data or empty? What additional configuration does Postgres need to work as a replica?
- Your staging PVC uses `reclaimPolicy: Delete` and someone runs `kubectl delete namespace staging`. What happens to all the PVCs and the underlying Azure Disks? What should you do before deleting a namespace that contains databases?
- A developer asks why they can't use a Deployment with a shared PVC for Postgres instead of a StatefulSet. Explain the two specific problems that would occur with `ReadWriteOnce` access mode.

## Done when

- [ ] Namespace `storage-hw` created
- [ ] `postgres-credentials` Secret created (not visible in `kubectl describe`)
- [ ] Headless Service `postgres-headless` created
- [ ] StatefulSet `postgres` deployed with `volumeClaimTemplates`
- [ ] `kubectl get pvc -n storage-hw` shows `data-postgres-0` bound to a PV
- [ ] 3 rows inserted into the `events` table via `psql`
- [ ] `kubectl delete pod postgres-0 -n storage-hw` executed and pod recreated by StatefulSet
- [ ] `SELECT * FROM events` after pod recreation returns all 3 original rows
- [ ] Written explanation of why Deployment is wrong for stateful workloads with `RWO` PVCs

---

## Clean Code Lens

**Principle in focus:** Tell, Don't Ask — applied to storage lifecycle

In object-oriented design, "Tell, Don't Ask" means you tell an object what to do rather than querying its state and making decisions yourself. In Kubernetes storage, the equivalent principle is "declare your intent, let the platform enforce it." The `reclaimPolicy: Retain` setting is you telling the platform: "under no circumstances delete this data when the PVC is released." You shouldn't have to remember to manually protect volumes before deleting a PVC — the reclaim policy should enforce the intent.

When the reclaim policy is `Delete` (the default), the platform is asking you to remember that deleting a PVC also deletes the data. That's a cognitive burden that leads to incidents. Production databases should have `Retain` reclaim policy plus snapshotting so that even a correctly-functioning `Retain` policy (which requires manual cleanup) has a backup layer. The system should be designed so the dangerous default (data deletion) requires extra steps, not fewer.

This also applies to StatefulSet `volumeClaimTemplates`: the fact that each pod gets a named, stable PVC (`data-postgres-0`, `data-postgres-1`) is a declaration of intent — these are persistent identities, not ephemeral allocations. The StatefulSet controller never reuses or shuffles these PVCs. The naming convention itself communicates the persistence contract to anyone reading the cluster state.

**Exercise:** Review the StorageClasses in your cluster. For each one, check its `reclaimPolicy`. Write a one-sentence policy statement for when each reclaim policy is appropriate: what class of workload justifies `Delete`, and what class requires `Retain`? Then check whether any production PVCs are using the wrong policy.

**Reflection:** Kubernetes VolumeSnapshots are a point-in-time copy of a PVC. A snapshot is not a backup — it's on the same storage system as the original and is subject to the same failures. What does a complete backup strategy for a Kubernetes-hosted database look like, layering PVC snapshots with application-level backups and offsite storage?
