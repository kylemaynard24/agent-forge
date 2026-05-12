# AKS and Managed Kubernetes

**Area:** Production Kubernetes / AKS

## Intent

Provision and configure Azure Kubernetes Service so that the control plane, node identity, networking, and observability are production-grade from day one — not bolted on after the first incident.

## When to use

- Every greenfield AKS deployment — these settings are much harder to change after the fact than to get right initially
- When migrating from self-managed Kubernetes — AKS's managed control plane eliminates etcd backups, API server upgrades, and certificate rotation
- When security or compliance requirements mandate Azure-native identity (workload identity, no long-lived passwords)

## Why it matters

AKS manages the Kubernetes control plane (API server, etcd, controller manager, scheduler) — you never SSH into a master node, never rotate its certificates manually, never back up etcd yourself. This shifts your operational concern entirely to node pools and workloads.

What AKS does not do automatically: network CNI choice (affects policy enforcement), identity (you must enable workload identity explicitly), monitoring (Container Insights is opt-in), and node pool design (one pool for everything is the wrong default). Getting these decisions right on day one matters because some of them (CNI selection, OIDC issuer) cannot be changed on a running cluster without recreation.

## Core concepts

- **Managed control plane** — Azure runs and upgrades the API server, etcd, and controller components; you pay for node VMs only
- **System node pool** — runs AKS system pods (CoreDNS, metrics-server, kube-proxy); must always have at least 1 node; use `CriticalAddonsOnly: true` taint to prevent user workloads from landing here
- **User node pool** — runs your application workloads; can have different VM SKUs, OS disks, and autoscaler settings; can be scaled to 0 (system pool cannot)
- **Spot node pool** — uses Azure Spot VMs (up to 90% cheaper) with eviction risk; correct for interruptible batch workloads or dev/test; taint with `kubernetes.azure.com/scalesetpriority=spot:NoSchedule` so only tolerating pods land here
- **Azure CNI** — assigns each pod a real Azure VNet IP; supports Azure Network Policies and Service Endpoints; required for private cluster or when pods need VNet routing; uses more IPs per node than kubenet
- **kubenet** — assigns pods IPs from a private overlay CIDR; simpler, fewer IPs consumed in the VNet, but limited Azure-native network policy support; fine for non-production or small clusters
- **Workload identity** — a pod gets an Azure AD (Entra ID) identity via a federated credential; the Azure Identity SDK exchanges a Kubernetes-issued JWT for an Azure access token; no secrets stored anywhere
- **OIDC issuer** — enables AKS to issue JWTs that Azure AD trusts; required for workload identity; enabled at cluster creation or via `az aks update --enable-oidc-issuer`
- **Kubelet identity** — the managed identity used by the kubelet on each node; used to pull images from ACR (assign `AcrPull` role) and access Azure resources from node-level operations
- **Cluster autoscaler** — scales node count up when pods are Pending (no room), down when nodes are underutilized; configured per node pool with `--enable-cluster-autoscaler --min-count --max-count`
- **Node surge during upgrades** — AKS can provision extra nodes during version upgrades to reduce downtime; set `--max-surge` on the node pool (e.g., 1 extra node per pool during upgrade)
- **Azure Policy for AKS** — applies OPA/Gatekeeper policies via Azure Policy add-on; enforces org-wide standards (no privileged containers, required labels) without managing Gatekeeper yourself
- **Azure Monitor Container Insights** — collects container logs, node metrics, and Kubernetes events; sends to Log Analytics; required for alerting and AKS-native dashboards in Azure Portal

## Common mistakes

- **Single node pool for everything** — system pods and user workloads compete for resources; a runaway user app can starve CoreDNS and break DNS for the whole cluster; fix: always use a dedicated system node pool
- **Not enabling workload identity** — teams fall back to storing Azure credentials in Kubernetes Secrets; fix: enable OIDC issuer + workload identity at cluster creation; it cannot be added retroactively without downtime on older AKS versions
- **Manual node upgrades** — skipping `--max-surge` means upgrades drain nodes with no buffer; fix: set `--max-surge 1` and configure PodDisruptionBudgets on all Deployments before upgrading

## Tiny example

