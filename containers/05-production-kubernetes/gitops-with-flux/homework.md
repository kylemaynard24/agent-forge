# Homework — GitOps with Flux

> The on-call rotation has become unsustainable. Three times last month, someone deployed a hotfix by running kubectl apply directly from their laptop, and the cluster drifted from what was in the repo. You are implementing GitOps to make "deploy" mean "commit to git" and nothing else.

## Exercise: Bootstrap Flux to Your Cluster

**Scenario:** You have an AKS cluster and a GitHub repository. Your job is to bootstrap Flux, deploy an application purely by committing YAML to git, then make a change and watch Flux reconcile it automatically.

**Build:**
1. Install the Flux CLI:
   ```bash
   curl -s https://fluxcd.io/install.sh | bash
   flux version
   ```

2. Create a GitHub Personal Access Token with `repo` scope and bootstrap Flux:
   ```bash
   export GITHUB_TOKEN=<your-token>
   flux bootstrap github \
     --owner=<your-github-username> \
     --repository=flux-cluster-config \
     --branch=main \
     --path=clusters/my-cluster \
     --personal
   ```

3. Verify Flux is running:
   ```bash
   flux check
   kubectl get pods -n flux-system
   ```

4. In the bootstrapped repo, create a directory `apps/my-app/` and add a Deployment + Service manifest:
   ```yaml
   # apps/my-app/deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: my-app
     namespace: default
   spec:
     replicas: 2
     ...
   ```

5. Create a `Kustomization` in `clusters/my-cluster/my-app.yaml` pointing at `apps/my-app/`:
   ```yaml
   apiVersion: kustomize.toolkit.fluxcd.io/v1
   kind: Kustomization
   metadata:
     name: my-app
     namespace: flux-system
   spec:
     interval: 2m
     sourceRef:
       kind: GitRepository
       name: flux-system
     path: ./apps/my-app
     prune: true
     targetNamespace: default
   ```

6. Commit and push. Watch Flux reconcile:
   ```bash
   flux get kustomizations -w
   kubectl get pods -w
   ```

7. Make a change: update `replicas: 3` in the deployment. Commit and push. Watch the change propagate.

**Constraints:**
- Do not run `kubectl apply` directly to apply the app manifests — let Flux handle it
- The Kustomization must have `prune: true` — verify it works by removing a manifest from git and confirming the resource is deleted from the cluster
- Document the time between your `git push` and the change appearing in the cluster (`kubectl get pods` timestamp vs `git log` timestamp)

## Stretch 1

Add a HelmRelease to your Flux setup for nginx-ingress:

```yaml
# clusters/my-cluster/ingress-nginx.yaml
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: HelmRepository
metadata:
  name: ingress-nginx
  namespace: flux-system
spec:
  interval: 1h
  url: https://kubernetes.github.io/ingress-nginx
---
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: ingress-nginx
  namespace: flux-system
spec:
  interval: 10m
  chart:
    spec:
      chart: ingress-nginx
      version: "4.x"
      sourceRef:
        kind: HelmRepository
        name: ingress-nginx
  targetNamespace: ingress-nginx
  install:
    createNamespace: true
  values:
    controller:
      replicaCount: 1
```

Commit, push, and watch Flux install the chart: `flux get helmreleases`.

## Stretch 2

Simulate a drift scenario. After Flux has deployed your app, run:
```bash
kubectl scale deployment my-app --replicas=0 -n default
```

Watch Flux detect the drift and reconcile it back to the desired state (replicas: 3 from git). Document:
- How long it takes for Flux to restore the deployment
- What `flux get kustomizations` shows during the drift window

This is the self-healing property of GitOps: any manual change is overwritten by the next reconciliation cycle.

## Reflection

- In a GitOps model, your CI/CD pipeline commits to git instead of running kubectl. What credentials does the pipeline need, and how does this compare to the push-based model?
- `flux reconcile kustomization my-app --with-source` forces an immediate reconciliation. When would you run this, and when is it the wrong thing to do?
- You want to deploy to dev automatically on every commit, but require a pull request review before production. How do you model this with Flux (hint: think about branches and separate Kustomizations)?

## Done when

- [ ] `flux check` passes — all controllers healthy
- [ ] App is deployed to the cluster purely via git commit (no direct kubectl apply)
- [ ] Changing `replicas` in git and pushing causes pods to scale within the reconciliation interval
- [ ] `prune: true` is verified — deleting a manifest from git removes it from the cluster
- [ ] `observations.md` documents the commit-to-cluster propagation time
- [ ] You can explain the difference between Flux's Kustomization CRD and the standard Kustomize kustomization.yaml

---

## Clean Code Lens

**Principle in focus:** Single Source of Truth

GitOps is the infrastructure embodiment of the Single Source of Truth principle. In a GitOps model, the git repository is the only authoritative description of what should be running. There is no "what the last pipeline deployed," no "what someone applied from their laptop," no "what the old YAML on the shared drive says." One place. One version. Always.

In application code, Single Source of Truth means a domain model is defined in one place, not duplicated across layers. A customer's address is stored in the database, not in the session cache and the database. When you have two copies, they drift. When they drift, you have a bug. The same principle applies to cluster state: two sources of truth (git and direct kubectl) will eventually disagree, and the disagreement will happen at the worst possible time.

Flux enforces Single Source of Truth mechanically: it continuously reconciles the cluster to git, overwriting any deviation. The principle is implemented at the infrastructure level — you do not need discipline or process to enforce it, the system enforces it for you.

**Exercise:** Identify all the ways cluster state can currently diverge from the git repository in your environment (or a hypothetical one): direct kubectl commands, Helm upgrades run from laptops, changes made via the Azure Portal, resource mutations by Kubernetes controllers. For each one, decide: is this a legitimate mutation (e.g., HPA changing replica count) or a change that should go through git? Design a Flux configuration that allows the legitimate mutations and prevents the others.

**Reflection:** The Single Source of Truth principle has a cost: it makes ad-hoc changes slower (you have to commit and push instead of running kubectl). When is this cost worth paying, and when does it become an obstacle? How do you handle emergency hotfixes in a strict GitOps model?
