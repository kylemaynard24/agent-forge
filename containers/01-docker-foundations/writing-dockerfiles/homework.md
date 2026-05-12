# Homework — Writing Dockerfiles

> Build something to prove you understand the concept, not just read about it.

## Exercise: Production-Grade .NET 8 Dockerfile

**Scenario:** Your team is about to containerize a .NET 8 console application and push it to Azure Container Registry for the first time. The platform team has a checklist: the image must use a pinned base tag (no `latest`), run as non-root, have a `.dockerignore`, and demonstrate that the dependency layer is cached independently from the source layer. You are responsible for the Dockerfile.

**Build:** Write a Dockerfile for a .NET 8 console application that satisfies all four platform requirements. You can use the simple hello-world console app from the demo, or create a minimal app yourself (it does not need to do anything complex — the Dockerfile is what you are practicing).

**Constraints:**
- Use a pinned, specific base tag for both stages — `sdk:8.0` and `runtime:8.0` are fine; `sdk:latest` is not. Explain in a comment why you chose this approach.
- Use a multi-stage build: `sdk:8.0` for the build stage, `runtime:8.0` for the runtime stage. The runtime image must not contain the SDK.
- Switch to a non-root user before `CMD`. Use the `app` user from the Microsoft runtime image, or create one explicitly.
- Write a `.dockerignore` that excludes at minimum: `.git/`, `bin/`, `obj/`, `*.md`, `.env`, any test output directories.
- Structure the COPY instructions so the `.csproj` is copied and `dotnet restore` runs before the source code is copied.
- Write a comment in the Dockerfile explaining why that ordering matters.

## Stretch 1: Build Args for Environment Parameterization

Add an `ARG` instruction to your Dockerfile that controls the build configuration (`Release` vs `Debug`). The `dotnet publish` step should use this ARG. Show that you can build both configurations:

```bash
docker build --build-arg BUILD_CONFIG=Release -t myapp:release .
docker build --build-arg BUILD_CONFIG=Debug -t myapp:debug .
```

Add a default value for the ARG so the Dockerfile works without `--build-arg`. Inspect both images with `docker inspect` and verify they have different sizes (Release publish output is smaller than Debug).

## Stretch 2: Measure the Cache Benefit

Write a shell script (`cache-benchmark.sh`) that:
1. Builds your optimized Dockerfile from scratch (use `--no-cache`), timing the build.
2. Makes a trivial source code change (append a comment to `Program.cs`).
3. Rebuilds, timing the build again — the restore layer should be cached.
4. Prints the two times side by side: "Cold build: Xs — Warm build: Ys — Cache saved: Zs."

The point is to make the performance improvement concrete and measurable, not theoretical.

## Reflection

- If you move the `.csproj` copy and `dotnet restore` to after `COPY . .`, what happens on every build? What is the dollar cost of that choice on a busy CI system?
- Why should build tools (compilers, SDKs, test frameworks) never appear in the runtime image? Name two consequences — one security, one operational.
- A colleague proposes using `ENV DB_PASSWORD=supersecret` to bake the database password into the image. What is wrong with this, and what is the correct alternative?

## Done when

- [ ] Dockerfile exists and builds successfully
- [ ] `docker inspect <image> --format '{{.Config.User}}'` shows `app` (not empty, which means root)
- [ ] `.dockerignore` file exists and excludes at minimum `bin/`, `obj/`, `.git/`
- [ ] The `.csproj` COPY and `dotnet restore` appear before `COPY . .` in the Dockerfile
- [ ] `docker images` shows the runtime image is meaningfully smaller than an SDK-based image would be
- [ ] (Stretch 1) Both `myapp:release` and `myapp:debug` build successfully from the same Dockerfile using `--build-arg`

---

## Clean Code Lens

**Principle in focus:** Open/Closed Principle

A well-structured Dockerfile is open for extension (you can add new build stages, new runtime variants, new ARGs) without modifying the stable core stages. The multi-stage pattern is the Dockerfile's natural expression of OCP: you add a new stage (e.g., a test stage that runs unit tests during the build) without rewriting the build or runtime stages.

Consider how this applies to your team's Dockerfile evolution over time. When someone needs to add a vulnerability scan step, or a code coverage gate, or a different base image for a different deployment target, can they add a stage without touching the existing stages? If your Dockerfile is a single long sequence of instructions, any addition is a modification risk. If it is structured as composable stages with clear inputs and outputs, extensions are additive.

**Exercise:** Add a `test` stage to your Dockerfile between the build and runtime stages. The test stage should: use `sdk:8.0`, copy the build output, and run `dotnet test` (even if there are no test projects — it should exit cleanly). The runtime stage should not depend on the test stage (multi-stage builds don't have to be linear). Verify that `docker build --target runtime .` skips the test stage entirely.

**Reflection:** How does the `--target` flag enable the OCP pattern in CI/CD? In what pipeline scenarios would you build to the `test` target vs the `runtime` target?
