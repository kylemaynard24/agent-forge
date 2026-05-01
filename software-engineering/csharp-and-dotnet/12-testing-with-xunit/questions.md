# Questions — Testing with xUnit

Three questions on the design judgment of testing.

---

### Q1. The homework had you write a `FakeTaxRateProvider` by hand instead of using Moq. When is each form better, and what does the choice signal about the design under test?

**How to think about it:**

A **mocking library** (Moq, NSubstitute, FakeItEasy) generates a runtime proxy that satisfies an interface, with a fluent API for configuring return values and verifying calls:

```csharp
var mock = new Mock<ITaxRateProvider>();
mock.Setup(p => p.GetRate("US")).Returns(0.08m);
var totaller = new OrderTotaller(mock.Object);
// ... test ...
mock.Verify(p => p.GetRate("US"), Times.Once);
```

A **hand-written fake** is a real concrete class implementing the interface, with simple deterministic behavior:

```csharp
public class FakeTaxRateProvider : ITaxRateProvider
{
    private readonly Dictionary<string, decimal> _rates;
    public FakeTaxRateProvider(Dictionary<string, decimal> rates) => _rates = rates;
    public decimal GetRate(string countryCode) =>
        _rates.TryGetValue(countryCode, out var rate) ? rate : throw new KeyNotFoundException(countryCode);
}
```

**Mocks** win when:
- You need to **verify call patterns** (the SUT must call `X` once with these arguments).
- The interface is large and you only care about a few methods per test.
- Setting up specific return values per call is the test's main mechanism.

**Hand-written fakes** win when:
- The dependency has **stable behavior** that's the same across many tests (a realistic in-memory implementation).
- Tests focus on the **outputs of the SUT** (does it return the right total?) rather than how it interacted with collaborators.
- You want tests that read like "given a tax rate of 0.08, the total is X" rather than "the SUT called GetRate exactly once."

The choice often signals what you're testing:

- **Lots of mock-with-Verify tests** suggest you're testing *interactions* — "the SUT does the right calls in the right order." This is sometimes correct (the SUT's purpose IS coordination) but often is a code smell — you're testing implementation rather than behavior, and refactoring to change the call pattern breaks tests even when the externally-observable behavior is identical.
- **Hand-written-fake tests** suggest you're testing *outputs* — "given these inputs, the SUT produces the right answer." This is usually what you actually want — it tests behavior, not mechanics, and survives refactoring better.

