# Writing Dockerfiles

**Area:** Docker Foundations

## Intent

Teach you to write Dockerfiles that produce small, secure, reproducible images — with layer caching that makes CI builds fast and a structure that does not leak build tools into the runtime image.

## When to use

- Every time you containerize an application — this is the foundational skill that determines image size, security surface, and build speed
- When CI builds are slow and you suspect cache invalidation
- When the security team flags your images for running as root or having an excessive CVE count

## Why it matters

A badly written Dockerfile costs you in three ways. First, build time: if your `COPY . .` comes before `RUN npm install`, every code change invalidates the dependency installation layer and triggers a full reinstall in CI. For a project with 200 dependencies, that is the difference between a 30-second build and an 8-minute build. Second, image size: if you copy your build toolchain into the final image (compilers, SDKs, intermediate artifacts), your image is 5–10x larger than it needs to be. Larger images take longer to push, pull, and start — and have a proportionally larger CVE attack surface. Third, security: running as root, using `latest` tags, and copying secrets into the image are the three most common Dockerfile security mistakes, and all three are preventable by writing the Dockerfile correctly from the start.

## Core concepts

- **FROM** — selects the base image. Use specific, version-pinned tags (e.g., `mcr.microsoft.com/dotnet/aspnet:8.0`) not `latest`. `latest` is mutable — the same tag can point to different content at different times, making your builds non-reproducible. Use `scratch` for purely static binaries, `alpine`-based images for minimal footprints.
- **RUN** — executes a command and commits the result as a new layer. Chain commands with `&&` and clean up in the same `RUN` instruction to avoid creating layers with cached package manager data. `RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*` in one RUN keeps the layer lean.
- **COPY vs ADD** — prefer `COPY`. It does exactly what it says: copies files from the build context into the image. `ADD` has additional behaviors (auto-extracting tar archives, fetching remote URLs) that make it less predictable. Use `ADD` only when you explicitly need tar extraction.
- **CMD vs ENTRYPOINT** — ENTRYPOINT sets the process that runs as PID 1 in the container. CMD provides default arguments to ENTRYPOINT (or the default command if no ENTRYPOINT is set). Use exec form (`["command", "arg"]`), not shell form (`command arg`), for both. Shell form wraps your command in `sh -c`, which means your process is not PID 1 — the shell is. This causes SIGTERM not to propagate to your application on `docker stop`, leading to slow shutdowns (Docker waits for the kill timeout).
- **EXPOSE** — documents which port the container listens on. It does not actually publish the port (that is done with `-p` on `docker run` or `ports:` in compose). Think of it as metadata for the image consumer.
- **ENV** — sets environment variables in the image. Avoid using ENV to pass secrets — environment variables in a built image are visible to anyone who inspects it.
- **ARG** — declares build-time variables passed with `--build-arg`. Unlike ENV, ARG values are not persisted in the final image. Use ARG for build-time customization (version pins, environment names). ARG values set before FROM can control the base image tag (useful for parameterizing the .NET or Node version).
- **.dockerignore** — like `.gitignore` but for the Docker build context. Always create one. Exclude: `.git/`, `node_modules/`, `bin/`, `obj/`, `*.md`, `.env`, local test output. Without it, `COPY . .` sends your entire working directory (including git history) to the Docker daemon, which slows the build and risks including secrets.
- **Layer caching strategy (deps before code)** — the golden rule: expensive, rarely-changing instructions go first; cheap, frequently-changing instructions go last. For .NET: `COPY *.csproj .` then `RUN dotnet restore`, then `COPY . .` then `RUN dotnet build`. For Node: `COPY package*.json .` then `RUN npm ci`, then `COPY . .` then `RUN npm run build`. The dependency installation is cached as long as the dependency manifest doesn't change.
- **Multi-stage builds** — use multiple FROM instructions. The first stage (build stage) has the SDK, compilers, and test toolchain. The second stage (runtime stage) copies only the published output from the first stage. The runtime image never contains build tools — it only contains what is needed to run the application.
- **Non-root user** — add a user and switch to it before CMD/ENTRYPOINT. `RUN adduser --disabled-password --gecos "" appuser` and `USER appuser`. The .NET runtime images from Microsoft provide a pre-created `app` user; switch to it with `USER app`.

## Common mistakes

