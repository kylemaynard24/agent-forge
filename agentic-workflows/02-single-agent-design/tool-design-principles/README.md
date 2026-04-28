# Tool Design Principles

**Category:** Single-agent design

## Why this is its own topic

Section 01 introduced tools as the agent's interface to the world. This topic is the **production-grade discipline** of designing them: naming, schema, error contract, idempotency, granularity. If tools are the agent's hands, this is the ergonomics of the grip.

Most agent failures look like prompt failures but are actually tool design failures. **When the agent picks the wrong tool or fumbles arguments, your first suspect should be the tool definition.**

## The 8 principles

### 1. Name tools with verbs

`read_file` not `file_handler`. `search_repo` not `repo_searcher`. The name is the agent's first signal for *what this tool does*.

Bad names:
- `process_data` — process how? what data?
- `handle_user_request` — handle is a smell; what's the action?
- `db_op` — too cryptic; LLMs don't infer abbreviations cleanly.

Good names:
- `query_database`
- `list_open_pull_requests`
- `summarize_paragraph`

### 2. One tool, one outcome

Avoid super-tools that switch on a `mode` or `action` parameter:

```
// BAD
file_op({ action: "read" | "write" | "delete", path, content? })

// GOOD
read_file({ path })
write_file({ path, content })
delete_file({ path })
```

The super-tool seems "compact" but is harder for the LLM to use correctly. With three single-purpose tools:
- Each schema is exact (no conditional fields).
- The model picks by name, not by `action` value (more reliable).
- Permissions are per-tool (you can allow `read` but not `delete`).

### 3. Strict schemas; required is required

Every argument has:
- A name.
- A type.
- A `required` flag.
- A short description.

If a field is required, mark it required. Don't rely on the prompt to enforce it. Schema validation catches malformed calls *before* you waste a tool execution.

```json
{
  "name": "read_file",
  "input_schema": {
    "type": "object",
    "properties": {
      "path": { "type": "string", "description": "Absolute or relative path." }
    },
    "required": ["path"]
  }
}
```

### 4. One error contract per system

Pick a convention and stick to it. Examples:

- **Returns-or-throws.** Tools throw on errors; the runtime catches and surfaces as an observation. Simple; your tool implementations are clean.
- **Tagged result.** Every tool returns `{ok: true, value}` or `{ok: false, error}`. Verbose; explicit; LLMs handle it well.
- **Error-marker prefix.** Errors are strings starting with `ERROR:`. Cheap; brittle if your domain has legitimate `ERROR:` prefixes.

Pick one. Document it in your system prompt's tool-handling rules. Never mix.

### 5. Idempotency where possible

A *read* tool can be retried freely. A *write* tool retried is a duplicate side effect. Design writes to be idempotent: same input → same outcome whether called once or three times.

Mechanics:
- **Idempotency keys.** Caller provides a unique ID; second call with the same ID returns the first call's result.
- **Conditional writes.** "Insert if not exists." "Update if version matches."
- **At-most-once via state.** Tools like `commit_pr({pr_id, ...})` check whether the PR is already committed.

Make this explicit in the tool description so the LLM knows it can safely retry.

### 6. Granularity: small enough to compose, big enough to be useful

A tool that's too small forces the LLM to chain many calls (slow, expensive, error-prone). A tool that's too big rolls many decisions into one place where the LLM has less control.

Rough guideline: a tool should do **one verb's worth of work**. `read_file` is right. `read_and_summarize_file` is two verbs (read, summarize) and probably should be two tools — UNLESS you've measured that the chain is reliably needed and the LLM gets it right inconsistently.

Compose by default. Grow on evidence.

### 7. Make schemas a documentation layer

The tool description is read by the LLM every time. Treat it as a small prompt:

```
read_file:
  Read the contents of a text file. Returns the file's text or an error string
  prefixed with "ERROR:". Use only for files under ~10MB; larger files truncate
  to first 10000 lines. Don't use for binary files.
```

What's in this 4-line description:
- **What:** read text content.
- **Returns shape:** text on success; `ERROR:`-prefixed string on failure.
- **Constraints:** size limit, behavior at limit.
- **Anti-pattern:** binary files.

The LLM reads this every call. It's worth its tokens.

### 8. Surface area discipline

Every tool you add is one more thing the LLM can mis-pick. Tighter surface = more reliable agent.

Symptoms of too many tools:
- The LLM uses tool X but you intended Y; the names overlap.
- Two tools never get used; they were "nice to have."
- New users of your agent ask "which tool do I use for [obvious task]?"

Fix: prune. Remove tools that are unused or always-mis-picked. Combine tools whose names overlap.

## Anti-patterns to avoid

- **Mode parameters.** `do_thing(mode: 'a' | 'b' | 'c')`. Split into three tools.
- **Optional everything.** A tool with 8 optional fields is unguided; the LLM picks at random.
- **Free-form `args` blobs.** `run({command, args: any})`. The model has no schema for `args`; expect chaos.
- **Returning the universe.** `list_files()` that returns 50KB of paths. Add filters/pagination.
- **Mixing reads and writes.** `read_or_create_file({path, default_content})`. Two tools.

## Versioning tools

When you change a tool's schema or behavior, version it:
- `read_file_v2` (explicit) — clear; ugly.
- Field additions in a backwards-compatible way (new optional fields don't change existing behavior) — clean; requires discipline.

The first time you break a tool's contract for an in-flight agent, you'll never forget the versioning lesson.

## Trade-offs

**Pros of strict tool design**
- Reliable agent behavior; fewer "wrong tool" loops.
- Schemas catch mistakes before they cost LLM calls.
- Documentation is the schema; descriptions are the prompt.

**Cons**
- More files (one tool per file vs one super-tool).
- Higher up-front discipline; throwaway agents don't need it.

**Rule of thumb:** If your agent is mis-picking tools or fumbling arguments, you'll get more leverage by fixing the tools than by fiddling with the prompt.

## Real-world analogies

- A REST API: each endpoint is a "tool" with verb, path, schema. Great APIs feel obvious; bad APIs are full of "process" and "handle" endpoints.
- A keyboard: each key does one thing. There's no "key with a mode parameter."
- A toolbox: hammer, screwdriver, drill — distinct, single-purpose, well-labeled. Not "all-purpose tool."

## Run the demo

```bash
node demo.js
```

The demo defines two versions of the same capability — a "super-tool" with mode parameters and a clean three-tool decomposition — and runs the agent against each. The clean version succeeds; the super-tool produces a malformed call.
