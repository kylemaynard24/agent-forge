# Error Handling and Recovery

**Category:** Single-agent design

## What can go wrong

In an agentic loop, every step is a potential failure point:

| Failure | Where | Example |
|---|---|---|
| Hallucinated tool | Think | LLM returns `"tool": "read_files_recursively"` — doesn't exist |
| Malformed args | Think | LLM omits a required field; type mismatch |
| Tool error (operation) | Act | File not found; API rate-limited; network timeout |
| Tool exception (your code) | Act | Bug in your tool implementation |
| Validation failure | Observe | Structured output doesn't match schema |
| Loop / repetition | Decide | Agent calls same tool with same args twice |
| Off-task drift | Decide | Agent starts pursuing tangents |
| Budget exhaustion | Decide | Hit max steps / tokens / dollars |

You can't prevent all of these. You *can* design the loop to detect, classify, and respond appropriately.

## The four responses

Every detected failure has a response. There are four:

### 1. Surface to the LLM (let the agent decide)

Return the error as an observation. The LLM sees what happened and decides — retry, change inputs, give up, ask the user.

```
[observation] ERROR: file not found at "data/foo.csv". Hint: check spelling or use list_files.
```

This is the default. **Trust the LLM with most error decisions.** It's good at picking next moves given the right observation.

### 2. Retry transparently (loop runtime)

Some errors are *transient* and obvious — network timeouts, rate limits. The loop can retry without bothering the LLM:
- N retries with exponential backoff.
- Surface only if all N fail.

This works for tools where the LLM has nothing useful to add ("the network was flaky"). It does NOT work for application errors ("file not found") — those should go to the LLM.

### 3. Hard-fail (terminate the loop)

Some failures should kill the run:
- Repeated identical tool calls (the agent is looping).
- Budget exhausted.
- A "fatal" tool error that we know is unrecoverable.
- Validation failure on the final output after N retries.

Terminate cleanly with a clear failure mode in the result.

### 4. Escalate (human in the loop)

For ambiguous or risky decisions, pause the loop and ask the human:
- "I see two files matching your description. Which one?"
- "This action will delete data. Confirm?"
- "I've tried 3 approaches and nothing works. Should I keep trying?"

This is the safest response when stakes are high. (See `05-reliability-and-ops/human-in-the-loop`.)

## Classifying errors at runtime

Decide a default response per error category:

| Error type | Default | Rationale |
|---|---|---|
| Hallucinated tool | Surface to LLM | LLM picks a real one |
| Malformed args | Surface to LLM | LLM corrects |
| Operation error (e.g., 404) | Surface to LLM | LLM may know an alternative |
| Transient infra (timeout, 5xx) | Retry | LLM can't fix the network |
| Tool exception | Surface to LLM | Often LLM can work around |
| Validation failure | Retry × N → fail | Agent needs to know why |
| Loop / repetition | Hard-fail | Agent is stuck |
| Budget | Hard-fail | Stop the bleeding |
| Risky action | Escalate | Human decides |

## The retry pattern (transient errors)

A clean retry loop:

```
async function withRetry(fn, { attempts = 3, baseMs = 200, factor = 2, jitter = 0.3 }) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (e) {
      if (!isTransient(e)) throw e;
      lastErr = e;
      const delay = baseMs * factor ** i * (1 + (Math.random() - 0.5) * jitter);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr;
}
```

`isTransient(e)` is your classifier — connection refused, 5xx, rate limits → retry; everything else → propagate.

## The repetition detector

A common failure: the agent calls the same tool with the same arguments over and over. It's stuck.

A simple detector:

```
function isRepeating(history, lookback = 3) {
  if (history.length < lookback * 2) return false;
  const recent = history.slice(-lookback).map(JSON.stringify);
  const prior  = history.slice(-lookback * 2, -lookback).map(JSON.stringify);
  return recent.every((c, i) => c === prior[i]);
}
```

Use this in your loop's "decide-continue" step. If repeating → terminate with `reason: "looping"`.

## Errors as part of the prompt loop

The most under-rated insight: **errors are valuable signal**. A well-formatted error can guide the agent to a fix faster than perfect tools could.

```
ERROR: read_file: "/data/users.csv" not found.
Available files in ./data/: customers.csv, sales.csv, products.csv
```

The agent reads "Available files" and corrects on the next call. This is much cheaper than the agent guessing again.

## What NOT to do

- **Swallow errors silently.** A `try { ... } catch { return null; }` in a tool is a foot-gun.
- **Crash the loop on any error.** One bad tool call shouldn't kill the agent.
- **Retry forever.** Every retry has a budget; respect it.
- **Hide the error from the LLM.** "Failed; let me try again" with no detail puts the LLM back to guessing.
- **Treat all errors the same.** Network timeout != "you called the wrong tool."

## Trade-offs

**Pros of structured error handling**
- Agents are robust to transient failures.
- Fatal errors fail fast and audibly.
- Logs are useful for post-mortems.

**Cons**
- More code paths to maintain.
- Over-eager retries waste calls and dollars.

**Rule of thumb:** Default everything to "surface to LLM." Move specific cases to "retry" or "fail" only when you have evidence the LLM can't add value to that decision.

## Real-world analogies

- A pilot's response to an alarm: classify (cabin pressure? engine? avionics?), decide (fly through, abort, escalate to ATC), act. Same shape as agent error handling.
- A senior engineer debugging: see error, classify, try one thing, observe, decide. The agent does this in microseconds; the structure is the same.

## Run the demo

```bash
node demo.js
```

The demo runs an agent with a flaky tool and shows three error-handling strategies side by side: ignore (crash), retry-only (eats transient errors), and full (retry + surface). The "full" version succeeds fastest.
