# Questions — Classes basics

Four questions on the *judgment* of class design, not the syntax. The reasoning is where the senior-engineer skill lives.

---

### Q1. Why did the homework require `BankAccount` to have a private constructor and a public static factory method (`Open`), instead of just a public constructor?

**How to think about it:**

Constructors have one structural weakness: they must return an instance of exactly the type whose name you used (`new BankAccount(...)` returns a `BankAccount`, never a subtype, never null, never a different type). They also have a fixed name (the class name) — so you can't easily have two "construction paths" with the same parameter shape but different intents.

A static factory method gives you four things constructors don't:

1. **A meaningful name.** `BankAccount.Open(...)` describes what's happening; `new BankAccount(...)` doesn't. When the class has multiple ways to construct, named factories disambiguate them: `Account.Open()`, `Account.LoadFromSnapshot()`, `Account.RestoreFromArchive()` are all "create an account" but mean different things.

2. **The ability to return null or a different type.** A factory can return null if construction is impossible (or better: return a result type). It can also return a *subtype* — `Shape.Create(circleSpec)` could return a `Circle`, `Shape.Create(squareSpec)` a `Square`, both typed as `Shape`. Constructors can't do this.

3. **The ability to do work before allocation.** A factory can validate inputs, look up cached instances, perform asynchronous setup, etc. Constructors can throw but otherwise are constrained to construct unconditionally.

4. **Testability.** A test can subclass `BankAccount` (if not sealed) and override the factory's behavior. Constructors are harder to mock.

The cost of factory methods is the indirection — readers have to learn that `new BankAccount(...)` doesn't work, they have to use `BankAccount.Open(...)`. For most types this is overkill; you don't need a factory for `Money`. Reach for factories when the construction has notable behavior beyond field assignment, or when you want the constructor's name to tell a story.

---

### Q2. The homework used `Money` as a `record` and `AccountId` as a `record struct`. Why not both as records, or both as record structs?

**How to think about it:**

`record` (alias for `record class`) is a **reference type** — instances live on the heap, variables hold references, equality compares values rather than references. `record struct` is a **value type** — instances are stored inline in their containing memory (stack for locals, embedded in the heap object that owns them), copied on assignment, with the same value-equality behavior.

The choice between them is a memory-and-cost trade-off:

- **Reference types** are cheap to pass around (you pass a reference, not the data) but allocate on the heap (which costs GC pressure).
- **Value types** avoid heap allocation but get *copied* every time they're assigned, passed to a method, or returned. Copying a small value type is cheap; copying a large one (lots of fields) is expensive.

`Money` has two properties (a `decimal` and a `string`). Total size is non-trivial — a `decimal` is 16 bytes, a `string` is a reference (8 bytes). If `Money` were a struct, every method call passing a `Money` would copy 24 bytes. Across millions of calculations (a financial system's normal workload) those copies add up. Worse, `Money` is the kind of value you might want to compare for reference identity in some scenarios — and value types don't have a reference identity. So `record class`.

`AccountId` wraps a single `Guid` (16 bytes). It's an identity — passed everywhere as a parameter, used as a dictionary key, almost never modified. Making it a struct means: no heap allocation per ID (huge win when you create lots of them), and no risk of accidentally treating two equal IDs as different (which a class with reference equality would do unless you implement `Equals`/`GetHashCode` — `record` does this for you, but a struct does too AND avoids the heap). For small identity-shaped types, `record struct` is the better fit.

The general rule: value type when **small (≤16 bytes), immutable, value-semantic, frequently allocated**. Reference type otherwise. The framework's own design follows this — `Guid` is a struct, `DateTime` is a struct, but `String` is a class.

---

### Q3. Why does the constructor for `Money` validate `Amount >= 0` and throw on bad inputs, instead of returning a special `InvalidMoney` value or letting the caller deal with it later?

**How to think about it:**

This is the **constructor-invariant** principle, and it's one of the most consequential ideas in OO design.

The premise: when an instance of a class exists, it should be in a valid state. *Always*. Not "valid most of the time and the caller is supposed to check"; valid by construction. If the constructor accepts garbage and produces a half-broken instance, every consumer of that instance has to defensively check whether it's actually valid before using it. They won't all remember. The bugs come months later, far from the construction site, and they're hell to track down.

By validating in the constructor and throwing on bad input, you guarantee: anywhere downstream that has a `Money` reference, that `Money` is valid. The caller of the constructor knows immediately if their inputs were wrong (via the exception). The check happens once, at the boundary, not at every consumer.

The alternative — accepting invalid inputs and producing an `InvalidMoney` sentinel value or a flag like `IsValid` — pushes the validation burden to every reader. Every method that takes a `Money` now has to check `IsValid` first, and forgetting one such check is a silent bug. This is the same anti-pattern as returning null from a method that "shouldn't" return null and hoping callers handle it.

When does this principle bend? When the validation is **expensive** (a constructor that does I/O is a smell), when the failure is **expected as part of normal flow** (don't throw on a missing dictionary key — that's what `TryGetValue` is for), or when you genuinely have no input to validate (a parameterless constructor on a builder that fills in fields piecemeal — though even there, the *built result* should be validated).

The senior-engineer move: design types so that **invalid states are unrepresentable**. If `Money.Amount` can never be negative (because the constructor enforces it), then no code in the entire system needs an "is the amount valid?" check ever again. The compiler and the type system carry the load.

---

### Q4. The homework instructed you to make `AccountRegistry` a `static class` with a `Dictionary` field. What's the trade-off you accepted by choosing `static`?

**How to think about it:**

A `static class` gives you a single, process-global container of state. The advantages are: zero ceremony at the call site (`AccountRegistry.Register(...)` works from anywhere with no setup), no need to pass references around, and a clear architectural signal that there's exactly one of these in the program.

The cost is **testability** and **reasoning under concurrency**.

**Testability** suffers because static state persists across tests in the same test run. If `Test1` registers an account, `Test2` sees it (in the same test class, in xUnit). You can work around this with explicit reset methods (`AccountRegistry.Clear()` called in test setup), but it's brittle — forget once and you have a flaky test that fails only sometimes. Instance-based state with dependency injection avoids this entirely: each test creates a fresh `AccountRegistry` instance, no sharing.

**Reasoning under concurrency** suffers because a single shared `Dictionary` accessed from multiple threads needs locking (`ConcurrentDictionary`, or explicit `lock`). Static state is shared by definition; instance state can be scoped (one instance per request, per session, per user, etc.) — letting you reason about each instance in isolation.

For a small console-app demo (the homework's scope), `static` is a defensible shortcut — there's exactly one process, no concurrency concerns, no test sharing problems. For production code, the same need (a registry of accounts) almost always becomes an injected service: `IAccountRegistry` interface, an in-memory implementation for tests, a SQL implementation for prod, registered with the DI container at startup.

The deeper question hiding here: when is global state acceptable? The answer: when the *thing being held* is genuinely process-wide and there's no scenario where you'd want a second instance. Configuration is sometimes like this. Logging often is. Most domain state is not — even if it *feels* singular ("there's only one user database"), wrapping it in an interface buys you testability and the ability to swap the implementation. The senior move: prefer instance + interface + injection, and reach for static only for things that are genuinely stateless utilities (`Math.Sqrt`, `Path.Combine`).
