# Progressive Delivery

Progressive delivery is the practice of releasing changes to a subset of users or traffic before releasing to everyone. Instead of deploying to 100% of traffic immediately, you deploy to 1%, then 10%, then 50%, then 100% — watching signals at each step and deciding whether to advance, pause, or roll back.

The insight behind progressive delivery: most production failures are visible in the metrics within minutes of a deployment. If you are watching, you can catch them before they affect most of your users.

## Why it matters

Every deployment is a bet that the change is correct. Sometimes the bet is wrong. A bug that passed all tests and all reviewers makes it to production and starts causing failures. Without progressive delivery, that failure affects 100% of your users immediately. With progressive delivery, it affects 1% and you catch it in 5 minutes.

The cost of a mistake is reduced from "everyone is broken" to "a small percentage of requests failed for a few minutes and nobody noticed." The rollback is repointing traffic, which takes seconds.

This is not just about risk mitigation — it changes your deployment culture. When deployments can be rolled back instantly and only affect a small percentage of traffic initially, the fear attached to deploying decreases. Lower deployment fear → higher deployment frequency → smaller change sizes → lower risk. The benefits compound.

## The three patterns

### Blue-green deployment

You maintain two identical production environments: "blue" (current) and "green" (new). When deploying a new version, you deploy to the green environment while blue is still serving traffic. Once green is validated, you switch all traffic from blue to green instantly.

**Advantages**: instant cutover, instant rollback (just switch back to blue), no mixed-version traffic.

**Disadvantages**: double the infrastructure cost (two identical environments must run simultaneously), database schema changes are complicated (both environments share a database during the transition), traffic split is all-or-nothing.

**Use when**: you need instant, clean cutover. Your change is high-risk and you want a full parallel environment as a safety net.

### Canary deployment

You deploy the new version to a small subset of your infrastructure and route a small percentage of traffic to it. If metrics look good, you gradually increase the percentage until you reach 100%.

The name comes from the mining practice of using canaries to detect toxic gases — the canary (a small slice of traffic) detects problems before they affect everyone.

**Advantages**: fine-grained risk control, real production traffic validates the change, gradual confidence building.

**Disadvantages**: complexity in traffic routing, requires careful metrics to decide when to advance, mixed-version traffic can cause issues if the versions are not compatible.

**Use when**: you want to validate changes with real traffic before full rollout. The default for most production changes.

### Feature flags

Feature flags are toggles that control whether a code path is active, independent of the deployment. You deploy code with the new feature behind a flag. The flag is off. You turn it on for 1% of users. You turn it on for everyone when validated.

**Advantages**: complete separation of deployment and release, instant rollback without redeployment, enables A/B testing, works across multiple deployments.

**Disadvantages**: flag debt accumulates (old flags that should be removed but aren't), code complexity (flag conditions throughout the codebase), requires a flag management system.

**Use when**: you want to control feature exposure separately from deployment. Essential for large features that require multiple deployments to complete.

## Deciding when to advance

Canary deployments require a decision: when have you seen enough to advance the rollout? The decision criteria should be explicit and quantitative, not "it feels fine."

Common criteria:

**Error rate**: the error rate on canary traffic should not be significantly higher than baseline. Define "significantly" before the deployment — 2x? 1.5x? — and hold to it.

**Latency**: p95 and p99 latency on canary traffic should not degrade beyond a defined threshold.

**Business metrics**: for critical user flows (checkout, signup, payment), track conversion rates or completion rates in addition to technical metrics. A deployment can look fine technically but be silently breaking a business flow.

**Time window**: even if metrics look good immediately, wait a defined time window (5-15 minutes) before advancing. Some failures only manifest after brief warmup periods.

The advance criteria should be the same as the rollback criteria: if the metrics that would trigger a rollback are not breached, it is safe to advance.

## Azure implementation

**Container Apps revisions** are the native Azure mechanism for canary deployments. Each new deployment creates a new revision. You can configure traffic weights between revisions: `revision-a: 90%, revision-b: 10%`. Azure automatically routes traffic accordingly.

**Azure Front Door** provides canary and blue-green routing at the edge layer. You configure multiple origin groups with weight percentages. Front Door routes requests based on those weights before they reach your compute resources.

**Application Service deployment slots** provide blue-green deployment for App Service. You deploy to a staging slot, validate, and swap slots (which is near-instant and swaps all traffic at once).

## The rollback path

Every progressive delivery strategy should have a documented, tested rollback path. The rollback should be:

**Fast**: ideally a single command or button click. The time to rollback is part of your recovery time objective.

**Independently executable**: the person rolling back should not need to understand the deployment to execute the rollback. The runbook should be clear enough that any on-call engineer can follow it at 3am.

**Tested**: don't discover your rollback doesn't work during an incident. Test it in staging periodically.

For canary deployments: rollback is setting the canary traffic weight to 0% and the previous revision to 100%.

For blue-green: rollback is pointing traffic back to the blue environment.

For feature flags: rollback is setting the flag to off.
