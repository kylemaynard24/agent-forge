# Capstone 1: Containerize a .NET API with Docker Compose

**Track:** Containers
**Estimated time:** ~3 hours
**Prerequisites:** Stages 1 (Docker Fundamentals) and 2 (Docker Compose and Multi-Container Apps)

## What you'll build

You will containerize a .NET 8 Web API alongside a PostgreSQL database and a Redis cache, wiring all three together with Docker Compose. The API image will be built with a multi-stage Dockerfile: a build stage using the .NET SDK image, a publish stage that runs `dotnet publish`, and a final runtime stage using the slim ASP.NET runtime image.

The container will run as a non-root user. The image will be tagged with the current git SHA (so you always know which commit is running). A `.dockerignore` file will prevent the build context from including `bin/`, `obj/`, `.git/`, and test output directories. The Compose file will configure health checks for each service and use `depends_on.condition: service_healthy` so the API does not start until Postgres and Redis are ready. Postgres data will be stored in a named volume. Secrets (DB password, Redis URL) will be loaded from a `.env` file that is never committed to git.

## Why this capstone

The Dockerfile quality you establish here propagates through every subsequent capstone. A bloated image with secrets baked in and a root-running process is a liability you carry into AKS. Getting the multi-stage build right, the non-root user right, and the image scan clean at this stage means you never have to remediate these issues later — which is much harder than preventing them.

The Docker Compose setup mirrors real development environments. Understanding how health checks and `depends_on` interact here makes Kubernetes readiness probes and init containers immediately intuitive — they are solving the same problem at different scale.

## Deliverables

- [ ] Multi-stage `Dockerfile` that produces an image under 250MB, running as UID 1000 (non-root), with no secrets baked in
- [ ] `docker-compose.yml` with three services: `api`, `postgres`, `redis`
- [ ] Health checks for all three services; `api` depends on healthy `postgres` and `redis`
- [ ] Named volume for postgres data persistence
- [ ] `.env` file pattern documented (not committed); `.env.example` committed with placeholder values
- [ ] Image tagged with `$(git rev-parse --short HEAD)` as the Docker tag
- [ ] `trivy` image scan passes with no HIGH or CRITICAL vulnerabilities (or documented exceptions)
- [ ] `docker compose up` starts all three services and the API returns 200 from `/healthz`

## Architecture overview

```
docker compose
├── api (your .NET 8 image)      port 8080 → host 5000
│   ├── depends_on: postgres (healthy)
│   └── depends_on: redis (healthy)
├── postgres:16                   port 5432 (internal only)
│   └── volume: pgdata → /var/lib/postgresql/data
└── redis:7                       port 6379 (internal only)

Networks: default bridge (compose creates it)
Secrets: .env file → environment variables (never in image)
```

## Step-by-step guide

### Phase 1: Write the multi-stage Dockerfile (~45 min)

1. Create a new .NET 8 Web API project (or use an existing one):
   ```bash
   dotnet new webapi -n MyApi --no-openapi
   cd MyApi
   ```

2. Add a `/healthz` endpoint to `Program.cs`:
   ```csharp
   app.MapGet("/healthz", () => Results.Ok(new { status = "healthy" }));
   ```

3. Write the `Dockerfile`:
   ```dockerfile
   # Stage 1: build
   FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
   WORKDIR /src
   COPY ["MyApi.csproj", "."]
   RUN dotnet restore
   COPY . .
   RUN dotnet publish -c Release -o /app/publish --no-restore

   # Stage 2: runtime
   FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
   WORKDIR /app

   # Create non-root user
   RUN addgroup --system --gid 1000 appgroup && \
       adduser --system --uid 1000 --ingroup appgroup --no-create-home appuser

   COPY --from=build /app/publish .

   # Switch to non-root user
   USER appuser

   EXPOSE 8080
   ENV ASPNETCORE_URLS=http://+:8080
   ENTRYPOINT ["dotnet", "MyApi.dll"]
   ```

4. Write `.dockerignore`:
   ```
   bin/
   obj/
   .git/
   .vs/
   **/*.user
   **/*.suo
   TestResults/
   .env
   ```

5. Build and test:
   ```bash
   docker build -t my-api:$(git rev-parse --short HEAD) .
   docker run -p 5000:8080 my-api:$(git rev-parse --short HEAD)
   curl http://localhost:5000/healthz
   ```

6. Check image size:
   ```bash
   docker images my-api
   ```
   Target: under 250MB. The `aspnet:8.0` base is ~220MB; your app adds very little.

