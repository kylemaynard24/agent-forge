# Docker Compose

**Area:** Docker Foundations

## Intent

Teach you to define and run multi-container local development stacks with Docker Compose — covering the compose.yml structure, service dependencies, healthchecks, environment configuration, and override files — so you can replace manual `docker run` chains with reproducible, version-controlled stack definitions.

## When to use

- Local development stacks with multiple services (web + db + cache + queue)
- Integration testing environments that spin up dependencies before tests run
- Any time you are running more than two containers that need to talk to each other

## Why it matters

The alternative to Docker Compose is a growing shell script of `docker run` commands, each with flags for networks, volumes, environment variables, and port mappings. That script is fragile, hard to read, and impossible to maintain across a team. Compose replaces it with a declarative YAML file that is version-controlled, self-documenting, and reproducible on any machine with Docker installed.

Beyond convenience, Compose encodes the architecture of your local stack: which services exist, how they communicate, what data they persist, and what order they should start in. Reading the `compose.yml` gives a new team member a complete picture of the system's local topology in minutes.

The concepts in Compose map directly to Kubernetes: services become Deployments, networks become CNI policies, volumes become PersistentVolumeClaims, healthchecks become liveness/readiness probes, depends_on becomes init containers or pod ordering. Learning Compose is learning the vocabulary you will use in Kubernetes.

## Core concepts

- **`services`** — the top-level key defining each container in the stack. Each service is analogous to a `docker run` command. At minimum, a service has an `image` or a `build` context.
- **`image` vs `build`** — `image: postgres:16` pulls from the registry. `build: ./path` builds from a local Dockerfile. Use `build` for your application services (so local code changes are reflected) and `image` for dependencies (postgres, redis, etc.).
- **`networks`** — by default, Compose creates a single user-defined bridge network and attaches all services to it. Services can resolve each other by service name. You can define custom networks to segment services.
- **`volumes`** — top-level `volumes:` block declares named volumes. Service-level `volumes:` lists mounts. If a volume name is listed under the top-level `volumes:` key, Compose manages its lifecycle. Volumes created this way persist across `docker compose down` but are removed by `docker compose down -v`.
- **`depends_on`** — controls service start order. `depends_on: [db]` means Compose starts `db` before starting `web`. Important: this only waits for the container to start, not for the service inside it to be ready. A postgres container can be "started" while postgres is still initializing. Use healthchecks to wait for readiness.
- **`healthcheck`** — defines a command that Compose (and Docker) runs periodically to determine if a service is healthy. A postgres healthcheck: `test: ["CMD-SHELL", "pg_isready -U postgres"]`. When combined with `depends_on` using `condition: service_healthy`, Compose will not start the dependent service until the health check passes.
- **`environment` and `env_file`** — set environment variables for a service. `environment:` inlines variables in the compose file (acceptable for non-secrets like `POSTGRES_DB: appdb`). `env_file: .env` reads from a `.env` file (preferred for secrets — the file is gitignored).
- **`ports`** — publishes container ports to the host. Same semantics as `-p` in `docker run`. `"8080:80"` maps host 8080 to container 80.
- **Override files (`compose.override.yml`)** — Compose automatically merges `compose.override.yml` with `compose.yml` when both exist. Use this to add development-specific settings (bind mounts for live reload, debug ports, lower resource limits) without modifying the base compose file. The base file is production-safe; the override is development-specific.
- **Profiles** — mark services with `profiles: [dev]` to exclude them from the default `docker compose up`. Run `docker compose --profile dev up` to include them. Use this for optional tooling (database admin UIs, local email catchers) that developers can opt into.
- **`docker compose exec`** — run a command in an already-running service container. Equivalent to `docker exec`. Useful for running database migrations, inspecting state, or running one-off scripts.
- **`docker compose logs -f`** — stream logs from all services (or a specific service) with timestamps.

## Common mistakes

