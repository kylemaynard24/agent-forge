# Homework — Pipes and Filters

> Compose computation from small, reusable, single-purpose stages.

## Exercise: Build a CSV processing pipeline

**Scenario:** A daily import: read a CSV of orders, drop blank rows, parse types (numbers, dates), validate, deduplicate by order ID, and write the result. The current code is one 200-line function. New requirements (a new validation; another column) keep breaking it.

**Build:**
- Implement these filters, each as a small function:
  - `parseCsv(text) → rows`
  - `dropBlanks(rows) → rows`
  - `coerceTypes(rows) → rows`  (e.g., `amount` → number, `placed_at` → Date)
  - `validate(rows) → {valid, invalid}`
  - `dedupeById(rows) → rows`
  - `writeJsonl(rows) → string`
- A `pipe` combinator that composes them.
- A demo pipeline that imports a CSV and produces JSONL of valid rows; invalid rows route to a side-channel.

**Constraints (these enforce the concept):**
- Each filter is a pure function: `input → output`. No side effects.
- A filter must be usable in MULTIPLE pipelines (e.g., `dropBlanks` works in any tabular pipeline, not just orders).
- Adding a new validation rule is a new filter — zero edits to existing filters.
- The pipeline definition is data-like (an array of filters), not a hardcoded function.

## Stretch
Make the pipeline streaming: instead of `[row, row, ...]`, use Node's async iterators (`async function* () { ... }`). Each filter is now a transform that yields one row at a time. Show that you can process a 1M-line CSV without loading it all into memory.

## Reflection
- Where does *state* go in pipes-and-filters? (Hint: usually in a wrapper around the pipeline, not in the filters themselves.)
- When does pipes-and-filters break down? (Hint: when a later stage needs information from earlier stages — you start passing context blobs.)

## Done when
- [ ] You can rearrange, drop, or insert a filter without editing other filters.
- [ ] Adding a new validation rule is a new file.
- [ ] Each filter has its own one-line unit test.

---

## Clean Code Lens

**Principle in focus:** Function Names Describe One Transformation Precisely — Single Responsibility at the Filter Level

Each filter in a pipeline is SRP applied to pure functions: `dropBlanks` does exactly one thing and its name proves it. A filter called `cleanAndValidate` or `parseAndCoerce` has collapsed two stages into one, destroying both the reusability and the testability that the pattern promises — and the "and" in the name is the same warning sign as "and" in a class description. A filter that does two transformations should be two filters, each with a name that a future pipeline author can trust without reading the implementation.

**Exercise:** For each filter you wrote, apply the "pipeline substitution test": could you swap this filter into a completely different pipeline (not the order CSV pipeline) and have its name still be accurate? `dropBlanks` passes — it works on any tabular data. `validateOrders` would fail — it is specific to orders. Any filter whose name encodes the pipeline's domain rather than the transformation it performs is a candidate for either renaming (if the logic is general) or splitting (if the logic is genuinely order-specific and the general version deserves its own filter).

**Reflection:** The Stretch exercise makes the pipeline streaming with async generators, where each filter yields one row at a time. Does the streaming form change what a "good filter name" means — specifically, does a filter that buffers rows to deduplicate by ID (`dedupeById`) deserve a name that signals it breaks the single-row-in/single-row-out contract?
