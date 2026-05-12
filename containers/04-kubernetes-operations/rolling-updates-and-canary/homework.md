# Homework — Rolling Updates and Canary Deployments

> The last release took the API down for 45 seconds. Nobody noticed in dev. Everybody noticed in production. You are now responsible for making sure it never happens again.

## Exercise: Safe Deployment Pipeline

**Scenario:** You are deploying a web app that has gone through several painful incidents: a bad deploy took all pods offline at once, and a node drain during a weekend maintenance window evicted all replicas simultaneously. Your job is to implement a deployment strategy that makes both of those impossible.

**Build:**
1. Deploy `v1` of the app (use `nginx:1.24`) with 3 replicas, `maxSurge: 1`, `maxUnavailable: 0`, and `minReadySeconds: 15`
2. Apply a PodDisruptionBudget with `minAvailable: 2`
3. Roll out `v2` (use `nginx:1.25`) via `kubectl set image` and watch `kubectl rollout status` — confirm it completes without dropping below 3 running pods at any point
4. Implement a canary: deploy a second Deployment (`my-app-canary`) with 1 replica that shares the same Service selector — verify 4 pods total in `kubectl get endpoints`
5. Graduate the canary to 100%: scale `my-app-canary` to 3 replicas, scale down the stable `my-app` to 0, then update `my-app`'s image to v2 and scale back to 3, then delete the canary Deployment

**Constraints:**
- Do not use Recreate strategy — justify the choice of RollingUpdate in a comment in your YAML
- `minReadySeconds` must be set and documented — explain what a crash-loop scenario this protects against
- The PDB must be in place before step 3 — verify it is enforced by checking `kubectl get pdb`
- Record pod counts at each stage of the canary graduation in `observations.md` — show the ratio at every step

## Stretch 1

Automate canary promotion based on error rate. Write a bash script that:
1. Watches the canary pod's access logs (`kubectl logs -f`) for HTTP 5xx responses
2. If error rate stays below 2% for 60 seconds, automatically patches the stable Deployment's image and scales down the canary
3. If error rate exceeds 2%, scales the canary to 0 and prints a rollback message

This is a simplified version of what tools like Argo Rollouts do automatically.

## Stretch 2

Demonstrate the Recreate strategy and when it is the right choice. Deploy a stateful app (use any image) with `strategy.type: Recreate`. Trigger an update and show the gap where zero pods are running. Document the scenario where this is preferable to RollingUpdate (hint: breaking database schema migrations).

## Reflection

- If `maxUnavailable: 0` and `maxSurge: 0` are both set, what happens? Why does Kubernetes reject this combination?
- A colleague wants to set `minAvailable: 100%` on the PDB "to be safe." What is the consequence of this setting during a rolling update?
- You have 4 replicas and a PDB with `minAvailable: 3`. What is the maximum number of pods the rolling update will bring down at once? Walk through the math.

## Done when

- [ ] `kubectl rollout status` completes without errors for the v1 → v2 rolling update
- [ ] Pod count never drops below 3 during the rolling update (verified from `kubectl get pods -w` output)
- [ ] PDB shows `DISRUPTIONS ALLOWED: 1` for a 3-replica Deployment with `minAvailable: 2`
- [ ] Canary pod is visible in `kubectl get endpoints`
- [ ] Canary graduation is documented step-by-step in `observations.md`
- [ ] `kubectl rollout undo` successfully reverts to the previous version

---

## Clean Code Lens

**Principle in focus:** Open/Closed Principle

A Deployment's rolling update strategy is the infrastructure equivalent of the Open/Closed Principle: it is open for extension (you can change the image, the replica count, the env vars) but closed for modification in a way that breaks existing behavior (you cannot accidentally take all pods offline because the strategy prevents it).

The PodDisruptionBudget takes this further. It is a policy layer — a rule that says "the behavior of disruption is governed by this invariant, regardless of who is doing the disrupting." Whether the disruptor is a node drain, a rolling update, or an HPA scale-down, the PDB enforces the same contract. This is the infrastructure equivalent of an interface: callers must honor the contract.

**Exercise:** Review the Deployment strategy and PDB settings for a production service (or this exercise's YAML). Write a one-paragraph policy statement that describes the invariants this configuration enforces. Then check: are there any deployment paths (manual kubectl patch, CI/CD pipeline) that bypass these invariants? If so, how would you close those gaps?

**Reflection:** The Open/Closed Principle says behavior should be extendable without modification. In Kubernetes terms, what does "modification" mean for a live Deployment? What are the risks of patching a running Deployment's `spec.selector`, and why does Kubernetes prevent it?
