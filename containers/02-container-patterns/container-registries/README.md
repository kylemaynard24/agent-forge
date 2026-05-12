# Container Registries

**Area:** Container Patterns

## Intent

Store, version, and distribute container images reliably using a registry that fits your security model — and adopt a tagging strategy that makes every deployed image traceable.

## When to use

- Any time you move an image from a build machine to a runtime environment (always)
- When setting up a new CI/CD pipeline for containerized workloads
- When your team needs private image storage with access control
- When you operate across multiple regions and need consistent image availability

## Why it matters

A container registry is the distribution layer for your software. Every Kubernetes node pulls images from a registry. If your registry is slow, pod cold starts are slow. If it's unavailable, you can't scale. If it's public and your images contain proprietary code, you have a confidentiality problem. If you tag everything `:latest`, you have no idea what's running where.

The registry is also where your security posture is enforced at scale. Azure Container Registry and ECR both offer built-in vulnerability scanning — every push triggers a scan, and you can configure policies that block pulls of images with critical CVEs. That enforcement point is only effective if all your images flow through it, which means treating the registry as a required step in your pipeline rather than an optional destination.

## Core concepts

- **Docker Hub** — the default public registry; free tier allows public images and limited private repositories; appropriate for open-source projects and personal tooling; not appropriate for proprietary enterprise images
- **Azure Container Registry (ACR)** — Microsoft's managed private registry; integrates with Azure AD for authentication (service principals, managed identities, workload identity); supports geo-replication, content trust, and built-in Defender for Containers scanning
- **Amazon ECR** — AWS's equivalent; integrates with IAM; common choice for EKS workloads
- **`docker login`** — authenticates the Docker client to a registry; stores credentials in your OS credential store (or `~/.docker/config.json`); use service principals or managed identity in CI, not personal credentials
- **Service principal authentication** — an Azure AD application with a client ID and secret, granted `AcrPush` or `AcrPull` role on the registry; used in CI pipelines that don't have managed identity
- **Managed identity** — an Azure-managed credential attached to a compute resource (AKS node pool, Azure VM, GitHub Actions with federated identity); no secret to rotate or store; the preferred authentication method for production
- **Image tag** — a mutable pointer to an image digest; `myapp:latest` today may point to a different digest tomorrow; tags are not version numbers unless you treat them as such
- **Image digest** — an immutable SHA-256 hash of the image manifest; pulling by digest (`myapp@sha256:abc123`) is reproducible forever; the correct anchor for production deployments
- **Semantic versioning as tags** — `myapp:1.4.2` gives human-readable version history; combine with git SHA for full traceability: `myapp:1.4.2-a3f9c12`
- **`:latest` anti-pattern** — `:latest` means "most recently pushed image with no specific tag"; it breaks reproducibility, makes rollback ambiguous, and is indistinguishable from a known version in a running cluster
- **Garbage collection / retention policies** — ACR's retention policy auto-deletes untagged manifests (leftover from CI builds) after a configurable number of days; without it, storage costs grow unbounded and old vulnerable layers accumulate
- **Geo-replication** — ACR Premium tier feature; replicates your registry to multiple Azure regions; reduces pull latency for multi-region clusters and provides redundancy
- **`az acr run`** — executes a Docker build inside ACR's infrastructure, not on your local machine or CI agent; useful for quick builds without a dedicated build agent

## Common mistakes

- **Tagging everything `:latest`** — the single most common registry anti-pattern; when you tag every build `:latest` and it's the only tag, you lose the ability to roll back to a specific version and you can't tell what's running in prod
- **Not setting up retention policies** — CI pipelines push hundreds of untagged images per week; without retention, a registry fills up and costs spike; set a policy to delete untagged manifests older than 7 days
- **Using public Docker Hub for internal images** — Docker Hub rate limits anonymous pulls (100 pulls per 6 hours as of 2024) and your internal code is visible to anyone with the image name; use a private registry
- **Storing registry credentials in CI environment variables as plain strings** — use federated identity (GitHub Actions OIDC → Azure Workload Identity) or managed identity so there is no credential to rotate or leak
- **Not pinning image versions in Kubernetes manifests** — `image: myapp:latest` in a Deployment spec means Kubernetes pulls the latest tag on each pod restart, which can introduce unintended changes; always pin to a specific version or digest
- **Treating the registry as an archive** — a registry is a distribution layer, not a backup; your source of truth is your git repo and CI pipeline, which can rebuild any version; don't rely on the registry for long-term artifact storage

## Tiny example

A well-structured tagging convention for a release pipeline looks like this:

```
myregistry.azurecr.io/myapp:1.4.2           # semantic version — human readable
myregistry.azurecr.io/myapp:1.4.2-a3f9c12   # version + git SHA — fully traceable
myregistry.azurecr.io/myapp:latest           # floating pointer — only used in dev
```

Your Kubernetes deployment manifest references the immutable form:
```yaml
image: myregistry.azurecr.io/myapp:1.4.2-a3f9c12
```

If you need to roll back, you change the tag in the manifest and apply — Kubernetes pulls the exact image that was running before, down to the byte.

## Run the demo

```bash
bash demo.sh
```

The demo creates an ACR instance, logs in, tags and pushes an image, lists the repository, pulls by digest vs tag, and demonstrates `az acr run` for building inside ACR.

## Deeper intuition

Think of a registry like a versioned artifact store — similar to NuGet or npm, but for container images. The key insight is that a tag is just a label; the digest is the identity. When you `docker pull myapp:latest`, Docker looks up what digest the tag currently points to and pulls that. If someone pushes a new image with the same tag, the old digest still exists in the registry but the tag now points to the new one. Your running pods keep using whatever they pulled — until they restart.

This is why production deployments should always reference a digest or a pinned, immutable tag (one that your pipeline never reuses for a different build). A CI policy that prevents overwriting existing tags is a simple way to enforce this.

## Scenario questions

### Scenario 1 — "Prod is down and we need to roll back, but we don't know what image version was running"
**Question:** If you tagged everything `:latest` and don't know what was deployed, how do you find out what was running?
**Answer:** Check your Kubernetes Deployment history (`kubectl rollout history deployment/myapp`) — each revision stores the image reference used. If the image was tagged by digest, you can pull that exact digest. If not, your deployment history is your only anchor.
**Explanation:** This is why tagging matters. With `myapp:1.4.2-a3f9c12`, you know exactly what commit built the image. With `myapp:latest`, you know nothing. After an incident involving `:latest`, the first infrastructure change is usually a CI policy that generates version+SHA tags for every build.

### Scenario 2 — "ACR storage costs tripled this month and nobody knows why"
**Question:** What is the most likely cause and how do you fix it?
**Answer:** CI is pushing untagged image manifests on every commit and they're accumulating. Untagged manifests are leftover intermediate layers and build cache that aren't referenced by any named tag. Set up an ACR retention policy: `az acr config retention update --registry <name> --status enabled --days 7 --type UntaggedManifests`.
**Explanation:** Every `docker build` that fails, every intermediate layer from a multi-stage build, and every image pushed without a tag contributes to this. A 7-day retention policy cleans up the debris automatically. Retention policies are free to configure and should be one of the first things you set up when creating an ACR.
