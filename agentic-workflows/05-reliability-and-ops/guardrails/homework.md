# Homework — Guardrails

> Defense in depth. Three layers, each independently enforced.

## Exercise: Layer up

For an agent you've built, add three layers of guardrails:

### 1. Input guardrail
Reject or sanitize:
- Prompt-injection attempts (use regex patterns; you're not building a perfect detector).
- Inputs over a length cap.
- Inputs containing your team's "off-policy" topics.

### 2. Action guardrail
Block tool calls that:
- Touch sensitive paths (/etc, .env, secrets directories).
- Use destructive Bash patterns (rm -rf, sudo).
- Exceed per-call limits (e.g., file-size cap on writes).

### 3. Output guardrail
Filter outputs:
- Redact PII (emails, phone numbers).
- Redact API keys (their patterns).
- Block outputs that include URLs the agent can't verify.

**Constraints:**
- Each layer rejects with a clear reason.
- Rejections do NOT crash the loop — the LLM observes the reason and can adjust.
- Each layer is unit-tested independently.

## Stretch 1: LLM-based guardrail

Add a 4th guardrail: an LLM-as-judge classifier that evaluates whether the agent's planned action *aligns with the user's stated goal*. Reject misalignment.

**Constraints:**
- It runs occasionally, not every step (latency cost).
- The judge is its own agent with its own prompt.
- Its verdict is logged with rationale.

## Stretch 2: Audit log

For every guardrail rejection, log:
- The rejected input/action/output.
- The reason.
- The state (what the agent was trying to do).
- Timestamp + run_id.

This is your evidence for why the guardrail caught a bad case (or wrongly blocked a good one).

## Reflection

- "Defense in depth": why is one layer never enough? (Hint: each layer has blind spots; together they cover more.)
- A guardrail that fires on legitimate inputs damages trust. How do you balance precision and recall?
- Should guardrail logic be in the agent's prompt or outside it? Argue both sides.

## Done when

- [ ] Three layers each operational and tested.
- [ ] Rejections have specific reasons surfaced clearly.
- [ ] You can articulate which threats each layer addresses.
- [ ] You've tested at least 5 attack scenarios — at least 3 are caught.
