# Classes — basics

The entry point of this track. If you skipped `00-quick-syntax-catchup`, this is where the C#-specific judgment starts.

## Anatomy of a class

```csharp
namespace MyApp.Domain;

public class Order
{
    // Fields — usually private; storage for the object's state
    private readonly Guid _id;
    private DateTime _createdAt;

    // Constructor — runs when an instance is created
    public Order(Guid id)
    {
        _id = id;
        _createdAt = DateTime.UtcNow;
    }

    // Methods — behaviors the object exposes
    public TimeSpan Age() => DateTime.UtcNow - _createdAt;
}
```

Three things to internalize from this minimal example:

1. **Convention: private fields are prefixed with `_`.** This is the dominant .NET style; you'll see it in every codebase. Public properties (next topic) are `PascalCase` with no prefix.
2. **`readonly`** means the field can only be assigned in the constructor or its declaration. Use it aggressively — most fields should be `readonly`.
3. **`public`/`private` access modifiers control visibility.** C# defaults to `private` for class members and `internal` for top-level types if you omit them. Be explicit; the cost is two letters and the clarity is worth it.

## Modern compact form (C# 12+)

```csharp
namespace MyApp.Domain;

// Primary constructor — the parameters are in scope throughout the class body
public class Order(Guid id)
{
    private readonly DateTime _createdAt = DateTime.UtcNow;

    public TimeSpan Age() => DateTime.UtcNow - _createdAt;
    public Guid Id => id;
}
```

The primary constructor parameter `id` is in scope as a synthesized field. It's not exposed publicly unless you write a property for it (here `public Guid Id => id;` does that). Primary constructors shrink boilerplate; use them when the class has clear injectable dependencies or required identity, but not as a default — read more on the trade-off in topic `02`.

## Records — the data-class shortcut

When a class is *primarily* a bag of data with value semantics (two instances with the same values are equal), use a `record` instead of `class`:

```csharp
public record Address(string Street, string City, string Zip);

var a1 = new Address("100 Main", "Boston", "02110");
var a2 = new Address("100 Main", "Boston", "02110");

Console.WriteLine(a1 == a2); // True — value equality, free
Console.WriteLine(a1);       // "Address { Street = 100 Main, City = Boston, Zip = 02110 }"

// `with` expressions create modified copies (immutable update)
var a3 = a1 with { City = "Cambridge" };
```

You get for free: value-based `Equals`/`GetHashCode`, a sensible `ToString`, the `with` keyword for non-destructive mutation. Records are the right default when you'd reach for a struct in another language — they're the closest C# has to algebraic data types.

`record class` (the default) is a reference type with value semantics. `record struct` is a value type. Use `record class` unless you're optimizing for stack allocation.

## Static members vs instance members

```csharp
public class Calculator
{
    public int Add(int a, int b) => a + b;            // instance method — needs an instance
    public static int Multiply(int a, int b) => a * b; // static method — called on the type
}

var c = new Calculator();
c.Add(2, 3);                  // 5
Calculator.Multiply(2, 3);    // 6
```

Static members belong to the type, not to any instance. Use `static` for utility methods, factory methods, and constants — anything that doesn't depend on per-instance state.

A `static class` (whole class is static) is a container of static members and cannot be instantiated. The .NET BCL has many: `Math`, `File`, `Path`, `Console`. Use them for stateless utility groupings.

## Object lifetime — what allocation actually costs

C# distinguishes **reference types** (`class`, `record class`, `interface`, arrays, delegates, strings) from **value types** (`struct`, `record struct`, `enum`, primitives like `int`).

- Reference types live on the **heap**; variables hold references (pointers). Garbage collected when no live reference remains.
- Value types live on the **stack** when they're locals (or inline inside their owning object on the heap). Copied on assignment.

For most application code this distinction doesn't actively bite, but knowing it matters for two cases: large value types (don't make a struct with 12 fields and pass it around — you're copying 12 fields each time) and performance-sensitive code (allocations cost GC pressure). Default to `class` (or `record class`) until you have a measured reason for `struct`.

## What makes a class "good"

This is the foundational judgment topic. The rules of thumb:

1. **One reason to change.** If multiple stakeholders would request changes to the same class for unrelated reasons, the class is doing multiple jobs. Break it up. (This is the SRP — covered in the architecture syllabus.)
2. **Constructor invariants.** A class's constructor should ensure the object is in a valid state. If `new Order(...)` can produce an invalid `Order`, every consumer has to defensively check — and they won't. Validate in the constructor; throw if the inputs are bad.
3. **Mostly-immutable by default.** Mutable state is a source of bugs. Default to `readonly` fields and init-only properties (next topic). Add mutability only when the domain genuinely demands it.
4. **Names describe behavior, not implementation.** A class named `OrderValidator` describes what it does. A class named `OrderHelper` doesn't — it's a hint that the class is too vague and probably has multiple jobs.
5. **Small public surface.** Most members should be `private`. The public surface is what callers depend on; making it small means you can change internals without breaking callers.
6. **Composition over inheritance** (covered deeply in `03`). When you're tempted to inherit, ask whether composition would do — usually it would.

A class that satisfies these is "good." It doesn't need to be clever. Cleverness in classes is usually a smell.

## Common practitioner mistakes

- **Anemic domain model.** A class with only fields/properties and no behavior, with all logic living in service classes. Symptom: `OrderService.Validate(order)` instead of `order.Validate()`. Sometimes correct (CRUD apps), often a smell. Read Fowler's "AnemicDomainModel" essay for the trade-off.
- **God class.** A class that grows to hundreds or thousands of lines because every new feature gets bolted on. Symptom: the class name is so generic it could mean anything. Fix: each new responsibility goes into a new collaborator that the original class composes.
- **Static everything.** Treating C# like a procedural language with static methods on static classes. Loses testability (statics are hard to mock) and breaks the OO model. Use static for genuinely stateless utilities; use instance methods for anything that touches state.
- **Public mutable fields.** `public int Count;` instead of a property. This bypasses encapsulation entirely — any caller can write any value. Always use properties (next topic) for public state.

## What to read next

- **Topic `02-properties-and-encapsulation`** — the next layer up: how C# folds get/set into the language and what the modern property forms (init-only, required, expression-bodied) buy you.
- **Topic `03-inheritance-and-polymorphism`** — once you have classes, how they relate.
- See `demo.cs` in this directory for runnable examples of every form covered here.
