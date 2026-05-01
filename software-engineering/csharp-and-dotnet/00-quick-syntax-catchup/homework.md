# Homework — Quick syntax catchup

A short, focused exercise to confirm you can write idiomatic C# syntax. If you breeze through this in 30 minutes, move on to topic 01.

## Build it

Create a console app called `syntax-warmup` and write a single `Program.cs` (top-level statements) that does ALL of the following:

1. **Variables and types.** Declare an `int`, a `string`, a `double`, and a `bool` with sensible names. Print each.
2. **Nullable reference types.** Declare a `string?` initialized to `null`. Use the null-coalescing operator (`??`) to print either its value or `"(unknown)"`.
3. **String interpolation.** Greet a user using `$"..."` interpolation, including their name AND the current `DateTime.Now` formatted to short date.
4. **Switch expression.** Read a number from `Console.ReadLine()`, parse it to an `int`, and use a switch expression with patterns to classify it as `"negative"`, `"zero"`, `"small (1-9)"`, or `"large (10+)"`.
5. **A method.** Write `int Sum(int[] numbers)` using a `foreach` loop. Call it with `[1, 2, 3, 4, 5]` and print the result.
6. **Collection initializer + Dictionary.** Build a `Dictionary<string, int>` of three product names → prices. Iterate it with `foreach (var (key, value) in dict)` and print each pair.

Keep it under 60 lines.

## Done when

- [ ] `dotnet run` produces sensible output for every section.
- [ ] No compiler warnings (with nullable reference types enabled — the default).
- [ ] You used switch *expression* (`x switch { ... }`), not switch *statement*.
- [ ] You used `foreach` for iteration, not a `for` loop with index.
- [ ] You can explain in one sentence the difference between `var x = 5;` and `int x = 5;`.

## Bonus

- Replace one of the methods with an expression-bodied form (`int Sum(int[] n) => n.Sum();`).
- Use a raw string literal (`"""..."""`) anywhere it improves readability.

## Save to

`progress/<today>/working-folder/csharp-and-dotnet/00-syntax-warmup/Program.cs` if you're working through this as part of a daily-tasks sprint, or anywhere convenient otherwise.
