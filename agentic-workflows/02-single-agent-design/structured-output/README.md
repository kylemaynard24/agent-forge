# Structured Output

**Category:** Single-agent design

## Free text vs structure

An LLM can return:

- **Free text** — a natural-language paragraph or markdown document.
- **Structured output** — JSON, XML, or another schema-conforming format.

Both have their place. The trap is using free text when you need structure, then writing brittle parsers to extract data. **If a downstream system consumes the output, the output should be structured.**

## When to use structured output

- The output feeds another tool / API / database.
- The output has multiple discrete fields (severity, file, line, message).
- You need to validate the output mechanically (schema check).
- You'll programmatically branch on the output (`if result.confidence == "high"`).

## When free text is fine

- The output is for a human to read.
- Single-purpose ("write a haiku").
- You don't intend to programmatically inspect it.

## Three ways to get structure

### 1. Tool-calling / structured output APIs (preferred)

Modern LLMs (Claude, GPT-4, Gemini) support tool use natively. The model emits a structured tool call:

```json
{
  "name": "submit_review",
  "input": {
    "issues": [{ "file": "x.py", "line": 42, "severity": "med" }],
    "confidence": "high"
  }
}
```

The runtime gets validated JSON. No parsing.

This is **the right primitive for almost every structured-output need.** Use it.

### 2. Constrained / guaranteed structured-output mode

Some APIs (Anthropic, OpenAI) support a "structured output" mode where the model is constrained to output JSON conforming to a supplied schema. Same idea as tool-calling, slightly different framing.

### 3. Schema-in-prompt (fallback)

If your model lacks tool-use, fall back to: tell the model to output JSON, supply the schema in the system prompt, parse the result.

```
You MUST respond with valid JSON matching:
{
  "answer": string,
  "confidence": "low" | "med" | "high"
}
```

Pros: works with any LLM.
Cons: the model can produce malformed JSON; you need a parser with retry. Brittle in practice — use it only if you must.

## Schema design for LLMs

### Use unions / enums for categorical fields

```json
{ "severity": { "enum": ["low", "med", "high"] } }
```

Beats `severity: string` because the model knows the allowed values. Otherwise expect `severity: "moderate"`, `"medium"`, `"medium-high"`.

### Make required fields required

If the model can omit a field, expect it to omit a field 5% of the time, and that 5% will hit you in production.

### Keep schemas flat and shallow

Deeply nested schemas (`a.b.c.d.e`) are harder for models to fill correctly. Two levels deep is comfortable; five levels is asking for trouble.

### Add descriptions to every field

In the schema itself. The model reads them. A field named `notes` with no description is filled with whatever the model thinks "notes" might mean. A `notes` field described as "1–2 sentence summary of caveats" gets you summaries of caveats.

```json
{
  "notes": {
    "type": "string",
    "description": "1-2 sentence summary of caveats. Empty string if none."
  }
}
```

### Empty-state defaults

Decide what each field looks like when there's nothing to say:
- `[]` for a list with no entries.
- `null` for an optional value.
- `""` for an empty string.
- A sentinel like `"none"` or `"n/a"`.

Be consistent. Mixing `null` and `""` and missing-key produces three failure modes.

## Structured output across multiple turns

If the agent is iterating (multi-step), structured output usually shows up at the very end (final answer). Intermediate "thoughts" are typically free text — used by the agent to reason internally — and not consumed downstream.

A common pattern: **structured at the boundary, free-form internally**. Tool calls (structured) at every step; the final `submit` tool emits the structured output that the user / system consumes.

## Validation

Always validate the LLM's structured output before acting on it. Use:
- A schema validator (zod, ajv, JSON-schema, pydantic).
- The same schema you supplied to the model.

If validation fails, options:
- **Retry with the error message.** Append a "your output was invalid: [error]" message and ask again.
- **Fail fast.** Return an error to the caller; don't silently degrade.
- **Repair.** Some libraries can repair common JSON mistakes (trailing commas, unquoted keys); use cautiously.

## Anti-patterns

- **Inline JSON examples that the model copies verbatim.** Use real schemas, not "output JSON like this: ..."
- **Hidden delimiters.** "Wrap your output in <result>…</result>." Brittle. Use tool-calling.
- **Free-text + post-hoc regex parsing.** A reasonably-defined source of pain. Use structured output.
- **Stringly-typed everything.** A field that should be a number returned as `"4.5"`. The schema is lying. Use real types.

## Trade-offs

**Pros**
- No parsing brittleness; schema validation catches issues immediately.
- Downstream systems get reliable inputs.
- The schema itself is documentation.

**Cons**
- A bit more setup (schemas, validation).
- Models occasionally fail to fill complex schemas; needs retry logic.
- Some creative tasks ("write a story") are awkward to structure.

**Rule of thumb:** If a downstream system reads the output, structure it. If a human reads it, don't bother.

## Real-world analogies

- A REST API that returns JSON vs one that returns a press release. The first you can integrate; the second you can read.
- A receipt vs a story about your shopping trip. Both are records; only one is queryable.

## Run the demo

```bash
node demo.js
```

The demo contrasts free-text and structured output for the same agent task ("review these issues"). The free-text version requires custom parsing; the structured version is parsed by `JSON.parse` and validated against a schema.
