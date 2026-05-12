# Containers — Syllabus

## Arc

You start by understanding what a container actually is at the OS level — not as an abstraction but as Linux namespaces and cgroups — then learn to build images well (small, secure, layer-cached). From there you learn the patterns that make containers composable (sidecars, init containers, multi-stage builds). Then Kubernetes: the primitives first (Pod, Deployment, Service), then the operational layer (probes, HPA, resource limits, storage), then the production layer on AKS (networking, identity, observability, cost). The arc ends with four capstone projects that require you to integrate across stages. At the end of this curriculum you can design, build, ship, and operate a containerized application on AKS — without looking up every flag.

## Stage 1 — Docker Foundations (~5 topics)

| # | Topic | Folder | Time |
|---|-------|--------|------|
| 1 | What Is a Container | `01-docker-foundations/what-is-a-container/` | 2–3 h |
| 2 | Writing Dockerfiles | `01-docker-foundations/writing-dockerfiles/` | 3–4 h |
| 3 | Docker Networking | `01-docker-foundations/docker-networking/` | 2–3 h |
| 4 | Docker Volumes | `01-docker-foundations/docker-volumes/` | 2 h |
| 5 | Docker Compose | `01-docker-foundations/docker-compose/` | 3–4 h |

## Stage 2 — Container Patterns (~4 topics)

| # | Topic | Folder | Time |
|---|-------|--------|------|
| 1 | Multi-Stage Builds | `02-container-patterns/multi-stage-builds/` | 3 h |
| 2 | Image Security and Scanning | `02-container-patterns/image-security/` | 2–3 h |
| 3 | Registry Strategy (ACR) | `02-container-patterns/registry-strategy/` | 2 h |
| 4 | Sidecar and Init Containers | `02-container-patterns/sidecar-and-init/` | 2–3 h |

## Stage 3 — Kubernetes Foundations (~7 topics)

| # | Topic | Folder | Time |
|---|-------|--------|------|
| 1 | The Control Plane Mental Model | `03-kubernetes-foundations/control-plane/` | 2–3 h |
| 2 | Pods | `03-kubernetes-foundations/pods/` | 3 h |
| 3 | Deployments | `03-kubernetes-foundations/deployments/` | 3–4 h |
| 4 | Services and DNS | `03-kubernetes-foundations/services-and-dns/` | 3 h |
| 5 | ConfigMaps and Secrets | `03-kubernetes-foundations/configmaps-and-secrets/` | 2 h |
| 6 | Namespaces and RBAC | `03-kubernetes-foundations/namespaces-and-rbac/` | 3 h |
| 7 | Ingress | `03-kubernetes-foundations/ingress/` | 3–4 h |

## Stage 4 — Kubernetes Operations (~5 topics)

| # | Topic | Folder | Time |
|---|-------|--------|------|
| 1 | Resource Limits and Requests | `04-kubernetes-operations/resource-limits/` | 2–3 h |
| 2 | Health Probes | `04-kubernetes-operations/health-probes/` | 2 h |
| 3 | Rolling Updates and Rollbacks | `04-kubernetes-operations/rolling-updates/` | 3 h |
| 4 | Horizontal Pod Autoscaler | `04-kubernetes-operations/hpa/` | 2–3 h |
| 5 | Persistent Storage (PVCs) | `04-kubernetes-operations/persistent-storage/` | 3 h |

## Stage 5 — Production Kubernetes / AKS (~5 topics)

| # | Topic | Folder | Time |
|---|-------|--------|------|
| 1 | AKS Cluster Design | `05-production-aks/cluster-design/` | 3–4 h |
| 2 | Workload Identity (OIDC + Key Vault) | `05-production-aks/workload-identity/` | 4 h |
| 3 | Azure CNI and Network Policy | `05-production-aks/networking/` | 3–4 h |
| 4 | Observability (Azure Monitor + Prometheus) | `05-production-aks/observability/` | 4 h |
| 5 | Cost Governance and Node Pools | `05-production-aks/cost-and-node-pools/` | 3 h |

## Capstones (~4 projects)

| # | Project | Folder | Time |
|---|---------|--------|------|
| 1 | Containerized .NET API with full Dockerfile, Compose dev stack, and CI image push | `capstones/01-containerized-api/` | 6–8 h |
| 2 | Kubernetes Deployment with Ingress, Secrets, and Health Probes | `capstones/02-kubernetes-deployment/` | 6–8 h |
| 3 | AKS Production Cluster: workload identity, ACR pull, Azure Monitor | `capstones/03-aks-production/` | 8–12 h |
| 4 | Full GitOps Pipeline: GitHub Actions → ACR → AKS rolling deploy with rollback | `capstones/04-gitops-pipeline/` | 8–12 h |

## Step order per topic

1. **read** — work through `README.md` until you can explain the concept without looking at it
2. **demo** — run `bash demo.sh` and understand each command; re-run with variations
3. **implement** — complete `homework.md`, saving your work to `progress/<date>/working-folder/containers/`

## State tracking

Progress is in `progress/containers/state.md`.
