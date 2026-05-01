// Run with: dotnet run
//
// Or save into a console project: dotnet new console -n classes-basics-demo
// then replace Program.cs with this file.

using System;
using System.Collections.Generic;

namespace ClassesBasics;

// ============================================================================
// Form 1 — classic class with explicit constructor and fields
// ============================================================================
public class OrderClassic
{
    private readonly Guid _id;
    private readonly DateTime _createdAt;
    private string _status;

    public OrderClassic(Guid id, string initialStatus)
    {
        if (string.IsNullOrWhiteSpace(initialStatus))
            throw new ArgumentException("Status required.", nameof(initialStatus));

        _id = id;
        _createdAt = DateTime.UtcNow;
        _status = initialStatus;
    }

    public Guid Id => _id;
    public TimeSpan Age() => DateTime.UtcNow - _createdAt;

    public override string ToString() => $"OrderClassic[{_id}, {_status}]";
}

// ============================================================================
// Form 2 — primary constructor (C# 12+) — same shape, less boilerplate
// ============================================================================
public class OrderModern(Guid id, string initialStatus)
{
    private readonly DateTime _createdAt = DateTime.UtcNow;
    private string _status = string.IsNullOrWhiteSpace(initialStatus)
        ? throw new ArgumentException("Status required.", nameof(initialStatus))
        : initialStatus;

    public Guid Id => id;
    public TimeSpan Age() => DateTime.UtcNow - _createdAt;

    public override string ToString() => $"OrderModern[{id}, {_status}]";
}

// ============================================================================
// Form 3 — record (data class, value equality, ToString and 'with' for free)
// ============================================================================
public record Address(string Street, string City, string Zip);

// ============================================================================
// Form 4 — static class for stateless utilities
// ============================================================================
public static class IdGen
{
    public static Guid New() => Guid.NewGuid();
    public static string Short(Guid g) => g.ToString()[..8];
}

// ============================================================================
// Demo runner
// ============================================================================
public static class Demo
{
    public static void Main()
    {
        var classicId = IdGen.New();
        var classic = new OrderClassic(classicId, "Pending");
        Console.WriteLine($"Classic: {classic}, age={classic.Age().TotalMilliseconds}ms");

        var modern = new OrderModern(IdGen.New(), "Pending");
        Console.WriteLine($"Modern:  {modern}");

        // Records: value equality + non-destructive update
        var a1 = new Address("100 Main", "Boston", "02110");
        var a2 = new Address("100 Main", "Boston", "02110");
        var a3 = a1 with { City = "Cambridge" };

        Console.WriteLine($"a1 == a2 ? {a1 == a2}");  // True — value equality
        Console.WriteLine($"a1 == a3 ? {a1 == a3}");  // False — different city
        Console.WriteLine($"a1: {a1}");                // record's auto-generated ToString
        Console.WriteLine($"a3: {a3}");

        // Static class usage
        var shortId = IdGen.Short(classicId);
        Console.WriteLine($"Short id of classic: {shortId}");

        // Constructor invariants — uncomment to see the throw
        // var bad = new OrderClassic(IdGen.New(), "");
    }
}
