#!/usr/bin/env bash
# demo.sh — GitOps with Flux
# Run: bash demo.sh
# Requires: kubectl connected to a cluster, flux CLI installed
#           Install flux: curl -s https://fluxcd.io/install.sh | bash
#           For full bootstrap: GitHub token with repo permissions

set -euo pipefail

echo "=== 1. Check Flux CLI is installed ==="
flux version --client 2>/dev/null || {
  echo "Flux CLI not found. Install with:"
  echo "  curl -s https://fluxcd.io/install.sh | bash"
  echo "  brew install fluxcd/tap/flux"
  echo ""
  echo "Continuing with informational steps only..."
}

echo ""
echo "=== 2. Pre-check cluster prerequisites ==="
flux check --pre 2>/dev/null || echo "(flux check requires cluster connection — continuing)"

echo ""
echo "=== 3. Bootstrap command (informational — requires GITHUB_TOKEN) ==="
echo ""
echo "The bootstrap command installs Flux into your cluster AND configures a GitHub repo"
echo "as the source of truth. Run this with a real GITHUB_TOKEN:"
echo ""
cat <<'BOOTSTRAP_EXAMPLE'
# Set your GitHub token
export GITHUB_TOKEN=<your-github-token>

# Bootstrap Flux — this:
# 1. Installs Flux controllers into flux-system namespace
# 2. Creates (or uses) the GitHub repo 'cluster-config'
# 3. Commits the Flux manifests to clusters/my-aks-cluster/
# 4. The cluster then reconciles ITSELF from that repo
flux bootstrap github \
  --owner=your-github-org \
  --repository=cluster-config \
  --branch=main \
  --path=clusters/my-aks-cluster \
  --personal \
  --components-extra=image-reflector-controller,image-automation-controller
BOOTSTRAP_EXAMPLE

echo ""
echo "=== 4. Install Flux manually (for clusters without GitHub access) ==="
echo "Checking if Flux is already installed..."
if kubectl get namespace flux-system &>/dev/null; then
  echo "Flux is already installed (flux-system namespace exists)"
else
  echo "Installing Flux controllers directly (no GitHub bootstrap)..."
  flux install \
    --namespace=flux-system \
    --components-extra=image-reflector-controller,image-automation-controller \
    2>/dev/null || echo "(flux install requires cluster connection)"
fi

echo ""
echo "=== 5. Flux controllers status ==="
flux check 2>/dev/null || kubectl get pods -n flux-system 2>/dev/null || \
  echo "(flux-system namespace not yet installed)"

echo ""
echo "=== 6. Create a GitRepository source ==="
echo ""
echo "This tells Flux to watch a git repo and create a source artifact:"
cat <<'EOF'
flux create source git my-app-source \
  --url=https://github.com/your-org/my-app \
  --branch=main \
  --interval=1m \
  --export    # shows the YAML without applying
EOF

echo ""
echo "The equivalent YAML (apply to cluster to create the source):"
cat <<'GITREPO_YAML'
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: my-app-source
  namespace: flux-system
spec:
  interval: 1m               # poll git every 1 minute
  ref:
    branch: main
  url: https://github.com/your-org/my-app
  secretRef:
    name: my-app-git-credentials  # optional: for private repos
GITREPO_YAML

echo ""
echo "=== 7. Create a Kustomization (apply manifests from the repo) ==="
echo ""
echo "This tells Flux which path in the GitRepository to apply:"
cat <<'KUSTOMIZATION_YAML'
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-app
  namespace: flux-system
spec:
  interval: 5m                # reconcile every 5 minutes
  sourceRef:
    kind: GitRepository
    name: my-app-source
  path: ./k8s/production     # apply all manifests in this directory
  prune: true                # delete resources removed from git
  targetNamespace: production
  healthChecks:
  - apiVersion: apps/v1
    kind: Deployment
    name: my-api
    namespace: production
KUSTOMIZATION_YAML

echo ""
echo "=== 8. Show Flux source and kustomization status ==="
flux get sources git 2>/dev/null || \
  echo "(no GitRepository sources found — bootstrap first)"

echo ""
flux get kustomizations 2>/dev/null || \
  echo "(no Kustomizations found — bootstrap first)"

echo ""
echo "=== 9. Manually trigger reconciliation ==="
echo ""
echo "Force Flux to check git right now (useful after a commit):"
echo "  flux reconcile source git flux-system"
echo "  flux reconcile kustomization my-app --with-source"
echo ""
flux reconcile source git flux-system 2>/dev/null || \
  echo "(no flux-system source — run bootstrap first)"

echo ""
echo "=== 10. Flux logs — see what the controllers are doing ==="
flux logs --all-namespaces 2>/dev/null | tail -20 || \
  echo "(no Flux logs available — install Flux first)"

echo ""
echo "=== 11. HelmRelease example — deploy nginx-ingress via Flux ==="
cat <<'HELMRELEASE_YAML'
# Add a HelmRepository source
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: HelmRepository
metadata:
  name: ingress-nginx
  namespace: flux-system
spec:
  interval: 1h
  url: https://kubernetes.github.io/ingress-nginx
---
# HelmRelease: Flux manages the Helm release lifecycle
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
      version: "4.x"         # pin the major version, allow minor/patch updates
      sourceRef:
        kind: HelmRepository
        name: ingress-nginx
  targetNamespace: ingress-nginx
  install:
    createNamespace: true
  values:
    controller:
      replicaCount: 2
      resources:
        requests:
          cpu: "100m"
          memory: "128Mi"
HELMRELEASE_YAML

echo ""
echo "=== 12. Image automation example ==="
echo "This updates the image tag in git automatically when a new image is pushed to ACR:"
cat <<'IMAGE_AUTO_YAML'
# Watch the registry for new tags
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImageRepository
metadata:
  name: my-api
  namespace: flux-system
spec:
  image: myacr.azurecr.io/my-api
  interval: 5m

# Define which tags to track (e.g., semver)
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

# Automate: when a new tag matches the policy, commit the update to git
apiVersion: image.toolkit.fluxcd.io/v1beta1
kind: ImageUpdateAutomation
metadata:
  name: my-api
  namespace: flux-system
spec:
  interval: 5m
  sourceRef:
    kind: GitRepository
    name: flux-system
  git:
    checkout:
      ref:
        branch: main
    commit:
      author:
        name: Flux Bot
        email: flux@example.com
      messageTemplate: "chore: update my-api image to {{range .Updated.Images}}{{.}}{{end}}"
    push:
      branch: main
IMAGE_AUTO_YAML

echo ""
echo "--- Done. Key takeaway: Flux makes git the source of truth — deployments are commits, rollbacks are reverts, and the cluster self-heals from any manual change within the reconciliation interval. ---"
