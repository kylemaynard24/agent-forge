#!/usr/bin/env bash
# demo.sh — Docker Compose
# Run: bash demo.sh
# Requires: Docker and the 'docker compose' CLI plugin installed
#
# What this demo proves:
#   1. docker compose up -d: starts a multi-service stack from a compose.yml
#   2. Service dependency with healthchecks: api waits for db to be healthy
#   3. docker compose logs: aggregate log streaming from all services
#   4. docker compose exec: run commands in a running service container
#   5. docker compose ps: show status of all services in the stack
#   6. docker compose down: tear down the stack, optionally remove volumes

set -euo pipefail

WORKDIR=$(mktemp -d)
echo "Working in temp directory: $WORKDIR"

# =========================================================
# Create the compose.yml
# =========================================================
cat > "$WORKDIR/compose.yml" << 'COMPOSE'
services:

  db:
    image: postgres:16-alpine
    container_name: demo-compose-db
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: localdev
      POSTGRES_DB: appdb
    volumes:
      - pgdata:/var/lib/postgresql/data
    # Healthcheck: only report healthy once postgres is accepting connections.
    # This lets dependent services (like the API) wait safely.
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 10s
    networks:
      - app-network

  cache:
    image: redis:7-alpine
    container_name: demo-compose-cache
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - app-network

  web:
    image: nginx:alpine
    container_name: demo-compose-web
    ports:
      - "8097:80"
    # depends_on with condition: service_healthy means compose waits for db's
    # healthcheck to pass before starting the web service.
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_healthy
    networks:
      - app-network

volumes:
  pgdata:

networks:
  app-network:
    driver: bridge
COMPOSE

# =========================================================
# Create a .env file (to show the pattern — not gitignored in this demo)
# =========================================================
cat > "$WORKDIR/.env" << 'ENVFILE'
# In a real project, this file is gitignored.
# It contains secrets that the compose.yml references via ${VARIABLE} syntax.
POSTGRES_PASSWORD=localdev
ENVFILE

echo ""
echo "=== 1. Show the compose.yml we created ==="
cat "$WORKDIR/compose.yml"

echo ""
echo "=== 2. Start the stack ==="
echo "--- docker compose up -d starts all services in detached mode. ---"
echo "--- Compose respects depends_on: db and cache start first; web waits for them to be healthy. ---"
docker compose -f "$WORKDIR/compose.yml" up -d

echo ""
echo "=== 3. Watch service status ==="
echo "--- docker compose ps shows all services and their health state. ---"
sleep 5  # give healthchecks a moment to run
docker compose -f "$WORKDIR/compose.yml" ps

echo ""
echo "=== 4. Show logs from all services (last 10 lines each) ==="
docker compose -f "$WORKDIR/compose.yml" logs --tail=10

echo ""
echo "=== 5. Exec into the db service to run a query ==="
echo "--- docker compose exec is like docker exec but references services by name. ---"
docker compose -f "$WORKDIR/compose.yml" exec -T db \
  psql -U appuser -d appdb -c "SELECT version();" 2>/dev/null | head -5

echo ""
echo "=== 6. Create a table and insert data via exec ==="
docker compose -f "$WORKDIR/compose.yml" exec -T db \
  psql -U appuser -d appdb -c "
    CREATE TABLE IF NOT EXISTS demo_items (id SERIAL PRIMARY KEY, name TEXT, created_at TIMESTAMPTZ DEFAULT now());
    INSERT INTO demo_items (name) VALUES ('item-from-compose-demo');
    SELECT * FROM demo_items;
  "

echo ""
echo "=== 7. Check the web service is reachable on its published port ==="
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8097)
echo "HTTP status from nginx on localhost:8097: $HTTP_STATUS"

echo ""
echo "=== 8. Show that web can reach db by service name (internal DNS) ==="
docker compose -f "$WORKDIR/compose.yml" exec -T web \
  sh -c 'nslookup db 2>/dev/null | grep Address || echo "(nslookup not available in nginx:alpine — db resolves via Docker DNS)"'

echo ""
echo "=== 9. Scale a service (if it supports it) ==="
echo "--- docker compose up --scale can run multiple replicas of a service. ---"
echo "--- Note: port conflicts occur if you scale a service with fixed host port publishing. ---"
echo "--- Scaling is more powerful in Kubernetes (HPA). This demo just shows the command. ---"

echo ""
echo "=== 10. Tear down — preserve volumes ==="
echo "--- docker compose down stops and removes containers and networks. ---"
echo "--- Named volumes are PRESERVED by default (data safe). ---"
docker compose -f "$WORKDIR/compose.yml" down
echo "Containers and networks removed. Volume 'pgdata' still exists:"
docker volume ls | grep pgdata || echo "(volume not found — it may be project-scoped)"

echo ""
echo "=== 11. Tear down with volume removal ==="
echo "--- docker compose down -v removes volumes too. Use with caution. ---"
docker compose -f "$WORKDIR/compose.yml" down -v 2>/dev/null || docker volume rm "$(basename $WORKDIR)_pgdata" 2>/dev/null || true

echo ""
rm -rf "$WORKDIR"

echo "--- Done. Key takeaways:"
echo "    1. compose.yml is a declarative, version-controlled replacement for docker run chains."
echo "    2. depends_on + healthcheck = correct service startup ordering."
echo "    3. docker compose exec = docker exec targeting services by name."
echo "    4. docker compose down preserves volumes; docker compose down -v removes them."
echo "    5. Named volumes in compose outlive docker compose down — data is safe by default."
