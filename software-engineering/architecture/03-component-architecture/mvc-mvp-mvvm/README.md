# MVC, MVP, MVVM

**Category:** Component Architecture

## Intent
Three sibling patterns for separating UI from logic. They differ in *who holds the logic* and *how the view stays in sync with the data*.

| Pattern | View knows... | Logic lives in... | Sync style |
|---|---|---|---|
| **MVC** | Controller (and Model) | Controller | View observes Model; Controller routes input |
| **MVP** | Presenter (only) | Presenter | Presenter pushes state to View; View is dumb |
| **MVVM** | View Model (via binding) | View Model | Two-way data binding (View ↔ ViewModel) |

## When to use which
- **MVC**: classic web (Rails-style server rendering). The View is HTML; the Controller handles the request.
- **MVP**: desktop / "passive view" testing. The Presenter is fully testable; the View is a thin shell.
- **MVVM**: data-binding frameworks (WPF, SwiftUI, Vue, parts of React-with-state-libs). Reactive state.

## Trade-offs
**Pros**
- Each separates UI from logic — testable, evolvable.
- Fits common UI frameworks idiomatically.

**Cons**
- The labels mean different things to different teams. Don't argue MVC-vs-MVP without agreeing what each word means in your codebase.
- All three can devolve into a fat ___ (Controller / Presenter / ViewModel) doing too much.

**Rule of thumb:** Pick the one your framework wants you to use. Don't fight your framework.

## Real-world analogies
- MVC: a restaurant where the waiter (controller) takes the order, the kitchen (model) prepares it, and the customer (view) sees the dish.
- MVP: a play where the actors (view) only do what the director (presenter) tells them; the audience sees only what's choreographed.
- MVVM: a stock-ticker board (view) automatically updating from a market data feed (view model). Wire-once, react forever.

## Run the demo
```bash
node demo.js
```

The demo implements the same click-counter screen three ways — MVC, MVP, MVVM — and contrasts who holds the logic.
