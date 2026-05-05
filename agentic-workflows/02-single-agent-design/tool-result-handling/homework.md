# Homework — Tool Result Handling

> Engineer the observation layer. Truncate large outputs, format errors clearly, surface progress signals.

## Exercise 1: Build a result formatter

Build a `formatObservation(toolName, result, opts)` function that handles all four cases:

1. **Small success** → return the value as a short string.
2. **Large success** → truncate or summarize structurally; include "elided / re-fetch" hints.
3. **Operation error** (tool ran but failed) → `ERROR:` prefix + cause + hint.
4. **Tool exception** (your code threw) → `TOOL_EXCEPTION:` prefix + cause.

**Constraints:**
- Output is always a string ≤ `opts.maxChars` (default 1000).
- Errors are immediately recognizable from the first line.
- Structural summaries include enough info for the LLM to ask for more.
- The function never throws (errors during formatting fall back to a safe default).

## Exercise 2: Error hint catalog

Build a small "hint catalog" — a mapping from common tool-error patterns to remediation tips:

```js
const hints = {
  'ENOENT': 'File not found. Try list_files first to see what exists.',
  'EACCES': 'Permission denied. The agent may not have access; ask the user.',
  'rate_limit': 'API rate limit hit. Wait or reduce request rate.',
  ...
};
```

When you format an error observation, look up the cause prefix and append the matching hint. If no hint matches, omit the hint section.

**Constraint:** the catalog is data, not code. Adding a new entry is editing the catalog file, not the formatter.

## Exercise 3: Truncation that preserves "shape"

For large arrays:
- Show first 3 items + structural summary (`[1, 2, 3, ...({n-3} more items)]`).
- For nested structures, recurse — but cap depth.

For large strings:
- Head + tail truncation with elided count in the middle.

**Constraint:** A test asserts that, for any input, the formatted output has a *deterministic* maximum length under your cap.

## Stretch: Compare on a real-ish workload

Take a small agent (the demo from `01-foundations/the-agentic-loop`) and run it twice over a list-heavy task ("show me all the open issues from this repo"):
- Once with raw observations.
- Once with your structured/truncated observations.

Compare:
- Total prompt size at end of run.
- Number of tool calls.
- Cost (estimated, in tokens).

You should see a noticeable drop with the structured strategy. If not, your truncation policy is too lax.

## Reflection

- Why is "include a hint" surprisingly effective for error recovery? (Hint: it's not about giving the LLM smarts — it's about reducing the search space the LLM has to consider.)
- A `null` observation is almost always wrong. What three pieces of information should every observation carry? (Hint: outcome marker, value or reason, hint-when-applicable.)
- "If you can read a tool's observation aloud and not be sure whether it succeeded, the format is wrong." Argue this principle.

## Done when

- [ ] Your formatter handles all four cases without throwing.
- [ ] Errors are recognizable from the first line.
- [ ] Large arrays produce concise structural summaries with re-fetch hints.
- [ ] You measured (or estimated) the prompt-size savings on a real run.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Explicit Return Types

A tool result schema is a return type contract: every field name the LLM reads becomes part of how it interprets the outcome and decides the next action. A field named `data` tells the model nothing; a field named `matching_files` or `error_cause` communicates the semantics without requiring additional explanation — the same reason a function that returns `{ result }` is harder to use than one that returns `{ invoice_total, line_items }`. The `ERROR:` and `TOOL_EXCEPTION:` prefixes in your formatter are the agentic equivalent of typed exceptions: the caller knows what category of failure it is before reading the message.

**Exercise:** Review the hint catalog you built and check whether each hint key (e.g., `ENOENT`, `rate_limit`) is named from the caller's perspective or from the implementation's perspective. Rename any key that describes the internal error code rather than the situation the LLM needs to respond to, then update the catalog entries to match.

**Reflection:** The homework says "if you can read a tool's observation aloud and not be sure whether it succeeded, the format is wrong." What is the clean code equivalent of this rule for function return values — and what naming or typing convention enforces it?
