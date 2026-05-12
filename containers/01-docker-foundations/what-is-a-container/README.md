# What Is a Container

**Area:** Docker Foundations

## Intent

Establish the correct mental model for containers at the OS level — namespaces, cgroups, and union filesystems — so that every subsequent Docker and Kubernetes concept lands on accurate foundations rather than the VM analogy.

## When to use

- Before touching any other Docker topic: this is the mental model everything else builds on
- When something breaks and you need to reason about isolation boundaries (network, filesystem, process)
- When a security question comes up about container privilege or host access

## Why it matters

Most container bugs come from wrong mental models. Developers think "container = lightweight VM" and are then surprised when a container can see the host's clock, when two containers on the same host share the same kernel version, or when a container restart does not restore data written to the container's writable layer. The VM analogy leads you astray on networking (no separate kernel network stack, just a namespace), on storage (the container layer is ephemeral), and on security (kernel exploits affect all containers on the host).

The correct mental model is simpler and more precise: a container is a process (or a tree of processes) running in a set of Linux kernel namespaces, with cgroups applied for resource limits, and a union filesystem providing the filesystem view. Once you have that model, container behavior is predictable. You can reason about what `docker run` does, what `docker exec` means, and what happens when a container "crashes."

## Core concepts

- **Namespaces** — kernel feature that provides isolated views of system resources. Each container gets its own PID namespace (independent process table starting at PID 1), network namespace (independent loopback, eth0, routing table), mount namespace (independent filesystem root), UTS namespace (independent hostname and domain name), IPC namespace (independent System V IPC and POSIX message queues), user namespace (optional: independent UID/GID mapping).
- **cgroups (control groups)** — kernel feature that limits and accounts for resource usage. Docker applies cgroups to restrict a container's CPU share, memory ceiling, disk I/O, and network bandwidth. Without cgroups, a single runaway container could starve all others on the host.
- **Union filesystem (overlayfs)** — a layered filesystem that stacks read-only image layers with a thin read/write layer on top. Reads are served from the highest layer that has the file; writes go to the top (writable) layer. When a container is deleted, the writable layer is discarded. Image layers are shared across all containers running from the same image.
- **OCI (Open Container Initiative)** — the industry standard that defines image format and runtime. Docker images are OCI images. containerd (the runtime used by Kubernetes) runs OCI images. This is why a Docker-built image works on Kubernetes without modification.
- **Container vs VM** — a VM emulates hardware and runs a full operating system kernel. A container runs a process in kernel namespaces on the host kernel. VMs provide stronger isolation (separate kernel) at higher cost (seconds to boot, hundreds of MB of memory for the guest OS). Containers provide weaker isolation at very low cost (milliseconds to start, shared kernel).
- **Image** — an immutable, layered snapshot of a filesystem. The template for containers. Building a new image produces a new artifact; running an image produces a container (ephemeral process instance).

## Common mistakes

- **Treating the container writable layer as storage** — Any data written inside a running container lives in the overlayfs writable layer, which is deleted when the container is removed. If you store database files, uploaded files, or state inside the container, it disappears on restart. Use volumes for anything you need to survive container lifecycle events.
- **Assuming containers are fully isolated from the host kernel** — Namespaces isolate views, not the kernel itself. A kernel vulnerability affects every container on the host. Kernel-level exploits (like dirty cow) can escape containers. Containers are not a security boundary equivalent to VMs.
- **Conflating image and container** — An image is static and lives in the registry. A container is a running instance of an image. You can run many containers from one image simultaneously. Stopping a container does not delete the image. Deleting a container does not delete the image.
- **Running processes as root** — Docker containers run as root by default. If an attacker exploits your application and gets code execution inside the container, they have root. If they then find a container escape, they have root on the host. Always create and switch to a non-root user in your Dockerfile.

## Tiny example

You run `docker run --rm alpine:3.19 ps aux`. Inside the container, PID 1 is the `ps` process itself — the container's PID namespace starts fresh. On the host, that same process appears as a high PID (e.g., 5412). The process is the same; the namespace is what makes it look different from inside and outside.

When you then run `docker run --rm alpine:3.19 hostname`, you see a random hex string — the container's UTS namespace gave it its own hostname, completely isolated from the host's hostname. Change it inside the container with `hostname foo`; the host is unaffected.

## Run the demo

```bash
bash demo.sh
```

The demo pulls alpine, runs a one-shot container, execs into a running container, inspects its namespaces via `docker inspect`, and shows the image layer cache with `docker history`. After running it, you should be able to predict the PID of a process inside the container from the host's perspective.

## Deeper intuition

Think of a namespace as a lens that filters what the kernel shows you. The kernel has one global process table, but with a PID namespace, the kernel only shows the process its own subtree. The kernel has one global filesystem, but with a mount namespace, the kernel only shows the process its own mounted tree starting at `/`. The kernel itself is unchanged; the namespaces change what each process can see.

cgroups sit alongside namespaces but serve a different purpose: they do not change what a process can see, they change what a process can use. A container with a memory limit of 512MB will be OOM-killed by the kernel if it tries to allocate more. The cgroup is a resource budget attached to a group of processes; the kernel enforces it transparently.

The union filesystem is what makes the "build once, deploy anywhere" model economically viable. If you run 50 containers from the same base image on a host, all 50 share the read-only base image layers in overlayfs. Only the thin writable layer per container is unique. 50 containers × 500MB base image does not equal 25GB of disk usage; it equals 500MB shared + 50 tiny writable layers.

## Scenario questions

### Scenario 1 — "My team treats containers like VMs — what's the core misconception?"

**Question:** What operational and security behaviors will your team get wrong if they think containers are lightweight VMs?

**Answer:** Several. They will be surprised that data disappears on container restart (no persistent disk), that containers on the same host share kernel version and kernel vulnerabilities, that "rebooting" a container is just a process restart not a machine boot, and that a compromised root container process on a misconfigured host has a path to host root.

**Explanation:** The VM model implies a hard isolation boundary (separate kernel), persistent disk, and a machine lifecycle. None of those are true for containers. The practical consequence: your team will be surprised when the database "loses data" after a deploy (they wrote to the container layer, not a volume), confused when a kernel CVE affects all their containers simultaneously (one shared kernel), and falsely confident that root-in-container is safe. Correcting the mental model at the start prevents a class of production incidents that are otherwise very confusing to diagnose.

### Scenario 2 — "When is a container the WRONG choice?"

**Question:** What workload characteristics make containers a poor fit?

**Answer:** Workloads that require strong kernel-level isolation (regulatory multi-tenancy), workloads that need direct hardware access (GPUs without device plugins, raw storage controllers), and very long-lived stateful processes that are designed around machine identity rather than process identity.

**Explanation:** If your compliance requirement is true hardware-level isolation between tenants, you need VMs or bare metal, not containers — the shared kernel is the sticking point. If your workload needs to talk to specific hardware (an HSM, a specialized NIC, raw disk) without an abstraction layer, containers add friction rather than value. Containers shine for stateless, horizontally-scalable services with well-defined startup and shutdown behaviors. The more a workload depends on machine-local state, persistent connections that span restarts, or kernel module installation, the worse a fit containers become. That said, most modern web services, APIs, workers, and batch jobs are excellent container candidates — the exceptions are real but narrow.
