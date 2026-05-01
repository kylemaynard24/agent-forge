# Homework — Properties and encapsulation

Build a `Temperature` value type that demonstrates each property form deliberately, plus a `WeatherStation` that uses them.

## Build it

1. **`Temperature` — a class** with the following:
   - A `private readonly double _kelvin` field.
   - An `init` property `double Kelvin { get; init; }` that validates `value >= 0` (no negative absolute temperatures); throws `ArgumentOutOfRangeException` if invalid. Use the modern `required` keyword so callers must set it.
   - Two computed properties `double Celsius` and `double Fahrenheit` (expression-bodied), derived from Kelvin.
   - A `static factory` method `FromCelsius(double c)` and `FromFahrenheit(double f)` that compute Kelvin and return a new `Temperature`.
   - An `override string ToString()` returning `"{Celsius:F1}°C"`.

2. **`WeatherStation` — a class** with:
   - A private `List<Temperature> _readings = new()`.
   - A public `IReadOnlyList<Temperature> Readings => _readings;` — note the read-only interface.
   - A public method `void Record(Temperature t)` that appends.
   - Computed properties `Temperature? Hottest` and `Temperature? Coldest` (null if no readings).
   - A computed property `double AverageCelsius` (return `0` if no readings).

3. **In `Program.cs`:**
   - Create a `WeatherStation`.
   - Record 5 readings using a mix of the static factories (some Celsius, some Fahrenheit).
   - Print each reading.
   - Print the hottest, coldest, and average.
   - Try to construct a `Temperature` with negative Kelvin — show the exception.
   - Try to mutate `station.Readings` from `Program.cs` (e.g., `station.Readings.Add(...)`) — show that this fails to compile.

## Done when

- [ ] Every property uses the most restrictive form that still meets the need (no `{ get; set; }` where `{ get; init; }` would do).
- [ ] `Temperature` cannot be constructed in an invalid state from anywhere.
- [ ] `WeatherStation.Readings` exposes the data without letting callers mutate the underlying list. (Compile error is the goal.)
- [ ] `Hottest` and `Coldest` correctly return `null` for an empty station.
- [ ] You can articulate why `IReadOnlyList<Temperature>` is the right return type instead of `List<Temperature>`.

## Bonus

- Add an instance method `Temperature With(double newCelsius)` that returns a new `Temperature` (immutable update pattern).
- Add operator overloads `Temperature operator +(Temperature a, Temperature b)` and `operator -`. (These should add/subtract the underlying Kelvin values.)
- Convert `Temperature` to a `record` and observe what changes (and what now comes for free).

## Save to

`progress/<today>/working-folder/csharp-and-dotnet/02-weather/`.
