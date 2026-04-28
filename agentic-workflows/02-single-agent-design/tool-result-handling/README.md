# Tool Result Handling

**Category:** Single-agent design

## What you put back into the loop matters

The tool ran. Now what? You have a result — text, JSON, a file, an exception, a 50MB blob. The next step is deciding what to feed back to the LLM as the **observation**. This decision matters more than people realize:

- Too verbose → the prompt bloats; later steps degrade.
- Too terse → the LLM can't tell whether to retry, give up, or pivot.
- Wrong format → the LLM mis-interprets and acts on a phantom understanding.
- Errors mishandled → the agent loops or freezes.

Tool result handling is one of the most under-engineered surfaces in production agents. This topic covers it.

## The four cases

### 1. Success, small result
Just include it. `42`, `"ok"`, a 3-line file. No special handling.

```
[observation] 42
```

### 2. Success, large result
Truncate or summarize. Mark what was elided so the LLM can re-fetch if needed.

```
[observation] First 100 lines of users.csv:
"id,name,email\n1,kyle,kyle@x\n..."
[truncated, original 50,000 lines; call read_file with offset=100 for more]
```

### 3. Tool ran but the operation failed
Return a structured error. The LLM should see "this didn't work" *and* "here's why" so it can decide whether to retry, change inputs, or give up.

```
[observation] ERROR: file not found: /data/users.csv (path looks like absolute; did you mean ./data/users.csv?)
```

### 4. Tool itself threw an exception (your code, not the operation)
Surface the error. Do NOT crash the loop. Most failures should be observable and recoverable.

```
[observation] TOOL_EXCEPTION: read_file: Permission denied
```

## Truncation patterns

### Hard truncate
Cap at N characters / lines. Suffix with `[truncated, total: M]`.

```
"... (first 1000 chars only; total: 47820)"
```

Pros: simple, deterministic.
Cons: information loss; the agent must re-fetch if it needed more.

### Smart head + tail
Show the first N lines AND the last M lines. Useful for logs, where the recent end matters.

```
[lines 1-50 of 4837]
...content...
[... 4737 lines elided ...]
[lines 4788-4837 of 4837]
...content...
```

### Structural summary
For arrays / objects, summarize *shape* not *content*.

```
{ "users": [<3 items>], "total": 248, "next_cursor": "abc" }
```

The LLM knows "there are 3 users; ask for them with the cursor if needed."

### LLM-assisted summarization
For very large blobs, run a separate LLM call to summarize — at the cost of an extra call. Worth it when the data is rich and the agent is going to need a focused summary anyway.

## Errors: how to format them

A good error observation has three things:

1. **A clear marker** — `ERROR:` prefix or a structured `{ok: false}` field. The agent must instantly recognize this as an error case.
2. **The reason** — what went wrong, in one line.
3. **A hint or remediation** — when possible, what to try next.

Bad error:
```
[observation] null
```

Worse:
```
[observation] {"data": null, "metadata": {"latency_ms": 23}}  // success or not?
```

Good error:
```
[observation] ERROR: read_file: file not found at "/data/users.csv". Tip: are you sure the path is absolute? Try listing the directory first.
```

The hint is optional but *highly* effective at preventing the LLM from re-trying with the same broken inputs.

## Format choice: text vs structured

**Plain text** is universal. Every LLM handles it. Easy to truncate. Easy to read in logs.

**Structured** (JSON) is parseable and unambiguous, but more tokens.

A reasonable default:
- Text for human-readable content (file content, search results).
- JSON for structured tool outputs (API responses, query results).
- Always a single string at the conversation level — JSON is just a string with `JSON.stringify`.

For Claude Code's tool use, the result is typically a string; you `JSON.stringify` structured data into it.

## Common mistakes

- **Returning `null` or empty string on failure.** The LLM sees "no problem" when there's a problem.
- **Burying success/failure in the data shape.** "Result has a 'success' field" — the LLM may miss it. Use a clear top-level marker.
- **Including stack traces.** A 50-line stack is mostly noise to the LLM; a one-line cause is signal. Log the full trace; surface the cause.
- **Including secrets.** A tool that reads env vars and surfaces them in observations is a leak. Filter before observing.
- **No truncation.** A `read_url` tool that observes 200KB of HTML. The agent's next call will be partly blind from prompt overflow.

## Trade-offs

**Pros of disciplined result handling**
- Stable agent behavior across success/failure paths.
- Prompt size stays bounded.
- Recovery from transient failures is automatic.

**Cons**
- More boilerplate in tool implementations.
- The "right" truncation cutoff is workload-dependent and may need tuning.

**Rule of thumb:** Your tools' contract is not just inputs and successful outputs — it includes the **error language** and **truncation policy**. Design all three.

## Real-world analogies

- An IDE that shows "compile error: line 42, missing semicolon" — clear marker, reason, location. Versus "build failed" — useless.
- A REST API: 200 with body, 404 with error code, 500 with retry-after. The shape tells you what to do next.

## Run the demo

```bash
node demo.js
```

The demo runs the same tool four ways: raw output, hard-truncated, structurally-summarized, and error-formatted. You see how each affects what the LLM has to work with.

## Deeper intuition

Single-agent design is mostly the craft of controlling ambiguity. A strong single agent is not the one with the longest prompt; it is the one whose tools, output contracts, memory choices, and recovery rules make useful behavior easier than unhelpful behavior.

The best way to study **Tool Result Handling** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?
