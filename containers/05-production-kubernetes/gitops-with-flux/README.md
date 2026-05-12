# GitOps with Flux

**Area:** Production Kubernetes / AKS

## Intent

Make git the single source of truth for every resource in your cluster — so that deployments are automated, auditable, and self-healing, and no human (or CI pipeline) runs `kubectl apply` against production.

## When to use

- Any cluster with more than one team deploying to it — GitOps prevents concurrent conflicting changes
- Production environments where you want an audit trail of every change (git history = deploy history)
- Environments where cluster drift is a compliance or reliability concern — Flux continuously reconciles the cluster back to the git state

## Why it matters

The push-based CI/CD model (pipeline runs `kubectl apply`) has a fundamental problem: the pipeline is the source of truth, not the cluster. If someone runs `kubectl delete deployment my-api` directly, the cluster diverges from what the pipeline last deployed. There is no automatic recovery. The next deploy might re-create the deployment, but there was a gap.

GitOps inverts this. The cluster is always trying to match what is in git. A `kubectl delete` of a GitOps-managed resource is undone by Flux within the reconciliation interval (typically 1–5 minutes). A human or pipeline making a direct change is overwritten. Git history is your deploy history. A rollback is a `git revert`. An audit of what changed and when is a `git log`.

The second reason GitOps matters: your CI/CD pipeline no longer needs cluster credentials for production. It only needs credentials to push to git. The cluster pulls from git. This dramatically reduces the blast radius of a compromised CI/CD system.

## Core concepts

- **GitOps** — operational model where git is the source of truth; the cluster continuously pulls and reconciles against git state
- **Pull-based reconciliation** — the cluster agent (Flux) polls the git repository and applies changes; contrast with push-based where a pipeline pushes to the cluster
- **Flux v2** — the CNCF GitOps toolkit; installs into the cluster as a set of controllers; manages Sources, Kustomizations, HelmReleases
- **Source controller** — watches git repositories, Helm repositories, and OCI registries for changes; creates artifacts (tarballs) that other controllers consume
- **Kustomize controller** — applies Kustomization resources; takes a GitRepository source and applies the manifests in a given path; supports strategic merge patches
- **Helm controller** — manages HelmRelease resources; installs and upgrades Helm charts from a HelmRepository or GitRepository source
- **GitRepository CRD** — tells Flux which git URL to watch, which branch (or tag, or commit), and how often to poll; creates a source artifact
- **Kustomization CRD** (Flux) — tells Flux which path in a GitRepository to apply; sets the target namespace, health checks, and reconciliation interval
- **HelmRelease CRD** — tells Flux which chart to install and which values to use; references a HelmRepository or GitRepository source
- **`flux bootstrap github`** — bootstraps Flux into a cluster AND creates a GitHub repo (or uses an existing one) with the Flux manifests; the cluster then reconciles itself from that repo
- **Image automation** — Flux can watch an OCI registry for new image tags and automatically update the image reference in git (ImageRepository + ImagePolicy + ImageUpdateAutomation)
- **SOPS** — Mozilla's encrypted secret tool; encrypts values in YAML files using an Azure Key Vault key or age key; Flux natively decrypts SOPS-encrypted files during reconciliation — secrets can live in git encrypted
- **Flux vs ArgoCD** — Flux is CNCF-graduated, CLI-first, Kubernetes-native; ArgoCD is CNCF-incubating, UI-first, more opinionated; both solve the same problem; Flux is simpler to bootstrap, ArgoCD has a better web UI for teams

## Common mistakes

- **Mixing push-based CI with GitOps** — if your pipeline also runs `kubectl apply`, Flux will fight with it; pick one model and stick with it; in GitOps mode, CI only pushes to git
- **Storing unencrypted secrets in git** — never commit a Secret manifest with base64-encoded data; fix: use SOPS with Azure Key Vault, or use the Secrets Store CSI Driver and do not store secrets in git at all
- **Not monitoring Flux reconciliation** — if Flux cannot reconcile (git unreachable, syntax error in manifest), the cluster silently drifts; fix: set up alerts on `kustomize_controller_reconcile_duration_seconds` or check `flux get kustomizations` in your monitoring runbook

