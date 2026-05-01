# Quick syntax catchup

For people who already program but need C# syntax. **Skip this and start at `01-classes-basics` if you'd rather absorb syntax from real examples** — the C# basics are not surprising once you know any other typed language.

## File shell

A modern C# file using top-level statements (since .NET 6):

```csharp
// Hello.cs
Console.WriteLine("Hello, world!");
```

That's a complete program if it's the only file with top-level statements in your project. The compiler synthesizes a `Main` method around it. For libraries or larger programs you write classes (next topic).

## Variables

C# is **statically typed**. Every variable has a type known at compile time.

```csharp
int count = 5;
string name = "Kyle";
double price = 19.99;
bool isReady = true;

// Type inference with `var` — compiler infers the type from the right-hand side
var inferred = "still a string";
var alsoInferred = 42; // int

// Nullable types — opt in to "this can be null"
string? maybeName = null;     // reference type, marked nullable
int? maybeCount = null;        // value type, marked nullable
```

Modern C# projects have **nullable reference types enabled** by default. That means `string` is "non-null" — assigning `null` is a warning. Use `string?` when null is genuinely possible. This is C#'s answer to billion-dollar-mistake nulls.

## Constants and immutability

```csharp
const int MaxRetries = 3;            // compile-time constant
readonly DateTime _startedAt = DateTime.Now;  // assignable in constructor only
```

For modern style, prefer `record` types (covered in `01`) when you want a whole object that's immutable.

## Operators

C# operators are familiar from C-family languages: `+ - * / %`, `== != < > <= >=`, `&& || !`, `& | ^ ~ << >>`. Two C#-specific things worth flagging:

- `??` — null-coalescing operator: `value ?? "default"` returns `"default"` if `value` is null.
- `?.` — null-conditional operator: `user?.Name` returns `null` if `user` is null instead of throwing.

## Conditionals

```csharp
if (count > 10) { ... }
else if (count > 5) { ... }
else { ... }

// Ternary
var label = count > 0 ? "positive" : "non-positive";

// Switch expression (C# 8+, the modern form)
var category = count switch
{
    0           => "zero",
    > 0 and < 10 => "small",
    >= 10        => "large",
    _            => "negative",  // wildcard
};
```

The switch expression uses **pattern matching** — you can match on type, properties, ranges, and combinations. It's worth getting comfortable with; modern C# code uses it heavily.

## Loops

```csharp
// for
for (int i = 0; i < 10; i++) { ... }

// foreach (idiomatic for collections)
foreach (var item in collection) { ... }

// while / do-while (rarely needed in modern code)
while (condition) { ... }
```

Prefer `foreach` over `for` whenever you don't need the index. For collections of unknown size, prefer LINQ (`06`) over manual loops.

## Methods

```csharp
// Standalone method (in a class — C# 9+ also supports top-level methods)
int Add(int a, int b) => a + b;       // expression-bodied
int Multiply(int a, int b)            // statement-bodied
{
    return a * b;
}

// Named arguments and defaults
void SendEmail(string to, string subject, bool urgent = false)
{
    // ...
}
SendEmail(to: "a@b.com", subject: "hi");                 // urgent defaults to false
SendEmail("a@b.com", "hi", urgent: true);                // mix positional + named
```

C# methods support **method overloading** (multiple methods with the same name but different parameter types). Prefer optional parameters with defaults over overloads when the overloads only differ in trailing parameters.

## Strings

```csharp
// Concatenation
string greeting = "Hello, " + name;

// Interpolation (preferred)
string greeting2 = $"Hello, {name}, you have {count} messages.";

// Verbatim strings (no escape processing)
string path = @"C:\Users\Kyle\Documents";

// Raw string literals (C# 11+) — no escaping at all, ideal for JSON/regex/SQL
string json = """
{
  "name": "Kyle",
  "active": true
}
""";
```

Modern C# uses `$"..."` for almost all string-with-data construction. `string.Format(...)` is older style and rarely seen in new code.

## Arrays and basic collections

```csharp
int[] numbers = [1, 2, 3, 4];                   // C# 12+ collection expression
int[] alsoNumbers = new int[] { 1, 2, 3, 4 };   // older form, same thing

var list = new List<string> { "a", "b", "c" };
var dict = new Dictionary<string, int> { ["a"] = 1, ["b"] = 2 };
```

`List<T>` and `Dictionary<K,V>` are the workhorses. Topic `06` covers the wider collection ecosystem and LINQ.

## Where to next

- Run a "Hello, world" program: `dotnet new console -n hello && cd hello && dotnet run`
- Then move to **`01-classes-basics`** — classes are where C# starts to differ from C-like syntax in interesting ways.
