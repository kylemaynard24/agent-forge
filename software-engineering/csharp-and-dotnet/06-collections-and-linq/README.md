# Collections and LINQ

The .NET collection ecosystem is layered on top of `IEnumerable<T>` and built around a sequence-of-operations pattern called **LINQ** (Language Integrated Query). Once you internalize LINQ, a huge fraction of "loop + accumulate + filter" code disappears in favor of declarative pipelines.

## The collection hierarchy

```
IEnumerable<T>          ← the base: anything you can foreach
   └ ICollection<T>     ← + Count, Add, Remove, Clear, Contains
        └ IList<T>      ← + indexed access (this[i])
        └ ISet<T>       ← + set semantics (no duplicates)

IDictionary<TK,TV>      ← key-value mapping
IReadOnlyList<T>        ← read-only view (immutable from caller's perspective)
IReadOnlyDictionary<TK,TV>
```

Concrete classes you'll use constantly:
- `List<T>` — mutable indexed list. The default workhorse.
- `Dictionary<TK,TV>` — hash map. O(1) average lookup.
- `HashSet<T>` — hash set.
- `Queue<T>` / `Stack<T>` — FIFO and LIFO.
- `LinkedList<T>` — doubly-linked list. Rarely needed; `List<T>` is faster for almost everything.
- `ConcurrentDictionary<TK,TV>`, `ConcurrentQueue<T>` — thread-safe variants in `System.Collections.Concurrent`.

**API design rule:** prefer the *most restrictive interface* in parameters and return types. If you only need to iterate, take `IEnumerable<T>`. If you need to know the count, take `IReadOnlyCollection<T>`. If you need indexed access, take `IReadOnlyList<T>`. Returning `List<T>` from a public API leaks the implementation; returning `IReadOnlyList<T>` is more honest.

## LINQ — the operations

LINQ has two surface syntaxes that compile to the same thing.

### Method syntax (more common)

```csharp
var orders = new List<Order> { /* ... */ };

var bigOrdersByCustomer = orders
    .Where(o => o.Total > 100)                         // filter
    .OrderByDescending(o => o.Total)                   // sort
    .GroupBy(o => o.CustomerId)                        // group
    .Select(g => new                                   // project
    {
        CustomerId = g.Key,
        Count = g.Count(),
        Sum = g.Sum(o => o.Total),
    })
    .ToList();                                         // materialize
```

### Query syntax (older, sometimes more readable for joins)

```csharp
var bigOrdersByCustomer =
    from o in orders
    where o.Total > 100
    orderby o.Total descending
    group o by o.CustomerId into g
    select new { CustomerId = g.Key, Count = g.Count(), Sum = g.Sum(o => o.Total) };
```

The query syntax compiles to the same method calls as the method syntax. Use whichever reads better in context — most modern code prefers method syntax except for multi-source joins.

### The operations you'll use

| Operation | Use |
|---|---|
| `.Where(pred)` | filter |
| `.Select(proj)` | map / project |
| `.SelectMany(proj)` | flatMap |
| `.OrderBy(key)` / `.OrderByDescending(key)` | sort |
| `.ThenBy(key)` | secondary sort |
| `.GroupBy(key)` | group into `IGrouping<TKey, TElement>` |
| `.Distinct()` | dedupe |
| `.Take(n)` / `.Skip(n)` | pagination |
| `.First()` / `.FirstOrDefault()` | first match (throw vs null) |
| `.Single()` / `.SingleOrDefault()` | exactly-one match |
| `.Any(pred)` / `.All(pred)` | quantifiers |
| `.Count()` / `.Count(pred)` | counting |
| `.Sum()` / `.Average()` / `.Min()` / `.Max()` | aggregates |
| `.Aggregate(seed, fn)` | fold / reduce |
| `.Join` / `.GroupJoin` | inner join / left join with grouping |
| `.Zip(other, fn)` | pair-up two sequences |
| `.ToList()` / `.ToArray()` / `.ToDictionary()` | materialize the sequence |

## The single most important thing: lazy evaluation

`IEnumerable<T>` operations are **lazy by default**. The pipeline doesn't run until you materialize it (`ToList()`, `ToArray()`, `foreach`, `Sum()`, `Count()`, etc.).

```csharp
var pipeline = Enumerable.Range(0, 1_000_000)
    .Where(x => x % 7 == 0)
    .Select(x => x * x);

// Nothing has executed yet. `pipeline` is just a description of work.

var firstFive = pipeline.Take(5).ToList();
// NOW the work runs — but only enough to produce 5 items.
```

This is hugely powerful: you can chain transformations of giant sequences and only pay for the items actually consumed. It's also a source of subtle bugs:

```csharp
var query = orders.Where(o => o.IsActive);

orders.Add(new Order { IsActive = true });
var count = query.Count();
// `count` includes the just-added order — the query re-evaluates against the live source.
```

Materialize early when you want a snapshot, or when you'll iterate the result more than once.

## Performance notes

- **`.Count()` on an `IEnumerable<T>`** walks the whole sequence (O(n)). On a `List<T>` or array, the runtime knows the count is O(1). Avoid `.Count()` in hot paths if you can use the property `.Count` on a concrete collection.
- **`.Where().Count()`** is fine; you'd have to walk the sequence either way.
- **`.OrderBy()` materializes** the entire sequence to sort. Don't compose it inside an outer loop.
- **`.ToList()` allocates.** For one-shot pipelines that don't need to be re-iterated, you can often skip it: `foreach (var x in pipeline)` works directly.
- **Avoid LINQ in tight loops** in performance-sensitive code (the small allocations and delegate dispatch add up). For 99% of business code, this doesn't matter; for a hot inner loop processing millions of items, write the loop by hand.

## LINQ to other things

The same operators work over:
- In-memory collections (LINQ to Objects).
- SQL databases via Entity Framework Core (LINQ to Entities — translated to SQL).
- XML (LINQ to XML).
- Async sequences via `IAsyncEnumerable<T>` and the `System.Linq.Async` package.

The Entity Framework case is particularly slick: `dbContext.Orders.Where(o => o.Total > 100).Take(10).ToListAsync()` becomes a SQL query the database executes, not an in-memory iteration of all orders.

## Common mistakes

- **Iterating an `IEnumerable<T>` twice unintentionally.** If the source is expensive (a DB query, a generator), you've now done the work twice. Materialize with `.ToList()` if you need to iterate multiple times.
- **`.Where().FirstOrDefault()` instead of `.FirstOrDefault(pred)`.** Both work; the second is shorter.
- **Returning `IEnumerable<T>` from EF Core queries.** You now have a query that runs lazily on the next iteration — outside the `DbContext` scope, which is closed. Materialize with `.ToListAsync()` before returning.
- **Not using `.Aggregate` when you should.** Reaching for a manual `foreach` + accumulator when `.Aggregate` does it more declaratively. (But also: don't use `.Aggregate` for everything — sometimes a loop is clearer.)
- **`.OrderBy(x => Random.NextDouble())`** to "randomize." It works but produces a key per item that may not be stable; prefer `Random.Shared.Shuffle()` (.NET 8+).

## Where to next

- Topic `07-delegates-events-functional` — `Func<>`/`Action<>`, lambdas, and what LINQ is actually built on.
- Topic `08-async-and-await` — the async story, including `IAsyncEnumerable<T>` and async LINQ.