The senior heuristic: **prefer fakes that behave like real implementations** wherever possible. An in-memory `IRepository` that actually stores and retrieves things, an `IClock` that returns a fixed time, an `IFileSystem` that uses a temp directory. Tests against these are clearer, less brittle, and often catch bugs that mocked tests miss (because the mock's behavior was a stub, not realistic).

The deeper principle: **mock libraries make it cheap to mock interactions — too cheap.** You end up testing "the SUT calls method X with these arguments" because it's easy, not because it's the right test. Fakes are slightly more work upfront but result in tests that test what you actually care about.

---

### Q2. Test naming conventions are surprisingly contentious. Why does the convention matter so much, and what makes a "good" test name?

**How to think about it:**

A test name is the **first thing a future developer sees** when a test fails — often years after the test was written, often by someone who has no context for the SUT. The test runner outputs:

```
Failed: ShoppingCartTests.Subtotal_is_zero_for_empty_cart
```

If that name conveys what the test was checking, the dev can immediately reason about whether the failure is a real bug or a test issue. If the name is `Test1` or `ShouldWork`, the dev has to open the test file and reverse-engineer intent before they can act.

Good test names share three properties:

1. **They state what's being tested.** "Subtotal" is the SUT's behavior under test.
2. **They state the condition.** "for empty cart" is the precondition that distinguishes this case from sibling cases.
3. **They state the expected outcome.** "is zero" is what the test asserts.

Two common conventions both achieve this:

- **`Method_condition_expectedResult`:** `Subtotal_for_empty_cart_is_zero`, `Add_with_negative_quantity_throws`.
- **`Should_expectedResult_when_condition` (BDD):** `Should_return_zero_when_cart_is_empty`, `Should_throw_when_quantity_is_negative`.

Both read as sentences. Both make failures self-documenting. Both pass the "could a new dev guess what this tests in 5 seconds?" check.

What makes BAD test names:

- `Test1`, `Test2`, ... — meaningless. You can't tell what failed.
- `ShoppingCartTest` (the class is fine; method should be specific) — hides intent.
- `WorksCorrectly`, `BasicTest` — vague; doesn't say what "correctly" means.
- `TestAddNegativeQuantityThrowsArgumentExceptionForCart` — accurate but unreadable; word soup.
- Names that match the method but not the case: 5 tests all called `Subtotal_test` with no distinguishing detail.

The xUnit convention is permissive — it doesn't enforce a naming style. Pick one (the underscore form or the BDD form), use it consistently across your codebase, and don't mix the two in the same project. Consistency is more important than which one you pick.

The senior take: **test names are documentation that runs**. They describe the system's behavior in a structured way, and they fail loudly when the behavior changes. Treating them as throwaway labels misses 80% of their value. Spending the extra 30 seconds to name a test well saves hours of debugging months from now.

A small additional discipline: when a test fails in CI, the failure message AND the test name together should give enough context to know what broke. If you regularly find yourself reading the test source to understand a failure, your test names need work.

---

### Q3. The README warned against testing implementation details. What are concrete examples of "testing implementation," why is it bad, and how do you reliably test through the public API?

**How to think about it:**

Implementation-detail testing means a test that depends on **how** the SUT works, not just **what** it does. The test breaks when you refactor internals without changing externally-observable behavior.

Concrete examples:

1. **Reflecting on private fields/methods.** `typeof(OrderTotaller).GetField("_lastResult", BindingFlags.NonPublic | BindingFlags.Instance).GetValue(sut)` — accessing internals through reflection. The test "passes" when the private field is named `_lastResult`; it breaks the day someone renames it to `_cachedResult`. Behavior didn't change; the test broke. The renamed field is functionally identical.

2. **Mocking too much and verifying call patterns.** `mock.Verify(p => p.GetRate("US"), Times.Once);` — testing that the SUT made exactly one call with exactly these arguments. If the SUT optimizes (caches the result, batches multiple calls into one) or de-optimizes (makes two calls instead of one for clarity), the behavior is the same but the test fails.

3. **Asserting on `ToString()` output that's just for debugging.** `result.ToString().Should().Be("Order(id=123, total=99.99)")` — the actual order's id and total are correct, but you've baked the format into the test. Changing the format (adding a field, changing the spacing) breaks the test even though the data is right.

4. **Testing internal helper methods directly.** Adding `internal` accessibility to a method just so a test can call it, then writing tests for the helper. The helper is implementation; tests against it constrain the implementation, not the externally-visible behavior.

5. **Counting calls to logging or instrumentation.** "The method should log exactly 3 times." Logging is implementation; counting it is fragile.

Why is it bad? Because you've coupled your test suite to your implementation. Refactoring becomes painful — every cleanup that changes internals breaks tests. The signal-to-noise ratio of test failures drops: "did the behavior break, or did I just rename something?" Eventually developers start ignoring test failures or routinely deleting "broken" tests, which defeats the purpose.

How to reliably test through the public API:

1. **Test inputs and outputs.** "Given these arguments to a public method, the public return value (or thrown exception, or visible side effect) is X." Both sides of the boundary are public; everything in between is implementation.

2. **Use realistic fakes, not mocks.** A `FakeRepository` that actually stores data is closer to reality than a mock that returns whatever you stub. When the test only depends on the realistic behavior of the fake, refactoring the SUT's interaction with it doesn't break the test.

3. **Set up state through the public API.** Don't reach into the SUT to plant state; call its public methods to put it into the desired state, then test from there. If you can't get the SUT into the state you want via the public API, that's a sign the public API is missing something — fix the API instead of reaching around it.

4. **Use the strictest assertion that captures intent and no more.** `result.Total.Should().Be(110.00m)` is good. `result.Should().BeEquivalentTo(new { Total = 110.00m })` is better when you only care about Total. `result.Should().Be(specificObject)` is overspecified — it asserts every field, including ones the test doesn't care about.

5. **Refactor your SUT to make testing easier**, not the other way around. If you can't test a behavior without reaching into internals, the design has a problem — the behavior probably needs to be exposed differently (a return value where there was a side effect, an interface where there was a hidden dependency).

The senior take: tests should describe **what the system does**, not **how it does it**. Tests that survive refactoring are tests that test the right thing. The discipline is hard because the language lets you reach into internals trivially — `internal`, reflection, mocks-with-verify all make implementation-coupling cheap. The test author has to actively choose the harder, more durable form: behavior, not mechanics.
