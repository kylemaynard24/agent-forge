# Homework — Postmortems

> Write incident analysis that improves systems rather than assigning blame.

## Exercise

Work through a small scenario involving a production issue likely to recur unless the learning is made explicit.

**Build:**
- one timeline or incident note
- one mitigation or response move
- one follow-up that reduces future confusion

**Constraints:**
- facts and hypotheses must be separated
- the first move may be mitigation rather than full repair
- one communication artifact must be readable by a non-expert

## Reflection

- What part of Postmortems felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Postmortems without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Precision in naming + actionable specificity

A postmortem that names contributing factors precisely enough that an engineer could fix them is the clean documentation standard for incident learning. "Insufficient monitoring" is not a contributing factor an engineer can act on; "no alert existed for p99 checkout latency exceeding 500ms" is, because it is specific enough to produce a ticket with a clear acceptance criterion.

**Exercise:** Take each contributing factor in your postmortem and apply this test: could you write a ticket from this factor with a clear title, a measurable acceptance criterion, and an obvious owner? If not, the factor is not specific enough — rewrite it until it passes that test.

**Reflection:** If you filed a follow-up ticket for each contributing factor in your postmortem, would the ticket titles be self-describing enough that the team would still understand the context six months from now — or would they need to re-read the postmortem to understand what the ticket is fixing?
