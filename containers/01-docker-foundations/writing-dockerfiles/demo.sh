#!/usr/bin/env bash
# demo.sh — Writing Dockerfiles
# Run: bash demo.sh
# Requires: Docker installed and running
#
# What this demo proves:
#   1. Naive Dockerfile (COPY . . first) busts the dependency cache on every code change
#   2. Optimized Dockerfile (deps first) keeps the dependency layer cached
#   3. Multi-stage build dramatically reduces final image size
#   4. Running as non-root is a 3-line Dockerfile change
#
# Note: This demo creates a minimal fake .NET project in /tmp to demonstrate
#       the concepts without requiring an existing application. The patterns
#       apply identically to real projects.

set -euo pipefail

WORKDIR=$(mktemp -d)
echo "Working in temp directory: $WORKDIR"

# =========================================================
# Set up a minimal fake .NET project to build against
# =========================================================
echo ""
echo "=== Setup: creating a minimal fake project ==="

mkdir -p "$WORKDIR/src"

cat > "$WORKDIR/src/MyApp.csproj" << 'EOF'
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
</Project>
EOF

cat > "$WORKDIR/src/Program.cs" << 'EOF'
Console.WriteLine("Hello from containerized .NET!");
EOF

# =========================================================
# NAIVE Dockerfile: COPY . . before restore
# =========================================================
cat > "$WORKDIR/Dockerfile.naive" << 'DOCKERFILE'
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# BAD: We copy everything before restoring dependencies.
# Any change to ANY file (even a comment in README) busts the restore layer.
COPY src/ .
RUN dotnet restore
RUN dotnet publish -c Release -o /published

# Runtime image — but we are using the SDK image, not the runtime image.
# This ships 1.1GB of SDK into production.
FROM mcr.microsoft.com/dotnet/sdk:8.0
WORKDIR /app
COPY --from=build /published .
# Running as root — no USER instruction
CMD ["dotnet", "MyApp.dll"]
DOCKERFILE

# =========================================================
# OPTIMIZED Dockerfile: deps first, multi-stage, non-root
# =========================================================
cat > "$WORKDIR/Dockerfile.optimized" << 'DOCKERFILE'
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# GOOD: Copy only the project file first and restore.
# This layer is cached until MyApp.csproj changes — not on every code change.
COPY src/MyApp.csproj .
RUN dotnet restore

# NOW copy the rest of the source code.
# Changing Program.cs only busts layers from here onward — restore is still cached.
COPY src/ .
RUN dotnet publish -c Release -o /published

# Stage 2: Runtime — only the ASP.NET runtime, not the SDK
FROM mcr.microsoft.com/dotnet/runtime:8.0 AS runtime
WORKDIR /app

# Copy only the published output from the build stage.
# No SDK, no source code, no intermediate artifacts in this image.
COPY --from=build /published .

# Non-root: the dotnet runtime image provides a built-in 'app' user.
USER app

CMD ["dotnet", "MyApp.dll"]
DOCKERFILE

# =========================================================
# Build both and compare
# =========================================================
echo ""
echo "=== 1. Build the NAIVE image (first build — cold cache) ==="
time docker build -t demo-naive:v1 -f "$WORKDIR/Dockerfile.naive" "$WORKDIR" 2>&1 | grep -E "^(#|Step|=>|CACHED|ERROR)"

echo ""
echo "=== 2. Build the OPTIMIZED image (first build — cold cache) ==="
time docker build -t demo-optimized:v1 -f "$WORKDIR/Dockerfile.optimized" "$WORKDIR" 2>&1 | grep -E "^(#|Step|=>|CACHED|ERROR)"

echo ""
echo "=== 3. Simulate a code change (update Program.cs) ==="
cat > "$WORKDIR/src/Program.cs" << 'EOF'
Console.WriteLine("Hello from containerized .NET — version 2!");
EOF

echo ""
echo "=== 4. Rebuild NAIVE after code change ==="
echo "--- Watch: the restore step will NOT be CACHED — it reruns on every code change. ---"
time docker build -t demo-naive:v2 -f "$WORKDIR/Dockerfile.naive" "$WORKDIR" 2>&1 | grep -E "^(#|Step|=>|CACHED|ERROR)"

echo ""
echo "=== 5. Rebuild OPTIMIZED after code change ==="
echo "--- Watch: the restore step WILL be CACHED — only the COPY and publish steps rerun. ---"
time docker build -t demo-optimized:v2 -f "$WORKDIR/Dockerfile.optimized" "$WORKDIR" 2>&1 | grep -E "^(#|Step|=>|CACHED|ERROR)"

echo ""
echo "=== 6. Compare image sizes ==="
echo "--- The naive image ships the full .NET SDK (~820MB). ---"
echo "--- The optimized image ships only the runtime (~220MB). ---"
docker images --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}" | grep demo-

echo ""
echo "=== 7. Verify the optimized image runs as non-root ==="
docker run --rm demo-optimized:v2 whoami 2>/dev/null || \
  docker run --rm --entrypoint whoami demo-optimized:v2 || \
  echo "(whoami not available in minimal runtime image — check with: docker inspect demo-optimized:v2 --format '{{.Config.User}}')"
docker inspect demo-optimized:v2 --format 'Configured user: {{.Config.User}}'

echo ""
echo "=== 8. Clean up ==="
docker rmi demo-naive:v1 demo-naive:v2 demo-optimized:v1 demo-optimized:v2 2>/dev/null || true
rm -rf "$WORKDIR"

echo ""
echo "--- Done. Key takeaways:"
echo "    1. COPY deps manifest → RUN restore → COPY source → RUN build = cached deps on every code change."
echo "    2. Multi-stage builds: build big, ship small. SDK in stage 1, runtime in stage 2."
echo "    3. USER instruction in the runtime stage = non-root in production."
echo "    4. Pin your FROM tags — never use :latest in a production Dockerfile."
