# Multi-Stage Builds

**Area:** Container Patterns

## Intent

Use multiple `FROM` statements in a single Dockerfile to separate your build environment from your runtime image, dramatically reducing the final image size and attack surface.

## When to use

- Any compiled language (.NET, Go, Java, Rust, TypeScript) where the toolchain is not needed at runtime
- When your single-stage image is larger than ~200 MB and you want to know why
- When a security scan returns vulnerabilities that exist only in build tools
- When you want a `--target debug` build that includes extra tooling without shipping it in the release image

## Why it matters

Every megabyte in your final image is a megabyte that has to be pulled across the network on every cold start, every node scale-out, every CI agent. More concretely, every package in that image is a potential CVE. The .NET SDK includes MSBuild, NuGet, Roslyn, and dozens of runtime libraries that have no business running inside a production container. A single-stage .NET image built from `mcr.microsoft.com/dotnet/sdk:8.0` lands around 800 MB. After a multi-stage build using the ASP.NET runtime as your final base, that same application is typically 150–200 MB. Switch to a chiseled (distroless) runtime and you can reach 80–100 MB.

The size reduction also translates directly to security posture. Every package absent from the final image is a package that cannot be exploited. This is defense in depth at the infrastructure level — you're shrinking the blast radius before a vulnerability even exists.

## Core concepts

- **Stage** — a single `FROM` block within a Dockerfile; each stage gets a name via `FROM image AS name` and produces a layer cache that other stages can reference
- **`FROM ... AS builder`** — names a stage so you can reference it later with `COPY --from=builder`
- **`COPY --from=builder`** — copies files from a named (or numbered) stage into the current stage without carrying over any other layers from that stage
- **`--target`** — the `docker build --target <stage>` flag stops the build at a specific stage; useful for building a `test` stage in CI without producing the final image
- **Build context** — the files sent to the Docker daemon at build time; stages share the same original build context but produce independent layer caches
- **Publish output** — in .NET, `dotnet publish -c Release -o /app/publish` produces a self-contained directory you can copy wholesale; this is all that needs to go into the final stage

## Common mistakes

- **Copying the entire working directory instead of just the artifact** — running `COPY --from=builder /src .` instead of `COPY --from=builder /src/publish .` drags source code, tests, and obj/ folders into the final image; always copy the narrowest possible output
- **Using the full SDK image as the final base** — the most common beginner mistake; your app does not need `dotnet build` at runtime, it needs `dotnet MyApp.dll`, which is satisfied by the ASP.NET runtime image alone
- **Not pinning base image versions** — `FROM mcr.microsoft.com/dotnet/sdk:latest` makes your build non-reproducible; always pin to a digest or at minimum a minor version like `sdk:8.0`
- **Ignoring the test stage** — many teams add a `builder` and `final` stage but skip adding a `test` stage that runs unit tests before the artifact is copied; the result is images built from untested code
- **Order of COPY instructions** — putting `COPY . .` before `RUN dotnet restore` means every source file change invalidates the NuGet restore cache; always restore dependencies before copying the rest of the source

## Tiny example

Imagine a Go HTTP service. Without multi-stage, you use `FROM golang:1.22` and the resulting image is 850 MB — the Go toolchain, stdlib source, and your binary all bundled together. With multi-stage, you add a second stage `FROM scratch` or `FROM gcr.io/distroless/static`, copy only the compiled binary, and the final image is 8–12 MB. Nothing else. No shell, no package manager, no Go toolchain.

For .NET the math is: SDK image ~800 MB, ASP.NET runtime image ~200 MB, chiseled ASP.NET runtime ~100 MB. A typical Web API compiled and published drops into that runtime image as maybe 5–20 MB of DLLs. The runtime image does all the heavy lifting of providing the CLR — you just need to bring your app on top.

## Run the demo

```bash
bash demo.sh
```

The demo builds the same fictional .NET console app with a single-stage Dockerfile and a multi-stage Dockerfile, then runs `docker images` so you can see the size difference side by side. It also demonstrates `docker build --target builder` to stop at the build stage.

## Deeper intuition

Think of multi-stage builds as a clean room protocol. You let the messy, heavy build environment do its work, then you package only the finished product into a sterile container that ships to production. The build stage is a construction site — scaffolding, tools, raw materials. The final stage is the finished building — just walls, floors, wiring. Nobody ships the construction site to the client.

This also means you can use wildly different base images for different concerns. Your builder stage might be `node:20` to compile TypeScript. Your test stage might add `chromium` for end-to-end tests. Your final stage is `node:20-alpine` with only production dependencies. Each stage is purpose-built for its job, and only the last one ships.

## Scenario questions

### Scenario 1 — "We just enabled image scanning and our .NET API has 120 HIGH CVEs"
**Question:** Before patching anything, how do you immediately reduce the CVE count with a Dockerfile change?
**Answer:** If you're using the SDK image as your final base, switch to a multi-stage build using the ASP.NET runtime image. Most of those CVEs live in build tooling that should never be in your final image.
**Explanation:** `mcr.microsoft.com/dotnet/sdk:8.0` ships the entire .NET SDK including many packages that have known vulnerabilities because they're development tools, not hardened runtime components. The runtime image is a much narrower surface. One Dockerfile restructure can go from 120 CVEs to single digits before you write a single patch.

### Scenario 2 — "CI takes 12 minutes to build our image and most of it is downloading NuGet packages"
**Question:** How do you use Docker layer caching within a multi-stage build to speed this up?
**Answer:** In your builder stage, copy only the `.csproj` files and run `dotnet restore` before copying the rest of the source. This way, as long as your project file dependencies don't change, the restore layer is served from cache.
**Explanation:** Docker evaluates whether to use a cached layer by checking if the instruction and all inputs (files copied, environment variables) are identical to a previous build. If you copy all source first then restore, any source change invalidates the restore cache. Splitting the copy into two steps — project files first, then source — makes your restore layer sticky across the vast majority of commits.
