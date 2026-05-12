# Homework — Helm Charts

> Your team has separate YAML files for dev, staging, and prod that have drifted so far apart that a prod-only bug took 3 days to reproduce locally. You are consolidating everything into one chart.

## Exercise: The .NET API Chart

**Scenario:** Package a .NET 8 API into a Helm chart that can be deployed to `dev` and `prod` namespaces from the same chart with different values files. The chart must expose enough parameters to cover realistic environment differences without over-engineering.

**Build:**
1. Run `helm create dotnet-api` to scaffold the chart
2. Modify `values.yaml` to expose these parameters (with sane defaults):
   - `replicaCount` — number of replicas
   - `image.repository` — ACR image URL
   - `image.tag` — set to `"latest"` as default; override in CI
   - `service.type` — `ClusterIP` by default
   - `resources.requests` and `resources.limits` — CPU and memory
3. Write `values-dev.yaml` (1 replica, lower resource limits)
4. Write `values-prod.yaml` (3 replicas, HPA enabled, production-sized resources)
5. Deploy to `dev` namespace: `helm upgrade --install dotnet-api ./dotnet-api -n dev --values values-dev.yaml`
6. Deploy to `prod` namespace: `helm upgrade --install dotnet-api ./dotnet-api -n prod --values values-prod.yaml`
7. Run `helm history dotnet-api -n dev` and `helm history dotnet-api -n prod` — verify independent revision histories

**Constraints:**
- The chart must pass `helm lint ./dotnet-api` with no errors — fix any linting warnings before submitting
- `values.yaml` must not contain any passwords, connection strings, or API keys — document how secrets would be handled (environment variable from a Kubernetes Secret, not values.yaml)
- Image tag must be overridable via `--set image.tag=$GIT_SHA` — test this with a fake SHA and verify the pod spec shows the correct tag
- The Deployment template must use `{{ include "dotnet-api.fullname" . }}` for the name (from `_helpers.tpl`) — do not hard-code the release name

## Stretch 1

Add a `pre-upgrade` Helm hook Job that simulates a database migration. The Job should:
- Use `helm.sh/hook: pre-upgrade,pre-install`
- Use `helm.sh/hook-delete-policy: before-hook-creation`
- Run `echo "Running migrations..."` and exit 0 (simulated success)

Verify the hook fires before the Deployment is updated:

```bash
helm upgrade dotnet-api ./dotnet-api -n dev --values values-dev.yaml --set image.tag=2.0.0
kubectl get jobs -n dev   # should show the migration job
```

Then simulate a failed migration (exit 1) and verify `helm upgrade` is aborted.

## Stretch 2

Push the chart to Azure Container Registry as an OCI artifact:

```bash
helm registry login $ACR_NAME.azurecr.io --username $ACR_NAME --password $ACR_PASSWORD
helm package ./dotnet-api
helm push dotnet-api-0.1.0.tgz oci://$ACR_NAME.azurecr.io/helm
```

Then install directly from ACR:

```bash
helm upgrade --install dotnet-api oci://$ACR_NAME.azurecr.io/helm/dotnet-api \
  --version 0.1.0 \
  --namespace dev \
  --values values-dev.yaml
```

Document the OCI pull in `observations.md`.

## Reflection

- `helm upgrade --atomic` automatically rolls back on failure. What exactly does it check to decide whether the upgrade "succeeded"? What happens to a Deployment whose pods never reach Ready state?
- You have 5 microservices, each with its own Helm chart. In a CI/CD pipeline, how do you ensure they are all deployed together atomically? What tool would you reach for?
- A teammate wants to use `--set` to pass a multi-line certificate as a value. What problem does this cause and how do you solve it?

## Done when

- [ ] `helm lint ./dotnet-api` returns no errors
- [ ] `helm template` renders valid YAML for both dev and prod values
- [ ] Both namespace deployments are running: `kubectl get pods -n dev` and `kubectl get pods -n prod`
- [ ] `helm history` shows independent revision histories for dev and prod
- [ ] `helm rollback dotnet-api 1 -n dev` works and reverts the image tag
- [ ] No secrets or passwords appear in `values.yaml` or any template file

---

## Clean Code Lens

**Principle in focus:** Don't Repeat Yourself (DRY)

A chart with `values.yaml` + environment overrides is DRY infrastructure. The Deployment template is written once. The HPA template is written once. The probes are configured once. When you fix a bug in the readiness probe configuration, every environment gets the fix on the next deploy — not just the one you happened to edit.

The DRY violation is obvious in copy-pasted YAML: you have `deployment-dev.yaml`, `deployment-staging.yaml`, and `deployment-prod.yaml`, and they slowly diverge. You fix a probe in dev and forget prod. A dependency is added in staging and never added to dev. Three months later, nobody knows which file is authoritative.

Helm's values model enforces the DRY contract by making it structurally impossible to have environment-specific templates. The template is the constant. The values file is the variable. Separate concerns into their correct files and the divergence problem disappears.

**Exercise:** Take the current state of three environment-specific YAML files (dev/staging/prod) for a Deployment — or create three that have realistic differences. Extract the commonality into a Helm template and the differences into three values files. Count the lines that were duplicated before and after the refactor.

**Reflection:** Helm's Go templating can be abused: you can add `if` statements, `range` loops, and deeply nested conditionals until the template is harder to read than raw YAML. Where is the line between "healthy parameterization" and "template complexity that defeats the purpose of DRY"? What is your heuristic?
