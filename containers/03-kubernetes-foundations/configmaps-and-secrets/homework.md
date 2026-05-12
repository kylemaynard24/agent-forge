# Homework — ConfigMaps and Secrets

> Kubernetes Secrets are not secret by default. Understanding what they actually are is the first step to using them correctly.

## Exercise: App Configuration via ConfigMap + Secret

**Scenario:** You're deploying a .NET-style application (simulated with a shell container) that needs:
1. A JSON feature-flags file mounted at `/etc/config/features.json` — from a ConfigMap
2. A database connection string available as the `DB_CONNECTION` environment variable — from a Secret
3. Log level configurable via `LOG_LEVEL` env var — from a ConfigMap

The app must read all three and print proof that they're accessible. You'll also demonstrate the base64 decode to internalize why Secrets require additional controls.

**Build these Kubernetes objects:**

**ConfigMap 1 — `app-settings`:**
Keys: `LOG_LEVEL=info`, `ASPNETCORE_ENVIRONMENT=Staging`

**ConfigMap 2 — `feature-flags`:**
A single key `features.json` with value:
```json
{
  "darkMode": true,
  "betaSearch": false,
  "maxUploadMB": 25
}
```

**Secret — `db-credentials`:**
Keys: `DB_CONNECTION` with value `Server=staging-db.internal;Database=MyApp;User=app;Password=StrongP@ssw0rd!`

**Pod — `config-consumer`:**
A pod that:
- Mounts `feature-flags` as a volume at `/etc/config/` (so `/etc/config/features.json` exists)
- Injects `LOG_LEVEL` and `ASPNETCORE_ENVIRONMENT` as env vars from `app-settings`
- Injects `DB_CONNECTION` as an env var from the `db-credentials` secret
- On startup, prints all three values to stdout (truncate the connection string to first 30 chars for safety)

**Proof commands to capture:**
```bash
# 1. Show the feature flags file is accessible inside the pod
kubectl exec config-consumer -- cat /etc/config/features.json

# 2. Show env vars are set
kubectl exec config-consumer -- env | grep -E "LOG_LEVEL|ASPNETCORE_ENVIRONMENT|DB_CONNECTION"

# 3. Demonstrate base64 decode (IMPORTANT: understand what this means)
kubectl get secret db-credentials -o jsonpath='{.data.DB_CONNECTION}' | base64 --decode
```

**The base64 exercise (required, not optional):**
After running step 3 above, write a 2-paragraph note in your own words explaining:
- What base64 encoding is, and why it's not security
- What two things you would actually need to make this Secret genuinely secure (hint: etcd encryption at rest + RBAC, or an external secrets operator)

**Constraints:**
- The feature flags must be mounted as a FILE, not injected as individual env vars — the point is to demonstrate the file-mount pattern
- Do NOT hardcode the DB_CONNECTION string in the pod spec — it must come from the Secret via `secretKeyRef`
- `kubectl describe secret db-credentials` must not show the connection string value (this is the expected behavior — verify it)

## Stretch 1: Azure Key Vault CSI Driver
If you have AKS with workload identity configured, set up the Azure Key Vault Provider for Secrets Store CSI Driver. Create a `SecretProviderClass` that reads a secret from Key Vault. Mount it into a pod. Prove the secret value is accessible inside the pod as a file. Note what does NOT exist in `kubectl get secrets` — the value is not in etcd at all.

## Stretch 2: External Secrets Operator
Install the External Secrets Operator. Create an `ExternalSecret` resource that syncs a secret from Azure Key Vault (or a fake backend like a `Fake` provider for local testing) into a Kubernetes Secret on a 1-hour refresh interval. Observe what happens when the source secret value changes — does the Kubernetes Secret update automatically?

## Reflection

- A dev updates a ConfigMap that's mounted as a volume in a running pod. How long until the pod sees the new value? What if it's mounted as an env var instead?
- Your team wants to commit Kubernetes manifests to git (GitOps). But your Secret manifests contain base64-encoded credentials. What are three approaches to committing Secret configuration to git without committing the actual secret values?
- You set `immutable: true` on a ConfigMap that contains feature flags. Three weeks later you need to change a flag. What do you have to do, and why would you use immutable ConfigMaps despite this inconvenience?

## Done when

- [ ] `app-settings` ConfigMap created with `LOG_LEVEL` and `ASPNETCORE_ENVIRONMENT`
- [ ] `feature-flags` ConfigMap created with a `features.json` key containing valid JSON
- [ ] `db-credentials` Secret created (not visible in `kubectl describe`)
- [ ] `config-consumer` pod is running and mounts feature-flags as a volume file
- [ ] `kubectl exec config-consumer -- cat /etc/config/features.json` shows the JSON
- [ ] `kubectl exec config-consumer -- env | grep DB_CONNECTION` shows the value (or truncated)
- [ ] Base64 decode exercise is completed and the 2-paragraph note is written
- [ ] Pod does NOT define the DB_CONNECTION string anywhere in its spec — it comes from the Secret only

---

## Clean Code Lens

**Principle in focus:** Separation of Concerns — configuration vs code

The Twelve-Factor App methodology defines "config" as anything that varies between deploys (dev, staging, prod) and demands it be stored in environment variables, not in the code. Kubernetes ConfigMaps and Secrets are the infrastructure implementation of this principle at the platform level.

When configuration is in the application code or baked into a Docker image, it violates SoC because the same artifact can't be promoted through environments — you rebuild for each environment, which means what you test in staging is not what you run in prod. When configuration is in ConfigMaps and Secrets, the application code has a single responsibility: read its config from the environment or from well-known file paths. The platform has a single responsibility: provide the correct config for each environment. The two can evolve independently.

This separation also makes auditing and compliance tractable. "What database does the prod deployment connect to?" has a mechanical answer: `kubectl get secret db-credentials -n prod`. "Was that connection string the same 30 days ago?" is answerable via etcd backup history or a GitOps audit trail. When connection strings are in application code or image build args, these questions are much harder to answer under pressure.

**Exercise:** Pick an application you work on. Identify every piece of configuration that varies between dev and prod. For each one, categorize it: ConfigMap (not sensitive) or Secret (sensitive). Write a table with columns: setting name, current location, target location, sensitivity level. This table is the migration plan for moving to proper K8s config management.

**Reflection:** Your app reads a feature flag from a ConfigMap that's mounted as a volume. The product team updates the flag. The kubelet syncs the new file to running pods within 60 seconds. But your app reads the file once at startup and caches it. How do you make your app respect configuration changes without a restart?
