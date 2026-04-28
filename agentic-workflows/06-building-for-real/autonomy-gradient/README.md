# The Autonomy Gradient

**Category:** Building for real

## Five levels

The "autonomy gradient" is a useful mental model for picking the right level of agency for a use case.

| Level | Agent does | Human does | Example |
|---|---|---|---|
| **0** | Generates suggestions | Approves and acts | ChatGPT-style copilot |
| **1** | Picks tool calls; agent acts on each | Approves each call | Default Claude Code |
| **2** | Acts within a sandbox | Reviews after | Claude Code with `allow` for safe ops |
| **3** | Acts in production with guardrails | Reviews periodically | A scheduled report-generation agent |
| **4** | Acts autonomously over time | Reviews aggregates | Self-healing infra agents |

Each level trades safety for speed (and often, capability).

## The gradient as a design principle

The right level for a given use case depends on:

- **Cost of being wrong.** A Slack message: low. Deleting prod data: high.
- **Reversibility.** Reversible: comfortable with autonomy. Irreversible: human gates.
- **Frequency.** Daily routine: gates feel painful. Once a quarter: gates are fine.
- **Audit needs.** Compliance / regulated: humans in the loop on record.
- **Trust earned.** A new agent at level 4 is a mistake. The same agent after 6 months at level 2 with no incidents may earn level 3.

## Moving up the gradient

Agents typically *start* lower and *earn* higher. Don't ship at level 4 on day 1.

A reasonable progression:
1. Build at level 1: human approves every action.
2. After observing patterns, move safe actions to auto-allow (level 2).
3. After confidence, move the agent to level 3 with periodic review.
4. Only consider level 4 for very specific, well-bounded use cases — and even then, audit relentlessly.

## Choosing per-action, not per-agent

A single agent often operates at *multiple* levels for different actions:

- Reads → auto-allow (level 2).
- Writes to scratch / dev → auto-allow (level 2).
- Writes to prod → human gate (level 1).
- External messages → human gate (level 1).
- Spawning subagents → varies.

This is what `permissions` in `settings.json` encodes (see `03-claude-code-primitives/settings-and-permissions`).

## What changes at each level

### Level 0 → 1
You move from "agent suggests; human acts" to "agent acts via tools." The biggest shift: tool design becomes critical. The agent is now in the loop.

### Level 1 → 2
The friction of approving every action goes away. The risk: approval fatigue is replaced by no oversight on routine ops. Permissions and guardrails carry the weight.

### Level 2 → 3
The agent runs without you watching. Observability becomes critical — without traces, metrics, and alerts, you can't even know what's happening.

### Level 3 → 4
The agent acts on a long-running basis with minimal oversight. This level is rare in practice; usually requires regulatory / compliance considerations and significant infrastructure.

## What earns trust

To earn a higher level, an agent must:

- Pass eval suite continuously.
- Run cleanly without incident over a meaningful period.
- Have observability that makes its behavior auditable.
- Have guardrails that catch the categories of mistake it's at risk of.
- Have a human escape hatch (rollback, kill switch, override).

Without these, no level above 1 is responsible.

## The dark side: over-autonomy

When you give an agent more autonomy than it has earned:

- Errors compound silently.
- Trust gets damaged when the inevitable bad action happens.
- Recovery is hard — you have to undo and explain.

The path to "we don't trust the agent anymore" usually starts with a too-eager bump up the gradient.

## When to NOT move up

- The eval suite hasn't caught the type of mistake the agent has been making.
- You have no observability you'd want to debug an incident with.
- The action's blast radius is larger than your tolerance.
- The agent has incidents at the current level; addressing autonomy is symptomatic.

## Anti-patterns

- **All-or-nothing.** Treating autonomy as binary. It's a gradient with per-action granularity.
- **Earned autonomy decayed.** An agent earned level 3 a year ago. The world changed. The agent's still at level 3 without re-evaluation.
- **Promotion without observability.** "It's been fine for a week; let's auto-everything." You don't know what "fine" actually was.
- **Rollback impossible.** Moving up the gradient requires being able to come back down. If you can't, you've made a one-way decision.

## Trade-offs

**Pros of higher levels**
- Speed. Less waiting.
- Scale. The agent does more.
- Workflow integration. The agent fits in.

**Cons**
- Less oversight. Mistakes accumulate.
- Higher blast radius per error.
- Trust is fragile.

**Rule of thumb:** Default to the lowest level that does the job. Move up only when the cost of human-in-the-loop is higher than the risk of giving the agent more rope.

## Real-world analogies

- The progression of self-driving car levels (0 = no automation; 5 = full automation). Same gradient logic.
- A junior engineer earning more autonomy over time. Code review on every PR → for risky changes only → trusted to merge directly.
- A pilot's certification: training wheels, supervised flights, signed off for solo, signed off for passengers, signed off for IFR.

## Run the demo

```bash
node demo.js
```

The demo runs the same agent at three different autonomy levels (1, 2, 3) and shows what changes — gates fired, observations logged, actions auto-allowed.
