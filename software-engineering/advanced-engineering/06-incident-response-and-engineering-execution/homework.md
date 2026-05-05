# Homework — Incident Response and Engineering Execution

> Make the failure legible. Then make the response legible too.

## Exercise: Run an incident drill

**Scenario:** Your service has elevated errors, partial degradation, and confused internal communication. The task is not only to fix the issue. It is to handle the incident like an engineer others can rely on.

**Build:**
- A simple incident timeline
- A severity decision with rationale
- One mitigation step
- One status update for stakeholders
- One postmortem with concrete follow-ups

**Constraints:**
- You must separate confirmed facts from current hypotheses
- The first mitigation may reduce scope instead of fully fixing the issue
- The postmortem must include at least one detection improvement and one prevention improvement
- No blame language

## Stretch

Add a short ADR or design note for the highest-leverage follow-up and explain why it beats the other candidates.

## Reflection

- What did users need to know before engineers knew everything?
- What signal should have alerted earlier?
- Which follow-up reduces future blast radius the most?

## Done when

- [ ] Your incident note is readable by someone outside the team
- [ ] Facts and guesses are clearly separated
- [ ] The postmortem results in at least two specific next actions

---

## Clean Code Lens

**Principle in focus:** Expressive writing + single responsibility per artifact

Engineering execution documents — runbooks, ADRs, design docs — are code for humans, and the same clean code principles apply: each document should have one clear purpose, every section should earn its place, and the names of things (alerts, severity levels, follow-up actions) should be specific enough to be actionable without additional explanation.

**Exercise:** Take one artifact from your incident drill — the timeline, the status update, or the postmortem — and apply a clean code review to it: flag every vague term, every section that tries to do two things, and every action item that cannot be assigned to a specific person with a specific outcome. Revise until each sentence says exactly one thing clearly.

**Reflection:** If an engineer who was not involved in the incident read your documents, could they understand the situation, the decisions made, and the next actions without asking a single clarifying question?
