# Homework — Severity Models

> Classify incidents by impact and urgency so the response matches reality.

## Exercise

Work through a small scenario involving an outage where every team member uses a different severity word.

**Build:**
- one timeline or incident note
- one mitigation or response move
- one follow-up that reduces future confusion

**Constraints:**
- facts and hypotheses must be separated
- the first move may be mitigation rather than full repair
- one communication artifact must be readable by a non-expert

## Reflection

- What part of Severity Models felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Severity Models without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names + unambiguous decision criteria

Severity level names should make the decision criteria unambiguous — "P1 = service is down for all users" is cleaner than "P1 = serious issue" because it removes the judgment call at the moment when cognitive load is highest. A severity definition that requires interpretation is a definition that will be applied inconsistently under pressure.

**Exercise:** Write your severity definitions so each one contains a measurable condition that two engineers reading it independently would apply to the same incident the same way. Then test your definitions against three concrete incidents — if two engineers disagree on the severity, the definition needs to be more specific.

**Reflection:** In the scenario where every team member used a different severity word, what was the underlying ambiguity — was it in the criteria, the names, or both?
