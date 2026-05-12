# Container Patterns

Build images that are small, secure, and production-ready.

This section comes **after** Docker basics — you know how to build images, now learn to build them well for production. Writing a Dockerfile that works on your laptop is easy. Writing one that ships safely, scans clean, and pulls fast from a registry halfway around the world takes deliberate pattern application.

## Contents

- [multi-stage-builds/](multi-stage-builds/) — Separate your build environment from your runtime image to slash final image size and attack surface
- [image-security/](image-security/) — Run as non-root, scan for CVEs, use minimal base images, and keep secrets out of layers
- [container-registries/](container-registries/) — Push, pull, tag, and manage images in Docker Hub, ACR, and ECR with production-grade hygiene

## How to use this section

Each topic has three artifacts:
1. **`README.md`** — the concept and why it matters
2. **`demo.sh`** — annotated shell commands you can run
3. **`homework.md`** — a constrained exercise

## How to know this section is working

- You can explain why a multi-stage build reduces image size and surface area, not just recite the syntax
- You run `trivy image` or `docker scout cves` on everything you build before calling it done
- You never tag an image `:latest` for anything that goes to production, and you can articulate why

## Question-driven orientation

### Scenario 1 — "The security team rejected our container image in the pipeline"
**Question:** The scanner flagged 47 HIGH vulnerabilities and the image runs as root. Where do you start?
**Answer:** Switch the base image first (ubuntu:latest → mcr.microsoft.com/dotnet/aspnet:8.0-alpine or a chiseled image), rerun the scan, then add a `USER` instruction for a non-root account.
**Explanation:** Most vulnerabilities live in OS packages pulled in by fat base images. Cutting to a minimal base often eliminates 80% of findings in one move. The root-user fix is a one-liner but matters for defense in depth — a container escape is far worse when the process owns PID 1 as root.

### Scenario 2 — "Our Docker images are 1.8 GB and pulls are timing out in staging"
**Question:** How do you shrink a .NET API image from 1.8 GB to under 200 MB without changing the application code?
**Answer:** Introduce a multi-stage Dockerfile: one stage uses the SDK image to compile and publish, a second stage uses only the ASP.NET runtime image and copies the publish output.
**Explanation:** The SDK ships compilers, NuGet cache tooling, and build dependencies — none of which belong in a running container. The runtime image is the executable foundation only. That single architectural change typically cuts .NET images by 70–80%.

### Scenario 3 — "Someone accidentally pushed an image tagged :latest and now we can't tell what version is in prod"
**Question:** How do you reconstruct what's actually running, and how do you prevent this going forward?
**Answer:** Pull by digest (`docker pull myregistry.azurecr.io/myapp@sha256:abc123`), inspect the image labels for build metadata. Going forward, tag by git SHA and semantic version, never push bare `:latest` to production registries, and enforce this in CI.
**Explanation:** A digest is immutable — a tag is a mutable pointer. When you pull by digest you know exactly what you're getting. A tagging convention like `v1.4.2-a3f9c12` gives you both human readability and git traceability.
