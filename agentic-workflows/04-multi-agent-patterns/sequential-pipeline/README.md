# Sequential Pipeline

**Category:** Multi-agent patterns

## The pattern

A chain of agents (or agent-stages) where each stage's output is the next stage's input. No branching, no feedback loops — just a linear flow.

```
input → [agent A] → [agent B] → [agent C] → output
```

Compare to orchestrator-worker (one orchestrator delegates many parallel workers): a sequential pipeline is one chain, each stage depending on the previous.

## When to use

- The work has *strict ordering*: B can't start until A finishes.
- Each stage requires a different specialization.
- The intermediate artifacts are valuable on their own (you might inspect or branch on them).

Examples:
- **Research agent**: gather → outline → draft → polish.
- **Code review pipeline**: parse → analyze → format report → write summary.
- **Document processor**: ocr → extract structure → fill schema → validate.

## When not to

- Stages are independent (use parallel fan-out instead).
- Stages might re-order based on observations (use ReAct-style basic loop).
- The pipeline is short (1-2 stages) — just write a single agent.

## Sequential pipelines vs single agents

A single agent with the right tools and prompt can often do what a 3-stage pipeline does — and avoids the cost of 3 LLM "personalities" passing artifacts.

The pipeline wins when:

- **Specialization adds value.** A `researcher` agent ≠ a `writer` agent. Different system prompts, different tools, different success criteria.
- **Intermediate artifacts matter.** You want to checkpoint and resume. You want to inspect the outline before writing the draft.
- **Stage swapping** is desired. You can swap "writer" for "translator" without changing the rest.

## Implementing a pipeline

Two approaches:

### A. Each stage is a subagent

The orchestrator runs the pipeline:

```js
const research = await Agent({ subagent_type: 'researcher', prompt: ... });
const outline  = await Agent({ subagent_type: 'outliner',   prompt: research });
const draft    = await Agent({ subagent_type: 'writer',     prompt: outline });
const final    = await Agent({ subagent_type: 'editor',     prompt: draft });
```

Heavyweight; one LLM call per stage. Each agent has its own context, tools.

### B. Each stage is a prompt switch in one agent

A single agent loop where each step has a different system prompt or instruction:

```js
const research = await callLLM({ system: RESEARCHER_PROMPT, user: query });
const outline  = await callLLM({ system: OUTLINER_PROMPT,   user: research });
const draft    = await callLLM({ system: WRITER_PROMPT,     user: outline });
```

Lightweight. No subagent overhead. Less specialization (no per-stage tool restriction).

Pick (A) when stages truly need different tool / context isolation. Pick (B) when stages share context and isolation isn't worth the cost.

## Pipeline tactics

### Pass-through vs transform

Each stage *transforms* its input. Don't pass-through unmodified data; if a stage doesn't need to do anything, drop it.

### Schema between stages

Structure the artifact handed between stages — don't pass raw LLM text. The next stage needs to parse it; structure makes that reliable.

```
research → { sources: [{url, claim}], topic } → outline → { sections: [{title, claims: [...]}] } → ...
```

### Checkpointing

Long pipelines should persist intermediate artifacts. If stage 4 fails, you can resume from stage 3's output rather than rerunning everything.

### Error handling per stage

A failure in stage 2 means you can't run 3 or 4. Decide:
- Fail the pipeline (loud).
- Fall back to a default and continue (silent).
- Re-run stage 2 with a refined prompt (hopeful).

For high-stakes pipelines, fail loud and resume from the last good checkpoint.

## Anti-patterns

- **The pretend-pipeline.** A "pipeline" with one stage. Just an agent.
- **The infinite-iteration pipeline.** Stage N feeds back to stage 1. That's a loop, not a pipeline; design accordingly.
- **The brittle pipeline.** Free-text passed between stages with regex parsing. Stage 4 misinterprets stage 3's output. Use schemas.
- **The pipeline of vague stages.** "Process," "handle," "post-process." Each stage should have a verb name and a clear contract.

## Trade-offs

**Pros**
- Specialization per stage.
- Auditable: you have a record of each stage's output.
- Easy to swap a stage.
- Resume from checkpoints.

**Cons**
- Latency: stages are serial — total time is the sum.
- Cost: one LLM call per stage.
- Brittleness: stage N's failure cascades.

**Rule of thumb:** Sequential pipelines are right when ordering matters AND specialization matters AND intermediate artifacts are valuable. If only one of those is true, you probably want a different pattern.

## Real-world analogies

- An assembly line: each station does one thing; downstream stations depend on upstream.
- A compiler: lex → parse → typecheck → optimize → emit.
- A magazine workflow: research → write → edit → fact-check → publish.

## Run the demo

```bash
node demo.js
```

The demo runs a 3-stage research pipeline: gather → outline → draft. Each stage is a stub LLM with structured I/O.