- **`depends_on` without healthchecks** — the most common Compose mistake. `depends_on: [db]` means "start db container before web container." It does not mean "wait until Postgres is accepting connections." Your web service will often crash on startup because it tries to connect to Postgres before Postgres has finished initializing. The fix: add a `healthcheck` to the db service and use `depends_on: db: condition: service_healthy` in the dependent service.
- **Hardcoding secrets in compose.yml** — `POSTGRES_PASSWORD: mypassword` in the compose file ends up in version control. Use an `.env` file and reference it with `env_file: .env`. Add `.env` to `.gitignore`. This is not production-grade secrets management (use Key Vault or Secrets Manager for that) but it is a necessary minimum for local development.
- **Using `docker-compose` (v1) vs `docker compose` (v2)** — the old standalone `docker-compose` binary is deprecated. The current tool is `docker compose` (a Docker CLI plugin). The compose file format is the same, but the v2 plugin is faster, better maintained, and supports newer features. Use `docker compose` (space, not hyphen).
- **Running `docker compose down` and losing volume data** — `docker compose down` stops and removes containers but preserves named volumes by default. `docker compose down -v` removes volumes too. Know which one you are running before you run it. Losing a dev database is annoying; losing a production database is catastrophic.
- **Port conflicts across multiple stacks** — if you run multiple compose stacks on the same machine and both publish port 5432 to the host, the second one will fail to start. Either vary the host ports across stacks (`5433:5432` for the second stack) or avoid publishing database ports to the host entirely (access via `docker compose exec` instead).
- **Not specifying a `container_name`** — Compose names containers with a `<project>_<service>_<number>` pattern. If you want a predictable name for scripting, add `container_name: my-app-db`. Otherwise, the name changes based on the project directory name.

## Tiny example

Instead of:
```bash
docker network create app-net
docker volume create pgdata
docker run -d --name db --network app-net -v pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=dev postgres:16
docker run -d --name api --network app-net -e DB_HOST=db -p 8080:80 myapp:latest
```

You write a `compose.yml`, run `docker compose up -d`, and every developer on the team gets the same stack in one command.

## Run the demo

```bash
bash demo.sh
```

The demo creates and runs a compose stack with a web app (nginx), postgres, and redis. It shows `docker compose up`, `logs`, `exec`, `ps`, and `down`. It demonstrates the healthcheck + depends_on pattern.

## Deeper intuition

Docker Compose is a declarative interface to the same Docker networking, volume, and container primitives you have been using in the previous topics. There is no new Docker feature behind Compose — it is a configuration layer that describes the desired state and then calls the Docker API to create it.

This is important because it means your mental model from the previous topics applies directly. A compose network is a user-defined bridge network. A compose volume is a named volume. A compose service is a `docker run` with all its flags expressed in YAML. When Compose does something unexpected, you can `docker compose config` to see the resolved configuration and `docker inspect` to see what was actually created.

The deeper value of Compose over manual `docker run` is that it is idempotent and convergent: `docker compose up` creates what doesn't exist and leaves what already exists. `docker compose down` tears down what Compose created. This makes it safe to run repeatedly and script in CI.

## Scenario questions

### Scenario 1 — "The API container starts before the database is ready and crashes on boot"

**Question:** You have `depends_on: [db]` in the API service. Why is the API still crashing on startup, and what is the correct fix?

**Answer:** `depends_on` only waits for the container to start — not for the application inside it to be ready. Postgres takes several seconds to initialize after the container starts. The fix is to add a healthcheck to the db service and change depends_on to wait for `service_healthy`.

**Explanation:** Add this to the `db` service:
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 5s
  timeout: 5s
  retries: 10
  start_period: 10s
```
Then change the API's `depends_on`:
```yaml
depends_on:
  db:
    condition: service_healthy
```
Now Compose will not start the API until Postgres passes the health check. This is the correct pattern — not a retry loop inside the application, not a `sleep 5` in a startup script.

### Scenario 2 — "Different team members have slightly different compose files for their local setup"

**Question:** How do you give everyone the same base stack while allowing individual customization (different ports, debugging tools, IDE-specific settings)?

**Answer:** Use the override file pattern. The base `compose.yml` is the canonical, shared stack definition committed to the repo. A `compose.override.yml` (gitignored or templated) contains per-developer customizations that Compose merges automatically.

**Explanation:** Each developer clones the repo and gets the base `compose.yml`. They create their own local `compose.override.yml` (from a checked-in `compose.override.yml.example`) that overrides specific values: their preferred host port mapping, a bind mount for their IDE's source directory, or a debug-mode environment variable. When they run `docker compose up`, Compose automatically merges the two files. The team never diverges on the shared base; individuals customize their local experience without polluting shared configuration. The `.gitignore` includes `compose.override.yml` but includes `compose.override.yml.example` so others can see the pattern.
