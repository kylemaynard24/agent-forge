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

## Deeper intuition

Behavioral patterns are about where decisions live and how control flows between objects. They become useful when logic is correct in isolation but hard to follow as a system because too many objects know too much about each other or because behavior varies in ways that are currently trapped in conditionals.

When you study **Interpreter**, focus less on memorizing participants and more on spotting the design pressure it resolves. Patterns become powerful when you can recognize the force first and name the pattern second. The pattern is usually just the cleanest way of making an important distinction explicit.

## What to notice in real code

- What is the stable interface or responsibility, and what is allowed to vary?
- Which dependency or decision has been moved somewhere more explicit?
- What extra indirection does this pattern add, and is the payoff worth it here?
- Which nearby pattern would someone confuse with this one, and why is this a better fit?
