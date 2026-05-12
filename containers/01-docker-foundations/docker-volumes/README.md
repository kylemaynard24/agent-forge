# Docker Volumes

**Area:** Docker Foundations

## Intent

Teach you how to persist data across container restarts and deletions — the distinction between named volumes, bind mounts, and tmpfs — so you never lose production data because someone assumed the container filesystem was durable.

## When to use

- Any time a container needs to write data that must survive a container restart or replacement (databases, uploaded files, state)
- When you want to share files between a container and the host during development (live-reload workflows)
- When you need data to be shared between two running containers

## Why it matters

The default assumption many developers bring to containers is wrong in a critical way: they assume that writing a file inside a container is like writing a file on a server — it persists. It does not. The container's writable layer (the overlayfs layer on top of the image) is destroyed when the container is removed. Data written there is gone.

This is correct and intentional behavior — containers are designed to be ephemeral, disposable, and replaceable. But it means any data that you care about beyond the life of a single container run must be stored outside the container filesystem: in a volume or on a bind-mounted host path.

In production, this distinction is foundational. A Postgres container without a volume is a database that loses all data on every redeploy. Understanding volumes is what separates a container that works in a demo from a container that is safe to run in production.

## Core concepts

- **Named volumes** — the recommended way to persist data. Managed entirely by Docker, stored in Docker's volume directory on the host (typically `/var/lib/docker/volumes/` on Linux). You reference them by name, not by path. Survive container deletion. Can be backed by volume drivers for remote storage (NFS, cloud block storage). Create with `docker volume create my-data`, use with `-v my-data:/path/in/container`.
- **Bind mounts** — mount a specific path from the host filesystem into the container. `-v /host/path:/container/path` or in compose: `volumes: - ./local-dir:/app/src`. Changes to files on either side are immediately visible to the other. The right tool for development workflows (live source reload, sharing config files). The wrong tool for production data — they tie the container to the specific host machine's filesystem layout, which breaks when you deploy to a different machine.
- **tmpfs mounts** — mount a temporary filesystem stored in the host's memory, not on disk. Data is fast and ephemeral — gone when the container stops. Use for temporary data that must not be written to disk for security reasons (keys, tokens that you process transiently) or for high-performance scratch space.
- **Volume lifecycle** — volumes are independent of containers. You can create a volume, attach it to a container, stop and remove the container, attach the volume to a new container, and the data is intact. This is the mechanism for zero-data-loss container replacements.
- **Volume drivers** — plugins that let Docker volumes be backed by remote storage systems. The default driver (`local`) stores on the host disk. Cloud volume drivers allow volumes backed by Azure Disk, AWS EBS, NFS servers, etc. In Kubernetes, this concept becomes PersistentVolumes and StorageClasses.
- **Anonymous volumes** — volumes created without a name (Docker generates a random ID). Created when a Dockerfile uses VOLUME instruction or when `-v /container/path` is given without a host path. Functionally like named volumes but harder to manage — you lose track of them. Prefer named volumes.

## Common mistakes

- **Writing data inside the container layer and calling it persistence** — if your app writes logs, database files, or uploaded assets to `/var/app/data` inside the container without a volume mount, that data is gone when the container is removed. This is the #1 volume mistake.
- **Using bind mounts in production** — bind mounts are tied to the host filesystem layout. In production, your containers may run on different machines, and the path may not exist or may contain different content. Use named volumes or, in Kubernetes, PersistentVolumeClaims.
- **Deleting volumes accidentally with `docker system prune` or `docker volume prune`** — these commands clean up unused volumes. An "unused" volume is one not currently mounted by any container. If your database container is stopped, its volume is "unused" and can be pruned. Always check what you are about to delete. Use `docker volume ls` to see what exists.
- **Not understanding volume permissions** — files in a volume are owned by the UID/GID that wrote them. If your container runs as UID 1000 and your volume has files owned by root (UID 0), the container process cannot read or write them. This causes subtle failures in Postgres containers and other services that are UID-sensitive.
- **Mounting a host directory over a container directory that has content** — if the image has files at `/app/data` and you bind-mount an empty host directory there, the container's existing files are hidden (overlaid by the empty bind mount). The container now sees an empty directory. This is correct overlayfs behavior but surprises many people.

## Tiny example

Run a Postgres container without a volume: `docker run -d --name db postgres:16`. Insert some data. Stop the container, remove it, start a new one. The data is gone — it was in the container's writable layer.

Run with a named volume: `docker run -d --name db -v postgres-data:/var/lib/postgresql/data postgres:16`. Insert data, stop and remove the container. Start a new container: `docker run -d --name db2 -v postgres-data:/var/lib/postgresql/data postgres:16`. The data is still there. The volume outlived the container.

## Run the demo

```bash
bash demo.sh
```

The demo writes data in a container to a named volume, removes the container, creates a new container mounting the same volume, and reads the data back — proving the volume survived. Then it contrasts this with a bind mount for a dev workflow.

## Deeper intuition

Think of a named volume as a detachable external drive that Docker manages for you. The container is the computer; the volume is the drive. When the computer is destroyed and replaced, you detach the drive and attach it to the new computer. The files on the drive are unchanged.

The overlay filesystem of the container is more like a whiteboard on the computer itself: fast to write to, gone when the computer is replaced. Write anything important to the external drive (the volume), not the whiteboard.

This analogy also explains why Docker volumes in production are backed by persistent block storage (Azure Disk, AWS EBS, GCP PD) rather than local disk: the "external drive" needs to outlive not just the container but the host machine too. If the host machine fails, you want to reattach the drive to a new host machine and keep running.

## Scenario questions

### Scenario 1 — "We deployed a new version and the database lost all its data"

**Question:** What happened and how do you prevent it in the next deployment?

**Answer:** The database container was running without a named volume. When the container was replaced during the deployment, the writable layer (containing the database files) was destroyed with it.

**Explanation:** Postgres stores data in `/var/lib/postgresql/data`. Without a volume mounted at that path, those files live in the container's writable overlayfs layer. When you `docker stop` and `docker rm` the container (which is what most deploy scripts do), that layer is deleted. The fix is to mount a named volume: `-v postgres-data:/var/lib/postgresql/data`. With this in place, the database files live in the named volume, which persists across container replacements. In docker-compose, this is a `volumes:` declaration under the postgres service plus a top-level `volumes:` block to create the named volume.

### Scenario 2 — "The dev team wants live source code reloading in the container without rebuilding the image on every change"

**Question:** What is the right Docker feature for this, and why is it different from what you would use in production?

**Answer:** Bind mount the source code directory from the host into the container. In development this is correct. In production it is wrong.

**Explanation:** A bind mount like `-v $(pwd)/src:/app/src` makes the container's `/app/src` a live mirror of your local `./src` directory. When you change a file locally, the container sees the change immediately — no rebuild required. This is the foundation of hot-reload dev workflows for Node, Python, and .NET with dotnet-watch. The reason this is wrong in production: production containers should be immutable artifacts. The image contains everything needed to run. If the source code is coming from a bind-mounted host path, you have defeated the whole point of the container image — reproducibility and portability. Production data (database files, uploaded files) goes in named volumes. Dev source code goes in bind mounts. These are different use cases served by different tools.
