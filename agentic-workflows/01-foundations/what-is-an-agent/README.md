# What is an agent?

**Category:** Foundations

## The one-sentence definition

An **agent** is an LLM put inside a loop, given **tools** to act on the world, and pointed at a **goal**. It decides its next move at each step, takes the action, observes the result, and decides again — until the goal is reached or it gives up.

## Agent vs chatbot vs workflow

These get conflated. They are not the same.

| Shape | Trigger | Steps | Decisions per run | Example |
|---|---|---|---|---|
| **Chatbot** | User message | 1 (LLM call) | 0 — model just answers | Customer support FAQ bot |
| **Workflow** | Anything | N (predefined) | 0 — pipeline is fixed | Cron job: extract → transform → load |
| **Agent** | Goal | N (variable) | N — model picks each step | Claude Code, Cursor agent mode |

The defining difference is **who decides what to do next**. In a chatbot, the user does. In a workflow, the developer did (at design time). In an agent, the LLM does — at runtime, every step.

## The minimal anatomy

Every agent has at least four pieces:

1. **An LLM** — the decision-maker. Reads context, returns either an action or a final answer.
2. **A tool set** — concrete capabilities (read a file, run a command, query a DB, send an email). Without tools, an agent is just a chatbot.
3. **A loop** — a runtime that asks the LLM "what now?", executes the chosen action, feeds the result back, and asks again.
4. **A goal** (or task) — the user's intent, supplied as a prompt or task definition.

Optional but common:
- **Memory** — persistent state across runs (a notes file, a vector DB, a key-value store).
- **Subagents** — agents that themselves call agents. Fractal.
- **A planner** — a separate step that produces a plan before the loop starts.

## Why agents work (and why they fail)

They work because LLMs are surprisingly good at *picking the next reasonable action* given a clear goal and a small toolbox. A human-written workflow has to anticipate every branch; an agent figures the branch out at runtime.

They fail when:
- The goal is ambiguous and the LLM commits early to the wrong interpretation.
- The tool set is too rich (paralysis) or too sparse (impossibility).
- The loop has no termination condition and runs forever.
- The context window fills with irrelevant history and signal-to-noise crashes.
- The agent hallucinates a tool that doesn't exist, or arguments that don't fit a real one.

These failure modes are not bugs you can patch. They are inherent to the architecture — and managing them is most of what advanced agentic engineering is about. We'll spend Stage 5 on this.

## When to reach for an agent

