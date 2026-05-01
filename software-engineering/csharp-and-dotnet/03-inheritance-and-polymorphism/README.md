# Inheritance and polymorphism

C# supports single inheritance for classes (one direct base class) and unlimited interface implementation (next topic). Most modern C# code uses inheritance sparingly — composition (next-next topic) is the default tool for variation. But when you do reach for inheritance, the mechanics matter.

## The mechanics

```csharp
public class Animal
{
    public string Name { get; init; } = "";

    // virtual = subclasses can override
    public virtual string Sound() => "(generic noise)";

    // non-virtual = subclasses cannot replace this behavior
    public string Greet() => $"Hi, I'm {Name}.";
}

public class Dog : Animal
{
    // override the virtual member
    public override string Sound() => "Woof!";
}

public class Puppy : Dog
{
    // override Dog's override
    public override string Sound() => "Yip!";

    // sealed override — Puppy is the last class allowed to override Sound()
    // (uncomment if you want to bake this in)
    // public sealed override string Sound() => "Yip!";
}

// Stop the inheritance chain entirely
public sealed class Goldfish : Animal
{
    public override string Sound() => "(blub)";
}
```

Three keywords carry the design intent:

- **`virtual`** — "This method is intended to be overridden." Without `virtual`, a subclass cannot polymorphically override; it can only `new`-shadow (which is almost always wrong).
- **`override`** — "I am replacing the base class's `virtual` method." Required syntax; can't omit. The compiler verifies the base method exists and is `virtual`.
- **`sealed`** — On a class: no further subclassing allowed. On an `override` method: this override cannot be re-overridden.

The `sealed` keyword is underused. **Sealing is the safe default for classes** — they were originally not designed for inheritance, and unsealing them later is non-breaking, but going from unsealed to sealed IS breaking. So: seal classes by default; unseal deliberately when you need polymorphic extension.

## `base` — calling up the chain

```csharp
public class Cat : Animal
{
    public override string Sound()
    {
        var generic = base.Sound();   // call the base class's version
        return $"{generic} ... actually, meow.";
    }
}
```

`base.Method()` calls the immediate parent's implementation. Use it when your override augments rather than replaces the base behavior.

For constructors: a derived class's constructor must run the base's constructor. Implicit if the base has a parameterless constructor; explicit otherwise:

```csharp
public class Animal
{
    public Animal(string name) { Name = name; }
    public string Name { get; }
}

public class Dog : Animal
{
    public Dog(string name, string breed) : base(name)  // <— calls Animal(name)
    {
        Breed = breed;
    }
    public string Breed { get; }
}
```

## Polymorphism — what virtual buys you

The point of `virtual`/`override` is **dispatch on the runtime type, not the declared type**:

```csharp
Animal pet = new Dog { Name = "Rex" };
Console.WriteLine(pet.Sound());  // "Woof!" — uses Dog's override even though `pet` is declared as Animal
```

This is "polymorphism" in its narrow OO sense. It enables Strategy, Template Method, and most of the GoF patterns that use inheritance for variation.

The contrasting tool — composition with interfaces — gives you the same flexibility *without* the rigidity of a class hierarchy. Most modern C# code prefers composition, reserving class inheritance for genuinely is-a relationships where the derived type is meaningfully a more specific kind of the base.

## When inheritance is the right tool

- The relationship is genuinely **is-a**: a `MallardDuck` *is* a `Duck`. Not "has-a", not "uses-a".
- The base class's invariants are also the derived class's invariants (Liskov substitutability — you can use a `MallardDuck` anywhere a `Duck` is expected and not break correctness).
- The behavior to override is genuinely *behavior the type owns*, not an interchangeable strategy.
- You're modeling a closed set of variants known at design time (e.g., the four types of cards in a card game).

## When inheritance is the WRONG tool (more common)

- The variation is in **how the object behaves at runtime, not what it is**. Use Strategy + interface composition.
- The derived class needs to **disable or no-op** a base class behavior (`RubberDuck.fly()` doing nothing). This is the SimUDuck problem from Head First Ch 1 — the inheritance hierarchy is the wrong shape; pull the varying behavior out into a strategy object.
- You're inheriting only to reuse code (not to express type specialization). Prefer composition: hold an instance of the helper type, delegate to it.
- The hierarchy is more than 2-3 levels deep. Deep hierarchies are fragile; small changes in the middle cascade unpredictably.

## Common practitioner mistakes

- **Inheritance for code reuse.** Subclassing because the base has a method you want is a code smell. The class hierarchy then encodes "I needed this method" rather than "this thing is a more specific kind of the parent." Composition is what you actually wanted.
- **Forgetting `virtual`.** Adding `override` to a method whose base isn't `virtual` won't compile, but you can fall into the trap of "I'll just `new`-shadow it" — which doesn't polymorphically dispatch and produces bugs. Don't `new`-shadow methods unless you genuinely understand what it does (which is almost always nothing useful).
- **Calling `virtual` methods from constructors.** If a base class constructor calls a `virtual` method, the derived class's override runs *before* the derived class's constructor has finished initializing. The override sees half-initialized state. Don't do it.
- **Protected fields.** `protected` fields create coupling between the base class and every derived class — they all share access to the field. Prefer `protected` *properties* with private backing fields, so the base class can change its storage without breaking subclasses.

## Modern C# alternatives to deep hierarchies

- **Records with discriminated-union-like patterns:** define a base `record Shape` and concrete `record Circle(double R) : Shape; record Square(double S) : Shape;`. Then use pattern matching to dispatch instead of virtual methods. Useful when behavior is more naturally expressed at the call site than as a polymorphic method.

  ```csharp
  public abstract record Shape;
  public record Circle(double Radius) : Shape;
  public record Square(double Side) : Shape;

  double Area(Shape s) => s switch
  {
      Circle c => Math.PI * c.Radius * c.Radius,
      Square sq => sq.Side * sq.Side,
      _ => throw new ArgumentException("Unknown shape", nameof(s))
  };
  ```

- **Composition + interface (next topic):** the more common modern alternative. Hold a strategy reference, delegate behavior.

## Where to next

- Topic `04-interfaces-and-abstract-classes` — the abstraction tools that often replace inheritance, and when each is the right pick.
