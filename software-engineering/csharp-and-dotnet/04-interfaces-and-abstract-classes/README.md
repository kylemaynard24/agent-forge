# Interfaces and abstract classes

This is the topic the user explicitly flagged for depth, and rightly — the **interface vs abstract class** decision is one of the most-asked C# design questions, and modern C# (8+) added wrinkles that make it less clean-cut than it used to be.

## Interfaces — declaring contracts

```csharp
namespace MyApp.Domain;

public interface IPaymentProcessor
{
    Task<PaymentResult> ChargeAsync(Money amount, CancellationToken ct);
    Task<PaymentResult> RefundAsync(Guid chargeId, Money amount, CancellationToken ct);
}

// .NET convention: interface names start with `I`.

public class StripeProcessor : IPaymentProcessor
{
    public async Task<PaymentResult> ChargeAsync(Money amount, CancellationToken ct) { /* ... */ }
    public async Task<PaymentResult> RefundAsync(Guid chargeId, Money amount, CancellationToken ct) { /* ... */ }
}

public class CryptoProcessor : IPaymentProcessor
{
    public async Task<PaymentResult> ChargeAsync(Money amount, CancellationToken ct) { /* ... */ }
    public async Task<PaymentResult> RefundAsync(Guid chargeId, Money amount, CancellationToken ct) { /* ... */ }
}
```

An interface is a **contract**: any type implementing it agrees to provide every member the interface declares. Callers code against the interface (`IPaymentProcessor`), not the concrete class (`StripeProcessor`). At runtime, dependency injection wires up the concrete instance.

This is the "program to an interface, not an implementation" principle — the most-cited rule in OO design, and probably the highest-leverage thing this whole topic teaches. It enables testing (swap the real Stripe processor for a fake in tests), enables variation (the same caller works against any payment processor), and enables future change (swap Stripe for Adyen without touching call sites).

A class can implement **multiple interfaces** but inherit from only one base class. This is part of why interfaces are the default modern abstraction.

## Default interface methods (C# 8+)

C# 8 added the ability to provide a default implementation in an interface:

```csharp
public interface IGreeter
{
    string Greet(string name);

    // Default method — implementers can call it but don't have to override
    string GreetMany(IEnumerable<string> names) =>
        string.Join("\n", names.Select(Greet));
}

public class FormalGreeter : IGreeter
{
    public string Greet(string name) => $"Hello, {name}.";
    // No need to implement GreetMany — uses the default
}
```

This blurs the historical "interfaces have no behavior" rule. The intent is **safe interface evolution** (you can add a method to an interface without breaking existing implementers, as long as the new method has a default). It is *not* an excuse to put real logic in interfaces — defaults should be thin, sensible, and rarely overridden.

Important caveats: you can't have instance state in an interface (no fields), default methods can't be `virtual` in the same sense as class methods, and the rules for explicit-implementation + default-method interaction get subtle. Read the docs before relying on advanced patterns.

## Explicit interface implementation

When a class implements multiple interfaces that have method-name conflicts, or when you want to hide a method from the public surface unless someone is interacting through the interface:

```csharp
public class Logger : IDisposable, IAsyncDisposable
{
    void IDisposable.Dispose() { /* sync dispose */ }
    ValueTask IAsyncDisposable.DisposeAsync() => /* async dispose */;
}

var l = new Logger();
// l.Dispose();          // ERROR — not on the public surface
((IDisposable)l).Dispose();  // OK — call through the interface
```

Useful but rare. The common case is implementing both `IDisposable` and `IAsyncDisposable` (where the methods don't conflict but you want to make the user explicit about which lifecycle they're using).

## Abstract classes — the half-implementation

```csharp
public abstract class Shape
{
    public string Name { get; init; } = "";

    // Abstract — derived classes MUST implement
    public abstract double Area();

    // Concrete — derived classes inherit unless they override
    public override string ToString() => $"{Name}(area={Area():F2})";
}

public class Circle : Shape
{
    public double Radius { get; init; }
    public override double Area() => Math.PI * Radius * Radius;
}
```

An abstract class is a class you cannot instantiate; it's only useful as a base. It can have:
- Fields (state).
- Constructors (called by derived classes).
- Concrete (already-implemented) methods.
- Abstract (must-be-implemented) methods.
- Virtual methods (have a default but can be overridden).

It's the right tool when you have **partial behavior shared across derived classes** plus some bits each derived class must fill in. The classic example is the Template Method pattern (Head First Ch 8).

