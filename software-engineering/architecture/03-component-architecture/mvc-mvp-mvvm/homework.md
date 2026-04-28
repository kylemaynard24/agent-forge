# Homework — MVC / MVP / MVVM

> Pick one. Justify why.

## Exercise: Build a TODO list three ways

**Scenario:** Same feature — list todos, add, complete, delete — implemented three times. The goal is not three working apps; it's *understanding why* each variant lays out the way it does.

**Build:**
- `mvc/`: `model.js` (Todo list with subscribe), `view.js` (renders + listens to model events), `controller.js` (handles user input, mutates model).
- `mvp/`: `view.js` (passive — has setters: `setTodos`, `setStatusMessage`), `presenter.js` (holds list + responds to view-input events).
- `mvvm/`: `view-model.js` (observable list + commands), `view.js` (binds reactively to view-model).

**Constraints (these enforce the patterns):**
- MVC: the View must subscribe to the Model directly. Controller does NOT call into the View.
- MVP: the View must have *only* setters and event hooks. No logic in the View.
- MVVM: the View must NOT call setters on the ViewModel directly outside of binding. State flows through observables.

## Stretch
Now write a unit test for *just the logic* in each variant — without rendering anything.
- MVC: which piece(s) do you test?
- MVP: how many lines of test setup?
- MVVM: do you need to mock the binding library?

Compare the test ergonomics. This is often the deciding factor in real projects.

## Reflection
- Many "MVC" web frameworks are really MV*P* — the controller IS the presenter. Why does this confusion persist?
- React + Redux is which one? (Hint: arguably none, arguably MVVM-with-unidirectional-data-flow.) Don't fight your framework.

## Done when
- [ ] All three implementations behave the same from the user's perspective.
- [ ] You can articulate the difference between "View observes Model" and "Presenter pushes to View."
- [ ] You've measured which version had the cheapest unit tests.
