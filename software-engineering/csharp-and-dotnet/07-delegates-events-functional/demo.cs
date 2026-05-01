// Run with: dotnet run
//
// Demonstrates Func/Action/Predicate, lambdas with closures, events,
// and method group syntax.

using System;
using System.Collections.Generic;
using System.Linq;

namespace DelegatesDemo;

// ============================================================================
// Events — publish/subscribe primitive
// ============================================================================
public class TemperatureSensor
{
    public event EventHandler<TemperatureChangedEventArgs>? TemperatureChanged;

    private double _current;
    public void Update(double newTemp)
    {
        var old = _current;
        _current = newTemp;
        TemperatureChanged?.Invoke(this, new TemperatureChangedEventArgs(old, newTemp));
    }
}

public class TemperatureChangedEventArgs(double oldTemp, double newTemp) : EventArgs
{
    public double OldTemp { get; } = oldTemp;
    public double NewTemp { get; } = newTemp;
}

// ============================================================================
// Strategy via Func
// ============================================================================
public static class CheckoutCalculator
{
    public static decimal CalculateTotal(decimal subtotal, Func<decimal, decimal> discountPolicy)
        => discountPolicy(subtotal);
}

// ============================================================================
// Demo runner
// ============================================================================
public static class Demo
{
    public static void Main()
    {
        // Func<TArgs..., TResult> — generic delegates
        Func<int, int, int> add = (a, b) => a + b;
        Func<int, int> square = x => x * x;
        Action<string> print = msg => Console.WriteLine($"[print] {msg}");
        Predicate<int> isEven = n => n % 2 == 0;

        Console.WriteLine($"add(2, 3) = {add(2, 3)}");
        Console.WriteLine($"square(5) = {square(5)}");
        print("hello");
        Console.WriteLine($"isEven(4)? {isEven(4)}");

        // Composition via extension (built-in)
        Func<int, int> addOne = x => x + 1;
        Func<int, int> doubleIt = x => x * 2;

        // Local composition without an extension
        Func<int, int> composed = x => addOne(doubleIt(x));
        Console.WriteLine($"\ncomposed(5) = doubleIt then addOne = {composed(5)}");

        // Closure capture
        Console.WriteLine("\n--- Closure ---");
        int multiplier = 3;
        Func<int, int> times = x => x * multiplier;
        Console.WriteLine($"times(5) with multiplier=3: {times(5)}");
        multiplier = 10;
        Console.WriteLine($"times(5) after multiplier=10: {times(5)}  (sees the current value)");

        // Strategy pattern via Func
        Console.WriteLine("\n--- Strategy via Func ---");
        Console.WriteLine($"No discount on $100: {CheckoutCalculator.CalculateTotal(100m, x => x)}");
        Console.WriteLine($"10% off on $100:    {CheckoutCalculator.CalculateTotal(100m, x => x * 0.9m)}");
        Console.WriteLine($"Tier discount on $100: {CheckoutCalculator.CalculateTotal(100m, x => x > 50 ? x * 0.85m : x)}");

        // Method group syntax
        Console.WriteLine("\n--- Method group ---");
        var nums = new[] { 1, 2, 3, 4, 5 };
        var doubled = nums.Select(x => x * 2);  // lambda
        var asStrings = nums.Select(Convert.ToString);  // method group — no lambda needed
        Console.WriteLine($"doubled: {string.Join(", ", doubled)}");
        Console.WriteLine($"asStrings: {string.Join(", ", asStrings!)}");

        // Events
        Console.WriteLine("\n--- Events ---");
        var sensor = new TemperatureSensor();
        sensor.TemperatureChanged += (sender, args) =>
            Console.WriteLine($"  [sub1] temp: {args.OldTemp:F1} -> {args.NewTemp:F1}");
        sensor.TemperatureChanged += (sender, args) =>
        {
            if (args.NewTemp - args.OldTemp > 5)
                Console.WriteLine($"  [sub2] BIG JUMP: {args.NewTemp - args.OldTemp:F1}");
        };
        sensor.Update(72.0);
        sensor.Update(75.0);
        sensor.Update(82.0);
    }
}
