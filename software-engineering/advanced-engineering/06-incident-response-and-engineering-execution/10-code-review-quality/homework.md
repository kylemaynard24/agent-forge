# Homework — Code Review Quality

> Raise team quality by making review comments precise, useful, and trade-off aware.

## Exercise

Work through a small scenario involving a pull request where style comments are crowding out system-level concerns.

**Build:**
- one timeline or incident note
- one mitigation or response move
- one follow-up that reduces future confusion

**Constraints:**
- facts and hypotheses must be separated
- the first move may be mitigation rather than full repair
- one communication artifact must be readable by a non-expert

## Reflection

- What part of Code Review Quality felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Code Review Quality without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Expressive communication + actionable specificity

Code review comments are a form of communication code, and a comment that says "this is wrong" without explaining why or suggesting an alternative fails the same test as a vague function name — it forces the reader to do extra interpretive work to understand what is needed. A clean review comment names the failure scenario, explains why it matters, and suggests a path forward.

**Exercise:** Take the set of review comments from your scenario and apply this rule: every blocking comment must state what breaks, when it breaks, and what to do about it. Rewrite any comment that fails that test, and check whether any "system-level concern" comments were being buried under style comments that crowded them out.

**Reflection:** If the author of the PR could act on every comment without asking a single follow-up question, your comments passed the clarity test — which of your comments in this exercise would have required a follow-up, and why?
