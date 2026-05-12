#!/usr/bin/env bash
# demo.sh — Multi-Stage Builds
# Run: bash demo.sh
# Requires: Docker installed and running
# What this shows: side-by-side image size comparison between single-stage
# and multi-stage .NET Dockerfiles, plus --target flag usage.

set -euo pipefail

DEMO_DIR="$(mktemp -d)"
echo "Working in temp directory: $DEMO_DIR"

echo "=== 1. Write a minimal .NET-style app to demonstrate (using a real base image) ==="
# We'll use a Python app as a stand-in since it illustrates the exact same
# principle without requiring the dotnet SDK on your machine.
# Replace with actual .NET source when running in a real project.

cat > "$DEMO_DIR/app.py" << 'EOF'
# Minimal app — in real life this is your Program.cs
print("Hello from the app")
EOF

cat > "$DEMO_DIR/requirements.txt" << 'EOF'
requests==2.31.0
EOF

echo ""
echo "=== 2. Write a SINGLE-STAGE Dockerfile (fat image — build tools included) ==="
cat > "$DEMO_DIR/Dockerfile.single" << 'EOF'
# Single-stage: uses the full SDK/build image as the runtime base.
# Everything the build needs ships with the running container.
FROM python:3.12

WORKDIR /app

# Install build tools (simulates SDK tooling)
RUN apt-get update && apt-get install -y gcc build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

CMD ["python", "app.py"]
EOF

cat "$DEMO_DIR/Dockerfile.single"

echo ""
echo "=== 3. Write a MULTI-STAGE Dockerfile (slim runtime image) ==="
cat > "$DEMO_DIR/Dockerfile.multi" << 'EOF'
# Stage 1: builder — has all the tools needed to compile/install
FROM python:3.12 AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y gcc build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Install into a local prefix so we can copy just the result
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: test — run unit tests before producing the final artifact
# (In a real project: RUN python -m pytest tests/)
FROM builder AS test

COPY app.py .
RUN python app.py

# Stage 3: final — copy only what we need to run the app
FROM python:3.12-slim AS final

WORKDIR /app

# Copy installed Python packages from the builder stage — nothing else
COPY --from=builder /install /usr/local

COPY app.py .

# Run as non-root
RUN adduser --disabled-password --gecos "" appuser
USER appuser

CMD ["python", "app.py"]
EOF

cat "$DEMO_DIR/Dockerfile.multi"

echo ""
echo "=== 4. Build the single-stage image ==="
docker build \
  -f "$DEMO_DIR/Dockerfile.single" \
  -t demo-single-stage:latest \
  "$DEMO_DIR"

echo ""
echo "=== 5. Build the multi-stage image (all stages) ==="
docker build \
  -f "$DEMO_DIR/Dockerfile.multi" \
  -t demo-multi-stage:latest \
  "$DEMO_DIR"

echo ""
echo "=== 6. Compare image sizes ==="
echo "Notice the size difference between single-stage and multi-stage:"
docker images --filter "reference=demo-single-stage" --filter "reference=demo-multi-stage" \
  --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

echo ""
echo "=== 7. Demonstrate --target: build only up to the 'builder' stage ==="
echo "This is how CI runs the 'test' stage without producing the final image:"
docker build \
  -f "$DEMO_DIR/Dockerfile.multi" \
  --target builder \
  -t demo-builder-only:latest \
  "$DEMO_DIR"

echo ""
echo "Builder-only image (larger — includes build tools):"
docker images --filter "reference=demo-builder-only" \
  --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

echo ""
echo "=== 8. Verify the final multi-stage image runs correctly ==="
docker run --rm demo-multi-stage:latest

echo ""
echo "=== 9. Inspect layers in the final image ==="
echo "Layers in the single-stage image:"
docker history demo-single-stage:latest --no-trunc | head -8

echo ""
echo "Layers in the multi-stage final image:"
docker history demo-multi-stage:latest --no-trunc | head -8

echo ""
echo "=== 10. Clean up demo images ==="
docker rmi demo-single-stage:latest demo-multi-stage:latest demo-builder-only:latest 2>/dev/null || true
rm -rf "$DEMO_DIR"

echo ""
echo "--- Done. Key takeaway: the final stage of a multi-stage build copies only the artifact, leaving build tools behind — cutting image size by 50–80% and shrinking the attack surface proportionally. ---"
