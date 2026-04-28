// MVC / MVP / MVVM — same click counter, three ways.
// Run: node demo.js
//
// We simulate a "view" with a console-logging fake. The point is the wiring.

// ============================================================
// MVC: View observes Model; Controller routes user input.
// ============================================================

class CounterModel {
  constructor() { this.count = 0; this._listeners = []; }
  increment() { this.count++; this._emit(); }
  reset()     { this.count = 0; this._emit(); }
  subscribe(fn) { this._listeners.push(fn); fn(this.count); }
  _emit() { for (const fn of this._listeners) fn(this.count); }
}

class CounterView_MVC {
  constructor(model) { model.subscribe(c => console.log(`[mvc-view] count=${c}`)); }
}

class CounterController_MVC {
  constructor(model) { this.model = model; }
  onClickIncrement() { this.model.increment(); }
  onClickReset()     { this.model.reset(); }
}

console.log('=== MVC ===');
{
  const model = new CounterModel();
  new CounterView_MVC(model);
  const ctl = new CounterController_MVC(model);
  ctl.onClickIncrement(); ctl.onClickIncrement(); ctl.onClickReset();
}

// ============================================================
// MVP: Presenter holds the logic; View is "dumb".
// ============================================================

class CounterView_MVP {
  setCount(n) { console.log(`[mvp-view] count=${n}`); }
}

class CounterPresenter {
  constructor(view) { this.view = view; this.count = 0; this.view.setCount(0); }
  onClickIncrement() { this.count++;        this.view.setCount(this.count); }
  onClickReset()     { this.count = 0;       this.view.setCount(this.count); }
}

console.log('\n=== MVP ===');
{
  const presenter = new CounterPresenter(new CounterView_MVP());
  presenter.onClickIncrement(); presenter.onClickIncrement(); presenter.onClickReset();
}

// ============================================================
// MVVM: View binds to ViewModel; ViewModel exposes observable state.
// ============================================================

class Observable {
  constructor(value) { this._v = value; this._subs = []; }
  get() { return this._v; }
  set(v) { this._v = v; for (const fn of this._subs) fn(v); }
  subscribe(fn) { this._subs.push(fn); fn(this._v); }
}

class CounterViewModel {
  constructor() { this.count = new Observable(0); }
  increment() { this.count.set(this.count.get() + 1); }
  reset()     { this.count.set(0); }
}

class CounterView_MVVM {
  constructor(vm) { vm.count.subscribe(c => console.log(`[mvvm-view] count=${c}`)); }
}

console.log('\n=== MVVM ===');
{
  const vm = new CounterViewModel();
  new CounterView_MVVM(vm);
  vm.increment(); vm.increment(); vm.reset();
}

console.log('\n--- Who holds logic? ---');
console.log('MVC:  Controller routes; Model emits to View.');
console.log('MVP:  Presenter; View is a thin shell that the Presenter writes to.');
console.log('MVVM: ViewModel; View binds reactively to its observables.');
