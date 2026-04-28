# Hand-Off vs Delegation

**Category:** Multi-agent patterns

## Two ways agents can pass work

When agent A needs agent B's help, there are fundamentally two patterns:

### Delegation (synchronous, returning)
A spawns B as a subagent. B does its part. B *returns to A*. A continues.

```
A ──spawn──▶ B
A ◀──result── B
A continues.
```

### Hand-off (transferring control)
A *transfers the conversation* to B. B continues from there. A doesn't get control back unless B explicitly hands back.

```
A ──hand-off──▶ B
B continues with the user / task.
A is done.
```

These look similar but have very different design implications.

## When to delegate

- You want the result back; you're in charge.
- The subtask is bounded and returnable.
- You'll synthesize after.

This is the default agent-spawning pattern in Claude Code (the `Agent` tool delegates).

## When to hand off

- The user's needs have shifted to a new domain (e.g., from "research" to "implementation").
- The receiving agent has significantly different tools / personality / context.
- Returning would be artificial — A has no reason to come back.

Examples:
- A "router" agent that classifies the user's request and hands off to a specialist.
- A research agent that finishes its job and hands off to a writer agent for drafting.
- A triage agent that hands off urgent tickets to an on-call human.

## Delegation in Claude Code

The `Agent` tool: spawns a subagent, awaits its result, returns to the caller.

```js
const result = await Agent({ subagent_type: 'security-reviewer', prompt: '...' });
// I'm back in control with `result`.
```

## Hand-off — typically not a built-in pattern

Most agent harnesses don't have a first-class "hand-off" primitive. You implement it as:

- A "router" agent whose final action is to invoke a specialist agent and END (not synthesizing the result; the specialist's response is the user's final answer).
- Multi-agent frameworks (e.g., OpenAI's swarm-style patterns, AutoGen, LangGraph) often expose hand-off explicitly.

In Claude Code's model, the closest equivalent is delegation where the orchestrator simply returns the subagent's result verbatim — but the orchestrator is still nominally in charge.

## The deceptive third pattern: chained delegation

Sometimes people set up: A → B → C → A. A delegates to B; B delegates to C; C returns to B; B returns to A.

This is just nested delegation. It's not a hand-off; it's a tree.

## Anti-patterns

- **Hand-off when you should delegate.** A delegates to B, then "wraps up" — but A's role was synthesis. Nothing got synthesized. The user gets B's raw output.
- **Delegate when you should hand off.** A delegates to B for the rest of the conversation, then A's responses become a noisy passthrough. Just hand off cleanly.
- **Bidirectional ping-pong.** A hands to B; B hands back to A; A hands to B; … Pick one in charge.
- **Hand-off without a router.** No one decides who should handle the user's request. Multiple agents fight for control.

## Trade-offs

**Delegation:**
- Pros: caller stays in charge; results returnable; auditable.
- Cons: caller's context grows; not great when the work shifts the conversation entirely.

**Hand-off:**
- Pros: clean transfer of responsibility; specialist owns the rest.
- Cons: hard to backtrack; harder to audit who did what.

**Rule of thumb:** Default to delegation. Hand off only when the receiving agent should genuinely OWN the rest of the interaction — not just do a piece of it.

## Real-world analogies

- Delegation: a manager asks an analyst for a specific report. Analyst delivers. Manager continues.
- Hand-off: a customer-service rep transfers a call to a specialist. The original rep is done; the specialist owns the customer.

## Run the demo

```bash
node demo.js
```

The demo runs the same task two ways: with delegation (orchestrator stays in charge, synthesizes results) and with hand-off (router classifies, transfers control to a specialist, doesn't return). The shapes are different.

## Deeper intuition

Multi-agent patterns are coordination strategies, not magic multipliers. They help only when splitting the work reduces cognitive load more than it increases communication overhead, synthesis work, and opportunities for contradictory conclusions.

The best way to study **Hand-Off vs Delegation** is to treat it as a control surface. Ask what part of agent behavior becomes more legible, more bounded, or more reusable when you apply this idea. If a technique makes the system easier to reason about under repeated use, it is probably serving a real purpose. If it mostly adds ceremony, it may be compensating for a blurrier design problem upstream.

## Questions to carry into the demo

- What kind of failure or drift is this topic trying to prevent?
- What degree of autonomy does it allow, and where does it deliberately add constraint?
- How would I know this concept is helping in production rather than just sounding good in a diagram?
- If I removed this mechanism, where would confusion or risk re-enter the system?

## Scenario questions

These questions are here to make **Hand-Off vs Delegation** feel like an agent-design decision instead of a vocabulary word. The useful question is not just "what is it?" but "what failure, control problem, or reliability concern does it help me handle?"

### Scenario 1 — "An agent works in the toy demo but becomes unreliable in repeated real use"

**Question:** Should this topic become one of the first concepts you examine?

**Answer:** Usually yes.

**Explanation:** In agent systems, the interesting problems often appear at runtime: drift, ambiguity, bad tool choices, unsafe actions, missing visibility, or loops that degrade over time. This topic matters when it helps make the agent more legible, more bounded, or more dependable across repeated runs.

**Why not jump straight to Hierarchical or Orchestrator Worker:** those may also be relevant, but this topic is the better starting point when the main issue is the specific control surface it provides in agent behavior.

### Scenario 2 — "A design sounds sophisticated, but nobody can explain what risk it is reducing"

**Question:** Is that a warning sign that the team may be using **Hand-Off vs Delegation** as ceremony rather than engineering?

**Answer:** Yes.

**Explanation:** Good agent design concepts earn their keep by reducing a concrete category of failure, cost, or uncertainty. If no one can say what risk this topic is reducing, the design may be adding complexity without adding much control.

**Why not keep the mechanism anyway:** because in agent systems, every extra moving part becomes another place for confusion, latency, or maintenance burden to accumulate.
