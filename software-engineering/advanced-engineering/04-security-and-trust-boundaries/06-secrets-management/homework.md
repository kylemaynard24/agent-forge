# Homework — Secrets Management

> Control where secrets live, how they rotate, and who can reach them.

## Exercise

Work through a small scenario involving a service account key copied across environments and scripts.

**Build:**
- a named trust boundary
- one protective control
- a note on residual risk

**Constraints:**
- you must distinguish what is trusted from what is merely present
- you must state one accepted risk explicitly
- the control has to match the boundary, not just the feature

## Reflection

- What part of Secrets Management felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Secrets Management without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names + avoiding accidental logging

Secret variable names should make clear they hold secrets — a variable named `token` could be anything, but `stripeApiSecretKey` signals both its purpose and its sensitivity so reviewers know not to log it. Config that looks like ordinary data is the most common source of accidental credential leakage because nothing in the name signals that it must be handled differently.

**Exercise:** Audit the variable names in your scenario's secret-handling code. Rename any that could be mistaken for non-secret data, and add a single naming convention note (e.g., all secret variables use the suffix `SecretKey` or `Credential`) that would make future accidental logging visible in a code review.

**Reflection:** If a developer adds a new logging statement that serializes a config object, would the variable names in that object be enough to make it obvious a secret is about to be logged?
