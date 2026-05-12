#!/usr/bin/env bash
# demo.sh — Container Registries (ACR-focused)
# Run: bash demo.sh
# Requires: Azure CLI (az) installed and logged in (az login), Docker running
# NOTE: This demo creates real Azure resources. It cleans them up at the end.
#       Running it requires an active Azure subscription.
#       If you don't have az/Azure, read through the commands — the concepts
#       translate directly to ECR with analogous aws ecr commands.

set -euo pipefail

# --- Configuration ---
RESOURCE_GROUP="demo-registries-rg"
LOCATION="eastus"
# ACR names must be globally unique and alphanumeric only
ACR_NAME="demoregistry$(date +%s | tail -c 6)"
IMAGE_NAME="demo-app"

echo "=== 1. Create a resource group and Azure Container Registry ==="
echo "Registry name: $ACR_NAME (globally unique)"
echo ""

az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output table

echo ""
az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$ACR_NAME" \
  --sku Basic \
  --admin-enabled false \
  --output table

echo ""
echo "=== 2. Authenticate Docker to ACR using az acr login ==="
echo "(In production, use a service principal or managed identity instead of --admin-enabled)"
az acr login --name "$ACR_NAME"

echo ""
echo "=== 3. Build a minimal image locally ==="
DEMO_DIR="$(mktemp -d)"

cat > "$DEMO_DIR/app.sh" << 'EOF'
#!/bin/sh
echo "Demo app running — version: ${APP_VERSION:-unknown}"
EOF

cat > "$DEMO_DIR/Dockerfile" << 'EOF'
FROM alpine:3.19
WORKDIR /app
COPY app.sh .
RUN chmod +x app.sh
RUN adduser -D appuser
USER appuser
CMD ["/app/app.sh"]
EOF

docker build -f "$DEMO_DIR/Dockerfile" -t "$IMAGE_NAME:local" "$DEMO_DIR"

echo ""
echo "=== 4. Tag the image with version + git SHA convention ==="
# Simulate a git SHA (in real CI this would be: git rev-parse --short HEAD)
GIT_SHA="a3f9c12"
SEMVER="1.0.0"
ACR_HOST="${ACR_NAME}.azurecr.io"

docker tag "$IMAGE_NAME:local" "${ACR_HOST}/${IMAGE_NAME}:${SEMVER}"
docker tag "$IMAGE_NAME:local" "${ACR_HOST}/${IMAGE_NAME}:${SEMVER}-${GIT_SHA}"
# We also tag :latest for illustration — but note this is the ONLY place this is acceptable
docker tag "$IMAGE_NAME:local" "${ACR_HOST}/${IMAGE_NAME}:latest"

echo "Tags created:"
docker images "${ACR_HOST}/${IMAGE_NAME}" --format "  {{.Repository}}:{{.Tag}}"

echo ""
echo "=== 5. Push all tags to ACR ==="
docker push "${ACR_HOST}/${IMAGE_NAME}:${SEMVER}"
docker push "${ACR_HOST}/${IMAGE_NAME}:${SEMVER}-${GIT_SHA}"
docker push "${ACR_HOST}/${IMAGE_NAME}:latest"

echo ""
echo "=== 6. List repositories and tags in ACR ==="
echo "Repositories in the registry:"
az acr repository list --name "$ACR_NAME" --output table

echo ""
echo "Tags for '${IMAGE_NAME}':"
az acr repository show-tags \
  --name "$ACR_NAME" \
  --repository "$IMAGE_NAME" \
  --orderby time_desc \
  --output table

echo ""
echo "=== 7. Pull by tag vs pull by digest (immutability demo) ==="
echo "First, find the digest for our versioned tag:"
DIGEST=$(az acr repository show \
  --name "$ACR_NAME" \
  --image "${IMAGE_NAME}:${SEMVER}-${GIT_SHA}" \
  --query digest \
  --output tsv)

echo "Digest for ${SEMVER}-${GIT_SHA}: $DIGEST"
echo ""

echo "Pull by tag (mutable — points to whatever was last pushed with this tag):"
docker pull "${ACR_HOST}/${IMAGE_NAME}:${SEMVER}-${GIT_SHA}"

echo ""
echo "Pull by digest (immutable — always this exact image, even if the tag changes):"
docker pull "${ACR_HOST}/${IMAGE_NAME}@${DIGEST}"

echo ""
echo "=== 8. az acr run — build inside ACR without a local Docker daemon ==="
echo "This is useful in CI agents that don't have Docker installed:"
echo ""
echo "Command (not executing to save time, but valid):"
echo "  az acr run --registry $ACR_NAME --cmd 'docker build -t ${IMAGE_NAME}:acr-built .' ."
echo ""
echo "Alternatively, use az acr build for a full build-and-push in one step:"
echo "  az acr build --registry $ACR_NAME --image ${IMAGE_NAME}:acr-built ."

echo ""
echo "=== 9. Set up a retention policy for untagged manifests ==="
echo "This prevents untagged CI build artifacts from accumulating:"
az acr config retention update \
  --registry "$ACR_NAME" \
  --status enabled \
  --days 7 \
  --type UntaggedManifests

echo "Retention policy set: untagged manifests deleted after 7 days."

echo ""
echo "=== 10. Show repository manifest details ==="
az acr repository show \
  --name "$ACR_NAME" \
  --image "${IMAGE_NAME}:${SEMVER}" \
  --output jsonc

echo ""
echo "=== 11. Clean up all Azure resources ==="
echo "Deleting resource group $RESOURCE_GROUP (this deletes the ACR and all images)..."
az group delete --name "$RESOURCE_GROUP" --yes --no-wait
docker rmi "$IMAGE_NAME:local" 2>/dev/null || true
docker rmi "${ACR_HOST}/${IMAGE_NAME}:${SEMVER}" 2>/dev/null || true
docker rmi "${ACR_HOST}/${IMAGE_NAME}:${SEMVER}-${GIT_SHA}" 2>/dev/null || true
docker rmi "${ACR_HOST}/${IMAGE_NAME}:latest" 2>/dev/null || true
rm -rf "$DEMO_DIR"

echo ""
echo "--- Done. Key takeaway: pull by digest for production deployments, tag by version+SHA for traceability, and set a retention policy immediately — untagged CI artifacts will fill your registry silently if you don't. ---"
