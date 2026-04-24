# Abstract Factory

**Category:** Creational

## Intent

Provide an interface for creating **families of related or dependent objects** without specifying their concrete classes. The client uses the factory object, which in turn produces coherent sets of products that are meant to work together.

## When to use

- You have multiple "kits" of related objects (e.g. UI widgets for Light vs. Dark theme, or DB drivers for Postgres vs. SQLite).
- The client shouldn't hard-code which kit it's using.
- Mixing products from different families would be a bug (e.g. a Light button inside a Dark dialog).

## Structure

```
AbstractFactory              (has createA() and createB())
  │
  ├── ConcreteFactory1 ──► ProductA1, ProductB1
  └── ConcreteFactory2 ──► ProductA2, ProductB2

         ProductA (abstract)       ProductB (abstract)
         │                         │
         ├── ProductA1             ├── ProductB1
         └── ProductA2             └── ProductB2
```

## Trade-offs

**Pros**
- Client code is independent of concrete classes
- Enforces consistency — factory `1` only produces the `1` family
- Swapping entire families is a one-line change (construct a different factory)

**Cons**
- Adding a new *kind* of product (C) is painful — every concrete factory must grow
- Heavy machinery for small problems

## Factory Method vs. Abstract Factory

| | Factory Method | Abstract Factory |
| --- | --- | --- |
| Produces | One product per method | A family via multiple methods |
| Mechanism | Subclassing (override method) | Composition (pass a factory object) |
| Granularity | Per-product | Per-family |

A factory method *is* often implemented inside an abstract factory's methods — the two patterns compose.

## Real-world analogies

- Cross-platform UI kits: `WinFactory.makeButton()` + `WinFactory.makeMenu()` vs. `MacFactory.makeButton()` + `MacFactory.makeMenu()`.
- Database drivers: `PgFactory.connection()` + `PgFactory.query()` vs. `SqliteFactory.connection()` + `SqliteFactory.query()`.

## Run the demo

```bash
node demo.js
```

Demonstrates two UI kit factories — `LightThemeFactory` and `DarkThemeFactory` — each producing a matching `Button` + `Dialog` pair. Client code accepts any factory and renders a consistent UI.
