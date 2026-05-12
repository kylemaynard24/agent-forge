# Homework — Docker Compose

> Build something to prove you understand the concept, not just read about it.

## Exercise: .NET API + PostgreSQL with Production-Safe Compose Patterns

**Scenario:** Your team is standardizing local development environments. Every developer needs to be able to run `docker compose up` and get a working .NET 8 API + PostgreSQL stack without any additional setup. The tech lead's requirements: no secrets hardcoded in compose.yml, the API must not start before Postgres is healthy, Postgres data must persist across restarts, and the setup must work from a clean machine with just Docker installed.

**Build:** Write a `compose.yml` for a .NET 8 API service + a PostgreSQL 16 service that satisfies all of the tech lead's requirements. You can use an existing .NET API image (e.g., the official `mcr.microsoft.com/dotnet/samples:aspnetapp` sample) or build from a Dockerfile you write.

**Constraints:**
- Write the `compose.yml` with two services: `api` and `db`.
- The `db` service must have a `healthcheck` that uses `pg_isready`.
- The `api` service must have `depends_on: db: condition: service_healthy` — it must not start until Postgres is healthy.
- Postgres must use a named volume (declare it in both the `db` service `volumes:` and the top-level `volumes:` block). The volume must survive `docker compose down` (not `-v`).
- All secrets (database password) must come from a `.env` file. The `compose.yml` must reference them as `${VARIABLE_NAME}` and must NOT contain the literal password.
- Write a `.env.example` file (safe to commit) and a `.env` file (with an actual dev password — add `.env` to `.gitignore`).
- The API must be reachable at `http://localhost:8080` from the host.
- The Postgres port must NOT be published to the host.

## Stretch 1: Add a Compose Override File for Development

Create a `compose.override.yml` that adds development-specific behavior without modifying `compose.yml`:

1. Mount the API source directory as a bind mount so changes are reflected without rebuilding the image.
2. Set the API's `ASPNETCORE_ENVIRONMENT` to `Development` (in the override, not the base compose file).
3. Add a `pgadmin` service (image: `dpage/pgadmin4`) with `profiles: [tools]` so it only starts when explicitly requested with `docker compose --profile tools up`.

Verify that `docker compose up -d` starts only `api` and `db`, while `docker compose --profile tools up -d` also starts `pgadmin`.

## Stretch 2: Write a Compose-Based Integration Test Script

Write a shell script (`run-integration-tests.sh`) that:
1. Starts the compose stack with `docker compose up -d`.
2. Waits for the API health endpoint to return HTTP 200 (use curl in a retry loop with a max of 30 attempts, 2-second interval).
3. Runs a test: sends a request to the API and checks the response status.
4. Prints `PASS` or `FAIL` based on the result.
5. Always runs `docker compose down -v` in a cleanup block, even if the test fails.

This is the foundation of a local integration testing workflow — the same pattern CI pipelines use with `docker compose` in GitHub Actions.

## Reflection

- Your `depends_on: db: condition: service_healthy` is working perfectly locally. A colleague reports it sometimes fails in CI. What is different about CI environments that might affect healthcheck timing?
- A junior developer runs `docker compose down -v` thinking it will "clean up." What data did they just destroy, and how would you prevent this from being possible by accident?
- You add a third service (Redis) to the compose stack. The API depends on both Postgres and Redis being healthy. How do you express this in the `depends_on` block? Write the YAML.

## Done when

- [ ] `docker compose up -d` starts both `api` and `db` cleanly with no errors
- [ ] `curl http://localhost:8080` (or the API's health endpoint) returns HTTP 200
- [ ] Postgres is not reachable from the host (`psql -h localhost -p 5432` fails with connection refused)
- [ ] The `.env` file contains the password; the `compose.yml` references it as `${POSTGRES_PASSWORD}`
- [ ] A named volume is declared and Postgres data persists after `docker compose down` + `docker compose up -d`
- [ ] The `depends_on: condition: service_healthy` pattern is used and the API waits for Postgres
- [ ] A `.env.example` file exists in the repo (safe to commit); `.env` is in `.gitignore`

---

## Clean Code Lens

**Principle in focus:** Don't Repeat Yourself (DRY)

A compose file that duplicates the same environment variable in three services, or the same volume mount path in two places, is brittle — change one and forget the other. Compose has a YAML anchor/alias feature (`&anchor` and `*alias`) and supports extension fields (`x-` prefixed keys) for sharing repeated blocks.

More importantly, DRY in the compose context means centralizing configuration: the password lives in one place (`.env`), the service name lives in one place (it is the key in the `services:` block), and the volume name lives in one place (the top-level `volumes:` declaration). Every reference is a reference, not a copy. When you change the volume name, you change it once.

**Exercise:** Look at your `compose.yml`. Identify any value that is repeated (a port number, a database name, a service name). Use YAML anchors or Compose extension fields to eliminate the duplication. Then add a third service that shares the same network and a common set of environment variables (e.g., a background worker that needs the same database connection string as the API). Use a YAML anchor to share the environment block.

**Reflection:** There is a tension between DRY and readability in compose files. YAML anchors make files DRY but harder to read for someone unfamiliar with the syntax. At what complexity level (number of services, number of repeated values) does it become worth introducing anchors? What is the alternative at smaller scale?
