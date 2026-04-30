# DevOps (Azure shop) — current state

- **Master syllabus:** [learning-syllabuses/devops.md](../../learning-syllabuses/devops.md)
- **Level:** 2 (Intermediate — Composable infrastructure: you can ship a Dockerized app via CI/CD)
- **Topic index in level:** 1
- **Topic:** Bicep modules + parameters
- **Canonical resource:** Bicep docs — *Modules*, *Parameters and outputs*
- **Repo path:** none — this subject is external-only (no `devops/` repo content; topics link to official docs and use deliverables for the implement step)
- **Next step:** read
- **Last completed:** (skipping Level 1; daily-work practitioner already deploying Azure resources, comfortable with Docker / Bicep basics / GitHub Actions hello-world)

## Pacing

A devops topic typically spans 2–4 working days at part-time pace. The skill keeps producing chapter-relevant tasks for the current step until you advance the step here. **You** decide when each step is done.

## Step order for each topic

1. **read** — work through the linked official doc / Microsoft Learn module
2. **demo** — walk through the official tutorial step-by-step in your sandbox subscription; type and click everything yourself
3. **implement** — apply the topic to a small original problem of yours; save artifacts (Bicep, workflow YAML, Dockerfile, screenshots) to `progress/<today>/work/devops/`. Always end with cleanup (`az group delete`, `docker rm`, etc.)

## How to advance

Within a topic: bump `Next step`: `read` → `demo` → `implement`.
After `implement` finishes: increment `Topic index in level` and reset `Next step` to `read`. Update `Topic` and `Canonical resource` from the syllabus.
After the last topic in a level: bump `Level` and reset `Topic index in level` to 1.

## If you find a Level 2 topic too easy

If you breeze through the read step in <30 minutes and the demo feels routine, advance to the next topic the same day. Don't stretch a topic past its useful learning depth. Level 2 has 7 topics; Level 3 has 9. Get to Level 3 quickly if Level 2 is mostly review.

## Sandbox requirement

Hands-on tasks assume you have:
- An Azure subscription you can deploy to (work sandbox or personal free trial)
- A GitHub account
- Local Docker installed
- Azure CLI (`az`) installed locally

Some Level 3+ topics also need a custom domain, an ACR, or other prerequisites — flagged in the syllabus.
