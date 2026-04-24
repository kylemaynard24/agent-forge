// Interpreter — tiny arithmetic language with variables
// Run: node demo.js

// --- Expression hierarchy ---

class Expression {
  interpret(_context) { throw new Error('interpret()'); }
}

// Terminal: a literal number
class NumberExpression extends Expression {
  constructor(value) { super(); this.value = value; }
  interpret() { return this.value; }
}

// Terminal: a variable lookup in the context
class VarExpression extends Expression {
  constructor(name) { super(); this.name = name; }
  interpret(ctx) {
    if (!(this.name in ctx)) throw new Error(`undefined variable: ${this.name}`);
    return ctx[this.name];
  }
}

// Nonterminal: binary op
class BinaryExpression extends Expression {
  constructor(left, right) { super(); this.left = left; this.right = right; }
}

class AddExpression extends BinaryExpression {
  interpret(ctx) { return this.left.interpret(ctx) + this.right.interpret(ctx); }
}

class SubtractExpression extends BinaryExpression {
  interpret(ctx) { return this.left.interpret(ctx) - this.right.interpret(ctx); }
}

class MultiplyExpression extends BinaryExpression {
  interpret(ctx) { return this.left.interpret(ctx) * this.right.interpret(ctx); }
}

// --- Demo ---

console.log('=== Interpreter demo ===\n');

// Build AST for:  (5 + 3) * 2 - x
const ast = new SubtractExpression(
  new MultiplyExpression(
    new AddExpression(new NumberExpression(5), new NumberExpression(3)),
    new NumberExpression(2)
  ),
  new VarExpression('x')
);

const expr = '(5 + 3) * 2 - x';

console.log(`Expression: ${expr}`);
console.log(`  with x=4 → ${ast.interpret({ x: 4 })}`);
console.log(`  with x=0 → ${ast.interpret({ x: 0 })}`);
console.log(`  with x=20 → ${ast.interpret({ x: 20 })}`);

// Another: 2 * (x + y)
const ast2 = new MultiplyExpression(
  new NumberExpression(2),
  new AddExpression(new VarExpression('x'), new VarExpression('y'))
);
console.log(`\nExpression: 2 * (x + y)`);
console.log(`  with x=3, y=7 → ${ast2.interpret({ x: 3, y: 7 })}`);

console.log('\nKey idea: each grammar rule is a class; evaluating a sentence is');
console.log('just calling interpret() on the root of the AST.');
