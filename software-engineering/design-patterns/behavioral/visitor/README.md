# Visitor

**Category:** Behavioral

## Intent

Represent an operation to be performed on the elements of an object structure. A **visitor** lets you define a new operation **without changing the classes of the elements** on which it operates. Useful when you need many unrelated operations over the same fixed structure (e.g. an AST).

## When to use

- You have a stable object structure (an AST, a scene graph) but add new operations often.
- Each new operation would otherwise require editing every element class.
- Operations are "polymorphic over structure" — e.g. "evaluate," "pretty-print," "type-check," "emit bytecode" all traverse the same AST but do different things.

## The trade-off to understand

Visitor is the opposite of typical OOP's "put method on class" style. It makes **adding operations easy** (one new visitor class) but **adding element types hard** (every visitor must grow). If your element types change often and operations rarely, visitor is the wrong choice.

## Structure

```
Element (interface)                 Visitor (interface)
  + accept(visitor)                   + visitConcreteElementA(e)
        ▲                             + visitConcreteElementB(e)
        │                                   ▲
  ConcreteElementA                          │
    accept(v) { v.visitConcreteElementA(this); }
  ConcreteElementB
    accept(v) { v.visitConcreteElementB(this); }

                                    ConcreteVisitor1, ConcreteVisitor2, ...
```

The **double dispatch** trick: `element.accept(visitor)` lets both the element type *and* the visitor type resolve dynamically, picking the right `visit*()` method.

## Trade-offs

**Pros**
- Add new operations without modifying element classes
- Group related operations for a whole structure in one class
- Good fit for AST traversals (compilers, linters, formatters)

**Cons**
- Element classes are tied to a visitor interface (can't freely add new element types without updating every visitor)
- Can feel heavyweight in dynamic languages (double dispatch is easier to fake than to formally implement)
- Often a `switch` statement or pattern match is clearer in practice

## JavaScript note

JavaScript doesn't have method overloading, so the canonical visitor shape uses explicit `visitNumber`, `visitAdd`, `visitMul` methods on the visitor — exactly what the demo does. A `switch` on `node.type` is often shorter in JS; the class-based visitor is shown for pedagogical clarity.

## Real-world analogies

- **Compilers and linters** walking an AST with different visitors: type-check, optimize, print, emit.
- **File-tree operations** — a visitor for `size`, another for `search`, another for `count`.

## Run the demo

```bash
node demo.js
```

Demonstrates an expression AST (`Number`, `Add`, `Multiply`) with three visitors: `Evaluator` (compute the value), `Printer` (render back to infix), and `NodeCounter` (count nodes of each kind). The AST is never edited when a new visitor is added.
