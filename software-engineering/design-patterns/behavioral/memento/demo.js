// Memento — text editor with opaque snapshots
// Run: node demo.js

// --- Memento: opaque carrier of state ---

class EditorMemento {
  // Users of the memento (the caretaker) never read these fields.
  // Only TextEditor.restore() does.
  constructor(text, cursor) {
    this._text = text;
    this._cursor = cursor;
    Object.freeze(this);
  }
}

// --- Originator ---

class TextEditor {
  constructor() {
    this.text = '';
    this.cursor = 0;
  }

  type(s) {
    this.text = this.text.slice(0, this.cursor) + s + this.text.slice(this.cursor);
    this.cursor += s.length;
  }

  moveCursor(offset) {
    this.cursor = Math.max(0, Math.min(this.text.length, this.cursor + offset));
  }

  save() {
    return new EditorMemento(this.text, this.cursor);
  }

  restore(memento) {
    this.text = memento._text;
    this.cursor = memento._cursor;
  }

  display() {
    return `"${this.text}"  cursor=${this.cursor}`;
  }
}

// --- Caretaker ---

class History {
  constructor() { this.undoStack = []; this.redoStack = []; }

  record(editor) {
    this.undoStack.push(editor.save());
    this.redoStack.length = 0; // new change invalidates redo
  }

  undo(editor) {
    if (this.undoStack.length === 0) return false;
    this.redoStack.push(editor.save());
    editor.restore(this.undoStack.pop());
    return true;
  }

  redo(editor) {
    if (this.redoStack.length === 0) return false;
    this.undoStack.push(editor.save());
    editor.restore(this.redoStack.pop());
    return true;
  }
}

// --- Demo ---

console.log('=== Memento demo ===\n');

const editor = new TextEditor();
const history = new History();

const show = (label) => console.log(`${label.padEnd(16)} → ${editor.display()}`);

history.record(editor); editor.type('Hello');                show('type Hello');
history.record(editor); editor.type(', world');              show('type , world');
history.record(editor); editor.type('!');                    show('type !');
history.record(editor); editor.moveCursor(-1); editor.type('?'); show('insert ? before !');

history.undo(editor); show('undo');
history.undo(editor); show('undo');
history.redo(editor); show('redo');

console.log('\nKey idea: the caretaker (History) never looked inside a memento.');
console.log('Only TextEditor knows how to restore from one. Encapsulation is preserved.');
