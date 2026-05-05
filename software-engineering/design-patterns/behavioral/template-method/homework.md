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

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Command-Query Separation

In Template Method, naming discipline operates at two levels simultaneously: the template method names the whole algorithm (`generate`), and each abstract step names a variation point (`formatHeader`, `formatBody`). Applied cleanly, a subclass reads like a focused answer to a specific question — `CsvReport` overrides `formatBody` and nothing else, so the reader immediately knows the only thing that varies in CSV is the body format. Applied messily, step names like `step1()`, `doTheThing()`, or `process()` force the subclass author to open the base class to understand what contract they're fulfilling, erasing the self-documenting value of the template.

**Exercise:** Cover the body of `ReportGenerator.generate()` with your hand and read only the step method names: `loadData`, `formatHeader`, `formatBody`, `formatFooter`, `save`. Does the sequence tell the complete story of what a report generation does, in the right order, without reading any implementation? If yes, the names are clean; if no, revise until it reads like a table of contents.

**Reflection:** The `watermark()` hook in the stretch goal is optional — it defaults to a no-op. How does naming a hook method differently from an abstract step method (e.g., `onWatermark` vs `formatBody`) communicate to a subclass author which steps are required and which are optional, without needing a comment?
