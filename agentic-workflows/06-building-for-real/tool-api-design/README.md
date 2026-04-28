# Tool API Design

**Category:** Building for real

## Beyond the basics

In `02-single-agent-design/tool-design-principles` we covered the design rules: verb names, single-purpose, strict schemas, etc.

This topic is the **production discipline** layered on top:

- Schema evolution without breaking deployed agents.
- Error contract that scales beyond 5 tools.
- Idempotency for retry-prone environments.
- Versioning strategies.
- Documentation as a product surface.

If you're shipping tools to multiple agents or teams, this is the level you operate at.

## Schema evolution

Tool schemas change. New fields, deprecations, type changes. Each change risks breaking existing agents — agents trained on the old schema may emit calls that don't match the new one.

### Backwards-compatible additions
- Adding an optional field: safe. Existing callers ignore it.
- Adding a new tool: safe. Existing callers don't know about it.
- Loosening validation (e.g., enum → string): generally safe but reduces type safety for new callers.

### Backwards-incompatible
- Removing a field: BREAKS callers using it.
- Renaming a field: BREAKS callers.
- Tightening validation (e.g., adding required field): BREAKS callers omitting it.

For backwards-incompatible changes:
- **Deprecate first.** Mark the old field deprecated; emit warnings.
- **Version the tool.** `read_file_v2` exists alongside `read_file`. Migrate callers; eventually retire v1.
- **Coordinate.** If only your team uses the tool, migrate at once. If the tool is exposed via MCP to many clients, treat it like a public API.

## Error contract — at scale

For a system with 20+ tools, an inconsistent error contract becomes a tax. The agent has to remember each tool's idiosyncrasies. Standardize.

A reasonable system-wide convention:

```
Success → { ok: true, value: <any> }
Failure → { ok: false, error: { code: "...", message: "...", retryable: bool, hint?: "..." } }
```

Every tool returns one or the other. The agent learns one shape; applies it everywhere.

The `code` field is enumerated:
- `not_found`
- `invalid_input`
- `permission_denied`
- `rate_limited`
- `transient`
- `unknown_error`

These map to specific behaviors in the loop (retry vs surface vs fail).

## Idempotency at the API layer

A tool that mutates state should be idempotent under retry. Three options:

### A. Caller-supplied idempotency key
```
charge_card({ amount, currency, idempotency_key })
```
First call charges; subsequent calls with the same key return the first call's result. Industry standard (Stripe, etc.).

### B. Conditional writes
```
update_record({ id, version, fields })
```
Update only if version matches. Retries with a stale version fail; the agent reads + retries with current version.

### C. Naturally idempotent
Read operations. `set_status(...)` (vs `increment_status_count(...)`). Design for idempotency from the start.

## Tool versioning

Three flavors:

### URL versioning
`v1.tools/read_file`. Crude. Good for big breaking changes.

### Field versioning
The schema includes a `schema_version` field. Tool checks it; behaves accordingly. Subtle.

### Tool name versioning
`read_file_v2` is a new tool. `read_file` is deprecated. Coexist for a transition period.

For tools exposed via MCP, **tool name versioning** is usually cleanest — clients can opt into v2 explicitly.

## The tool API as documentation

A well-documented tool surfaces its contract in:
- The tool's `description` (read by the LLM at every call).
- A separate developer doc (`TOOLS.md`) for engineers integrating with the tool.
- Examples (canonical usage) — also help the LLM.

Keep these in sync. A tool whose docs lag its behavior is a foot-gun.

## Anti-patterns

- **Stealth changes.** Tool behavior changes without a version bump. Existing callers break.
- **Magic strings.** Tool returns `"OK"` on success and `"NO"` on failure. The agent has to memorize.
- **Inconsistent shapes.** Tool A returns `{result, error}`; tool B returns `{value} or string`. The agent thrashes.
- **No error codes.** All failures return `{error: "something went wrong"}`. The agent can't classify.

## Trade-offs

**Pros of disciplined tool API**
- Agents work reliably across versions.
- New tools fit existing patterns; LLMs handle them naturally.
- Multiple teams can build on the same tool surface.

**Cons**
- Up-front design cost.
- Backwards-compat constraints add friction.
- Retiring tools is more work than adding them.

**Rule of thumb:** If your tool will outlive a single project — version it like an API. If it's prototype-only — don't bother.

## Real-world analogies

- REST API design: versioning, error codes, idempotency keys, resource shape.
- gRPC / Protobuf with field numbers: backwards-compat is a first-class concern.

## Run the demo

```bash
node demo.js
```

The demo shows two versions of the same tool — one that breaks on schema change, one with versioning + idempotency. Compares behavior under a "deployed older agent" scenario.

## Deeper intuition

Building-for-real topics turn agent demos into systems that can survive repeated use. The key shift is from 'can the model do this once?' to 'can the whole surrounding system make this dependable, testable, evolvable, and operationally sane?'

The best way to study **Tool API Design** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?
