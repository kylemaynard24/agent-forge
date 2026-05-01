# Capstone: implementing with the four sprint subjects

This track exists not to be its own destination but to be the *language* in which the four sprint subjects' apply tasks get done. This README is a guide to using C# specifically for each of the four subjects' apply work.

## Setup that applies to all four

A reasonable solution layout for daily apply-task work:

```
playground/                    # one solution for all your apply work
├── playground.sln
├── src/
│   ├── Agentic/               # tiny-agent + agentic experiments
│   │   └── Agentic.csproj
│   ├── Architecture/          # SoC + architecture experiments
│   │   └── Architecture.csproj
│   └── DesignPatterns/        # SimUDuck, Observer Weather Station, etc.
│       └── DesignPatterns.csproj
└── tests/
    └── Tests/                 # xUnit project that references the above
        └── Tests.csproj
```

```bash
# One-time setup
mkdir playground && cd playground
dotnet new sln -n playground
dotnet new console -n Agentic -o src/Agentic
dotnet new console -n Architecture -o src/Architecture
dotnet new console -n DesignPatterns -o src/DesignPatterns
dotnet new xunit -n Tests -o tests/Tests
dotnet sln add src/Agentic src/Architecture src/DesignPatterns tests/Tests
dotnet add tests/Tests reference src/Agentic src/Architecture src/DesignPatterns
```

Save the daily `working-folder/` apply work as files in the appropriate project. Each day's `Program.cs` (or a renamed entry file) runs that day's example.

## Applied to each of the four subjects

### Agentic workflows

The tiny-agent example from Day 1 in C#:

```csharp
// A four-piece anatomy: stub LLM + one tool + a loop + a goal
using System;
using System.IO;

namespace Agentic;

public interface ILlm
{
    LlmResponse Decide(string context);
}

public record LlmResponse(string Action, string? ToolName, string? ToolArg);

public class StubLlm : ILlm
{
    private int _step;
    public LlmResponse Decide(string context) => _step++ switch
    {
        0 => new LlmResponse(Action: "ToolCall", ToolName: "CountLines", ToolArg: "data.txt"),
        _ => new LlmResponse(Action: "Done", ToolName: null, ToolArg: $"Result: {context}"),
    };
}

public static class Tools
{
    public static int CountLines(string path) => File.ReadAllLines(path).Length;
}

public class TinyAgent(ILlm llm, string goal)
{
    public string Run(int maxIterations = 3)
    {
        string context = $"Goal: {goal}";
        for (int i = 0; i < maxIterations; i++)
        {
            var step = llm.Decide(context);
            Console.WriteLine($"Step {i}: {step.Action} (tool={step.ToolName})");
            if (step.Action == "Done") return step.ToolArg ?? "(no result)";
            if (step.ToolName == "CountLines")
                context = $"CountLines result: {Tools.CountLines(step.ToolArg ?? "")}";
        }
        return "(max iterations reached)";
    }
}

public static class Program
{
    public static void Main()
    {
        var agent = new TinyAgent(new StubLlm(), "tell me how many lines are in data.txt");
        Console.WriteLine($"\nFinal: {agent.Run()}");
    }
}
```

What this exercises: interfaces (Topic `04`), records (Topic `01`), constructor injection, polymorphic strategy. When you graduate to a real LLM, swap `StubLlm` for an HTTP-client wrapper around the Anthropic API. The interface stays; only the implementation changes.

### Software architecture

Apply tasks for separation-of-concerns and similar fundamentals translate cleanly. The "before" and "after" pattern in C#:

