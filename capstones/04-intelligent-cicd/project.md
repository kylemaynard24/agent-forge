# Capstone 04 — Intelligent CI/CD Pipeline

## Context

Standard CI/CD pipelines are deterministic: they run the same steps in the same order regardless of what changed. They treat a one-line documentation fix and a refactor of the authentication layer the same way. They deploy at 100% traffic immediately or not at all.

This capstone asks you to build a pipeline that is aware of what it's deploying. An agent evaluates each change: how risky is this diff? What components does it touch? What's the blast radius if it's wrong? Based on that assessment, the pipeline chooses its deployment strategy: slow rollout, fast rollout, or hold for human review.

This is the intersection of agentic intelligence and DevOps automation — a genuinely novel area where the tooling is young and the patterns are still emerging.

## Primary domains

| Domain | What this capstone exercises |
| --- | --- |
| `devops` | CI/CD, progressive delivery, canary deploys, observability |
| `agentic-workflows` | tool design, autonomy gradient, human-in-the-loop, structured output |
| `architecture` | event-driven, resilience, observability patterns |

## What you'll build

**Standard pipeline foundation**: a working CI/CD pipeline (GitHub Actions or equivalent) with test, build, push, and deploy stages. This is not the interesting part — it is the scaffolding.

**Risk scoring agent**: an agent that receives a diff and produces a structured risk assessment. Inputs: file paths changed, number of lines changed, test coverage delta, presence of known high-risk patterns (auth changes, database migrations, config changes). Output: risk score (1-10), risk category (low/medium/high), affected components, recommended rollout strategy.

**Progressive rollout controller**: instead of deploying to 100% traffic immediately, the controller deploys to an increasing percentage, watching error rates and latency at each step. It decides when to advance, pause, or roll back based on live signals.

**Human approval gate**: for changes rated high-risk by the scoring agent, the pipeline pauses and posts a structured summary to a Slack channel (or equivalent) requesting human approval before proceeding. The summary includes the risk assessment, the recommended action, and a one-click approve/deny response.

**Incident attribution**: a mechanism that links deployment events to subsequent metric changes, making it easy to answer "did this deployment cause that error spike?"

## Milestones

### Milestone 1: Standard pipeline (2-4 hours)
Build the baseline: test → build → push to registry → deploy to an environment. All steps automated. The deploy step should support a percentage-based rollout (even if you start at 100%).

**Deliverable**: a working pipeline. End-to-end demo: push a change, watch it deploy. A note on the failure modes: what breaks and how quickly would you know?

---

### Milestone 2: Risk scoring agent (4-6 hours)
Build the risk scoring agent. Design the tool set: what information does the agent need to assess risk? (Diff contents, file paths, test coverage, recent incident history for affected components?) Design the output schema: what does a risk assessment look like as a structured object?

Test the agent on at least 10 real diffs from a real open-source project. Does it correctly distinguish a documentation change from a database migration? An additive change from a breaking change?

**Deliverable**: risk scoring agent with structured output. Test results on 10 diffs with your analysis of where it gets it right and wrong. An ADR explaining the risk factors you chose and why.

---

### Milestone 3: Progressive rollout (4-8 hours)
Implement a controller that deploys to 10% of traffic, waits for signals, and decides whether to advance to 25%, 50%, 100%, or roll back. The decision is based on: error rate delta (vs the previous deployment), latency p99 delta, any anomaly in business metrics.

The hardest part is defining the "advance" criteria. Write this down explicitly before implementing it. What error rate increase is acceptable? Over what time window? What latency increase triggers a pause?

**Deliverable**: progressive rollout working for at least one deployment scenario. A design doc for the advance/pause/rollback criteria. Test that a simulated error spike at 10% causes a rollback before reaching 25%.

---

### Milestone 4: Human approval gate (2-4 hours)
For high-risk deployments, pause the pipeline and send a structured approval request. The approval request should give a human enough information to approve or deny in under 2 minutes: what changed, why it's rated high-risk, what the rollout strategy would be, what the rollback plan is.

**Deliverable**: working approval gate. An example approval request for a high-risk change. An honest assessment: what information would make the approval decision easier for a human?

---

### Milestone 5: Incident attribution (3-5 hours)
When an incident fires, make it easy to answer: "was this caused by a recent deployment?" Build a deployment event log and a mechanism that shows, for any metric anomaly, the deployment events that happened in the preceding window.

**Deliverable**: deployment event log. A demo where you trigger a simulated incident and the system surfaces the deployment event that preceded it.

---

### Milestone 6: Retrospective and automation learning (4-6 hours)
After the pipeline has run 20+ deployments, look at the history: how accurate is the risk scoring? Did high-risk deployments cause more incidents? Did the progressive rollout catch real problems? Use this data to calibrate the risk scoring model.

**Deliverable**: a retrospective report on pipeline performance. At least one specific improvement to the risk scoring agent based on real data. A measurement of the false positive rate (changes rated high-risk that turned out to be fine) and the false negative rate (changes rated low-risk that caused incidents).

---

## Technical guidance

**Start with the standard pipeline**. Do not try to build the agent and the pipeline together at first. Get a working vanilla pipeline, then add the intelligence layer on top. The intelligence layer is a modifier of pipeline behavior, not a replacement for it.

**Risk scoring is a bounded problem**. You don't need to understand business logic to score risk. File paths, change volume, test coverage delta, and pattern matching on high-risk change types (auth, migrations, config) produce surprisingly good signal. Don't try to build a model that understands the code — build one that recognizes the shape of risky changes.

**The progressive rollout needs real signals**. If you're not deploying to a real environment, you need to simulate signal generation. Build a simple signal emitter that produces realistic error rates and latencies — and that can be configured to produce a "bad deployment" signal on demand.

**The approval request is a design problem**. Before implementing the Slack integration, write the approval message on paper. Show it to someone who hasn't seen your system. Ask them: what would you approve and what would you deny? If they can't answer that question in 2 minutes, the message needs more work.

## Skills to build while working on this capstone

- `/risk-score <diff-url>` — runs the risk scoring agent on a provided diff
- `/rollout-status` — shows the current rollout state and live signal comparison
- `/pipeline-retro` — generates a retrospective summary from deployment history

## Further depth

- `devops/04-advanced-patterns/progressive-delivery/`
- `agentic-workflows/05-reliability-and-ops/human-in-the-loop/`
- `agentic-workflows/06-building-for-real/autonomy-gradient/`
- `software-engineering/architecture/07-resilience-and-scale/`
