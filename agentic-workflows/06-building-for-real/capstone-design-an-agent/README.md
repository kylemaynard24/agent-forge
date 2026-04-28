# Capstone — Design an Agent

**Category:** Building for real (capstone)

## What this is

This is the **integration test** for everything in the dojo. You design and build an agent that uses the patterns from each prior section — and you defend your design choices.

There's no rubric and no grade. The point is: you make decisions, and you can articulate why each one.

## The brief

Pick *one* of these (or invent your own):

### Option A: Personal-finance assistant
The agent helps you track spending, categorize transactions, and answer ad-hoc questions ("how much did I spend on coffee in March?"). It has memory. It runs over time. It can integrate with a CSV bank export.

### Option B: Code-review companion
The agent watches a PR (you give it a diff). It reviews. It can spawn specialist subagents for security, performance, readability. It produces a structured report.

### Option C: Research aggregator
The agent takes a topic. It searches, fetches, summarizes, and produces a structured brief. It follows citations across calls. It saves notes for later use.

### Option D: Issue-triage agent
The agent receives bug reports (from a queue or list). It classifies, deduplicates, prioritizes, and routes. It runs on a schedule. It learns over time which patterns are common.

### Option E: Your own thing
Pick a real problem in your work. Design an agent for it.

## The deliverables

For your chosen agent, produce:

### 1. Design document (3-5 pages)

Section by section:

- **Goal.** What does the agent do? Whose problem does it solve?
- **Architecture.** Diagram the components. Where does each live?
- **Tools.** List each tool. Show its name, schema, error contract.
- **System prompt.** Show the prompt, organized into the 7-section anatomy.
- **Memory model.** What's persistent? What's session-only? What schema?
- **Multi-agent shape.** Single agent? Orchestrator + workers? Why?
- **Failure modes.** What can go wrong? How do you detect / prevent?
- **Observability.** What's logged / measured / traced?
- **Cost model.** Estimated tokens / dollars per run.
- **Autonomy level.** Starting level; promotion criteria.
- **Eval suite.** What 5-10 fixtures do you test?

### 2. Implementation

Working code. Doesn't need to be production-grade. *Does* need to:
- Be runnable.
- Implement the design as written.
- Have at least one test you trust.
- Demonstrate at least 4 of the dojo's patterns/principles.

### 3. Retrospective (1-2 pages)

After building:
- What surprised you?
- What pattern was harder than expected?
- What would you do differently?
- One thing you'd cut from the dojo as not useful for *this* project.
- One thing you'd add.

## What we're testing

This isn't testing whether your agent works — that's the easy part. It's testing whether you can:

- **Decompose a problem into agentic shape.** What's the loop? What are the tools? What persists?
- **Pick the right pattern.** Single-agent or multi-agent? Plan-then-act or basic ReAct? Memory or stateless?
- **Reason about trade-offs.** "I picked X because Y; the alternative was Z, which costs W."
- **Anticipate failure.** What happens when the LLM hallucinates? When the network fails? When the user changes their mind?
- **Build operationally.** Observability, cost control, evals — all part of the design from day one.

## Grading yourself

Reasonable signals you've done well:

- You can defend every design choice in a 5-minute conversation.
- The architecture diagram is clean and someone else could implement from it.
- Failure modes are *enumerated*, not "we'll figure it out."
- The agent works. Not perfectly — but reliably enough that you trust it on a real input.
- You have at least one test that catches a regression.

Reasonable signals you haven't:

- The design relies on "and the LLM will figure it out."
- Failure modes are vague.
- No observability.
- Tools are vaguely-named or super-tool-shaped.
- "We'll add evals later."

## Real-world analogies

- A capstone project in an engineering program. The skills are individually small; the integration is the test.
- A senior engineer designing a new service: they don't write the code first, they design.

## Run the demo

```bash
node demo.js
```

The "demo" for this topic is a *design template* — a skeleton design document you can fill in for your chosen project.

## Deeper intuition

Building-for-real topics turn agent demos into systems that can survive repeated use. The key shift is from 'can the model do this once?' to 'can the whole surrounding system make this dependable, testable, evolvable, and operationally sane?'

The best way to study **Capstone — Design an Agent** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?

## Scenario questions

These questions are here to make **Capstone — Design an Agent** feel like an agent-design decision instead of a vocabulary word. The useful question is not just "what is it?" but "what failure, control problem, or reliability concern does it help me handle?"

### Scenario 1 — "An agent works in the toy demo but becomes unreliable in repeated real use"

**Question:** Should this topic become one of the first concepts you examine?

**Answer:** Usually yes.

**Explanation:** In agent systems, the interesting problems often appear at runtime: drift, ambiguity, bad tool choices, unsafe actions, missing visibility, or loops that degrade over time. This topic matters when it helps make the agent more legible, more bounded, or more dependable across repeated runs.

**Why not jump straight to Prompt Versioning and Regression Tests or Tool API Design:** those may also be relevant, but this topic is the better starting point when the main issue is the specific control surface it provides in agent behavior.

### Scenario 2 — "A design sounds sophisticated, but nobody can explain what risk it is reducing"

**Question:** Is that a warning sign that the team may be using **Capstone — Design an Agent** as ceremony rather than engineering?

**Answer:** Yes.

**Explanation:** Good agent design concepts earn their keep by reducing a concrete category of failure, cost, or uncertainty. If no one can say what risk this topic is reducing, the design may be adding complexity without adding much control.

**Why not keep the mechanism anyway:** because in agent systems, every extra moving part becomes another place for confusion, latency, or maintenance burden to accumulate.