```csharp
// BEFORE — three concerns mixed
public class OrderHandlerBad
{
    public void Submit(Order order)
    {
        if (order.Total <= 0) throw new ArgumentException("Invalid total");  // validation
        File.AppendAllText("orders.txt", $"{order.Id},{order.Total}\n");      // persistence
        Console.WriteLine($"Email sent to {order.CustomerEmail}");             // notification
    }
}

// AFTER — three concerns split
public interface IOrderValidator { void Validate(Order order); }
public interface IOrderRepository { void Save(Order order); }
public interface IOrderNotifier   { void Notify(Order order); }

public class OrderValidator : IOrderValidator
{
    public void Validate(Order order)
    {
        if (order.Total <= 0) throw new ArgumentException("Invalid total");
    }
}

// (similar for the other two)

public class OrderHandlerGood(
    IOrderValidator validator,
    IOrderRepository repository,
    IOrderNotifier notifier)
{
    public void Submit(Order order)
    {
        validator.Validate(order);
        repository.Save(order);
        notifier.Notify(order);
    }
}
```

What this exercises: interfaces, primary constructors, dependency injection. Test with mocks of the three interfaces: each concern is now testable in isolation.

### Design patterns

Topics `01-04` already covered SimUDuck (Strategy + interfaces + composition). Other Head First chapters in C#:

- **Ch 2 Observer (Weather Station):** events (Topic `07`) are the natural C# fit. C# also has built-in `IObserver<T>` / `IObservable<T>` interfaces in `System` for the more formal Observer pattern.
- **Ch 3 Decorator (Starbuzz Coffee):** abstract base class + decorator subclasses that wrap a base. Records can also work, but classes are more idiomatic for Decorator.
- **Ch 4 Factory (Pizza Store):** abstract method on a base class, overridden in subclasses.
- **Ch 6 Command (Remote Control):** delegates (Topic `07`) make this lighter — a `Command` is essentially `Action` (or `Func<...>`). The OO version with an `ICommand` interface is also a good fit.
- **Ch 8 Template Method (CaffeineBeverage):** abstract base class with a non-virtual public method that calls protected virtual hook methods.

Each chapter implementation belongs in its own folder under `src/DesignPatterns/HeadFirstCh<N>/`.

### DevOps (Bicep stays Bicep, but C# enters the deploy story)

The DevOps apply tasks are mostly Bicep + Azure CLI — not C#. But two integration points:

**1. Containerizing a .NET app for Container Apps deployment:**

```dockerfile
# Multi-stage Dockerfile for .NET 8 Web API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.sln .
COPY src/MyApp.Api/*.csproj src/MyApp.Api/
COPY src/MyApp.Domain/*.csproj src/MyApp.Domain/
RUN dotnet restore
COPY . .
RUN dotnet publish src/MyApp.Api -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "MyApp.Api.dll"]
```

Note the deliberate `COPY *.csproj` first, then `dotnet restore`, then `COPY . .` — this layering caches the package restore step so changes to source code don't re-download every NuGet package. Critical for fast CI builds.

**2. Reading Azure Key Vault secrets via managed identity:**

```csharp
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

var keyVaultName = Environment.GetEnvironmentVariable("KEY_VAULT_NAME")!;
var client = new SecretClient(
    new Uri($"https://{keyVaultName}.vault.azure.net/"),
    new DefaultAzureCredential());

KeyVaultSecret secret = await client.GetSecretAsync("MyApiKey");
string apiKey = secret.Value;
```

`DefaultAzureCredential` automatically uses the right auth mechanism — managed identity in Azure, your `az login` credentials locally. No secrets in code or config files. This is the modern .NET-on-Azure pattern; the Bicep work in your Level-2 syllabus sets up the managed identity that this code uses.

## A practical rhythm

Each day's apply task says what to build (the algorithm/concept). This C# track says how the language idioms work. When the daily apply task says "write a 30-line script that splits three concerns into three classes" — read topic `02` for properties, topic `04` for interfaces, then write the C#. When it says "type the SimUDuck Duck base class," topic `04` shows the modern-C# version.

Over 6-9 months of daily apply tasks in C#, you accumulate a sizable practical fluency without ever sitting down to "study C#" as a separate activity. The four subjects drive the work; this track is the language layer underneath.
