# Capstone 01 — Incident Operations Platform

## Context

On-call is the moment when everything you know about building and operating systems gets tested simultaneously. Most engineers experience incidents reactively: a page fires, they debug blind, they fix it, they write a post-mortem, and the cycle repeats. This capstone asks you to build the infrastructure that changes that loop.

An Incident Operations Platform is an agentic system that:
- Ingests observability signals (metrics, logs, error rates)
- Detects anomalies and classifies their severity
- Automatically diagnoses the probable cause using a structured hypothesis loop
- Remediates known failure patterns without human involvement
- Escalates novel failures to a human with rich, structured context — not just "something is broken"
- Learns from every incident to improve future response

This is not a toy. Real versions of this (PagerDuty, Grafana OnCall with AI assistants, internal tools at large tech companies) are some of the highest-leverage engineering investments an organization can make.

## Primary domains

| Domain | What this capstone exercises |
| --- | --- |
| `agentic-workflows` | multi-agent orchestration, human-in-the-loop, tool design, observability and tracing |
| `architecture` | event-driven, resilience patterns, circuit breaker, pub-sub |
| `advanced-engineering` | incident response, debugging and diagnostics, observability |
| `devops` | alerting, monitoring, operational runbooks |

## What you'll build

A working system with the following components:

**Signal ingestion layer**: a component that receives metrics, logs, and events from simulated services. You can build a simple service that generates fake signals (including intentional failure scenarios) to drive the system.

**Anomaly detection**: a rules-based or threshold-based detector that fires incident events when signals cross configured thresholds. Keep this simple at first — the sophistication is in what happens after detection, not in the detection itself.

**Diagnosis agent**: an agent that receives an incident event and runs a structured diagnostic loop: generate hypotheses about the probable cause, use tools to verify or eliminate each hypothesis, and produce a diagnosis with confidence level.

**Remediation layer**: a set of known remediation actions (restart a service, scale up a resource, clear a cache, roll back a deployment) that the system can execute automatically when a diagnosis matches a known pattern. The autonomy gradient matters here — some remediations require human approval.

**Escalation engine**: when the diagnosis confidence is low or the remediation is risky, the system escalates to a human with a structured summary: what happened, timeline, probable cause, impact, and recommended action.

**Multi-agent architecture** (milestone 6): replace the single diagnosis agent with a triage agent (determines severity and category) that hands off to specialized diagnosis agents (infrastructure agent, application agent, dependency agent).

## Milestones

### Milestone 1: Signal pipeline (2-4 hours)
Build a signal ingestion pipeline that receives structured events. Create a test harness that can fire predefined failure scenarios on demand: service latency spike, error rate increase, disk filling up, memory leak pattern.

**Deliverable**: a running service that accepts signals and logs them with structured metadata. A test script that can trigger each failure scenario.

---

### Milestone 2: Anomaly detection (2-4 hours)
Implement a detector that evaluates incoming signals against configured thresholds and fires incident events. Handle the "flapping" problem: signals that briefly cross a threshold then recover should not generate incidents on every sample.

**Deliverable**: a detector that correctly fires on 5 out of 5 test scenarios and does not fire on 10 normal signal sequences. A design doc explaining your flapping prevention approach.

---

### Milestone 3: Single-agent diagnosis (4-8 hours)
Build a diagnosis agent that receives an incident event and uses tools to investigate. The agent should:
- Generate at least 3 hypotheses about the probable cause
- Use tools to verify or eliminate each (read logs, check metrics, query service status)
- Produce a structured diagnosis: most probable cause, confidence level, evidence

**Deliverable**: agent that correctly diagnoses 3 of the 5 test scenarios. Written evaluation: what makes the agent's diagnosis better or worse than a human's?

---

### Milestone 4: Automated remediation (3-5 hours)
Add remediation actions for the 3 failure patterns the agent can now diagnose. Apply the autonomy gradient:
- Low-risk remediations (cache clear, log rotation) → auto-execute
- Medium-risk (service restart, config change) → execute with notification
- High-risk (rollback, scaling change) → require human approval

**Deliverable**: end-to-end demo where one failure scenario is detected, diagnosed, and automatically remediated within 60 seconds. The escalation path for high-risk actions is documented and tested.

---

### Milestone 5: Human escalation (2-4 hours)
When confidence is low or the action is high-risk, produce a structured escalation summary that gives a human everything they need to decide in under 60 seconds. No jargon. Explicit probable cause, explicit recommended action, explicit link to relevant runbook section.

**Deliverable**: a structured escalation format that you would actually want to receive at 2am. Test it by showing it to a colleague — can they understand the situation and take action without asking questions?

---

### Milestone 6: Multi-agent architecture (4-8 hours)
Decompose the single diagnosis agent into a triage agent and specialized agents. The triage agent determines severity and category (infrastructure failure, application failure, dependency failure) and delegates to the appropriate specialist. The specialists can also escalate back to the triage agent if they need cross-domain investigation.

**Deliverable**: a design doc explaining the decomposition, why each agent has its scope, and how the hand-off works. Working system with at least one failure scenario that requires cross-agent collaboration to diagnose.

---

### Milestone 7: Evals and runbook generation (4-6 hours)
Build an eval suite for the diagnosis accuracy. Add a runbook generation capability: after each incident, the system produces a draft runbook for that failure pattern. Over time, the runbook library grows.

**Deliverable**: eval report showing diagnosis accuracy across all test scenarios. A generated runbook for at least one failure pattern that is accurate enough to follow.

---

### Milestone 8: Full observability on the agents themselves (2-4 hours)
The agents need to be observable. Add tracing for agent decisions: what hypotheses did the agent generate? What tools did it call? What evidence changed its confidence? This is not vanity — it is what lets you debug the agent when it makes a wrong diagnosis.

**Deliverable**: a trace log for a complete incident that shows every step the agent took. A post-mortem on one incident where the agent was wrong — what would have needed to be different for it to diagnose correctly?

---

## Technical guidance

**Start simple on signal generation**. Don't build real service infrastructure at milestone 1 — build a fake signals API that you control. You can make it realistic later.

**The diagnosis agent is not the interesting part**. The interesting part is the tool design. What tools does the agent need to investigate? What do the tool responses look like? Bad tool design is the most common reason diagnosis agents fail.

**Think about the context window**. In a long incident, the agent may receive many signals. How do you prevent the context from growing unbounded? The memory-patterns topic in the agentic-workflows curriculum is directly relevant here.

**The escalation summary is a design problem, not a writing problem**. What structure makes it easiest for a human to make a fast, correct decision? Prototype it on paper before coding it.

**Make the autonomy gradient explicit**. Before milestone 4, write down exactly what actions are in each tier and why. The criteria should be reproducible — another engineer reading your criteria should reach the same tier assignment.

## Skills to build while working on this capstone

- `/incident-sim` — fires a specific failure scenario against the signal pipeline for testing
- `/diagnosis-trace` — displays the full reasoning trace for a recent agent diagnosis
- `/runbook-search` — searches the runbook library for a given failure pattern

## Further depth

- `agentic-workflows/05-reliability-and-ops/human-in-the-loop/` — the theory behind the autonomy gradient you're implementing
- `agentic-workflows/05-reliability-and-ops/observability-and-tracing/` — how to trace agent decisions
- `software-engineering/advanced-engineering/06-incident-response-and-engineering-execution/` — what good incident response looks like
- `devops/03-production-operations/observability/` — the monitoring and alerting foundation
