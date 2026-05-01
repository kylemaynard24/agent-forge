// Run with: dotnet run
//
// Demonstrates generic types, generic methods, constraints, and basic
// covariance with IEnumerable<out T>.

using System;
using System.Collections.Generic;

namespace GenericsDemo;

// ============================================================================
// A generic type with a constraint
// ============================================================================
public class Cache<TKey, TValue>
    where TKey : notnull
    where TValue : class  // value type would also work; this is just for the demo
{
    private readonly Dictionary<TKey, TValue> _store = new();

    public void Set(TKey key, TValue value) => _store[key] = value;
    public TValue? Get(TKey key) => _store.TryGetValue(key, out var v) ? v : null;
    public int Count => _store.Count;
}

// ============================================================================
// A generic method with type inference
// ============================================================================
public static class Util
{
    public static IEnumerable<TResult> MapMany<TInput, TResult>(
        IEnumerable<TInput> source,
        Func<TInput, IEnumerable<TResult>> selector)
    {
        foreach (var item in source)
            foreach (var result in selector(item))
                yield return result;
    }
}

// ============================================================================
// Variance demo — IEnumerable<out T> is covariant
// ============================================================================
public class Animal
{
    public string Name { get; init; } = "";
    public override string ToString() => Name;
}
public class Cat : Animal { }
public class Dog : Animal { }

// ============================================================================
// Demo runner
// ============================================================================
public static class Demo
{
    public static void Main()
    {
        // Generic class — separate types per instantiation
        var sessionCache = new Cache<Guid, string>();
        var configCache = new Cache<string, string>();

        sessionCache.Set(Guid.NewGuid(), "user-payload");
        configCache.Set("env", "production");
        Console.WriteLine($"sessionCache.Count = {sessionCache.Count}");
        Console.WriteLine($"configCache.Count  = {configCache.Count}");

        // Generic method with type inference
        var words = new[] { "hello world", "foo bar baz" };
        var allTokens = Util.MapMany(words, s => s.Split(' '));
        Console.WriteLine(string.Join(", ", allTokens));

        // Covariance: IEnumerable<Cat> can be assigned to IEnumerable<Animal>
        IEnumerable<Cat> cats = new List<Cat>
        {
            new() { Name = "Whiskers" },
            new() { Name = "Felix" },
        };
        IEnumerable<Animal> animals = cats;  // OK because IEnumerable<out T> is covariant
        foreach (var a in animals) Console.WriteLine($"animal: {a}");

        // The contrast — List<T> is INVARIANT, won't compile:
        // List<Animal> mutableAnimals = (List<Animal>)cats; // ERROR
    }
}
