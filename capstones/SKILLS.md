# Skills to Build Across the Capstones

Each capstone's `project.md` lists 2-3 skills specific to that project. This file maps the landscape of skills worth building across all eight capstones, identifies which ones generalize across multiple projects, and recommends where to start.

## Skills that ship with this repo (use these now)

Three skills already exist in `.claude/skills/` that support capstone work directly:

| Skill | What it does |
| --- | --- |
| `/capstone-review` | Evaluates your progress against a capstone brief, identifies gaps, suggests next steps |
| `/design-doc` | Generates a structured design doc from a description, following the `engineering-career` format |
| `/adr` | Captures a decision as an Architecture Decision Record in standard format |

Run `/capstone-review` after completing any milestone. Run `/design-doc` before starting a milestone (the design doc IS the milestone for design work). Run `/adr` whenever you make a significant technical choice.

## Skills to build during Capstone 05 (Developer Productivity Agent)

Capstone 05 is explicitly about building skills. The skills you build there are immediately useful across all other capstones:

| Skill | Used in |
| --- | --- |
| `/pr-review` | All capstones (before submitting any PR) |
| `/standup` | All capstones (daily progress tracking) |
| `/onboard` | 01, 06, 08 (understanding unfamiliar codebases) |
| `/story-draft` | Engineering career track (interview preparation) |

## Skills to build during specific capstones

These skills are project-specific but worth investing in because they encode domain knowledge:

### Capstone 01 — Incident Operations Platform
| Skill | What it does |
| --- | --- |
| `/incident-sim <scenario>` | Fires a failure scenario against the signal pipeline |
| `/diagnosis-trace <incident-id>` | Shows the full agent reasoning trace for an incident |
| `/runbook-search <pattern>` | Searches the generated runbook library |

### Capstone 02 — Multi-Agent Code Review
| Skill | What it does |
| --- | --- |
| `/review-diff <path-or-url>` | Runs the full review pipeline on a diff |
| `/review-trend <repo>` | Shows quality trends over the last N reviews |

### Capstone 03 — Production API Platform
| Skill | What it does |
| --- | --- |
| `/slo-status` | Reports current SLO compliance and error budget |
| `/load-test <endpoint> <count>` | Fires load and reports latency distribution |

### Capstone 04 — Intelligent CI/CD
| Skill | What it does |
| --- | --- |
| `/risk-score <diff>` | Runs the risk scoring agent on a diff |
| `/rollout-status` | Shows current rollout percentage and live signals |

### Capstone 06 — Event-Driven Analytics
| Skill | What it does |
| --- | --- |
| `/event-replay <aggregate-id>` | Replays events and shows state at each step |
| `/projection-status` | Shows current lag and event counts for all projections |

### Capstone 07 — Multi-Tenant Platform
| Skill | What it does |
| --- | --- |
| `/tenant-provision <name>` | Provisions a test tenant and returns credentials |
| `/isolation-test` | Runs the cross-tenant data isolation test suite |

### Capstone 08 — Agentic Knowledge Base
| Skill | What it does |
| --- | --- |
| `/kb-query <question>` | Queries the knowledge base with citations |
| `/kb-eval` | Runs the evaluation suite and reports accuracy |
| `/kb-ingest <path>` | Ingests a document or directory |

## Sequencing recommendation

1. **First**: install and use `/capstone-review`, `/design-doc`, `/adr` — these are already built and immediately useful.
2. **During Capstone 05**: build `/pr-review` and `/standup` — they're useful across all other capstones.
3. **During each other capstone**: build the 2-3 skills listed in that project's `project.md` as you reach the milestone where they become useful.
4. **Always**: use `/design-doc` before milestone 1 of any capstone. The design doc is the cheapest investment that prevents the most rework.

## What makes a good capstone skill

The quality bar for a capstone skill is higher than for a quick-and-dirty helper:

- **It produces consistent, structured output** — not prose that varies every run, but a stable format you can act on
- **It fails gracefully** — if the input is malformed or the required files don't exist, it gives a clear error, not a hallucinated result
- **It knows its scope** — it does one thing well, not five things adequately
- **It has an eval** — you know it's working correctly because you tested it, not because it felt right
