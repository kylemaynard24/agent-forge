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

---

## Clean Code Lens

**Principle in focus:** Namespace Structure as a Map of the Domain

Namespaces are the highest-level names in a C# codebase — they are the first thing a new team member reads to understand what the system does. `Library.Domain`, `Library.Application`, and `Library.Infrastructure` are not folder labels; they are a statement about the architecture: here is the core model, here is the behavior built on it, here is the I/O layer that connects to the outside world. A namespace like `Library.Utilities.Helpers.Misc` communicates nothing about domain and everything about a codebase that grew without direction.

**Exercise:** Before running `dotnet build`, draw the four-project dependency diagram on paper — arrows flowing only in one direction, from `Cli` down to `Domain`. Now look at each namespace in your solution and check whether its name reflects the domain concept it represents (e.g., `Library.Domain`) or a technical role that has leaked into the name (e.g., `Library.DataAccessObjects`). The domain-reflecting names will still make sense five years from now; the technical-role names will feel dated as technology changes.

**Reflection:** `IBookRepository` lives in `Library.Application`, not `Library.Infrastructure`. Why does the interface belong in the layer that uses it, rather than the layer that implements it — and how does that placement reflect a rule about which layer should be "in charge" of the dependency direction?
