# Homework — Triage Loops

> Move repeatedly through detect, assess, act, and reassess without freezing.

## Exercise

Work through a small scenario involving an incident with several plausible failure domains.

**Build:**
- one timeline or incident note
- one mitigation or response move
- one follow-up that reduces future confusion

**Constraints:**
- facts and hypotheses must be separated
- the first move may be mitigation rather than full repair
- one communication artifact must be readable by a non-expert

## Reflection

- What part of Triage Loops felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Triage Loops without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Expressive documentation + preserving reasoning

Triage decisions should be recorded with their reasoning, not just their conclusion — "rolled back" without "because error rate went from 0.1% to 4.2% within 2 minutes of deploy" loses the signal that justified the decision. A timeline entry that records only actions is like code without comments in the worst possible place: the most critical moments of a system's history.

**Exercise:** Take the incident timeline from your scenario and audit each entry. For every decision or action, confirm that the entry records the metric or observation that triggered it. Rewrite any entry that records only what happened without recording why the decision was made at that moment.

**Reflection:** If someone reads your triage timeline a year from now during a similar incident, will they be able to reconstruct not just what you did but why you did it in that sequence — and would that reasoning help or mislead them?
