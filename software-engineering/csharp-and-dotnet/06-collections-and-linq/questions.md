# Questions — Collections and LINQ

Three questions on the most important LINQ judgment topics.

---

### Q1. LINQ operations on `IEnumerable<T>` are lazy. Why is that almost always good — and what's the specific category of bug it introduces?

**How to think about it:**

Lazy evaluation means a LINQ pipeline doesn't execute when you write it; it executes when something *consumes* it (a `foreach`, `.Count()`, `.ToList()`, `.First()`, etc.). The pipeline is just a description of the work.

The benefits are substantial:

1. **Composability without cost.** You can chain `.Where().Select().Where().OrderBy()` without paying for intermediate collections. Each operator just wraps the previous one in a deferred computation.

2. **Short-circuit consumption.** `.First(predicate)` stops as soon as it finds one match — even if the pipeline conceptually filters a million items, only the first matching one (and the items leading up to it) get processed.

3. **Streaming over large data.** You can process a billion-line file with LINQ if the source is an `IEnumerable<string>` reading from disk lazily — the file is never fully in memory.

The bugs come from **multiple iteration of a lazy source**. Two cases bite hard:

```csharp
var query = expensive.Where(x => DoExpensiveFilter(x));

var count = query.Count();        // runs the filter on every element
var list = query.ToList();         // RE-RUNS the filter on every element
foreach (var x in query) { ... }   // RE-RUNS again
```

Each iteration runs the entire pipeline from scratch. If the source is in-memory, that's wasted CPU. If the source is a database query, you've made N queries instead of 1. If the source is a generator with side effects (`Console.WriteLine`), the side effects fire N times.

The other class of bug: **iterating a query whose source has changed**:

```csharp
var orders = new List<Order>();
var bigOnes = orders.Where(o => o.Total > 100);

orders.Add(new Order { Total = 999 });
var count = bigOnes.Count();   // includes the new one — surprising
```

The query is re-evaluated against the current state of `orders` every time you iterate it. If you wanted a snapshot, you needed `.ToList()` immediately.

The defensive habit: **materialize at the boundary of "I want this result now and won't iterate again."** `.ToList()` after a query that you'll consume more than once. `.ToArray()` if you also want the immutability of a fixed-size array. The cost is one allocation; the benefit is predictable behavior.

The senior take: lazy evaluation is the right default *for what LINQ does*, but it's a leaky abstraction. The leak is "what is the cost of iterating this `IEnumerable`?" — it could be cheap (already a list), free (already enumerated and cached), or arbitrarily expensive (a database query, a remote API call). Idiomatic C# code is cautious about iterating things twice and aggressive about materializing when ambiguity would matter.

---

### Q2. The README warned against returning `List<T>` from public APIs in favor of `IReadOnlyList<T>` or `IEnumerable<T>`. Which should you pick when, and what's the principle behind the choice?

**How to think about it:**

The right return type expresses **what the caller can safely rely on**, no more and no less. Returning more capability than the caller needs leaks implementation detail; returning less constrains the caller unnecessarily.

The hierarchy of return types, from most-restrictive to least-restrictive:

1. **`IEnumerable<T>`** — "you can iterate this, that's all." Most flexible for the implementer (any sequence type works), most restrictive for the caller (no count, no indexing, may be lazy).
2. **`IReadOnlyCollection<T>`** — "you can iterate AND know the count." Slightly more committed.
3. **`IReadOnlyList<T>`** — "you can iterate, count, AND access by index." Specifies that the collection is ordered and finite.
4. **`IReadOnlyDictionary<TK, TV>`** — for keyed collections.
5. **`List<T>`** / **`Dictionary<TK, TV>`** — fully mutable, fully exposed. Caller can `Add`, `Remove`, mutate.

Pick by asking what the caller will do:

