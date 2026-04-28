# Homework — Error Handling and Recovery

> Build an error-aware loop. Classify failures. Surface most to the LLM.

## Exercise 1: Build an error classifier

Implement `classifyError(error)` that returns one of:
- `transient` — retryable (network timeout, 5xx, rate-limit).
- `app` — application error, surface to LLM (404, validation, business-rule failure).
- `tool_bug` — your tool itself broke (TypeError, etc). Surface, but log loudly.
- `fatal` — terminate the loop (auth failed, irrecoverable state).

**Constraints:**
- The classifier inspects error properties (HTTP status, error code, error class) not strings.
- Default class is `app` — when in doubt, let the LLM handle it.
- Add an explicit "transient" allow-list (you opt IN to retry); don't infer.

## Exercise 2: A robust loop

Take the loop from `01-foundations/the-agentic-loop`. Add:

- `withRetry` for transient errors (3 attempts, exponential backoff with jitter).
- A repetition detector (last 3 actions identical to prior 3 → terminate `looping`).
- Error-as-observation surfacing for `app` and `tool_bug` errors.
- Hard-fail for `fatal` errors and budget exhaustion.

**Constraints:**
- The loop NEVER throws. It always returns a `{ status, reason, ... }` shape.
- Every termination has a named `reason`.
- Each error path is logged (you can post-mortem any failure).

## Exercise 3: Error message quality

Take three error scenarios:
1. File not found.
2. Invalid argument shape.
3. Unknown tool name.

For each, write the **error observation** the loop will return to the LLM. Score yours on:

- **Marker:** can the LLM see at a glance that this is an error?
- **Cause:** is the reason explicit?
- **Hint:** is there a remediation tip?

```
✗ poor:  "null"
✗ poor:  "Error: undefined"
✓ good:  "ERROR: read_file: file not found at './data/users.csv'.
          Hint: call list_files first to see what exists."
```

**Constraints:**
- Each observation has the three parts (marker, cause, hint).
- Hints don't fabricate (don't suggest a directory you haven't verified).
- An observation never includes secrets or PII.

## Stretch: Repetition detection across non-identical calls

Your agent calls `read_file({path: "/x"})`, observes "not found," then calls `read_file({path: "/x/"})` (added trailing slash), observes "not found," then `read_file({path: "x"})` (relative), observes "not found." It's stuck — but the args aren't strictly identical.

Build a smarter repetition detector that flags "exploring trivial variants" as a stuck pattern. (Hint: normalize paths; compare argument *intent*, not raw bytes.)

## Reflection

- "Trust the LLM with errors." When does this rule break? (Hint: when retries are obvious infra issues; when the user must approve.)
- Why is silent error swallowing the worst response? (Hint: the agent thinks it succeeded; subsequent steps are based on a phantom.)
- A loop with no error classification is a loop with one error type: "everything." Why is that a footgun?

## Done when

- [ ] Your loop never crashes — always returns a structured result with a reason.
- [ ] Transient errors retry; app errors flow to the LLM; loops terminate.
- [ ] Three error observations meet the marker/cause/hint quality bar.
- [ ] You can articulate when to retry vs surface vs fail vs escalate.
