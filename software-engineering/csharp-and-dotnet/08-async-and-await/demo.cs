// Run with: dotnet run
//
// Demonstrates basic async/await, sequential vs concurrent waits,
// cancellation, and IAsyncEnumerable.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;

namespace AsyncDemo;

public static class Demo
{
    public static async Task Main()
    {
        // Sequential — each await blocks before the next starts
        Console.WriteLine("--- Sequential ---");
        var sw = System.Diagnostics.Stopwatch.StartNew();
        await SimulateWorkAsync("alpha", 500);
        await SimulateWorkAsync("beta", 500);
        await SimulateWorkAsync("gamma", 500);
        Console.WriteLine($"Sequential took {sw.ElapsedMilliseconds}ms");

        // Concurrent — start all, then await all
        Console.WriteLine("\n--- Concurrent (Task.WhenAll) ---");
        sw.Restart();
        var tasks = new[]
        {
            SimulateWorkAsync("alpha", 500),
            SimulateWorkAsync("beta", 500),
            SimulateWorkAsync("gamma", 500),
        };
        await Task.WhenAll(tasks);
        Console.WriteLine($"Concurrent took {sw.ElapsedMilliseconds}ms");

        // Cancellation
        Console.WriteLine("\n--- Cancellation (after 200ms) ---");
        using var cts = new CancellationTokenSource(TimeSpan.FromMilliseconds(200));
        try
        {
            await SimulateWorkAsync("delta", 1000, cts.Token);
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("delta was cancelled before completing.");
        }

        // IAsyncEnumerable
        Console.WriteLine("\n--- Streaming with IAsyncEnumerable ---");
        await foreach (var line in StreamCountdownAsync(3))
        {
            Console.WriteLine($"received: {line}");
        }
    }

    public static async Task SimulateWorkAsync(
        string label,
        int delayMs,
        CancellationToken ct = default)
    {
        await Task.Delay(delayMs, ct);
        Console.WriteLine($"  finished {label} ({delayMs}ms)");
    }

    public static async IAsyncEnumerable<string> StreamCountdownAsync(
        int from,
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        for (int i = from; i > 0; i--)
        {
            await Task.Delay(300, ct);
            yield return $"tick {i}";
        }
    }
}
