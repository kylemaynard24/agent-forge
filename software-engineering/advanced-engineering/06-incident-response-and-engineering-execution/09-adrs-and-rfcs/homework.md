# Homework — ADRs and RFCs

> Use lightweight writing to align engineering decisions before complexity compounds.

## Exercise

Work through a small scenario involving a system change that has more than one reasonable design path.

**Build:**
- one timeline or incident note
- one mitigation or response move
- one follow-up that reduces future confusion

**Constraints:**
- facts and hypotheses must be separated
- the first move may be mitigation rather than full repair
- one communication artifact must be readable by a non-expert

## Reflection

- What part of ADRs and RFCs felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of ADRs and RFCs without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Unambiguous decision statements + intention-revealing documentation

ADRs are clean code for decisions: the decision statement should be specific enough that there is no ambiguity about what was decided, what was rejected, and under what conditions the decision should be revisited. "We will use a message queue" is less clean than "We will use Azure Service Bus for async order processing because the synchronous HTTP approach cannot tolerate the 3s p99 latency of the downstream inventory service."

**Exercise:** Take the decision statement in your ADR and apply this test: could two engineers read it and independently summarize the same decision, the same alternative that was rejected, and the same condition that would trigger a revisit? If not, add the missing specificity until they could.

**Reflection:** If this ADR is read two years from now by an engineer considering a change, will the decision statement tell them not just what was decided but what context made that decision correct — so they can judge whether that context still holds?
