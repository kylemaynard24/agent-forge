# Homework — Interface Segregation

> Don't force clients to depend on methods they don't use.

## Exercise: Split a fat printer driver

**Scenario:** Your office has a `Printer` interface with `print`, `scan`, `fax`, `staple`. Cheap printers throw on `scan/fax/staple`. The middle of your codebase is full of `if (printer.canFax) { ... }` dance. Adding a new "labeling printer" forces you to add stub methods.

**Build:**
- Identify the capabilities. Aim for 3–5 small interfaces (in JS, just convention/duck typing; in TS, real interfaces).
- Re-express each printer model as a class implementing only the capabilities it has.
- Refactor callers to require only the smallest capability they need.

**Constraints (these enforce the concept):**
- No printer class throws "not supported" for any method it implements.
- No caller does `instanceof` or `canFax`-style probing — they just call.
- Adding a "label printer" requires no edits to existing classes.
- A test of `print()` on the basic printer requires no stubs for `scan/fax/staple`.

## Stretch
Define a `MultifunctionPrinter` that genuinely implements all four. Show that callers needing only `Printable` can still use it without knowing about its other capabilities.

## Reflection
- ISP and LSP are siblings: ISP says "don't promise what you can't deliver"; LSP says "if you promised, deliver." How are they two halves of the same idea?
- Where can ISP be over-applied? (Hint: a system with 50 1-method interfaces becomes navigation hell.)

## Done when
- [ ] No "not supported" exceptions remain.
- [ ] Callers list only the capabilities they need.
- [ ] Adding a label printer doesn't touch other printers' code.
