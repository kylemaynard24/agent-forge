#!/usr/bin/env bash
# demo.sh — What Is a Container
# Run: bash demo.sh
# Requires: Docker installed and running
#
# What this demo proves:
#   1. Containers are ephemeral process wrappers — they start and exit like processes
#   2. PID namespace isolation — PID 1 inside the container, a high PID from the host
#   3. exec into a running container — you are attaching to the same namespace
#   4. docker inspect — reveals the actual namespace and cgroup configuration
#   5. docker history — shows that images are layered, and layers are cached

set -euo pipefail

echo "=== 1. Pull a minimal image ==="
echo "--- alpine is ~7MB — no package manager overhead, no unnecessary OS layers ---"
docker pull alpine:3.19

echo ""
echo "=== 2. Run a one-shot container and observe PID isolation ==="
echo "--- Inside the container, the shell is PID 1. ---"
echo "--- On the host, it has a completely different PID. ---"
docker run --rm alpine:3.19 sh -c 'echo "My PID inside the container: $$"'

echo ""
echo "=== 3. Show that the container is gone after it exits ==="
echo "--- --rm means Docker removes the container filesystem on exit. ---"
echo "--- No containers from this image should appear in the list. ---"
docker ps -a --filter "ancestor=alpine:3.19" --format "table {{.ID}}\t{{.Status}}\t{{.Names}}"
echo "(empty table = container was cleaned up by --rm)"

echo ""
echo "=== 4. Run a background container and exec into it ==="
echo "--- exec attaches your terminal to the container's existing namespaces. ---"
echo "--- You are not creating a new container — you are joining the running one. ---"
CONTAINER_ID=$(docker run -d --name demo-container alpine:3.19 sleep 120)
echo "Started background container: $CONTAINER_ID"

echo ""
echo "--- Processes inside the container (from the container's perspective): ---"
docker exec demo-container ps aux

echo ""
echo "--- Hostname inside the container (UTS namespace — isolated from host): ---"
docker exec demo-container hostname

echo ""
echo "--- Host's hostname (should be different from the container's): ---"
hostname

echo ""
echo "=== 5. Inspect the container to see its cgroup and namespace configuration ==="
echo "--- This shows the resource limits Docker applied and the container's PID on the host. ---"
docker inspect demo-container --format '
Container ID:   {{.Id}}
Image:          {{.Config.Image}}
State:          {{.State.Status}}
PID on host:    {{.State.Pid}}
Memory limit:   {{.HostConfig.Memory}} bytes (0 = no limit)
CPU shares:     {{.HostConfig.CpuShares}} (0 = default)
Network mode:   {{.HostConfig.NetworkMode}}
'

echo ""
echo "=== 6. Show image layers with docker history ==="
echo "--- Every line is a layer. Layers are cached and shared between containers. ---"
docker history alpine:3.19

echo ""
echo "=== 7. Demonstrate that the writable layer is ephemeral ==="
echo "--- Write a file inside the container, stop and remove it, verify it is gone. ---"
docker exec demo-container sh -c 'echo "I was written inside the container" > /tmp/proof.txt && cat /tmp/proof.txt'
echo "Stopping and removing the container..."
docker stop demo-container
docker rm demo-container
echo "Container removed. The file /tmp/proof.txt no longer exists anywhere — it was in the writable layer."

echo ""
echo "--- Done. Key takeaways:"
echo "    1. Containers are processes, not machines — they start and stop like processes."
echo "    2. PID/UTS/net namespaces give each container an isolated view of the system."
echo "    3. Image layers are shared and read-only; each container gets a thin writable layer."
echo "    4. The writable layer is ephemeral — use volumes for data you need to keep."
