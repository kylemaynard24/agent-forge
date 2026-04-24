# Bridge

**Category:** Structural

## Intent

Decouple an **abstraction** from its **implementation** so the two can vary independently. Split a single class hierarchy that varies in two dimensions into two hierarchies — one for the abstraction, one for the implementation — and connect them at runtime.

## When to use

- You have two dimensions of variation and don't want the cross-product in one class hierarchy (e.g. Shape × Renderer = many classes).
- You want to pick the implementation at runtime, not at class-definition time.
- Both the abstraction and the implementation should be extensible without recompiling each other.

## The problem Bridge solves

Without the pattern, shapes that need two renderers might become:

```
Circle, CircleVector, CircleRaster,
Square, SquareVector, SquareRaster,
Triangle, TriangleVector, TriangleRaster,  ...
```

That's *N × M* classes. Add a new shape: 3 new classes. Add a new renderer: 3 new classes. Bridge keeps it at *N + M*.

## Structure

```
Abstraction  (has a reference to Implementor)
  │
  └── RefinedAbstraction
                           Implementor  (interface)
                           │
                           ├── ConcreteImplementorA
                           └── ConcreteImplementorB
```

`Abstraction.operation()` forwards to `implementor.operationImpl()`.

## Trade-offs

**Pros**
- Two dimensions of variation stay independent
- Runtime assembly — construct `new Circle(new RasterRenderer())`
- Client code stays on the abstraction side

**Cons**
- Front-loaded complexity — you need two hierarchies from day one
- Overkill when one dimension isn't actually varying

## Bridge vs. Strategy

They look similar (both compose an object). The difference is intent:
- **Strategy** swaps *algorithms* (runtime policy choices).
- **Bridge** decouples *class hierarchies* (structural design).

## Real-world analogies

- Device drivers: an OS abstraction talks to a driver implementation.
- Rendering engines: a `Document` abstraction uses a `Renderer` (HTML, PDF, Markdown).

## Run the demo

```bash
node demo.js
```

Demonstrates `Shape` (Circle, Square) bridged to `Renderer` (Vector, Raster). The same Circle can be drawn by either renderer; adding a new shape or a new renderer doesn't touch the other hierarchy.
