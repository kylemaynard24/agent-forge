// Run with: dotnet run
//
// Demonstrates LINQ method syntax, lazy evaluation, common operations,
// and the gotcha of multiple iteration.

using System;
using System.Collections.Generic;
using System.Linq;

namespace LinqDemo;

public record Order(int Id, string Customer, decimal Total, string Country);

public static class Demo
{
    private static readonly List<Order> Orders = new()
    {
        new(1, "Alice",   42.00m, "US"),
        new(2, "Bob",    150.00m, "US"),
        new(3, "Alice",   99.99m, "DE"),
        new(4, "Carol",  500.00m, "US"),
        new(5, "Dave",    12.50m, "DE"),
        new(6, "Bob",    300.00m, "DE"),
        new(7, "Carol",  250.00m, "US"),
    };

    public static void Main()
    {
        Console.WriteLine("=== Where + Select ===");
        var bigUsOrders = Orders
            .Where(o => o.Country == "US" && o.Total > 100)
            .Select(o => $"{o.Customer}: ${o.Total}");
        foreach (var s in bigUsOrders) Console.WriteLine(s);

        Console.WriteLine("\n=== OrderBy + Take ===");
        var top3 = Orders.OrderByDescending(o => o.Total).Take(3);
        foreach (var o in top3) Console.WriteLine($"  {o.Id}: {o.Customer} ${o.Total}");

        Console.WriteLine("\n=== GroupBy + Aggregate ===");
        var byCustomer = Orders
            .GroupBy(o => o.Customer)
            .Select(g => new
            {
                Customer = g.Key,
                Count = g.Count(),
                Total = g.Sum(o => o.Total),
            })
            .OrderByDescending(x => x.Total);
        foreach (var c in byCustomer)
            Console.WriteLine($"  {c.Customer}: {c.Count} orders, ${c.Total} total");

        Console.WriteLine("\n=== Aggregate (manual fold) ===");
        var totalRevenue = Orders.Aggregate(0m, (sum, o) => sum + o.Total);
        Console.WriteLine($"Total revenue: ${totalRevenue}");

        Console.WriteLine("\n=== Any / All / Count ===");
        Console.WriteLine($"Any over $400? {Orders.Any(o => o.Total > 400)}");
        Console.WriteLine($"All in US? {Orders.All(o => o.Country == "US")}");
        Console.WriteLine($"How many DE? {Orders.Count(o => o.Country == "DE")}");

        Console.WriteLine("\n=== Lazy evaluation pitfall ===");
        var query = Orders.Where(o =>
        {
            Console.WriteLine($"  evaluating order {o.Id}");
            return o.Total > 100;
        });

        Console.WriteLine("Query defined but not yet executed.");
        Console.WriteLine("Now calling .Count():");
        var count = query.Count();
        Console.WriteLine($"  count = {count}");
        Console.WriteLine("Now calling .ToList():");
        var list = query.ToList();  // re-runs the whole filter!
        Console.WriteLine($"  list count = {list.Count}");

        Console.WriteLine("\nFix — materialize once with .ToList() up front:");
        var materialized = Orders.Where(o => o.Total > 100).ToList();
        Console.WriteLine($"  materialized.Count = {materialized.Count} (no re-execution on subsequent operations)");
    }
}
