# Docker Foundations

A learning-oriented collection for understanding containers from the OS primitives up.

This section comes **before** Kubernetes — you need to understand images, layers, and the container lifecycle before orchestration makes sense. Kubernetes orchestrates containers; if you don't know what a container is, Kubernetes looks like magic, and magic is undebuggable.

## Contents

- [what-is-a-container/](what-is-a-container/) — Linux namespaces, cgroups, union filesystems, and the container vs VM distinction
- [writing-dockerfiles/](writing-dockerfiles/) — FROM to CMD: every instruction, layer caching strategy, and image size principles
- [docker-networking/](docker-networking/) — bridge, host, overlay networks; DNS resolution between containers; port publishing
- [docker-volumes/](docker-volumes/) — named volumes vs bind mounts vs tmpfs; data persistence across container restarts and deletions
- [docker-compose/](docker-compose/) — multi-service local stacks: compose.yml structure, dependencies, healthchecks, override files

## How to use this section

Each topic has three artifacts:

1. **`README.md`** — the concept, why it matters, and the mental model
2. **`demo.sh`** — annotated shell commands you can run; each section has a comment explaining what it proves
3. **`homework.md`** — a constrained exercise that forces you to build something

Work in order. The topics are sequenced so each one builds on the last. You can use Docker Compose without knowing what a volume is, but you will make the wrong decisions when something breaks.

## How to know this section is working

You have internalized Docker Foundations when you can:

- Explain in plain English what happens at the kernel level when you run `docker run`
- Write a Dockerfile that installs dependencies, copies your code, and runs as non-root — and explain why the order of instructions matters
- Debug a container networking problem (two containers that can't talk) using only `docker inspect` and `docker exec`
- Recover data from a stopped container using volumes, without having baked the data into the image
- Spin up a multi-service local stack with `docker compose up` and explain what `depends_on` and `healthcheck` actually do (and don't do)

## Question-driven orientation

### Scenario — "I SSH'd into a container and it feels just like a Linux VM"

**Question:** If containers share the kernel with the host, why does it feel like an isolated machine?

**Answer:** Namespaces. The container process sees its own process table, its own filesystem root, its own network interfaces, its own hostname — but those are views constructed by the Linux kernel, not copies. The kernel is still the host kernel.

**Explanation:** Namespaces are the mechanism that makes "isolation without virtualization" work. A container process is in a PID namespace that starts at PID 1 — from its perspective, it is the only process running. In reality, from the host, you can see it listed as, say, PID 4827. Same physical kernel, different view. This is why containers start in milliseconds: there is no boot sequence, no hardware emulation, no second kernel to initialize. You are just forking a process into an isolated view.

### Scenario — "The security team flagged our containers for running as root"

**Question:** Why does running as root inside a container matter if containers are isolated?

**Answer:** Because container isolation is not perfect. If an attacker finds a container escape vulnerability, they land with the privileges they had inside the container. Root inside the container becomes root on the host.

**Explanation:** Container escapes are rare but real. The container boundary is implemented in the kernel, and kernel bugs happen. Defense in depth says: don't run as root inside the container so that a container escape does not immediately become a host compromise. Beyond escape scenarios, running as root inside a container means any process that starts inside the container — including malicious code injected via a dependency supply chain attack — runs with root privileges. Adding a non-root user to your Dockerfile is a three-line change that meaningfully shrinks your blast radius.

### Scenario — "Docker Compose works fine locally, but the team is asking about Kubernetes"

**Question:** What does Docker Compose give you that Kubernetes gives you, and vice versa?

**Answer:** Compose is the right tool for local development stacks. Kubernetes is the right tool for production multi-node workloads that need scheduling, self-healing, and rolling updates.

**Explanation:** Docker Compose runs containers on a single machine. It has no concept of multiple nodes, no built-in load balancing across pod replicas, no self-healing (restart yes, reschedule to a healthy node no). It is excellent for running a local web + db + cache stack during development. Kubernetes adds the control plane that decides which node a workload runs on, restarts containers that fail health checks, scales out based on CPU load, and drains nodes for maintenance. If your application only ever runs on one machine and you have no team scaling concerns, Compose may be all you need. Once you are deploying to a cluster of nodes in production, Compose stops being the right tool.
