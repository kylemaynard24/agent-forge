# NuGet

Package management for .NET. NuGet is to .NET what npm is to Node — the registry, the CLI, the dependency model. The Microsoft-hosted public registry is at [nuget.org](https://www.nuget.org/).

## Adding a package

```bash
dotnet add package Microsoft.Extensions.Logging
dotnet add package Microsoft.Extensions.Logging --version 8.0.0
```

This modifies the `.csproj`:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Extensions.Logging" Version="8.0.0" />
</ItemGroup>
```

`dotnet build` (or `dotnet restore`) downloads the package and its transitive dependencies into the global NuGet cache (`~/.nuget/packages/`). The cache is shared across projects, so a package downloaded once is reused.

## Versioning

A `Version` can be exact (`8.0.0`), a range (`[8.0.0,9.0.0)`), or a floating range (`8.0.*` for "latest 8.0.x"). Most projects pin to exact versions for build reproducibility.

For libraries you publish, use SemVer rigorously — `MAJOR.MINOR.PATCH`:
- MAJOR: breaking change.
- MINOR: backward-compatible feature.
- PATCH: backward-compatible fix.

## Central Package Management (CPM)

For solutions with many projects, you can declare versions once in a `Directory.Packages.props` file at the solution root:

```xml
<!-- Directory.Packages.props -->
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
  </PropertyGroup>
  <ItemGroup>
    <PackageVersion Include="Microsoft.Extensions.Logging" Version="8.0.0" />
    <PackageVersion Include="xunit" Version="2.6.0" />
  </ItemGroup>
</Project>
```

Then individual `.csproj` files reference packages without versions:

```xml
<PackageReference Include="Microsoft.Extensions.Logging" />
```

Strongly recommended for multi-project solutions — you no longer have to update version strings across N `.csproj` files when bumping a dependency.

## Source feeds

NuGet can pull from multiple feeds:

- **nuget.org** — the public registry. Default.
- **Azure Artifacts** — Microsoft's hosted private feed, common in Azure-shop enterprises for internal packages.
- **GitHub Packages** — alternative private feed.
- **Local file path or directory** — for local development of a package before publishing.

Configure with `nuget.config` (project or solution level):

```xml
<configuration>
  <packageSources>
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
    <add key="my-org" value="https://pkgs.dev.azure.com/.../_packaging/.../nuget/v3/index.json" />
  </packageSources>
  <packageSourceMapping>
    <!-- map specific packages to specific sources to prevent dependency confusion attacks -->
    <packageSource key="my-org">
      <package pattern="MyOrg.*" />
    </packageSource>
    <packageSource key="nuget.org">
      <package pattern="*" />
    </packageSource>
  </packageSourceMapping>
</configuration>
```

**Package source mapping** (added 2021) is a security feature: it forces specific package patterns to come from specific feeds, preventing "dependency confusion" attacks where an attacker uploads a malicious public package with the same name as your private one.

## Restoring in CI/CD

```yaml
# GitHub Actions step
- run: dotnet restore --locked-mode
```

`--locked-mode` requires a `packages.lock.json` file (created by `dotnet restore --use-lock-file`) and fails if the resolution differs. This is the equivalent of `npm ci` — it ensures CI builds the exact same dependency graph as local development.

## Publishing your own package

```bash
dotnet pack -c Release         # produces a .nupkg in bin/Release
dotnet nuget push path/to/MyPackage.1.0.0.nupkg --source nuget.org --api-key <key>
```

The `.csproj` controls the package metadata:

```xml
<PropertyGroup>
  <Authors>Your Name</Authors>
  <Description>Short package description.</Description>
  <PackageReadmeFile>README.md</PackageReadmeFile>
  <PackageLicenseExpression>MIT</PackageLicenseExpression>
  <Version>1.0.0</Version>
  <RepositoryUrl>https://github.com/...</RepositoryUrl>
</PropertyGroup>

<ItemGroup>
  <None Include="README.md" Pack="true" PackagePath="\" />
</ItemGroup>
```

## Common mistakes

- **Floating versions in production.** `Version="8.*"` saves you bumps but means CI can build a different version than local. Prefer pinned versions plus dependency-bot updates (Renovate, Dependabot).
- **Adding `*.runtime.*` packages directly.** These are usually transitive dependencies; if you find yourself referencing them explicitly, you're working around something — investigate.
- **Mixing analyzer packages and regular references.** Roslyn analyzer packages should use `<PackageReference Include="..." PrivateAssets="all" />` so they don't propagate to consumers of your library.
- **Not using a lock file.** Without `packages.lock.json`, restores can drift over time as transitive deps publish new versions.

## Where to next

- Topic `12-testing-with-xunit` — adding a test project and the testing packages you'll want.
