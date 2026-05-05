# Homework — NuGet

Three exercises to make package management stick.

## Exercise 1 — Add packages and inspect

In any console project (a fresh one is fine):

1. Add `FluentAssertions` (latest version).
2. Add `Microsoft.Extensions.Logging` pinned to a specific version (pick `8.0.0`).
3. Add `Bogus` (a fake-data generator) — latest.
4. Run `dotnet list package --include-transitive` and observe which transitive dependencies came along.
5. Run `dotnet list package --vulnerable` and `--deprecated`. Note any findings.
6. Remove `Bogus` and confirm the transitive deps it brought are gone too.

## Exercise 2 — Adopt central package management

1. Create a fresh 3-project solution: `App` (console), `Lib` (classlib), `Tests` (xunit). All reference `FluentAssertions`.
2. Verify each `.csproj` has its own `<PackageReference Version=...>`.
3. Create `Directory.Packages.props` at the solution root with `<ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>` and one `<PackageVersion Include="FluentAssertions" Version="6.12.0" />`.
4. Strip the version attributes from each `.csproj`'s `<PackageReference>`.
5. `dotnet build` should still work.
6. Bump the version in `Directory.Packages.props` to a different version. Confirm all three projects pick it up without per-project edits.

## Exercise 3 — Publish a tiny package

1. Create a small classlib `MyOrg.HelloLib` with one public method `string Greet(string name)`.
2. Add package metadata to the `.csproj` (Authors, Description, Version, License).
3. `dotnet pack -c Release -o ./packages`.
4. Inspect the resulting `.nupkg` (it's a zip — `unzip -l ./packages/MyOrg.HelloLib.1.0.0.nupkg`).
5. Add a `README.md` to the project, mark it for packaging, repack, and confirm the README is included in the new `.nupkg`.

(Don't actually push to nuget.org for this exercise — just produce the package.)

## Done when

- [ ] You ran each `dotnet list package` flag and understood the output.
- [ ] Central package management is working in Exercise 2 — version bumps happen in one file.
- [ ] You produced a valid `.nupkg` in Exercise 3 with metadata and a README.
- [ ] You can articulate why central package management matters more as the number of projects grows.

## Bonus

- Configure `nuget.config` with `packageSourceMapping` for your test solution. Map `Microsoft.*` to nuget.org and `MyOrg.*` to a hypothetical private feed (just use a fake URL — the configuration is what matters).
- Use `dotnet pack` with `--include-symbols` and observe the `.snupkg` debug symbols package.
- Consume your `MyOrg.HelloLib.1.0.0.nupkg` from a different project by adding a local source: `dotnet nuget add source ./packages -n local; dotnet add package MyOrg.HelloLib`.

## Save to

`progress/<today>/working-folder/csharp-and-dotnet/11-nuget/`.

---

## Clean Code Lens

**Principle in focus:** Dependencies as Accepted Contracts; Narrow Over Broad

Every NuGet package you add is a contract your project accepts — and a surface area another team controls. A package that pulls in fifteen transitive dependencies is not just one dependency; it is sixteen contracts with sixteen different maintainers and sixteen different release schedules. Clean code at the dependency level means being intentional: prefer narrow packages that do one thing over broad frameworks that do many, and know exactly what you are accepting before you add a `<PackageReference>`.

**Exercise:** After completing Exercise 1, look at the transitive dependency list produced by `dotnet list package --include-transitive`. For each transitive package, ask: do I know what this package does? If a transitive dependency is doing something your own code could do in ten lines, note it — that is a smell that the direct dependency is broader than it needs to be. Then look at `Bogus` before and after removal and confirm exactly which transitive packages it brought in and then took back out.

**Reflection:** Central package management in Exercise 2 means version decisions live in one file. What does it say about a project's discipline if package versions are scattered across ten `.csproj` files, each potentially pinned to a slightly different version of the same library?
