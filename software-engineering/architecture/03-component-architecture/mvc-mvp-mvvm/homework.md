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

---

## Clean Code Lens

**Principle in focus:** Component Names Should Describe One Role and No More

Each suffix in MV* — Model, View, Controller, Presenter, ViewModel — is a clean code contract about what the component does and what it does not do. A `TodoController` that computes business logic has stopped being a Controller; a `TodoPresenter` that directly queries the database has stopped being a Presenter. The suffix is the SRP declaration: when behavior drifts outside what the suffix promises, the name becomes a lie that misdirects every future developer who reads it.

**Exercise:** After building all three variants, read each component's file name and then its full implementation. For each component, write the single sentence that its suffix promises — "A Controller handles user input and updates the model, nothing else" — and check whether any method in the file violates that promise. Any method that does is a candidate for extraction into either a Model (logic belongs with data) or a new named collaborator whose name describes exactly the displaced responsibility.

**Reflection:** Many "MVC" frameworks are actually MVP because the controller acts as a presenter — yet developers continue calling them controllers. What does this widespread naming confusion cost in terms of onboarding new developers, and when does it become worth the effort to rename?
