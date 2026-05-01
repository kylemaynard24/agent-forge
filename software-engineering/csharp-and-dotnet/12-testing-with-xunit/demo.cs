// In a `dotnet new xunit` project, install: dotnet add package FluentAssertions
// Run with: dotnet test
//
// Demonstrates Fact, Theory with InlineData, async tests, FluentAssertions,
// and a worked example of testing through a public API rather than internals.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;

namespace XunitDemo.Tests;

// ============================================================================
// System under test
// ============================================================================
public class ShoppingCart
{
    private readonly List<(string Sku, decimal Price, int Qty)> _items = new();

    public void Add(string sku, decimal price, int qty = 1)
    {
        if (qty < 1) throw new ArgumentException("Qty must be >= 1", nameof(qty));
        if (price < 0) throw new ArgumentException("Price must be >= 0", nameof(price));
        _items.Add((sku, price, qty));
    }

    public decimal Subtotal() => _items.Sum(i => i.Price * i.Qty);
    public int ItemCount() => _items.Sum(i => i.Qty);

    public decimal ApplyDiscount(decimal percent)
    {
        if (percent < 0 || percent > 100) throw new ArgumentOutOfRangeException(nameof(percent));
        return Subtotal() * (1 - percent / 100m);
    }
}

// ============================================================================
// Tests
// ============================================================================
public class ShoppingCartTests
{
    // [Fact] — single test case
    [Fact]
    public void Subtotal_is_zero_for_empty_cart()
    {
        var cart = new ShoppingCart();
        cart.Subtotal().Should().Be(0);
    }

    [Fact]
    public void Add_increases_item_count()
    {
        var cart = new ShoppingCart();
        cart.Add("APPLE", 1.00m, qty: 3);
        cart.Add("BREAD", 2.50m);
        cart.ItemCount().Should().Be(4);
    }

    // [Theory] + [InlineData] — same test, multiple inputs
    [Theory]
    [InlineData(0, 100, 100)]
    [InlineData(10, 100, 90)]
    [InlineData(50, 100, 50)]
    [InlineData(100, 100, 0)]
    public void ApplyDiscount_calculates_correct_total(int discountPercent, decimal price, decimal expectedTotal)
    {
        var cart = new ShoppingCart();
        cart.Add("X", price);
        cart.ApplyDiscount(discountPercent).Should().Be(expectedTotal);
    }

    [Fact]
    public void Add_throws_for_negative_quantity()
    {
        var cart = new ShoppingCart();
        Action act = () => cart.Add("X", 1.00m, qty: -1);
        act.Should().Throw<ArgumentException>()
            .WithMessage("*Qty*");
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(101)]
    public void ApplyDiscount_throws_for_out_of_range_percent(decimal pct)
    {
        var cart = new ShoppingCart();
        Action act = () => cart.ApplyDiscount(pct);
        act.Should().Throw<ArgumentOutOfRangeException>();
    }

    // Async test
    [Fact]
    public async Task Async_test_pattern_returns_Task_not_void()
    {
        await Task.Delay(1);  // pretend this is real async work
        var cart = new ShoppingCart();
        cart.Add("X", 5.00m);
        cart.Subtotal().Should().Be(5.00m);
    }
}
