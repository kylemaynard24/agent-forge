# Generics

Generics let you write a type or method that works with *any* type, parameterized by one or more type variables. The .NET BCL is built on generics — `List<T>`, `Dictionary<TKey, TValue>`, `IEnumerable<T>`, `Task<T>` — and you cannot really use modern .NET without reading and writing them constantly.

The mental shift: generics aren't a niche language feature; they're the default abstraction tool for "this works for any T" code. If you find yourself writing the same code three times for `string`, `int`, and `Order`, you're missing a generic.

## Generic types

```csharp
public class Box<T>
{
    private readonly T _value;
    public Box(T value) => _value = value;
    public T Value => _value;
    public override string ToString() => $"Box[{_value}]";
}

var stringBox = new Box<string>("hello");
var intBox = new Box<int>(42);

Console.WriteLine(stringBox);  // Box[hello]
Console.WriteLine(intBox);     // Box[42]
```

`T` is a type parameter, conventionally named with a single capital letter (`T` for general, `TKey`/`TValue` for keys/values, `TResult` for return types). At each instantiation, the compiler creates a specialized version of the type — `Box<string>` and `Box<int>` are entirely separate types at runtime.

For value types this is *real* specialization (no boxing), which is one of the major performance wins generics give .NET over languages where collections of primitives required boxing.

## Generic methods

```csharp
public static class Util
{
    public static T First<T>(IEnumerable<T> items)
    {
        foreach (var item in items) return item;
        throw new InvalidOperationException("Empty.");
    }

    public static TResult Map<TInput, TResult>(TInput input, Func<TInput, TResult> fn) => fn(input);
}

string firstName = Util.First(new[] { "Kyle", "Sam" });   // T inferred as string
int doubled = Util.Map(5, x => x * 2);                     // TInput=int, TResult=int
```

The compiler infers type arguments from the call site whenever possible, which is why you rarely need to write `Util.<string>First(...)` explicitly. Provide the type arguments only when inference fails.

## Constraints — narrowing what `T` can be

A bare `T` is "any type." Often you need more — "any type that has a parameterless constructor," "any reference type," "any type that implements `IComparable<T>`." That's what constraints are for:

```csharp
public class Repository<T> where T : class, IEntity, new()
{
    public T Create()
    {
        var item = new T();         // requires `new()` constraint
        item.Id = Guid.NewGuid();   // requires IEntity constraint (defines Id)
        return item;
    }
}

public interface IEntity { Guid Id { get; set; } }
```

Common constraints:

| Constraint | Means |
|---|---|
| `where T : class` | T must be a reference type. |
| `where T : struct` | T must be a value type. |
| `where T : new()` | T must have a public parameterless constructor. |
| `where T : SomeBaseClass` | T must derive from `SomeBaseClass`. |
| `where T : IInterface` | T must implement `IInterface`. |
| `where T : notnull` | T must be a non-nullable type (modern, with NRT enabled). |
| `where T : unmanaged` | T must be a value type with no reference fields. |

Constraints serve two purposes: they restrict the call sites (only valid Ts can be used) and they unlock operations inside the generic body (`new T()`, `item.Id`, etc.). Without the constraint, the body wouldn't compile because the compiler can't prove the operation is safe.

## Generic interfaces

```csharp
public interface IRepository<T> where T : IEntity
{
    Task<T?> GetAsync(Guid id, CancellationToken ct);
    Task SaveAsync(T entity, CancellationToken ct);
    Task DeleteAsync(Guid id, CancellationToken ct);
}

public class SqlOrderRepository : IRepository<Order>
{
    public Task<Order?> GetAsync(Guid id, CancellationToken ct) { /* ... */ }
    // etc.
}
```

This is the bread-and-butter pattern for "the same shape, but for many types." Note that `IRepository<Order>` and `IRepository<Customer>` are entirely distinct interfaces — there's no shared base unless you write one (`interface IRepository` non-generic plus `IRepository<T> : IRepository`).

