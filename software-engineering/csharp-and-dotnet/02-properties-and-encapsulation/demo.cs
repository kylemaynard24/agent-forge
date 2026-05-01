// Run with: dotnet run
//
// Demonstrates the four common property forms, init-only + required,
// validation in setters, and the difference between properties and methods.

using System;

namespace PropertiesDemo;

// ============================================================================
// Form 1: read-only auto-property — set in constructor only
// ============================================================================
public class CustomerV1
{
    public string Name { get; }
    public CustomerV1(string name) => Name = name;
}

// ============================================================================
// Form 2: init-only + required — modern create-time validation
// ============================================================================
public class CustomerV2
{
    public required string Name { get; init; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}

// ============================================================================
// Form 3: read-by-outside, write-by-class
// ============================================================================
public class Counter
{
    public int Value { get; private set; }
    public void Increment() => Value++;
}

// ============================================================================
// Form 4: backing field with validation
// ============================================================================
public class Person
{
    private int _age;
    public int Age
    {
        get => _age;
        set => _age = value < 0 || value > 150
            ? throw new ArgumentOutOfRangeException(nameof(value), "Age must be 0-150.")
            : value;
    }
}

// ============================================================================
// Form 5: expression-bodied / computed property — derived state
// ============================================================================
public class Order
{
    public required decimal Subtotal { get; init; }
    public required decimal TaxRate { get; init; }
    public decimal Tax => Subtotal * TaxRate;       // computed
    public decimal Total => Subtotal + Tax;          // computed
}

// ============================================================================
// Demo runner
// ============================================================================
public static class Demo
{
    public static void Main()
    {
        // Form 1: read-only, set in constructor
        var v1 = new CustomerV1("Kyle");
        Console.WriteLine($"V1 Name: {v1.Name}");

        // Form 2: init-only + required — caller MUST set Name
        var v2 = new CustomerV2 { Name = "Sam" };
        Console.WriteLine($"V2 Name: {v2.Name} created at {v2.CreatedAt:O}");
        // Uncomment — won't compile because `Name` is `required`:
        // var bad = new CustomerV2();

        // Form 3: read-by-outside, mutated only by Increment
        var c = new Counter();
        c.Increment();
        c.Increment();
        c.Increment();
        Console.WriteLine($"Counter: {c.Value}");
        // c.Value = 99;  // ERROR — setter is private

        // Form 4: validation in setter
        var p = new Person();
        p.Age = 30;
        Console.WriteLine($"Age: {p.Age}");
        try { p.Age = -5; }
        catch (ArgumentOutOfRangeException ex) { Console.WriteLine($"Caught: {ex.Message}"); }

        // Form 5: computed properties
        var o = new Order { Subtotal = 100m, TaxRate = 0.08m };
        Console.WriteLine($"Subtotal={o.Subtotal}, Tax={o.Tax}, Total={o.Total}");
    }
}
