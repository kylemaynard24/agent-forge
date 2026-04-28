# Tools as the World Interface

**Category:** Foundations

## Why tools at all

A pure LLM is a sealed box. Text in, text out. It cannot read your files, query your DB, send an email, or run a build. Without tools, an agent is a chatbot.

A **tool** is a named function with a structured input schema, exposed to the LLM as a callable. The LLM doesn't *call* the tool itself — it emits a structured request ("call `read_file({path:'x'})`") and the runtime executes it. The result becomes the next observation.

Tools are the *only* way an agent affects or perceives the world.

## What a good tool looks like

A well-designed tool is:

1. **Named for the verb.** `read_file` not `file_handler`. `send_email` not `email_service`. The name is what the LLM sees first; vague names produce vague calls.
2. **Single-purpose.** One tool, one outcome. A `database_action(action, ...)` super-tool with `action: 'read'|'write'|'delete'` is worse than three separate tools — the schema is mushy and the LLM can't predict the contract.
3. **Strict-schemaed.** Required arguments are required. Types are typed. Bad inputs are rejected at the schema layer, not buried in the implementation. (If you're using Anthropic's tool-use, use JSON Schema. If OpenAI, use their function-calling schema. Same idea.)
4. **Predictable in failure.** A tool that returns `null` on miss vs throws on miss vs returns `{error: ...}` is three tools in disguise. Pick one error contract per tool *and* per system; document it.
5. **Side-effect-aware.** A *read* tool is safe to retry; a *write* tool is not. The schema or description must make this clear.
6. **Idempotent where possible.** Network errors mean retries; retries mean duplicate side effects unless idempotent. (More on this in `02-single-agent-design/tool-design-principles`.)

## What a bad tool looks like

- A tool with 12 parameters, half optional, that "does many things." The LLM will fail to populate it correctly half the time.
- A tool whose description says "use this when appropriate." The LLM has no signal for *when*.
- A tool that returns 50KB of JSON for a 1-line answer. Wastes context, confuses the model.
- Two tools with similar names (`run_query` and `run_sql`). The LLM will guess wrong.
- A tool that silently truncates inputs or coerces types — the LLM thinks it submitted X, the system did Y.

## Tool description: the second prompt

Each tool has a name, a schema, AND a description. The description is documentation aimed at the LLM. Treat it as a small prompt:

```
read_file:
  Read the contents of a file from the local filesystem.

  Use this when you need to inspect a file's content. Don't use it
  for binary files (images, executables) — output will be garbled.

  Returns the file's text content, or an error string starting
  with "ENOENT:" if the file doesn't exist.
```

Good descriptions tell the LLM:
- **What** the tool does (one line).
- **When** to use it (the trigger condition).
- **When NOT** to use it (anti-patterns).
- **What it returns** (success and failure shape).

## Surface area: less is more

A common rookie mistake: "more tools = more capable agent."

In practice, more tools = harder LLM choice = worse decisions. Each tool you add increases the model's chance of picking the wrong one or fumbling the schema.

**Rule of thumb:** start with the minimum viable tool set. Add tools only when the agent fails because a capability was missing. Remove tools that the agent never picks (or always picks wrongly).

For Claude Code, the built-in tools (`Read`, `Write`, `Edit`, `Bash`, `Grep`, `Glob`, etc.) are an example of a tight, well-named, well-described surface.

## Composing tools vs growing them

When the agent needs richer capability, you have two paths:

- **Compose**: keep tools small; let the agent chain them. `read_file` then `count_lines`. Simpler tools, more LLM calls, more flexibility.
- **Grow**: add a higher-level tool (`count_lines_in_file`). One LLM call instead of two; less flexibility.

The trade-off is **flexibility vs efficiency**. Compose by default; grow when the agent is reliably stitching the same chain together.

## Trade-offs

**Pros of well-designed tools**
- The agent picks the right tool reliably.
- Tools are testable in isolation.
- Schemas catch mistakes at the boundary.

**Cons of bad tools**
- Wasted LLM calls choosing or recovering.
- Hallucinated arguments → tool errors → more wasted calls.
- The agent looks "stupid" when actually the tool was unspeakable.

**Rule of thumb:** When the agent is failing, look at the *tools* before you blame the *prompt* or the *model*. Most agent bugs are tool-design bugs in disguise.

## Real-world analogies

- A surgeon's tray: well-laid-out, named instruments. Each does one thing. You don't put a blender on the tray.
- A REST API: each endpoint is a "tool" with a verb (GET/POST/...), a schema (path + body), and a contract (response shape). Well-designed APIs and well-designed tools share a lot of DNA.
- A LEGO set: hundreds of shapes, but each shape is single-purpose. The interfaces (studs) are uniform.

## Run the demo

```bash
node demo.js
```

The demo defines five tools — three good, two intentionally bad — and runs a small agent against them. You can see the model picking the well-named tools and stumbling on the badly-named ones.
