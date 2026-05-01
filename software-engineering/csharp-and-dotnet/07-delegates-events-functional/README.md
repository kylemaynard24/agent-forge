# Delegates, events, and functional C#

C# is multi-paradigm. The OO half is what you've seen so far; the functional half lives in **delegates**, **lambdas**, and the LINQ operators built on them. Modern C# leans heavily on this side — first-class functions are everywhere.

## Delegates — typed function references

A delegate is a type whose instances reference a method (or set of methods) with a specific signature.

```csharp
// Custom delegate type
public delegate int BinaryOp(int a, int b);

BinaryOp add = (a, b) => a + b;
BinaryOp mul = (a, b) => a * b;

Console.WriteLine(add(2, 3));  // 5
Console.WriteLine(mul(2, 3));  // 6
```

In practice you almost never declare custom delegate types. The BCL gives you generic ones:

```csharp
Func<int, int, int> add = (a, b) => a + b;            // last type is the return type
Action<string> print = msg => Console.WriteLine(msg); // Action returns void
Predicate<int> isEven = n => n % 2 == 0;              // shorthand for Func<int, bool>
```

`Func<>` exists with up to 16 input parameters; same for `Action<>`. They cover essentially every method shape you'd want to pass around.

## Lambdas

```csharp
Func<int, int> square = x => x * x;
Func<int, int, int> add = (a, b) => a + b;
Action printName = () => Console.WriteLine("Kyle");

// With explicit types when inference is ambiguous
Func<int, int> alsoSquare = (int x) => x * x;

// Multi-line lambda
Func<int, string> describe = x =>
{
    if (x > 0) return "positive";
    if (x < 0) return "negative";
    return "zero";
};
```

Lambdas capture variables from their enclosing scope (**closure**):

```csharp
int multiplier = 3;
Func<int, int> times = x => x * multiplier;  // captures `multiplier`
Console.WriteLine(times(5));  // 15

multiplier = 10;
Console.WriteLine(times(5));  // 50 — the lambda sees the current value
```

Closure capture is a frequent source of bugs in loops:

```csharp
// BUG: all the lambdas reference the same `i`
var lambdas = new List<Func<int>>();
for (int i = 0; i < 3; i++)
{
    lambdas.Add(() => i);
}
// In old C#, all three return 3. In modern C# (since C# 5), the foreach loop variable
// is captured per iteration, but the for loop variable is NOT.
//
// FIX: copy `i` into a local per iteration:
for (int i = 0; i < 3; i++)
{
    int captured = i;
    lambdas.Add(() => captured);
}
```

## Method group syntax

Often a lambda is just calling a method with the same arguments. Skip the lambda:

```csharp
var names = new[] { "kyle", "sam" };

// Lambda
var upper = names.Select(s => s.ToUpper());

// Method group — equivalent
var upper2 = names.Select(string.ToUpper);  // hmm — wrong, ToUpper is instance
// More common case:
var lengths = names.Select(s => s.Length);
// (no method group form here because `Length` is a property)

void Print(string s) => Console.WriteLine(s);
names.ToList().ForEach(Print);  // method group passes Print as Action<string>
```

Method groups are syntactically nicer when the lambda is *just* invoking a method. The compiler may also optimize them better in some cases.

## Events — the publish/subscribe primitive

Events are delegates with a publish-only access pattern: subscribers can `+=` and `-=` to listen, but only the declaring class can invoke.

```csharp
public class TemperatureSensor
{
    // The event — declared with the `event` keyword and a delegate type
    public event EventHandler<TemperatureChangedEventArgs>? TemperatureChanged;

    private double _current;

    public void Update(double newTemp)
    {
        var old = _current;
        _current = newTemp;
        // Raise the event — the `?.Invoke` handles the no-subscribers case
        TemperatureChanged?.Invoke(this, new TemperatureChangedEventArgs(old, newTemp));
    }
}

public class TemperatureChangedEventArgs(double oldTemp, double newTemp) : EventArgs
{
    public double OldTemp { get; } = oldTemp;
    public double NewTemp { get; } = newTemp;
}

// Subscriber
var sensor = new TemperatureSensor();
sensor.TemperatureChanged += (sender, args) =>
    Console.WriteLine($"Temp went from {args.OldTemp} to {args.NewTemp}");

sensor.Update(72.5);  // logs the change
```

The .NET convention is `event EventHandler<TArgs>` where `TArgs` is your custom `EventArgs` subclass. Modern alternative: many libraries skip events in favor of explicit observer interfaces (`IObserver<T>`/`IObservable<T>`), reactive extensions (Rx.NET), or message passing — events are most natural for *intra-process notification within a single object's lifetime*.

**Event memory leaks:** if a subscriber doesn't `-=` itself, the event publisher holds a reference, preventing GC. This is the most common source of "managed memory leaks" in C#. The `WeakEventManager` and weak-event patterns exist for the cases where the publisher outlives the subscriber.

## Functional patterns in real C# code

### Pipeline composition with `Func`

```csharp
Func<int, int> double_ = x => x * 2;
Func<int, int> addOne = x => x + 1;

// Compose
Func<int, int> pipeline = x => addOne(double_(x));
Console.WriteLine(pipeline(5));  // 11

// Or with an extension method
public static class FuncExt
{
    public static Func<TIn, TOut2> Then<TIn, TOut1, TOut2>(
        this Func<TIn, TOut1> first,
        Func<TOut1, TOut2> second) =>
        x => second(first(x));
}

var pipeline2 = double_.Then(addOne);
```

You can build dataflow pipelines this way without introducing a framework.

### Strategy via Func instead of interface

For simple strategies, `Func<>` is lighter than declaring an interface:

```csharp
// Instead of IDiscountPolicy with one method, just take a Func
public decimal CalculateTotal(decimal subtotal, Func<decimal, decimal> discountPolicy) =>
    discountPolicy(subtotal);

decimal noDiscount(decimal x) => x;
decimal tenPercentOff(decimal x) => x * 0.9m;

CalculateTotal(100m, noDiscount);          // 100
CalculateTotal(100m, tenPercentOff);       // 90
CalculateTotal(100m, x => x > 50 ? x * 0.85m : x);  // ad-hoc
```

For one-method "strategies," prefer `Func<>`. For multi-method contracts, prefer interfaces.

## Common mistakes

- **Re-declaring `delegate` types.** Almost never necessary. Use `Func<>` / `Action<>`.
- **Loop-variable capture.** Mentioned above; bites enough that it's worth rereading.
- **Forgetting to unsubscribe.** Long-lived event publishers + short-lived subscribers = managed leaks. Either unsubscribe, use weak events, or use a different pattern.
- **`async void` event handlers.** Events have a `void` return; if your handler is async, you need to write `async void` (instead of the usual `async Task`). `async void` swallows exceptions and is hard to test. Try to handle this with `try/catch` inside the handler.

## Where to next

- Topic `08-async-and-await` — async is built on `Task<T>` which is delegate-shaped under the hood.
