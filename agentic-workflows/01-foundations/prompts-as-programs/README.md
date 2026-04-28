# Prompts as Programs

**Category:** Foundations

## The shift in mindset

A traditional program is **deterministic**. A prompt is **probabilistic**. But the way you write a prompt should look more like the way you write code than like the way you write an essay.

When you write a system prompt for an agent, you are:
- Defining its identity (who am I).
- Defining its rules (what may I do).
- Defining its outputs (what does success look like).
- Bounding its behavior (what should I refuse).
- Documenting its capabilities (what tools, what knowledge).

Treat this artifact like code: structured, reviewed, versioned, tested.

## The anatomy of a strong system prompt

Most production system prompts have these sections (in roughly this order):

```
1. Role / identity
   "You are a senior infrastructure engineer..."

2. Capabilities
   "You have access to the following tools: ..."

3. Operating rules
   "You must: ...
    You must not: ...
    When unsure, ..."

4. Output format / structure
   "Always respond with: ..."

5. Examples (zero/few-shot)
   "Here is what good looks like: ..."

6. Edge cases / refusal triggers
   "If asked to ..., respond with: ..."
```

Not every prompt needs all six. A trivial agent might have just 1–4. A production agent for a high-stakes domain often has all six and runs to several thousand tokens.

## Principles

### 1. Explicit beats implicit
"Be helpful" is implicit. "Always include three citations" is explicit. The model is excellent at obeying explicit instructions; it makes wild interpretations of vague ones.

### 2. Negative instructions need positive replacements
"Don't be verbose" is half a rule. "Respond in fewer than 50 words" is a complete one. Tell the model what to do, not just what to avoid.

### 3. Order matters
Models attend to the start of long contexts more reliably than the middle. Put your *non-negotiable* rules first. Put nice-to-haves later.

### 4. Use structure the model can pattern-match on
Markdown headings, numbered lists, and code fences make a prompt parseable to the model — and to humans reviewing it. A wall of prose is harder to follow.

### 5. Examples > instructions for hard-to-describe behaviors
"Write commit messages like a senior engineer" is hard to instruction-encode. Three example commit messages are concrete and reproducible.

### 6. Test like code
The same prompt against the same input produces *roughly* the same output (with `temperature=0`). Build a small eval set: 10–50 inputs with expected behaviors. Run it before shipping a prompt change. (See `05-reliability-and-ops/evals-for-agents`.)

## Composition: prompts have functions and modules

A real production agent's system prompt is rarely a single string. It's *composed* from pieces:

- A reusable role block (loaded from a library).
- A user-specific section (loaded from their settings).
- A tool-set description (generated from the registered tools).
- Per-task additions (the goal, conditional rules).

This composition is exactly what `.claude/agents/*.md`, `.claude/skills/*.md`, and `.claude/commands/*.md` files in this repo do. They are *modules* in the prompt-as-program sense.

## Anti-patterns

- **The kitchen-sink prompt.** Too many rules; the model can't satisfy them all and silently drops some. Bound your prompt to what's truly essential.
- **The polite preamble.** "Please act as a helpful and professional assistant who…" — wasted tokens. Get to the point.
- **The unrolled inline schema.** "Output JSON like this: ```json ...```" when your tool API supports a structured output schema. Use the right primitive.
- **The "in this case…" mountain.** A series of "if X, do Y" rules that branch wildly. If you have 12 such rules, you have an under-designed *agent*, not a prompt that needs more rules. The rules should fall out of a coherent role.
- **Implicit identity drift.** A prompt that doesn't establish identity firmly. The model's defaults take over and you don't notice until the agent goes off-character.

## Versioning

Treat your prompt like code: check it in, write a commit message when it changes, write a test that verifies the change does what you expected. The most common production-prompt failure is "we changed the prompt and three behaviors regressed silently."

A practical pattern: each prompt has a version number. Each output (in your logs) includes the prompt version that produced it. When something regresses, you know which version to roll back.

## Trade-offs

**Pros of treating prompts as programs**
- Discoverable structure: anyone can read your system prompt and understand the agent.
- Testable: you can detect regressions.
- Composable: a "research agent" prompt can borrow a "writer" subprompt.
- Versioned: rollback works.

**Cons**
- Up-front engineering cost. A throwaway prompt doesn't need this.
- Rigor can fight expressiveness — overly structured prompts can be drier than freer ones.
- The structure itself is a prompt that the model interprets; don't over-engineer to the point that it overwhelms the actual instruction.

**Rule of thumb:** Prototype with prose. Once it works, formalize. Once it ships, version.

## Real-world analogies

- A function definition: name (role), signature (inputs/tools), body (rules), docstring (examples), return type (output format).
- A job description: who, what they do, what they don't do, what success looks like.
- A constitution: a small number of explicit, non-negotiable rules that govern many specific cases.

## Run the demo

```bash
node demo.js
```

The demo composes a system prompt from reusable blocks (role, capabilities, output format) and shows the result alongside a "kitchen sink" anti-example. You can see structure aiding readability — and ramshackle prose hindering it.

## Deeper intuition

Foundations are where you build the core mental model of an agent: what it is, what makes it different from a chatbot or workflow, and which primitives matter before you worry about polish. These topics are worth over-learning because every later design choice depends on them.

The best way to study **Prompts as Programs** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?
