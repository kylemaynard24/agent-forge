# Capstone 4: Full GitOps Pipeline with Helm + Flux

**Track:** Containers
**Estimated time:** ~5 hours
**Prerequisites:** All stages (1–5) + Capstones 1–3

## What you'll build

You will convert the manually-deployed application from Capstones 1–3 into a fully automated GitOps pipeline. The app will be packaged as a Helm chart, stored in git, and managed by Flux. Deploying a new version means: push a new image to ACR, update a value in git, and Flux reconciles the change to the cluster automatically — no `kubectl apply`, no `helm upgrade`, no pipeline credentials for the cluster.

You will have two environments: `dev` and `prod`, each deployed from the same Helm chart with different `values.yaml` files. A change to the chart template automatically affects both environments on the next reconciliation. A change to `values-prod.yaml` affects only prod.

The stretch goal implements image automation: when a new image is pushed to ACR, Flux detects the new tag, updates the `values-prod.yaml` in git, and reconciles — the entire deployment pipeline happens without any human involvement beyond the initial image push.

## Why this capstone

This capstone assembles every concept from the curriculum into a production-grade deployment story. The Helm chart teaches you to reason about what varies between environments versus what stays constant. The Flux bootstrap teaches you to commit to a model where git is authoritative. The image automation teaches you that even the "what version to deploy" decision can be codified and automated.

After this capstone, you have a complete mental model of modern Kubernetes deployment: code → container → chart → GitOps → cluster. Every step is auditable, reversible, and automated. This is the architecture that teams building serious production systems on AKS are converging toward.

## Deliverables

- [ ] Helm chart for the .NET API (all configs from Capstone 3 as chart templates)
- [ ] `values-dev.yaml` and `values-prod.yaml` with environment-specific overrides
- [ ] Chart pushed to ACR as an OCI artifact (optional) or stored in the git repo
- [ ] Flux bootstrapped to the AKS cluster from a GitHub repository
- [ ] `dev` namespace deployed via `HelmRelease` pointing at the chart + `values-dev.yaml`
- [ ] `prod` namespace deployed via `HelmRelease` pointing at the chart + `values-prod.yaml`
- [ ] Change in git (e.g., `replicaCount` change) is automatically reconciled to the cluster
- [ ] `flux get helmreleases` shows both releases in `Ready=True` state
- [ ] Teardown instructions executed; all Azure resources deleted

## Architecture overview

```
GitHub Repository: flux-cluster-config
├── clusters/my-cluster/
│   ├── flux-system/          ← Flux installs itself here
│   ├── sources/
│   │   ├── my-app-git.yaml   ← GitRepository pointing at app repo
│   │   └── ingress-nginx-helmrepo.yaml
│   └── releases/
│       ├── dev-release.yaml  ← HelmRelease: chart + values-dev.yaml
│       ├── prod-release.yaml ← HelmRelease: chart + values-prod.yaml
│       └── ingress-nginx.yaml
│
GitHub Repository: my-app (or same repo, different path)
├── chart/my-api/             ← Helm chart
│   ├── Chart.yaml
│   ├── values.yaml           ← default values
│   ├── values-dev.yaml       ← dev overrides
│   ├── values-prod.yaml      ← prod overrides
│   └── templates/
│       ├── deployment.yaml
│       ├── service.yaml
│       ├── ingress.yaml
│       ├── hpa.yaml
│       ├── pdb.yaml
│       └── networkpolicy.yaml
│
AKS Cluster
├── flux-system namespace     ← Flux controllers
├── dev namespace             ← HelmRelease: my-api, 1 replica
└── prod namespace            ← HelmRelease: my-api, 3 replicas, HPA
```

## Step-by-step guide

### Phase 1: Create the Helm chart (~1 hour)

1. Run `helm create my-api` and clean up the scaffold:
   ```bash
   helm create chart/my-api
   cd chart/my-api
   # Remove the default ingress template and rewrite it (the scaffold is too generic)
   ```

2. Replace `values.yaml` with a well-structured values file covering all Capstone 3 configurations:
   ```yaml
   replicaCount: 2

   image:
     repository: myacr.azurecr.io/my-api
     tag: "latest"
     pullPolicy: IfNotPresent

   service:
     type: ClusterIP
     port: 80
     targetPort: 8080

   ingress:
     enabled: true
     className: nginx
     host: api.example.local
     tls:
       enabled: true
       clusterIssuer: selfsigned-issuer
     annotations:
       nginx.ingress.kubernetes.io/ssl-redirect: "true"

   resources:
     requests:
       cpu: "100m"
       memory: "128Mi"
     limits:
       cpu: "500m"
       memory: "256Mi"

   autoscaling:
     enabled: false
     minReplicas: 2
     maxReplicas: 8
     targetCPUUtilizationPercentage: 70

   podDisruptionBudget:
     enabled: true
     minAvailable: 2

   securityContext:
     runAsNonRoot: true
     runAsUser: 1000
     allowPrivilegeEscalation: false
     readOnlyRootFilesystem: true
     capabilities:
       drop: ["ALL"]

   networkPolicy:
     enabled: true
     allowFromNamespace: ingress-nginx

   probes:
     startup:
       failureThreshold: 15
       periodSeconds: 2
     liveness:
       path: /healthz
       periodSeconds: 10
     readiness:
       path: /readyz
       periodSeconds: 5
   ```

