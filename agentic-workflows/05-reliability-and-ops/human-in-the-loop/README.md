# Human-in-the-Loop

**Category:** Reliability and ops

## What it means

**Human-in-the-loop (HITL)** means: at decision points where the cost of being wrong is high, the agent pauses and asks a human. The human approves, rejects, edits, or instructs.

Not "human reviews everything." Not "agent runs autonomously." Targeted human intervention at *specific gates*.

## Why HITL matters more than you think

For most production agents, the question isn't "fully autonomous or fully manual" — it's *where* humans stay in the loop.

- A full-auto agent makes mistakes; the cost compounds.
- A full-manual agent has no leverage; humans bottleneck every decision.

The art is putting the human gate at the *right* place: high-stakes, low-frequency. Don't ask the human to approve every read; do ask before any irreversible action.

## Common gate placements

### Before destructive actions
"This will delete 47 records. Proceed? [y/N]"

The agent does everything autonomously up to the destructive step, then pauses.

### Before sending external messages
"I'm about to send this email to 100 customers. Review:
\n[draft here]\n
Approve, edit, or reject?"

### When confidence is low
"I tried 3 approaches and none worked clearly. Should I keep trying or hand back?"

### At natural workflow boundaries
After exploration, before implementation. After draft, before publish. After analysis, before decision.

### When the agent encounters ambiguity
"You said 'fix the issue.' I see three plausible interpretations. Which?"

## Implementing gates

The simplest pattern: a `confirm` tool. The agent calls it; the harness pauses; the user responds; the response becomes the next observation.

```
agent: confirm({
  proposed_action: "delete 47 records matching X",
  rationale: "they are duplicates per checks A and B",
  alternatives: ["mark deleted instead", "review each manually"]
})

[harness pauses, asks user]

user: approves "delete 47 records"

[harness resumes]

agent: continues with delete
```

Confirmation gates ARE tools. Same shape, same dispatch — just one that hands off to a human.

## What makes a good gate

A gate that humans actually engage with:

- **Specific.** Not "are you sure?" but "delete these 47 records, listed below?"
- **Actionable.** Three options: yes / no / let me edit.
- **Brief.** 30 seconds to read; not 3 minutes.
- **Reversible-vs-not.** Mark whether the action is reversible. Humans take more care on irreversible ones.

A gate that humans tune out:
- "AI ready to proceed. Continue?" — every time, on everything. Approval fatigue.
- A 500-word explanation. They scroll past.
- No way to push back beyond yes/no.

## Approval fatigue

The biggest HITL failure mode. If the gate fires too often, humans rubber-stamp. The gate is theater.

Mitigations:
- **Fewer, higher-stakes gates.** Move low-stakes confirmations to settings (`allow`).
- **Batched approvals.** "I'm about to do these 10 things, all reversible. Review?"
- **Confidence-gated.** Only ask when the agent is uncertain.
- **Audit, don't gate.** For low-stakes actions, do it; log it; let the human review later.

## When to remove HITL

A gate that's been approved 100 times in a row, on the same shape of action, with no rejections — promote to auto-allow. Don't keep humans on tasks the agent has earned trust on.

## Anti-patterns

- **Hidden gates.** The agent silently asks for confirmation in a way the user doesn't notice. Approve-or-die UX.
- **Gates with no rejection path.** Yes/cancel. No "let me edit." No "tell me more first."
- **Gates that block the entire UI.** Async approvals (out-of-band) work for some workflows.
- **Auto-approving "just this once."** That's a permission rule. Codify it.

## Trade-offs

**Pros**
- Catches mistakes that no automated check could.
- Builds user trust in the agent.
- Distributes decision-making appropriately.

**Cons**
- Latency: human-paced steps slow the agent.
- Approval fatigue: too many gates = no real review.
- Workflow disruption: the human must be available.

**Rule of thumb:** Gate at "irreversible × external × consequential" actions. Auto on everything else.

## Real-world analogies

- A pilot's confirmation before takeoff/landing — high-stakes, low-frequency.
- Two-person rule for nuclear weapons — irreversible action requires multiple humans.
- Code review before merging to main — gate at integration, auto on the development side.

## Run the demo

```bash
node demo.js
```

The demo runs an agent with two HITL gates (one approval, one ambiguity-clarification) and a stub user that responds. Shows how the agent's flow pauses, integrates the user's input, and continues.
