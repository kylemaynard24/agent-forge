#!/usr/bin/env bash
# demo.sh — Docker Networking
# Run: bash demo.sh
# Requires: Docker installed and running
#
# What this demo proves:
#   1. Default bridge: containers can reach each other by IP but NOT by name
#   2. User-defined bridge: containers resolve each other by name (Docker DNS)
#   3. Port publishing: -p maps host port to container port
#   4. Network isolation: containers on different networks cannot reach each other
#   5. docker network inspect: shows connected containers and their IPs

set -euo pipefail

# Cleanup function to ensure containers and networks are removed even on error
cleanup() {
  echo ""
  echo "=== Cleanup ==="
  docker stop net-demo-a net-demo-b net-demo-isolated 2>/dev/null || true
  docker rm net-demo-a net-demo-b net-demo-isolated 2>/dev/null || true
  docker network rm demo-app-net demo-isolated-net 2>/dev/null || true
  echo "Cleanup complete."
}
trap cleanup EXIT

echo "=== 1. Create a user-defined bridge network ==="
echo "--- Unlike the default 'bridge', user-defined networks support DNS resolution by container name. ---"
docker network create demo-app-net
docker network ls | grep demo-app-net

echo ""
echo "=== 2. Start two containers on the user-defined network ==="
docker run -d --name net-demo-a --network demo-app-net alpine:3.19 sleep 300
docker run -d --name net-demo-b --network demo-app-net alpine:3.19 sleep 300
echo "Both containers started on demo-app-net."

echo ""
echo "=== 3. Prove DNS resolution works by container name ==="
echo "--- From net-demo-a, we can resolve 'net-demo-b' by name. ---"
echo "--- Docker's embedded DNS server handles this automatically on user-defined networks. ---"
docker exec net-demo-a nslookup net-demo-b
echo ""
echo "--- We can also ping by name: ---"
docker exec net-demo-a ping -c 2 net-demo-b

echo ""
echo "=== 4. Prove the default bridge does NOT support name resolution ==="
echo "--- Start a container on the default bridge and try to resolve another container's name. ---"
docker run -d --name net-demo-isolated alpine:3.19 sleep 300
echo "net-demo-isolated is on the default bridge. Trying to resolve net-demo-a by name..."
docker exec net-demo-isolated nslookup net-demo-a 2>&1 || echo "(Expected failure: no DNS resolution on the default bridge)"

echo ""
echo "=== 5. Show each container's IP addresses on the network ==="
echo "--- net-demo-a IP on demo-app-net: ---"
docker inspect net-demo-a --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
echo "--- net-demo-b IP on demo-app-net: ---"
docker inspect net-demo-b --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'

echo ""
echo "=== 6. Inspect the network to see all connected containers ==="
docker network inspect demo-app-net --format '
Network: {{.Name}}
Driver:  {{.Driver}}
Subnet:  {{range .IPAM.Config}}{{.Subnet}}{{end}}
Containers:
{{range $name, $cfg := .Containers}}  - {{$name}}: {{$cfg.IPv4Address}}
{{end}}'

echo ""
echo "=== 7. Demonstrate port publishing ==="
echo "--- Start a container with nginx and publish port 80 to host port 8099. ---"
docker run -d --name net-demo-nginx --network demo-app-net -p 8099:80 nginx:alpine
echo "nginx started. Reaching it from the host via published port:"
curl -s -o /dev/null -w "HTTP status from host via -p 8099:80: %{http_code}\n" http://localhost:8099
echo "--- From another container on the same network, reach nginx by container name on internal port 80: ---"
docker exec net-demo-a wget -qO- --server-response http://net-demo-nginx:80 2>&1 | grep "HTTP/" || \
  docker exec net-demo-a wget -qO /dev/null http://net-demo-nginx:80 && echo "Internal name resolution + connection: success"
docker stop net-demo-nginx && docker rm net-demo-nginx

echo ""
echo "=== 8. Show network isolation between networks ==="
echo "--- Create a second isolated network. ---"
docker network create demo-isolated-net
docker run -d --name net-demo-b2 --network demo-isolated-net alpine:3.19 sleep 300
echo "net-demo-b2 is on demo-isolated-net. Trying to reach it from net-demo-a (on demo-app-net)..."
docker exec net-demo-a ping -c 1 -W 2 net-demo-b2 2>&1 || echo "(Expected failure: containers on different networks cannot reach each other)"
docker stop net-demo-b2 && docker rm net-demo-b2
docker network rm demo-isolated-net

echo ""
echo "--- Done. Key takeaways:"
echo "    1. Default bridge: IP reachability only, no DNS. Never use for multi-container apps."
echo "    2. User-defined bridge: containers resolve each other by container name automatically."
echo "    3. Port publishing (-p host:container) exposes a container port on the host."
echo "    4. Containers on different networks cannot reach each other — use this for isolation."
