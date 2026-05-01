# Questions — Generics

Three questions on when generics earn their complexity and how to wield them.

---

### Q1. The homework had `where TKey : notnull` and `where TValue : class`. What would actually go wrong if you removed those constraints, and why are constraints a *design decision*, not just a syntactic detail?

**How to think about it:**

Without constraints, `T` is essentially "any type" — including types you didn't anticipate. The compiler then refuses many operations on `T` because it can't prove they're safe across all possible Ts.

If you removed `where TKey : notnull`, `TKey` could be a nullable type like `string?` or `int?`. Now what does `dict[null]` mean? In a `Dictionary<string?, V>`, putting `null` as a key throws `ArgumentNullException` at runtime — but the compile-time signature says it's allowed. You've moved the failure from compile time to runtime, which is exactly the wrong direction.

If you removed `where TValue : class`, `TValue` could be a value type like `int` or `Guid`. Now `Get(key)` returning `TValue?` becomes ambiguous — for a value type, `T?` is `Nullable<T>`, which has a different shape from a nullable reference. Your code that returns `null` for "not found" suddenly has to grapple with whether the caller wanted a nullable struct or just couldn't find the entry.

The deeper point: **constraints are how you make a generic "honest"** about what it actually does. They restrict the call sites (only valid Ts can be used) AND they unlock operations inside the generic body (you can rely on `TKey` being non-null when computing hash codes, you can rely on `TValue` being a reference type when returning null for "missing").

Constraints are a design decision because they shape the contract:

- `where T : new()` — the consumer must give you a type with a parameterless constructor. Useful for factory-like generics; restrictive for the consumer.
- `where T : SomeBaseClass` — narrows T to a specific hierarchy. Useful when you need methods/properties from the base.
- `where T : IComparable<T>` — narrows T to types that can be compared. Useful when your generic does sorting or ordering.
- `where T : notnull` — the modern default for any T-based key.
- `where T : unmanaged` — niche; for performance-critical scenarios where T must be a value type with no references.

The senior take: **add the most specific constraint your generic actually relies on**. Each constraint is a promise to the caller ("here's what you have to provide") AND an unlock for your code ("here's what I can rely on"). Loose constraints make a flexible generic but a weakly-typed implementation; strict constraints constrain the caller but let your code do more. The right balance is the smallest set of constraints that makes your generic's body correct.

---

### Q2. The homework's extension method `GetOrSet` is generic. Why does C# infer the type arguments at the call site, and what happens when inference fails?

**How to think about it:**

C# generic method type inference works by examining the **actual types of the arguments at the call site** and deducing what the type parameters must be. For a method like:

```csharp
public static TValue GetOrSet<TKey, TValue>(
    this Cache<TKey, TValue> cache,
    TKey key,
    Func<TValue> factory)
```

If you call `myCache.GetOrSet("k", () => "v")` where `myCache` is `Cache<string, string>`, the compiler reasons: the receiver is `Cache<string, string>`, so `TKey = string` and `TValue = string`. The arguments confirm: `"k"` is a `string` (matches `TKey`) and `() => "v"` is a `Func<string>` (matches `Func<TValue>`). Inference succeeds. You write the call without `<string, string>`.

The benefit is enormous in practice: real LINQ chains have many generic methods, and writing all the type arguments would be unbearable. `items.Where(x => x.IsActive).Select(x => x.Name).ToList()` involves three generic methods with type inference doing all the work.

Inference fails when:

- The compiler doesn't have enough info from the arguments. `Convert<int>("5")` works if `Convert` is `T Convert<T>(string s)` because the explicit `<int>` provides the missing piece — but bare `Convert("5")` would fail.
- Multiple incompatible inferences are possible. If you pass arguments that could satisfy several Ts, the compiler can't pick.
- A delegate argument's type is itself generic and the compiler can't unify.

When inference fails, you get a clear error and you provide the type arguments explicitly: `MyMethod<int, string>(...)`. This is uncomfortable, so API authors generally design their generic methods to maximize inference success — putting the type-determining parameters first, using `Func<T>` rather than `Func<object>`, etc.

The senior view: a generic method whose type parameters can be inferred at most call sites is well-designed. A generic method that consistently requires explicit type arguments is signaling that its abstractions don't quite fit — the caller has information the API isn't using. Refactor the API rather than asking every caller to spell out the types.

---

### Q3. C# generics are *reified* (real at runtime — `List<int>` and `List<string>` are different types in IL) while Java generics are *erased* (only the raw type exists at runtime). Why does this difference matter, and what does it enable in C# that Java can't do?

**How to think about it:**

In Java, the JVM has no notion of `List<String>` vs `List<Integer>` — both are just `List` at runtime, with the type parameter erased. The compiler inserts casts at use sites to enforce type safety, but the runtime sees the erased type. Reflection cannot recover the original type parameter.

In C#, the CLR knows that `List<int>` and `List<string>` are distinct, separately-instantiated types. The runtime stores type arguments and you can recover them via reflection (`typeof(List<int>) != typeof(List<string>)`).

What this enables in C# that Java can't:

1. **`new T()` works inside a generic method.** If `T` has a `new()` constraint, C# can construct a `T` because it knows what type `T` actually is at runtime. Java cannot — it doesn't know what to construct.

2. **`typeof(T)` works.** You can write `typeof(T) == typeof(int)` inside a generic method to dispatch on the type parameter. This is occasionally useful for performance-critical code that wants different paths for different Ts. Java requires passing a `Class<T>` parameter to do the same.

3. **Value-type specialization.** When you instantiate `List<int>`, the CLR creates a specialized version with `int` stored *inline* in the backing array — no boxing, no wrappers. `List<long>` uses 8-byte slots; `List<int>` uses 4-byte slots. In Java, every generic collection uses boxed `Integer` etc. C# generics give you the performance of a hand-written `IntList` with the convenience of `List<T>`.

4. **Reflection on generic type arguments.** You can ask `typeof(Cache<string, Order>)` for its `GenericTypeArguments` and get back `[string, Order]`. Useful for serializers, ORMs, and reflection-based tools.

5. **Variance enforcement at runtime.** Covariant and contravariant type parameters (`out T`, `in T`) have runtime checks; the CLR can throw if you violate them.

The trade-off: reified generics use more memory at runtime (each instantiation is a separate type) and slightly slower JIT compilation (more types to manage). For typical applications, this is invisible.

The senior take: C# generics are a **first-class runtime feature**, not just a compile-time syntax convenience. This shapes idioms — you can write `T : new()` and rely on it, you can use `typeof(T)` for type-based dispatch, you don't pay for boxing. Idiomatic C# generics use these capabilities; idiomatic Java generics work around the lack of them. When reading C# generic code, expect more "the type matters at runtime" patterns than you'd see in equivalent Java.
