# Namespaces, projects, and the `.csproj` file

How C# code is organized at the file/project/solution level, and what the modern SDK-style project file actually contains.

## Namespaces

Namespaces group types into hierarchical names to avoid collisions and signal organization.

```csharp
// File-scoped namespace (C# 10+, the modern form)
namespace MyApp.Domain.Orders;

public class Order { }
```

```csharp
// Older block-scoped form (still works, more nesting)
namespace MyApp.Domain.Orders
{
    public class Order { }
}
```

The file-scoped form removes one level of indentation and is the default in `dotnet new` templates since .NET 6. Use it.

Convention: namespaces mirror the folder structure under the project root. A type in `src/MyApp/Domain/Orders/Order.cs` lives in `MyApp.Domain.Orders`. Most IDEs enforce this with a refactor.

`using` directives at the top of a file pull names from a namespace into scope:

```csharp
using System;                      // for Console, etc.
using System.Collections.Generic;  // for List<T>, etc.
using MyApp.Domain.Orders;          // for Order

var order = new Order();
```

**Implicit usings** (C# 10+, default in new projects): the SDK auto-imports common namespaces (`System`, `System.Collections.Generic`, `System.Linq`, `System.Threading.Tasks`, etc.). You can disable with `<ImplicitUsings>disable</ImplicitUsings>` in the `.csproj` if you prefer explicit. Most teams leave it on.

**Global usings** (also C# 10+) let you declare a `using` once and have it apply to every file in the project:

```csharp
// in GlobalUsings.cs
global using MyApp.Domain.Orders;
global using static System.Math;
```

Useful for namespaces every file uses; overuse hides imports.

## The SDK-style `.csproj`

A modern `.csproj` is XML but very compact:

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <LangVersion>latest</LangVersion>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Extensions.Logging" Version="8.0.0" />
    <ProjectReference Include="..\MyApp.Domain\MyApp.Domain.csproj" />
  </ItemGroup>

</Project>
```

Notable elements:

- **`Sdk="Microsoft.NET.Sdk"`** — for libraries and console apps. For ASP.NET Core, use `Microsoft.NET.Sdk.Web`. For Blazor, etc., other variants. The SDK provides default targets and item inclusions.
- **`TargetFramework`** — `net8.0`, `net9.0`, etc. For library code that should work across multiple versions, use `<TargetFrameworks>net8.0;net9.0</TargetFrameworks>` (multi-targeting).
- **`Nullable`** — turns nullable reference types on/off. Always `enable` for new code.
- **`ImplicitUsings`** — controls auto-import of common namespaces.
- **`PackageReference`** — NuGet package dependencies. (Topic `11`.)
- **`ProjectReference`** — references to other projects in the same solution.

Files are auto-included by convention — `**/*.cs` under the project root unless excluded. You rarely need explicit `<Compile Include="...">` entries (which is a major improvement over old non-SDK-style projects).

## Solutions and projects

A **project** (`.csproj`) is one assembly (one `.dll` or `.exe` after build).
A **solution** (`.sln`) groups multiple related projects. Most non-trivial codebases have multiple projects.

A common layout for an Azure-shop service:

```
my-service/
├── my-service.sln
├── src/
│   ├── MyService.Api/                # ASP.NET Core entry point
│   │   └── MyService.Api.csproj
│   ├── MyService.Domain/             # Pure domain logic, no I/O
│   │   └── MyService.Domain.csproj
│   ├── MyService.Infrastructure/     # DB, external APIs, etc.
│   │   └── MyService.Infrastructure.csproj
│   └── MyService.Contracts/          # DTOs shared with clients
│       └── MyService.Contracts.csproj
├── tests/
│   ├── MyService.Domain.Tests/
│   └── MyService.Api.IntegrationTests/
└── infra/                            # Bicep, GitHub Actions
```

`MyService.Api` references `MyService.Domain` and `MyService.Infrastructure`. `MyService.Domain` references nothing (or only `MyService.Contracts`). The dependency direction enforces clean architecture: the domain knows nothing about the API or infrastructure.

## Common dotnet CLI commands

```bash
dotnet new console -n MyApp           # new console app
dotnet new classlib -n MyApp.Domain   # new library
dotnet new web -n MyApp.Api           # new ASP.NET Core web app
dotnet new sln -n MySolution          # new solution file
dotnet sln add src/MyApp/MyApp.csproj # add project to solution

dotnet build                           # build current project (or solution)
dotnet run                             # build and run
dotnet test                            # run tests
dotnet add package <PackageName>       # add a NuGet package
dotnet add reference <path-to-csproj>  # add a project reference
dotnet restore                         # restore NuGet packages (rarely needed; build does it)

dotnet publish -c Release              # produce a deployable
dotnet format                          # format code per .editorconfig
```

The `dotnet` CLI is your primary build tool — Visual Studio and Rider use it under the hood. Knowing it directly is essential for CI/CD scripts and Docker builds.

## Building for production

```bash
dotnet publish -c Release -o ./publish
```

This produces a `./publish/` directory with the assemblies + dependencies, ready to run with `dotnet ./publish/MyApp.dll` or to copy into a Docker image. For container builds, the `mcr.microsoft.com/dotnet/sdk` and `mcr.microsoft.com/dotnet/aspnet` images are the standard base images.

## Where to next

- Topic `11-nuget` — package management in detail.
