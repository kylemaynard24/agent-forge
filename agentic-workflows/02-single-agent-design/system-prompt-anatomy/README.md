# System Prompt Anatomy

**Category:** Single-agent design

## Why anatomy matters

Stage 1 said *prompts are programs*. This topic is the **concrete dissection** of one. We go from "structure your prompt" to "here are the named sections, in order, what each does, what to put in, what to leave out."

Most production system prompts I've seen — and the ones in this repo's `.claude/agents/` and `.claude/commands/` — share roughly the same anatomy. Knowing it lets you:

- Read someone else's prompt in 30 seconds.
- Spot what's missing (e.g., no output format → expect drift).
- Refactor reliably (move a section, don't rewrite the whole thing).
- Compose prompts from reusable blocks across agents.

## The seven sections

The order below is roughly the canonical order. Not every prompt has all seven.

### 1. Role / Identity (always present)

One paragraph stating who the agent is and the user it serves.

```
You are a senior security reviewer. Your purpose is to identify and
report vulnerabilities in code changes before they merge.
```

What it does:
- Anchors persona / tone.
- Sets the *frame* for everything that follows.

What to leave out:
- Marketing copy ("the world's best …").
- Instructions ("you should…"). Those go in section 3.

### 2. Goal / Task (variable; sometimes provided per-run)

What the agent is doing right now. May be in the system prompt for fixed-task agents, or in the user message for general-purpose ones.

```
Goal: review the diff between HEAD and the merge base. Produce a list of issues
ranked by severity. Stop when you've covered every changed file.
```

### 3. Capabilities (often required)

What the agent can do — usually a tool list with descriptions.

```
You have access to:
- read_file(path): read a file's contents
- search_repo(query): grep over the repo
- finish(report): submit a final report
```

In modern APIs, this is generated from your registered tool schemas — you don't write it by hand. But in custom system prompts, you sometimes restate them with extra guidance.

### 4. Operating Rules (always present in production)

The constraints. Both **MUST** and **MUST NOT** rules.

```
You MUST:
- Cite the file:line for every issue you raise.
- Use the search_repo tool before claiming something is unused.

You MUST NOT:
- Edit code. You only review.
- Continue past 20 tool calls without checkpointing.

When unsure: ask one clarifying question and stop.
```

### 5. Output format (often essential)

How the agent should structure its final answer. If you have a structured-output schema, this section can be replaced by the schema itself.

```
Final output must be valid JSON matching this schema:
{
  "issues": [{ "file": str, "line": int, "severity": "low|med|high", "message": str }],
  "files_reviewed": [str],
  "confidence": "low|med|high"
}
```

### 6. Examples (recommended for hard-to-describe behaviors)

One to three exemplars of good output. Critical for tone, voice, format. Not needed when behavior is fully specified by rules + schema.

```
Example output for a clean review:
{ "issues": [], "files_reviewed": ["a.py"], "confidence": "high" }

Example output with one issue:
{ "issues": [{ "file": "x.py", "line": 42, "severity": "med",
  "message": "Use of eval() with user input" }], ... }
```

### 7. Edge cases / Refusals (when stakes are high)

Situations where the default behavior would be wrong. Often safety- or business-rule-related.

```
If the diff contains secrets (API keys, tokens):
  - Do not include the secret value in your report.
  - Mark severity "high" with message "Secret detected; see private channel".

If asked to review your own previous review: refuse with a short note.
```

## A complete (small) example

```
You are a code-review assistant for the agent-forge project.

You have access to:
- Read(path): read a file
- Grep(query): search the repo
- finish(report): submit your review

You MUST cite file:line for every issue you raise.
You MUST NOT edit code.
You MUST stop and ask if the diff contains files you cannot read.

Final output: JSON matching {issues: [...], confidence: "low|med|high"}.

Example clean output: {"issues": [], "confidence": "high"}.
```

That's a complete, productionable system prompt in 11 lines. Most prompts grow from a kernel like this.

## What good anatomy gives you

- **Editability.** Want to change the output format? Edit section 5; everything else is unchanged.
- **Composability.** Want a "security reviewer" and a "perf reviewer"? Share sections 1, 4, 5, 7; vary 2, 3, 6.
- **Reviewability.** A teammate can audit the rules without re-reading the role pitch.
- **Versionability.** Diff section 4 across versions to see how rules evolved.

## Common mistakes

1. **Conflating role and rules.** "You are a careful reviewer who never edits code." The "never edits code" part belongs in section 4. Roles are *who*; rules are *what*.
2. **Mixing the goal into the system prompt for general-purpose agents.** Bake-in goals make a non-reusable agent.
3. **Long examples.** Each example is a token cost on every call. Use one tight example, not three sprawling ones.
4. **Negative-only rules.** "Don't speculate" without "stick to facts in the input" leaves a hole.
5. **Burying an essential rule mid-prompt.** The model attends to ends more reliably than middles. If a rule is non-negotiable, say it early.

## Trade-offs

**Pros of explicit anatomy**
- Predictable behavior; easy to debug.
- Easier reviews and reuse.
- Smooths team handoff.

**Cons**
- Up-front cost. A throwaway prompt doesn't need it.
- Can become rigid; some tasks fit prose better than structure.

**Rule of thumb:** Once a prompt is going into production or being reused, formalize the anatomy. Until then, prose is fine.

## Real-world analogies

- A job description: title (role), goals (what success means), responsibilities (rules), reporting structure (capabilities), examples of good performance (examples), policies (refusals).
- A function definition with a docstring, type signature, body, and examples — the docstring IS the role + examples.

## Run the demo

```bash
node demo.js
```

The demo composes a system prompt from six named blocks, prints the assembled result, and shows how swapping one block (the role) reuses the rest.
