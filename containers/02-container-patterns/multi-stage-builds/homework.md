# Homework — Multi-Stage Builds

> A single Dockerfile change can cut your image size by 75% and eliminate most of your CVEs before you write a single line of application code.

## Exercise: Production-Ready .NET 8 Web API Image

**Scenario:** Your team's .NET 8 Web API ships as a Docker image. The current Dockerfile uses the SDK image as the base and the image is 830 MB. Your new security policy requires images under 200 MB and zero critical CVEs. You also need the container to run as a non-root user for PCI compliance.

**Build:** A multi-stage Dockerfile for a .NET 8 Web API with three named stages — `build`, `publish`, and `final` — that produces a final image under 200 MB running as a non-root user.

**Starting point — the broken Dockerfile you're replacing:**
```dockerfile
# DO NOT SHIP THIS
FROM mcr.microsoft.com/dotnet/sdk:8.0
WORKDIR /app
COPY . .
RUN dotnet build -c Release
EXPOSE 8080
ENTRYPOINT ["dotnet", "run", "--project", "MyApi"]
```

**What to create:**

1. A `Dockerfile` with these three stages:
   - `build` — restore dependencies and compile (`dotnet build`)
   - `publish` — produce the runtime artifact (`dotnet publish -c Release -o /app/publish`)
   - `final` — based on `mcr.microsoft.com/dotnet/aspnet:8.0`, copies only `/app/publish`, runs as non-root

2. A `.dockerignore` file that excludes `bin/`, `obj/`, `.git/`, and `*.md`

3. Proof that it works: capture `docker images` output showing the image size

**Constraints:**
- Final image must use `mcr.microsoft.com/dotnet/aspnet:8.0` or the chiseled variant as its base — the SDK image must not appear in your final stage
- The `COPY --from=publish` instruction must copy only the `/app/publish` directory, not the full working directory
- A non-root user must be created and activated with `USER` before the `ENTRYPOINT` instruction
- The image must start and respond to HTTP requests (`curl http://localhost:8080/healthz` or equivalent)
- Run `trivy image <your-image>` or `docker scout cves <your-image>` and include the output — zero CRITICAL CVEs required

## Stretch 1: Chiseled Base Image
Switch the `final` stage base from `mcr.microsoft.com/dotnet/aspnet:8.0` to `mcr.microsoft.com/dotnet/aspnet:8.0-jammy-chiseled`. A chiseled image contains only the .NET runtime — no shell, no package manager, no extraneous OS packages. Rerun `trivy` and compare CVE counts. Document what breaks (hint: `docker exec` into a chiseled container and try to run `sh`) and why that is actually a feature in production.

## Stretch 2: CI Stage for Tests
Add a `test` stage between `build` and `publish` that runs `dotnet test`. Wire it into your CI pipeline (GitHub Actions or Azure DevOps YAML provided as a snippet) so that the `publish` and `final` stages only execute if the `test` stage passes. Use `docker build --target test` in your pipeline and fail the build if `dotnet test` reports failures.

## Reflection

- If the SDK image is your build stage base and the final image is the ASP.NET runtime, how does Docker know not to include the SDK layers in the final image?
- You see `COPY --from=0` in someone's Dockerfile instead of `COPY --from=build`. What is the difference, and which should you prefer and why?
- Your CI pipeline caches Docker layers. After a source code change that doesn't touch `*.csproj`, which layers in your multi-stage build will be cache hits?

## Done when

- [ ] Dockerfile has three named stages (`build`, `publish`, `final`) using the correct `FROM ... AS <name>` syntax
- [ ] The `final` stage base is an ASP.NET runtime image, not the SDK image
- [ ] `COPY --from=publish /app/publish .` (or equivalent narrow copy) is present in the `final` stage
- [ ] A non-root user is active when the container runs (`docker run --rm <image> whoami` does not return `root`)
- [ ] `docker images` shows the final image under 200 MB
- [ ] `trivy image <your-image>` shows zero CRITICAL CVEs
- [ ] `.dockerignore` is present and excludes build artifacts
- [ ] The container starts and serves HTTP traffic

---

## Clean Code Lens

**Principle in focus:** Single Responsibility Principle

In application code, SRP means a class or module has one reason to change. In container infrastructure, the same principle applies at the image level: a container image should have one job, and the Dockerfile should compose distinct responsibilities into distinct stages.

When you write a single-stage Dockerfile that builds, tests, and runs your application from the same base image, you violate SRP at the infrastructure layer. The build stage's job is compilation — it should change when your build toolchain changes. The test stage's job is verification — it should change when your test framework changes. The final stage's job is execution — it should change only when your runtime dependencies change. Mixing these into one stage means a CVE in a build tool forces a rebuild of your runtime image, and a runtime base image update forces re-running your build tools. The coupling is unnecessary and makes your pipeline harder to reason about.

Multi-stage builds make this separation explicit and enforceable. Each stage is a unit with a clear input, a clear output, and a single reason to change. The `COPY --from=` instruction is the clean interface between stages — it defines exactly what one stage produces that the next stage consumes. When you find yourself asking "why is this in my final image?", the answer is almost always that a stage isn't doing its one job cleanly.

**Exercise:** Draw a dependency diagram (in plain text or a simple `.txt` file) showing the inputs and outputs of each stage in your Dockerfile. Label what changes would force each stage to rebuild. Is each stage's reason-to-change confined to a single concern?

**Reflection:** If you add integration tests that need a real database, where in the stage chain do they belong, and how do you prevent that test infrastructure from leaking into the final stage?
