# Homework — Degraded Mode Design

> Keep the system partially useful when full functionality is too expensive to preserve.

## Exercise

Work through a small scenario involving a dependency outage where failing closed would be worse than partial service.

**Build:**
- one timeline or incident note
- one mitigation or response move
- one follow-up that reduces future confusion

**Constraints:**
- facts and hypotheses must be separated
- the first move may be mitigation rather than full repair
- one communication artifact must be readable by a non-expert

## Reflection

- What part of Degraded Mode Design felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Degraded Mode Design without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names + user-visible impact clarity

Degraded mode names should describe what capability is reduced, not just that the system is degraded. `checkout_without_recommendations` tells an on-call engineer and a support team what users can and cannot do; `checkout_degraded` tells them nothing except that something is wrong. The name is an operational contract that must be readable under stress.

**Exercise:** Name the degraded mode in your scenario so it describes the specific capability that is unavailable. Then write a two-sentence user-facing message and a two-sentence internal status message that each follow directly from that name — if the name is right, both messages should be easy to write.

**Reflection:** If a support engineer received a ticket saying "I'm in degraded mode," would the name of the mode give them enough information to know what the user can and cannot do — or would they need to read a runbook first?
