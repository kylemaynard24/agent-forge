# Properties and encapsulation

C# folds the get/set boilerplate that languages like Java spell out into a first-class language feature called **properties**. Modern C# has several property forms, and the choice between them is part of the design judgment of a class.

## The four common forms

```csharp
public class Person
{
    // 1. Auto-property with private setter — read-only from outside, mutable inside the class
    public string Name { get; private set; }

    // 2. Init-only auto-property — settable only in object initializer / constructor
    public DateTime Birthday { get; init; }

    // 3. Required property (C# 11+) — caller MUST set it in initializer or constructor
    public required string Email { get; init; }

    // 4. Property with backing field and custom logic
    private int _age;
    public int Age
    {
        get => _age;
        set => _age = value < 0
            ? throw new ArgumentOutOfRangeException(nameof(value), "Age cannot be negative.")
            : value;
    }

    // 5. Expression-bodied / computed property — no backing field, derived from other state
    public bool IsAdult => Age >= 18;
}
```

Form mental model:
- `{ get; }` only — true read-only; can only be assigned in constructor or declaration.
- `{ get; init; }` — set once at object creation, then frozen. The modern default for "create-time" properties.
- `{ get; private set; }` — read by outsiders, mutated by the class itself.
- `{ get; set; }` — full read-write. Use sparingly; prefer init-only.
- Backing-field form — when you need validation, lazy computation, or change tracking.
- Expression-bodied — when the value is *derived* from other state.

## The point of properties

Properties exist for one reason: **encapsulation without ceremony**. In languages without them, you write `getName()` / `setName()` because you might later need to add validation or logging — but the call sites are now `obj.getName()` instead of `obj.name`, which is uglier than necessary. C# lets you write `obj.Name` and add a backing field with logic later WITHOUT changing any call site.

This means the right default in C# is "always property, never public field." Even if today's property is `public string Name { get; init; }` with no logic, the next dev can add validation tomorrow without breaking anything.

## Access modifiers

C# has six access modifiers; you'll use four of them constantly:

| Modifier | Visibility |
|---|---|
| `public` | Everywhere |
| `internal` | Anywhere in the same assembly (project) |
| `protected` | This class + derived classes |
| `private` | This class only |
| `protected internal` | Same assembly + derived classes |
| `private protected` | Derived classes in the same assembly only (rare) |

Defaults if you omit the modifier: `internal` for top-level types, `private` for class members.

**Rule of thumb: start with `private`, widen only when a real call site needs it.** The smaller the public surface, the more freely you can refactor internals. A class with five public properties is harder to change safely than a class with one public method that exposes a derived view.

## File-scoped types (C# 11+)

```csharp
file class HelperOnlyForThisFile
{
    // Visible only inside this single .cs file
}
```

Useful for code generators and for keeping a helper truly local. Rarely needed in hand-written code, but worth knowing.

## Modern create-validate pattern

The combination of `required`, `init`, and validation in property setters gives you a powerful idiom for objects that should be fully valid the moment they exist:

```csharp
public class EmailMessage
{
    public required string To { get; init; }
    public required string Subject { get; init; }

    private readonly string _body = "";
    public required string Body
    {
        get => _body;
        init => _body = value.Length > 100_000
            ? throw new ArgumentException("Body too large.", nameof(value))
            : value;
    }
}

// Caller is forced to set all required properties; can't construct an invalid email
var msg = new EmailMessage
{
    To = "kyle@example.com",
    Subject = "Hi",
    Body = "Hello!",
};
```

This pattern is the modern alternative to a long constructor parameter list — readable at the call site, validated at construction time, immutable after.

## Common mistakes

- **Public mutable auto-properties everywhere.** `{ get; set; }` is a quick default but trains you to ship anemic objects. Prefer `init`-only and add explicit `set` only when mutation is genuinely part of the domain model.
- **Properties with side effects.** A property `get` that fires a network call, modifies state, or throws on normal flow is surprising — properties should look like field access. If it has side effects, make it a method. (`order.Total` should be a property; `order.SubmitToWarehouse()` should be a method.)
- **Backing field exposed *and* property.** `public int _count; public int Count { get; }` — pick one. Either the field is private (use the property) or the field is the public surface (rarely correct).
- **Properties with computational cost on every access.** `public int LineCount => File.ReadAllLines(_path).Length;` looks cheap but does I/O on every read. Either cache the value or make it a method to signal the cost.

## When NOT to use a property

- When the operation has notable side effects → method.
- When the operation can fail in expected ways → method (`bool TryParse(...)` instead of a `Parsed` property that throws).
- When the operation is genuinely expensive (I/O, large compute) → method, so the cost is visible at the call site.
- When the value depends on parameters → method, obviously.

## Where to next

- Topic `03-inheritance-and-polymorphism` — how to extend and specialize classes.
- Topic `04-interfaces-and-abstract-classes` — the abstraction tools that often replace inheritance.
