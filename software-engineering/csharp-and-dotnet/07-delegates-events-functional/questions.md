# Questions — Delegates, events, and functional C#

Three questions on the design judgment behind first-class functions in C#.

---

### Q1. The `OrderProcessor.Process` method took its strategies as `Func<>`/`Action<>` parameters instead of as a single-method interface like `IValidator`/`IPricer`/`IAuditor`. When is each form the right pick?

**How to think about it:**

Both forms achieve the same architectural goal: the consumer (`OrderProcessor`) doesn't know the concrete logic; the caller injects it. The choice is about **weight, reusability, and testability** — and the right answer depends on context.

**Func/Action wins when:**
- The strategy has **one method** with a simple signature.
- You're composing many small strategies that get combined ad-hoc.
- The strategies are usually anonymous (lambdas defined at the call site).
- You don't need the strategy to be discoverable by name in the codebase or to share state with related strategies.

**Interface wins when:**
- The strategy has **multiple related methods** (a real "role" the type plays).
- You want strategies to be discoverable, named, registerable in a DI container.
- You want to attach metadata (attributes), logging, lifecycle (IDisposable), or other capabilities to the strategy.
- You expect a small fixed set of named implementations rather than ad-hoc lambdas.
- You want test mocks to be easy to write with mocking libraries (which excel at interfaces).

The Order-processor case is borderline. Three single-argument functions is fine as Func/Action — the call site is concise (`processor.Process(order, MyValidator, MyPricer, MyAuditor)`), and lambdas work for one-off cases. But the moment you need multiple methods (validators that have a "validate" AND a "validation rule description" method), Func/Action breaks down — you'd need to pass two delegates that conceptually belong together. Then the interface form is clearly better.

The senior heuristic: **start with Func/Action when the strategy is a single verb. Promote to an interface when the strategy gains a second related responsibility, or when you want it registerable in your DI container.** The friction of refactoring is small (extract a class with one method that wraps the Func), so don't over-engineer ahead of the need.

The deeper point: C# is multi-paradigm. The functional form (Func/Action) and OO form (interface + concrete) are equally legitimate; idiomatic modern C# uses both. Pick based on the shape of the strategy, not by a "always interfaces" or "always Func" rule.

---

### Q2. The homework's `StopwatchDisplay` had to implement `IDisposable` to unsubscribe from events. Why does forgetting to unsubscribe cause memory leaks in C#, even though C# has garbage collection?

**How to think about it:**

Garbage collection works by reachability: an object is collected when nothing reachable from a root holds a reference to it. Events introduce a non-obvious reference: **the event publisher holds a reference to every subscriber** (because the event is implemented as a multicast delegate, which holds a list of `Target` references for every `+=`'d handler).

Concretely: when you write `stopwatch.StartedRunning += display.OnStarted`, what happens is the stopwatch's internal delegate list now contains a pointer to `display`. As long as the stopwatch is alive, the display is reachable through that pointer — and therefore the GC will not collect the display, even if your code has dropped its own reference to it.

This produces the classic "GC won't collect this thing that should be dead" bug:

1. Long-lived publisher (the stopwatch is registered globally, lives for the whole process).
2. Many short-lived subscribers (display widgets, view models, request handlers) come and go.
3. Each subscriber registers via `+=`. None unregisters via `-=`.
4. The publisher's delegate list grows unbounded. Every "dead" subscriber is still reachable through the publisher.
5. Memory grows monotonically. The GC can't help — these objects ARE reachable.

This is one of the most common "managed memory leak" patterns in long-running .NET processes (services, UI apps that stay open for hours).

The fixes:

1. **Always pair `+=` with `-=`.** Use `IDisposable` to make the cleanup automatic with `using`.
2. **Weak event patterns.** Frameworks (WPF, ReactiveUI) provide weak-event managers where the publisher holds weak references to subscribers — they can be collected even if still subscribed. More complex; usually overkill.
3. **Don't use events for long-lived publisher / short-lived subscriber relationships.** Use a different pattern (observer with explicit handle, message bus with subscription tokens, reactive streams).

The senior take: events are the right tool when the publisher and subscribers have **roughly the same lifetime** (like a window and its child controls — they're created together and disposed together). When lifetimes diverge, events become a leak vector. The discipline of "always unsubscribe" is the cheapest fix; the more architectural fix is to question whether events were the right primitive in the first place.

---

### Q3. The README mentioned that `async void` is reserved for event handlers and is a footgun otherwise. Why is `async void` so dangerous, and what specifically goes wrong?

**How to think about it:**

`async void` is a method that's `async` but returns `void` instead of `Task`. The shape works syntactically, but it breaks several guarantees that `async Task` provides.

The problems:

1. **Exceptions are unhandled.** When an `async Task` method throws, the exception is captured in the returned `Task`. The caller's `await` re-throws, or the caller can inspect `task.Exception`. With `async void`, there's no `Task` — the exception is raised on whatever `SynchronizationContext` the method was started on. In a console app or service, this typically **crashes the process** (the unhandled exception trips an `AppDomain.UnhandledException` handler that, by default, terminates).

2. **Cannot be awaited.** The caller has no way to know when the method finishes. If you call an `async void` method, the call returns immediately, but the work continues in the background — and the caller has no handle to wait for it. This breaks any code that needs to know "is the work done?"

3. **Cannot be tested with the standard async-test patterns.** xUnit and similar frameworks expect tests that return `Task`; an `async void` test can't be awaited by the framework, so the framework reports it as passing the moment the synchronous part finishes — even if the async part throws or hangs.

4. **Composes poorly.** You can't `Task.WhenAll(asyncVoidMethod1(), asyncVoidMethod2())` because `async void` doesn't return a Task to await on.

The reason `async void` exists at all: **event handlers**. `Click` events, `PropertyChanged` events, and similar all have signatures like `void Handler(object sender, EventArgs args)`. If you want the handler to be async, you must use `async void` — there's no way to make the framework await your handler's return value.

So the rule:

- **`async Task` for everything you write yourself.** Even if the caller uses `_ = MyMethodAsync()` to discard the result, returning `Task` keeps the option open.
- **`async void` ONLY for event handlers.** And even then, wrap the body in try/catch — exceptions in `async void` event handlers crash the process by default.

The senior view: this is a place where the language's syntactic flexibility lets you write something that compiles but doesn't behave well. The compiler can't warn you because `async void` is occasionally legitimate (event handlers). The discipline is yours — default to `async Task`, reach for `async void` only when an event handler signature forces it, and protect every `async void` body with exception handling.
