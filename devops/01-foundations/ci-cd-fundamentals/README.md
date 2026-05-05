# CI/CD Fundamentals

Continuous Integration (CI) is the practice of merging code changes frequently and validating each merge automatically. Continuous Delivery (CD) is the practice of making every validated change deployable to production, automatically. Together, they form the delivery pipeline: the automation that moves code from a developer's machine to a running system.

The goal of CI/CD is not automation for its own sake. It is reducing the cost and risk of change — making it safe to ship often, which is the precondition for building feedback loops that improve software quality.

## What CI/CD actually solves

Without CI/CD, the typical software delivery process looks like this: developers work in isolation for days or weeks, merge everything at the end, discover that the merged code doesn't work, spend an unknown amount of time debugging and fixing, and eventually, after significant stress, produce a release. The time between "code written" and "code in production" is measured in weeks or months.

The problems this creates:

**Integration risk grows with time.** The longer two branches of development are separate, the harder it is to reconcile them. The changes that seemed small in isolation interact in unexpected ways. CI limits integration risk by requiring small, frequent merges.

**Long feedback loops.** If a bug is introduced on Monday and discovered on Friday when the weekly release is assembled, the developer has four days of new work in their head and has to context-switch back to understand a problem they don't remember creating. CI feedback is measured in minutes, not days.

**Deployment fear.** When deployments are rare and manual, every deployment is a high-stress event. Deployments are done at low-traffic times, by senior engineers, with rollback plans. CD makes deployments routine — something that happens dozens of times per day, automatically. Routine things lose their fear.

## The four DORA metrics

Google's DevOps Research and Assessment (DORA) program identified four metrics that together describe software delivery performance. Understanding them helps you evaluate any CI/CD system:

**Deployment frequency**: how often are you deploying to production? Elite performers deploy on-demand, multiple times per day. Low performers deploy monthly or less.

**Lead time for changes**: how long from "code committed" to "code running in production"? Elite performers: under one hour. Low performers: one to six months.

**Change failure rate**: what percentage of deployments cause an incident or require a rollback? Elite performers: 0-15%. Low performers: 46-60%.

**Time to restore service**: when something goes wrong, how long to restore service? Elite performers: under one hour. Low performers: one week to one month.

These four metrics are not independent. High deployment frequency enables fast lead times. Fast lead times mean changes are small and reversible, which reduces change failure rate and recovery time. The metrics compound.

## Trunk-based development

Most teams use some variant of feature branches: a developer creates a branch for each feature, works on it for a few days or weeks, then merges to main. This is familiar and feels organized.

Trunk-based development is the alternative: developers commit directly to main (or merge feature branches within one or two days). This approach is associated with high deployment frequency and low lead time.

The key principle: branches that live for more than a day start accumulating integration risk. Every day a feature branch diverges from main is a day of potential conflicts and unexpected interactions. Trunk-based development forces that integration to happen continuously, in small increments, rather than in one large collision at the end.

Feature branches that live for a day are fine. Feature branches that live for two weeks are expensive.

## The structure of a good pipeline

A production CI/CD pipeline typically has four stages:

**Build and test**: run all automated tests. This stage should be fast (under 10 minutes) and fail on any test failure. The faster this stage is, the faster you get feedback. A 45-minute test suite that fails 30 minutes in has already consumed 30 minutes of CI resources. Invest in test speed.

**Build artifact**: build the deployable artifact — the container image, the compiled binary, the packaged function code. Record the digest or checksum. This is the artifact that will be deployed; do not rebuild it in the deploy stage.

**Deploy to staging**: deploy the artifact to a staging environment. Run integration tests or smoke tests. Staging should be as close to production as possible — same infrastructure topology, same configuration structure, different data.

**Deploy to production**: deploy the artifact from staging to production. This is the same artifact that passed staging. In mature pipelines, this stage may include progressive rollout (canary or blue-green).

Each stage is a gate: failure at any stage halts the pipeline. The build stage running fast is important; you want developers to get feedback on failures before they start their next task.

## What makes a pipeline good vs bad

**A good pipeline**:
- Fails fast: if tests fail, the build does not proceed
- Promotes by artifact: the same image or binary that passed staging is deployed to production
- Is idempotent: running the same pipeline twice produces the same result
- Is observable: failures are visible and their cause is clear from the logs
- Has a clear rollback path: if the deployment goes wrong, reverting is a single action

**A bad pipeline**:
- Rebuilds the artifact in the deploy stage (the "works in CI, fails in prod" pipeline)
- Deploys to production without staging validation
- Has opaque failures that require reading 1000 lines of logs to understand
- Takes 45+ minutes end-to-end, making developers reluctant to run it
- Has no rollback mechanism — every failed deployment requires manual intervention

## GitHub Actions in this curriculum

GitHub Actions is the CI/CD platform used throughout this curriculum. It integrates natively with GitHub repositories, has a large ecosystem of pre-built actions, supports OIDC-based authentication to Azure (eliminating static credentials), and is free for public repositories.

Key concepts in GitHub Actions:

**Workflow**: a YAML file in `.github/workflows/` that defines one automated process. A workflow is triggered by an event (push, PR, schedule, manual dispatch) and runs one or more jobs.

**Job**: a unit of work that runs on a single runner (a virtual machine or container). Jobs in the same workflow can run in parallel or in sequence.

**Step**: a single command or action within a job. Steps run sequentially within a job.

**Action**: a reusable, packaged unit of automation. The `actions/checkout` action checks out your code; `azure/login` authenticates to Azure; `docker/build-push-action` builds and pushes a container image.

**Environment**: a deployment target (dev, staging, prod) that can have required reviewers, wait timers, and secrets scoped to that environment.

**OIDC**: instead of storing Azure credentials as GitHub secrets, use OpenID Connect to generate short-lived tokens. A federated credential in Azure AAD trusts tokens from GitHub Actions, scoped to specific workflows, branches, or environments.
