// Run with: dotnet run
//
// Demonstrates interface vs abstract class, default interface methods,
// the interface-driven Strategy pattern (modern SimUDuck), and explicit
// interface implementation.

using System;
using System.Collections.Generic;
using System.Linq;

namespace InterfacesDemo;

// ============================================================================
// Pure interface (a contract, no implementation)
// ============================================================================
public interface IGreeter
{
    string Greet(string name);

    // Default interface method (C# 8+) — implementers can use or override
    string GreetMany(IEnumerable<string> names) =>
        string.Join("\n", names.Select(Greet));
}

public class FormalGreeter : IGreeter
{
    public string Greet(string name) => $"Good day, {name}.";
    // No need to implement GreetMany; the default works fine.
}

public class CasualGreeter : IGreeter
{
    public string Greet(string name) => $"hey {name}!";
    // Custom GreetMany override
    public string GreetMany(IEnumerable<string> names) => "hey y'all!";
}

// ============================================================================
// Abstract class — partial behavior plus must-implement abstracts
// ============================================================================
public abstract class Shape
{
    public string Name { get; init; } = "";
    public abstract double Area();
    public override string ToString() => $"{Name}: area={Area():F2}";
}

public class Circle : Shape
{
    public double Radius { get; init; }
    public override double Area() => Math.PI * Radius * Radius;
}

public class Rectangle : Shape
{
    public double Width { get; init; }
    public double Height { get; init; }
    public override double Area() => Width * Height;
}

// ============================================================================
// SimUDuck — the modern composition+interface form (Head First Ch 1)
// ============================================================================
public interface IFlyBehavior { void Fly(); }
public interface IQuackBehavior { void Quack(); }

public class FlyWithWings : IFlyBehavior { public void Fly() => Console.WriteLine("Flapping wings."); }
public class FlyNoWay     : IFlyBehavior { public void Fly() => Console.WriteLine("(can't fly)"); }
public class QuackLoud    : IQuackBehavior { public void Quack() => Console.WriteLine("Quack!"); }
public class Squeak       : IQuackBehavior { public void Quack() => Console.WriteLine("Squeak!"); }

public abstract class Duck(IFlyBehavior fly, IQuackBehavior quack)
{
    public void PerformFly() => fly.Fly();
    public void PerformQuack() => quack.Quack();
}

public class MallardDuck : Duck
{
    public MallardDuck() : base(new FlyWithWings(), new QuackLoud()) { }
}

public class RubberDuck : Duck
{
    public RubberDuck() : base(new FlyNoWay(), new Squeak()) { }
}

// ============================================================================
// Explicit interface implementation
// ============================================================================
public interface IDoodad
{
    void Use();  // The interface's idea of "use"
}

public class FancyDoodad : IDoodad
{
    public void Use() => Console.WriteLine("Using FancyDoodad in its public way.");

    // Different "use" available only when called through the interface
    void IDoodad.Use() => Console.WriteLine("Using FancyDoodad through the IDoodad interface.");
    // (uncomment above and the comment below to disambiguate further)
}

// ============================================================================
// Demo runner
// ============================================================================
public static class Demo
{
    public static void Main()
    {
        // Interface usage
        IGreeter formal = new FormalGreeter();
        IGreeter casual = new CasualGreeter();
        Console.WriteLine(formal.Greet("Kyle"));
        Console.WriteLine(formal.GreetMany(["Kyle", "Sam", "Dana"]));
        Console.WriteLine(casual.GreetMany(["Kyle", "Sam"]));
        Console.WriteLine();

        // Abstract class usage
        Shape[] shapes = [
            new Circle { Name = "small circle", Radius = 1.0 },
            new Circle { Name = "big circle", Radius = 5.0 },
            new Rectangle { Name = "square", Width = 3, Height = 3 },
        ];
        foreach (var s in shapes) Console.WriteLine(s);
        Console.WriteLine();

        // SimUDuck — strategy via interface composition
        Duck[] ducks = [new MallardDuck(), new RubberDuck()];
        foreach (var d in ducks)
        {
            d.PerformFly();
            d.PerformQuack();
        }
    }
}
