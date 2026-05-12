# Image Security

**Area:** Container Patterns

## Intent

Build container images that are hardened by default — minimal attack surface, no privileged processes, no embedded secrets, and a known vulnerability posture before anything reaches a registry.

## When to use

- Every image that will run in production (this is not optional)
- Before pushing any image to a shared or public registry
- When a security audit or compliance framework (SOC 2, PCI DSS, CIS benchmarks) applies to your workloads
- When setting up a new CI/CD pipeline for containerized applications

## Why it matters

A container image is not just packaging — it's a trust boundary. When you run an image in production, you're asserting that everything inside it is intentional and known. An image that runs as root means that if an attacker achieves code execution in your application, they also own the container file system and potentially the host if kernel namespacing is misconfigured. An image built from `ubuntu:latest` means your vulnerability posture is a surprise every time you pull — because `:latest` moves and its CVE count is not your concern until something breaks.

The cost of getting this wrong is high and delayed. A secret baked into a Docker layer looks harmless until someone runs `docker history` or pushes to a public registry. A base image with a critical OpenSSL CVE is invisible until your scanner runs, at which point the image may already be in prod. Image security is cheap upfront and expensive to retrofit.

## Core concepts

- **`USER` instruction** — sets the user (by name or UID) that subsequent `RUN`, `CMD`, and `ENTRYPOINT` instructions execute as; add it after all package installation steps and before `ENTRYPOINT`
- **Non-root user creation** — typically `RUN adduser --disabled-password --gecos "" appuser && USER appuser`; in distroless images a numeric UID like `USER 65532` is used because there's no `adduser`
- **Read-only filesystem** — `docker run --read-only` mounts the container root as read-only; combine with `--tmpfs /tmp` for any write paths the app needs; prevents an attacker from dropping files into the container
- **Minimal base images** — `alpine` (5 MB, musl libc), `distroless` (Google's no-shell, no-package-manager images), `chiseled` (Canonical's Ubuntu-based equivalent); each trades convenience for attack surface
- **`trivy`** — Aqua Security's open-source scanner; `trivy image <name>` scans a local or remote image for OS and library CVEs
- **`docker scout`** — Docker's built-in scanner (requires Docker Desktop or Hub login); `docker scout cves <image>` produces a similar report
- **Vulnerability patching cadence** — you need a process to rebuild images on a schedule (weekly is common) or when a base image update lands with a critical CVE patch; "build once and forget" is not a security posture
- **Build args vs runtime env for secrets** — `ARG` values appear in `docker history` and are baked into the layer cache key; never pass secrets via `ARG` or `ENV`; pass them at runtime via orchestrator secret injection or a secrets store
- **Content trust / image signing** — `docker trust` (Notary v1) or Sigstore/cosign (Notary v2); signing asserts that a specific digest was produced by a known key; useful for supply chain integrity verification
- **`docker history`** — shows every layer in an image with the command that created it; a quick way to spot accidentally baked secrets or `RUN curl | bash` patterns

## Common mistakes

- **Running as root in production** — the default for almost every base image; Docker does not set a non-root user unless you explicitly do so; every container in prod should have a `USER` instruction
- **Baking secrets into `ENV`** — `ENV DB_PASSWORD=supersecret` persists in every derived image and is visible to anyone who can run `docker inspect`; use runtime environment injection or a secrets manager
- **Using `ubuntu:latest` or `debian:latest` as a base** — `:latest` is a moving target with no guaranteed vulnerability posture; these fat images carry hundreds of packages your app doesn't need; pin to a digest or use a minimal base
- **Never scanning images** — teams that add scanning later discover they've been shipping critical CVEs for months; integrate `trivy` or `docker scout` into the CI pipeline before the push step
- **Using `RUN curl ... | bash` to install dependencies** — downloads and executes untrusted code at build time with no verification; prefer package manager installs with pinned versions
- **Ignoring `docker history` before pushing** — a quick `docker history --no-trunc <image>` before any public push can catch accidentally embedded credentials or tokens

## Tiny example

Here is a deliberately insecure Dockerfile and its secure equivalent side by side:

```dockerfile
# INSECURE
FROM ubuntu:latest
RUN apt-get update && apt-get install -y python3
ENV SECRET_KEY=abc123supersecret
COPY app.py /app/
WORKDIR /app
CMD ["python3", "app.py"]
```

```dockerfile
# SECURE
FROM python:3.12-slim AS base

# Install only what the app needs, pinned, no caches left behind
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5=15.* \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .

# Non-root user — created after all installs
RUN adduser --disabled-password --gecos "" appuser
USER appuser

# SECRET_KEY is NOT here — pass it via orchestrator secret at runtime
CMD ["python3", "app.py"]
```

The secret is gone from the image. The base is pinned. Root is abandoned. The layer cache is clean.

## Run the demo

```bash
bash demo.sh
```

The demo shows a root vs non-root container identity check, compares `trivy` output between `alpine:3.19` and `ubuntu:latest`, and uses `docker history` to demonstrate layer inspection for secret leakage.

## Deeper intuition

Think of image security as having three layers of defense, each independent. The first layer is what you put in the image — minimal base, non-root user, no secrets, pinned versions. The second layer is what you know about the image — scanning results, known CVEs, signing status. The third layer is how the image runs — read-only filesystem, dropped capabilities, no host network, resource limits. Each layer stops a different class of attack. A CVE in a library is stopped by scanning and patching (layer 2). A compromised process trying to write a reverse shell binary is stopped by read-only filesystem (layer 3). A secret accidentally embedded is caught by layer inspection (layer 1 and 2 together).

## Scenario questions

### Scenario 1 — "Our compliance audit requires zero root containers in Kubernetes"
**Question:** You have 40 services. Half run as root because nobody added a `USER` instruction. How do you find them and fix them systematically?
**Answer:** Run `trivy config --scanners config .` against your Dockerfiles and Helm charts to flag missing `USER` instructions. For Kubernetes, use a `PodSecurityStandard` admission controller at the `restricted` level — it rejects any pod that requests root. Fix Dockerfiles first, then verify with the policy.
**Explanation:** Policy-as-code (OPA Gatekeeper, Kyverno, PSS) makes the security requirement automatic and auditable — you don't have to manually check 40 repos. The Dockerfile fix is the root cause solution; the policy is the enforcement mechanism that catches regressions.

### Scenario 2 — "A critical CVE in OpenSSL was published this morning and we don't know if we're affected"
**Question:** How do you find out which of your running containers are vulnerable and prioritize remediation?
**Answer:** Run `trivy image` against each image in your registry (or use registry-native scanning in ACR/ECR), filter for the CVE ID. For containers already running, `trivy image --input` against the image digest of the running container. Prioritize internet-facing services first.
**Explanation:** Registry scanning (built into ACR and ECR) gives you a continuous view — you get notified when a newly published CVE matches a package in an image you've already pushed. Without it, you find out when something breaks, not before.
