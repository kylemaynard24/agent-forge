# Interpreter

**Category:** Behavioral

## Intent

Given a small language, define a class hierarchy that represents its grammar, plus an `interpret()` method that evaluates sentences. Each grammar rule is a class; composite rules contain sub-rules; terminals are leaves.

## When to use

- You have a simple, stable, and well-understood mini-language (rule engine, filter expressions, arithmetic, regex-lite).
- The grammar is small and unlikely to grow much.
- Performance isn't critical (interpreters are slow; a parser-generated AST + compiler is faster).

## When to **skip it**

- Your language is complex or evolving — use a parser generator (ANTLR, nearley) and a visitor-style evaluator instead.
- You want JIT-level performance — compile, don't interpret.

In modern practice, pure "Interpreter pattern" code is rare. The ideas it introduces — **AST classes with an `interpret()` or visitor method** — show up constantly in compilers and evaluators.

## Structure

```
AbstractExpression  (has interpret(context))
   │
   ├── TerminalExpression       (numbers, variables)
   │
   └── NonterminalExpression    (holds child expressions)
         └── interpret() evaluates children and combines them
```

## Trade-offs

**Pros**
- Straightforward for small grammars
- Easy to extend with new grammar rules as new classes

**Cons**
- Class-per-rule explodes with grammar size
- Recursive evaluation is slow relative to compilation
- Building the AST (parsing) is a separate problem the pattern ignores

## Real-world analogies

- A calculator that parses "5 + 3 * 2" into an AST and evaluates it.
- Spreadsheet formulas.
- Feature flag rule evaluators (`user.country == "US" && user.plan != "free"`).

## Run the demo

```bash
node demo.js
```

Demonstrates an arithmetic interpreter with `NumberExpression`, `AddExpression`, `SubtractExpression`, `MultiplyExpression`, and a variable lookup `VarExpression`. The demo builds ASTs by hand (no parser) and evaluates them.
