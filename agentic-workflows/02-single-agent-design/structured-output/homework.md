# Homework — Structured Output

> Use structure where structure is needed. Validate. Retry on failure.

## Exercise 1: Convert a free-text agent to structured

You have an agent that summarizes a meeting transcript. Right now, it returns a free-text summary that downstream tools regex-parse with mixed success.

**Build:**
- Define a schema:
  ```
  {
    "summary": string,
    "decisions": [{ "what": string, "owner": string|null, "due": string|null }],
    "action_items": [{ "what": string, "owner": string }],
    "open_questions": [string]
  }
  ```
- Modify the agent to emit this structure via a `submit_summary` tool (if you have an API), or via "respond with JSON matching schema" (if you don't).
- Add a validator that checks the schema strictly.

**Constraints:**
- Required fields are marked required; the validator rejects if missing.
- Categorical fields (none in this schema, but if you add severity later) use enums.
- Empty state is consistent: empty arrays for empty lists, `null` for unknown values.

## Exercise 2: Retry on validation failure

Add a retry loop:
1. Agent emits structured output.
2. Validator runs.
3. If invalid, return the validation errors to the LLM and ask it to retry.
4. Cap at 3 retries; on the 3rd failure, return an error to the caller.

**Constraints:**
- The retry message includes the *specific* validation errors, not "your output was wrong."
- The 3-retry cap prevents infinite loops on a model that can't satisfy the schema.
- Each retry is logged so you can audit which models / inputs trigger retries.

## Exercise 3: Empty-state design

Pick three fields in your schema. For each, decide what "empty" looks like:
- An empty array? `null`? An empty string? A sentinel like `"none"`?

Document your choice in a `SCHEMA_DESIGN.md`. Pick one convention per type and apply it consistently.

**Constraint:** A test asserts that the agent never returns mixed empty representations (e.g., never returns `null` for one decisions list and `[]` for another).

## Stretch: Schema versioning

Your schema evolves. v2 adds an optional `priority` field. v1 callers shouldn't break. v2 callers should get the new field.

**Build:**
- Version field at the top: `{ version: "v2", ... }`.
- Validators for v1 and v2.
- A "downgrade" path: if a v1 caller asks for the output, the v2 schema is downgraded by dropping `priority`.

**Reflection:** how does this compare to versioning REST APIs?

## Reflection

- Free text is fine when a human reads the output. What's the test for "is a human the only consumer"? (Hint: do you `JSON.parse` the result anywhere?)
- Why do "schema descriptions on every field" matter so much? (Hint: the model reads them as instructions.)
- Schema validators are commonly seen as a safety net. They're really an active part of the prompting loop. Argue this view.

## Done when

- [ ] Your agent emits structured output for any task with multiple discrete fields.
- [ ] Validation rejects malformed output with specific errors.
- [ ] Retry-on-failure works for at least one tested case.
- [ ] You can articulate when you'd use free text and when you'd structure it.
