# ConfigMaps and Secrets

**Area:** Kubernetes Foundations

## Intent

Separate application configuration from container images using ConfigMaps for non-sensitive settings and Secrets for sensitive data — injecting both at runtime rather than baking them into images.

## When to use

- Every time configuration varies between environments (dev vs staging vs prod)
- Any time a pod needs access to a database connection string, API key, TLS certificate, or password
- When you want to update configuration without rebuilding or redeploying the container image
- When your app reads config from environment variables or files

## Why it matters

The Twelve-Factor App principle of "config in the environment" exists for a reason: when configuration is baked into a container image, you need a different image for each environment. When it's injected at runtime, you deploy the same image everywhere and vary the environment-specific config. Kubernetes ConfigMaps and Secrets are the mechanism for that injection.

The distinction between ConfigMap and Secret matters for access control and tooling, but one crucial point is frequently misunderstood: Kubernetes Secrets are NOT encrypted at rest by default. They are base64-encoded, which is encoding, not encryption. Anyone who can run `kubectl get secret` in your namespace can read your "secrets." Real Secret security requires etcd encryption at rest (a cluster configuration) combined with RBAC that restricts who can get/list Secrets, or better yet, an external secrets manager (Azure Key Vault, HashiCorp Vault) that keeps the actual secret value out of etcd entirely.

## Core concepts

- **ConfigMap** — a key-value store for non-sensitive configuration; values can be strings, multi-line text, or entire file contents; used for feature flags, log levels, config file contents, external URLs
- **Secret** — a key-value store for sensitive data; stored in etcd (base64-encoded by default, encrypted if etcd encryption is enabled); has restricted `list` access by default in Kubernetes RBAC
- **base64 ≠ encryption** — a Secret's value is just `base64(plaintext)`; `echo "abc123" | base64` produces the stored value; anyone with `kubectl get secret <name> -o json` can decode it; do not treat base64 as a security control
- **Mounting as environment variable** — `envFrom.configMapRef` or `env.valueFrom.configMapKeyRef` injects config values as environment variables into the container; the pod restarts to pick up changes (not live-reloaded)
- **Mounting as a volume** — the ConfigMap or Secret is projected as files on a filesystem path inside the container; useful for configuration files, certificates, or any value too large or complex for an env var; volume mounts DO hot-reload (within 60s) when the ConfigMap/Secret is updated, without restarting the pod
- **Secret types** — `Opaque` (default, arbitrary key-value), `kubernetes.io/tls` (TLS certs), `kubernetes.io/dockerconfigjson` (registry pull credentials), `kubernetes.io/service-account-token` (service account tokens)
- **Immutable ConfigMaps and Secrets** — setting `immutable: true` prevents the object from being modified; Kubernetes stops watching these for updates (improving API server performance at scale); useful for config that truly never changes
- **Secret rotation challenges** — updating a Secret doesn't automatically reload it into pods; for env-var-mounted Secrets, pods must be restarted; for volume-mounted Secrets, kubelet picks up the new version within ~60s; production secret rotation requires planning around this
- **Azure Key Vault CSI driver** — a Kubernetes CSI (Container Storage Interface) driver that mounts secrets from Azure Key Vault directly as files in pods without storing the secret value in etcd; integrates with workload identity for authentication; the recommended approach for production secret management on AKS

## Common mistakes

- **Storing secrets in ConfigMaps** — "it's not production yet" or "it's just an API key" — once a value is in a ConfigMap, anyone with `kubectl get configmap` access can read it; always use a Secret (or Key Vault) for credentials
- **Committing Secret manifests to git** — a Secret YAML file contains base64-encoded values that decode instantly; committed secrets are compromised secrets; use sealed-secrets, SOPS, or an external secrets operator instead; never commit a manifest with actual credentials
- **Not rotating secrets** — a Secret that was created 2 years ago and never rotated is a liability; implement a rotation process and test it before you need it
- **Assuming volume-mounted secret updates are instant** — kubelet polls for ConfigMap/Secret updates on a configurable interval (default: 60s); your app may see the old value for up to a minute after you update the Secret
- **Setting the entire config in one large ConfigMap** — when the ConfigMap changes, pods may need to restart; if you have a 200-key ConfigMap and only 3 keys change, you still restart every pod using it; split configmaps by concern and restart scope

## Tiny example

Three patterns for the same database password:

**Pattern 1 — Environment variable from Secret (most common):**
```yaml
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: db-credentials
      key: password
```

**Pattern 2 — Mount all Secret keys as environment variables:**
```yaml
envFrom:
- secretRef:
    name: db-credentials
```

**Pattern 3 — Mount Secret as a file (useful for certificates or JSON config):**
```yaml
volumeMounts:
- name: db-secret
  mountPath: /etc/db
  readOnly: true
volumes:
- name: db-secret
  secret:
    secretName: db-credentials
```
The file `/etc/db/password` contains the secret value. Your app reads the file. If the Secret updates, kubelet replaces the file within ~60s without a pod restart.

## Run the demo

```bash
bash demo.sh
```

The demo creates ConfigMaps from literals and from files, mounts them as env vars and volumes, creates a Secret, demonstrates the base64 decode risk, and shows how `kubectl describe secret` hides values while `kubectl get secret -o json` exposes them.

## Deeper intuition

Think of a ConfigMap as the Kubernetes equivalent of an environment configuration file, and a Secret as a locked drawer that etcd keeps the key to. The locked drawer metaphor breaks down because etcd's lock (base64) is trivially picked by anyone with read access — which is why external secrets managers matter for anything genuinely sensitive.

The real value of both ConfigMap and Secret is decoupling the what-to-deploy (image) from the how-to-run (configuration). You can promote the same image from dev to staging to prod by changing environment-specific ConfigMaps and Secrets without touching the image. This is the operational foundation of consistent deployments.

## Scenario questions

### Scenario 1 — "We need to rotate the database password and can't take downtime"
**Question:** The DBA is rotating the database password. How do you update the Kubernetes Secret and minimize downtime?
**Answer:** If the Secret is volume-mounted, update the Secret and wait up to 60 seconds for kubelet to propagate it to all pods (no restart needed). If it's an env-var-mounted Secret, you'll need a rolling restart (`kubectl rollout restart deployment/myapp`) — this has zero downtime if you have multiple replicas and a readiness probe.
**Explanation:** This is why certificate and password injection via volume mount is often preferable to env vars — hot reload without restart. For env vars, the rolling restart approach is still zero-downtime for multi-replica Deployments, just more disruptive.

### Scenario 2 — "The security team found that developers can `kubectl get secrets` in prod"
**Question:** How do you prevent developers from reading production Secrets without breaking their ability to deploy and debug?
**Answer:** Create a Role in the prod namespace that allows `get`, `list`, `watch` for Deployments, Pods, Services, ConfigMaps but explicitly excludes Secret access. Bind developers to this Role, not to `cluster-admin` or `admin`. For even stronger isolation, use an external secrets operator — secrets never land in Kubernetes at all.
**Explanation:** Kubernetes RBAC is namespace-scoped. You can give someone full access to a namespace's workload resources while withholding Secret access. The external secrets approach (Azure Key Vault CSI or External Secrets Operator) goes further — developers don't need K8s Secret access because the secrets don't exist in K8s; they exist only in the vault.
