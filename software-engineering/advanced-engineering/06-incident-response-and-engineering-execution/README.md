# Incident Response and Engineering Execution

**Category:** Advanced engineer track

## Intent

Severity, mitigation, communication, postmortems, and written engineering leverage.

## When to use

- you want stronger engineering judgment in incident response and engineering execution
- the high-level ideas make sense but the real-world execution still feels slippery
- you need repeatable habits rather than one-off heroics
- you want to practice under realistic constraints instead of reading principles passively

## What this area trains

- making pressure legible with good severity and triage
- optimizing for mitigation and user impact before elegance
- communicating clearly while facts are still incomplete
- turning incidents and debates into docs that improve the next run

## Subtopics

- [01-severity-models/](01-severity-models/) — Classify incidents by impact and urgency so the response matches reality.
- [02-runbooks/](02-runbooks/) — Capture the first useful response steps before the next stressful hour arrives.
- [03-alert-quality/](03-alert-quality/) — Tune alerts so they are actionable, timely, and worth trusting.
- [04-triage-loops/](04-triage-loops/) — Move repeatedly through detect, assess, act, and reassess without freezing.
- [05-rollback-strategy/](05-rollback-strategy/) — Know when reverting is safer than pushing forward with the fix.
- [06-degraded-mode-design/](06-degraded-mode-design/) — Keep the system partially useful when full functionality is too expensive to preserve.
- [07-stakeholder-updates/](07-stakeholder-updates/) — Communicate status clearly to people who need truth, not implementation detail.
- [08-postmortems/](08-postmortems/) — Write incident analysis that improves systems rather than assigning blame.
- [09-adrs-and-rfcs/](09-adrs-and-rfcs/) — Use lightweight writing to align engineering decisions before complexity compounds.
- [10-code-review-quality/](10-code-review-quality/) — Raise team quality by making review comments precise, useful, and trade-off aware.

## What to notice as you work through it

- what is confirmed fact versus current hypothesis
- which action reduces user harm fastest
- whether the team has enough signal to declare recovery
- what follow-up would reduce recurrence most

## Common mistakes

- waiting for certainty before communicating
- arguing severity from ego rather than user impact
- writing postmortems that list events but hide lessons
- treating design docs and reviews as paperwork instead of leverage

## How to use the materials

Each subtopic folder contains:

1. **README.md** — the concept and trade-offs
2. **demo.js** — a tiny runnable illustration
3. **homework.md** — a constrained exercise

Run any demo with:

```bash
node path/to/demo.js
```

Start with the earlier folders before the later ones. The ordering is intentional.
