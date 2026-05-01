# Questions — Capstone

Three questions on the integration judgment of putting the four subjects together.

---

### Q1. The capstone has `SummarizerService` depending on three interfaces (`IDocumentSource`, `ISummarizer`, `ISummaryStore`). What's the architectural payoff for that splitting, and what would you lose by collapsing them into one big service that does everything?

**How to think about it:**

The split gives you four compounding benefits, each of which feels small in isolation but together change what the codebase can become.

**1. Independent testability.** With three interfaces, you can test `SummarizerService` against any combination of fakes — a fake source that yields specific docs, a fake summarizer that throws on the second call, a fake store that records what was saved. Tests focus on the orchestration logic of the service. With one big collapsed class, the tests have to set up the entire I/O surface (real files, real summarization) or use heavy mocks that constrain the implementation.

**2. Independent change.** When the summarizer changes (you swap from a stub to a real Anthropic call, then add prompt caching, then add fallback to a different model), only the `ISummarizer` implementation changes. `SummarizerService` doesn't move. When the storage format changes (JSON → SQL → blob storage), only `ISummaryStore` changes. The orchestrator is insulated.

**3. Composition over modification.** Want to add timing to every summarization call? Wrap the existing `ISummarizer` with a `LoggingSummarizer` decorator. Want to add caching? Same — `CachingSummarizer` decorator. The orchestrator doesn't know or care; it just receives an `ISummarizer`. With a collapsed class, every cross-cutting concern becomes a code change inside the class — and changes accumulate, and the class grows, and eventually nobody understands all of it.

**4. Honest dependencies.** Each interface signals exactly one capability. A reader of `SummarizerService`'s constructor immediately knows it needs three things: a source of documents, a summarizer, a store. They can't accidentally use it for things outside that contract because the contract is the constructor.

What you'd lose by collapsing:
- The class becomes a god class. Every change touches it.
- Testing becomes integration-style — slower, less precise.
- Cross-cutting concerns (logging, retries, caching, instrumentation) get baked in instead of composed in.
- Reuse drops to zero — the service's logic is entangled with its specific dependencies.

The senior framing: **interfaces define seams**. Seams are where you can change one thing without touching another. The cost of a seam is one extra interface declaration and one extra class to wire up. The benefit is everything you can change at that seam without breaking everything else. Most non-trivial code benefits from more seams than the author originally thought it needed; rarely does it benefit from fewer.

The deeper version: each of those interfaces is also a *contract you're committing to*. Adding a method to `ISummarizer` later is a breaking change for every implementation. Splitting carefully — small interfaces, focused capabilities — keeps each contract narrow enough to evolve. Wide interfaces are wide commitments.

---

### Q2. The capstone deliberately uses Strategy (the swappable `ISummarizer`), Decorator (the `LoggingSummarizer` wrapper, in the bonus), and constructor injection throughout. Why are these patterns natural fits for the kind of system you're building, and what would NOT be a good fit here?

**How to think about it:**

Each pattern earns its place by addressing a real design pressure in this system.

**Strategy fits because the summarizer is genuinely interchangeable.** You'll have at minimum a stub for tests and a real implementation for production. You'll likely add a third — a different LLM provider, a fallback when the primary is down, a cached version. The variation is "how does summarization happen?" — exactly the question Strategy answers. Defining `ISummarizer` and accepting it via constructor lets all those variations slot in without changes elsewhere.

**Decorator fits because cross-cutting concerns naturally wrap.** Logging, timing, retries, caching, rate-limiting — each of these is *additional behavior around the same operation*. They don't replace summarization; they augment it. The decorator pattern (a class implementing the same interface, holding an inner instance, adding behavior around `inner.SummarizeAsync(...)`) is exactly this shape. You can stack decorators (`new TimingDecorator(new RetryDecorator(new CachingDecorator(real)))`) and get all the behaviors, in any order, without modifying the underlying summarizer.

**Constructor injection fits because the orchestrator's dependencies are stable for its lifetime.** Once you build a `SummarizerService`, you use the same source, summarizer, and store for the whole run. Constructor injection makes those dependencies explicit at construction time and immutable thereafter — easier to reason about than passing them on every method call.

What WOULDN'T be a good fit:

- **Singleton pattern.** The summarizer service isn't a singleton — you might want different instances with different configurations. Don't reach for `static` or singleton-style "there's only one" patterns when there's no genuine reason for one. Singletons are the hardest pattern to remove later because every caller depends on the global access path.