3. Write `values-dev.yaml`:
   ```yaml
   replicaCount: 1
   image:
     tag: "dev"    # overridden by CI with actual SHA
   autoscaling:
     enabled: false
   podDisruptionBudget:
     enabled: false    # dev can tolerate disruption
   resources:
     requests:
       cpu: "50m"
       memory: "64Mi"
     limits:
       cpu: "200m"
       memory: "128Mi"
   ```

4. Write `values-prod.yaml`:
   ```yaml
   replicaCount: 3
   image:
     tag: "1.0.0"   # pinned; updated by image automation or CI
   autoscaling:
     enabled: true
     minReplicas: 2
     maxReplicas: 8
   podDisruptionBudget:
     enabled: true
     minAvailable: 2
   ```

5. Convert Capstone 3 manifests into chart templates. For each manifest in `k8s/`:
   - Replace hard-coded values with `{{ .Values.* }}` references
   - Add `{{- if .Values.autoscaling.enabled }}` guards on the HPA
   - Add `{{- if .Values.networkPolicy.enabled }}` guards on NetworkPolicy
   - Use `{{ include "my-api.fullname" . }}` from `_helpers.tpl` for resource names

6. Lint the chart:
   ```bash
   helm lint ./chart/my-api
   helm lint ./chart/my-api --values chart/my-api/values-dev.yaml
   helm lint ./chart/my-api --values chart/my-api/values-prod.yaml
   ```

7. Preview renders:
   ```bash
   helm template my-api ./chart/my-api --values chart/my-api/values-prod.yaml | \
     grep -E "kind:|name:|replicas:"
   ```

### Phase 2: Bootstrap Flux (~45 min)

1. Install the Flux CLI:
   ```bash
   curl -s https://fluxcd.io/install.sh | bash
   flux version
   ```

2. Pre-check:
   ```bash
   flux check --pre
   ```

3. Create a GitHub Personal Access Token with `repo` scope.

4. Bootstrap Flux:
   ```bash
   export GITHUB_TOKEN=<your-token>

   flux bootstrap github \
     --owner=<your-github-username> \
     --repository=flux-cluster-config \
     --branch=main \
     --path=clusters/my-cluster \
     --personal \
     --components-extra=image-reflector-controller,image-automation-controller
   ```

5. Verify Flux is running:
   ```bash
   kubectl get pods -n flux-system
   flux check
   ```

6. Clone the bootstrapped repo:
   ```bash
   git clone https://github.com/<your-username>/flux-cluster-config
   cd flux-cluster-config
   ```

### Phase 3: Create Flux HelmRelease resources (~45 min)

In the bootstrapped repo, create the following structure under `clusters/my-cluster/`:

**`clusters/my-cluster/sources/my-app-git.yaml`:**
```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: my-app
  namespace: flux-system
spec:
  interval: 1m
  ref:
    branch: main
  url: https://github.com/<your-username>/my-app
```

**`clusters/my-cluster/releases/dev-release.yaml`:**
```yaml
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: my-api-dev
  namespace: flux-system
spec:
  interval: 5m
  targetNamespace: dev
  install:
    createNamespace: true
  chart:
    spec:
      chart: chart/my-api
      sourceRef:
        kind: GitRepository
        name: my-app
        namespace: flux-system
  valuesFrom:
  - kind: GitRepository
    name: my-app
    valuesKey: chart/my-api/values-dev.yaml
```

**`clusters/my-cluster/releases/prod-release.yaml`:**
```yaml
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: my-api-prod
  namespace: flux-system
spec:
  interval: 5m
  targetNamespace: prod
  install:
    createNamespace: true
  chart:
    spec:
      chart: chart/my-api
      sourceRef:
        kind: GitRepository
        name: my-app
        namespace: flux-system
  valuesFrom:
  - kind: GitRepository
    name: my-app
    valuesKey: chart/my-api/values-prod.yaml
```

Commit and push to the bootstrap repo:
```bash
git add clusters/
git commit -m "feat: add dev and prod HelmRelease for my-api"
git push
```

### Phase 4: Verify reconciliation (~30 min)

1. Watch Flux pick up the new resources:
   ```bash
   flux get sources git
   flux get helmreleases --all-namespaces -w
   ```

