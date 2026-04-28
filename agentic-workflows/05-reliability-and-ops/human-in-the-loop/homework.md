# Homework — Human-in-the-Loop

> Place gates where they earn their keep. Beware approval fatigue.

## Exercise 1: Identify gate placements

For an agent you've built (or one of the demos), list:
- All actions the agent can take.
- For each: reversible or irreversible? local-only or external? high-stakes or low?
- Mark which actions deserve a human gate.

A reasonable rule: gate at *(irreversible OR external) AND consequential*.

## Exercise 2: Implement gates

Build a `confirm` tool the agent calls. When called:
- Print/surface: kind, proposed action, rationale, alternatives.
- Await user response: approve / approve-with-edits / reject / clarify.
- Return the user's response as the observation.

Constrain at least one type of action behind this gate.

**Constraints:**
- Each gate has a specific *kind* (e.g., `delete_confirmation`, `external_send`, `large_change`).
- Each kind has structured fields the user sees.
- The agent's flow pauses cleanly; the user can take their time.

## Exercise 3: Defeat approval fatigue

Tighten your gates so they fire only when truly needed:
- Move low-stakes auto-allowable actions out of gates.
- Implement batched approvals where multiple actions of the same kind queue up.
- Add a "confidence" field — if agent is high-confidence, no gate; otherwise gate.

**Constraint:** measure approval-rate. If your gates are >95% approved every time, they're theater. Tighten or remove.

## Stretch: Async approvals

Some workflows can't pause for human input. Build:
- The agent submits the proposed action to a queue and continues with anything that's safe to do without approval.
- A separate process handles approvals (e.g., a Slack bot, an email, a UI).
- Once approved, a callback resumes the agent's flow.

This is harder to implement but matches real production agents (long-running, with human oversight that doesn't block).

## Reflection

- "The right place for HITL is irreversible, external, consequential." Pick a real action and walk through whether each criterion applies.
- Approval fatigue: have you experienced this in your own work? What are the symptoms?
- "Eventually you should be able to remove gates as the agent earns trust." How would you measure earned trust?

## Done when

- [ ] At least one HITL gate operational in your agent.
- [ ] Each gate has a specific kind + structured fields.
- [ ] You've measured approval rate; gates fire when they should.
- [ ] You can articulate where HITL pays off vs becomes drag.
