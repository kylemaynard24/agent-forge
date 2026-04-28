# Homework — Builder

> Construct a complex object step-by-step; same construction code can build different representations.

## Exercise: HttpRequest builder

**Scenario:** Build a fluent `HttpRequest` builder supporting chained `.method()`, `.url()`, `.header()`, `.query()`, `.body()`, `.timeout()` calls and producing a frozen request object.

**Build:**
- An `HttpRequestBuilder` class returning `this` from each setter.
- A `.build()` method returning a frozen object (`Object.freeze`) that callers cannot mutate.
- Validation at `.build()` time, not earlier.

**Constraints (these enforce the pattern):**
- Calling `.body()` on a GET must throw — but only at `.build()` time, so call order doesn't matter.
- The final object must be immutable.
- The same builder instance must be reusable: `b.url(...).build()` then `b.url(...).build()` produces two distinct frozen requests.

## Stretch

Add a `RequestDirector` with two presets:
- `jsonApi(url, payload)` — sets POST + JSON content-type + body
- `formUpload(url, file)` — sets POST + multipart + body

The director uses the builder; it does not become one.

## Reflection

- Why use a Director at all? What does it buy beyond just calling the builder yourself?

## Done when

- [ ] Demo builds a GET, a POST with JSON body, and shows that `body()` on GET throws at build time.
- [ ] The frozen object survives an attempted mutation (assignment is silently ignored or throws in strict mode).
