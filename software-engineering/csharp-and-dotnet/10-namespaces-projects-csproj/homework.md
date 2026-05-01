# Homework — Namespaces, projects, and `.csproj`

Build a multi-project solution that demonstrates clean dependency direction.

## Build it

Create a solution `library-stack` with **four projects**:

1. **`Library.Domain`** — a `classlib`. Pure domain types: a `Book` record, a `BookId` value type. NO references to anything else.

2. **`Library.Application`** — a `classlib`. Application services: `BookCatalogService` with a method `IReadOnlyList<Book> Search(string query)`. Depends on `Library.Domain` AND on an interface `IBookRepository` *that lives in this project*.

3. **`Library.Infrastructure`** — a `classlib`. Implements `IBookRepository` with an in-memory `Dictionary`. Depends on `Library.Domain` and `Library.Application`. (This is where I/O concerns live in real apps.)

4. **`Library.Cli`** — a `console`. The composition root. Depends on all three above. Wires up `BookCatalogService` with the in-memory repository and runs a few queries.

5. **`Library.Domain.Tests`** — an `xunit` test project for the domain types. Depends only on `Library.Domain`.

## Done when

- [ ] Five projects, all in one `library-stack.sln`.
- [ ] `Library.Domain` has zero `ProjectReference` entries (it depends on nothing in your stack).
- [ ] `Library.Application` references only `Library.Domain`.
- [ ] `Library.Infrastructure` references `Library.Domain` and `Library.Application`.
- [ ] `Library.Cli` references all three.
- [ ] `Library.Domain.Tests` references only `Library.Domain`.
- [ ] `dotnet build` succeeds for the whole solution.
- [ ] `dotnet run --project src/Library.Cli` produces sensible search output.
- [ ] `dotnet test` runs the domain tests.
- [ ] All projects use file-scoped namespaces, nullable enabled, and implicit usings.

## Bonus

- Add a `Directory.Build.props` at the solution root with shared properties (`<TreatWarningsAsErrors>true</TreatWarningsAsErrors>`, `<LangVersion>latest</LangVersion>`). Verify it applies to all projects without being copied in each `.csproj`.
- Add a `Directory.Packages.props` and adopt central package management (no PackageReference Versions in individual projects).
- Multi-target `Library.Domain` to `net8.0;net9.0` and observe what changes in `bin/`.

## Save to

`progress/<today>/working-folder/csharp-and-dotnet/10-library-stack/`.
