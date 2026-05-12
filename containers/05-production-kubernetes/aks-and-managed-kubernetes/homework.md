# Homework — AKS and Managed Kubernetes

> You are setting up the production AKS cluster for a .NET API shop that deploys to Azure. The CTO wants zero stored credentials, spot-node cost savings for batch workloads, and full observability. You have one afternoon to get the cluster right before it gets workloads.

## Exercise: Production-Ready AKS Cluster

**Scenario:** Provision an AKS cluster that meets a production readiness checklist. Every item on the checklist has a reason — understanding the "why" is as important as the "how."

**Build:**
1. Create a resource group and AKS cluster with:
   - `--enable-oidc-issuer` — required for workload identity
   - `--enable-workload-identity` — required for passwordless Azure access
   - `--network-plugin azure` — required for NetworkPolicies
   - `--enable-addons monitoring` — Container Insights from day one
   - System node pool: 3 nodes, Standard_D2s_v3
2. Add a user node pool:
   - `--priority Spot` with `--spot-max-price -1` (use Azure's eviction price)
   - Cluster autoscaler: `--min-count 0 --max-count 5`
   - Taint: `kubernetes.azure.com/scalesetpriority=spot:NoSchedule`
3. Create a Managed Identity, assign it `Key Vault Secrets User` role on a Key Vault with a test secret
4. Create a Kubernetes ServiceAccount with the `azure.workload.identity/client-id` annotation
5. Create a federated credential binding the ServiceAccount to the Managed Identity
6. Deploy a pod using the ServiceAccount that reads the Key Vault secret via `az keyvault secret show` — no passwords anywhere

**Constraints:**
- The pod in step 6 must not have any environment variables, Kubernetes Secrets, or mounted config files containing credentials — verify with `kubectl describe pod`
- The system node pool must be isolated with a `CriticalAddonsOnly=true:NoSchedule` taint so user workloads cannot land on it
- Document the federated credential flow in `observations.md` — draw the chain: pod → Kubernetes JWT → Azure AD → access token → Key Vault

## Stretch 1

Configure `az aks upgrade` with a max-surge node pool update strategy:

```bash
az aks nodepool update \
  --resource-group $RG \
  --cluster-name $CLUSTER \
  --name nodepool1 \
  --max-surge 1
```

Perform a dry-run cluster upgrade:

```bash
az aks upgrade \
  --resource-group $RG \
  --name $CLUSTER \
  --kubernetes-version <next-version> \
  --dry-run
```

Document what `--max-surge 1` does to the node count during an upgrade and why it reduces downtime risk.

## Stretch 2

Enable the Azure Policy add-on:

```bash
az aks enable-addons --addons azure-policy \
  --resource-group $RG --name $CLUSTER
```

Assign the "Kubernetes cluster containers should not run with root user" policy to the cluster. Deploy a pod that runs as root — verify Azure Policy blocks or audits it. Document the Policy compliance state in the Azure Portal.

## Teardown

Always tear down when done to avoid charges:

```bash
az group delete --name rg-aks-homework --yes --no-wait
```

Estimated cost if left running: ~$10-15/hour for a 3-node D2s_v3 cluster.

## Reflection

- What is the difference between the kubelet identity and the workload identity? Which one pulls images from ACR?
- Azure CNI assigns each pod a VNet IP. If your VNet subnet has 256 IPs and each node can have 30 pods, what is the maximum number of nodes in that node pool? How does this affect subnet planning?
- Why can a system node pool not scale to zero, but a user node pool can?

## Done when

- [ ] `az aks show --query "oidcIssuerProfile.issuerUrl"` returns a URL
- [ ] Spot user node pool is visible in `az aks nodepool list`
- [ ] Pod reads Key Vault secret and prints it to logs — no credentials in pod spec
- [ ] `kubectl describe pod <reader-pod>` confirms no credential env vars or Secret mounts
- [ ] `observations.md` documents the workload identity chain
- [ ] `az group delete` is run — no lingering Azure resources

---

## Clean Code Lens

**Principle in focus:** Principle of Least Privilege

Workload identity is the infrastructure embodiment of least privilege. Instead of giving a pod a connection string that grants access to everything in the database, you give it a Managed Identity that has been granted exactly `Key Vault Secrets User` on exactly one Key Vault. Nothing more. The identity cannot read other Key Vaults, cannot write secrets, cannot access storage accounts.

This is the same principle as making a class's fields private, or scoping a database user to `SELECT` on a specific table. The blast radius of a compromise is bounded by the scope of the credential. If the pod is compromised, the attacker gets read-only access to one Key Vault — not the entire Azure subscription.

**Exercise:** Audit the role assignments for a Managed Identity used by an AKS workload (or design one from scratch). For each role assignment, ask: is this the minimum permission required? Is the scope as narrow as possible (resource level, not subscription level)? Is there any `Contributor` or `Owner` role that could be replaced with a more specific built-in role?

**Reflection:** Least privilege is a security principle, but it also has a clean code dimension: explicit dependencies. When a pod needs exactly one secret from exactly one Key Vault, that dependency is explicit and auditable. When a pod has a full connection string, its dependencies are implicit and invisible. How does least privilege as an infrastructure principle map to dependency injection and explicit interfaces in application code?
