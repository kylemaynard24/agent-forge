# Testing with xUnit

xUnit is the most-used .NET testing framework. The other major option (NUnit) is also fine; MSTest is older and less idiomatic. This README assumes xUnit; the concepts translate.

## Setup

```bash
dotnet new xunit -n MyApp.Tests
dotnet sln add tests/MyApp.Tests/MyApp.Tests.csproj
dotnet add tests/MyApp.Tests/MyApp.Tests.csproj reference src/MyApp/MyApp.csproj
```

Common companion packages:

```bash
dotnet add package FluentAssertions      # readable assertions
dotnet add package Moq                    # mocking (or NSubstitute as an alternative)
dotnet add package Microsoft.NET.Test.Sdk # test runner adapter
```

## Basic test

```csharp
using Xunit;
using FluentAssertions;
using MyApp;

public class CalculatorTests
{
    [Fact]
    public void Add_returns_sum_of_two_integers()
    {
        // arrange
        var sut = new Calculator();   // sut = "system under test"

        // act
        var result = sut.Add(2, 3);

        // assert
        result.Should().Be(5);
    }
}
```

`[Fact]` marks a method as a test. The method must be parameterless and return `void` (or `Task` for async).

## Parameterized tests with `[Theory]`

```csharp
[Theory]
[InlineData(1, 2, 3)]
[InlineData(0, 0, 0)]
[InlineData(-5, 5, 0)]
[InlineData(int.MaxValue, 0, int.MaxValue)]
public void Add_handles_various_inputs(int a, int b, int expected)
{
    var sut = new Calculator();
    sut.Add(a, b).Should().Be(expected);
}
```

`[InlineData]` provides constant cases. For complex test data, use `[MemberData]` (data from a static property) or `[ClassData]` (data from a class). For property-based testing — generated random inputs that obey invariants — use the **FsCheck** package.

## Async tests

```csharp
[Fact]
public async Task FetchAsync_returns_content_from_endpoint()
{
    using var server = new TestServer();
    var client = server.CreateClient();
    var content = await client.GetStringAsync("/health");
    content.Should().Be("OK");
}
```

xUnit handles `async Task` test methods natively. Always return `Task` from async tests, never `void` — async void tests are not awaited and may report passing while still running.

## Mocking with Moq

```csharp
using Moq;

[Fact]
public async Task SubmitOrder_calls_payment_processor_with_correct_amount()
{
    // arrange
    var mockProcessor = new Mock<IPaymentProcessor>();
    mockProcessor
        .Setup(p => p.ChargeAsync(It.IsAny<Money>(), It.IsAny<CancellationToken>()))
        .ReturnsAsync(new PaymentResult { Success = true });

    var sut = new OrderService(mockProcessor.Object);
    var order = new Order { Total = new Money(100m, "USD") };

    // act
    await sut.SubmitAsync(order, CancellationToken.None);

    // assert — verify the mock was called as expected
    mockProcessor.Verify(
        p => p.ChargeAsync(
            It.Is<Money>(m => m.Amount == 100m),
            It.IsAny<CancellationToken>()),
        Times.Once);
}
```

The mocking discipline: **mock interfaces (or abstract classes), not concrete classes.** If you find yourself wanting to mock a concrete class, that's a sign the class should depend on an interface that you can mock instead — the design is leaking.

## What to test (and what not to)

This is the senior-engineer judgment topic, more than the syntax.

**Test:**
- Behavior the caller depends on. If a caller calls `order.Validate()` and expects `false` for invalid orders, test that.
- Edge cases — boundary values, empty collections, nulls, max-int, min-int.
- Error paths — does invalid input throw the right exception? Does cancellation work?
- Integration boundaries — the seam between your code and an external system, often via a fake or test container.

**Don't test:**
- Implementation details. If your test breaks every time you refactor without changing behavior, you're testing implementation. The fix is to test through the public API only.
- The framework. Don't write tests asserting that EF Core actually saves data; you'd just be testing EF Core. Trust the framework; test your business logic.
- Trivial getters/setters with no logic.
- Generated code.

## Common mistakes

- **Brittle tests that mock everything.** A test where every collaborator is mocked tests very little — usually that the SUT calls its collaborators in a specific order. Real-world refactor breaks the test even though the behavior is preserved. Better: integrate as much real code as possible (in-memory DB, real config, etc.) and only mock at true external boundaries.
- **Tests that share mutable state.** xUnit creates a new test class instance per test method — but if you have static state, tests pollute each other. Avoid statics in code under test.
- **Tests that depend on order.** Don't assume tests run in any particular order. Each test should set up its own state.
- **Tests that skip the assertion.** A test with no `Assert` (or `.Should()`) passes if it didn't throw — but that doesn't prove anything specific. Always assert what the test is verifying.
- **Tests that are slow.** Unit tests should be sub-millisecond. If your unit tests are slow, you're probably testing too much (integration tests in disguise) or sleeping in test code (which you should never do — use deterministic time abstractions).

## Test naming

A good test name documents what's being tested AND what behavior is expected. Two common conventions:

```csharp
// Style 1: Method_condition_result
[Fact] public void Validate_returns_false_when_total_is_zero() { }

// Style 2: Should_result_when_condition (BDD style)
[Fact] public void Should_return_false_when_total_is_zero() { }
```

Both are fine; pick one and stick with it. Sentence-form names read better in failure output ("`Validate_returns_false_when_total_is_zero` failed") than acronyms or abbreviations.

## Continuous testing

```bash
dotnet watch test
```

Re-runs tests on file change. Hugely useful for tight TDD loops.

## Where to next

- Topic `13-capstone-implement-with-the-four-tracks` — apply C# to apply tasks across the four sprint subjects.
