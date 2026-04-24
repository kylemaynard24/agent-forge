# Builder

**Category:** Creational

## Intent

Separate the **construction** of a complex object from its **representation**, so the same construction process can produce different results. In practice: step-by-step building through chainable methods, finalized with a `build()` call.

## When to use

- An object has many optional parameters or configuration steps (constructors with 10 arguments are a smell).
- You want readable construction code (`.withUrl(...).withHeader(...).withTimeout(...).build()`).
- You want to validate the final object once, at `build()` time, rather than after every setter.
- The same inputs need to be assembled into different output shapes (e.g. the same data → JSON, XML, SQL).

## Structure

```
Client ──► Builder (step methods + build())
             │
             ├── ConcreteBuilder1 ──► Product1
             └── ConcreteBuilder2 ──► Product2

(optionally)
Director — orchestrates a fixed construction sequence on any builder
```

The **Director** role is optional in JavaScript — often the fluent chain *is* the sequence.

## Trade-offs

**Pros**
- Readable construction of complex objects
- Step-by-step validation
- Immutable final product (the builder mutates; the built object doesn't)

**Cons**
- More code than a constructor
- Easy to forget `build()` (fluent chains can look complete before they are)
- Overkill for objects with 2–3 parameters

## Real-world analogies

- SQL query builders (`knex`, `sequelize`)
- HTTP request builders (fetch options wrappers)
- StringBuilder in languages where strings are immutable

## Run the demo

```bash
node demo.js
```

Demonstrates an `HttpRequestBuilder` that builds up a request with `.method()`, `.url()`, `.header()`, `.query()`, `.json()`, validated at `.build()` time. The built `HttpRequest` object is immutable.
