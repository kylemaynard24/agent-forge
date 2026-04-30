# DevOps (Azure shop) — master syllabus (beginner → expert)

Source of truth for the `daily-tasks` skill. Walks you from "I can find a resource group in the portal" to "I design and run the entire delivery pipeline for a real Azure product." Focused on the **Azure-native toolchain** — Bicep, GitHub Actions, Azure resources, the portal, and Docker — rather than cloud-agnostic generalities.

> No backing repo content. Unlike the other three subjects, there is no `devops/` directory in this repo with READMEs/demos/homework. Each topic links to canonical official docs (Microsoft Learn, GitHub Actions docs, Docker docs) and gives a deliverable. The skill treats every topic as "external" — implement step uses the deliverable verbatim.

For each topic the canonical step order is **read → demo → implement**:

- **read** — work through the linked official doc / Microsoft Learn module.
- **demo** — walk through the official tutorial step-by-step, executing every command yourself in your sandbox subscription. Don't skim screenshots — actually click and type.
- **implement** — apply the topic to a small original problem of yours: create a real resource you'd actually want, with proper naming/tagging/cleanup. Save artifacts (Bicep file, workflow YAML, Dockerfile, screenshots if applicable) to `devops/_solutions/applied/<topic>/<YYYY-MM-DD>/`.

A topic typically spans **2–4 days** at part-time pace.

The skill picks the next topic by `(level, index)` in `state.md`. When a topic's `implement` step is done, advance the index by 1; when the index passes the level's last topic, advance the level.

> **Sandbox requirement:** all hands-on work assumes you have an Azure subscription you can deploy to (work sandbox or personal free trial) and a GitHub account. Some topics need an Azure Container Registry; some need a custom domain. Cost-conscious: tear down resources at the end of each session — the apply task should always include "and run `az group delete` when done."

---

## Level 1 — Beginner: Foundations (you can find your way around)

You can navigate the portal, write a one-resource Bicep file, ship a hello-world container, and trigger a GitHub workflow.

