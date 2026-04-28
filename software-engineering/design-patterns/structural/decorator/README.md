# Decorator

**Category:** Structural

## Intent

Add responsibilities to an object **dynamically** by wrapping it in another object that shares the same interface. A decorator holds a reference to a component and delegates to it, adding its own behavior before or after.

## When to use

- You want to add features (logging, caching, validation, formatting) without subclassing.
- You want features to be **stackable** — combine them freely at runtime.
- Subclassing would cause a combinatorial explosion (`SubscriberWithLogging`, `SubscriberWithCaching`, `SubscriberWithLoggingAndCaching`...).

## Structure

```
Component (interface)
   │
   ├── ConcreteComponent               (the base object being decorated)
   │
   └── Decorator (has a Component inside it)
         │
         ├── ConcreteDecoratorA
         └── ConcreteDecoratorB
```

Each decorator holds a `component` and forwards calls, often augmenting them.

## Trade-offs

**Pros**
- Runtime composition — stack as many decorators as you like, in any order
- Single-responsibility per decorator
- Doesn't touch the underlying class

**Cons**
- Many small wrapper objects — harder to debug ("which layer did this?")
- Order can matter and isn't always obvious
- Identity tests surprise you (`decorated instanceof Espresso` is false)

## Decorator vs. Proxy

Both wrap an object. The difference is intent:
- **Decorator** *adds responsibilities* to the wrapped object.
- **Proxy** *controls access* to it (caching, lazy loading, permissions).

## Real-world analogies

- HTTP middleware — each middleware wraps the next, adding logging, auth, compression.
- UI scroll bars and borders decorating a view.
- Coffee order toppings: milk, sugar, foam, each added on top.

## Run the demo

```bash
node demo.js
```

Demonstrates a `Beverage` (espresso, house blend) decorated by `Milk`, `Sugar`, `WhippedCream`. Decorators can be stacked in any order, and each adjusts both `cost()` and `description()`.

## Deeper intuition

Structural patterns are about reshaping relationships without rewriting the underlying behavior. They earn their keep when a system needs compatibility, composition, simplification, access control, or independent variation across different dimensions of the design.

When you study **Decorator**, focus less on memorizing participants and more on spotting the design pressure it resolves. Patterns become powerful when you can recognize the force first and name the pattern second. The pattern is usually just the cleanest way of making an important distinction explicit.

## What to notice in real code

- What is the stable interface or responsibility, and what is allowed to vary?
- Which dependency or decision has been moved somewhere more explicit?
- What extra indirection does this pattern add, and is the payoff worth it here?
- Which nearby pattern would someone confuse with this one, and why is this a better fit?
