# Containers and Images

A container is an isolated process. Not a virtual machine — there is no separate kernel, no hardware emulation, no boot sequence. A container is your application process running in an isolated namespace: it has its own filesystem view, its own process tree, its own network interface, but it shares the kernel with the host machine and with other containers.

This matters because most mental models of containers are wrong in ways that affect how you build with them.

## What a container actually is

The isolation a container provides comes from two Linux kernel features:

**Namespaces** provide isolation of resource views. A process in a container sees its own filesystem, its own process table, its own network interfaces — but these are views, not copies. The underlying kernel is shared.

**cgroups** (control groups) provide resource limits. A container can be restricted to a specific amount of CPU and memory. Without cgroups, a container's process could consume all available resources on the host.

This architecture means containers start in milliseconds (no boot sequence), are much more memory-efficient than VMs (no OS duplication), and can run hundreds on a single machine.

## Images: the build artifact

A container image is an immutable snapshot of a filesystem. It contains: the operating system libraries your application depends on, your application code, and any runtime dependencies (Python, Node.js, .NET runtime, etc.).

Images are layered. Each instruction in a Dockerfile produces a layer. Layers are cached: if the underlying filesystem hasn't changed, the layer is reused rather than rebuilt. This is why Dockerfiles are written in a specific order — expensive, rarely-changing operations first (installing dependencies), fast, frequently-changing operations last (copying your application code).

**Key property: images are immutable.** Once an image is built and tagged, it does not change. If you need to change something, you build a new image. This immutability is what makes the "build once, deploy anywhere" promise real: the image you tested in CI is exactly the image you deploy to production.

## Tags vs digests

Every image is identified by both a tag (`myapp:v1.2.3`, `myapp:latest`) and a digest (`myapp@sha256:abc123...`).

**Tags are mutable.** The same tag can point to different images at different times. If someone rebuilds `myapp:latest`, the tag now points to a different image. This creates a class of deployment bugs: "we deployed `latest` and something changed."

**Digests are immutable.** A digest is the SHA256 hash of the image manifest. It is computed from the image content and cannot be changed without changing the image. If you deploy by digest, you always get exactly the image you built.

The correct practice: build by tag for human readability, deploy by digest for correctness. Your CI pipeline should resolve the tag to a digest after pushing and pass the digest to the deploy step.

## The build process

A Dockerfile describes how to build an image. The key best practices:

**Multi-stage builds**: use separate build and runtime stages. The build stage has compilers, build tools, and intermediate artifacts. The runtime stage contains only what is needed to run the application. Multi-stage builds dramatically reduce image sizes and eliminate build tools from the runtime image (which reduces the attack surface).

**Layer caching**: place instructions that change rarely before instructions that change frequently. `COPY package.json .` and `RUN npm install` should come before `COPY . .` so that changing your application code does not invalidate the dependency installation layer.

**Non-root user**: by default, processes in a container run as root. This is a security risk — if an attacker escapes the container, they have root. Always add a non-root user and switch to it before the `CMD` instruction.

**Minimal base image**: start from the smallest base image that meets your needs. `alpine` (5MB) is much smaller than `ubuntu` (100MB+). Smaller images have a smaller attack surface, build faster, and pull faster. The Microsoft `mcr.microsoft.com/dotnet/aspnet` images and the `node:alpine` variants are good starting points.

## Container registries

A container registry is a content-addressed storage system for images. You push an image to a registry from your CI pipeline; your deployment system pulls it from the registry.

Azure Container Registry (ACR) is the Azure-native registry. Key properties:
- Integrated with Azure RBAC — you can grant access to specific managed identities without storing credentials
- Supports image scanning (Defender for Containers)
- Supports geo-replication for multi-region deployments
- Supports retention policies (automatically delete untagged or old images)

**Never use admin credentials for ACR.** Use managed identity or service principal authentication. Admin credentials are static secrets that cannot be rotated easily and give full access to the registry.

## Why immutability matters for deployment reliability

The combination of immutable images and digest-based deployment gives you:

**Reproducibility**: the exact same image can be deployed to dev, staging, and production. You are not deploying "the same code" — you are deploying the exact same binary artifact that was tested.

**Rollback**: if a deployment goes wrong, rolling back means deploying the previous image by digest. The previous image is still in the registry, unchanged, exactly as it was when it passed CI.

**Auditability**: every running container was built from a specific image, which was built from a specific commit. Given a running container's image digest, you can trace back to the exact source code that produced it.

This chain — code commit → image build → digest → deployment — is the foundation of reliable continuous delivery.
