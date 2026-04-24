// Abstract Factory — UI theme kits
// Run: node demo.js

// --- Product interfaces ---

class Button {
  render() { throw new Error('render()'); }
}
class Dialog {
  render() { throw new Error('render()'); }
}

// --- Light family ---

class LightButton extends Button {
  render() { return '[ Submit ]  ◽ white background, dark text'; }
}
class LightDialog extends Dialog {
  render() { return '┌─ Dialog (light) ─────────┐\n│ white bg, dark border    │\n└──────────────────────────┘'; }
}

// --- Dark family ---

class DarkButton extends Button {
  render() { return '[ Submit ]  ◾ dark background, light text'; }
}
class DarkDialog extends Dialog {
  render() { return '┌─ Dialog (dark) ──────────┐\n│ dark bg, light border    │\n└──────────────────────────┘'; }
}

// --- Abstract factory and concrete factories ---

class UIFactory {
  createButton() { throw new Error('createButton()'); }
  createDialog() { throw new Error('createDialog()'); }
}

class LightThemeFactory extends UIFactory {
  createButton() { return new LightButton(); }
  createDialog() { return new LightDialog(); }
}

class DarkThemeFactory extends UIFactory {
  createButton() { return new DarkButton(); }
  createDialog() { return new DarkDialog(); }
}

// --- Client ---
// Notice: renderApp depends only on the *abstract* factory.
// Swap the factory, and the whole UI family swaps together.

function renderApp(factory) {
  const dialog = factory.createDialog();
  const button = factory.createButton();
  console.log(dialog.render());
  console.log(button.render());
}

// --- Demo ---

console.log('=== Abstract Factory demo ===\n');

console.log('-- light theme --');
renderApp(new LightThemeFactory());

console.log('\n-- dark theme --');
renderApp(new DarkThemeFactory());

console.log('\nKey idea: renderApp() never references a concrete class.');