Create an AKS cluster with workload identity, Azure CNI, and a system + user node pool:

```bash
# Create resource group
az group create --name rg-aks-demo --location eastus

# Create AKS cluster with OIDC issuer + workload identity enabled
az aks create \
  --resource-group rg-aks-demo \
  --name aks-demo \
  --enable-oidc-issuer \
  --enable-workload-identity \
  --network-plugin azure \
  --node-count 2 \
  --node-vm-size Standard_D2s_v3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Add a user node pool (spot VMs for batch workloads)
az aks nodepool add \
  --resource-group rg-aks-demo \
  --cluster-name aks-demo \
  --name batchpool \
  --priority Spot \
  --spot-max-price -1 \
  --node-count 0 \
  --min-count 0 \
  --max-count 5 \
  --enable-cluster-autoscaler \
  --node-taints "kubernetes.azure.com/scalesetpriority=spot:NoSchedule"

# Get credentials
az aks get-credentials --resource-group rg-aks-demo --name aks-demo
```

## Run the demo

```bash
bash demo.sh
```

The demo creates an AKS cluster, adds a user node pool, enables workload identity, and shows a pod using workload identity to call Azure.

## Deeper intuition

Think of AKS as a managed control plane rental. You rent the brain (control plane) and own the workers (node pools). The control plane knows Kubernetes — you just tell it what to run. The workers are your VMs, your cost, your tuning responsibility.

The design decision that trips most teams: they treat AKS like a single-node-pool cluster and then hit a hard constraint (DNS failure because system pods were evicted, can't scale to zero because everything is on the system pool, workload identity unavailable because OIDC was never enabled). All of these constraints are rooted in day-1 decisions that were left as defaults.

The production checklist before creating the cluster: OIDC issuer on, workload identity on, Azure CNI (unless you have good reason for kubenet), system pool isolated with taint, user pool for apps with autoscaler enabled, Container Insights add-on on.

## Scenario questions

### Scenario 1 — "AKS upgraded our nodes and all pods in our main namespace were evicted simultaneously. The upgrade took the API down for 4 minutes."
**Question:** What two cluster-level settings would have prevented simultaneous eviction?
**Answer:** `--max-surge 1` on the node pool (so extra nodes are provisioned before old ones are drained) and PodDisruptionBudgets on all Deployments.
**Explanation:** Node surge provisions a new node, drains one old node at a time, and then removes the old node. Without surge, nodes are drained in-place with no buffer. PDBs tell the drain process how many pods must remain available — without them, all pods on a node are evicted at once regardless of replica count.

### Scenario 2 — "A developer wants to use the DefaultAzureCredential in a .NET app to read from Azure Key Vault without any passwords. The app is running on AKS."
**Question:** What AKS features must be enabled for this to work?
**Answer:** OIDC issuer (`--enable-oidc-issuer`), workload identity (`--enable-workload-identity`), a Managed Identity with Key Vault Reader role, a Kubernetes ServiceAccount with an `azure.workload.identity/client-id` annotation, and a federated credential binding the ServiceAccount to the Managed Identity.
**Explanation:** DefaultAzureCredential in the Azure SDK automatically uses the workload identity token when running on AKS with these features enabled. The chain is: AKS issues a JWT to the pod → the SDK exchanges it at Azure AD for an access token for the Managed Identity → the access token is used to call Key Vault. No passwords, no Secrets, no rotation.

### Scenario 3 — "Our AKS cluster runs batch jobs that need GPUs occasionally, but most of the time no GPU workloads are running. The GPU VM SKU is expensive."
**Question:** What AKS node pool configuration minimizes cost while still supporting GPU workloads?
**Answer:** A separate GPU node pool with cluster autoscaler enabled, `minCount: 0`, and `maxCount: N`. The pool scales to zero when no GPU workloads are pending and scales up only when GPU pods are scheduled.
**Explanation:** GPU VMs are billed per hour. A node pool that scales to zero incurs no VM cost when idle. When a GPU pod with `resources.limits."nvidia.com/gpu": 1` is scheduled, the autoscaler provisions a GPU node. The pod's toleration for the GPU node taint ensures it lands there. This is cost-optimal for intermittent GPU workloads.
