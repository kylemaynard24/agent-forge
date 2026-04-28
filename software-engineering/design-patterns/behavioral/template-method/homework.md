# Homework — Template Method

> A base class fixes the *skeleton* of an algorithm; subclasses fill in steps.

## Exercise: Pluggable report generator

**Scenario:** A `ReportGenerator` base class has a `generate()` template that always calls, in order: `loadData()`, `formatHeader()`, `formatBody()`, `formatFooter()`, `save()`. Subclasses `PdfReport`, `CsvReport`, `HtmlReport` override only the steps they care about.

**Build:**
- An abstract `ReportGenerator` with `generate()` (the template) and abstract step methods.
- Three concrete subclasses.
- A `loadData()` that's shared (defined in the base) — subclasses inherit it.

**Constraints (these enforce the pattern):**
- Subclasses CANNOT reorder steps — the template's order is fixed.
- The base class's `generate()` should be effectively final (in JS, achieve this by convention + a runtime check or by making it a function rather than a method).
- A subclass that overrides `generate()` itself is a violation — flag it.

## Stretch

Add an optional `watermark()` hook between `formatBody()` and `formatFooter()`. Default to a no-op. The PDF report uses it; the others ignore it. Show how this differs from a required step.

## Reflection

- Template Method is inheritance-heavy. When would you prefer Strategy (composition over inheritance)?

## Done when

- [ ] All three concrete reports produce sensible (if stubbed) output.
- [ ] An attempt to override `generate()` in a subclass is detected or visibly violates the template.
