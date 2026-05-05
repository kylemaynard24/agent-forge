# Homework — Rollback Strategy

> Know when reverting is safer than pushing forward with the fix.

## Exercise

Work through a small scenario involving a release that partially works but is actively hurting users.

**Build:**
- one timeline or incident note
- one mitigation or response move
- one follow-up that reduces future confusion

**Constraints:**
- facts and hypotheses must be separated
- the first move may be mitigation rather than full repair
- one communication artifact must be readable by a non-expert

## Reflection

- What part of Rollback Strategy felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Rollback Strategy without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names + blast radius visibility

Rollback procedures should be named for what they undo and their blast radius — `rollback_payment_service_v2.3.1` is safer than a generic `rollback` script because it makes the scope of the operation visible before it is run. A generic rollback script is dangerous for the same reason a function called `doTheThing` is dangerous: no reader can assess its impact without reading the implementation.

**Exercise:** Name the rollback procedure for your scenario so that it encodes the service, the version being reverted to, and a note on what side effects the rollback produces (e.g., pending transactions in the v2.3.1 schema will need manual reconciliation). Confirm the name is unambiguous enough that an on-call engineer could identify the correct procedure under pressure.

**Reflection:** If your system has three different rollback procedures for three different services, and an engineer is triaging an incident under time pressure, would the names alone make it obvious which one applies — or would they need to read each one to find out?
