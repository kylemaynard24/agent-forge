# Homework — Testing with xUnit

Build a small feature-with-tests pair. The point is to practice TDD-style discipline AND to feel the difference between testing behavior and testing implementation.

## Build it

1. **Set up the projects:**
   ```bash
   mkdir orders-feature && cd orders-feature
   dotnet new sln -n orders-feature
   dotnet new classlib -n Orders -o src/Orders
   dotnet new xunit -n Orders.Tests -o tests/Orders.Tests
   dotnet sln add src/Orders tests/Orders.Tests
   dotnet add tests/Orders.Tests reference src/Orders
   dotnet add tests/Orders.Tests package FluentAssertions
   ```

2. **Implement `OrderTotaller` in `src/Orders/`** with this contract:
   ```csharp
   public class OrderTotaller(ITaxRateProvider taxRates)
   {
       public decimal CalculateTotal(IEnumerable<OrderLine> lines, string countryCode);
   }

   public interface ITaxRateProvider { decimal GetRate(string countryCode); }
   public record OrderLine(string Sku, decimal Price, int Quantity);
   ```
   Logic: subtotal = sum of `Price * Quantity` over all lines. Total = subtotal × (1 + taxRate). Throw if any quantity is negative or any price is negative; throw if `countryCode` is null/empty; throw if subtotal is zero.

3. **Write tests in `tests/Orders.Tests/`** for the following — each as a separate `[Fact]` or `[Theory]`:
   - Empty lines throws `InvalidOperationException`.
   - Zero-quantity line + non-empty list works correctly (zero contribution to total).
   - Negative quantity throws `ArgumentException`.
   - Negative price throws `ArgumentException`.
   - Null/empty country code throws `ArgumentException`.
   - Tax rate of 0 produces total equal to subtotal.
   - Tax rate of 0.10 (10%) on a $100 order produces $110 total.
   - A `[Theory]` over multiple country codes/tax rates/expected totals.

4. **Use a test double for `ITaxRateProvider`:** write a `FakeTaxRateProvider` class in the test project (NOT using a mocking library — write it by hand) that takes a dictionary of country → rate in its constructor and returns from it.

5. **In one of your tests**, deliberately test through implementation detail (e.g., reflect on a private field). Then refactor the test to go through the public API only. Note in a comment why the second is better.

## Done when

- [ ] All listed tests are present, and they pass against your `OrderTotaller`.
- [ ] You used `[Theory]` + `[InlineData]` for at least one parameterized case.
- [ ] You used FluentAssertions (`.Should().Be(...)`) consistently.
- [ ] Your `FakeTaxRateProvider` is hand-written, not Moq.
- [ ] You can articulate the difference between testing through the public API vs through internals.
- [ ] `dotnet test` runs all tests and they all pass.

## Bonus

- Add a property-based test using FsCheck: "for any non-negative price and any positive quantity, the calculated total is non-negative."
- Add a test that uses async with `await Task.Delay()` to demonstrate the `async Task` test pattern.
- Add a `[Fact(Skip = "Reason")]` test and observe the test output.

## Save to

`progress/<today>/working-folder/csharp-and-dotnet/12-orders-tests/`.

---

## Clean Code Lens

**Principle in focus:** Test Names as Living Specifications

A test named `Test3` or `CalculateTotal_Works` is documentation that tells you nothing. A test named `CalculateTotal_WhenTaxRateIsZero_ReturnsPureSubtotal` is a specification: it names the condition, the input context, and the expected outcome — and if the test fails two years from now, the failure message already tells you what contract was broken before you open the file. The full set of `[Fact]` and `[Theory]` names in your test class should read like a requirements list for `OrderTotaller`.

**Exercise:** Read all your test method names as a list, without opening their bodies. Can you reconstruct the full behavior spec of `OrderTotaller` — every edge case, every validation rule, every normal-path guarantee — just from the names? If any behavior is missing from the name-list, either you are missing a test or your existing test name is not specific enough. Add or rename until the list is a complete spec.

**Reflection:** In the exercise where you deliberately tested through a private field (implementation detail), then refactored to go through the public API only — what would have happened to that first test if you renamed the private field as part of a refactor? That fragility is the exact cost of testing implementation rather than behavior.
