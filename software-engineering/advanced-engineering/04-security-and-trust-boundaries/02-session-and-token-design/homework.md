# Homework — Session and Token Design

> Understand what state lives server-side, client-side, and how revocation really works.

## Exercise

Work through a small scenario involving an app moving from cookies to tokens without a threat review.

**Build:**
- a named trust boundary
- one protective control
- a note on residual risk

**Constraints:**
- you must distinguish what is trusted from what is merely present
- you must state one accepted risk explicitly
- the control has to match the boundary, not just the feature

## Reflection

- What part of Session and Token Design felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Session and Token Design without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names

Token field names and cookie names are a security contract between systems; an ambiguous name like `token` leaves every consumer to infer whether it is a session cookie, an access token, or a refresh token. A name like `accessToken` or `sessionCookie` removes that ambiguity and makes incorrect handling visible at the call site before it becomes a vulnerability.

**Exercise:** Audit the variable and field names in your scenario's token-handling code. Rename any that use generic terms (`token`, `auth`, `key`) so the type and lifetime of the credential are encoded in the name itself.

**Reflection:** If a consumer misuses a token — say, stores a refresh token where an access token is expected — would the variable names have been a clue or would they have hidden the mistake?
