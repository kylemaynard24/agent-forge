// Run with: dotnet run
//
// A small integrating demo showing C# in service of all four sprint subjects:
// - Architecture: separation of concerns via interfaces + DI
// - Design Patterns: Strategy via interface composition
// - Agentic: a tiny LLM-loop with a stub LLM
// - DevOps adjacency: a Key Vault-style secret accessor (using a fake)

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CapstoneDemo;

// ---------------------------------------------------------------------------
// ARCHITECTURE: separated concerns
// ---------------------------------------------------------------------------
public interface IOrderValidator { void Validate(Order order); }
public interface IOrderRepository { Task SaveAsync(Order order, CancellationToken ct); }
public interface IOrderNotifier { Task NotifyAsync(Order order, CancellationToken ct); }

public record Order(Guid Id, string CustomerEmail, decimal Total);

public class OrderHandler(
    IOrderValidator validator,
    IOrderRepository repository,
    IOrderNotifier notifier)
{
    public async Task SubmitAsync(Order order, CancellationToken ct)
    {
        validator.Validate(order);
        await repository.SaveAsync(order, ct);
        await notifier.NotifyAsync(order, ct);
    }
}

// ---------------------------------------------------------------------------
// DESIGN PATTERNS: Strategy via interfaces + composition (Head First Ch 1 in C#)
// ---------------------------------------------------------------------------
public interface IFlyBehavior { void Fly(); }
public class FlyWithWings : IFlyBehavior { public void Fly() => Console.WriteLine("    Flapping wings."); }
public class FlyNoWay     : IFlyBehavior { public void Fly() => Console.WriteLine("    (can't fly)"); }

public abstract class Duck(IFlyBehavior fly)
{
    public void PerformFly() => fly.Fly();
}
public class MallardDuck : Duck { public MallardDuck() : base(new FlyWithWings()) { } }
public class RubberDuck  : Duck { public RubberDuck()  : base(new FlyNoWay())  { } }

// ---------------------------------------------------------------------------
// AGENTIC: tiny stub-LLM loop
// ---------------------------------------------------------------------------
public interface ILlm { LlmStep Decide(string context); }
public record LlmStep(string Action, string? ToolName, string? ToolArg);

public class StubLlm : ILlm
{
    private int _i;
    public LlmStep Decide(string context) => _i++ switch
    {
        0 => new("ToolCall", "WordCount", context),
        _ => new("Done", null, $"Result: {context}"),
    };
}

public static class AgentTools
{
    public static int WordCount(string text) => text.Split(' ').Length;
}

public class TinyAgent(ILlm llm, string goal)
{
    public string Run()
    {
        string context = goal;
        for (int i = 0; i < 3; i++)
        {
            var step = llm.Decide(context);
            Console.WriteLine($"    [agent step {i}] {step.Action} (tool={step.ToolName})");
            if (step.Action == "Done") return step.ToolArg ?? "(no result)";
            if (step.ToolName == "WordCount")
                context = $"WordCount={AgentTools.WordCount(step.ToolArg ?? "")}";
        }
        return "(max iterations)";
    }
}

// ---------------------------------------------------------------------------
// DEVOPS-ADJACENT: secret accessor (Key Vault-style with a fake)
// ---------------------------------------------------------------------------
public interface ISecretClient { Task<string> GetAsync(string name, CancellationToken ct); }
public class FakeKeyVaultClient : ISecretClient
{
    public Task<string> GetAsync(string name, CancellationToken ct)
        => Task.FromResult($"fake-secret-for-{name}");
}

// ---------------------------------------------------------------------------
// Composition root + demo
// ---------------------------------------------------------------------------
public static class Demo
{
    public static async Task Main()
    {
        Console.WriteLine("=== Architecture: separated concerns ===");
        var handler = new OrderHandler(
            validator: new InlineValidator(),
            repository: new ConsoleRepository(),
            notifier: new ConsoleNotifier());
        await handler.SubmitAsync(new Order(Guid.NewGuid(), "kyle@example.com", 99.99m), CancellationToken.None);

        Console.WriteLine("\n=== Design Patterns: Strategy via interfaces ===");
        Duck[] ducks = [new MallardDuck(), new RubberDuck()];
        foreach (var d in ducks) d.PerformFly();

        Console.WriteLine("\n=== Agentic: tiny stub-LLM loop ===");
        var agent = new TinyAgent(new StubLlm(), goal: "tell me how many words are here");
        Console.WriteLine($"  Final: {agent.Run()}");

        Console.WriteLine("\n=== DevOps-adjacent: secret accessor ===");
        ISecretClient secrets = new FakeKeyVaultClient();
        var apiKey = await secrets.GetAsync("ANTHROPIC_API_KEY", CancellationToken.None);
        Console.WriteLine($"  Got secret: {apiKey}");
    }

    // Inline implementations for the demo
    public class InlineValidator : IOrderValidator
    {
        public void Validate(Order order)
        {
            if (order.Total <= 0) throw new ArgumentException("Invalid total");
        }
    }
    public class ConsoleRepository : IOrderRepository
    {
        public Task SaveAsync(Order order, CancellationToken ct)
        {
            Console.WriteLine($"  [repo] saving {order.Id}");
            return Task.CompletedTask;
        }
    }
    public class ConsoleNotifier : IOrderNotifier
    {
        public Task NotifyAsync(Order order, CancellationToken ct)
        {
            Console.WriteLine($"  [notify] emailing {order.CustomerEmail}");
            return Task.CompletedTask;
        }
    }
}