7. Verify non-root user:
   ```bash
   docker run --rm my-api:$(git rev-parse --short HEAD) whoami
   # should return: appuser (not root)
   ```

### Phase 2: Write docker-compose.yml (~45 min)

1. Create `docker-compose.yml`:
   ```yaml
   version: "3.9"

   services:
     postgres:
       image: postgres:16
       environment:
         POSTGRES_DB: myapp
         POSTGRES_USER: myapp
         POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
       volumes:
       - pgdata:/var/lib/postgresql/data
       healthcheck:
         test: ["CMD-SHELL", "pg_isready -U myapp -d myapp"]
         interval: 5s
         timeout: 5s
         retries: 5
         start_period: 10s

     redis:
       image: redis:7-alpine
       healthcheck:
         test: ["CMD", "redis-cli", "ping"]
         interval: 5s
         timeout: 3s
         retries: 5

     api:
       build:
         context: .
         dockerfile: Dockerfile
       image: my-api:${GIT_SHA:-dev}
       ports:
       - "5000:8080"
       environment:
         ConnectionStrings__DefaultConnection: >-
           Host=postgres;Port=5432;Database=myapp;
           Username=myapp;Password=${POSTGRES_PASSWORD}
         ConnectionStrings__Redis: redis:6379
         ASPNETCORE_ENVIRONMENT: Development
       depends_on:
         postgres:
           condition: service_healthy
         redis:
           condition: service_healthy
       healthcheck:
         test: ["CMD-SHELL", "curl -sf http://localhost:8080/healthz || exit 1"]
         interval: 10s
         timeout: 5s
         retries: 3
         start_period: 15s

   volumes:
     pgdata:
   ```

2. Create `.env.example`:
   ```
   POSTGRES_PASSWORD=change-me-in-production
   GIT_SHA=dev
   ```

3. Create your actual `.env` (NOT committed to git):
   ```bash
   cp .env.example .env
   # Edit .env and set a real password
   ```

4. Add `.env` to `.gitignore`:
   ```bash
   echo ".env" >> .gitignore
   ```

### Phase 3: Start and verify (~30 min)

1. Tag the image with the git SHA and start:
   ```bash
   GIT_SHA=$(git rev-parse --short HEAD) docker compose up --build
   ```

2. In a second terminal, verify everything is healthy:
   ```bash
   docker compose ps
   # All three services should show "healthy"
   ```

3. Test the API:
   ```bash
   curl http://localhost:5000/healthz
   # {"status":"healthy"}
   ```

4. Check postgres volume:
   ```bash
   docker volume inspect $(docker compose config --volumes | head -1)
   ```

5. Verify the API container is not running as root:
   ```bash
   docker compose exec api whoami
   # appuser
   ```

### Phase 4: Security scan with trivy (~20 min)

1. Install trivy:
   ```bash
   brew install aquasecurity/trivy/trivy
   # or: curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh
   ```

2. Scan the image:
   ```bash
   trivy image --exit-code 1 --severity HIGH,CRITICAL my-api:$(git rev-parse --short HEAD)
   ```

3. If HIGH or CRITICAL vulnerabilities are found:
   - Check if they are in the base image (update the base image tag to a newer patch)
   - Check if they are in your NuGet packages (`dotnet list package --vulnerable`)
   - Document any that cannot be fixed with a reason

4. Run a Dockerfile best-practice check:
   ```bash
   trivy config .
   ```

## Stretch goals

- Add a second Dockerfile that uses `--platform=linux/amd64` to build an ARM-native image for Apple Silicon Macs; benchmark the build time difference
- Add a `docker-compose.override.yml` for local development that mounts the source directory and uses `dotnet watch run` instead of the published binary — so you get hot reload in Docker Compose
- Add Postgres migration on startup using EF Core `Database.MigrateAsync()` in `Program.cs`; verify it runs correctly on `docker compose up` from a clean state

## Teardown

```bash
# Stop and remove containers, networks, and volumes
docker compose down --volumes

# Remove the built image
docker rmi my-api:$(git rev-parse --short HEAD) 2>/dev/null || true

# Verify everything is gone
docker ps -a | grep my-api
docker volume ls | grep pgdata
```

## Reflection questions

1. Why does the multi-stage build matter for security? What would be in the image if you used only the SDK stage?
2. The `depends_on.condition: service_healthy` pattern in Compose maps directly to a Kubernetes readiness probe + init container. What problem is each solving, and why does Kubernetes need a more complex solution than Compose?
3. You set `POSTGRES_PASSWORD` via a `.env` file. In production AKS, what replaces this mechanism?
