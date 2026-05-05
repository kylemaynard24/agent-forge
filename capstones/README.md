# Capstones — Production Reps

Reading teaches concepts. Building teaches judgment. Capstones are where you get the production reps that no amount of reading substitutes for.

Each capstone is a substantial project brief designed to force you to apply knowledge from multiple domains simultaneously. This is intentional — real systems don't stay in their lane. The same project requires you to make architecture decisions, apply design patterns, write deployment infrastructure, handle failure modes, and operate the thing once it's running.

## Why capstones exist as a separate section

The repo's topic READMEs teach depth in individual concepts. The SYLLABUS monthly projects build vertical slices. Capstones are different: they are horizontal, spanning multiple sections, and they are open-ended enough that you can keep returning to them at a higher level of skill.

A capstone done at month 3 looks different from the same capstone done at month 12. The same brief produces richer work as your foundation deepens. You are encouraged to revisit capstones rather than treating them as done.

## The eight capstones

| # | Title | Primary domains |
| --- | --- | --- |
| [`01`](01-incident-ops-platform/) | Incident Operations Platform | agentic-workflows, architecture, advanced-engineering, devops |
| [`02`](02-multi-agent-code-review/) | Multi-Agent Code Review System | agentic-workflows, design-patterns, architecture |
| [`03`](03-production-api-platform/) | Production API Platform | architecture, design-patterns, devops, security |
| [`04`](04-intelligent-cicd/) | Intelligent CI/CD Pipeline | devops, agentic-workflows, architecture |
| [`05`](05-developer-productivity-agent/) | Developer Productivity Agent | agentic-workflows, engineering-career |
| [`06`](06-event-driven-analytics/) | Event-Driven Analytics System | architecture, design-patterns, devops |
| [`07`](07-multi-tenant-platform/) | Multi-Tenant SaaS Backend | architecture, design-patterns, devops, security |
| [`08`](08-agentic-knowledge-base/) | Agentic Knowledge Base | agentic-workflows, architecture, advanced-engineering |

## How to work through a capstone

1. Read the `project.md` end-to-end before writing a line of code.
2. Write a design doc (use `/design-doc` skill) before starting milestone 1. This is non-optional — the capstone exercises judgment, and judgment starts before the first keystroke.
3. Work through milestones in order. Earlier milestones intentionally under-constrain the later ones — the decisions you make in milestone 1 create the constraints you'll deal with in milestone 5.
4. After each milestone, write a short ADR (use `/adr` skill) capturing the most important decision you made. This creates a record of your reasoning and is what you'll look back on when you revisit the capstone later.
5. After completing a capstone (or a significant milestone block), run `/capstone-review` to evaluate your work against the brief and identify gaps.

## What "done" means

A capstone is never fully done — it can always be taken further. A reasonable stopping point for each milestone is: "someone who didn't write this could read it, run it, and understand what it does and why."

That standard forces you to produce:
- Code that runs
- A design doc that explains the decisions
- A runbook or operational note that explains how to operate it
- At least one ADR per significant decision

## Connection to `engineering-career/`

Capstones generate the evidence that career progression requires. Every completed milestone is a story. Every design doc is an artifact. Every ADR is proof that you thought before you built.

When you finish a capstone, review your work against the `engineering-career/01-career-ladder/analyst-to-senior-path/` README. The question to ask: "Does the work I did here demonstrate the scope, autonomy, and judgment of the level I'm targeting?"
