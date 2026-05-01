# Demo — Namespaces, projects, and `.csproj`

CLI commands and concrete examples to follow along with the README. Run these at a shell.

## A two-project solution

```bash
# Create a directory and solution
mkdir hello-stack && cd hello-stack
dotnet new sln -n hello-stack

# Create a class library and a console app
dotnet new classlib -n Hello.Domain -o src/Hello.Domain
dotnet new console  -n Hello.App    -o src/Hello.App

# Add both projects to the solution
dotnet sln add src/Hello.Domain src/Hello.App

# Make the console app reference the library
dotnet add src/Hello.App reference src/Hello.Domain

# Inspect the result
tree -L 3 -I bin -I obj    # if `tree` is installed; ls -R otherwise
cat src/Hello.App/Hello.App.csproj
cat src/Hello.Domain/Hello.Domain.csproj

# Build the whole solution
dotnet build

# Run the app
dotnet run --project src/Hello.App
```

## Explore a generated `.csproj`

A fresh `dotnet new console` looks like this — minimal:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>Hello.App</RootNamespace>
  </PropertyGroup>
</Project>
```

Things to notice:
- No explicit list of `.cs` files — they're auto-included.
- `<Nullable>` and `<ImplicitUsings>` enabled by default in modern templates.
- `<RootNamespace>` matches the folder/project name.
- `OutputType=Exe` means it produces an executable; library projects omit this (default is `Library`).

## File-scoped namespaces in code

```csharp
// src/Hello.Domain/Greeter.cs
namespace Hello.Domain;

public class Greeter
{
    public string Greet(string name) => $"Hello, {name}!";
}
```

Versus older block form (still works, more nesting):

```csharp
namespace Hello.Domain
{
    public class Greeter
    {
        public string Greet(string name) => $"Hello, {name}!";
    }
}
```

Use file-scoped (`namespace Foo;`) in modern code unless a single file genuinely needs multiple namespaces (rare).

## Multi-targeting

A library that wants to support both .NET 8 and .NET 9:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFrameworks>net8.0;net9.0</TargetFrameworks>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>
```

The build produces one assembly per target framework. Conditional code can detect the target:

```csharp
#if NET9_0_OR_GREATER
    // use net9-only API
#else
    // fallback for net8.0
#endif
```

Most application code targets one framework; multi-targeting is for libraries that want broad compatibility.

## Publishing for production

```bash
# A self-contained build for Linux x64 (no .NET runtime required on target machine)
dotnet publish src/Hello.App -c Release -r linux-x64 --self-contained -o ./publish

# A framework-dependent build (target machine needs .NET 8 runtime installed)
dotnet publish src/Hello.App -c Release -o ./publish

# The latter is what you use for Docker images that base on mcr.microsoft.com/dotnet/aspnet:8.0
```

The `./publish` directory contains everything needed to run; copy it into a Docker image or zip it and deploy.
