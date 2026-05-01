# Questions — Interfaces and abstract classes

Four questions on the deepest design call in modern C#: when to abstract and how.

---

### Q1. The homework had `PaymentRouter` depend on `IPaymentProcessor`, not `PaymentProcessorBase`. Why does that distinction matter, and what would change if `PaymentRouter` accepted `PaymentProcessorBase` instead?

**How to think about it:**

`IPaymentProcessor` is the **contract** — a description of what any payment processor can do, with no implementation. `PaymentProcessorBase` is *one particular implementation strategy* for that contract — a base class that provides shared validation, logging, and Template-Method dispatch to the abstract `DoChargeAsync` hook.

When `PaymentRouter` depends on the interface, it's saying: "I work with anything that satisfies the IPaymentProcessor contract — I don't care HOW it satisfies it." That includes the production `StripeProcessor`, the `FakePaymentProcessor` you'd write for tests, a hand-rolled `RefundOnlyProcessor` that doesn't bother with the abstract base, a remote-RPC processor, or anything else that fits the interface shape.

When it depends on the abstract base, it's saying: "I work specifically with implementations that follow the `PaymentProcessorBase` strategy." That excludes the test fake, the hand-rolled processor, and any future implementation that wants to satisfy the contract differently. You've coupled the consumer to one *implementation strategy* of the contract, not to the contract itself.

