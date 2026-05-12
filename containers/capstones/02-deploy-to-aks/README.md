# Capstone 2: Deploy to AKS with Kubernetes Manifests

**Track:** Containers
**Estimated time:** ~4 hours
**Prerequisites:** Stages 1–3 (Docker through Kubernetes Foundations) + Capstone 1

## What you'll build

You will take the containerized .NET API from Capstone 1, push its image to Azure Container Registry (ACR), and deploy it to an AKS cluster using hand-crafted Kubernetes manifests. By the end, you will have a running application accessible from the internet, with its configuration separated from its image, its credentials stored as a Kubernetes Secret (later upgraded to Azure Key Vault in Stage 5), and its resource usage bounded by a ResourceQuota on the namespace.

This is a complete deployment manifests set: a Namespace, a Deployment with proper labels and selectors, a ClusterIP Service for internal access, a LoadBalancer Service for external access (or an Ingress if you prefer), a ConfigMap for application settings, a Secret for the database password, and a ResourceQuota protecting the namespace from overuse.

## Why this capstone

This is the first time the theory from Stages 1–3 becomes a real running system in Azure. The friction you encounter here — image pull errors, pod startup failures, Service not routing traffic, environment variable mismatches — is exactly the friction you will face on real projects. Working through it in a controlled capstone environment, with time to understand each failure, builds the debugging muscle that gets you through production incidents.

The manifest set you write here is deliberately not using Helm yet (that comes in Capstone 4). Writing raw manifests first ensures you understand what Helm is generating for you. When something goes wrong with a Helm release, you need to be able to read the rendered YAML and understand it.

## Deliverables

- [ ] ACR instance created; `my-api` image pushed with git SHA tag
- [ ] AKS cluster provisioned (can be from Stage 5 demo or a new one)
- [ ] Namespace `my-app` with a ResourceQuota (max 4 CPU, 4Gi memory across all pods)
- [ ] Deployment with 2 replicas, correct labels, readiness + liveness probes, and resource requests/limits
- [ ] ConfigMap with non-sensitive application settings (ASPNETCORE_ENVIRONMENT, log level)
- [ ] Secret for database password (named `api-secrets`, key `postgres-password`)
- [ ] ClusterIP Service for the API (port 80 → container 8080)
- [ ] Either: LoadBalancer Service with an external IP, or Ingress with path routing
- [ ] End-to-end test: `curl http://<external-ip>/healthz` returns `{"status":"healthy"}`
- [ ] `kubectl get all -n my-app` shows all resources in a healthy state

## Architecture overview

```
Azure Container Registry
└── my-api:<git-sha>

AKS Cluster
└── namespace: my-app
    ├── ResourceQuota: max 4 CPU, 4Gi memory
    ├── ConfigMap: api-config (ASPNETCORE_ENVIRONMENT, LOG_LEVEL)
    ├── Secret: api-secrets (postgres-password)
    ├── Deployment: my-api (2 replicas)
    │   ├── readinessProbe: GET /readyz :8080
    │   ├── livenessProbe:  GET /healthz :8080
    │   ├── envFrom: ConfigMap api-config
    │   └── env: POSTGRES_PASSWORD from Secret api-secrets
    ├── Service: my-api-internal (ClusterIP, port 80)
    └── Service: my-api-external (LoadBalancer)
          └── external IP → port 80 → my-api pod port 8080

External internet → LoadBalancer IP → Service → Pod
```

## Step-by-step guide

### Phase 1: Push image to ACR (~30 min)

1. Create an ACR instance:
   ```bash
   RG="rg-capstone-containers"
   ACR="acrcontainerscap$RANDOM"   # must be globally unique, lowercase
   LOCATION="eastus"

   az group create --name "$RG" --location "$LOCATION"
   az acr create --name "$ACR" --resource-group "$RG" --sku Basic
   ```

2. Build and push the image from Capstone 1:
   ```bash
   GIT_SHA=$(git rev-parse --short HEAD)
   ACR_LOGIN=$(az acr show --name "$ACR" --query loginServer -o tsv)

   az acr build \
     --registry "$ACR" \
     --image "my-api:$GIT_SHA" \
     --file ./Dockerfile .

   # Verify the image is in ACR
   az acr repository show-tags --name "$ACR" --repository my-api --output table
   ```

3. Note the full image reference for use in the Deployment:
   ```bash
   echo "$ACR_LOGIN/my-api:$GIT_SHA"
   ```

### Phase 2: Provision AKS and configure ACR pull (~30 min)

