# Docker Networking

**Area:** Docker Foundations

## Intent

Teach you how containers communicate — with each other, with the host, and with the outside world — so you can design container networks that are both functional and appropriately isolated.

## When to use

- Whenever two or more containers need to communicate (every multi-service app)
- When debugging "container A can't reach container B"
- When designing which ports to expose to the host and which to keep internal

## Why it matters

Networking is the most common source of confusion when containers "work in isolation but fail together." The default Docker network behavior is subtle: containers on the default bridge network can reach each other by IP, but not by name. User-defined bridge networks add DNS resolution so containers can reach each other by service name — the behavior you almost always want. Understanding why the default bridge lacks DNS is what lets you know to always use user-defined networks for multi-container applications.

Beyond correctness, networking is a security boundary. A container on a network should only be able to reach the services it needs to reach. Publishing all ports to the host, or putting every container on the same flat network, defeats the purpose of container isolation. Good Docker networking means defining minimal, explicit connectivity.

## Core concepts

- **Bridge network (default)** — Docker's default. All containers started without a `--network` flag join a network called `bridge`. Containers can reach each other by IP, but not by name (no built-in DNS). The host can reach containers via published ports. Use this only for single-container experimentation.
- **User-defined bridge networks** — created with `docker network create`. Containers on a user-defined bridge can resolve each other by container name (Docker provides a built-in DNS server). This is the correct network type for multi-container applications. Always use user-defined networks in docker-compose.
- **Host network (`--network host`)** — the container shares the host's network namespace. No isolation: the container's process binds ports directly on the host interface. Useful for performance-sensitive applications that need to avoid network translation overhead, or for tools that need to see the host's network interfaces. Not available on Docker Desktop for Mac/Windows (only Linux).
- **None (`--network none`)** — no network interfaces except loopback. The container is completely network-isolated. Useful for batch jobs that must not have network access, or for security-hardened builds.
- **Overlay network** — spans multiple Docker hosts (used in Docker Swarm and Kubernetes CNI). Containers on different machines appear to be on the same network. Not relevant for local development but foundational for understanding Kubernetes networking.
- **DNS resolution between containers** — on a user-defined bridge, Docker's embedded DNS server resolves container names and network aliases. `curl http://my-api:8080` from one container will reach the container named `my-api` on the same user-defined network. This is service discovery without an external registry.
- **Port publishing (`-p`)** — maps a host port to a container port. `-p 8080:80` means requests to `localhost:8080` on the host are forwarded to port 80 in the container. The container does not need to know about this mapping — it just listens on its internal port.
- **EXPOSE** — declares in the Dockerfile which port the container listens on. It is documentation, not firewall rules. It does not publish the port without `-p`.

## Common mistakes

- **Using `--link` (deprecated)** — the legacy way to connect containers. It creates a one-directional name resolution and environment variable injection between two containers. It is deprecated, does not scale, and is replaced entirely by user-defined networks. If you see `--link` in tutorials, the tutorial is outdated.
- **Using the default bridge for multi-container apps** — containers on the default bridge cannot resolve each other by name. You will write code that tries to connect to `http://postgres:5432` and get a DNS error. Create a user-defined network.
- **Publishing every port to the host (`-p 0.0.0.0:5432:5432`)** — if you publish your database port to the host, it is reachable from outside the Docker network, potentially from the internet if your host has a public IP. Only publish ports that external consumers need. Internal service-to-service communication should use the internal Docker network without host port publishing.
- **Confusing container port and host port** — `-p 8080:80` means host:container. Port 80 inside the container, port 8080 on the host. Confusing these is a very common mistake when debugging "I published port 80 but I can't reach it."
- **Not understanding that each container has its own loopback** — `localhost` inside container A refers to container A's loopback, not the host's loopback and not container B's loopback. `http://localhost:5432` from inside your app container will not reach your postgres container. Use the container name on a shared network.

## Tiny example

Two containers need to communicate: a web app and a PostgreSQL database. Wrong approach: run both on the default bridge and have the web app try to connect to `postgres` by name — it will fail with a DNS error. Correct approach: create a network (`docker network create app-net`), run both containers with `--network app-net`, and the web app can connect to `postgres:5432` by name because Docker's DNS resolves it.

## Run the demo

```bash
bash demo.sh
```

The demo creates a user-defined bridge network, runs two containers on it, proves DNS resolution by name works, shows the contrast with the default bridge (where it doesn't), and demonstrates port publishing.

## Deeper intuition

Every container gets a virtual Ethernet interface (veth pair) when it joins a network. One end of the pair is inside the container's network namespace; the other end connects to a bridge on the host. The Docker daemon configures iptables rules to route traffic between the bridge and the host's external interface.

User-defined bridges add one more component: a DNS server running inside the Docker daemon that responds to name queries within that network. When container A sends a DNS query for `container-b`, Docker's DNS intercepts it and returns the IP address of `container-b`'s veth interface on that bridge. The result is seamless name-based discovery within a user-defined network.

This is architecturally similar to how Kubernetes service discovery works: kube-dns (or CoreDNS) resolves service names to cluster IPs, and iptables rules route traffic from the cluster IP to the appropriate pod. Understanding Docker DNS is understanding the principle behind Kubernetes service discovery.

## Scenario questions

### Scenario 1 — "Two containers keep failing to connect — 'connection refused' in the logs"

**Question:** What is the fastest diagnostic path to determine whether this is a DNS problem, a port problem, or a firewall problem?

**Answer:** First, verify both containers are on the same user-defined network. Then exec into the source container and try to reach the target by name with a simple tool. Isolate DNS resolution from TCP connectivity separately.

**Explanation:** Run `docker inspect <container> | grep -A 10 Networks` on both containers to confirm they share a network. Then `docker exec -it <source> sh` and try `nslookup <target>` or `ping <target>` — if that fails, you have a DNS/network membership problem, not a port problem. If DNS resolves but the connection is refused, try `nc -zv <target> <port>` to check TCP connectivity independent of the application. If TCP connects but the application fails, you have an application-level configuration problem (wrong port in the app config, wrong credentials). Separate these layers and you find the problem in under two minutes.

### Scenario 2 — "We need to access the database from our local machine for debugging, but keep it off the internet"

**Question:** How do you publish a container port for local access without exposing it to the network?

**Answer:** Bind the published port to localhost: `-p 127.0.0.1:5432:5432` instead of `-p 5432:5432`.

**Explanation:** `-p 5432:5432` without specifying an interface binds to `0.0.0.0`, which is all interfaces — including the machine's external network interface. If your machine is in a cloud VM with a public IP and no firewall, this means the database is reachable from the internet. `-p 127.0.0.1:5432:5432` binds only to the loopback interface — the port is reachable from the same machine but not from the network. In docker-compose, this is `ports: ["127.0.0.1:5432:5432"]`. Use this pattern for any development tooling you publish to the host but don't want exposed externally.