## Tiny example

Bootstrap Flux to an AKS cluster and deploy an app:

```bash
# Bootstrap (creates flux-system namespace, installs controllers, commits manifests to your repo)
flux bootstrap github \
  --owner=your-github-org \
  --repository=cluster-config \
  --branch=main \
  --path=clusters/production \
  --personal

# After bootstrap, add your app's GitRepository source:
flux create source git my-app \
  --url=https://github.com/your-org/my-app \
  --branch=main \
  --interval=1m

# Add a Kustomization that applies manifests from the repo:
flux create kustomization my-app \
  --source=GitRepository/my-app \
  --path=./k8s \
  --prune=true \
  --interval=5m \
  --target-namespace=production
```

Now when you `git push` a change to `./k8s/` in the `my-app` repo, Flux picks it up within 1 minute and applies the change. No CI credentials needed for the cluster.

## Run the demo

```bash
bash demo.sh
```

The demo shows `flux` CLI commands, creating a GitRepository and Kustomization, reconciling, and reviewing Flux status.

## Deeper intuition

Think of Flux as a thermostat for your cluster. You set the desired temperature (git state). Flux constantly measures the actual temperature (cluster state). If they diverge, Flux applies heat or cooling (kubectl apply / delete) to bring them back in line. The thermostat does not care why the temperature changed — it just corrects.

The key insight this analogy reveals: Flux is not a deployment tool. It is a reconciliation engine. "Deploying" in GitOps means committing to git. Flux handles the rest. This shift in mental model changes how you think about rollbacks (revert a commit), audits (git log), and incident response (what changed in git matches what changed in the cluster).

The SOPS integration is the detail that makes this practical. Without encrypted secrets in git, you cannot have a complete source of truth — you have manifests in git plus secrets managed separately. SOPS closes this gap by letting you commit encrypted secrets that only Flux (with access to the decryption key in Key Vault) can read.

## Scenario questions

### Scenario 1 — "A developer ran kubectl delete namespace production by accident. Fifteen microservices went offline."
**Question:** With Flux GitOps in place, how long until services recover automatically?
**Answer:** Within the Kustomization's reconciliation interval, typically 1–5 minutes.
**Explanation:** Flux watches the cluster state against the git state. When the namespace disappears, Flux detects the drift and re-applies all resources in the Kustomization on the next reconciliation cycle. `--prune=true` ensures only desired resources exist, but it also means that deleted resources are re-created. This is the self-healing property of GitOps: the cluster converges back to git state regardless of what caused the divergence.

### Scenario 2 — "We want to see the history of every deployment to production, including who approved the change and when."
**Question:** In a GitOps model, where does this audit history live?
**Answer:** In git. Every deployment is a commit. The commit has a timestamp, an author, a message, and (if you use a pull request workflow) a reviewer and approval timestamp.
**Explanation:** This is a first-class advantage of GitOps: the deploy history is the git history. You can run `git log --all --decorate` on the cluster config repo and see every change, in order, with context. For compliance, you can enforce a PR-required policy on the main branch so that no change reaches the cluster without a review.

### Scenario 3 — "Our CI/CD pipeline is running helm upgrade directly against production. We want to migrate to GitOps without downtime."
**Question:** What is the migration path?
**Answer:** Install Flux and bootstrap it. Then convert the pipeline to commit to git instead of running helm upgrade directly. Flux manages the HelmRelease; CI just updates the image tag in git.
**Explanation:** The migration is incremental: (1) bootstrap Flux, (2) create HelmRelease resources in git that match the current cluster state, (3) tell Flux to manage them — this should be a no-op if the state matches, (4) update CI to write the image tag to the HelmRelease in git instead of calling helm upgrade directly, (5) verify Flux picks up the CI change and deploys it, (6) remove the `helm upgrade` step from CI. At no point is there a cutover window — Flux takes over gradually.
