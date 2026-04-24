// Composite — file/folder tree
// Run: node demo.js

// --- Component interface ---

class FSNode {
  size() { throw new Error('size()'); }
  print(_indent = 0) { throw new Error('print()'); }
}

// --- Leaf ---

class File extends FSNode {
  constructor(name, bytes) {
    super();
    this.name = name;
    this.bytes = bytes;
  }
  size() { return this.bytes; }
  print(indent = 0) {
    console.log(`${' '.repeat(indent)}📄 ${this.name} (${this.bytes} B)`);
  }
}

// --- Composite ---

class Folder extends FSNode {
  constructor(name) {
    super();
    this.name = name;
    this.children = [];
  }
  add(child) {
    this.children.push(child);
    return this;
  }
  size() {
    // Recursive: delegates to children uniformly — both Files and Folders.
    return this.children.reduce((total, child) => total + child.size(), 0);
  }
  print(indent = 0) {
    console.log(`${' '.repeat(indent)}📁 ${this.name}/  (${this.size()} B total)`);
    for (const child of this.children) child.print(indent + 2);
  }
}

// --- Demo ---

console.log('=== Composite demo ===\n');

const project = new Folder('project');
project.add(new File('README.md', 1200));

const src = new Folder('src');
src.add(new File('index.js', 4500));
src.add(new File('utils.js', 2100));

const tests = new Folder('tests');
tests.add(new File('index.test.js', 3200));

src.add(tests);
project.add(src);
project.add(new File('package.json', 800));

project.print();

console.log(`\nTotal project size: ${project.size()} B`);
console.log(`tests/ size:        ${tests.size()} B`);

console.log('\nKey idea: the client called size() and print() uniformly,');
console.log('whether the node was a File or a Folder.');
