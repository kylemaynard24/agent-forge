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
