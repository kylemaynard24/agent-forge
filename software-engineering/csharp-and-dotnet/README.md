# C# and .NET

A practical C# track structured for someone who already programs but wants modern .NET (`net8.0`+) idioms — and a foundation that's deep enough on classes, interfaces, generics, async, and LINQ that the apply tasks across the four sprint subjects (agentic workflows, software architecture, design patterns, devops) can be done in C# from day one.

Modern .NET (the cross-platform runtime, formerly .NET Core, now just "**.NET 8**" / "**.NET 9**") is what most Azure shops actually deploy today. **.NET Framework** (the older Windows-only 4.x line) is mostly legacy maintenance work — when this track says ".NET" it means the modern runtime unless explicitly noted.

## How this track is shaped

The early topics (`00-quick-syntax-catchup`) exist for completeness but are intentionally terse — they're for non-beginners who already write code in another language and just need C#'s syntax for variables, conditionals, loops, and methods. **If you've already shipped code in another language, start at `01-classes-basics`.** That's where the C#-specific judgment begins.

Topics from `01` onward are deeper. They cover not just *how* a feature works but *when to use it*, *what mistakes look like*, and *how it interacts with the rest of the .NET ecosystem*. Each substantive topic has a README that earns its space on the conceptual model — read it slowly, then run the demo (where present).

## Contents

| # | Topic | What it covers |
|---|---|---|
| `00` | [quick-syntax-catchup](00-quick-syntax-catchup/) | Variables, types, conditionals, loops, methods. Single short README; skip if you know the syntax. |
| `01` | [classes-basics](01-classes-basics/) | Class anatomy: fields, constructors, methods, instance vs static, the modern minimal class. **Start here if you're not new to programming.** |
| `02` | [properties-and-encapsulation](02-properties-and-encapsulation/) | Auto-properties, init-only, required members, access modifiers, why C# folds get/set into the language. |
| `03` | [inheritance-and-polymorphism](03-inheritance-and-polymorphism/) | `virtual`/`override`/`sealed`, base calls, when inheritance helps and when it bites. |
| `04` | [interfaces-and-abstract-classes](04-interfaces-and-abstract-classes/) | Interfaces vs abstract classes, default interface methods (C# 8+), explicit implementations, when to reach for which. |
| `05` | [generics](05-generics/) | Generic types and methods, constraints, variance, common .NET generics (`List<T>`, `Dictionary<K,V>`, `IEnumerable<T>`). |
| `06` | [collections-and-linq](06-collections-and-linq/) | The collection hierarchy, lazy evaluation in `IEnumerable<T>`, LINQ method syntax, performance traps. |
| `07` | [delegates-events-functional](07-delegates-events-functional/) | `Func<>`/`Action<>`, lambdas, events, the bridge from OO C# to functional C#. |
| `08` | [async-and-await](08-async-and-await/) | `Task`/`Task<T>`, `await`, the synchronization context, `ConfigureAwait(false)`, cancellation tokens, common async pitfalls. |
| `09` | [exceptions-and-using](09-exceptions-and-using/) | Exception hierarchy, when to catch, `IDisposable` + `using`, modern `using` declarations. |
| `10` | [namespaces-projects-csproj](10-namespaces-projects-csproj/) | File-scoped namespaces, the SDK-style `.csproj`, `TargetFramework`, multi-targeting, project references. |
| `11` | [nuget](11-nuget/) | Package management, `dotnet add package`, version pinning, central package management, source feeds. |
| `12` | [testing-with-xunit](12-testing-with-xunit/) | xUnit basics, `Fact` vs `Theory`, async test patterns, what to mock and what not to. |
| `13` | [capstone-implement-with-the-four-tracks](13-capstone-implement-with-the-four-tracks/) | How to apply C# to apply tasks in each of the four sprint subjects. |

## How to use this with `/daily-tasks`

The four sprint subjects' apply tasks now default to C# (devops's Bicep work stays Bicep — IaC tooling is its own thing). The apply task tells you what to build; this track tells you how the language idioms work. When the daily todo's apply task says "implement X with `interfaces`," topic `04` here is where you go for depth.

You can also focus a specific day on this track with `/daily-tasks csharp-and-dotnet` once the area is registered — useful when you want to deliberately study a single C# concept rather than apply it incidentally.

## Working notes

- **Modern C# idioms preferred throughout.** Examples use file-scoped namespaces, top-level statements (where readable), records, pattern matching, init-only properties, primary constructors (C# 12+), `required` members. Older C# (Framework-style) syntax is mentioned only when it differs meaningfully from modern.
- **Nullable reference types are on.** Examples assume `<Nullable>enable</Nullable>` in the `.csproj` (the default for `dotnet new` since .NET 6). When a parameter or return value can be `null`, it's marked with `?`. This is the modern default; learn it from the start.
- **No async-everything cargo culting.** Async is for I/O and long-running waits, not for CPU-bound code. The `08-async-and-await` README spends time on when *not* to use async.
- **The .NET ecosystem is huge.** This track covers C# the language and the runtime essentials. ASP.NET Core (web), Entity Framework Core (ORM), and Blazor (UI) each merit their own deep tracks — they're not covered here. Add them later if your work goes that direction.
