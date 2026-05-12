#!/usr/bin/env bash
# demo.sh — Docker Volumes
# Run: bash demo.sh
# Requires: Docker installed and running
#
# What this demo proves:
#   1. Container writable layer is ephemeral — data is lost when container is removed
#   2. Named volumes survive container deletion and can be mounted by a new container
#   3. Bind mounts share files between host and container (ideal for dev workflows)
#   4. Volume inspection and lifecycle management

set -euo pipefail

# Cleanup function
cleanup() {
  echo ""
  echo "=== Cleanup ==="
  docker stop vol-demo-a vol-demo-b vol-dev-container 2>/dev/null || true
  docker rm vol-demo-a vol-demo-b vol-dev-container 2>/dev/null || true
  docker volume rm demo-persist-vol 2>/dev/null || true
  rm -rf /tmp/vol-demo-host 2>/dev/null || true
  echo "Cleanup complete."
}
trap cleanup EXIT

echo "=== 1. Prove the container writable layer is ephemeral ==="
echo "--- Write a file inside a container. Remove the container. The file is gone. ---"
docker run --name vol-demo-a alpine:3.19 sh -c \
  'mkdir -p /data && echo "I was written inside the container writable layer" > /data/proof.txt && cat /data/proof.txt'

echo ""
echo "Stopping and removing the container..."
docker rm vol-demo-a

echo "Trying to read the file from a fresh container based on the same image..."
docker run --rm alpine:3.19 sh -c 'cat /data/proof.txt 2>/dev/null || echo "File not found — it was in the writable layer, which was deleted with the container."'

echo ""
echo "=== 2. Create a named volume ==="
echo "--- Named volumes are managed by Docker and survive container deletion. ---"
docker volume create demo-persist-vol
docker volume ls | grep demo-persist-vol
docker volume inspect demo-persist-vol --format '
Name:       {{.Name}}
Driver:     {{.Driver}}
Mountpoint: {{.Mountpoint}}
Created:    {{.CreatedAt}}'

echo ""
echo "=== 3. Write data to the named volume via container A ==="
docker run --name vol-demo-a \
  -v demo-persist-vol:/data \
  alpine:3.19 \
  sh -c 'echo "Written by container A at $(date)" > /data/from-container-a.txt && echo "Container A wrote:" && cat /data/from-container-a.txt'

echo ""
echo "=== 4. Remove container A ==="
docker rm vol-demo-a
echo "Container A removed. Volume still exists:"
docker volume ls | grep demo-persist-vol

echo ""
echo "=== 5. Mount the same volume in container B and read the data ==="
echo "--- Container B has never seen this data — it comes from the volume. ---"
docker run --name vol-demo-b \
  -v demo-persist-vol:/data \
  alpine:3.19 \
  sh -c 'echo "Container B can read:" && cat /data/from-container-a.txt'

echo ""
echo "--- Container B writes its own entry to the volume: ---"
docker run --rm \
  -v demo-persist-vol:/data \
  alpine:3.19 \
  sh -c 'echo "Written by container B at $(date)" >> /data/from-container-a.txt && cat /data/from-container-a.txt'

echo ""
echo "=== 6. Show volume is independent of containers ==="
echo "--- Even after removing all containers, the volume persists: ---"
docker rm vol-demo-b 2>/dev/null || true
docker volume ls | grep demo-persist-vol
echo "(volume still listed even though no container is using it)"

echo ""
echo "=== 7. Demonstrate a bind mount for a dev workflow ==="
echo "--- Bind mounts share a host directory with the container in real time. ---"
mkdir -p /tmp/vol-demo-host
echo "Initial content from the host" > /tmp/vol-demo-host/shared.txt

docker run -d --name vol-dev-container \
  -v /tmp/vol-demo-host:/app/src \
  alpine:3.19 sleep 300

echo "Container sees the file created on the host:"
docker exec vol-dev-container cat /app/src/shared.txt

echo ""
echo "Modifying the file on the host..."
echo "Updated content — modified on the host at $(date)" > /tmp/vol-demo-host/shared.txt

echo "Container immediately sees the updated content (no rebuild needed):"
docker exec vol-dev-container cat /app/src/shared.txt

echo ""
echo "Container writes a new file..."
docker exec vol-dev-container sh -c 'echo "Written from inside the container" > /app/src/from-container.txt'

echo "Host sees the file the container wrote:"
cat /tmp/vol-demo-host/from-container.txt

echo ""
echo "=== 8. Volume cleanup ==="
echo "--- Removing the volume deletes all data in it — this is permanent. ---"
docker stop vol-dev-container && docker rm vol-dev-container
docker volume rm demo-persist-vol
echo "Volume removed."

echo ""
echo "--- Done. Key takeaways:"
echo "    1. Container writable layer: gone when the container is removed. Never store important data here."
echo "    2. Named volumes: survive container deletion, can be mounted by multiple containers."
echo "    3. Bind mounts: real-time file sharing between host and container — correct for dev, wrong for prod."
echo "    4. Always mount a named volume at the database's data directory in any container that persists state."
