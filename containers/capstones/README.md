# Capstones

Each capstone is a complete real-world task. Do them in order — each one builds on the previous.

| # | Title | Focus Area | Estimated Time | Prerequisites |
|---|-------|------------|----------------|---------------|
| 1 | [Containerize a .NET API with Docker Compose](01-containerize-dotnet-api/) | Docker, multi-stage builds, Compose | ~3 hours | Stages 1–2 |
| 2 | [Deploy to AKS with Kubernetes Manifests](02-deploy-to-aks/) | AKS, Deployments, Services, Secrets | ~4 hours | Stages 1–3 + Capstone 1 |
| 3 | [Harden for Production — Health, Limits, Autoscaling, Ingress](03-production-hardening/) | Health checks, HPA, Ingress, NetworkPolicy | ~4 hours | Stages 1–4 + Capstone 2 |
| 4 | [Full GitOps Pipeline with Helm + Flux](04-gitops-pipeline/) | Helm, Flux, image automation | ~5 hours | All stages + Capstones 1–3 |

## How capstones work

Each capstone gives you a realistic engineering scenario with a clear deliverable. You are expected to produce working infrastructure — not just read about it. The step-by-step guide provides commands, but you need to adapt them to your environment, debug failures, and understand why each step exists.

The stretch goals are where the real learning happens. Do at least one stretch per capstone.

Every capstone includes a teardown section. **Always run teardown after finishing.** Real Azure resources cost real money. A 3-node AKS cluster left running overnight costs more than a textbook.

## What success looks like

After completing all four capstones, you will have:
- A multi-stage Dockerfile for a production .NET API (no root user, minimal image, vulnerability-scanned)
- A complete Kubernetes manifest set deployed to AKS (Namespace, Deployment, Service, ConfigMap, Secret, ResourceQuota)
- A hardened production deployment (probes, limits, HPA, PDB, Ingress with TLS, NetworkPolicy, securityContext)
- A GitOps pipeline (Helm chart, Flux bootstrap, automated image updates, multi-environment values)

This is a complete container platform story — from local Docker file to GitOps-managed AKS production deployment.
