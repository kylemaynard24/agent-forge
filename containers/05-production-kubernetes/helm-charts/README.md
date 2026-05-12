# Helm Charts

**Area:** Production Kubernetes / AKS

## Intent

Package your Kubernetes application as a versioned, parameterizable Helm chart so that the same chart can deploy to dev, staging, and production with different values — no copy-paste YAML, no environment-specific files per service.

## When to use

- Any application deployed to more than one environment (dev/prod) — Helm values files replace environment-specific manifest copies
- Any application that is shared across teams or needs to be versioned independently of its source code
- Installing community software (cert-manager, nginx Ingress, Prometheus) — always use Helm charts from ArtifactHub

## Why it matters

Without Helm, you maintain separate directories of YAML for dev and prod that inevitably drift apart. A change to the production Deployment does not get backported to dev. A developer copy-pastes a service manifest and accidentally hard-codes a prod database URL. The `values.yaml` + templating model forces you to declare what varies between environments (replica count, image tag, resource sizes) and what is constant (the deployment strategy, probe configuration, port numbers).

Helm also gives you release management: `helm history` shows every deployment, `helm rollback` reverts to any previous revision, and `helm upgrade --atomic` automatically rolls back on failure. These capabilities make production deployments safer without requiring a separate CD tool for rollbacks.

## Core concepts

- **Chart** — a directory containing `Chart.yaml` (metadata), `templates/` (Go-templated Kubernetes manifests), and `values.yaml` (default parameter values)
- **Chart.yaml** — declares `name`, `version` (the chart's version), `appVersion` (the app's version), and `description`
- **values.yaml** — the default values; operators override these per-deployment with `-f custom-values.yaml` or `--set key=value`
- **Template syntax** — `{{ .Values.replicaCount }}` references values; `{{ .Release.Name }}` references the release name; `{{ .Chart.Version }}` references the chart version
- **Built-in objects** — `.Release` (name, namespace, revision), `.Chart` (name, version, appVersion), `.Capabilities` (API versions available in the cluster), `.Files` (access to non-template files in the chart)
- **`helm create`** — scaffolds a chart with a boilerplate Deployment, Service, Ingress, HPA, and ServiceAccount
- **`helm template`** — renders templates locally without deploying; useful for previewing what will be applied
- **`helm install --dry-run`** — runs the template + schema validation against the cluster API server without actually applying resources
- **`helm upgrade --install`** — installs if not present, upgrades if it is; idempotent; use in CI/CD pipelines
- **`helm rollback <release> <revision>`** — redeploys a specific previous revision's manifests
- **`helm history <release>`** — shows all revisions with timestamps, status, and chart version
- **Hooks** — annotate a Job or Pod template with `helm.sh/hook: pre-install` (runs before install), `helm.sh/hook: post-upgrade` (runs after upgrade); used for DB migrations
- **Chart dependencies** — declared in `Chart.yaml` under `dependencies`; use `helm dependency update` to download them into `charts/`; allows a parent chart to include child charts (e.g., your app + a redis subchart)
- **Helm repositories** — `helm repo add <name> <url>`; `helm search repo <chart-name>`; ArtifactHub is the community index; OCI registries (ACR) are the production standard
- **helmfile** — a tool (not part of Helm) that declaratively manages multiple Helm releases in a `helmfile.yaml`; useful for deploying an entire environment's stack as a unit

## Common mistakes

- **Putting secrets in values.yaml** — values.yaml is committed to git; never put passwords, connection strings, or API keys there; fix: use `helm upgrade --set db.password=$(az keyvault secret show ...)` or reference Kubernetes Secrets separately
- **Not pinning chart versions** — `helm upgrade --install cert-manager jetstack/cert-manager` without `--version` installs whatever is latest; a surprise upgrade can break your cluster; fix: always specify `--version`
- **Hard-coding image tags in values.yaml** — `image.tag: latest` is a footgun; fix: override image tag in CI with `--set image.tag=$GIT_SHA` at deploy time, and set `latest` only as the dev default

## Tiny example

The essential chart structure for a .NET API:

```
myapi/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── hpa.yaml
    └── _helpers.tpl     ← shared template fragments (name, labels)
```

A minimal `values.yaml`:

```yaml
replicaCount: 2

image:
  repository: myacr.azurecr.io/myapi
  tag: "1.0.0"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "256Mi"

ingress:
  enabled: true
  host: api.example.com
```

Deploy to dev:

```bash
helm upgrade --install myapi ./myapi \
  --namespace dev \
  --create-namespace \
  --values ./values-dev.yaml \
  --set image.tag=$GIT_SHA \
  --atomic
```

## Run the demo

```bash
bash demo.sh
```

The demo creates a chart with `helm create`, modifies values.yaml, previews with `helm template`, installs, upgrades with a new value, and rolls back.

## Deeper intuition

Think of a Helm chart as a function. `values.yaml` declares the function's parameters and their defaults. Each `helm install` or `helm upgrade` is a function call with specific arguments. The output is a set of Kubernetes manifests. Two calls with different arguments produce different (but structurally identical) clusters.

This is exactly what you want: the structure of how the app is deployed (probes, strategy, HPA) is constant and reviewed once. The parameters that differ by environment (replicas, resource sizes, image tags) are explicit function arguments, not copy-pasted files. When you fix a bug in the Deployment template, it is fixed for every environment on the next deploy.

## Scenario questions

### Scenario 1 — "A helm upgrade failed halfway through. The new pods are broken and the old pods are gone."
**Question:** What helm flag would have prevented this, and how does it work?
**Answer:** `--atomic`. It sets `--wait` (waits for all resources to become ready) and automatically rolls back to the previous revision if any resource fails to become Ready within the timeout.
**Explanation:** `helm upgrade --install --atomic --timeout 5m myapi ./myapi` will wait up to 5 minutes for the Deployment rollout to complete. If the new pods crash-loop or fail readiness, Helm automatically runs a rollback and returns a non-zero exit code. Combined with `--cleanup-on-fail`, it also deletes any newly created resources that did not exist in the previous release.

### Scenario 2 — "We need to run a database migration before each upgrade, but only if the upgrade succeeds."
**Question:** What Helm mechanism handles this, and what is the correct hook annotation?
**Answer:** Helm hooks. Annotate a Job with `helm.sh/hook: pre-upgrade` for before-upgrade tasks. For post-upgrade tasks (e.g., cache warming), use `helm.sh/hook: post-upgrade`.
**Explanation:** A `pre-upgrade` hook Job runs and must complete successfully before Helm applies the new chart manifests. If the migration Job fails, the upgrade is aborted. Add `helm.sh/hook-delete-policy: before-hook-creation` to clean up the old Job before running the new one, so you do not get "Job already exists" errors.

### Scenario 3 — "Two teams deploy their apps with helm and both call their release 'my-api'. The releases conflict."
**Question:** What is the Helm isolation mechanism?
**Answer:** Helm releases are scoped to a Kubernetes namespace. Team A deploys `helm install my-api -n team-a` and Team B deploys `helm install my-api -n team-b` — these are completely independent releases.
**Explanation:** The release name is unique within a namespace, not cluster-wide. Each release has its own history, secrets (where Helm stores state), and rollback chain. This is why deploying to dev and prod namespaces with the same chart and the same release name works: `helm install myapi ./myapi -n dev` and `helm install myapi ./myapi -n prod` are independent.
