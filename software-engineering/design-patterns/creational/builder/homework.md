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

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Functions Should Do One Thing

Builder method names are the fluent API's prose — each method should name the one dimension it sets, so that a chained call site reads like a sentence: `request.method('POST').url('/api/pay').body(payload).timeout(5000).build()` describes the request in the domain's vocabulary without any implementation noise. Applied cleanly, each method sets exactly one field and returns `this`, making the chain scannable and its intent obvious even without documentation. Applied messily, methods like `configure(options)`, `setRequestDetails(method, url, headers)`, or `withEverything(obj)` collapse multiple responsibilities into one call, destroying the readability that the fluent interface is supposed to provide.

**Exercise:** Read your builder call site aloud as an English sentence, substituting "with" for each dot. If any method name breaks the sentence rhythm or requires a mental translation step to understand what it sets, rename it until the chain reads naturally.

**Reflection:** The `RequestDirector` in the stretch goal wraps the builder to encode reusable presets — but the director's method names (`jsonApi`, `formUpload`) operate at a higher level of abstraction than the builder's method names (`method`, `header`, `body`). What does this naming gap tell you about the two layers of intent the pattern is managing?
