# Homework — Generics

Build a generic in-memory cache with constraints, eviction, and statistics.

## Build it

1. **`Cache<TKey, TValue>` class** with these constraints: `where TKey : notnull` and `where TValue : class`.
   - Internal storage: `Dictionary<TKey, CacheEntry<TValue>>`.
   - `CacheEntry<T>` is a `record` containing the value, the insertion timestamp, and a hit count.
   - Constructor takes a `maxSize` parameter and an optional `Func<TValue, int>` size estimator (default: each entry counts as 1).

2. **API:**
   - `void Set(TKey key, TValue value)` — adds or replaces. If at capacity, evicts the *least recently inserted* entry first.
   - `TValue? Get(TKey key)` — returns the value (and increments hit count), or null if missing.
   - `bool TryGet(TKey key, out TValue? value)` — typed "did we find it" version (the .NET-idiomatic alternative to nullable returns).
   - `int Count { get; }`
   - `IReadOnlyDictionary<TKey, int> HitCounts { get; }` — read-only view of per-key hit counts.

3. **Generic method on a static class:**
   ```csharp
   public static class CacheExt
   {
       public static TValue GetOrSet<TKey, TValue>(
           this Cache<TKey, TValue> cache,
           TKey key,
           Func<TValue> factory)
           where TKey : notnull
           where TValue : class
       {
           if (cache.TryGet(key, out var existing)) return existing!;
           var fresh = factory();
           cache.Set(key, fresh);
           return fresh;
       }
   }
   ```
   This is an extension method on the generic cache. The user calls it like `cache.GetOrSet(key, () => ExpensiveCompute());`.

4. **In `Program.cs`:**
   - Create a `Cache<string, string>` with `maxSize = 3`.
   - Use `GetOrSet` to populate 5 entries with different keys. Show that the cache holds only 3 (oldest evicted).
   - `Get` two entries multiple times; print the hit counts.
   - Try to use a key type that isn't `notnull` (e.g., `Cache<string?, string>`) — show the compile error.
   - Try to use a value type that isn't a class (e.g., `Cache<string, int>`) — show the compile error.

## Done when

- [ ] `Cache<TKey, TValue>` works for at least two distinct concrete instantiations (`<string, string>` and `<Guid, MyType>`, for example).
- [ ] Constraints are enforced — wrong type arguments fail to compile.
- [ ] Eviction correctly removes the oldest entry when capacity is exceeded.
- [ ] Hit counts increment correctly.
- [ ] You can articulate the difference between `TKey : notnull` and `TKey : class`.

## Bonus

- Add a `Cache<TKey, TValue>.Evict(TimeSpan olderThan)` method that removes entries older than the threshold.
- Add a generic constraint `where TValue : IComparable<TValue>` and a `TValue Max()` method that returns the largest cached value.
- Make the cache `ConcurrentCache<TKey, TValue>` using `ConcurrentDictionary<TKey, TValue>` so it's thread-safe.

## Save to

`progress/<today>/working-folder/csharp-and-dotnet/05-cache/`.