1. Create the AKS cluster:
   ```bash
   az aks create \
     --resource-group "$RG" \
     --name aks-capstone \
     --node-count 2 \
     --node-vm-size Standard_D2s_v3 \
     --generate-ssh-keys \
     --attach-acr "$ACR"    # grants AcrPull role to the kubelet managed identity

   az aks get-credentials --resource-group "$RG" --name aks-capstone
   ```

2. Verify the cluster is running:
   ```bash
   kubectl get nodes
   kubectl cluster-info
   ```

### Phase 3: Write Kubernetes manifests (~1 hour)

Create a directory `k8s/` and write the following files.

**`k8s/namespace.yaml`:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-app
  labels:
    app.kubernetes.io/managed-by: manual
```

**`k8s/resourcequota.yaml`:**
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: my-app-quota
  namespace: my-app
spec:
  hard:
    requests.cpu: "2"
    requests.memory: 2Gi
    limits.cpu: "4"
    limits.memory: 4Gi
    pods: "20"
```

**`k8s/configmap.yaml`:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
  namespace: my-app
data:
  ASPNETCORE_ENVIRONMENT: Production
  LOG_LEVEL: Information
  REDIS_HOST: "redis-service"
```

**`k8s/secret.yaml`:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-secrets
  namespace: my-app
type: Opaque
data:
  # Base64 encode: echo -n "your-password" | base64
  postgres-password: <base64-encoded-password>
```

Note: In Capstone 4 you will replace this with Azure Key Vault. For now, this is the minimal working approach.

**`k8s/deployment.yaml`:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-api
  namespace: my-app
  labels:
    app.kubernetes.io/name: my-api
    app.kubernetes.io/version: "1.0.0"
spec:
  replicas: 2
  selector:
    matchLabels:
      app: my-api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: my-api
    spec:
      containers:
      - name: api
        image: <YOUR_ACR_LOGIN>/my-api:<GIT_SHA>
        ports:
        - containerPort: 8080
        envFrom:
        - configMapRef:
            name: api-config
        env:
        - name: ConnectionStrings__PostgresPassword
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: postgres-password
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /readyz
            port: 8080
          periodSeconds: 5
          failureThreshold: 3
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "256Mi"
```

**`k8s/service.yaml`:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-api-internal
  namespace: my-app
spec:
  selector:
    app: my-api
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: my-api-external
  namespace: my-app
spec:
  selector:
    app: my-api
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
```

### Phase 4: Apply and verify (~45 min)

1. Apply all manifests:
   ```bash
   kubectl apply -f k8s/
   ```

2. Watch the rollout:
   ```bash
   kubectl rollout status deployment/my-api -n my-app
   kubectl get pods -n my-app -w
   ```

3. Wait for the external IP (may take 2-3 minutes on AKS):
   ```bash
   kubectl get service my-api-external -n my-app -w
   ```

4. Test the end-to-end path:
   ```bash
   EXTERNAL_IP=$(kubectl get service my-api-external -n my-app \
     -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
   curl http://$EXTERNAL_IP/healthz
   # {"status":"healthy"}
   ```

5. Verify the ResourceQuota is enforced:
   ```bash
   kubectl describe resourcequota my-app-quota -n my-app
   # Check: Used vs Hard for CPU and memory
   ```

6. Check all resources are healthy:
   ```bash
   kubectl get all -n my-app
   ```

## Stretch goals

- Add a Postgres Deployment and Service in the cluster (not just a secret pointing to an external one) — the API should connect to it successfully; use a PersistentVolumeClaim for Postgres storage
- Add a `/readyz` endpoint to the .NET API that checks Postgres connectivity (returns 503 if unreachable, 200 if ready) — verify readiness probe behavior when the DB is down
- Replace the base64 Secret with a Kubernetes External Secrets Operator (ESO) that reads from Azure Key Vault — preview of what Stage 5 covers

## Teardown

```bash
# Delete all Kubernetes resources
kubectl delete namespace my-app

# Delete the AKS cluster and all Azure resources
az group delete --name rg-capstone-containers --yes --no-wait
```

Verify no lingering resources (especially the LoadBalancer, which costs money):
```bash
az resource list --resource-group rg-capstone-containers --output table 2>/dev/null || echo "Resource group already deleted"
```

## Reflection questions

1. You applied a Secret with a base64-encoded password in a YAML file. What are the two reasons this is not acceptable for a real production system? What should replace it?
2. The LoadBalancer Service provisioned a public IP in Azure. What does this cost relative to the AKS nodes, and what is the architectural alternative from Stage 4 (Ingress)?
3. Your Deployment has `replicas: 2` and `maxUnavailable: 0`. During a rolling update, what is the maximum number of pods running simultaneously? Walk through the rolling update sequence.
