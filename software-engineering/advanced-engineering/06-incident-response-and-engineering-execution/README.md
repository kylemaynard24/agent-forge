# Incident Response and Engineering Execution

**Category:** Advanced engineer track

## Intent

Operate clearly during failure and communicate well enough that the team learns from it afterward. Engineering execution is where diagnosis, prioritization, writing, and judgment all meet.

## When to use

- A live issue is affecting users or revenue
- The system is degraded and nobody wants to overreact or underreact
- Teams need a runbook, design note, ADR, or postmortem
- The real challenge is coordination as much as code

## What this area trains

- severity assessment
- mitigation-first thinking
- observability-driven triage
- crisp communication under time pressure
- turning incidents into better systems and docs

## Trade-offs

**Pros**
- Faster, calmer response during failure
- Better learning after the incident
- Stronger engineering influence through writing

**Cons**
- Communication work can feel secondary until you need it desperately
- Runbooks and docs age if not maintained
- Good postmortems require honesty, not theatrics

## Rule of thumb

During an incident, optimize first for user impact and clarity, then for elegance.

## Run the demo

```bash
node demo.js
```

The demo simulates a simple incident loop: detect, classify, mitigate, communicate, and identify one follow-up.

See also: [homework.md](homework.md) and [project.md](project.md)