Use one when **all** of these are true:
- The task can't be reduced to a single LLM call.
- The path to the answer involves real-world interaction (files, APIs, code).
- The branching is data-dependent (you can't pre-write the workflow).
- A non-LLM solution would be a heuristic mess.

Don't reach for one when:
- A deterministic script handles it cleanly. (You're paying tokens for nothing.)
- One LLM call is enough. (No loop = no agent. Just a function call.)
- The cost or latency of a loop is unacceptable for the use case.
- Hallucination would be catastrophic and you can't bound the actions. (Don't give an agent `rm -rf` access.)

## The autonomy gradient

Agents aren't a binary. They live on a spectrum:

| Level | Description | Example |
|---|---|---|
| 0 | LLM produces text. Human acts. | ChatGPT-style copilot |
| 1 | LLM picks tool calls. Human approves each. | Claude Code in default permission mode |
| 2 | LLM acts within a sandbox. Human reviews after. | Claude Code with auto-approved tools |
| 3 | LLM acts in production with guardrails. Human reviews periodically. | A scheduled report-generation agent |
| 4 | LLM acts autonomously. Human reviews aggregates. | Self-healing infra agents (still rare) |

**Rule of thumb:** Start at the lowest level that does the job. Move up only when the cost of a human-in-the-loop is higher than the risk of giving the agent more rope.

## Real-world analogies

- A junior engineer with a task tracker and access to your repo: they pick what to do next, ask for help when stuck, and tell you when they're done. That's an agent. The "tools" are the IDE, git, the database. The "loop" is their workday.
- A self-driving car: sensors (perceive), planner (think), actuators (act), feedback (observe). Same loop, different domain.
- A thermostat is **not** an agent. It's a control loop with no decision space — its "policy" is a fixed function of temperature. An agent has a policy that's *learned* (or in our case, *prompted*) and operates over a rich, open-ended action space.

## Run the demo

```bash
node demo.js
```

The demo implements a minimal agent — 60 lines, no API key required. The "LLM" is a stub that returns canned next-actions; the loop, tool dispatch, and observation flow are real. You can read every line and see exactly where each piece fits.

## What you should walk away with

- The four pieces (LLM + tools + loop + goal) and why each is needed.
- The difference between an agent, a workflow, and a chatbot — phrased so you can correct the next person who confuses them.
- A cautious read on agent hype: agents are a powerful pattern, not a default architecture.
- A vocabulary for the rest of this curriculum: when you hear "tool," "loop," "context," "goal," they should mean specific things to you.

## Deeper intuition

Foundations are where you build the core mental model of an agent: what it is, what makes it different from a chatbot or workflow, and which primitives matter before you worry about polish. These topics are worth over-learning because every later design choice depends on them.

The best way to study **What is an agent?** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?

## Scenario questions

These questions are here to make **What is an agent?** feel like an agent-design decision instead of a vocabulary word. The useful question is not just "what is it?" but "what failure, control problem, or reliability concern does it help me handle?"

### Scenario 1 — "An agent works in the toy demo but becomes unreliable in repeated real use"

**Question:** Should this topic become one of the first concepts you examine?

**Answer:** Usually yes.

**Explanation:** In agent systems, the interesting problems often appear at runtime: drift, ambiguity, bad tool choices, unsafe actions, missing visibility, or loops that degrade over time. This topic matters when it helps make the agent more legible, more bounded, or more dependable across repeated runs.

**Why not jump straight to Tools as the World Interface or Context as Working Memory:** those may also be relevant, but this topic is the better starting point when the main issue is the specific control surface it provides in agent behavior.

### Scenario 2 — "A design sounds sophisticated, but nobody can explain what risk it is reducing"

**Question:** Is that a warning sign that the team may be using **What is an agent?** as ceremony rather than engineering?

**Answer:** Yes.

**Explanation:** Good agent design concepts earn their keep by reducing a concrete category of failure, cost, or uncertainty. If no one can say what risk this topic is reducing, the design may be adding complexity without adding much control.

**Why not keep the mechanism anyway:** because in agent systems, every extra moving part becomes another place for confusion, latency, or maintenance burden to accumulate.

### Scenario 3 — "You're asked to build an agent to answer customer FAQ questions"

**Question:** Should you reach for the agent pattern here?

**Answer:** No — not unless the answers require real-world lookups that can't be pre-fetched.

**Explanation:** FAQ answering is a single LLM call: take the question, retrieve relevant context (RAG), generate an answer. There is no branching, no data-dependent path selection, no world-state that needs updating mid-task. Adding a loop would add latency and cost with no benefit. The test is whether the task requires the model to act on feedback between steps. If the answer is "no," a workflow or a single prompt is almost always the right shape.

**Why not build an agent anyway "for flexibility":** because agents are not free. Every step is a round-trip LLM call. An FAQ agent that reliably completes in one step but incurs three-step overhead 40% of the time due to unnecessary tool calls is measurably worse than a simple prompt-and-retrieve pipeline.

### Scenario 4 — "An agent that sends Slack notifications is accidentally spamming channels"

**Question:** What design failure does this most likely indicate?

**Answer:** A write tool without an approval gate or idempotency guard.

**Explanation:** `send_slack_message` is a side-effect tool with non-trivial blast radius. If the agent gets stuck (ambiguous goal, bad observation, missing context) and retries, it sends again. Unlike `read_file`, calling it twice does something twice. The fix is not to add retry logic or error handling — it is to recognize that any tool which changes the state of an external system needs either an explicit approval step before dispatch, or an idempotency mechanism (e.g., a deduplication key derived from the task ID) that makes repeated calls safe.

**Why not just catch the error after the fact:** because the blast radius of a spammed Slack channel is usually low, but the same design flaw applied to `send_email_to_all_customers` or `deploy_to_production` is not recoverable after the fact.

### Scenario 5 — "The agent is failing consistently on step 3 of a 5-step task, always with a 'file not found' error"

**Question:** Is this a bug in the tool, the LLM's reasoning, or the tool set?

**Answer:** Probably the tool set — the agent is likely guessing at a path it cannot know without a directory-listing capability.

**Explanation:** When an agent fails repeatedly at the same step with the same category of error, that is the stuck-loop failure mode. The model is not broken — it is making locally reasonable guesses without the information it needs to make a correct one. Before debugging the tool implementation or the prompt, ask: does the agent have a tool that would give it the observation needed to proceed? In this case, `list_directory` would let it see the actual filename rather than guessing. Stuck-loop analysis is often the fastest path to discovering what is missing from the tool set.

**Why not just add a better error message to the tool:** because a better error message helps only if the model has a tool to act on that information. "File not found — did you mean config.yml?" is useful only if the model can then try that path. Improving observation quality is necessary but not sufficient; the tool set must cover the action space the model needs.

### Scenario 6 — "An agent works correctly in testing but your team is nervous about deploying it to production because it has access to a deletion API"

**Question:** Is the right response to remove the deletion tool, or to add an approval gate?

**Answer:** Neither alone — classify the blast radius first, then decide.

**Explanation:** Removing the tool solves the safety concern but may break the task if deletion is genuinely required. An approval gate on every deletion call solves the safety concern but may make the agent impractical if deletions are frequent and low-risk. The right answer is to classify: is this tool deleting recoverable things (soft-delete, trash bin, staging data) or unrecoverable things (production records, deployed resources)? Low-blast-radius deletions can often be auto-approved after initial validation. High-blast-radius deletions warrant an approval gate, an audit log, or both. The autonomy gradient is a per-tool decision, not a single dial set at deployment time.

**Why not just run the agent in a sandbox:** sandboxes are a valid layer, but they do not replace blast-radius reasoning — they just change what "blast radius" means. A sandbox that mirrors production data still has real consequences if the mirroring pipeline runs live.

### Scenario 7 — "A junior engineer on your team proposes replacing your ETL pipeline with an agent"

**Question:** What questions should you ask before agreeing?

**Answer:** Is the branching data-dependent? Does each step need to observe the output of the previous step before proceeding? Can a deterministic script handle it instead?

**Explanation:** ETL pipelines are usually workflows: the shape of the transformation is known at design time, and the steps are fixed regardless of what the data contains. An agent adds cost, latency, and non-determinism without adding value if the processing logic can be expressed as a function. The only time you should reach for an agent over a workflow in ETL is when the transformation decisions genuinely depend on intermediate data that can't be anticipated — for instance, when the schema of the source changes in ways that require the model to decide how to re-map fields on the fly. Even then, consider a hybrid: a deterministic pipeline with a single LLM call at the decision point, rather than a full agent loop.

**Why not use an agent anyway given how capable LLMs are:** because capability is not the same as appropriateness. An LLM can certainly transform data — but every call introduces latency, potential hallucination, and cost that a `map`/`filter`/`join` operation does not. Use deterministic code where the logic is deterministic.

> Generated by `/deep-dive` skill. Original content above is unchanged. To go further, run `/deep-dive` again with a different focus.
>
> **Other angles considered but not covered today**: multi-agent orchestration patterns, agent memory architectures (episodic vs semantic vs procedural), prompt engineering for reliable tool selection.

### What running demo.js actually looks like

Before extending any of these ideas, it helps to have the ground truth. Run `node demo.js` and you get:

```
--- step 1 ---
agent decides: read_file({"path":"todo.txt"})
observation: "buy milk\nwrite syllabus\ncommit dojo"

--- step 2 ---
agent decides: count_lines({"text":"buy milk\nwrite syllabus\ncommit dojo"})
observation: 3

--- step 3 ---
agent decides: finish({"answer":"There are 3 lines in todo.txt."})

=== agent finished ===
final answer: There are 3 lines in todo.txt.
```

Read this trace against the loop code (lines 40–73) and the sequence becomes concrete. Step 1: history contains only the goal; `stubLLM` returns `read_file`; the tool runs; `lastObservation` becomes the file content string. Step 2: the file content is appended to history as a `tool` message; `__USE_LAST_OBSERVATION__` is resolved to that string before `count_lines` is called; `lastObservation` becomes `3`. Step 3: the number `3` is substituted into the `finish` answer template; `finish` returns `{ done: true, answer: "..." }`; the loop detects `done` and exits.

Three steps, three round-trips if this were a real LLM. No step knows what the previous step will produce — each observation is handed forward. This is the loop in miniature.

### Tool schemas: from plain functions to real API contracts

In `demo.js`, tools are just JavaScript functions. The loop dispatches them by name, calls them with whatever args the stub returned, and that's it. This works because the stub already knows the exact argument shapes — it was hardcoded that way.

A real LLM doesn't have that luxury. It needs to know, before producing a tool call, what tools exist and what arguments each one accepts. That contract is expressed as a JSON Schema definition and is passed to the model in the API request alongside the messages. Here is what the three tools from demo.js would look like as real definitions:

```json
[
  {
    "name": "read_file",
    "description": "Read the contents of a file. Returns the file text, or an error string if the file does not exist.",
    "input_schema": {
      "type": "object",
      "properties": {
        "path": { "type": "string", "description": "The file path to read, e.g. 'todo.txt'" }
      },
      "required": ["path"]
    }
  },
  {
    "name": "count_lines",
    "description": "Count the number of newline-separated lines in a string.",
    "input_schema": {
      "type": "object",
      "properties": {
        "text": { "type": "string", "description": "The text to count lines in." }
      },
      "required": ["text"]
    }
  },
  {
    "name": "finish",
    "description": "Signal that the task is complete and return the final answer to the user.",
    "input_schema": {
      "type": "object",
      "properties": {
        "answer": { "type": "string", "description": "The final answer to return." }
      },
      "required": ["answer"]
    }
  }
]
```

The `description` field is not decoration — it is the primary signal the LLM uses to decide *which* tool to call. A vague description leads to miscalls. A precise description with edge-case behavior spelled out (like "returns an error string if the file does not exist") lets the model reason about what to do with the observation before it even arrives. The `input_schema` gives the model argument names and types; when the LLM produces a tool call, its output is structured JSON — `{ "name": "read_file", "input": { "path": "todo.txt" } }` — which the loop deserializes and dispatches. Schema constraints are your first line of defense against malformed tool calls.

### Swapping stubLLM for a real Claude API call

The stub's job is to return `{ tool, args }`. A real LLM call does the same thing, just through the API. Here is the minimal bridge:

```js
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic();

async function callLLM(history, toolDefinitions) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'You are a helpful agent. Use the available tools to accomplish the goal. Call `finish` when you have a complete answer.',
    tools: toolDefinitions,
    messages: history,
  });

  const toolUse = response.content.find(b => b.type === 'tool_use');
  if (toolUse) return { tool: toolUse.name, args: toolUse.input };

  const text = response.content.find(b => b.type === 'text');
  return { tool: 'finish', args: { answer: text?.text ?? '' } };
}
```

Three things change from the stub: the function is now async (every LLM call is a network round-trip), the history format must use Claude's message schema with `tool_result` blocks for observations, and tool definitions are passed as a first-class argument. The loop structure is unchanged — you await the call and adjust the history format. The system prompt is doing real work here: it tells the model what persona to adopt, what the termination condition is, and any behavioral constraints. An empty system prompt produces an agent that doesn't reliably know when or why to stop.

### How history grows — and why that matters

After three steps, the `history` array contains:

```js
[
  { role: 'user',      content: 'Tell me how many lines are in todo.txt.' },
  { role: 'assistant', content: '{"tool":"read_file","args":{"path":"todo.txt"}}' },
  { role: 'tool',      content: 'buy milk\nwrite syllabus\ncommit dojo' },
  { role: 'assistant', content: '{"tool":"count_lines","args":{"text":"..."}}' },
  { role: 'tool',      content: '3' },
]
```

Five messages for three steps. At step N, history has at minimum `2N - 1` messages. In a real LLM call, every message in `history` is re-sent with every request — the model has no persistent state between calls. This is the mechanism behind "context window fills": each step appends both the action taken and the observation received to a payload that grows unboundedly and is sent in full on the next call.

The implication is not just about token limits. As history grows, older observations get further from the model's attention, signal-to-noise degrades, and the model may start contradicting earlier reasoning or ignoring earlier tool results. The practical ceiling for a naive agent is roughly 10–20 steps before history management becomes necessary. Strategies include summarizing old tool results before they push off the context edge, removing observations once they have been "consumed" by a subsequent reasoning step, and periodically compressing the history into a structured scratchpad the model maintains explicitly.

### Latency, cost, and when the loop is worth it

Each step of the demo, against a real API, is one full LLM inference call — potentially 500ms–2s of network latency plus the cost of input and output tokens. A three-step agent calling Claude Sonnet costs on the order of fractions of a cent per run. That sounds trivial until you are running it thousands of times a day, or until each step's history is large enough to push into high-token-count pricing territory.

The key question before building an agent: **can this task be solved in a single LLM call?** If yes, skip the loop. A single call with a well-crafted prompt is 3–10x cheaper and faster than a multi-step agent producing the same result. The loop overhead is only worth paying when the task genuinely requires real-world feedback between reasoning steps — when you need to read a file before you can count its lines, or run a query before you can summarize the result, or observe an API response before deciding which endpoint to call next.

A useful heuristic: if you reach for an agent because you want the LLM to "think more," consider extended thinking within a single call first. Reserve the loop for tasks where intermediate actions produce observations the model cannot fabricate or reason about without actually seeing.

### Tool idempotency and blast radius

The three tools in demo.js are all safe: `read_file` reads, `count_lines` computes, `finish` signals. None changes the state of the world. This is not an accident — it reflects a design principle worth internalizing early.

Tools fall into two categories. **Read tools** (read, search, query, list) are idempotent: calling them twice produces the same result and leaves the world unchanged. They can be retried freely if the agent gets confused. **Write tools** (create, delete, send, post, deploy) have side effects: calling them twice does something twice. An agent that gets stuck and calls `send_email` three times has sent three emails.

Blast radius is a rough measure of how bad the worst-case outcome is if the agent calls a tool at the wrong moment. `read_file` has near-zero blast radius. `delete_database_table` has very high blast radius. A well-designed agent tool set keeps the write-tool surface minimal, makes write tools idempotent where possible (upserts instead of inserts, checking existence before creating), and pairs any high-blast-radius tool with an approval gate (see below). A common mistake is giving an agent an entire SDK as its toolset, where every method becomes a callable action. Narrow the surface deliberately — the right set of tools is usually smaller than it first appears.

### Observation format as signal quality

What the agent knows at each step is exactly what is stored in `lastObservation`. In demo.js that is a string or a number. In a real agent, tool results are richer, and how you format them determines how well the model reasons about the next step.

Compare two ways to return a database error:

```
// Raw string
"Error: relation 'users' does not exist\nLINE 1: SELECT * FROM users\n                     ^"

// Structured JSON
{ "error": true, "code": "42P01", "message": "relation 'users' does not exist", "table": "users", "hint": "Did you mean 'user_accounts'?" }
```

Both contain the same information. The structured version lets the model extract the table name, match it against a known-correct list, and self-correct in the next step. The raw postgres error is recoverable by a human reading it — it is much harder for a model to parse reliably because its format varies by query and postgres version.

The general rule: return machine-parseable observations when the model needs to extract a specific field, and natural-language observations when the model needs to summarize or judge. A search result is often better returned as `[{ title, url, snippet }]` than as an HTML blob. An LLM-generated document summary is better returned as plain prose than wrapped in JSON, because the model will read it as prose anyway. Observation format is a first-order lever on agent reliability that most introductory material treats as an afterthought.

### The stuck-loop failure mode

The `maxSteps` guard prevents infinite loops, but it does not explain why agents get stuck. The most common cause is a failed observation that the model treats as recoverable — it retries the same tool with slightly different arguments, gets another error, and loops until the step limit is hit.

Consider an agent tasked with finding a configuration file. It calls `read_file("config.yaml")` → `ENOENT`. It tries `read_file("config.yml")` → `ENOENT`. It tries `read_file("./config/config.yaml")`. Each attempt is plausible given the previous failure — the model is not malfunctioning. But if it lacks a `list_directory` tool, it is guessing blindly, and without new information, it will exhaust `maxSteps` on path variations.

Two practical detection strategies. First, track repetition: if the same tool is called with equivalent arguments more than once, terminate early with an explicit signal such as `"stuck: repeated tool call without new information"`. Second, require progress: define what "making progress" means for your task and terminate if it stalls across N consecutive steps. Both can be implemented in the loop itself without touching the LLM or tools.

The deeper fix is tool set analysis. Stuck-loop post-mortems almost always reveal a missing tool — a capability the model reached for that wasn't there. Stuck-loop frequency in logs is one of the fastest signals that your tool set is incomplete.

### Human-in-the-loop as a first-class pattern

The autonomy gradient in the README reads as a spectrum you choose once at design time. In practice, you can mix levels within a single agent run — inserting human approval selectively based on the blast radius of each specific action.

The mechanical insertion point is between **decide** and **act** in the loop, after the model returns an action and before the tool is dispatched:

```js
// After:  const action = callLLM(history, tools);
// Before: const observation = fn(action.args);

if (requiresApproval(action.tool)) {
  const approved = await askUser(
    `Agent wants to: ${action.tool}(${JSON.stringify(action.args)})\nAllow? [y/n] `
  );
  if (!approved) {
    lastObservation = 'user denied this action — reconsider your approach';
    history.push({ role: 'tool', content: lastObservation });
    continue;
  }
}
```

`requiresApproval` is just a function that checks whether `action.tool` is on a high-blast-radius list. Read tools pass through automatically. Write tools trigger a prompt. If the user denies, the denial is fed back as an observation and the model gets to reason about an alternative. If the user approves, the action proceeds transparently.

This pattern means you do not have to decide at design time how autonomous an agent will be. Start with approval on every write tool and remove approvals progressively as you develop confidence in specific tool calls. Claude Code itself works this way: some tools are auto-approved based on your settings, others prompt every time. The autonomy gradient is not a single dial — it is a per-tool permission list that evolves as the system matures.

### Where to read further

- **Anthropic tool use documentation** (`docs.anthropic.com/en/docs/tool-use`) — the canonical reference for the exact message format, tool definition schema, and `tool_result` block structure. Start here when making the stub-to-real transition.
- *Building LLM Applications for Production* (Chip Huyen, 2023, `huyenchip.com`) — covers latency budgets and cost modeling for LLM-in-the-loop systems with concrete numbers, not estimates.
- **ReAct: Synergizing Reasoning and Acting in Language Models** (Yao et al., 2022, arXiv:2210.03629) — the paper that formalized the perceive-decide-act-observe loop. Reading the original framing clarifies why observation format and history management matter structurally.
- *Designing Data-Intensive Applications* (Kleppmann, 2017), Chapter 7 — not about agents, but the treatment of idempotency, exactly-once semantics, and side-effect management is the clearest available foundation for thinking about tool blast radius and retry safety.