## Interface vs abstract class — picking

Modern guidance, in order:

1. **Default to interface.** Almost any "this thing is a contract" should be an interface. C# permits multiple-interface implementation, so interfaces compose cleanly.
2. **Reach for abstract class when you need shared state or shared concrete behavior** that all implementers will reuse. If three "implementations" all duplicate the same field and the same helper method, that's a sign there's a base abstract class wanting to exist.
3. **For pure abstraction with no shared logic, always interface.** It's lighter, more flexible, and unambiguous.
4. **For pluggability and testability, always interface.** Mock libraries handle interfaces effortlessly; abstract classes can be mocked but it's clunkier.

Old-school .NET (pre-C# 8) often used abstract classes because interfaces couldn't have any implementation. Modern .NET — with default interface methods — uses interfaces in even more cases than before. If you're tempted by an abstract class, try the interface form first; reach for `abstract class` only when you need shared mutable state.

## What interfaces give you architecturally

This is where the topic earns its weight in the senior-engineer judgment. Interfaces are the **dependency-direction tool** in C#. Done well:

- Your domain layer defines interfaces (`IOrderRepository`, `IPaymentProcessor`).
- Your infrastructure layer implements them (`SqlOrderRepository`, `StripeProcessor`).
- The domain depends on the abstraction; the infrastructure depends on the abstraction. **Both depend inward toward the abstraction**, not on each other.

This is the dependency-inversion principle (the "D" in SOLID), and it's the structural backbone of hexagonal/clean architecture. If you only learn one thing from this topic: interfaces let you flip dependency arrows. That's the thing that makes large codebases survive change.

## Common mistakes

- **`I` prefix on every type.** `IPersonModel` for every DTO is overkill — interfaces are for *contracts that vary*, not for "future-proofing" data shapes. If only one implementation exists and no one is going to test against a fake, the interface is ceremony.
- **Marker interfaces with no members.** `interface IAuditable {}` used only as a tag for reflection. Sometimes valid, but usually attributes (`[Auditable]`) are a better fit.
- **Interfaces too large.** A 30-method `IRepository<T>` interface forces implementers to implement (or stub) all 30 even when they only need 3. Smaller interfaces, even at the cost of more of them, compose better. (Interface Segregation Principle, the "I" in SOLID.)
- **Abstract class as a smell.** If your abstract class has 8 methods and 4 of them are abstract, the design is asking to be split: one interface for the abstract surface, plus a concrete helper class that derived classes can compose with. Mixing abstract + concrete in one type confuses the contract.
- **Inheriting from a class to "implement" what should be an interface.** You'll know you've made this mistake when you write a second derived class and have to override most of the inherited methods to no-ops.

## Worked example — composition + interface (the modern default)

The SimUDuck example from Head First Ch 1 in modern C#:

```csharp
public interface IFlyBehavior { void Fly(); }
public interface IQuackBehavior { void Quack(); }

public class FlyWithWings : IFlyBehavior { public void Fly() => Console.WriteLine("Flapping wings."); }
public class FlyNoWay : IFlyBehavior   { public void Fly() => Console.WriteLine("(can't fly)"); }
public class Quack    : IQuackBehavior { public void Quack() => Console.WriteLine("Quack!"); }
public class Squeak   : IQuackBehavior { public void Quack() => Console.WriteLine("Squeak!"); }

public abstract class Duck
{
    private readonly IFlyBehavior _fly;
    private readonly IQuackBehavior _quack;

    protected Duck(IFlyBehavior fly, IQuackBehavior quack)
    {
        _fly = fly;
        _quack = quack;
    }

    public void PerformFly() => _fly.Fly();
    public void PerformQuack() => _quack.Quack();
}

public class MallardDuck : Duck
{
    public MallardDuck() : base(new FlyWithWings(), new Quack()) { }
}

public class RubberDuck : Duck
{
    public RubberDuck() : base(new FlyNoWay(), new Squeak()) { }
}
```

Three patterns at play here: Strategy (the behavior interfaces), abstract base class (for shared `PerformFly`/`PerformQuack` plumbing), and constructor injection (composition wiring). When this clicks, you've absorbed Head First Ch 1 in C#.

See `demo.cs` in this directory for the runnable version.

## Where to next

- Topic `05-generics` — interfaces and generics combine constantly in real .NET (`IRepository<T>`, `IEnumerable<T>`).
- Topic `06-collections-and-linq` — `IEnumerable<T>` is the most-implemented interface in .NET; LINQ is built on it.
