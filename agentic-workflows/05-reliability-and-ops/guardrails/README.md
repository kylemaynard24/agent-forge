# Guardrails

**Category:** Reliability and ops

## What guardrails are

A **guardrail** is a check that prevents the agent from doing something dangerous, off-policy, or out-of-scope. They run *outside* the LLM — they don't trust the model to police itself.

Guardrails are the "thou shalt not" layer of agent design. They're absolute.

## Where they live

Guardrails apply at three boundaries:

### 1. Input guardrails
Block, sanitize, or transform inputs before they reach the agent.

Examples:
- Reject inputs with prompt-injection signatures ("ignore prior instructions…").
- Strip PII from user inputs.
- Block requests for prohibited topics.
- Enforce input-size limits.

### 2. Action guardrails (between LLM and world)
Inspect each tool call before executing it.

Examples:
- Block writes to `/etc/`, `~/.ssh/`, etc.
- Block destructive Bash commands (`rm:*`, `sudo:*`).
- Require confirmation for actions over a threshold (transferring > $X).
- Rate-limit tool calls.

### 3. Output guardrails
Inspect the agent's final output before returning it.

Examples:
- Refuse to return outputs containing PII.
- Block outputs that include hallucinated URLs.
- Validate factual claims.
- Filter offensive content.

## Three implementation patterns

### A. Hard rule
Pure logic; no LLM. Fast and deterministic.

```
if (path.startsWith('/etc/')) reject('blocked: system path');
```

Use for: anything with a clear pattern. Allow-/deny-lists.

### B. Pattern match + LLM
Catch obvious cases with regex; for ambiguous, ask an LLM judge.

```
if (looksLikePromptInjection(input)) reject('possible injection');
const llmVerdict = await classifyInput(input);
if (llmVerdict === 'unsafe') reject('classified unsafe');
```

Use for: cases where context determines whether something's OK.

### C. LLM-only
A guardrail LLM evaluates inputs/outputs.

```
const verdict = await guardrail({ messages: [...], policy: '...' });
if (!verdict.allowed) reject(verdict.reason);
```

Use for: high-context decisions (is this request safe? is this output truthful?).

Cost: an extra LLM call per check. Reserve for high-stakes paths.

## Permissions vs guardrails

In Claude Code, permissions (settings.json) are a kind of guardrail — they block tool calls absolutely. Guardrails are a superset:

- Permissions: allow/deny specific tools.
- Guardrails: allow/deny based on *context* — input shape, output shape, downstream effect.

A permission says "never run `rm`." A guardrail says "block any Bash command containing destructive patterns, even if it's not literally `rm`."

## Designing guardrail policies

For each agent, list:

1. **Forbidden actions.** Things the agent must NEVER do. (Delete prod data; send unbounded emails; transfer above $X.)
2. **Restricted inputs.** Inputs that should be filtered or blocked. (Known injection prompts; PII without consent.)
3. **Restricted outputs.** Outputs that must be filtered or refused. (Specific PII patterns; unbounded URL fetches.)

Each goes through the appropriate guardrail layer.

## What guardrails CAN'T do

- They can't prevent every bad outcome. The LLM is creative; guardrails catch known patterns.
- They can't replace good prompt design. Tell the agent what's expected; guardrails are the safety net.
- They can't catch *novel* prompt-injection attacks until you've seen the pattern.

Guardrails are necessary. They're not sufficient.

## Anti-patterns

- **Guardrails as the only defense.** A weak prompt + strong guardrails is a brittle agent. Build both.
- **Over-aggressive blocking.** Refusing legitimate requests because they vaguely match a forbidden pattern. Tune.
- **Hidden refusals.** Guardrail rejects but the user has no idea why. Always explain.
- **Bypassing in dev.** "I'll turn off the guardrail to debug." It stays off; ships to prod.

## Trade-offs

**Pros**
- Hard floors on agent behavior.
- Catches errors LLM can't / won't catch itself.
- Predictable enforcement.

**Cons**
- False positives (blocking legitimate requests).
- Latency (each check adds time).
- Complexity (more code paths; more failure modes).
- Maintenance (rules rot as patterns change).

**Rule of thumb:** Guardrails should sit at every boundary — input, action, output. Each agent has a specific policy; default to deny when unsure.

## Real-world analogies

- A web app's input validation + auth + output sanitization, all working together.
- A bank: KYC at signup, fraud detection on transactions, AML on outputs.
- An air gap: a hardware-level guardrail.

## Run the demo

```bash
node demo.js
```

The demo applies three layers of guardrails — input filter, action validator, output filter — to an agent. It tries to violate each layer; each is caught with a specific reason.

## Deeper intuition

Reliability topics force you to treat the model as a probabilistic subsystem inside a real product. That means watching cost, latency, drift, guardrails, observability, and human escalation paths with the same seriousness you would bring to any other production dependency.

The best way to study **Guardrails** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?
