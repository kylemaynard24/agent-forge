# containers

A learning-oriented collection covering Docker and Kubernetes from first principles to production AKS deployments. The arc runs from "what is a container, really" through operating stateful workloads at scale on Azure Kubernetes Service.

## Contents

- [01-docker-foundations/](01-docker-foundations/) — Linux primitives, Dockerfiles, networking, volumes, and Compose. Everything you need before Kubernetes makes sense.
- [02-container-patterns/](02-container-patterns/) — Multi-stage builds, sidecar and init containers, image security scanning, and registry strategy.
- [03-kubernetes-foundations/](03-kubernetes-foundations/) — Pods, Deployments, Services, ConfigMaps, Secrets, namespaces, RBAC, and the control plane mental model.
- [04-kubernetes-operations/](04-kubernetes-operations/) — Rolling updates, resource limits, health probes, HPA, PersistentVolumeClaims, and day-2 operations.
- [05-production-aks/](05-production-aks/) — AKS cluster design, managed identity, Azure CNI, workload identity, monitoring with Azure Monitor and Prometheus, and cost governance.
- [capstones/](capstones/) — Four end-to-end projects that force you to integrate across stages.

## How to run the demos

Each topic folder contains a `demo.sh`. It is a **learning artifact, not a production script** — every command is annotated with expected output and what it proves. Run it in a terminal with Docker installed:

```bash
bash demo.sh
```

Some demos in stages 3–5 require `kubectl` and an accessible cluster. The `demo.sh` in those folders will say so at the top.

## How to think about this section

Containers are the unit of modern deployment. Not the file, not the virtual machine, not the server — the container image. Once you internalize this, a lot of otherwise confusing DevOps practices click into place: why CI pipelines produce images instead of zip files, why rollbacks are fast (swap the image reference), why "it works on my machine" is a solved problem (the image carries its own runtime environment), why scaling is cheap (start another container from the same image, no provisioning lag).

The mental model shift is from "we deploy code onto servers" to "we ship immutable, self-contained units of behavior, and the platform runs as many of them as we need." Kubernetes is the platform that operationalizes this at scale. AKS is how you run Kubernetes without managing the control plane yourself.

Study this section by starting with Docker and not touching Kubernetes until stages 1 and 2 are solid. The Kubernetes API is large; the concepts are manageable only when you already understand what you are orchestrating.

## How to know you're making progress

You are making real progress when:

- You can explain why a container is not a VM, and what the performance and security implications are, in your own words without looking anything up.
- You can write a Dockerfile from scratch that uses multi-stage builds, runs as non-root, and produces a meaningfully small image.
- You can debug a container that "works locally but fails in staging" using only `docker inspect`, `docker logs`, and `docker exec`.
- You can read a Kubernetes manifest for a Deployment and explain what every field does and what happens if it is missing.
- You can describe how a request travels from an external IP address through a LoadBalancer Service to a specific Pod container port.
- You can explain what happens to your application traffic during a rolling update, and how to control the pace.
- You can set up AKS workload identity so a Pod accesses Key Vault without a stored credential.

## Question-driven orientation

### "Why containers instead of just deploying binaries?"

**Answer:** Because a container image carries the complete runtime environment — OS libraries, configuration, and your code — as a single immutable artifact. A binary depends on what is installed on the target machine.

**Explanation:** The "it works on my machine" problem is fundamentally an environment mismatch problem. Your binary might depend on a specific glibc version, a specific .NET runtime patch, a specific SSL library — things that vary silently between a developer's laptop, the CI server, and production. A container image bakes all of those dependencies in at build time. When you push that image to a registry and pull it in production, you get exactly what was tested. The artifact is the environment.

The second reason is isolation. Multiple containers can run on the same host without interfering with each other's dependencies, ports, or file systems. This lets you run dozens of services on a single machine, each pinned to its own dependency tree.

### "When does Kubernetes become worth the complexity?"

**Answer:** When you have multiple services, need zero-downtime deploys, or need to scale individual services independently.

**Explanation:** Kubernetes earns its complexity when the alternative — hand-managing container placement, restarts, and networking across multiple machines — is more complex. If you have one service on one machine, Docker Compose or Azure Container Apps is almost certainly the right answer. Kubernetes pays off when you have multiple teams shipping independent services that need to share infrastructure without stepping on each other, when you need fine-grained control over rolling updates and rollback, or when you need workload-level resource quotas and network policies.

The rule of thumb: if your team is spending meaningful time on questions like "which machine should this service run on" or "how do we ensure the new version deploys without dropping requests," Kubernetes is the answer. If those questions haven't come up yet, it probably isn't.

### "What does AKS give me that self-managed Kubernetes doesn't?"

**Answer:** A managed control plane, Azure-native integrations, and managed node upgrades — you operate the workloads, Azure operates the cluster machinery.

**Explanation:** Running Kubernetes yourself means operating etcd, the API server, the scheduler, and the controller manager — and keeping them upgraded and highly available. These are not trivial. AKS removes that responsibility: Microsoft manages the control plane, SLAs the API server uptime, and handles control plane upgrades. You pay only for the worker nodes.

Beyond the managed control plane, AKS integrates natively with Azure AD (for workload identity via OIDC federation), Azure CNI (for VNet-native pod networking), Azure Monitor (for metrics and logs), Azure Policy (for admission control), and ACR (for private image pulls via managed identity). These integrations take weeks to wire up manually on a self-managed cluster. On AKS, most are one flag.
