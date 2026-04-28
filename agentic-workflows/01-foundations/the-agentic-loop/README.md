# The Agentic Loop

**Category:** Foundations

## The four-stage loop

Every agent run, no matter how sophisticated, can be reduced to this:

```
┌──────────┐     ┌────────┐     ┌─────┐     ┌─────────┐
│ Perceive │ ──▶ │ Think  │ ──▶ │ Act │ ──▶ │ Observe │ ──▶ (back to Perceive)
└──────────┘     └────────┘     └─────┘     └─────────┘
```

- **Perceive** — assemble the prompt: goal + history + last observation + system instructions.
- **Think** — the LLM reads the prompt and emits either a tool call or a final answer.
- **Act** — execute the tool call. (Or, if final answer, exit.)
- **Observe** — capture the tool's output and prepare it for the next iteration.

The loop runs until either the LLM emits a "done" signal or you hit a budget (steps, tokens, cost, time).

## The phases in detail

### Perceive
This is the *prompt assembly* step. You concatenate (or template) several sources:
- The system prompt (who the agent is, how it should behave).
- The goal (what the user asked).
- The history (prior turns: agent's tool calls, observations).
- The available tools (their schemas).
- Any additional context (memory, retrieved docs).

**This is where most engineering effort lives in production agents.** What you put in (and crucially, what you leave out) determines the agent's behavior more than any other knob.

### Think
The LLM call. Inputs: the assembled prompt + tool schemas. Output: either a structured tool call or a final response.

Modern APIs (Anthropic, OpenAI, etc.) support **tool use** as a first-class output format — the model emits structured JSON for `tool_calls` rather than free-text-and-parse. Use that. Parsing free text is a tax you pay for not using the right primitive.

### Act
Tool dispatch. Look up the tool by name, validate arguments against its schema, execute, capture result. Three things to handle:
- **Unknown tool** — the LLM hallucinated. Return an error observation; don't crash.
- **Bad arguments** — schema mismatch. Same: error observation back to the loop.
- **Tool error** — the tool ran but failed (file not found, API timeout). Surface the error to the LLM as an observation; let it decide whether to retry or give up.

### Observe
Format the tool's output back into the conversation. Keep it terse — long outputs eat context. Truncate when you can. Add metadata when useful ("file size: 2.3MB, showing first 100 lines").

## Termination — the most-overlooked piece

A loop that doesn't terminate is not an agent; it's an outage. Every agent loop must have:

1. **A "done" signal from the LLM** — usually a special tool (`finish`, `submit_answer`) or a no-tool-call response.
2. **A hard cap on steps** — `for (step < MAX_STEPS)`. Common values: 10, 25, 50.
3. **A budget cap** — tokens, dollars, wall-clock time. Whichever you can measure.
4. **A "stuck" detector** — if the agent calls the same tool with the same arguments twice in a row, it's looping; force-exit.

Termination is where the agentic-engineering rubber meets the road. Plenty of demos work fine; they fail in production because nobody asked "what if it doesn't finish?"

## ReAct: the pattern that started it all

The seminal "agentic loop" formulation is **ReAct** (Yao et al., 2022): the LLM emits both a *thought* and an *action*, and only the action is executed. The thought is preserved in the history, helping the LLM reason about what it's doing.

Modern frameworks (Anthropic tool use, OpenAI function calling, LangChain agents) all descend from ReAct. They differ in syntax, not concept.

```
Thought: I need to check what's in the file first.
Action: read_file({path: "todo.txt"})
Observation: "buy milk\nwrite syllabus..."
Thought: There are 3 lines. I'll report that.
Action: finish({answer: "3 lines"})
```

You don't have to parse free text — modern APIs do this with structured fields. But the *shape* is ReAct.

## Variations

The basic four-stage loop has many variants:

- **Plan-then-act** — first call generates a plan; subsequent calls execute steps. Reduces wasted exploration; introduces planning brittleness.
- **Multi-tool single-call** — model emits multiple tool calls in one turn; runtime executes them in parallel. Faster; harder to chain.
- **Reflection / self-critique** — periodically the model is prompted to review its work and decide whether to continue or revise.
- **Tree search** — the loop branches; multiple potential next-actions explored in parallel; best path picked. Expensive but powerful for hard problems.

You'll meet these in later sections. For now, master the simple loop.

## Trade-offs

**Pros**
- Highly general — same loop solves wildly different problems given different tools and prompts.
- Adaptive — the agent recovers from errors at runtime by observing and replanning.
- Easy to extend — adding a new tool is usually a one-line change.

**Cons**
- Latency — each LLM call adds seconds; loops of 20+ steps are slow.
- Cost — N LLM calls per task. Easy to spend $$$ in a hurry.
- Non-determinism — two runs of the same task can take different paths, even with `temperature=0` (tool-result variance).
- Failure modes are subtle — wrong tool calls, infinite loops, off-task drift, hallucinated arguments.

**Rule of thumb:** Use the loop when the path through the problem genuinely varies based on what's observed. If the path is fixed, write a pipeline; you don't need an agent.

## Real-world analogies

- A detective on a case: question witness (tool), get answer (observation), think about it, ask the next witness. Stops when the case closes or runs out of leads.
- A cook tasting as they cook: stir, taste, adjust, taste, plate. Each "taste" is an observation that informs the next action.
- A thermostat is **not** an example. It's a control loop with no decision space.

## Run the demo

```bash
node demo.js
```

The demo runs a single agent with explicit logging for each phase (PERCEIVE, THINK, ACT, OBSERVE, DECIDE-CONTINUE). Watch the prompt grow each iteration. See exactly when termination triggers.

## Deeper intuition

Foundations are where you build the core mental model of an agent: what it is, what makes it different from a chatbot or workflow, and which primitives matter before you worry about polish. These topics are worth over-learning because every later design choice depends on them.

The best way to study **The Agentic Loop** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?

## Scenario questions

These questions are here to make **The Agentic Loop** feel like an agent-design decision instead of a vocabulary word. The useful question is not just "what is it?" but "what failure, control problem, or reliability concern does it help me handle?"

### Scenario 1 — "An agent works in the toy demo but becomes unreliable in repeated real use"

**Question:** Should this topic become one of the first concepts you examine?

**Answer:** Usually yes.

**Explanation:** In agent systems, the interesting problems often appear at runtime: drift, ambiguity, bad tool choices, unsafe actions, missing visibility, or loops that degrade over time. This topic matters when it helps make the agent more legible, more bounded, or more dependable across repeated runs.

**Why not jump straight to Tools as the World Interface or What Is An Agent:** those may also be relevant, but this topic is the better starting point when the main issue is the specific control surface it provides in agent behavior.

### Scenario 2 — "A design sounds sophisticated, but nobody can explain what risk it is reducing"

**Question:** Is that a warning sign that the team may be using **The Agentic Loop** as ceremony rather than engineering?

**Answer:** Yes.

**Explanation:** Good agent design concepts earn their keep by reducing a concrete category of failure, cost, or uncertainty. If no one can say what risk this topic is reducing, the design may be adding complexity without adding much control.

**Why not keep the mechanism anyway:** because in agent systems, every extra moving part becomes another place for confusion, latency, or maintenance burden to accumulate.
