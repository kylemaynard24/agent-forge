#!/usr/bin/env bash
# demo.sh — Image Security
# Run: bash demo.sh
# Requires: Docker installed and running; trivy installed (https://aquasecurity.github.io/trivy/)
#           Install trivy: brew install trivy  OR  apt install trivy  OR download binary
# What this shows:
#   1. Root vs non-root identity check inside a container
#   2. trivy vulnerability comparison between alpine:3.19 and ubuntu:latest
#   3. docker history layer inspection to spot accidentally embedded secrets

set -euo pipefail

echo "=== 1. Who are we running as? Root container vs non-root container ==="

echo ""
echo "--- Default ubuntu image (runs as root): ---"
docker run --rm ubuntu:22.04 whoami

echo ""
echo "--- Creating a non-root demo image: ---"

DEMO_DIR="$(mktemp -d)"

cat > "$DEMO_DIR/Dockerfile.nonroot" << 'EOF'
FROM ubuntu:22.04
RUN adduser --disabled-password --gecos "" appuser
USER appuser
CMD ["whoami"]
EOF

docker build -f "$DEMO_DIR/Dockerfile.nonroot" -t demo-nonroot:latest "$DEMO_DIR" --quiet

echo "Non-root container (should print 'appuser', not 'root'):"
docker run --rm demo-nonroot:latest

echo ""
echo "--- Confirming UID inside the non-root container: ---"
docker run --rm demo-nonroot:latest id

echo ""
echo "=== 2. Read-only filesystem demonstration ==="
echo "A container running with --read-only cannot write to its filesystem:"
echo ""

# This should fail — writing to the filesystem is blocked
echo "Attempting to write to / in a --read-only container (expected to fail):"
if docker run --rm --read-only alpine:3.19 sh -c "echo 'pwned' > /tmp/hack.txt" 2>&1; then
  echo "WARNING: write succeeded (container may not support --read-only properly)"
else
  echo "Write blocked as expected — read-only filesystem is working."
fi

echo ""
echo "Using --tmpfs to allow writes only to /tmp (common pattern for apps that need temp space):"
docker run --rm --read-only --tmpfs /tmp:rw,size=64m alpine:3.19 sh -c \
  "echo 'allowed tmp write' > /tmp/ok.txt && cat /tmp/ok.txt"

echo ""
echo "=== 3. trivy image scan: alpine:3.19 vs ubuntu:latest ==="

if ! command -v trivy &> /dev/null; then
  echo "trivy is not installed. Skipping scan steps."
  echo "Install: https://aquasecurity.github.io/trivy/latest/getting-started/installation/"
  echo ""
  echo "What you'd see if trivy were installed:"
  echo "  alpine:3.19   → typically 0 CRITICAL, 0 HIGH (minimal image, very few packages)"
  echo "  ubuntu:latest → typically 10-30 HIGH, 1-5 CRITICAL (full OS package set)"
else
  echo ""
  echo "--- Scanning alpine:3.19 (minimal base) ---"
  trivy image --severity HIGH,CRITICAL --no-progress alpine:3.19 2>/dev/null || true

  echo ""
  echo "--- Scanning ubuntu:latest (fat base) ---"
  echo "(This may take a moment to download the vulnerability DB)"
  trivy image --severity HIGH,CRITICAL --no-progress ubuntu:latest 2>/dev/null || true

  echo ""
  echo "Side-by-side summary:"
  echo "  alpine:3.19   → see counts above"
  echo "  ubuntu:latest → see counts above"
  echo "The difference illustrates why minimal base images matter for security posture."
fi

echo ""
echo "=== 4. docker history: inspecting layers for accidental secret exposure ==="

echo ""
echo "--- Creating a DELIBERATELY INSECURE image with a secret in an ENV layer: ---"

cat > "$DEMO_DIR/Dockerfile.secret" << 'EOF'
FROM alpine:3.19
# BAD: secret baked into ENV — visible forever in layer history
ENV DATABASE_PASSWORD=SuperSecret123!
ENV API_KEY=sk-prod-abcdef123456
RUN echo "App installed"
CMD ["sh", "-c", "echo Running"]
EOF

docker build -f "$DEMO_DIR/Dockerfile.secret" -t demo-with-secret:latest "$DEMO_DIR" --quiet

echo "Inspect the layer history of an image with secrets baked in:"
echo "(Notice the ENV instructions reveal the secret values)"
echo ""
docker history demo-with-secret:latest --no-trunc | grep -E "ENV|ARG|RUN" | head -10

echo ""
echo "--- Even if we 'delete' the secret in a later RUN, it's still in the layer: ---"
cat > "$DEMO_DIR/Dockerfile.secret2" << 'EOF'
FROM alpine:3.19
ENV DATABASE_PASSWORD=SuperSecret123!
# Attempting to remove it — this does NOT help, the previous layer is permanent
RUN unset DATABASE_PASSWORD
CMD ["sh", "-c", "echo Running"]
EOF

docker build -f "$DEMO_DIR/Dockerfile.secret2" -t demo-secret-unset:latest "$DEMO_DIR" --quiet

echo "The secret is still visible in the layer history even after unset:"
docker history demo-secret-unset:latest --no-trunc | grep -E "ENV|RUN" | head -5

echo ""
echo "--- The correct approach: pass secrets at runtime via -e or orchestrator secrets: ---"
echo "docker run --rm -e DATABASE_PASSWORD=\$(get-secret-from-vault) my-image:latest"
echo "The password never appears in any image layer."

echo ""
echo "=== 5. Clean up demo images ==="
docker rmi demo-nonroot:latest demo-with-secret:latest demo-secret-unset:latest 2>/dev/null || true
rm -rf "$DEMO_DIR"

echo ""
echo "--- Done. Key takeaway: secrets baked into image layers are permanent and visible via docker history — always inject secrets at runtime, run as non-root, and scan every image before it leaves your build system. ---"
