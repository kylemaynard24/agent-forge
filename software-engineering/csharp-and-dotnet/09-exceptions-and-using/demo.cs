// Run with: dotnet run
//
// Demonstrates throw/catch with type-specific handlers, exception filters,
// custom exception types, IDisposable + using, and the Try* alternative.

using System;
using System.Collections.Generic;
using System.IO;

namespace ExceptionsDemo;

// ============================================================================
// Custom exception type
// ============================================================================
public class OrderValidationException(string message, IEnumerable<string> errors)
    : Exception(message)
{
    public IReadOnlyList<string> Errors { get; } = new List<string>(errors).AsReadOnly();
}

// ============================================================================
// IDisposable resource
// ============================================================================
public sealed class TempFileScope : IDisposable
{
    public string Path { get; }
    private bool _disposed;

    public TempFileScope()
    {
        Path = System.IO.Path.GetTempFileName();
        Console.WriteLine($"  [TempFileScope] created {Path}");
    }

    public void Dispose()
    {
        if (_disposed) return;
        try
        {
            File.Delete(Path);
            Console.WriteLine($"  [TempFileScope] deleted {Path}");
        }
        catch { /* best-effort cleanup */ }
        _disposed = true;
    }
}

// ============================================================================
// Demo
// ============================================================================
public static class Demo
{
    public static void Main()
    {
        // Type-specific catch
        Console.WriteLine("--- Type-specific catch ---");
        try { File.ReadAllText("does-not-exist.txt"); }
        catch (FileNotFoundException ex)
        { Console.WriteLine($"  Caught FileNotFoundException: {ex.FileName}"); }
        catch (Exception)
        { Console.WriteLine("  Caught generic Exception (won't happen here)"); }

        // Exception filter (when clause)
        Console.WriteLine("\n--- Exception filter ---");
        try { ParseAge("ninety"); }
        catch (FormatException ex) when (ex.Message.Contains("Input"))
        { Console.WriteLine($"  Filtered: {ex.Message}"); }

        // Custom exception type
        Console.WriteLine("\n--- Custom exception type ---");
        try { ValidateOrder(total: -10, customerEmail: ""); }
        catch (OrderValidationException ex)
        {
            Console.WriteLine($"  Caught: {ex.Message}");
            foreach (var err in ex.Errors) Console.WriteLine($"    - {err}");
        }

        // using declaration — automatic Dispose
        Console.WriteLine("\n--- using declaration ---");
        WriteToTempFile();  // resource cleaned up automatically
        Console.WriteLine("  (back from method, temp file already deleted)");

        // Try* pattern alternative — no exception for expected misses
        Console.WriteLine("\n--- Try* alternative ---");
        if (TryParseAge("30", out var ageOk))
            Console.WriteLine($"  Parsed: {ageOk}");
        if (!TryParseAge("ninety", out var ageBad))
            Console.WriteLine($"  Failed to parse 'ninety' (no exception thrown)");
    }

    // Throws on invalid input — appropriate when the caller is expected to give valid input
    private static int ParseAge(string s) => int.Parse(s);

    // Returns success/failure — appropriate when failure is part of normal flow
    private static bool TryParseAge(string s, out int age) => int.TryParse(s, out age);

    private static void ValidateOrder(decimal total, string customerEmail)
    {
        var errors = new List<string>();
        if (total <= 0) errors.Add("Total must be positive");
        if (string.IsNullOrWhiteSpace(customerEmail)) errors.Add("Customer email required");
        if (errors.Count > 0)
            throw new OrderValidationException("Order failed validation", errors);
    }

    private static void WriteToTempFile()
    {
        using var scope = new TempFileScope();
        File.WriteAllText(scope.Path, "hello");
        Console.WriteLine($"  wrote to {scope.Path}, size={new FileInfo(scope.Path).Length} bytes");
    }
}
