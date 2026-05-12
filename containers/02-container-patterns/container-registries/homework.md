# Homework — Container Registries

> Tagging an image `:latest` is like naming a file `final_v2_FINAL.docx` — it tells you nothing and breaks when you need it most.

## Exercise: Production-Ready ACR Setup with Git-SHA Tagging

**Scenario:** Your team is migrating a .NET web application from a shared Docker Hub account (where images have been tagged `:latest` for two years) to Azure Container Registry. You need to establish a tagging convention the whole team can follow, set up retention to control costs, and prove that your deployed images are always traceable back to a specific git commit.

**Build:**

1. Create an Azure Container Registry (Basic SKU for the exercise, Premium for stretch)
2. Build any small container image (can reuse the multi-stage image from the previous exercise, or build a new minimal one)
3. Tag it using the convention: `<registry>.azurecr.io/<app>:<semver>-<git-sha>` (e.g., `myapp:1.0.0-a3f9c12`)
4. Push the tagged image — do NOT push a `:latest` tag
5. Pull the image by its digest (not its tag)
6. Set up a retention policy to auto-delete untagged manifests older than 7 days

**Constraints:**
- The image tag must include a git SHA (use `git rev-parse --short HEAD` to get it, or fabricate a plausible 7-character hex string if you're not in a git repo)
- The image must NOT be pushed with a `:latest` tag — the exercise is specifically about breaking that habit
- The digest pull must succeed: `docker pull <registry>.azurecr.io/<app>@sha256:<digest>`
- Capture and include `az acr repository show-tags` output as proof
- Authentication must use `az acr login` (or a service principal) — not the admin account

**Document these three things in a short text file or inline in your notes:**
- The full image reference you would put in a Kubernetes Deployment manifest (by digest)
- How you would authenticate to this ACR from a GitHub Actions pipeline without storing credentials (hint: workload identity federation / OIDC)
- What `az acr config retention update` command you ran and what it protects against

## Stretch 1: Geo-Replication to a Second Region
Upgrade your ACR to Premium SKU and enable geo-replication to a second region (`westus2` or `westeurope`). Pull the same image from both regions and measure the latency difference. Document: what Kubernetes configuration change is needed to use a geo-replicated registry transparently (hint: the registry hostname stays the same, and ACR routes to the nearest replica automatically)?

## Stretch 2: Registry-Level Vulnerability Scanning
Enable Microsoft Defender for Containers on your ACR (`az acr update --name <name> --sku Standard` is the minimum for scanning). Push your image and then check the scan results: `az acr task list-runs` and review the Defender for Cloud findings in the Azure portal. Set up an alert that notifies you when a new critical CVE is found in an image already in the registry.

## Reflection

- You pushed `myapp:1.0.0-a3f9c12` and then your teammate pushed `myapp:1.0.0-a3f9c12` again with a different binary (they forgot to commit a change). What happened to the old image? How would you prevent this?
- Your Kubernetes cluster is in `eastus` and your registry is in `westus`. What is the impact on pod startup time for large images? What ACR feature addresses this?
- A developer argues that tagging by git SHA is enough — they don't need a semantic version. In what situation does the semantic version tag provide value that the SHA tag doesn't?

## Done when

- [ ] ACR is created and accessible via `az acr repository list`
- [ ] Image is pushed with a version+SHA tag (e.g., `1.0.0-a3f9c12`)
- [ ] No `:latest` tag exists in the repository (`az acr repository show-tags` confirms this)
- [ ] Image was pulled by digest successfully (`docker pull <registry>@sha256:...`)
- [ ] Retention policy is set to auto-delete untagged manifests after 7 days
- [ ] Kubernetes manifest snippet with digest reference is written
- [ ] ACR authentication strategy for CI (no stored secrets) is documented

---

## Clean Code Lens

**Principle in focus:** Explicit over Implicit

In code, implicit behavior (magic defaults, hidden state, convention over documentation) is a maintenance liability. The `:latest` tag is the most visible example of implicit behavior in container infrastructure — it silently points to whatever was last pushed, changes without notice, and carries no information about what it contains or when it was built.

Every implicit convention in a registry creates a question you can't answer during an incident. "What's running in prod?" should have a precise, mechanical answer: look at the Deployment manifest, read the tag or digest, trace it to a git commit, reproduce the exact build. With `:latest`, that chain breaks at the first step. With `myapp:1.4.2-a3f9c12`, you can `git checkout a3f9c12` and reproduce the exact binary within minutes.

Explicit tagging is also a form of documentation. When you see `myapp:1.4.2-a3f9c12` in a Kubernetes manifest, you know the version, you know the commit, and you know that someone deliberately chose to deploy this exact artifact. When you see `myapp:latest`, you know nothing — not even whether `:latest` was intentional or an oversight.

**Exercise:** Write a CI pipeline snippet (GitHub Actions YAML or Azure DevOps YAML) that automatically generates a version+SHA tag on every push to `main`, builds and pushes the image with that tag, and explicitly rejects the push if the tag already exists in the registry.

**Reflection:** Your team has 15 microservices, each with independent versioning. How do you enforce the no-`:latest` policy without reviewing every pipeline manually? What tooling (policy, CI check, registry rule) would catch violations automatically?
