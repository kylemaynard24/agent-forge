// Run with: dotnet run
//
// Demonstrates virtual/override/sealed, base calls, and the
// modern "discriminated union via records + pattern matching" alternative.

using System;
using System.Collections.Generic;

namespace InheritanceDemo;

// ============================================================================
// Classic OO inheritance with virtual/override/sealed
// ============================================================================
public class Animal
{
    public string Name { get; init; } = "";

    // virtual: subclasses can override
    public virtual string Sound() => "(generic noise)";

    // non-virtual: subclasses cannot polymorphically replace this
    public string Greet() => $"Hi, I'm {Name}.";
}

public class Dog : Animal
{
    public override string Sound() => "Woof!";
}

public class Puppy : Dog
{
    public override string Sound() => "Yip!";
}

public sealed class Goldfish : Animal
{
    public override string Sound() => "(blub blub)";
}

// Cat overrides AND calls base
public class Cat : Animal
{
    public override string Sound()
    {
        var generic = base.Sound();
        return $"{generic} ... actually, meow.";
    }
}

// ============================================================================
// Constructor chaining with `base(...)`
// ============================================================================
public class Vehicle(string make, string model)
{
    public string Make { get; } = make;
    public string Model { get; } = model;
    public override string ToString() => $"{Make} {Model}";
}

public class Car(string make, string model, int doors) : Vehicle(make, model)
{
    public int Doors { get; } = doors;
    public override string ToString() => $"{base.ToString()} ({Doors}-door)";
}

// ============================================================================
// Modern alternative: records + pattern matching (often a better fit)
// ============================================================================
public abstract record Shape;
public record Circle(double Radius) : Shape;
public record Square(double Side) : Shape;
public record Rectangle(double Width, double Height) : Shape;

public static class Geometry
{
    public static double Area(Shape s) => s switch
    {
        Circle c => Math.PI * c.Radius * c.Radius,
        Square sq => sq.Side * sq.Side,
        Rectangle r => r.Width * r.Height,
        _ => throw new ArgumentException("Unknown shape", nameof(s)),
    };
}

// ============================================================================
// Demo runner
// ============================================================================
public static class Demo
{
    public static void Main()
    {
        // Polymorphism: dispatch on runtime type
        Animal[] zoo = [
            new Dog { Name = "Rex" },
            new Puppy { Name = "Pip" },
            new Goldfish { Name = "Bubbles" },
            new Cat { Name = "Whiskers" },
        ];

        foreach (var a in zoo)
        {
            Console.WriteLine($"{a.Greet()} I say {a.Sound()}");
        }
        Console.WriteLine();

        // Constructor chaining
        var car = new Car("Honda", "Civic", 4);
        Console.WriteLine(car);
        Console.WriteLine();

        // Records + pattern matching
        Shape[] shapes = [
            new Circle(2.0),
            new Square(3.0),
            new Rectangle(4.0, 5.0),
        ];

        foreach (var s in shapes)
        {
            Console.WriteLine($"{s} → area={Geometry.Area(s):F2}");
        }
    }
}