- **Running as root** — it is the Docker default and it is wrong for production. Every container in production should run as a non-root user. This is the highest-impact Dockerfile change you can make for security, and it is three lines.
- **`COPY . .` before installing dependencies** — causes a full dependency reinstall on every code change. CI build time multiplies. Put dependency manifests first, install, then copy source code.
- **Using `latest` tags** — `FROM node:latest` or `FROM mcr.microsoft.com/dotnet/aspnet:latest` will resolve to different images at different times. Pin the version. Your `latest` build in January and your `latest` build in March may have different base OS libraries, producing different CVE profiles and potentially different behavior.
- **Installing tools in the runtime stage** — `curl`, `wget`, `git`, build SDKs have no place in a runtime image. Use multi-stage builds. If your runtime image has `apt-get install -y build-essential`, something has gone wrong.
- **Leaking secrets into layers** — if you do `COPY .env .` or `ENV API_KEY=mysecret`, that secret is in the image forever — even if you later delete it in another RUN instruction. Image layers are immutable. Pass secrets at runtime via environment variables or mounted secrets, not via the build.
- **Not cleaning up in the same RUN instruction** — `RUN apt-get install -y curl` creates a layer containing cached apt metadata. `RUN rm -rf /var/lib/apt/lists/*` in the next instruction creates a new layer that hides the old one but doesn't remove it from the image. Chain: `RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*`.

## Tiny example

A naive .NET Dockerfile:
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app
CMD ["dotnet", "/app/MyApi.dll"]
```

Problems: ships the entire SDK (1.1GB) into the runtime image, copies source code before restoring (cache miss on every code change), runs as root.

An optimized version uses multi-stage builds, dep-first copy, and a non-root user — see the demo for the full comparison.

## Run the demo

```bash
bash demo.sh
```

The demo builds two versions of the same application — a naive Dockerfile and an optimized one — and shows the cache miss difference, image size difference, and user difference between them.

## Deeper intuition

Think of a Dockerfile as a recipe where each line creates a snapshot. Docker caches snapshots. When a line changes, Docker discards that snapshot and every snapshot after it, and rebuilds from that point. This means the order of instructions in your Dockerfile directly controls how much work Docker has to redo on each build.

The practical consequence: your source code changes on every commit, so any instruction that depends on the source code (the `COPY . .`) is always a cache miss. Every instruction before that `COPY` can be cached. Put everything expensive (dependency installation, code generation, compile steps that don't depend on your source) before the `COPY . .`. You are structuring the Dockerfile so that the cache boundary aligns with what actually changes.

Multi-stage builds extend this: they let you have a first stage that is permanently large (it has the SDK and all dev dependencies) and a second stage that is permanently small (it only has the runtime). You build big, you ship small. The layers from the build stage never appear in the final image you push to the registry.

## Scenario questions

### Scenario 1 — "The CI build is 8 minutes and the team is losing patience"

**Question:** Before buying more CI runners, where do you look first for build time wins?

**Answer:** Dockerfile layer ordering. If `COPY . .` comes before `RUN dotnet restore` or `RUN npm install`, you are getting a full dependency reinstall on every commit, even when no dependency changed.

**Explanation:** Check `docker build --progress=plain` output to see which layers are being rebuilt. If you see the dependency installation layer being rebuilt on every run, the fix is to restructure the Dockerfile: copy only the dependency manifest first (`*.csproj`, `package.json`, `go.mod`), install, then copy the rest of the source. With that change, the dependency layer is cached for every build that doesn't touch the manifest — which is most builds. For a project with 200 dependencies, this typically takes the 8-minute build to under 90 seconds.

### Scenario 2 — "The security team flagged our image — it has 47 HIGH CVEs"

**Question:** You use `FROM ubuntu:22.04` as your base. Where do you start?

**Answer:** Switch to a minimal, purpose-built base image and enable automated scanning so you catch future regressions.

**Explanation:** `ubuntu:22.04` is a general-purpose OS image — it includes hundreds of packages your application does not need, each of which can carry CVEs. Switch to `mcr.microsoft.com/dotnet/aspnet:8.0` (if it's .NET) or `node:20-alpine` (if it's Node). These images are built from minimal bases with only what the runtime needs. Alpine-based images in particular are tiny and have very few packages — the CVE count drops dramatically. After switching, add image scanning to your CI pipeline (Trivy, Grype, or ACR's built-in scanner) so new CVEs are caught on every build rather than discovered in a quarterly audit.
