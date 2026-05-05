# Homework — Stakeholder Updates

> Communicate status clearly to people who need truth, not implementation detail.

## Exercise

Work through a small scenario involving an incident affecting customers, support, and leadership differently.

**Build:**
- one timeline or incident note
- one mitigation or response move
- one follow-up that reduces future confusion

**Constraints:**
- facts and hypotheses must be separated
- the first move may be mitigation rather than full repair
- one communication artifact must be readable by a non-expert

## Reflection

- What part of Stakeholder Updates felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Stakeholder Updates without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Consistent structure + single level of abstraction

Incident status updates are communication code, and like code they benefit from a consistent structure every reader can internalize. An update with a timestamp, current status, next action, and ETA — the same four fields every time — is to stakeholder communication what a well-structured function is to code: predictable, scannable, and trustworthy because it does not surprise the reader.

**Exercise:** Write three status updates for the same incident at different points in time — initial notification, mid-incident update, and resolution — using a strict template (timestamp, status, what is being done, next update ETA). Then check: are all three written at the same level of abstraction (user impact), or do any of them accidentally shift to implementation details?

**Reflection:** If a recipient reads your update and their first question is "but what does that mean for me?" — what was missing from the update's structure that would have answered that question without needing to ask?
