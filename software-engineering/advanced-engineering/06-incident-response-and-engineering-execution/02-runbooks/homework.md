# Homework — Runbooks

> Capture the first useful response steps before the next stressful hour arrives.

## Exercise

Work through a small scenario involving a recurring failure that is always re-diagnosed from scratch.

**Build:**
- one timeline or incident note
- one mitigation or response move
- one follow-up that reduces future confusion

**Constraints:**
- facts and hypotheses must be separated
- the first move may be mitigation rather than full repair
- one communication artifact must be readable by a non-expert

## Reflection

- What part of Runbooks felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Runbooks without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Single responsibility + imperative, atomic steps

Runbook steps should be atomic and named as commands rather than descriptions. "Run: az containerapp update --name api --min-replicas 0" is cleaner than "Update the container app to scale down" because it removes all interpretation — the reader executes one specific command and observes one specific outcome. A step that requires judgment is a step that will be performed differently in each incident.

**Exercise:** Review the runbook steps in your scenario and rewrite any that contain the words "configure," "update," or "adjust" without a specific command. Each step should be executable by an on-call engineer who has never seen the service before, at 2am, with no additional context.

**Reflection:** If a step in your runbook says "restart the service if needed" — who decides if it is needed, and what happens when two engineers on the same incident make different calls?
