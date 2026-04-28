# Factory Method

**Category:** Creational

## Intent

Define an interface for creating an object, but let **subclasses decide which class to instantiate**. The creator's code works with the abstract product; the concrete class is chosen by the subclass's override.

## When to use

- A class can't know in advance which concrete type it should create — that decision belongs to a subclass.
- You want to decouple high-level client code from concrete product classes.
- You have a common "creation ritual" (e.g. logging, caching, registering) that should happen regardless of the concrete product.

## Structure

```
Creator  (has factoryMethod() returning Product)
  │
  ├── ConcreteCreatorA ──► creates ConcreteProductA
  └── ConcreteCreatorB ──► creates ConcreteProductB

                          Product  (interface)
                          │
                          ├── ConcreteProductA
                          └── ConcreteProductB
```

The `Creator.someOperation()` method calls `this.factoryMethod()` — subclasses override `factoryMethod` to return the concrete product.

## Trade-offs

**Pros**
- Decouples creator from concrete products
- Subclasses can hook into the creation flow
- A single creator method can wrap shared logic around the instantiation (logging, pooling, etc.)

**Cons**
- Requires a parallel class hierarchy (one creator subclass per product variant)
- Overkill if you only have one or two variants and no shared creator logic

## Real-world analogies

- Document creation in a word processor — `Application.newDocument()` defers to the active document type to decide what kind of document to create.
- Test framework `TestCase.createResult()` — subclasses decide what kind of result object is produced.

## Distinction from Abstract Factory

Factory Method produces **one** product (via method override). Abstract Factory produces a **family** of related products (via a factory object with multiple methods). See [../abstract-factory/](../abstract-factory/).

## Run the demo

```bash
node demo.js
```

Demonstrates a `DocumentCreator` base class with subclasses `InvoiceCreator`, `ReportCreator`, and `MemoCreator`. The base `createDocument()` method handles shared concerns (timestamps, logging) and delegates to `factoryMethod()` for the concrete product.

## Deeper intuition

Creational patterns are about dependency control at the moment of construction. They matter because the way objects come into existence often leaks into the rest of the codebase, forcing callers to know concrete types, lifecycle rules, or assembly details they should not have to carry.

When you study **Factory Method**, focus less on memorizing participants and more on spotting the design pressure it resolves. Patterns become powerful when you can recognize the force first and name the pattern second. The pattern is usually just the cleanest way of making an important distinction explicit.

## What to notice in real code

- What is the stable interface or responsibility, and what is allowed to vary?
- Which dependency or decision has been moved somewhere more explicit?
- What extra indirection does this pattern add, and is the payoff worth it here?
- Which nearby pattern would someone confuse with this one, and why is this a better fit?
