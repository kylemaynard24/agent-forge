# Homework — Abstract Factory

> A factory of factories — produces *families* of related objects whose concrete types must agree.

## Exercise: Themed UI toolkit

**Scenario:** Build a UI toolkit with two themes — `Dark` and `Light`. Each theme provides a `Button`, `TextInput`, and `Modal`. Render a login screen.

**Build:**
- An abstract `UiFactory` with `createButton()`, `createTextInput()`, `createModal()`.
- `DarkUiFactory` and `LightUiFactory`, each producing their themed widgets.
- A `renderLoginScreen(factory)` function that builds the screen using only the factory.

**Constraints (these enforce the pattern):**
- `renderLoginScreen` must never name a concrete class like `DarkButton`.
- Switching themes is a single line change at startup.
- All three widgets within one factory call must come from the same family (no mixing dark + light).

## Stretch

Add a `HighContrast` theme. Application code must require zero edits to support it.

## Reflection

- When would Abstract Factory become overkill? (Hint: tree depth × number of variants.)
- What does Abstract Factory share with Dependency Inversion?

## Done when

- [ ] Login screen renders identically against both factories.
- [ ] Adding a third theme requires no edits to `renderLoginScreen`.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Interface Segregation Principle

The factory method names are the public commitment — `createButton()` tells the consumer exactly what product family member it is getting, while a generic `create()` or `make()` forces them to check the return type to understand what was produced. Applied cleanly, the abstract factory interface reads like a product catalog: every method name makes the product obvious, the interface is narrow enough that a new theme only requires implementing what the product family actually contains, and `renderLoginScreen` reads as pure domain logic with no conditional on theme. Applied messily, a factory that keeps gaining methods over time (`createTooltip`, `createSpinner`, `createBadge`...) becomes a coupling magnet — every new widget forces all factory implementations to update.

**Exercise:** Write out the abstract `UiFactory` interface and read it as a contract: every method you list is a promise that every theme must fulfill. Remove any method from the interface that isn't actually used by `renderLoginScreen` — unused interface surface is a maintenance cost with no benefit.

**Reflection:** The constraint says `renderLoginScreen` must never name a concrete class like `DarkButton` — but it does name the abstract types like `Button`. What would have to change in your design if even the abstract product names needed to be hidden from the renderer?
