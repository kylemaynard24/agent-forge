// Command — text editor with undo/redo
// Run: node demo.js

// --- Receiver ---

class TextEditor {
  constructor() { this.text = ''; }
  append(s) { this.text += s; }
  removeEnd(n) {
    const removed = this.text.slice(-n);
    this.text = this.text.slice(0, -n);
    return removed;
  }
  display() { return `[${this.text}]`; }
}

// --- Command interface ---

class Command {
  execute() { throw new Error('execute()'); }
  undo()    { throw new Error('undo()'); }
}

class AppendCommand extends Command {
  constructor(editor, text) {
    super();
    this.editor = editor;
    this.text = text;
  }
  execute() { this.editor.append(this.text); }
  undo()    { this.editor.removeEnd(this.text.length); }
}

class DeleteCommand extends Command {
  constructor(editor, n) {
    super();
    this.editor = editor;
    this.n = n;
    this._removed = null;
  }
  execute() { this._removed = this.editor.removeEnd(this.n); }
  undo()    { this.editor.append(this._removed); }
}

// --- Invoker with undo/redo history ---

class CommandHistory {
  constructor() { this.done = []; this.undone = []; }
  run(cmd) {
    cmd.execute();
    this.done.push(cmd);
    this.undone.length = 0; // new command invalidates redo stack
  }
  undo() {
    const cmd = this.done.pop();
    if (!cmd) return false;
    cmd.undo();
    this.undone.push(cmd);
    return true;
  }
  redo() {
    const cmd = this.undone.pop();
    if (!cmd) return false;
    cmd.execute();
    this.done.push(cmd);
    return true;
  }
}

// --- Demo ---

console.log('=== Command demo ===\n');

const editor = new TextEditor();
const history = new CommandHistory();

const log = (label) => console.log(`${label.padEnd(15)} → ${editor.display()}`);

history.run(new AppendCommand(editor, 'Hello'));        log('append Hello');
history.run(new AppendCommand(editor, ', world'));      log('append , world');
history.run(new AppendCommand(editor, '!'));            log('append !');
history.run(new DeleteCommand(editor, 7));              log('delete last 7');

history.undo(); log('undo');
history.undo(); log('undo');
history.redo(); log('redo');

history.run(new AppendCommand(editor, ' again'));        log('append again');

console.log('\nKey idea: every operation is an object with execute() and undo().');
console.log('The history stack gives you arbitrary-depth undo/redo for free.');
