# Questions — Namespaces, projects, and `.csproj`

Three questions on project structure as architecture.

---

### Q1. Why does `Library.Application` define the `IBookRepository` interface even though `Library.Infrastructure` is the one that implements it? Couldn't the interface live in Infrastructure (alongside the implementation)?

**How to think about it:**

This is the **Dependency Inversion Principle** expressed as physical project structure. Where the interface lives controls the dependency direction in the build graph.

If `IBookRepository` lives in `Library.Application`, then:
- `Library.Application` defines: "I need a thing that satisfies this contract."
- `Library.Infrastructure` references `Library.Application` to implement the interface.
- The dependency arrow points: **Infrastructure → Application**. Application doesn't know Infrastructure exists.

If `IBookRepository` lived in `Library.Infrastructure`, then:
- `Library.Application` would have to reference `Library.Infrastructure` to use the interface.
- The dependency arrow points: **Application → Infrastructure**. Application now depends on Infrastructure, which means changes to the infrastructure layer can break the application layer.

The first arrangement (interface in the consumer's project) is what enables clean architecture / hexagonal architecture / ports-and-adapters. The application layer specifies the *shape* of dependencies it needs (the "ports"); the infrastructure layer adapts external systems to fit those shapes (the "adapters"). The infrastructure becomes a plug-in that satisfies an application contract — and you can swap in a different infrastructure (a fake for tests, a SQL-based one for prod, an HTTP one for a remote service) without touching the application.

The wrong-direction arrangement is the most common architecture mistake in junior C# code. It looks right at first glance — "the implementation defines the interface, the consumer uses it" — but it ties the consumer to a specific implementation strategy. Now you can't add a fake without referencing infrastructure, can't add a second implementation without modifying the application, can't change the infrastructure's interface without breaking everyone.

The senior take: **interfaces belong with the consumer, not the implementation**. The project that uses the interface owns it; the projects that implement it depend on the consumer to get the contract. This sounds backwards if you're used to "the lower layer defines what it provides" — but the directionality is intentional, and it's what makes the architecture survive change.

---

### Q2. The homework had `Library.Cli` reference all three lower-layer projects and act as the "composition root." What is a composition root, why is having exactly one important, and what goes wrong if it's spread across the codebase?

**How to think about it:**

A **composition root** is the single place in your application where concrete implementations are instantiated and wired together. `BookCatalogService` says "I need an `IBookRepository`"; the composition root says "here's the specific `InMemoryBookRepository` that should be passed to it." All the dependency-injection wiring lives there — typically `Program.cs` for an app, or the startup configuration for a web service.

Why one?

1. **Single source of truth for dependency configuration.** When you want to swap implementations (in-memory for SQL for production, fake for tests), you change one place. Spread the wiring across the codebase and you have to find every `new InMemoryBookRepository()` and update each.

2. **Keeps the application layer pure.** `Library.Application` doesn't know which `IBookRepository` it's getting — it just gets one. The composition root is the only code that needs to know "production uses SQL, tests use fakes." The application layer never references infrastructure.

3. **Makes the dependency graph explicit.** Reading the composition root tells you the entire dependency structure of your application. Reading scattered `new` calls across many files makes it impossible to see the whole graph.

4. **Lifetime management.** The composition root chooses lifetimes — singleton, transient, scoped (per-request). Centralizing this prevents subtle bugs where two parts of the code disagree on whether something should be one shared instance or one-per-call.

What goes wrong without one:

- **The "service locator" anti-pattern.** Code that needs a dependency calls a static `ServiceLocator.Get<IRepository>()` instead of receiving the dependency in its constructor. This hides dependencies (you can't see them by reading constructor signatures), couples the code to the locator, and makes testing painful.
- **`new` calls scattered everywhere.** Every class instantiates its own dependencies. You can't swap implementations because the choice is hardcoded in 200 places.
- **Configuration tangled with logic.** Decisions like "which implementation to use" end up mixed in with business logic, making both harder to read.

In modern .NET, the composition root is typically the `Program.cs` of an ASP.NET Core app (using `builder.Services.AddSingleton<IRepository, SqlRepository>()`) or the equivalent in a console app. The DI container does the wiring; you just declare what's wired to what. This centralization is the entire point — without it, you're back to tangled construction.

The senior heuristic: **construction logic lives in the composition root; business logic lives in the layers below.** If you find construction logic creeping into your domain or application layer (a `new SqlRepository()` somewhere it shouldn't be), pull it back to the root. The discipline pays off compounding when the time comes to test, swap implementations, or onboard new code.

---

### Q3. Multi-targeting (`<TargetFrameworks>net8.0;net9.0</TargetFrameworks>`) has obvious appeal — your library works for more consumers. What does it actually cost you, and when is it the right call?

**How to think about it:**

Multi-targeting builds your code separately for each listed target framework. The output `bin/` directory has a subfolder per target (`bin/Debug/net8.0/`, `bin/Debug/net9.0/`). Consumers reference the version that matches their own target.

The benefits:
- Single source of truth — one source tree, no separate "v8" and "v9" branches.
- Wider audience — anyone targeting net8.0 OR net9.0 can use your library.
- Conditional features — using `#if NET9_0_OR_GREATER` you can opt into newer APIs while keeping the older target functional.

The costs:

1. **Doubled build time.** Each target framework gets compiled separately. For a small library, negligible. For a large one, significant.
2. **Doubled testing.** You should test each target — APIs behave subtly differently across versions, and a test passing in net8.0 doesn't guarantee it passes in net9.0. CI gets longer.
3. **Conditional compilation complexity.** Code peppered with `#if` directives is harder to read and harder to reason about. Tools (refactoring, linting) sometimes struggle with conditionally-compiled code.
4. **Locked into the lowest common denominator.** The lowest target framework constrains the language features and APIs you can use unconditionally. Want to use a C# 12 feature freely? You'd have to drop net6.0 from your targets, since net6.0 ships with C# 10.
5. **Package size.** Your `.nupkg` includes assemblies for every target — bigger NuGet packages.

When is it right?

- **Libraries published as NuGet packages**, especially ones with broad audiences or older consumers. This is the textbook case — Microsoft's BCL extension packages multi-target back to .NET Standard 2.0 to support legacy .NET Framework callers.
- **Libraries during framework transitions** — when you want to support both the current LTS and the next LTS for a few months while consumers migrate.
- **NEVER for application code.** Apps target exactly one framework. They don't need to be packaged for multiple consumers.

When to skip:

- **Single-purpose libraries used only inside one application.** Just target the same framework as the app.
- **Libraries you control end-to-end** — if you can update the consumers, just bump them all to the same target.
- **Brand-new projects** — pick the latest LTS and stick with it; cross that bridge when there's a real second target needed.

The senior take: multi-targeting is a tool with real costs, not a "always do it for safety" default. The cost of multi-targeting a library that only serves one app is paying for flexibility you'll never use. The cost of NOT multi-targeting a public library is excluding consumers stuck on older runtimes. Match the tool to the audience: pick targets based on actual consumers, not hypothetical ones.