- **They'll iterate once and discard?** `IEnumerable<T>`. Lets you stream, lets you change the impl, lets you compose with LINQ at zero cost.
- **They'll iterate AND need the count?** `IReadOnlyCollection<T>`. Or more often `IReadOnlyList<T>`, which adds indexing.
- **They'll random-access?** `IReadOnlyList<T>`.
- **They'll genuinely mutate the collection?** `List<T>` (or `IList<T>` if you want to allow alternate impls). Rare; most callers don't actually need to mutate.

The principle is **return the smallest contract the caller depends on**. This:

- Lets you change the implementation. If you return `IReadOnlyList<T>`, you can swap from `List<T>` to `T[]` to `ImmutableList<T>` without breaking callers.
- Documents intent. Returning `IEnumerable<T>` says "this might be lazy" — callers know to materialize if they want to iterate twice.
- Prevents accidental mutation. A caller who got back `IReadOnlyList<T>` can't accidentally `.Add()` to your internal data.

The cost — `IEnumerable<T>` is so general that the caller might not realize the underlying source is expensive (a database query). For internal-only APIs, `IReadOnlyList<T>` is often the better default because the count is right there and there's no laziness ambiguity.

The senior take: think of return types as **promises**. The narrowest promise that does the job is the right one. `List<T>` promises everything — which means changing the implementation breaks callers, callers can mutate, no streaming. Most APIs don't need to make all those promises.

---

### Q3. LINQ has both *method syntax* (`items.Where(x => ...).Select(x => ...)`) and *query syntax* (`from x in items where ... select ...`). They compile to the same thing. When should you actually pick the query form?

**How to think about it:**

Mechanically, the C# compiler translates query syntax into method syntax — `from x in items where ... select ...` becomes `items.Where(x => ...).Select(x => ...)`. They're equivalent and produce identical IL. The choice is purely about readability.

Method syntax is the dominant style in modern C# code for several reasons:

1. **Most LINQ operators don't have a query-syntax form.** `.Take(n)`, `.Skip(n)`, `.OrderByDescending`, `.Distinct`, `.Aggregate`, `.Count`, `.Sum` — all only work in method syntax. Once you reach for any of these, you're back in method syntax anyway, so consistency favors using it from the start.
2. **Method syntax composes naturally with LINQ-adjacent operations.** `.ToList()`, `.ToArray()`, `.ToDictionary()` are method calls; query syntax has to "exit" to use them.
3. **It reads top-to-bottom in the same direction as the data flows.** `items.Where().Select().OrderBy()` shows the pipeline left-to-right; query syntax has the `select` clause at the bottom even though it's the *last* logical step, which is sometimes confusing.

Query syntax wins in a specific scenario: **multi-source joins**. Compare:

```csharp
// Query syntax — readable
var q = from order in orders
        join customer in customers on order.CustomerId equals customer.Id
        join address in addresses on customer.AddressId equals address.Id
        where order.Total > 100
        select new { order.Id, customer.Name, address.City };

// Method syntax — same query, harder to follow
var q = orders
    .Join(customers, o => o.CustomerId, c => c.Id, (o, c) => new { o, c })
    .Join(addresses, oc => oc.c.AddressId, a => a.Id, (oc, a) => new { oc.o, oc.c, a })
    .Where(t => t.o.Total > 100)
    .Select(t => new { t.o.Id, t.c.Name, t.a.City });
```

The method-syntax `.Join` is awkward — you have to invent intermediate tuple types just to carry both sides forward. Query syntax handles this naturally with named ranges.

Beyond joins, query syntax also reads well for **`let` clauses** that introduce intermediate computations:

```csharp
var q = from o in orders
        let discount = o.IsPremium ? 0.10m : 0m
        let netTotal = o.Total * (1 - discount)
        where netTotal > 50
        select new { o.Id, netTotal };
```

The same query in method syntax requires nested `Select` calls or temporary tuples — clunky.

The senior heuristic: **default to method syntax**. Switch to query syntax only when joining multiple sources or when `let` clauses make method syntax noisy. Mixing styles in the same codebase is fine — pick the one that makes the specific query clearer. Don't enforce a one-style-fits-all rule; the language gave you both because both have legitimate uses.
