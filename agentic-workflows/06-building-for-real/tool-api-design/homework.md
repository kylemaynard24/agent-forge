# Homework — Tool API Design

> Treat your tool surface like a real API. Errors, versions, idempotency.

## Exercise 1: Standardize error shape

Audit your tools' return shapes. Every tool should return:

```
{ ok: true, value: ... } | { ok: false, error: { code, message, retryable, hint? } }
```

If a tool returns nulls / strings / mixed shapes, refactor. Pick a small enum for error codes (4-6 codes max).

**Constraints:**
- Every tool conforms.
- The loop's error-classifier reads `error.code` and `error.retryable` to decide retry vs surface vs fail.
- A change to error codes is a coordinated update — not a stealth change.

## Exercise 2: Add idempotency to one mutating tool

Pick a tool that mutates state. Add an `idempotency_key` argument. Implement:

- The tool stores a {key → result} map.
- A second call with the same key returns the first call's result.
- After 24 hours, the entry is GC'd.

**Constraints:**
- The tool description tells the agent: "Provide an idempotency_key to safely retry."
- The agent generates keys per-action (e.g., a hash of the args + a request ID).
- A retry test passes: same key called twice → same result, side effect once.

## Exercise 3: Version a tool

Take an existing tool. Make a backwards-incompatible change (rename a field, tighten validation). Use **tool name versioning**:

- Keep the original tool, mark it deprecated in its description.
- Introduce `<tool>_v2` with the new shape.
- Migrate callers (your other agents and slash commands).
- After migration, retire v1.

**Constraints:**
- v1 and v2 coexist for a documented transition period.
- v1's description includes a "DEPRECATED — use <tool>_v2" note.
- A change log records the transition.

## Stretch: A tool catalog

Build a `TOOLS.md` (or per-tool `<name>.md`) catalog with:
- Name, version, description.
- Input schema with field-level docs.
- Error codes and their meaning.
- Idempotency notes.
- Examples (canonical usage).

Keep it in sync with the implementation. (You'll fail at this; that's the point — it's hard.)

## Reflection

- "Tool APIs are like REST APIs." Where does the analogy hold; where does it break? (Hint: holds: schema, errors, idempotency. Breaks: the consumer is a probabilistic LLM, not a deterministic client.)
- A tool whose error contract is "throw randomly" is a foot-gun. Why is that easier to write than the disciplined version?
- "Versioning is what separates a hobby tool from a product tool." Defend or refute.

## Done when

- [ ] Every tool conforms to a single result shape.
- [ ] At least one mutating tool has an idempotency key and a passing retry test.
- [ ] You've versioned at least one tool through a real transition.
- [ ] You can articulate the trade-offs of each error code in your enum.
