# DevOps (Azure-focused)

DevOps is the practice of connecting how software is built to how it runs. It is not a team or a title — it is a set of practices, tools, and cultural commitments that reduce the friction between "code on a developer's machine" and "code running reliably in production."

This directory is the teaching content for the DevOps track. The master syllabus (topic list, deliverables, external links) lives in [`learning-syllabuses/devops.md`](../learning-syllabuses/devops.md). This directory provides the READMEs that give you the mental models and engineering judgment the official docs assume you already have.

## What this section covers

| Section | What it teaches |
| --- | --- |
| [`01-foundations/`](01-foundations/) | Infrastructure as code, containers, and CI/CD — the three pillars of modern delivery |
| [`02-delivery-pipeline/`](02-delivery-pipeline/) | Building and shipping reliably: build → push → promote across environments |
| [`03-production-operations/`](03-production-operations/) | Observability, reliability patterns, cost, and governance — running the thing once it's running |
| [`04-advanced-patterns/`](04-advanced-patterns/) | Progressive delivery, supply chain security, and platform-level engineering |

## The mental model: three layers

Everything in DevOps operates across three layers, and it helps to keep them distinct:

**Infrastructure**: the cloud resources your software runs on — compute, storage, networking, identity. Infrastructure as Code (IaC) is about managing this layer through version-controlled definitions rather than manual operations.

**Delivery**: the pipeline from a code change to that change running in production — build, test, push, promote. CI/CD is about making this pipeline fast, safe, and automated.

**Operations**: the ongoing work of keeping running software healthy — monitoring, alerting, incident response, capacity management, cost. Observability is the foundation of all of it.

Most "DevOps" learning focuses on the delivery layer. The production-operations layer is where most of the real learning happens, because that's where software meets reality.

## How DevOps connects to the rest of the repo

DevOps is not separate from software engineering — it is the outer loop that software runs inside. Every architectural decision has an operational consequence:

- Choosing microservices → you need per-service deployment pipelines and observability
- Choosing a monolith → simpler deployment, more complex deployment artifact
- Choosing event sourcing → your deployment process needs to handle schema evolution
- Choosing managed identity → simpler ops, but you need to understand Azure RBAC

The architecture curriculum in `software-engineering/architecture/` teaches you how to design systems. This section teaches you how to ship and operate them. Study both, and let them inform each other.

## Azure focus and why it is deliberate

This curriculum uses the Azure-native toolchain: Bicep, GitHub Actions, Azure Container Registry, Container Apps, App Service, Key Vault, Azure Monitor. This is not because Azure is objectively the best — it is because:

1. Depth beats breadth. Learning one cloud well is more valuable than knowing three clouds shallowly.
2. The Azure toolchain is mature, well-documented, and widely deployed in enterprise settings.
3. The concepts transfer. Everything you learn about IaC in Bicep applies to Terraform, Pulumi, and CDK. The specific syntax changes; the mental model doesn't.

Once you have depth in one cloud, picking up a second takes weeks, not months.

## The DORA metrics — the outcome you're building toward

Google's DevOps Research and Assessment (DORA) program identified four metrics that predict software delivery performance:

| Metric | What it measures |
| --- | --- |
| **Deployment frequency** | How often you deploy to production |
| **Lead time for changes** | Time from code committed to code running in production |
| **Change failure rate** | Percentage of deployments that cause incidents or require rollback |
| **Time to restore service** | How long it takes to recover from a production incident |

High performers deploy multiple times per day, lead time measured in hours, failure rate under 5%, and recovery time under an hour. These outcomes are not possible without solid IaC, solid CI/CD, and solid observability.

Study this section not to accumulate tool knowledge but to improve those four numbers.
