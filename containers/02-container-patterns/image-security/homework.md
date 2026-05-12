# Homework — Image Security

> A Dockerfile with one bad line can expose a secret to everyone who pulls the image — even years after you think you deleted it.

## Exercise: Audit and Harden a Deliberately Insecure Dockerfile

**Scenario:** You've inherited a legacy .NET service that a junior engineer containerized quickly to meet a deadline. It works, but it has never been through a security review. The security team's automated scanner flagged it this morning, and you need to fix three categories of issues before the next deployment window.

**The insecure Dockerfile you're starting with:**

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /app

# Connection strings — set here so devs don't have to configure anything locally
ENV ConnectionStrings__DefaultConnection="Server=prod-db.internal;Database=MyApp;User=sa;Password=Prod@ssword99!"
ENV ASPNETCORE_ENVIRONMENT=Production
ENV JWT_SECRET=aBcDeFgHiJkLmNoPqRsTuVwXyZ123456

COPY . .
RUN dotnet restore
RUN dotnet build -c Release

EXPOSE 8080
ENTRYPOINT ["dotnet", "run", "--project", "src/MyApi/MyApi.csproj"]
```

**What to fix — three required changes:**

**Fix 1 — Remove secrets from the image layer**
Replace all hardcoded `ENV` secrets with documentation explaining how they must be passed at runtime. Add a comment in the Dockerfile showing the correct `docker run -e` syntax and the Kubernetes `secretRef` equivalent. Verify with `docker history <your-new-image>` that no secrets appear in any layer.

**Fix 2 — Switch to a minimal, non-SDK base image**
Convert to a multi-stage Dockerfile where the final stage uses `mcr.microsoft.com/dotnet/aspnet:8.0` instead of the SDK image. The SDK should only appear in the build stage. Capture `docker images` output showing the size reduction.

**Fix 3 — Add and activate a non-root user**
Create an `appuser` (or use UID `1654`) in the final stage and activate it with `USER` before `ENTRYPOINT`. Verify with `docker run --rm <image> whoami`.

**Constraints:**
- All three fixes must be in a single Dockerfile — no separate scripts to strip secrets after the fact
- The `ENTRYPOINT` must be in exec form (`["dotnet", "MyApi.dll"]`), not shell form (`dotnet MyApi.dll`), so signal handling works correctly
- Run `trivy image <your-image>` or `docker scout cves <your-image>` and include the output showing the CVE reduction vs the original SDK-based image
- Write a short `RUNTIME-SECRETS.md` (or add a comment block to the Dockerfile) documenting how each secret should be provided at runtime for both local Docker and Kubernetes

## Stretch 1: Switch to a Chiseled or Distroless Base
Replace `mcr.microsoft.com/dotnet/aspnet:8.0` with `mcr.microsoft.com/dotnet/aspnet:8.0-jammy-chiseled`. Chiseled images have no shell and no package manager. This will break `docker exec <container> bash` — document why that's acceptable (and even desirable) in production, and what you'd use instead for debugging (hint: ephemeral debug containers with `kubectl debug`).

## Stretch 2: Add Image Signing with cosign
Install `cosign` and sign your final image after pushing it to a registry. Verify the signature with `cosign verify`. Write a one-paragraph explanation of what signing proves and what it does not prove (hint: signing proves origin, not content safety).

## Reflection

- You deleted the `ENV JWT_SECRET=...` line and rebuilt the image. Is the secret gone from the registry? Is it gone from the original image layers? What would you have to do to truly remove it?
- Your CI pipeline builds the image and then runs `trivy`. A new critical CVE is published the next morning in a base image package. When does your team find out, and what process would catch it before it matters?
- The app needs to write temporary files to `/tmp` during request processing. You run the container with `--read-only`. What's the minimal change needed to make it work without relaxing the read-only constraint?

## Done when

- [ ] Dockerfile has zero `ENV` or `ARG` instructions containing credentials, connection strings, or tokens
- [ ] `docker history <image>` shows no secret values in any layer
- [ ] Final stage base is `aspnet:8.0` or a chiseled variant — SDK image is only in a build stage
- [ ] Image size is under 250 MB (runtime only, no SDK)
- [ ] `docker run --rm <image> whoami` does not return `root`
- [ ] `trivy image <image>` output is captured and included — CRITICAL CVE count reduced vs original
- [ ] Runtime secret injection method is documented (docker run, K8s secretRef, or Azure Key Vault CSI)

---

## Clean Code Lens

**Principle in focus:** Don't Repeat Yourself (DRY) — applied to secret management

In application code, DRY means you define a value once and reference it everywhere rather than copying it. In container security, violating DRY means the same secret appears in multiple places: the Dockerfile, a CI variable, a `.env` file checked into git, a Kubernetes manifest, and a developer's shell profile. Each copy is a liability. Each copy has a different owner. Each copy gets rotated on a different schedule, or not at all.

The correct application of DRY to secrets is a single authoritative source — a secrets manager (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault) — with all consumers reading from that one place at runtime. Your Dockerfile never holds the value. Your CI pipeline holds only a reference (an ACR credential, a managed identity, a Workload Identity binding) — not the secret itself. When the secret rotates in the vault, every consumer picks up the new value on next start. No Dockerfile changes, no CI variable updates, no emergency PRs to scrub an accidentally committed secret from git history.

**Exercise:** Map your team's current secret locations on a whiteboard or in a text file: where does each secret live today (Dockerfile, CI variable, .env file, K8s secret, vault)? For each one, answer: who can read it, when was it last rotated, and what happens if it leaks? Then propose a consolidation to a single source of truth.

**Reflection:** Your team uses Azure Key Vault for secrets and the CSI driver to mount them into pods. A developer needs to test locally. How do you give them access to the correct secrets without copying them out of Key Vault and into a local `.env` file?
