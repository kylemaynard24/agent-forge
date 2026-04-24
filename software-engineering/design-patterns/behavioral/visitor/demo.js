// Visitor — AST with evaluator, printer, and node counter
// Run: node demo.js

// --- Element hierarchy ---

class Node {
  accept(_visitor) { throw new Error('accept()'); }
}

class NumberNode extends Node {
  constructor(value) { super(); this.value = value; }
  accept(v) { return v.visitNumber(this); }
}

class AddNode extends Node {
  constructor(left, right) { super(); this.left = left; this.right = right; }
  accept(v) { return v.visitAdd(this); }
}

class MultiplyNode extends Node {
  constructor(left, right) { super(); this.left = left; this.right = right; }
  accept(v) { return v.visitMultiply(this); }
}

// --- Visitors ---

class Evaluator {
  visitNumber(node)   { return node.value; }
  visitAdd(node)      { return node.left.accept(this) + node.right.accept(this); }
  visitMultiply(node) { return node.left.accept(this) * node.right.accept(this); }
}

class Printer {
  visitNumber(node)   { return String(node.value); }
  visitAdd(node)      { return `(${node.left.accept(this)} + ${node.right.accept(this)})`; }
  visitMultiply(node) { return `(${node.left.accept(this)} * ${node.right.accept(this)})`; }
}

class NodeCounter {
  constructor() { this.counts = { Number: 0, Add: 0, Multiply: 0 }; }
  visitNumber(_node)  { this.counts.Number++; }
  visitAdd(node)      { this.counts.Add++;      node.left.accept(this); node.right.accept(this); }
  visitMultiply(node) { this.counts.Multiply++; node.left.accept(this); node.right.accept(this); }
}

// --- Demo ---

console.log('=== Visitor demo ===\n');

// AST for:  (3 + 4) * (5 + 2)
const ast = new MultiplyNode(
  new AddNode(new NumberNode(3), new NumberNode(4)),
  new AddNode(new NumberNode(5), new NumberNode(2))
);

console.log('Printer:     ', ast.accept(new Printer()));
console.log('Evaluator:   ', ast.accept(new Evaluator()));

const counter = new NodeCounter();
ast.accept(counter);
console.log('Node counts: ', counter.counts);

console.log('\nKey idea: three visitors, three different operations, and we never');
console.log('modified NumberNode / AddNode / MultiplyNode. Adding "type-check" or');
console.log('"simplify" is just another visitor class.');
