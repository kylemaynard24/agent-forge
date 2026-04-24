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
