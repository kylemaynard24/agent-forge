# Homework — Capstone

> Build the agent. Defend the design. Run the retrospective.

## The capstone

Pick a project (one of the suggested options or your own). Produce:

1. **Design document** — fill in the template from `demo.js`. All 12 sections.
2. **Implementation** — working code, runnable, that implements the design.
3. **Eval suite** — at least 5 fixtures with multiple check types.
4. **Observability** — per-run traces; aggregate metrics script.
5. **Retrospective** — written, 1-2 pages.

There's no fixed deadline. A reasonable scope is 10-30 hours of focused work. Take longer if you'd benefit; cut scope if you're stuck.

## What "done" looks like

- [ ] Design doc fills every section without handwaving.
- [ ] Implementation matches the design.
- [ ] At least 4 of the curriculum's patterns are visible (e.g., plan-then-act, structured output, observability, an eval suite).
- [ ] You've run the agent on a real input and looked at the trace.
- [ ] Eval suite passes at your declared baseline.
- [ ] Retrospective identifies at least 2 things you'd change next time.

## A way to use this

Don't build the agent first and write the design after. Write the design first. Building it usually reveals 2-3 design errors; that's expected. Update the design.

When you can describe your agent in 5 minutes to someone who's not seen it, and they understand the architecture and the trade-offs, you're done.

## Stretch options

After completing the capstone:

### Stretch 1: Ship to a user
Make the agent available to one real user (yourself, a teammate). Use it for a week. Observe what breaks.

### Stretch 2: Promote up the autonomy gradient
Start at level 1 (gate everything). After 50 successful runs, promote one action to auto. Document the change.

### Stretch 3: Run it as a scheduled background agent
If your agent is a good fit for "runs every hour," set it up. Watch it run unattended.

### Stretch 4: Teach it
Give a 30-minute talk to colleagues about your agent. Their questions are your design audit.

## Reflection

- "Most agents fail because the architecture wasn't designed; it accreted." Defend or refute, based on your experience here.
- Looking back at the curriculum: which topic helped you the most on this capstone? Which was over-emphasized for your project?
- "An agent isn't done when it works on the demo. It's done when it survives a week of real use." Defend or refute.

## Done when

- [ ] Design doc is complete.
- [ ] Code runs and matches the design.
- [ ] Eval suite passes at baseline.
- [ ] Retrospective is written.
- [ ] You can defend every design choice in conversation.
- [ ] Optional: stretch goals attempted.
