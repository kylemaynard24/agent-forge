# Homework — SSRF

> Treat server-side fetch capabilities as a trust boundary, not a convenience.

## Exercise

Work through a small scenario involving a feature that fetches remote URLs on behalf of users.

**Build:**
- a named trust boundary
- one protective control
- a note on residual risk

**Constraints:**
- you must distinguish what is trusted from what is merely present
- you must state one accepted risk explicitly
- the control has to match the boundary, not just the feature

## Reflection

- What part of SSRF felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of SSRF without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names + making implicit constraints explicit

SSRF mitigations are security constraints, and a constraint that lives as an unnamed regex buried in middleware is an invisible dependency — no reader knows it exists until it breaks. Naming the allowlist or blocklist explicitly (`ALLOWED_FETCH_DOMAINS`, `isPermittedExternalUrl`) makes the security boundary a first-class concept that can be reviewed, tested, and changed deliberately.

**Exercise:** Extract the URL-validation logic from your scenario into a named function or named constant whose name makes the security intent clear. Write a one-line comment stating what the allowlist is protecting against, so the constraint is self-documenting.

**Reflection:** If a developer adds a new fetch target and the allowlist rejects it, will they understand from the code itself why it was rejected and what they need to change — or will they have to hunt for the constraint?