| # | Topic | Canonical resource | Deliverable for `implement` |
|---|---|---|---|
| 1 | Azure resource model + portal tour | Microsoft Learn — *Azure Fundamentals* learning path; [Azure docs root](https://learn.microsoft.com/en-us/azure/) | Document your subscription's structure: list resource groups, regions, top 5 services in use; identify any resources without tags or with vague names. ~1-page note. |
| 2 | Azure CLI basics | [az CLI docs](https://learn.microsoft.com/en-us/cli/azure/) | Without using the portal, create a resource group, deploy a Storage Account into it, list its blobs (empty), then delete the RG. All from `az` commands. Capture the script. |
| 3 | Your first Bicep file | [Bicep docs root](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/); MS Learn — *Bicep fundamentals* | Write a 30-line `main.bicep` that creates one Storage Account with parameterized name + location. `az deployment group create` it into a fresh RG. Tear down after. |
| 4 | Docker fundamentals (image vs container) | [Docker docs — get-started](https://docs.docker.com/get-started/) | Write a 5-line Dockerfile for a "hello world" Node or Python app. `docker build`, `docker run`, `docker exec` into a running container, `docker logs`. |
| 5 | Your first GitHub Actions workflow | [GitHub Actions docs root](https://docs.github.com/en/actions) | Add `.github/workflows/hello.yml` to a sandbox repo. Triggers on push. One job, two steps: checkout + echo. Push and watch it run. |

**Level capstone:** in a sandbox subscription, manually deploy (via portal) a Linux App Service running a Docker hello-world image from Docker Hub. Document each click. Then tear it down. The point isn't the app — it's that you can navigate the portal end-to-end without getting lost.

---

## Level 2 — Intermediate: Composable infrastructure (you can ship a Dockerized app via CI/CD)

You can write modular Bicep, build multi-stage Docker images, wire OIDC-based GitHub→Azure auth, and run a build → push → deploy pipeline.

| # | Topic | Canonical resource | Deliverable for `implement` |
|---|---|---|---|
| 1 | Bicep modules + parameters | Bicep docs — *Modules*, *Parameters and outputs* | Refactor your Level-1 Storage Account into a module taking `name`, `location`, `sku`. Call it from `main.bicep` to deploy two storage accounts (e.g., for two environments). |
| 2 | Bicep outputs + resource references | Bicep docs — *Outputs*, *Resource declarations* | Deploy a Key Vault and a Storage Account in the same Bicep file; output the Storage account's connection string into a Key Vault secret. Verify in the portal. |
| 3 | Multi-stage Dockerfiles | Docker docs — *Multi-stage builds* | Take a Node/Python/Go app of yours; write a multi-stage Dockerfile (build stage with all tools, runtime stage with minimal base). Compare image sizes before/after. |
| 4 | Docker Compose for local dev | [Docker Compose docs](https://docs.docker.com/compose/) | Stand up a 2-container local stack (e.g., your app + Postgres). `docker compose up`, hit it with curl, `docker compose down`. Save the compose file. |
| 5 | Azure Container Registry (ACR) | Azure docs — *Container Registry* | Create an ACR via Bicep. Build your image locally, `az acr login`, push it. Pull it back from ACR to verify. |
| 6 | GitHub Actions: secrets, environments, OIDC to Azure | [GitHub Actions OIDC for Azure](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure) | Set up federated credentials so a workflow can `az login` without storing a service principal secret. Workflow runs `az group list` to prove auth works. NEVER use static service principal credentials again. |
| 7 | End-to-end build → push → deploy pipeline | Multiple — combines above | A single workflow on push to main: checkout → docker build → docker push to ACR → `az containerapp update` (or App Service) to roll the new image. From your laptop to running app, no manual steps. |

**Level capstone:** put a small real app of yours behind this pipeline. Bicep-deploy the infra (ACR + Container Apps env + Container App). Workflow deploys on every push. Document the pipeline with a sequence diagram showing every step from `git push` to traffic served.

---

## Level 3 — Advanced: Production patterns (you can run a real app reliably)

You make informed compute choices, never put secrets in code, monitor what you ship, network it correctly, and respect the bill.

| # | Topic | Canonical resource | Deliverable for `implement` |
|---|---|---|---|
| 1 | Compute choice: App Service vs Container Apps vs AKS vs Functions | Azure docs — *Choose a compute service* | Write a 1-page comparison for **your specific app** with a recommendation. Address: cold start tolerance, scaling pattern, ops burden, networking needs. Defend rejecting the others. |
| 2 | Key Vault + managed identities | Azure docs — *Key Vault*, *Managed identities for Azure resources* | Migrate one secret-from-config in your app to Key Vault accessed via managed identity. Verify the app can no longer read the secret if you remove the identity. |
| 3 | Bicep `what-if` + CI integration | Bicep docs — *Deployment what-if* | Add a workflow job that runs `az deployment group what-if` on PRs to main. PR description should show the planned diff. |
| 4 | Azure Monitor + Application Insights + Log Analytics | Azure docs — *Monitor*, *Application Insights* | Wire App Insights into one running service (auto-instrumentation OK). Define one custom metric you actually care about. Build a Workbook or dashboard with that metric + p95 latency + error rate. |
| 5 | Azure Policy + governance basics | Azure docs — *Policy* | Author a custom policy (or pick a built-in one) that **denies** creation of public-IP Storage Accounts. Assign it to a sandbox RG. Try to create a violating resource — confirm it's blocked. |
| 6 | Networking: VNet, private endpoints, NSGs | Azure docs — *Virtual Network*, *Private Link* | Convert one PaaS resource (Storage Account, Key Vault, or DB) from public-access to private endpoint. Verify access only works from a VM in the VNet. |
| 7 | Ingress: Front Door / Application Gateway | Azure docs — *Front Door*, *Application Gateway* | Put Front Door in front of one of your apps. Configure WAF in detection mode. Verify a deliberate XSS attempt is logged. |
| 8 | Cost management + tagging strategy | Azure docs — *Cost Management*, *Tagging* | Tag every resource in one RG with `owner`, `env`, `cost-center`. Set a budget alert. Identify your top-3 most expensive resources and write a 1-paragraph plan to reduce each. |
| 9 | Multi-environment deploys (dev / staging / prod) | Bicep + GitHub Actions environments | Use Bicep parameter files + GitHub environments to deploy the same template to dev (auto on PR merge) and prod (manual approval). Document the promotion flow. |

**Level capstone:** take one of your real apps, do a full production-readiness pass: IaC for everything, secrets in Key Vault, App Insights wired, budget alert set, runbook for "the most likely incident" written. Honest gap analysis at the end — where you'd still be uncomfortable being on call.

---

## Level 4 — Expert: Production-grade DevOps (extends beyond official docs)

You design and own the entire delivery system for a real product with reliability, security, and cost guarantees.

| # | Topic | Resource / source | Deliverable |
|---|---|---|---|
| 1 | Bicep registries + module versioning | Bicep docs — *Module registry*; [Azure Verified Modules](https://aka.ms/avm) | Publish one of your modules to an ACR-hosted Bicep registry with a semver tag. Consume it from a separate template. |
| 2 | Blue-green / canary deploys on Azure | Azure docs — App Service deployment slots, Container Apps revisions, Front Door traffic splitting | Implement canary on one app: deploy new revision to 10% traffic via Front Door, monitor App Insights, ramp to 100% or rollback by config change. |
| 3 | Disaster recovery + backup strategy | Azure docs — *Business continuity*, paired regions | Pick one app. Document its RPO/RTO targets. Write the runbook to recover from a regional outage; do a tabletop exercise. |
| 4 | Defender for Cloud + secret rotation | Azure docs — *Defender for Cloud*, Key Vault rotation policies | Enable Defender's free tier; address every "high" finding in a sandbox sub. Configure auto-rotation for one Key Vault secret consumed by an app. |
| 5 | AKS deep dive | Azure docs — *AKS*; [Flux/ArgoCD](https://fluxcd.io/) for GitOps | Deploy an AKS cluster via Bicep with cluster autoscaling + workload identity. Bootstrap Flux to GitOps-deploy one app from a Git repo. Tear down when done — AKS is not free. |
| 6 | Supply chain security (SBOM, image signing) | Docker docs — *SBOM*; [Cosign](https://github.com/sigstore/cosign), [Notation](https://github.com/notaryproject/notation) | Generate an SBOM for one of your container images. Sign the image with Cosign. Verify the signature from a deployment workflow before allowing rollout. |
| 7 | Read & contribute to a real Bicep library | [Azure Verified Modules](https://aka.ms/avm) repo | Read 2–3 AVM modules end-to-end. Either open a small PR (typo, doc fix, test) or write a 1-page synthesis of the module patterns you observed. |
| 8 | External — read *The DevOps Handbook* (Kim et al.) — write 1-page synthesis | external | Deliverable in `devops/_solutions/external/devops-handbook-synthesis.md` |
| 9 | External — read *Accelerate* (Forsgren/Humble/Kim) — write 1-page synthesis on the four key metrics for your team | external | Deliverable in `devops/_solutions/external/accelerate-synthesis.md` |
| 10 | Original capstone — design and ship a production-grade Azure app end-to-end | external | Deliverable: design doc + working IaC + working pipeline + observability dashboard + incident runbook + cost model. Documented SLA with rationale. Honest "what I'd do differently" retro. |

For external topics: no doc URL — the deliverable IS the work. Multi-day implement is fine; the skill will give you a sub-goal per day.

---

## Reading alongside

Pick one or two; don't try to read all:

- *The DevOps Handbook* — Kim/Humble/Debois/Willis (Levels 2–4)
- *Accelerate* — Forsgren/Humble/Kim (Level 3+, the metrics that actually matter)
- *Site Reliability Engineering* (Google) — chapters of your choice (Level 3+)
- Microsoft Learn — *AZ-104* (administrator) and *AZ-400* (DevOps engineer) study paths if you want exam-driven structure

---

## Working notes

- **Tear down what you stand up.** Every apply task ends with a cleanup step. Cost is the silent killer of sandbox learning.
- **Use a separate sandbox subscription** if at all possible — never experiment in prod, even your team's prod.
- **Default to managed services.** AKS is a powerful learning topic but App Service / Container Apps cover 80% of real workloads with 20% of the operational burden.
- **The portal is for learning and incident response**, not for daily ops. Once you understand a resource via the portal, write the Bicep that creates it and switch to that.
- **Skip topics that don't apply.** If your team doesn't use AKS, the AKS topic is reading reference, not homework.