This is the **Dependency Inversion Principle** in concrete form: high-level code (the `PaymentRouter`) should depend on **abstractions** (the interface), not on **concretions** (the abstract class, which is concrete relative to the interface). The interface flips the dependency arrow — the interface is owned by the consumer (where it's defined), and implementations satisfy it from the outside. That's the architectural move that makes large codebases survive change.

The practical consequence: with interface-based dependency, swapping Stripe for Adyen is changing one constructor call in your DI container setup. With abstract-base dependency, you'd have to make sure Adyen also fits the `PaymentProcessorBase` strategy — and if Adyen needs different validation or different logging, you can't easily express that without subclassing the base AND adapting it.

The senior rule: depend on **the smallest abstraction that meets your needs**. An interface with 3 methods is a smaller abstraction than an abstract class with 3 methods plus 5 concrete helpers. Smaller abstractions compose with more things and constrain you less.

---

### Q2. Default interface methods (C# 8+) blur the line between interfaces and abstract classes. When should you put a default implementation in an interface vs putting it in an abstract base class?

**How to think about it:**

Default interface methods exist primarily to allow **safe interface evolution**: you can add a method to an existing interface without breaking implementations that didn't anticipate it (because the default provides a fallback). This is a real, important capability — the .NET BCL uses it heavily for backward compatibility.

But the design question is broader: when modeling new code, should shared behavior live as a default method on the interface, or as a concrete method on an abstract base class?

The trade-offs:

**Default method on interface:**
- ✅ Multiple inheritance: a class can pick up "behaviors" from many interfaces.
- ✅ The implementation lives next to the contract — easier to find.
- ✅ No abstract base required, so no constraint on the implementer's class hierarchy.
- ❌ Cannot have instance state (no fields). Default methods can only call other interface members.
- ❌ Cannot be `protected`. The default is part of the public surface.
- ❌ Subtle rules around ambiguity when a class implements two interfaces with the same default method.

**Concrete method on abstract base:**
- ✅ Can have instance state (fields, properties).
- ✅ Can have `protected` members visible only to derived classes — a real distinction the interface form can't replicate.
- ✅ The Template Method pattern (concrete public method calling protected abstract hooks) is natural here.
- ❌ Single-inheritance limit: a class can have only one base. Forces the implementer into a specific class hierarchy.
- ❌ More indirection — the abstract base is "between" the interface and the concrete class.

Practical guidance:

- **Pure contract (no shared logic):** Interface only. No abstract class.
- **Shared logic with NO state, intended for the contract author to evolve safely:** Default interface method.
- **Shared logic with state, OR shared logic that's meant to be a `protected` extension point:** Abstract base class.
- **Shared logic that you want to be available to ALL implementations regardless of class hierarchy:** Default interface method (so consumers don't have to inherit your base).

Your homework was the third case — the validation and logging needed to be `protected` (calling abstract `DoChargeAsync` hooks), and they had cross-call state (the processor's name, the logger). So the abstract class was correct.

The senior take: default interface methods are a feature for *contract evolution*, not a replacement for abstract classes. Use them when you genuinely need to add a method to an existing interface without breaking the world. For shared base behavior in new code, the abstract class form is usually clearer.

---

### Q3. The README warned against the "I prefix on every type" anti-pattern (e.g., `IPersonModel` for a DTO with one implementation). When IS the I prefix earned, and when is it ceremony?

**How to think about it:**

The `I` prefix in .NET is a strong signal: "this type is a contract that has implementations." It's earned when the type *acts as a contract* — when there's variation among its implementers, when consumers depend on the abstraction rather than the concrete, and when the abstraction unlocks something (testability, polymorphism, dependency inversion).

It's NOT earned when:

- There's only one implementation, ever, with no foreseeable second.
- No one writes mocks/fakes against it (because the type isn't injected anywhere).
- The interface and the implementation have the same shape (every method one-to-one with no behavioral variation).

The classic ceremony case: someone defines `IPersonModel` with the same properties as a `PersonModel` class, "in case we need another implementation later." The hypothetical second implementation never arrives. Now every reference is to `IPersonModel`, every constructor takes `IPersonModel`, every test sets up `IPersonModel`-typed parameters — all for an abstraction that has exactly one implementation.

The cost of an unjustified interface:

- Two files instead of one.
- Two changes for any new property: add to interface, add to impl.
- Confused readers wondering "is there a non-`PersonModel` implementation somewhere I'm missing?"
- Slight runtime cost (interface dispatch is virtual; concrete class calls can be devirtualized by the JIT).

The "rule of three" applies: don't introduce an abstraction (interface, base class, generic type) until you have **three** real, distinct cases that need it. With one implementation, an interface is speculation. With two, it's a coin flip — sometimes the second forces the design clearly, sometimes it doesn't. With three, the shape of variation is real enough to abstract well.

The earned cases for `I`-prefixed types:

- **Service abstractions** that DI containers wire up. `IPaymentProcessor`, `IUserRepository`, `IEmailSender` — there's always at least the production impl + a fake for tests = two implementations from day one.
- **Strategy implementations** — when the variation IS the point. `IRetryPolicy`, `IDiscountCalculator`, `IFlyBehavior`.
- **Cross-cutting capabilities** — `ILogger`, `IMetrics`, `IClock` (for testable time).
- **Boundary contracts** — interfaces that define the seam between layers (domain/infrastructure).

For DTOs, value objects, and "this is just data" types, the interface is almost always ceremony. Use the concrete type. Add the interface later if (and only if) a real second implementation forces it.

---

### Q4. The Interface Segregation Principle (the I in SOLID) says "many small interfaces are better than few large ones." Why does the principle exist, and what's the cost when it's ignored?

**How to think about it:**

ISP says: clients shouldn't be forced to depend on methods they don't use. When an interface has too many methods, every implementer has to provide them all — even when they only sensibly need a subset. The "fat interface" creates two problems: implementers stub or throw `NotImplementedException` for the methods they don't care about, and consumers depend on a wider abstraction than they actually use.

The classic example is `IRepository<T>` with 25 methods (`GetById`, `GetAll`, `Find`, `FindWhere`, `Add`, `Update`, `Delete`, `BatchAdd`, `BatchUpdate`, etc.). A read-only consumer that just needs `GetById` now depends on a type that exposes `Delete` — even though they don't use it. If the repository implementation changes how `Delete` works, the consumer's tests might suddenly need updating because the mock is set up for the wider interface. The dependency is wider than the actual use.

Better: split into focused interfaces:

```csharp
public interface IReadOnlyRepository<T>  { Task<T?> GetById(Guid id); /* ...*/ }
public interface IWriteRepository<T>     { Task Save(T entity); /* ... */ }
public interface IDeletableRepository<T> { Task Delete(Guid id); }
```

A specific concrete repository can implement all three (or just one, or two). Consumers depend on only what they need. The dependency surface is honest.

The cost when ISP is ignored:

1. **False coupling.** Consumers that only need 1 method depend on a type that exposes 25, including methods that may change for reasons unrelated to the consumer's use case.
2. **Forced stubs.** Implementers that legitimately don't support all methods (e.g., a read-only data source) have to throw `NotSupportedException` from methods they shouldn't have to provide. Now every consumer has to know which methods are real.
3. **Test brittleness.** Mocks have to set up the entire interface surface, even when most of it is irrelevant. Or you skip the mock setup and the test passes by accident, breaking when the prod code changes.
4. **Reduced reusability.** A fat interface is unlikely to be reused outside its original context. A focused interface (`IReadOnlyRepository<T>`) might be reused in many places.

The flip side — the cost of ISP taken too far — is interface explosion. If you have an interface with one method per behavior, you can end up with 30 micro-interfaces where 3 medium ones would have been clearer. The right grain is: **each interface represents a coherent role** that some consumer actually wants to depend on. If no consumer in the codebase wants the read-only-repository capability, there's no point splitting it out yet.

The senior heuristic: **start coarse, split when a real consumer appears that wants a narrower abstraction.** Splitting later is non-breaking (the original combined interface can extend the new narrower ones). Combining later is breaking. So err on the side of the narrower interface only when it's pulled into existence by a real use case — not preemptively.

The deepest version of this principle: interfaces are **shapes of dependency**. Make them match the actual shape of dependency in the code. A consumer that uses 1 method depending on a 25-method interface is dishonestly described — and dishonest types make systems harder to evolve.