- **Observer/events for the document processing flow.** Events make sense when you have many subscribers interested in a single publisher's notifications. The capstone's flow is linear (read → summarize → save), not pub/sub. An event-driven version would add complexity (event handler registration, async event invocation, error handling) without benefit. Use sequential async code instead.

- **Visitor pattern.** Visitor solves "I have a closed type hierarchy and an open set of operations" — adding new operations without modifying the type hierarchy. The capstone has neither a closed type hierarchy nor an open set of operations on documents. Reaching for Visitor would be pattern-for-pattern's-sake.

- **Repository over `ISummaryStore`.** "Repository" in the GoF / DDD sense is for collections of entities you query and modify (find by id, query by predicate, save, delete). Saving summaries is just a persistence operation, not a queryable collection. Calling it `IRepository<Summary>` would imply richer semantics (Get, Find, etc.) the system doesn't actually need. The narrower `ISummaryStore` with one method is more honest.

The senior take: **patterns are tools that match design pressures, not goals to achieve**. Strategy fits because there's real variation. Decorator fits because there are real cross-cutting concerns. Singleton, Observer, Visitor, Repository would be patterns inserted to "be sophisticated" — and would each carry costs (complexity, indirection, harder testing) without paying for themselves. The discipline is to leave the codebase pattern-free until a concrete pressure justifies one.

---

### Q3. The capstone wraps a `FakeKeyVaultClient` to model how the production system would use Azure Key Vault. Why bother modeling it with a fake when you're not actually calling Key Vault, and what does this teach about how to design for production-readiness from the start?

**How to think about it:**

The fake exists for two reasons, both load-bearing.

**1. The interface forces you to design for the real-production pattern from day one.** When `Summarizer.App` accepts an `ISecretClient` (even satisfied by a fake), the orchestrator and downstream code never see API keys hardcoded in source. The "happy path" is "ask the secret client for the key" — exactly the pattern you'd use against real Key Vault. When the time comes to swap in the real Azure SDK client, the change is one line at the composition root: `ISecretClient secrets = new SecretClient(new Uri("https://..."), new DefaultAzureCredential());`. No code in the orchestrator changes.

Compare to the alternative: "I'll just hardcode the key in `Program.cs` for now and refactor later." Now every part of the code that needs the key reaches for `Program.ApiKey`. Months later, when you finally wire up Key Vault, you have to find every reach and update it. Worse, the temporary key has been committed to git; rotating it doesn't help because git history preserves it. The "for now" is permanent.

**2. The fake makes the interface testable without external dependencies.** Production tests can run against the fake; they don't need real Key Vault credentials, network access, or rate limits. The interface contract is enforced by the test setup; deviations from the contract show up as test failures, not production runtime exceptions.

What this teaches about designing for production-readiness:

- **Identify the production patterns early.** Secret management, observability, retry policies, cancellation, configuration — these are production realities even when your code is a console-app prototype. Sketch them as interfaces from the start; satisfy them with fakes.
- **The interface IS the design.** The shape of the `ISecretClient` interface (one async method that takes a name and a CT) is intentionally aligned with the real Azure SDK client. When you swap in the real implementation, the consumer code doesn't change because the interface anticipates the production reality.
- **Fakes are NOT the implementation.** They're scaffolding to test against and to defer real wiring without paying the cost of indirection later. They live in test projects (or clearly-marked "Stub" projects) so nobody mistakes them for production code.
- **The composition root is where production becomes real.** `Program.cs` (or `Startup.cs`) is the only place that knows about real implementations. Swapping fake → real is one line there. The further this knowledge spreads from the composition root, the harder swapping becomes.

The senior pattern: **build the production-shaped seam from day one, even when you can satisfy it with a fake**. The cost of the seam is one interface declaration. The cost of NOT having it is the day you finally need to wire up the real service and discover that knowledge of the fake is baked into 30 places.

The deeper principle: **every external dependency in production code should be behind an interface owned by the consumer**. The real Azure SDK client is *one* implementation of that interface. The fake is another. The integration test environment might be a third. The test environment might be a fourth. The pattern isn't "interface in case I need to swap" — the pattern is "I will need to swap (for tests, for environments, for vendor changes), so the interface earns its space immediately."

The capstone teaches this in miniature. The same pattern, scaled up, is how production-grade .NET-on-Azure systems are organized: every integration is an interface, the composition root wires real implementations in production and fakes in tests, and the system can be reasoned about layer by layer without any single component knowing the entire stack.
