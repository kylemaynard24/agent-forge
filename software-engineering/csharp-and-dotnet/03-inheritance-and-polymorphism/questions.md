# Questions — Inheritance and polymorphism

Four questions on the deepest design judgment in OO programming.

---

### Q1. The homework's Part 1 was a "good" use of inheritance, and Part 2 was a "bad" one. What concrete signals tell you which is which?

**How to think about it:**

The notification hierarchy in Part 1 modeled a **closed set of variants known at design time**, where each subclass was genuinely a more specific kind of the base. An `EmailNotification` IS a `Notification` (it has a recipient, a message, a created-at, and is sent through some mechanism). The set of subclasses was small and fixed. The behavior that varied was *how to send* — a single method that legitimately differs per type. This is a "pure" use of inheritance: closed taxonomy, semantic specialization, single varying behavior.

The logger hierarchy in Part 2 modeled **composable features** — independent, orthogonal capabilities (timestamping, JSON formatting, database persistence) that can be combined in any combination. The number of classes you need is the *Cartesian product* of the features: with 3 features you might need 7 subclasses for all the meaningful combinations. With 4 features, 15. With 5, 31. The hierarchy explodes because inheritance is a poor model for combinatorial composition.

The signals to learn:

| Inheritance fits when... | It doesn't when... |
|---|---|
| The taxonomy is closed and small (≤5 subclasses) | The number of variants grows as features are added |
| Subclasses differ in **what they are** (semantic specialization) | Subclasses differ in **what features they combine** |
| One method varies per subclass | Multiple orthogonal behaviors vary independently |
| Liskov substitutability holds: any subclass works wherever the base does | Some subclasses can't honor base-class invariants (the SimUDuck `RubberDuck.fly()` problem) |
| You'd describe the relationship as "is-a" | You'd describe it as "has-a" or "decorated-with" |

The senior heuristic: when you're tempted to write a third level of inheritance, stop and ask "does this thing genuinely have a more specific identity than its parent, or am I just adding behavior?" If it's the latter, you want composition.

---

### Q2. What does it actually mean for a method to be `virtual`, and why is `virtual` not the default for class methods in C#?

**How to think about it:**

`virtual` controls **dispatch**. When the compiler emits a call to a `virtual` method, it generates code that looks up the actual implementation at runtime via the object's type information (vtable, in CLR terms). When the method is *not* virtual, the compiler binds the call directly to the declared type's implementation — no runtime lookup, no chance for subclasses to substitute their own version.

Polymorphism — the ability to pass a `Dog` where an `Animal` is expected and have `Dog`'s `Sound()` run — requires `virtual`. Without it, calling `someAnimal.Sound()` would always invoke `Animal.Sound()`, ignoring the actual subtype.

So why isn't `virtual` the default? Two reasons:

1. **Most methods aren't designed for extension.** When you write a method, you usually have one specific implementation in mind. Letting subclasses override it imposes a contract ("here is a hook for behavior variation; subclasses are part of the API surface") that the original author didn't intend. Java made the opposite default — every method virtual unless `final` — and many Java codebases have accidental extension points where every override risks breaking someone.

2. **Performance.** Virtual dispatch costs a single indirect lookup (cheap, but non-zero). Non-virtual calls can be inlined. Performance-sensitive code benefits from non-virtual methods being the default.

The C# design choice — `non-virtual by default, virtual when explicit` — forces the API author to make a deliberate decision: "is this method an extension point for subclasses, or is it implementation detail?" Marking it `virtual` says "I designed this for extension." Leaving it non-virtual says "this is mine; don't depend on overriding it."

The senior view: `virtual` is part of the API contract, like `public`. Adding `virtual` to a public method is a commitment — subclasses across the codebase can now depend on overriding it, and removing `virtual` later is a breaking change. Take it seriously. Default to non-virtual; promote to virtual only for genuine extension points where you've thought through what overrides should be allowed to do.

---

### Q3. The README mentioned that calling `virtual` methods from a base-class constructor is a known footgun. Why is it dangerous, and what makes it bite specifically in C# (not, say, in Java)?

**How to think about it:**

Imagine this:

```csharp
public class Base
{
    public Base()
    {
        Initialize();  // virtual call from constructor
    }
    public virtual void Initialize() { Console.WriteLine("Base init"); }
}

public class Derived : Base
{
    private string _setting = "default";
    public override void Initialize()
    {
        Console.WriteLine($"Derived init, setting={_setting}");
    }
}
```

When you do `new Derived()`, what happens?

1. The CLR allocates a `Derived` object.
2. **The base constructor (`Base()`) runs first.** This is the language guarantee.
3. `Base()` calls `Initialize()`. Polymorphism kicks in — `Derived.Initialize()` runs.
4. But `Derived.Initialize()` reads `_setting`, which **hasn't been initialized yet** because `Derived`'s field initializers and constructor body haven't run.
5. In C#, `_setting` is `null` at this point (field initializers run *after* the base constructor in the derived class's construction sequence). The override sees half-built state.

In Java, the same pattern has the same problem (and the same fix). What makes it specifically biting in C# is that field initializers like `private string _setting = "default";` run **after** the base constructor completes — so even fields that *look* initialized from reading the source aren't initialized when `Initialize()` runs from `Base()`.

The fix is to either:
- Avoid calling virtual methods from constructors entirely (the safest rule).
- If you must, design the override to be safe in a partially-constructed state (no field reads, etc.) — this is fragile and hard to maintain.
- Pull the initialization logic into a method that's called after construction completes, by code that's not the constructor.

The senior pattern: constructors should establish invariants but **not** trigger polymorphic behavior. Polymorphic dispatch belongs to the running, fully-constructed object, not to the construction process itself. If you find yourself wanting to "let subclasses customize part of construction," that's usually a signal to use the Template Method pattern *outside* the constructor — a public method that the caller invokes after construction, where subclasses can safely override.

This is the kind of bug that doesn't show up in tests because it depends on timing and on which fields the override happens to read. It bites in production, far from the apparent cause. The rule "don't call virtual methods from constructors" is one of those rules where the cost of memorizing it is much smaller than the cost of figuring it out the hard way.

---

### Q4. The Part 2 refactor used the Decorator pattern. Decorator and inheritance both let you "extend" a type — what's the structural difference, and why does Decorator avoid the class explosion that inheritance suffers from?

**How to think about it:**

Inheritance creates an extension by **producing a new type at compile time** that statically extends the base type. Each combination of features needs its own subclass: `JsonAndTimestampedAndDatabaseLogger`. The set of combinations is enumerable in source code at compile time; you can't create new ones at runtime.

Decorator creates an extension by **wrapping an existing instance at runtime**. A decorator implements the same interface as the thing it wraps and forwards calls (with extra behavior added). Combinations are built up by chaining wrappers: `new JsonDecorator(new TimestampDecorator(new DatabaseLogger()))` produces the same end behavior, but with three independent classes that compose freely.

The structural difference comes down to this: **inheritance fixes the combination at the type level; decoration fixes it at the value level.** Type-level fixing requires one type per combination. Value-level fixing requires N types for N features (one per feature) — and arbitrary combinations come for free because composition is closed under itself.

Why does this matter at scale? Three reasons:

1. **The number of classes grows linearly, not exponentially.** Five features as decorators = five classes. Five features as inheritance = up to 31 classes (every meaningful subset).

2. **Combinations can be chosen at runtime.** A decorator chain can be built from configuration, from feature flags, from user input. An inheritance hierarchy is fixed at compile time.

3. **Each decorator is independently testable.** `JsonDecorator` can be tested in isolation by wrapping a fake `ILogger`. `JsonAndTimestampedLogger` (the inheritance version) is harder to isolate — you can only test its full inherited behavior.

The cost of decorators is indirection. A long chain (`A(B(C(D(E()))))`) can be hard to debug, and the call site doesn't make it obvious what behaviors are active. For most cases this is a fair trade — you've moved complexity from the type system (where it's invisible until you read the inheritance tree) into composition syntax (where it's right there in the constructor call).

The senior take: when you find yourself adding a third subclass that's "X plus feature Y," check whether the *features* are the actual things that vary. If they are, you want decoration, not inheritance. The Head First Decorator chapter (Ch 3) walks this exact reasoning through the Starbuzz Coffee example — the same pattern in coffee instead of loggers.
