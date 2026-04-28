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