## Variance — `in` and `out`

This is where generics get subtle. By default, `IList<Cat>` is NOT a `IList<Animal>` even though `Cat : Animal`. The reason: `IList<T>` lets you both read and write `T`, and writing a `Dog` into an `IList<Animal>` that was actually an `IList<Cat>` would be unsafe.

For interfaces where `T` only appears in **output positions** (return values), C# allows **covariance**: declare with `out`.

```csharp
public interface IProducer<out T>   // T only used as return type
{
    T Get();
}

IProducer<Cat> catProducer = new CatFactory();
IProducer<Animal> animalProducer = catProducer;  // OK — covariant
```

For interfaces where `T` only appears in **input positions** (parameters), C# allows **contravariance**: declare with `in`.

```csharp
public interface IConsumer<in T>   // T only used as parameter
{
    void Accept(T item);
}

IConsumer<Animal> animalConsumer = new AnimalSink();
IConsumer<Cat> catConsumer = animalConsumer;  // OK — contravariant
```

The .NET BCL uses these heavily: `IEnumerable<out T>` is covariant (you can pass an `IEnumerable<Cat>` where `IEnumerable<Animal>` is expected), `IComparer<in T>` is contravariant.

Most user code doesn't need to write `in`/`out` interfaces — but understanding why `IList<Cat>` isn't an `IList<Animal>` is the kind of question that comes up in code review and interviews.

## Common BCL generics worth knowing

| Type | Use |
|---|---|
| `IEnumerable<T>` | The base sequence interface — anything you can `foreach`. Covariant. |
| `ICollection<T>` | `IEnumerable<T>` + count + add/remove. |
| `IList<T>` | `ICollection<T>` + indexed access. |
| `IReadOnlyList<T>` | Read-only view of an indexed collection. Prefer this in API parameters when you don't need to mutate. |
| `IDictionary<TKey, TValue>` | Mutable key-value map. |
| `IReadOnlyDictionary<TKey, TValue>` | Read-only version. |
| `List<T>` | The default mutable list. Backed by an array; O(1) indexed access, amortized O(1) append. |
| `Dictionary<TKey, TValue>` | Hash-based map. O(1) average lookup. |
| `HashSet<T>` | Hash-based set. |
| `Queue<T>` / `Stack<T>` | FIFO and LIFO. |
| `Task<T>` | An async operation that produces a `T`. (Topic `08`.) |
| `Func<T1, ..., TResult>` / `Action<T1, ...>` | Generic delegates. (Topic `07`.) |
| `Nullable<T>` (or `T?`) | A nullable value type. |

## Common mistakes

- **`List<T>` everywhere in public APIs.** Returning `List<T>` exposes a mutable, growable type to callers — they can `Add`, `Remove`, mutate. Often the caller only needs to iterate; return `IEnumerable<T>` or `IReadOnlyList<T>` instead. Smaller exposed surface = more freedom to refactor internals.
- **Generic for the sake of generic.** A `Repository<T>` that's only ever used as `Repository<Order>` adds complexity without benefit. Generics earn their place when you have ≥2 real Ts.
- **Reflection on generics.** It works but it's slow and error-prone. If you find yourself doing `typeof(List<>).MakeGenericType(t)`, you're probably building infrastructure that should use a different mechanism (interfaces, source generators, etc.).
- **Variance confusion.** Trying to assign `List<Cat>` to `List<Animal>` and being surprised it fails. The right tool is `IReadOnlyList<Animal>` (covariant `out T`) or to design the API to take `IEnumerable<Animal>` (also covariant).
- **Ignoring `T : notnull`.** With nullable reference types enabled, an unconstrained `T` could be a nullable type. If your generic should never deal with nulls, add `where T : notnull`.

## Where to next

- Topic `06-collections-and-linq` — `IEnumerable<T>` is the foundation; LINQ is the toolset built on it.
- Topic `07-delegates-events-functional` — `Func<>` and `Action<>` are generic delegates and the bridge to functional C#.
