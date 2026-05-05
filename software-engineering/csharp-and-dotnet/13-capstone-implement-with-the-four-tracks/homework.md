# Homework — Capstone: implement with the four sprint subjects

The capstone exercise: build one small system in C# that touches all four sprint subjects. The point is integration — feeling how the language fits together with the conceptual material from each track.

## Build it

A small **document-summarizer service** that:

1. Accepts a directory of `.txt` files.
2. Reads each one (async, concurrent).
3. Asks a "summarizer" (you'll stub it — pretend it's a real LLM call) to produce a one-line summary.
4. Persists the summary to a JSON file alongside the original.
5. Prints stats at the end.

This is small enough to ship in 2-3 hours and exercises:
- **Agentic:** the summarizer is a stubbed LLM behind an interface (`ISummarizer`); the service treats it like a real agent dependency.
- **Architecture:** the service is split into interfaces (`IDocumentSource`, `ISummarizer`, `ISummaryStore`); the entry point is the composition root.
- **Design patterns:** Strategy (different summarizer implementations), Decorator (a `LoggingSummarizer` wrapping the real one), maybe Observer (events as documents complete).
- **DevOps-adjacent:** a `FakeKeyVaultClient` for retrieving the API key (modeling the real Azure Key Vault pattern even though this is fake).

## Required structure

A solution `summarizer-capstone` with these projects:

- `Summarizer.Core` (classlib): the interfaces, the records, the orchestrator service.
- `Summarizer.Stub` (classlib): the stub `ISummarizer` implementation that returns canned summaries.
- `Summarizer.App` (console): the composition root + entry point.
- `Summarizer.Core.Tests` (xunit): tests for the orchestrator using fakes.

## Required types

```csharp
// Summarizer.Core
public interface IDocumentSource
{
    IAsyncEnumerable<Document> ReadAllAsync(CancellationToken ct);
}
public record Document(string Path, string Content);

public interface ISummarizer
{
    Task<string> SummarizeAsync(string text, CancellationToken ct);
}

public interface ISummaryStore
{
    Task SaveAsync(string originalPath, string summary, CancellationToken ct);
}

public interface ISecretClient
{
    Task<string> GetAsync(string name, CancellationToken ct);
}

public class SummarizerService(
    IDocumentSource source,
    ISummarizer summarizer,
    ISummaryStore store)
{
    public async Task<SummaryStats> RunAsync(CancellationToken ct);
}

public record SummaryStats(int DocumentsProcessed, int FailuresCount, TimeSpan TotalTime);
```

## Required behavior

- `RunAsync` reads documents asynchronously, summarizes each (concurrently, capped at 4 in flight using `Parallel.ForEachAsync` with `MaxDegreeOfParallelism = 4`), and saves each summary.
- Failures during summarization don't abort the whole run — log and continue, increment `FailuresCount`.
- Cancellation is respected; an inflight cancellation completes documents already in progress and returns final stats.

## Required testing

Write at least 4 xUnit tests in `Summarizer.Core.Tests/`:
1. Empty source produces empty stats.
2. Multiple documents are all processed.
3. A summarizer that throws produces a recorded failure but doesn't abort.
4. Cancellation mid-run returns finalized stats with completed documents only.

Use **hand-written fakes** for `IDocumentSource`, `ISummarizer`, and `ISummaryStore` (no Moq).

## Required composition root

In `Summarizer.App/Program.cs`:
- Use a `FakeKeyVaultClient` to "retrieve" an API key (just print it — you're not using a real LLM).
- Wire up a real `FileSystemDocumentSource` reading from a directory passed via `args[0]`.
- Use the stub `ISummarizer` from `Summarizer.Stub`.
- Use a `JsonFileSummaryStore` that writes `<original-name>.summary.json` next to each input file.
- Run, print stats.

## Done when

- [ ] All projects build and the solution runs end-to-end on a directory of `.txt` files.
- [ ] All 4 tests pass (hand-written fakes, no mocking library).
- [ ] You can articulate which design pattern shows up in each interface and why.
- [ ] `SummarizerService` doesn't reference `Summarizer.Stub` directly — only the interfaces.
- [ ] Concurrent processing visibly speeds up the run (try with 20+ small files).

## Bonus

- Add a `LoggingSummarizer : ISummarizer` *decorator* that wraps the real one and times each call. Compose it in the composition root.
- Add `Microsoft.Extensions.DependencyInjection` to wire things up via a real DI container.
- Add `Microsoft.Extensions.Configuration` to read settings from `appsettings.json`.
- Replace the stub summarizer with a real Anthropic API call using `HttpClient`.

## Save to

`progress/<today>/working-folder/csharp-and-dotnet/13-capstone-summarizer/`.

---

## Clean Code Lens

**Principle in focus:** The Whole System as a Readable Conversation

At the capstone scale, clean code is not about individual variable names — it is about whether the entire system communicates its intent to a new C# developer. The interface names (`IDocumentSource`, `ISummarizer`, `ISummaryStore`) form a vocabulary. The class names (`SummarizerService`, `LoggingSummarizer`, `JsonFileSummaryStore`) extend that vocabulary with implementations. A new developer should be able to read `Program.cs`, follow the composition root, and understand the complete behavior of the system without asking you a single question.

**Exercise:** Hand your `Program.cs` and interface definitions (but not the implementations) to a hypothetical new C# teammate — or just read them yourself as if seeing them for the first time. Can they answer: what does this service do, what are its dependencies, and what would they need to swap out to test it in isolation? If any of those answers require reading an implementation file rather than an interface or name, that is your refactor target.

**Reflection:** The `LoggingSummarizer` decorator wraps the real `ISummarizer` without the service knowing. If you had not used the decorator pattern and had instead added logging directly inside `SummarizerService`, what would the class name have to become to honestly reflect that dual responsibility — and how would that name signal the design has gone wrong?
