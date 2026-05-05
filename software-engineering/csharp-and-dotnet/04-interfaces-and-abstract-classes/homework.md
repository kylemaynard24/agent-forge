# Homework — Interfaces and abstract classes

Build a small payment-processing system that uses both interfaces (for the contract) and an abstract class (for shared behavior). The point is to feel the difference and pick correctly.

## Build it

1. **`IPaymentProcessor` interface** with two async methods:
   - `Task<PaymentResult> ChargeAsync(decimal amount, string currency, CancellationToken ct);`
   - `Task<PaymentResult> RefundAsync(string chargeId, decimal amount, CancellationToken ct);`

2. **`PaymentResult` record** — `record PaymentResult(bool Success, string? ChargeId, string? ErrorMessage);`

3. **`abstract class PaymentProcessorBase : IPaymentProcessor`** — provides shared behavior all real processors need:
   - Implements `ChargeAsync` and `RefundAsync` as concrete methods that:
     - Validate inputs (positive amount, 3-letter currency, etc.). Throw if invalid.
     - Log the attempt (`Console.WriteLine($"[{ProcessorName}] charging {amount} {currency}")`).
     - Delegate to a `protected abstract Task<PaymentResult> DoChargeAsync(...)` and `DoRefundAsync(...)` that subclasses implement.
     - Catch exceptions thrown by the abstract method and return a `PaymentResult` with `Success = false` instead of letting it propagate.
   - Has an abstract `string ProcessorName { get; }` that subclasses must provide.

4. **Two concrete subclasses:**
   - `class StripeProcessor : PaymentProcessorBase` — `ProcessorName => "stripe"`. Implementations of `DoChargeAsync` / `DoRefundAsync` simulate work with `await Task.Delay(50, ct)` and return a successful result.
   - `class CryptoProcessor : PaymentProcessorBase` — `ProcessorName => "crypto"`. Implementations simulate failure 50% of the time (random) by throwing a custom `PaymentDeclinedException`.

5. **`class PaymentRouter`** — takes an `IReadOnlyList<IPaymentProcessor>` (NOT `PaymentProcessorBase`) via constructor. Has a method `Task<PaymentResult> ChargeWithFallbackAsync(decimal amount, string currency, CancellationToken ct)` that tries each processor in order; returns the first successful result, or a final failure if all fail.

6. **In `Program.cs`:**
   - Construct a `PaymentRouter` with `[new StripeProcessor(), new CryptoProcessor()]`.
   - Try to charge $50 USD with cancellation token timeout of 5 seconds.
   - Try to charge $0 USD — show the validation exception.
   - Try a refund.

## Done when

- [ ] `IPaymentProcessor` is the interface; subclasses implement it via the abstract base.
- [ ] `PaymentRouter` depends on `IPaymentProcessor`, not `PaymentProcessorBase` (the interface, not the implementation detail).
- [ ] The abstract base correctly delegates to subclass-implemented `DoChargeAsync` / `DoRefundAsync` (Template Method pattern).
- [ ] Validation errors throw; processor failures (from the abstract method) are caught and returned as `PaymentResult` with `Success = false`.
- [ ] You can articulate why the validation logic belongs in the base class, not duplicated in each subclass.

## Bonus

- Write a `FakePaymentProcessor : IPaymentProcessor` (NOT inheriting from the abstract base) for tests. It just records calls and returns whatever you tell it.
- Make the `PaymentRouter` add a per-processor timeout via `CancellationTokenSource.CreateLinkedTokenSource`.

## Save to

`progress/<today>/working-folder/csharp-and-dotnet/04-payments/`.

---

## Clean Code Lens

**Principle in focus:** Interface Names Describe Capabilities, Not Implementations

`IPaymentProcessor` names a capability — something that can process payments — not a specific technology or mechanism. This matters because `PaymentRouter` depends on `IPaymentProcessor`, and that dependency reads as "I need something that can process payments," which is the correct statement of intent. If the interface were named `AbstractBasePaymentHandler` or `StripeCompatibleProcessor`, it would be leaking implementation details into what should be a pure contract.

**Exercise:** For each interface and abstract class in your payment system, write its name on one side of a piece of paper, and on the other side write what you would tell a caller who asks "what can you do?" — without mentioning how. If that capability description is clean and technology-agnostic, the name is good. If it sounds like "I can process payments the way Stripe does," the name is carrying too much implementation.

**Reflection:** `PaymentRouter` takes `IReadOnlyList<IPaymentProcessor>`, not `IReadOnlyList<PaymentProcessorBase>`. What would a caller lose — or have to know — if the parameter type were the abstract base class instead of the interface? What does that difference reveal about which abstraction is actually the right boundary?
