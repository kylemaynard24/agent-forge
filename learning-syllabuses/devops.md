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

> Levels 2 and 3 each include a **Deeper reading** column for practitioners who want to go past the canonical doc — specific MS Learn modules, doc sections, recommended chapters, and patterns worth your time.

| # | Topic | Canonical resource | Deeper reading | Deliverable for `implement` |
|---|---|---|---|---|
| 1 | Bicep modules + parameters | Bicep docs — *Modules*, *Parameters and outputs* | MS Learn — *Structure your Bicep code for collaboration* (path); read the `bicepconfig.json` docs for linter rules; skim 2–3 [Azure Verified Modules](https://aka.ms/avm) to see professional module patterns; *Infrastructure as Code, Patterns and Practices* (Morris) ch. on modules. | Refactor your Level-1 Storage Account into a module taking `name`, `location`, `sku`, `tags`. Call it from `main.bicep` to deploy two storage accounts (e.g., dev + prod tier). Bonus: add a `bicepconfig.json` with the linter at `error` for `no-hardcoded-location`. |
| 2 | Bicep outputs + resource references + `existing` | Bicep docs — *Outputs*, *Resource declarations*, *Existing resources* | MS Learn — *Manage changes to Bicep code by using Git*; doc page on **expression scope** (subscription / resourceGroup / managementGroup); read about loops, conditions, and child resources. | Deploy a Key Vault and a Storage Account in the same Bicep file; output the Storage account's connection string into a Key Vault secret. Add a second template that references the Key Vault as `existing` and reads the secret. |
| 3 | Multi-stage Dockerfiles + image hardening | Docker docs — *Multi-stage builds*, *Best practices for writing Dockerfiles* | Read about distroless / `chainguard` / Microsoft `mcr.microsoft.com` minimal base images; the [BuildKit](https://docs.docker.com/build/buildkit/) docs (cache mounts, secret mounts); *Docker Deep Dive* (Poulton) ch. on images. | Take a real app of yours; write a multi-stage Dockerfile. Compare image sizes before/after, and run `docker scout` (or Trivy) to compare CVE counts. Aim for ≥50% size reduction without losing functionality. |
| 4 | Docker Compose for local dev (and its limits) | [Docker Compose docs](https://docs.docker.com/compose/) | Read *profiles*, *depends_on conditions*, *named volumes*; understand when Compose stops being enough (the answer is "the moment a teammate asks you to deploy it"); compare with `docker compose --project-name` for parallel envs. | Stand up a 2-container local stack mirroring something you actually run (e.g., your app + Postgres or Redis). Use a profile so `compose up` brings only the app, `compose --profile full up` brings everything. Document one limitation that makes Compose unsuitable for prod. |
| 5 | Azure Container Registry (ACR) — auth, retention, geo-replication | Azure docs — *Container Registry overview*, *Authentication options*, *Retention policy* | Read about **ACR Tasks** (in-cloud builds without local Docker), repository-scoped tokens, content trust / image signing (relates to Level 4 supply chain). Doc: *Use Azure Container Registry with Container Apps*. | Create an ACR via Bicep with a retention policy (untagged images deleted after 7 days). Build your image locally, `az acr login` (managed-identity auth, not admin user), push it. Then build the same image **in ACR** with `az acr build` and compare. |
| 6 | GitHub Actions: secrets, environments, OIDC to Azure | [GitHub Actions OIDC for Azure](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure) | The full GitHub Actions *Security hardening* guide; the `azure/login` action README; understand **federated credentials** at the AAD app level (subject claim format, tenant scoping); read about reusable workflows + composite actions. | Set up federated credentials so a workflow can `az login` without storing a service principal secret. Workflow runs `az group list` to prove auth works. Bonus: scope the federated credential to a specific environment (e.g., `prod`) so PR workflows can't accidentally use prod creds. **Never use static SP secrets again.** |
| 7 | End-to-end build → push → deploy pipeline | Multiple — combines above | MS Learn — *Build and deploy applications by using Azure Container Apps and GitHub Actions* (full path); read about **Container Apps revisions and traffic splitting** (sets up Level 4 canary work); *Continuous Delivery* (Humble/Farley) chs. 5–6 (deployment pipeline). | A single workflow on push to main: checkout → docker build (with cache) → push to ACR (digest, not tag) → `az containerapp update --image <digest>` to roll the new revision. From `git push` to running app, zero manual steps. Document the workflow's failure modes (what happens if ACR is down? if the new image fails health check?). |

**Level capstone:** put a small real app of yours behind this pipeline. Bicep-deploy the infra (ACR + Container Apps env + Container App + Log Analytics workspace). Workflow deploys on every push. Document the pipeline with a sequence diagram showing every step from `git push` to traffic served. Include the `az` commands and the AAD federated-credential subject string in the doc.

---

## Level 3 — Advanced: Production patterns (you can run a real app reliably)

You make informed compute choices, never put secrets in code, monitor what you ship, network it correctly, and respect the bill.

| # | Topic | Canonical resource | Deeper reading | Deliverable for `implement` |
|---|---|---|---|---|
| 1 | Compute choice: App Service vs Container Apps vs AKS vs Functions vs Container Instances | Azure docs — *Choose a compute service decision tree*; *Compare Azure container options* | Read each service's pricing page side by side; the *Container Apps networking* doc to understand VNet integration trade-offs; AKS's *cluster autoscaler* doc to understand the operational overhead you avoid by NOT picking AKS; *Microservices Patterns* (Richardson) ch. 3 (deployment patterns). | Write a 1-page comparison for **your specific app** with a recommendation. Address: cold-start tolerance, scaling pattern (request-driven vs continuous), ops burden, networking needs (do you need a VNet?), pricing at expected load. Defend rejecting each of the others in 1–2 sentences. |
| 2 | Key Vault + managed identities (system-assigned vs user-assigned) | Azure docs — *Key Vault*, *Managed identities for Azure resources* | Read about **workload identity** for AKS / Container Apps; the *Azure SDK* docs on `DefaultAzureCredential` and credential chain order; secret rotation patterns; the difference between Key Vault data-plane and management-plane RBAC. | Migrate one secret-from-config in your app to Key Vault accessed via a user-assigned managed identity (UA is more portable than SA). Verify the app can no longer read the secret if you remove the identity. Bonus: rotate the secret and verify the app picks up the new value within N minutes. |
| 3 | Bicep `what-if` + CI integration + drift detection | Bicep docs — *Deployment what-if*; *Detect changes in Azure resources with what-if* | Read about **deployment stacks** (the deny-deletion pattern that makes Bicep state more like Terraform); *Terraform: Up & Running* (Brikman) chs. on plan/apply for a comparison framing; the difference between what-if's `Modify` and `Ignore` reasons. | Add a workflow job that runs `az deployment group what-if` on PRs touching `infra/`. The PR description should show the planned diff (post a comment via `actions/github-script`). Bonus: add a scheduled workflow that runs `what-if` against prod weekly to detect drift. |
| 4 | Azure Monitor + Application Insights + Log Analytics + KQL | Azure docs — *Monitor overview*, *Application Insights overview*, *Log Analytics tutorial* | Spend real time in **KQL**: read the Kusto query language reference, focus on `summarize`, `bin`, `extend`, `join`. Read *Site Reliability Engineering* (Google) chs. 5–6 (monitoring distributed systems, SLI/SLO). The *Azure Workbooks* docs to build a real dashboard. | Wire App Insights into one running service (auto-instrumentation if the SDK supports it; manual tracing if not). Define one **custom metric** you actually care about (e.g., `checkout_completed_per_minute`). Build a Workbook with: that custom metric, p50/p95/p99 latency, error rate, and dependency call duration. Set one alert rule. |
| 5 | Azure Policy + governance + initiatives | Azure docs — *Policy overview*, *Tutorial: Create a custom policy*, *Initiative definition* | Read about **policy effects** (`Audit` vs `Deny` vs `DeployIfNotExists` vs `Modify` — the last two are powerful and dangerous); browse the [built-in policy index](https://learn.microsoft.com/en-us/azure/governance/policy/samples/built-in-policies); read 2–3 published [Azure landing zone](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/) policy sets. | Author a custom policy (or pick a built-in one) that **denies** creation of public-IP Storage Accounts. Assign it to a sandbox RG. Try to create a violating resource — confirm it's blocked. Bonus: build an **initiative** combining 3–5 related policies (e.g., a "secure storage baseline"). |
| 6 | Networking: VNet, subnets, private endpoints, NSGs, service endpoints | Azure docs — *Virtual Network overview*, *Private Link*, *Network Security Groups*, *VNet integration* | Understand **service endpoint** (cheaper, less secure) vs **private endpoint** (more secure, more expensive, more complex DNS); read about **Azure Private DNS Zones** — the part most people get wrong; *Designing Data-Intensive Applications* (Kleppmann) ch. 8 for distributed-system networking concepts. | Convert one PaaS resource (Storage Account, Key Vault, or SQL DB) from public-access to private endpoint. Set up the matching Private DNS Zone. Verify access only works from a VM in the VNet (not from your laptop). Document the DNS resolution chain explicitly. |
| 7 | Ingress: Front Door / Application Gateway / Container Apps ingress | Azure docs — *Front Door*, *Application Gateway*, *Choose a load-balancing service* | Read the comparison table of all five Azure load balancers (Front Door, AppGW, Load Balancer, Traffic Manager, Container Apps ingress); read about **WAF rule sets** (OWASP CRS); the *TLS termination* docs for each option; learn what an **edge POP** is and why latency to your nearest one matters. | Put Front Door in front of one of your apps. Configure WAF in **detection** mode (not prevention; you don't want to break prod yet). Verify a deliberate XSS attempt is logged in the WAF logs. Document your rule-tuning plan to move from detection to prevention. |
| 8 | Cost management + tagging strategy + budgets + reservations | Azure docs — *Cost Management overview*, *Tagging best practices*, *Reservations overview* | Read about **savings plans** vs **reservations** vs **spot pricing**; the *FinOps Foundation* framework (free reading at finops.org); the *Azure pricing calculator* hands-on for one of your real workloads; read about **cost allocation** for shared resources. | Tag every resource in one RG with `owner`, `env`, `cost-center`, `app-id`. Set a budget alert at 80% of expected spend. Identify your top-3 most expensive resources and write a 1-paragraph plan to reduce each (rightsizing, reservation, scheduling, retention). Bonus: model the savings of a 3-year reservation for one workload. |
| 9 | Multi-environment deploys (dev / staging / prod) — promotion patterns | Bicep + GitHub Actions environments | MS Learn — *Build a multi-environment deployment pipeline by using Azure Pipelines* (translates well to GHA); read about **GitHub environments** with required reviewers + wait timers; the *trunk-based development* literature (DORA / *Accelerate*); read 1–2 published **landing zone** designs for org-scale multi-env structure. | Use Bicep parameter files + GitHub environments to deploy the same template to dev (auto on PR merge), staging (auto on tag), and prod (manual approval with a 5-minute wait). Document the promotion flow with a diagram. Bonus: implement "promote by digest" — staging deploys a tagged image, prod deploys the **same digest** that passed staging. |

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