2. Verify both namespaces are deployed:
   ```bash
   kubectl get pods -n dev
   kubectl get pods -n prod
   ```

3. Test the deployment:
   ```bash
   DEV_INGRESS_IP=$(kubectl get service ingress-nginx-controller \
     -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
   curl -sk -H "Host: api.example.local" "https://$DEV_INGRESS_IP/healthz"
   ```

4. Make a git change and watch it reconcile. Update `values-dev.yaml`:
   ```bash
   # In the my-app repo, change dev replicaCount from 1 to 2
   sed -i 's/replicaCount: 1/replicaCount: 2/' chart/my-api/values-dev.yaml
   git add -A && git commit -m "chore: scale dev to 2 replicas"
   git push
   ```

5. Watch the reconciliation:
   ```bash
   flux reconcile source git my-app --namespace flux-system
   flux reconcile helmrelease my-api-dev --namespace flux-system --with-source
   kubectl get pods -n dev -w
   # Should scale from 1 to 2 pods
   ```

### Phase 5: Image automation (stretch goal steps) (~45 min)

1. Push a new image version to ACR:
   ```bash
   NEW_TAG="1.1.0"
   az acr build --registry "$ACR" --image "my-api:$NEW_TAG" --file ./Dockerfile .
   ```

2. Create an ImageRepository and ImagePolicy in the bootstrap repo:
   ```yaml
   # clusters/my-cluster/image-automation/my-api-image.yaml
   apiVersion: image.toolkit.fluxcd.io/v1beta2
   kind: ImageRepository
   metadata:
     name: my-api
     namespace: flux-system
   spec:
     image: <acr-login-server>/my-api
     interval: 5m
   ---
   apiVersion: image.toolkit.fluxcd.io/v1beta2
   kind: ImagePolicy
   metadata:
     name: my-api
     namespace: flux-system
   spec:
     imageRepositoryRef:
       name: my-api
     policy:
       semver:
         range: ">=1.0.0"
   ```

3. Add a marker comment to `values-prod.yaml` so Flux knows which line to update:
   ```yaml
   image:
     tag: "1.0.0" # {"$imagepolicy": "flux-system:my-api:tag"}
   ```

4. Create an ImageUpdateAutomation:
   ```yaml
   apiVersion: image.toolkit.fluxcd.io/v1beta1
   kind: ImageUpdateAutomation
   metadata:
     name: my-api-prod
     namespace: flux-system
   spec:
     interval: 5m
     sourceRef:
       kind: GitRepository
       name: my-app
     git:
       checkout:
         ref:
           branch: main
       commit:
         author:
           name: Flux Image Bot
           email: flux@example.com
         messageTemplate: "chore: update my-api prod to {{range .Updated.Images}}{{.}}{{end}}"
       push:
         branch: main
   ```

5. After pushing, watch Flux detect the new image tag and update git:
   ```bash
   flux get images all --all-namespaces
   # After a few minutes, check git log in the my-app repo:
   git log --oneline -5
   # Should see a commit from "Flux Image Bot" updating the tag
   ```

## Stretch goals

- Implement a multi-cluster setup: use separate `values-staging.yaml` pointing to a second AKS cluster; show that Flux can manage multiple clusters from a single git repository
- Add SOPS encryption for a Kubernetes Secret in the chart: encrypt the postgres-password secret using an Azure Key Vault key, commit the encrypted SOPS file to git, configure Flux to decrypt it using the cluster's managed identity
- Implement progressive delivery with Flagger: add Flagger to the cluster and configure a Canary resource for the prod HelmRelease that automatically promotes or rolls back based on error rate

## Teardown

```bash
# Uninstall all Helm releases via Flux (removes managed resources)
flux suspend kustomization flux-system
kubectl delete helmrelease --all --all-namespaces
kubectl delete namespace dev prod --wait=false

# Uninstall Flux
flux uninstall --silent

# Delete all Azure resources (AKS cluster, ACR, resource group)
az group delete --name rg-capstone-containers --yes --no-wait

# Verify (wait a few minutes then check)
az group list --query "[?name=='rg-capstone-containers']" --output table
```

Verify no lingering charges:
- Check Azure Portal > Cost Management > Current month
- Verify zero Load Balancer IPs remain
- Verify the AKS cluster node VMs are terminated

## Reflection questions

1. Before GitOps, the pipeline pushed to the cluster. After GitOps, the pipeline pushes to git. What concrete security benefit does this change provide? What new attack surface does it introduce?
2. Flux uses a GitRepository + HelmRelease model. ArgoCD uses Application resources. Both solve the same problem. When would you choose ArgoCD over Flux?
3. Image automation commits to the git repo automatically. This means git history now has bot commits mixed with human commits. How do you maintain the quality and readability of the git log in a system with image automation?
