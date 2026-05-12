# Stage 5: Production Kubernetes / AKS

You can run apps in Kubernetes. Now learn to run them safely, repeatably, and observably in Azure AKS — at the scale and compliance level your organization requires.

This section comes **after** Kubernetes Operations — you can run apps, now learn to run them safely and repeatably in Azure AKS.

## Contents

- [aks-and-managed-kubernetes/](aks-and-managed-kubernetes/) — Provision and configure AKS with managed identities, multiple node pools, workload identity, and Azure CNI
- [helm-charts/](helm-charts/) — Package, version, and deploy Kubernetes applications as Helm charts with parameterized values files
- [rbac-and-security/](rbac-and-security/) — Lock down pods and namespaces with security contexts, NetworkPolicies, OPA/Gatekeeper, and Azure RBAC integration
- [observability-in-kubernetes/](observability-in-kubernetes/) — Wire up structured logging, Prometheus metrics, distributed tracing, and Azure Monitor Container Insights for full observability
- [gitops-with-flux/](gitops-with-flux/) — Adopt a pull-based GitOps model with Flux v2 so git becomes the single source of truth for cluster state

## How to use this section

Each topic has three artifacts:
1. **`README.md`** — the concept and why it matters
2. **`demo.sh`** — annotated shell commands you can run
3. **`homework.md`** — a constrained exercise

## How to know this section is working

- You can provision an AKS cluster with workload identity and deploy a pod that reads a Key Vault secret without storing credentials anywhere in the cluster
- You can package a .NET API as a Helm chart and deploy it to dev and prod namespaces from the same chart with different values files
- You can make a change to a manifest in git and watch Flux reconcile it to the cluster automatically — without running `kubectl apply` manually

## Question-driven orientation

### Scenario 1 — "We store our database connection string as a Kubernetes Secret. A developer ran 'kubectl get secret' and read the password in base64."
**Question:** What is the correct secret management strategy for AKS in an Azure environment?
**Answer:** Use Azure Key Vault with the Secrets Store CSI Driver or workload identity — credentials never touch the Kubernetes Secret store.
**Explanation:** Kubernetes Secrets are base64-encoded, not encrypted by default. Even with etcd encryption at rest, any principal with `get secret` RBAC permission can read them. The AKS best practice is to store secrets in Azure Key Vault and mount them using the Secrets Store CSI Driver or retrieve them in-code using the DefaultAzureCredential via workload identity. No password ever enters Kubernetes.

### Scenario 2 — "Our CI/CD pipeline runs kubectl apply for every commit. Last week a junior developer accidentally deleted the production namespace."
**Question:** What architectural change prevents this class of accident?
**Answer:** GitOps with Flux. The cluster pulls its desired state from git. Nobody runs kubectl apply in production — not humans, not CI.
**Explanation:** In a GitOps model, the cluster is always trying to match what is in git. CI pushes to git; Flux reconciles the cluster. This means CI/CD does not need cluster credentials for production. Humans cannot make ad-hoc changes that bypass review. Deleted resources are automatically recreated by Flux within the reconciliation interval. The blast radius of any mistake is bounded by the time to revert a git commit.

### Scenario 3 — "Our AKS cluster has 12 microservices. When one service has a bug and starts making excessive requests to others, it takes down the whole cluster."
**Question:** What two Kubernetes features would provide network-level isolation?
**Answer:** NetworkPolicies (to restrict which pods can communicate with which) and resource limits (to prevent runaway CPU/memory consumption).
**Explanation:** By default, Kubernetes has a flat network — every pod can talk to every other pod. A single `default-deny-ingress` NetworkPolicy applied per namespace, with explicit allow rules for only the required service-to-service paths, limits the blast radius of a compromised or buggy service. Combined with resource limits, a misbehaving pod cannot consume cluster-wide resources either.

### Scenario 4 — "A helm upgrade went wrong and now the app is broken in production. We need to revert in the next 5 minutes."
**Question:** What single command reverts the Helm release to the last known-good state?
**Answer:** `helm rollback <release-name> [revision-number]`
**Explanation:** Helm stores the full manifest history for each release. `helm history <release-name>` shows every revision with its status. `helm rollback my-api 3` redeploys revision 3's manifests immediately. The rollback is recorded as a new revision, so you have a full audit trail. This is why pinning chart versions and using `helm upgrade --atomic` (which auto-rolls back on failure) is a production best practice.
