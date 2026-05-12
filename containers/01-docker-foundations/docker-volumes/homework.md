# Homework — Docker Volumes

> Build something to prove you understand the concept, not just read about it.

## Exercise: Database Data Persistence Proof

**Scenario:** Your team just ran a "final check" deploy of a Postgres-backed service the night before launch. The next morning, the QA team found the database empty — the previous night's test data was gone. The culprit: the Postgres container was running without a named volume. You are responsible for proving that the fix works: data must survive a container stop, remove, and replace cycle.

**Build:** Run a PostgreSQL container with a named volume, insert data, stop and remove the container, start a fresh PostgreSQL container with the same volume, and verify the data is still there.

**Constraints:**
- Use `postgres:16-alpine` as the image (smaller than `postgres:16`, same functionality).
- Name your volume `homework-pgdata`. Create it explicitly with `docker volume create` before the first container starts.
- The first container must be fully removed (`docker rm`) — not just stopped — before the second container starts. This is the key test.
- Insert data using `docker exec` to run a `psql` command inside the container. Insert at least two rows into a table you create.
- The second container must mount the same `homework-pgdata` volume at `/var/lib/postgresql/data`.
- Query the data from the second container and print it. The output must show the rows you inserted into the first container.
- Clean up the volume explicitly at the end with `docker volume rm homework-pgdata`.

## Stretch 1: Backup and Restore a Volume

Named volumes are great for persistence, but you also need to be able to back them up. Docker has no built-in backup command — the pattern is to run a temporary container that:
1. Mounts the volume.
2. Mounts a host directory for the backup output.
3. Tars the volume contents to the host directory.

Write a script that backs up the `homework-pgdata` volume to `/tmp/pgdata-backup.tar.gz` and then restores it to a new volume called `homework-pgdata-restored`. Verify the restoration by mounting the restored volume in a new Postgres container and querying your data.

The backup pattern:
```bash
docker run --rm \
  -v homework-pgdata:/source:ro \
  -v /tmp:/backup \
  alpine:3.19 tar czf /backup/pgdata-backup.tar.gz -C /source .
```

The restore pattern:
```bash
docker volume create homework-pgdata-restored
docker run --rm \
  -v homework-pgdata-restored:/dest \
  -v /tmp:/backup \
  alpine:3.19 tar xzf /backup/pgdata-backup.tar.gz -C /dest
```

## Stretch 2: Compare Volume Types for a Dev Workflow

Set up a bind-mount-based development workflow for a simple static web server:
1. Create a local directory with an `index.html` file.
2. Run an nginx container with that directory bind-mounted to `/usr/share/nginx/html`.
3. From your browser (or curl), verify the page loads.
4. Edit `index.html` on your host.
5. Refresh — verify the container immediately serves the new content without a rebuild.
6. Document in a comment: what specifically would break if you tried to use a named volume instead of a bind mount for this development workflow?

## Reflection

- You have a running Postgres container with no volume. The container is currently running and has live data. Can you add a volume to it without stopping it? What are your options?
- A colleague proposes using a bind mount (`-v /data/postgres:/var/lib/postgresql/data`) in production instead of a named volume. What are two specific risks of this approach that named volumes avoid?
- What happens to a named volume if you run `docker system prune`? What flag do you need to add to also remove unused volumes? Why is this flag dangerous to use without thinking?

## Done when

- [ ] Named volume `homework-pgdata` created with `docker volume create`
- [ ] First Postgres container started, a table created and at least 2 rows inserted via `docker exec psql`
- [ ] First container stopped AND removed (confirmed with `docker ps -a`)
- [ ] Second Postgres container started with the same `homework-pgdata` volume
- [ ] Query from the second container shows the rows inserted in the first container
- [ ] Volume removed with `docker volume rm homework-pgdata` at the end
- [ ] (Stretch 1) Volume backup exists at `/tmp/pgdata-backup.tar.gz` and restored volume contains the same data

---

## Clean Code Lens

**Principle in focus:** Dependency Inversion Principle

DIP says high-level modules should not depend on low-level modules; both should depend on abstractions. Applied to volumes: your application container should not depend on the specific location of a bind-mounted host path (a concrete, low-level detail). It should depend on a volume interface (an abstraction) — a named path within the container that Docker resolves to whatever backing storage is configured for that environment.

In practice: your Dockerfile and your application code reference `/app/data` — the abstract mount point. In development, Docker resolves that to a bind mount of your local directory. In production (or in Kubernetes), Docker or the kubelet resolves it to a named volume backed by persistent cloud block storage. The application never changes; only the volume driver configuration changes.

**Exercise:** Write a `docker-compose.yml` for a Postgres service that uses a named volume. Then write a `docker-compose.override.yml` (which compose automatically merges in development) that replaces the named volume with a bind mount to a local `./postgres-dev-data/` directory. The production compose file uses the named volume; local development uses the bind mount. The application service is unchanged in both files.

**Reflection:** How does this pattern relate to the way Kubernetes PersistentVolumeClaims work? A PVC is a claim for storage without specifying which storage system backs it — the storage class resolves the abstraction to a concrete volume. Is this the same principle?
