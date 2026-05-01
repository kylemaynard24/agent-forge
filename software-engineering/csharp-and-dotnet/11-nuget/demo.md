# Demo — NuGet

CLI commands and concrete examples for the README. Run these at a shell.

## Adding and removing packages

```bash
# Inside a project directory
cd src/MyApp

# Add a package (latest version)
dotnet add package Microsoft.Extensions.Logging

# Add a specific version
dotnet add package Microsoft.Extensions.Logging --version 8.0.0

# Update to the latest within the same major
dotnet list package --outdated

# Remove a package
dotnet remove package Microsoft.Extensions.Logging
```

After `add`, the `.csproj` gains:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Extensions.Logging" Version="8.0.0" />
</ItemGroup>
```

## Restoring (usually implicit)

```bash
dotnet restore                      # restore all projects in current solution
dotnet restore --use-lock-file      # creates packages.lock.json for reproducibility
dotnet restore --locked-mode        # fails if packages.lock.json doesn't match
```

For CI: commit `packages.lock.json` and use `--locked-mode` so the build is reproducible.

## Listing what you depend on

```bash
dotnet list package                  # direct dependencies
dotnet list package --include-transitive   # all dependencies including transitive
dotnet list package --vulnerable           # known CVEs
dotnet list package --deprecated           # packages marked deprecated
dotnet list package --outdated             # newer versions available
```

The vulnerability and deprecation flags are critical for security hygiene — run them periodically (or in CI).

## Central Package Management

Create `Directory.Packages.props` at the solution root:

```xml
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
    <CentralPackageTransitivePinningEnabled>true</CentralPackageTransitivePinningEnabled>
  </PropertyGroup>
  <ItemGroup>
    <PackageVersion Include="Microsoft.Extensions.Logging" Version="8.0.0" />
    <PackageVersion Include="xunit" Version="2.6.0" />
    <PackageVersion Include="FluentAssertions" Version="6.12.0" />
  </ItemGroup>
</Project>
```

Individual `.csproj` files reference packages **without versions**:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Extensions.Logging" />
</ItemGroup>
```

Bumping a version is now a single change in `Directory.Packages.props` instead of N edits across N projects.

## Source mapping (security)

Create or edit `nuget.config` at the solution root:

```xml
<configuration>
  <packageSources>
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
    <add key="my-org" value="https://pkgs.dev.azure.com/.../_packaging/.../nuget/v3/index.json" />
  </packageSources>

  <packageSourceMapping>
    <packageSource key="my-org">
      <package pattern="MyOrg.*" />
    </packageSource>
    <packageSource key="nuget.org">
      <package pattern="*" />
    </packageSource>
  </packageSourceMapping>
</configuration>
```

Now `MyOrg.*` packages can ONLY be resolved from `my-org`. This prevents dependency-confusion attacks where an attacker uploads a malicious public package with a name matching your private one.

## Publishing your own package

```bash
# Build a .nupkg
dotnet pack src/MyLib -c Release -o ./packages

# Push to nuget.org
dotnet nuget push ./packages/MyLib.1.0.0.nupkg --source nuget.org --api-key $NUGET_KEY

# Push to a private feed
dotnet nuget push ./packages/MyLib.1.0.0.nupkg --source my-org --api-key $ORG_KEY
```

The `.csproj` for a publishable package should include metadata:

```xml
<PropertyGroup>
  <Authors>Your Name</Authors>
  <Description>Short description.</Description>
  <PackageReadmeFile>README.md</PackageReadmeFile>
  <PackageLicenseExpression>MIT</PackageLicenseExpression>
  <RepositoryUrl>https://github.com/...</RepositoryUrl>
  <Version>1.0.0</Version>
</PropertyGroup>

<ItemGroup>
  <None Include="README.md" Pack="true" PackagePath="\" />
</ItemGroup>
```
